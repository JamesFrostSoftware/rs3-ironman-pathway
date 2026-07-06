/**
 * Cursor Cloud Agents proxy — keeps CURSOR_API_KEY server-side only.
 * Uses no-repo agents so answers do not touch the pathway repository.
 */

import { existsSync, readFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const CURSOR_API = 'https://api.cursor.com';
const MODEL_ID = 'composer-2.5';
const RUN_POLL_MS = 1500;
const RUN_POLL_MAX_MS = 120_000;
const rateBuckets = new Map();
const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');

function loadEnv() {
  for (const name of ['.env.local', '.env']) {
    const path = resolve(ROOT, name);
    if (!existsSync(path)) continue;
    for (const line of readFileSync(path, 'utf8').split('\n')) {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith('#')) continue;
      const eq = trimmed.indexOf('=');
      if (eq <= 0) continue;
      const key = trimmed.slice(0, eq).trim();
      let val = trimmed.slice(eq + 1).trim();
      if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) {
        val = val.slice(1, -1);
      }
      if (process.env[key] == null) process.env[key] = val;
    }
  }
}

loadEnv();

export function getConfig() {
  const apiKey = process.env.CURSOR_API_KEY?.trim();
  const proxyToken = process.env.AGENT_PROXY_TOKEN?.trim() || '';
  const origins = (process.env.ALLOWED_ORIGINS || 'http://localhost:3000,http://127.0.0.1:3000')
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean);
  return { apiKey, proxyToken, origins, modelId: MODEL_ID };
}

function authHeader(apiKey) {
  const token = Buffer.from(`${apiKey}:`, 'utf8').toString('base64');
  return `Basic ${token}`;
}

function checkProxyAuth(req, proxyToken) {
  if (!proxyToken) return true;
  const header = req.headers.authorization || '';
  const match = header.match(/^Bearer\s+(.+)$/i);
  return match && match[1] === proxyToken;
}

function checkRateLimit(ip) {
  const windowMs = 60_000;
  const max = 20;
  const now = Date.now();
  const bucket = rateBuckets.get(ip) || { count: 0, reset: now + windowMs };
  if (now > bucket.reset) {
    bucket.count = 0;
    bucket.reset = now + windowMs;
  }
  bucket.count += 1;
  rateBuckets.set(ip, bucket);
  return bucket.count <= max;
}

export function corsHeaders(origin, allowed) {
  const ok = !origin || allowed.includes('*') || allowed.includes(origin);
  return {
    'Access-Control-Allow-Origin': ok ? origin || allowed[0] || '*' : allowed[0] || '',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    'Access-Control-Max-Age': '86400',
  };
}

function sleep(ms) {
  return new Promise((resolveSleep) => setTimeout(resolveSleep, ms));
}

function formatStreamError(data) {
  const code = data?.code || '';
  const message = data?.message || '';
  if (message && code) return `${message} (${code})`;
  if (message) return message;
  if (code) return String(code).replace(/_/g, ' ');
  return 'Agent stream failed';
}

function isStaleAgentError(err) {
  const msg = String(err?.message || err || '').toLowerCase();
  return (
    msg.includes('404') ||
    msg.includes('409') ||
    msg.includes('agent_busy') ||
    msg.includes('not found') ||
    msg.includes('run_stream') ||
    msg.includes('stream failed') ||
    msg.includes('stream_expired')
  );
}

