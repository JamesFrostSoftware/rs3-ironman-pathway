/**
 * Agent chat — server proxy only; never stores Cursor API keys.
 */

import { renderMarkdown } from './agent-markdown.js';

const STORAGE = {
  proxyUrl: 'rs3-agent-proxy-url',
  proxyToken: 'rs3-agent-proxy-token',
  agentId: 'rs3-agent-session-id',
  layout: 'rs3-agent-chat-layout',
};

const PANEL_MIN_W = 300;
const PANEL_MIN_H = 280;
const PANEL_MARGIN = 12;

export function getAgentSettings() {
  return {
    proxyUrl: localStorage.getItem(STORAGE.proxyUrl) || '',
    proxyToken: sessionStorage.getItem(STORAGE.proxyToken) || '',
    agentId: sessionStorage.getItem(STORAGE.agentId) || '',
  };
}

export function saveAgentSettings({ proxyUrl, proxyToken }) {
  if (proxyUrl != null) localStorage.setItem(STORAGE.proxyUrl, proxyUrl.trim());
  if (proxyToken != null) sessionStorage.setItem(STORAGE.proxyToken, proxyToken);
}

export function clearAgentSession() {
  sessionStorage.removeItem(STORAGE.agentId);
}

function apiBase() {
  const { proxyUrl } = getAgentSettings();
  return (proxyUrl || window.location.origin).replace(/\/$/, '');
}

function authHeaders() {
  const { proxyToken } = getAgentSettings();
  const headers = { 'Content-Type': 'application/json' };
  if (proxyToken) headers.Authorization = `Bearer ${proxyToken}`;
  return headers;
}

export async function checkAgentHealth() {
  const res = await fetch(`${apiBase()}/api/agent/health`, { method: 'GET' });
  if (!res.ok) throw new Error('Agent proxy unavailable');
  return res.json();
}

export function buildAccountContext() {
  const profile = window.__USER_PROFILE__;
  if (!profile) return {};
  const skills = profile.skills || {};
  const skillLines = Object.entries(skills)
    .sort((a, b) => a[0].localeCompare(b[0]))
    .map(([name, lvl]) => `${name}: ${lvl}`);
  const nextEl = document.getElementById('next-up-text');
  const nextStep = nextEl?.textContent?.includes('step')
    ? nextEl.textContent.replace(/\s+/g, ' ').trim()
    : null;
  return {
    rsn: profile.rsn,
    gameMode: profile.gameMode,
    combatLevel: profile.combatLevel,
    totalLevel: profile.totalLevel,
    questPoints: profile.questPoints,
    questsComplete: profile.questsComplete,
    questSyncAvailable: profile.questSyncError !== 'NO_PROFILE',
    nextStep,
    skills,
    skillsList: skillLines.join(', '),
  };
}

export async function sendAgentMessage(message, { onMeta, onComplete, onError }) {
  const settings = getAgentSettings();
  const res = await fetch(`${apiBase()}/api/agent/chat`, {
    method: 'POST',
    headers: authHeaders(),
    body: JSON.stringify({
      message,
      agentId: settings.agentId || undefined,
      context: buildAccountContext(),
    }),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error || `Request failed (${res.status})`);
  }

  const reader = res.body.getReader();
  const decoder = new TextDecoder();
  let buffer = '';
  let streamed = '';
  let finalText = null;
  let finished = false;

  const finish = (text) => {
    if (finished) return;
    finished = true;
    onComplete?.(text || streamed);
  };

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    buffer += decoder.decode(value, { stream: true });
    const blocks = buffer.split('\n\n');
    buffer = blocks.pop() || '';
    for (const block of blocks) {
      if (!block.trim()) continue;
      let event = 'message';
      let data = '';
      for (const line of block.split('\n')) {
        if (line.startsWith('event:')) event = line.slice(6).trim();
        else if (line.startsWith('data:')) data += line.slice(5).trim();
      }
      if (!data) continue;
      let parsed;
      try {
        parsed = JSON.parse(data);
      } catch {
        continue;
      }
      if (event === 'meta' && parsed.agentId) {
        sessionStorage.setItem(STORAGE.agentId, parsed.agentId);
        onMeta?.(parsed);
      } else if (event === 'token' && parsed.text) {
        streamed += parsed.text;
      } else if (event === 'result') {
        if (parsed.text) finalText = parsed.text;
        if (parsed.status === 'ERROR') {
          finished = true;
          onError?.(parsed.text || 'Agent run failed');
          return;
        }
        finish(finalText);
      } else if (event === 'error') {
        finished = true;
        if (parsed.clearSession) clearAgentSession();
        onError?.(parsed.message || parsed.code || 'Agent error');
      } else if (event === 'done') {
        finish(finalText);
      }
    }
  }
  finish(finalText);
}