function buildSystemPrompt(context = {}) {
  const lines = [
    'You are the RS3 Efficient Ironman Pathway assistant (Composer 2.5).',
    'Answer questions about the pathway guide, quests, training, gear, PoF, PvM unlocks, and ironman efficiency.',
    'You must NOT modify, edit, or suggest changes to the user\'s tracker checklists unless they explicitly ask for guide updates.',
    '',
    'Q&A MODE (critical):',
    '- Reply with markdown text only.',
    '- Do NOT use tools (no read_file, terminal, MCP, or repo access). There is no codebase attached.',
    '',
    'FORMATTING (the chat renders rich markdown — use it):',
    '- Use **markdown tables** for requirements, gear comparisons, XP rates, and step lists. Never draw ASCII/text tables.',
    '- Example table:',
    '  | Item | Level | Source |',
    '  | --- | --- | --- |',
    '  | Dragon scimitar | 60 Attack | Monkey Madness |',
    '- Use ## / ### headings, bullet lists, numbered steps, **bold** for key levels/items, and > blockquotes for tips.',
    '- Use inline `code` for item names and short values.',
    '',
    'RESPONSE RULES (critical):',
    '1. Before answering, silently consider the player\'s full skill levels and quest progress below.',
    '2. Do NOT recommend quests, training goals, gear, bosses, or activities they cannot do yet with their current stats.',
    '3. If something is locked, say what they have vs what is needed — do not list it as a current option.',
    '4. Prefer the next sensible step on their pathway when relevant.',
    '5. Output ONE polished final answer only — no draft, no "let me think", no reasoning preamble.',
    '6. Prefer RuneScape Wiki facts; say when uncertain.',
  ];

  if (context.rsn) {
    lines.push('', `## Player: ${context.rsn} (${context.gameMode || 'ironman'})`);
  }
  if (context.combatLevel) lines.push(`Combat: ${context.combatLevel}`);
  if (context.totalLevel) lines.push(`Total level: ${context.totalLevel}`);
  if (context.questPoints != null) lines.push(`Quest points: ${context.questPoints}`);
  else if (context.questSyncAvailable === false) {
    lines.push('Quest points: unknown (RuneMetrics profile not public)');
  }
  if (context.questsComplete != null) lines.push(`Quests completed (synced): ${context.questsComplete}`);
  if (context.nextStep) lines.push(`Pathway next step: ${context.nextStep}`);

  if (context.skillsList) {
    lines.push('', '## All skill levels (hard caps — do not suggest content above these)');
    lines.push(context.skillsList);
  }

  return lines.join('\n');
}

function wrapUserMessage(message, context = {}) {
  const reminder = [
    'Remember: text-only Q&A — no tools. Only suggest what this account can do now. Use markdown tables (not ASCII tables) for comparisons.',
    context.nextStep ? `They are on pathway: ${context.nextStep}` : '',
  ]
    .filter(Boolean)
    .join(' ');

  return `${reminder}\n\nUser question:\n${message}`;
}

async function cursorFetch(path, { apiKey, method = 'GET', body }) {
  const res = await fetch(`${CURSOR_API}${path}`, {
    method,
    headers: {
      Authorization: authHeader(apiKey),
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
    body: body ? JSON.stringify(body) : undefined,
  });
  const text = await res.text();
  let data = null;
  try {
    data = text ? JSON.parse(text) : null;
  } catch {
    data = { raw: text };
  }
  if (!res.ok) {
    const msg = data?.message || data?.error || text || res.statusText;
    throw new Error(`Cursor API ${res.status}: ${msg}`);
  }
  return data;
}

async function cancelActiveRun({ apiKey, agentId }) {
  try {
    await cursorFetch(`/v1/agents/${agentId}/runs/cancel`, { apiKey, method: 'POST' });
  } catch {
    // Ignore — run may already be terminal.
  }
}

async function createFreshAgent({ apiKey, message, context }) {
  const wrapped = `${buildSystemPrompt(context)}\n\n---\n\n${wrapUserMessage(message, context)}`;
  const data = await cursorFetch('/v1/agents', {
    apiKey,
    method: 'POST',
    body: {
      name: 'RS3 Pathway Q&A',
      model: { id: MODEL_ID },
      prompt: { text: wrapped },
    },
  });
  return { agentId: data.agent.id, runId: data.run.id, freshSession: true };
}

async function continueAgentRun({ apiKey, agentId, message, context }) {
  const data = await cursorFetch(`/v1/agents/${agentId}/runs`, {
    apiKey,
    method: 'POST',
    body: { prompt: { text: wrapUserMessage(message, context) } },
  });
  return { agentId, runId: data.run.id, freshSession: false };
}

async function startAgentRun({ apiKey, message, agentId, context, forceNew = false }) {
  if (agentId && !forceNew) {
    try {
      return await continueAgentRun({ apiKey, agentId, message, context });
    } catch (err) {
      if (!isStaleAgentError(err)) throw err;
      if (String(err.message).includes('409')) {
        await cancelActiveRun({ apiKey, agentId });
        try {
          return await continueAgentRun({ apiKey, agentId, message, context });
        } catch (retryErr) {
          if (!isStaleAgentError(retryErr)) throw retryErr;
        }
      }
    }
  }
  return createFreshAgent({ apiKey, message, context });
}

function parseSseChunk(buffer, onEvent) {
  const parts = buffer.split('\n\n');
  const rest = parts.pop() || '';
  for (const block of parts) {
    if (!block.trim()) continue;
    let event = 'message';
    let data = '';
    for (const line of block.split('\n')) {
      if (line.startsWith('event:')) event = line.slice(6).trim();
      else if (line.startsWith('data:')) data += line.slice(5).trim();
    }
    if (data) {
      try {
        onEvent(event, JSON.parse(data));
      } catch {
        onEvent(event, { raw: data });
      }
    }
  }
  return rest;
}

async function pollRunResult({ apiKey, agentId, runId }) {
  const deadline = Date.now() + RUN_POLL_MAX_MS;
  while (Date.now() < deadline) {
    const run = await cursorFetch(`/v1/agents/${agentId}/runs/${runId}`, { apiKey });
    if (run.status === 'FINISHED') {
      return { ok: true, text: run.result || '' };
    }
    if (['ERROR', 'CANCELLED', 'EXPIRED'].includes(run.status)) {
      return { ok: false, status: run.status, text: run.result || '' };
    }
    await sleep(RUN_POLL_MS);
  }
  return { ok: false, status: 'TIMEOUT', text: '' };
}

async function collectRunFromStream({ apiKey, agentId, runId }) {
  const upstream = await fetch(`${CURSOR_API}/v1/agents/${agentId}/runs/${runId}/stream`, {
    headers: {
      Authorization: authHeader(apiKey),
      Accept: 'text/event-stream',
    },
  });

  if (!upstream.ok) {
    const errText = await upstream.text();
    throw new Error(`Stream failed ${upstream.status}: ${errText}`);
  }

  const reader = upstream.body.getReader();
  const decoder = new TextDecoder();
  let buffer = '';
  let streamedText = '';
  let finalText = null;
  let finalStatus = null;
  let streamError = null;

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    buffer += decoder.decode(value, { stream: true });
    buffer = parseSseChunk(buffer, (event, data) => {
      if (event === 'assistant' && data.text) {
        streamedText += data.text;
      } else if (event === 'interaction_update' && data.subtype === 'text-delta' && data.text) {
        streamedText += data.text;
      } else if (event === 'result') {
        finalStatus = data.status || null;
        if (data.text) finalText = data.text;
      } else if (event === 'error') {
        streamError = data;
      }
    });
  }

  if (finalText) {
    return { ok: true, text: finalText, status: finalStatus || 'FINISHED' };
  }
  if (streamedText.trim()) {
    return { ok: true, text: streamedText.trim(), status: finalStatus || 'FINISHED' };
  }

  const polled = await pollRunResult({ apiKey, agentId, runId });
  if (polled.ok && polled.text) {
    return { ok: true, text: polled.text, status: 'FINISHED' };
  }

  if (streamError) {
    return {
      ok: false,
      text: '',
      status: finalStatus || polled.status || 'ERROR',
      error: formatStreamError(streamError),
      clearSession: true,
    };
  }

  if (polled.text) {
    return { ok: true, text: polled.text, status: 'FINISHED' };
  }

  return {
    ok: false,
    text: '',
    status: polled.status || 'ERROR',
    error: polled.status === 'TIMEOUT'
      ? 'Agent timed out — try again or start a new chat (↺).'
      : 'Agent run failed — try again or start a new chat (↺).',
    clearSession: true,
  };
}