function loadPanelLayout() {
  try {
    const raw = localStorage.getItem(STORAGE.layout);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

function savePanelLayout(panel) {
  const rect = panel.getBoundingClientRect();
  localStorage.setItem(
    STORAGE.layout,
    JSON.stringify({
      width: Math.round(rect.width),
      height: Math.round(rect.height),
      left: Math.round(rect.left),
      top: Math.round(rect.top),
    })
  );
}

function clampPanelRect({ left, top, width, height }) {
  const maxW = window.innerWidth - PANEL_MARGIN * 2;
  const maxH = window.innerHeight - PANEL_MARGIN * 2;
  const w = Math.min(Math.max(width, PANEL_MIN_W), maxW);
  const h = Math.min(Math.max(height, PANEL_MIN_H), maxH);
  const l = Math.min(Math.max(left, PANEL_MARGIN), window.innerWidth - w - PANEL_MARGIN);
  const t = Math.min(Math.max(top, PANEL_MARGIN), window.innerHeight - h - PANEL_MARGIN);
  return { left: l, top: t, width: w, height: h };
}

function applyPanelRect(panel, rect) {
  panel.classList.add('has-custom-layout');
  panel.style.right = 'auto';
  panel.style.bottom = 'auto';
  panel.style.left = `${rect.left}px`;
  panel.style.top = `${rect.top}px`;
  panel.style.width = `${rect.width}px`;
  panel.style.height = `${rect.height}px`;
}

function anchorPanelFromCurrent(panel) {
  const rect = panel.getBoundingClientRect();
  applyPanelRect(panel, {
    left: rect.left,
    top: rect.top,
    width: rect.width,
    height: rect.height,
  });
}

function initPanelDragResize(panel) {
  const head = panel.querySelector('.agent-chat-head');
  const resizeHandle = panel.querySelector('.agent-chat-resize-handle');
  if (!head || !resizeHandle) return;

  const saved = loadPanelLayout();
  if (saved?.width && saved?.height && saved.left != null && saved.top != null) {
    applyPanelRect(panel, clampPanelRect(saved));
  }

  let dragState = null;

  const onPointerMove = (e) => {
    if (!dragState) return;
    if (dragState.mode === 'drag') {
      const left = e.clientX - dragState.offsetX;
      const top = e.clientY - dragState.offsetY;
      applyPanelRect(
        panel,
        clampPanelRect({
          left,
          top,
          width: dragState.width,
          height: dragState.height,
        })
      );
    } else if (dragState.mode === 'resize') {
      const width = dragState.startW + (e.clientX - dragState.startX);
      const height = dragState.startH + (e.clientY - dragState.startY);
      applyPanelRect(
        panel,
        clampPanelRect({
          left: dragState.left,
          top: dragState.top,
          width,
          height,
        })
      );
    }
  };

  const endDrag = () => {
    if (!dragState) return;
    dragState = null;
    panel.classList.remove('is-dragging', 'is-resizing');
    document.body.classList.remove('agent-chat-no-select');
    savePanelLayout(panel);
    window.removeEventListener('pointermove', onPointerMove);
    window.removeEventListener('pointerup', endDrag);
    window.removeEventListener('pointercancel', endDrag);
  };

  head.addEventListener('pointerdown', (e) => {
    if (e.button !== 0) return;
    if (e.target.closest('button, input, summary, a, textarea, select')) return;
    anchorPanelFromCurrent(panel);
    const rect = panel.getBoundingClientRect();
    dragState = {
      mode: 'drag',
      offsetX: e.clientX - rect.left,
      offsetY: e.clientY - rect.top,
      width: rect.width,
      height: rect.height,
    };
    panel.classList.add('is-dragging');
    document.body.classList.add('agent-chat-no-select');
    head.setPointerCapture(e.pointerId);
    window.addEventListener('pointermove', onPointerMove);
    window.addEventListener('pointerup', endDrag);
    window.addEventListener('pointercancel', endDrag);
    e.preventDefault();
  });

  resizeHandle.addEventListener('pointerdown', (e) => {
    if (e.button !== 0) return;
    anchorPanelFromCurrent(panel);
    const rect = panel.getBoundingClientRect();
    dragState = {
      mode: 'resize',
      startX: e.clientX,
      startY: e.clientY,
      startW: rect.width,
      startH: rect.height,
      left: rect.left,
      top: rect.top,
    };
    panel.classList.add('is-resizing');
    document.body.classList.add('agent-chat-no-select');
    resizeHandle.setPointerCapture(e.pointerId);
    window.addEventListener('pointermove', onPointerMove);
    window.addEventListener('pointerup', endDrag);
    window.addEventListener('pointercancel', endDrag);
    e.preventDefault();
    e.stopPropagation();
  });

  window.addEventListener('resize', () => {
    if (!panel.classList.contains('has-custom-layout')) return;
    const rect = panel.getBoundingClientRect();
    applyPanelRect(
      panel,
      clampPanelRect({
        left: rect.left,
        top: rect.top,
        width: rect.width,
        height: rect.height,
      })
    );
    savePanelLayout(panel);
  });
}

export { renderMarkdown };

export function initAgentChat() {
  const panel = document.getElementById('agent-chat');
  const toggle = document.getElementById('agent-chat-toggle');
  const closeBtn = document.getElementById('agent-chat-close');
  const form = document.getElementById('agent-chat-form');
  const input = document.getElementById('agent-chat-input');
  const messages = document.getElementById('agent-chat-messages');
  const status = document.getElementById('agent-chat-status');
  const settingsWrap = document.getElementById('agent-chat-settings-wrap');
  const proxyUrlInput = document.getElementById('agent-proxy-url');
  const proxyTokenInput = document.getElementById('agent-proxy-token');
  const saveSettingsBtn = document.getElementById('agent-save-settings');
  const newChatBtn = document.getElementById('agent-new-chat');
  const sendBtn = form?.querySelector('button[type="submit"]');

  if (!panel || !toggle) return;

  initPanelDragResize(panel);

  let busy = false;

  function setStatus(text, kind = '') {
    status.textContent = text;
    status.className = `agent-chat-status${kind ? ` ${kind}` : ''}`;
  }

  function appendMessage(role, content, { html = false } = {}) {
    const el = document.createElement('div');
    el.className = `agent-msg agent-msg-${role}${html ? ' agent-msg-rich' : ''}`;
    if (html) el.innerHTML = content;
    else el.textContent = content;
    messages.appendChild(el);
    messages.scrollTop = messages.scrollHeight;
    return el;
  }

  function showLoadingNotice() {
    panel.classList.add('is-thinking');
    form?.classList.add('disabled');
    if (input) input.disabled = true;
    if (sendBtn) sendBtn.disabled = true;
    setStatus('Thinking — checking your stats and the pathway…');
    const el = document.createElement('div');
    el.className = 'agent-loading-notice';
    el.setAttribute('role', 'status');
    el.innerHTML =
      '<span class="agent-loading-spinner" aria-hidden="true"></span><span>Preparing your answer…</span>';
    messages.appendChild(el);
    messages.scrollTop = messages.scrollHeight;
    return el;
  }

  function hideLoadingNotice(loadingEl) {
    loadingEl?.remove();
    panel.classList.remove('is-thinking');
    form?.classList.remove('disabled');
    if (input) input.disabled = false;
    if (sendBtn) sendBtn.disabled = false;
  }

  async function refreshHealth() {
    if (busy) return;
    try {
      const health = await checkAgentHealth();
      if (!health.ok) {
        setStatus('Proxy running but CURSOR_API_KEY missing in .env', 'warn');
        return;
      }
      setStatus(`Ready · ${health.model}${health.authRequired ? ' · token required' : ''}`);
    } catch {
      setStatus('Agent offline — run npm run dev with .env configured', 'warn');
    }
  }

  toggle.addEventListener('click', () => {
    panel.classList.toggle('open');
    if (panel.classList.contains('open')) refreshHealth();
  });
  closeBtn?.addEventListener('click', () => panel.classList.remove('open'));

  if (settingsWrap && proxyUrlInput && proxyTokenInput) {
    const s = getAgentSettings();
    proxyUrlInput.value = s.proxyUrl;
    proxyTokenInput.value = s.proxyToken;
    saveSettingsBtn?.addEventListener('click', () => {
      saveAgentSettings({
        proxyUrl: proxyUrlInput.value,
        proxyToken: proxyTokenInput.value,
      });
      settingsWrap.open = false;
      refreshHealth();
    });
  }

  newChatBtn?.addEventListener('click', () => {
    if (busy) return;
    clearAgentSession();
    messages.innerHTML = '';
    appendMessage('system', 'New conversation started.');
    refreshHealth();
  });

  form?.addEventListener('submit', async (e) => {
    e.preventDefault();
    const text = input.value.trim();
    if (!text || busy) return;
    busy = true;
    input.value = '';
    appendMessage('user', text);
    const loadingEl = showLoadingNotice();
    try {
      await sendAgentMessage(text, {
        onComplete: (reply) => {
          hideLoadingNotice(loadingEl);
          const body = (reply || '').trim();
          if (body) {
            appendMessage('assistant', renderMarkdown(body), { html: true });
          } else {
            appendMessage('assistant', 'No response received. Try again.');
          }
          setStatus('Ready');
        },
        onError: (msg) => {
          hideLoadingNotice(loadingEl);
          appendMessage('assistant', `Error: ${msg}`);
          setStatus(msg, 'warn');
        },
      });
    } catch (err) {
      hideLoadingNotice(loadingEl);
      if (/stream|agent_busy|404|409/i.test(err.message)) clearAgentSession();
      appendMessage('assistant', `Error: ${err.message}`);
      setStatus(err.message, 'warn');
    } finally {
      busy = false;
      input?.focus();
    }
  });

  refreshHealth();
}