function writeSseChatResponse(res, cors, { agentId, runId, freshSession, outcome }) {
  res.writeHead(200, {
    ...cors,
    'Content-Type': 'text/event-stream; charset=utf-8',
    'Cache-Control': 'no-cache',
    Connection: 'keep-alive',
  });
  res.write(`event: meta\ndata: ${JSON.stringify({ agentId, runId, freshSession })}\n\n`);

  if (outcome.ok && outcome.text) {
    res.write(`event: result\ndata: ${JSON.stringify({ text: outcome.text, status: outcome.status || 'FINISHED' })}\n\n`);
    res.write(`event: done\ndata: {}\n\n`);
    res.end();
    return;
  }

  res.write(
    `event: error\ndata: ${JSON.stringify({
      message: outcome.error || 'Agent run failed',
      clearSession: Boolean(outcome.clearSession),
    })}\n\n`
  );
  res.end();
}

async function runAgentChat({ apiKey, message, agentId, context }) {
  let lastError = 'Agent request failed';
  let sessionAgentId = agentId || null;

  for (let attempt = 0; attempt < 2; attempt++) {
    const forceNew = attempt === 1;
    try {
      const started = await startAgentRun({
        apiKey,
        message,
        agentId: forceNew ? null : sessionAgentId,
        context,
        forceNew,
      });
      const outcome = await collectRunFromStream({
        apiKey,
        agentId: started.agentId,
        runId: started.runId,
      });
      if (outcome.ok) {
        return { started, outcome };
      }
      lastError = outcome.error || lastError;
      if (attempt === 0 && sessionAgentId) {
        sessionAgentId = null;
        continue;
      }
      return { started, outcome };
    } catch (err) {
      lastError = err.message || lastError;
      if (attempt === 0 && (sessionAgentId || isStaleAgentError(err))) {
        sessionAgentId = null;
        continue;
      }
      throw err;
    }
  }

  throw new Error(lastError);
}

export async function handleAgentRequest(req, res, { pathname, origin }) {
  const config = getConfig();
  const cors = corsHeaders(origin, config.origins);

  if (req.method === 'OPTIONS') {
    res.writeHead(204, cors);
    res.end();
    return true;
  }

  if (pathname === '/api/agent/health' && req.method === 'GET') {
    res.writeHead(200, { ...cors, 'Content-Type': 'application/json' });
    res.end(
      JSON.stringify({
        ok: Boolean(config.apiKey),
        model: MODEL_ID,
        authRequired: Boolean(config.proxyToken),
      })
    );
    return true;
  }

  if (pathname === '/api/agent/chat' && req.method === 'POST') {
    if (!config.apiKey) {
      res.writeHead(503, { ...cors, 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: 'CURSOR_API_KEY not configured on server' }));
      return true;
    }
    if (!checkProxyAuth(req, config.proxyToken)) {
      res.writeHead(401, { ...cors, 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: 'Invalid proxy token' }));
      return true;
    }
    const ip = req.socket.remoteAddress || 'unknown';
    if (!checkRateLimit(ip)) {
      res.writeHead(429, { ...cors, 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: 'Rate limit exceeded' }));
      return true;
    }

    let body = '';
    for await (const chunk of req) body += chunk;
    let payload;
    try {
      payload = JSON.parse(body || '{}');
    } catch {
      res.writeHead(400, { ...cors, 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: 'Invalid JSON body' }));
      return true;
    }

    const message = String(payload.message || '').trim();
    if (!message) {
      res.writeHead(400, { ...cors, 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: 'message is required' }));
      return true;
    }

    try {
      const { started, outcome } = await runAgentChat({
        apiKey: config.apiKey,
        message,
        agentId: payload.agentId || null,
        context: payload.context || {},
      });
      writeSseChatResponse(res, cors, {
        agentId: started.agentId,
        runId: started.runId,
        freshSession: started.freshSession,
        outcome,
      });
    } catch (err) {
      if (!res.headersSent) {
        res.writeHead(502, { ...cors, 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: err.message || 'Agent request failed', clearSession: true }));
      } else {
        res.write(
          `event: error\ndata: ${JSON.stringify({ message: err.message, clearSession: true })}\n\n`
        );
        res.end();
      }
    }
    return true;
  }

  return false;
}
