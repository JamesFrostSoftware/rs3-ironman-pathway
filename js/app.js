import {
  USER_PROFILE,
  applyHiscores,
  applyQuestProfile,
  skillIconUrl,
  WIKI,
} from './user-profile.js';
import { GUIDE_PARTS, buildStepIndex } from './guide-data.js';
import { fetchPlayerStats, SKILL_ORDER } from './hiscores.js';
import { fetchQuestData, syncQuestSteps } from './quests.js';
import {
  REPEATABLES,
  getRepeatableStatus,
  formatCountdown,
  RESET,
} from './repeatables.js';
import {
  getTrainingBlock,
  getGearBefore,
  isTrainingStep,
} from './training-data.js';
import {
  EXTRA_ONLY_TITLES,
  GUIDE_DATA_VERSION,
  remigrateProgress,
  WIKI_CURRENT_STEP,
} from './wiki-progress.js';
import { TIPS, tip } from './tooltips.js';
import { initAgentChat } from './agent-chat.js';
import { getStepMaterials } from './step-materials.js';

const STORAGE_KEY = 'rs3-ironman-pathway-v3';

const state = {
  completed: new Set(),
  notes: {},
  repeatablesDone: {},
  multiSelect: new Set(),
  multiSelectMode: false,
  hideCompleted: false,
  readyOnly: false,
  search: '',
  partFilter: 'all',
  syncing: false,
  hasScrolledToNext: false,
};

const allSteps = buildStepIndex(GUIDE_PARTS);
let countdownTimer = null;
let syncTimer = null;

function loadState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return {};
    const data = JSON.parse(raw);
    if (Array.isArray(data.completed)) state.completed = new Set(data.completed);
    if (data.notesByTitle) {
      for (const step of allSteps) {
        if (data.notesByTitle[step.title]) {
          state.notes[step.id] = data.notesByTitle[step.title];
        }
      }
    } else if (data.notes) {
      state.notes = data.notes;
    }
    if (data.repeatablesDone) state.repeatablesDone = data.repeatablesDone;
    if (data.rsn) USER_PROFILE.rsn = data.rsn;
    if (data.gameMode) USER_PROFILE.gameMode = data.gameMode;
    if (typeof data.questPoints === 'number') USER_PROFILE.questPoints = data.questPoints;
    if (data.cachedSkills) {
      USER_PROFILE.skills = data.cachedSkills;
      USER_PROFILE.totalLevel = data.cachedTotalLevel ?? USER_PROFILE.totalLevel;
      USER_PROFILE.combatLevel = data.cachedCombatLevel ?? USER_PROFILE.combatLevel;
      USER_PROFILE.lastSync = data.lastSync ?? null;
    }
    return data;
  } catch {
    return {};
  }
}

function ensureWikiProgress(saved = {}) {
  const needsRemigrate = saved.guideDataVersion !== GUIDE_DATA_VERSION;
  if (!needsRemigrate && saved.wikiProgressThrough === WIKI_CURRENT_STEP) return;

  const extraTitles = new Set(saved.completedTitles || []);
  if (needsRemigrate && extraTitles.size === 0 && Array.isArray(saved.completed)) {
    for (const id of saved.completed) {
      const step = allSteps.find((s) => s.id === id);
      if (step) extraTitles.add(step.title);
    }
  }

  remigrateProgress(state.completed, extraTitles);
  saveState(WIKI_CURRENT_STEP);
}

function saveState(wikiProgressThrough) {
  const existing = JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}');
  const notesByTitle = {};
  for (const step of allSteps) {
    if (state.notes[step.id]) notesByTitle[step.title] = state.notes[step.id];
  }
  const completedTitles = allSteps
    .filter((s) => state.completed.has(s.id))
    .map((s) => s.title);
  localStorage.setItem(
    STORAGE_KEY,
    JSON.stringify({
      completed: [...state.completed],
      completedTitles,
      notesByTitle,
      notes: state.notes,
      repeatablesDone: state.repeatablesDone,
      rsn: USER_PROFILE.rsn,
      gameMode: USER_PROFILE.gameMode,
      questPoints: USER_PROFILE.questPoints,
      cachedSkills: USER_PROFILE.skills,
      cachedTotalLevel: USER_PROFILE.totalLevel,
      cachedCombatLevel: USER_PROFILE.combatLevel,
      lastSync: USER_PROFILE.lastSync,
      wikiProgressThrough: wikiProgressThrough ?? existing.wikiProgressThrough ?? null,
      guideDataVersion: GUIDE_DATA_VERSION,
      savedAt: new Date().toISOString(),
    })
  );
}

function normalizeSkillName(name) {
  if (['Combat', 'Quest Points', 'Any Port Skill'].includes(name)) return null;
  return name;
}

function meetsRequirements(step) {
  if (!step.skills?.length) return true;
  for (const req of step.skills) {
    const skill = normalizeSkillName(req.skill);
    if (!skill) {
      if (req.skill === 'Combat' && USER_PROFILE.combatLevel < req.level) return false;
      if (req.skill === 'Quest Points' && USER_PROFILE.questPoints < req.level) return false;
      if (req.skill === 'Any Port Skill') {
        const portSkills = [
          'Agility', 'Cooking', 'Construction', 'Divination', 'Dungeoneering', 'Farming',
          'Fishing', 'Herblore', 'Hunter', 'Magic', 'Mining', 'Prayer', 'Ranged',
          'Runecrafting', 'Slayer', 'Smithing', 'Summoning', 'Thieving', 'Woodcutting',
          'Attack', 'Strength', 'Defence',
        ];
        if (!portSkills.some((s) => (USER_PROFILE.skills[s] ?? 0) >= req.level)) return false;
      }
      continue;
    }
    const have = USER_PROFILE.skills[skill];
    if (have == null || have < req.level) return false;
  }
  return true;
}

function meetsRepeatableSkills(rep) {
  if (!rep.skills?.length) return true;
  return rep.skills.every((req) => {
    const skill = normalizeSkillName(req.skill);
    if (!skill) return true;
    return (USER_PROFILE.skills[skill] ?? 0) >= req.level;
  });
}

function getFirstIncompleteStep() {
  return allSteps.find((s) => !state.completed.has(s.id)) || null;
}

function escapeHtml(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function debounce(fn, ms) {
  let t;
  return (...args) => {
    clearTimeout(t);
    t = setTimeout(() => fn(...args), ms);
  };
}

function skillTip(skill, level) {
  return TIPS.skillDefault(skill, level);
}

async function syncStats(manual = false) {
  const statusEl = document.getElementById('sync-status');
  const btn = document.getElementById('sync-btn');
  if (state.syncing) return;
  state.syncing = true;
  btn?.classList.add('spinning');
  statusEl.textContent = 'Syncing skills & quests…';
  statusEl.className = 'sync-status';

  try {
    const [hiscores, quests] = await Promise.all([
      fetchPlayerStats(USER_PROFILE.rsn, USER_PROFILE.gameMode),
      fetchQuestData(USER_PROFILE.rsn).catch(() => ({ error: 'FETCH_FAILED', questPoints: null, completedTitles: new Set() })),
    ]);

    applyHiscores(hiscores);
    applyQuestProfile(quests);

    if (quests.completedTitles?.size) {
      const added = syncQuestSteps(allSteps, state.completed, quests.completedTitles);
      const questNote = added > 0 ? `${added} quest steps auto-checked · ` : '';
      statusEl.textContent = `Updated · ${questNote}QP ${USER_PROFILE.questPoints} · ${quests.questsComplete ?? 0} quests done`;
    } else if (quests.error === 'NO_PROFILE') {
      statusEl.textContent = `Skills OK · Enable public RuneMetrics profile for quest auto-sync`;
    } else {
      statusEl.textContent = `Updated ${new Date().toLocaleTimeString()} · Total ${hiscores.totalLevel}`;
    }

    statusEl.className = 'sync-status ok';
    saveState();
    renderAll();
  } catch (err) {
    USER_PROFILE.syncError = err.message;
    statusEl.textContent = err.message;
    statusEl.className = 'sync-status err';
    if (manual) {
      renderHeroStats();
      renderQpDisplay();
    }
  } finally {
    state.syncing = false;
    btn?.classList.remove('spinning');
  }
}

function renderHeroStats() {
  const el = document.getElementById('hero-stats');
  const done = allSteps.filter((s) => state.completed.has(s.id)).length;
  const pct = Math.round((done / allSteps.length) * 100);
  el.innerHTML = `
    <div class="hero-stat has-tip"${tip(TIPS.progress)}><span>Progress</span><strong>${pct}%</strong></div>
    <div class="hero-stat has-tip"${tip(TIPS.combat)}><span>Combat</span><strong>${USER_PROFILE.combatLevel}</strong></div>
    <div class="hero-stat has-tip"${tip(TIPS.total)}><span>Total</span><strong>${USER_PROFILE.totalLevel}</strong></div>
  `;
}

function renderQpDisplay() {
  const el = document.getElementById('qp-value');
  if (el) el.textContent = USER_PROFILE.questPoints;
}

function renderSkillGrid() {
  const grid = document.getElementById('skill-grid');
  const skills = SKILL_ORDER.filter((n) => n !== 'Overall');
  grid.innerHTML = skills
    .map((skill) => {
      const level = USER_PROFILE.skills[skill] ?? 1;
      return `<div class="skill-chip" data-tip="${escapeHtml(skillTip(skill, level))}">
        <img src="${skillIconUrl(skill)}" alt="${escapeHtml(skill)}" loading="lazy" onerror="this.remove()" />
        <span class="skill-name">${escapeHtml(skill)}</span>
        <span class="skill-lvl">${level}</span>
      </div>`;
    })
    .join('');
}

function renderNextUpBanner() {
  const el = document.getElementById('next-up-text');
  const step = getFirstIncompleteStep();
  if (!step) {
    el.innerHTML = 'All steps complete — time to boss!';
    return;
  }
  const ready = meetsRequirements(step);
  const readyNote = ready ? '' : ' <span class="next-not-ready">(level gate — hover requirements below step)</span>';
  el.innerHTML = `Next up is step <strong>#${step.globalIndex}</strong> — <a href="#${step.id}">${escapeHtml(step.title)}</a>${readyNote}`;
}

function scrollToNextStep({ initial = false } = {}) {
  if (initial && state.hasScrolledToNext) return;
  const step = getFirstIncompleteStep();
  if (!step) return;
  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      const el = document.getElementById(step.id);
      if (!el || el.classList.contains('hidden-by-filter')) return;
      el.scrollIntoView({ behavior: 'smooth', block: 'center' });
      if (initial) state.hasScrolledToNext = true;
    });
  });
}

function renderRepeatables() {
  const list = document.getElementById('repeatables-list');
  const now = new Date();
  let availableCount = 0;

  const html = REPEATABLES.map((rep) => {
    const lastDone = state.repeatablesDone[rep.id];
    const status = getRepeatableStatus(lastDone, rep.cadence, now);
    const unlocked = meetsRepeatableSkills(rep);
    const showAvailable = status.available && unlocked;
    if (showAvailable) availableCount += 1;

    const countdown = status.available
      ? unlocked
        ? 'Available now'
        : 'Locked — level req'
      : formatCountdown(status.msRemaining);

    const countdownTip = showAvailable ? TIPS.repeatableAvailable : TIPS.repeatableLocked;

    const itemTip = rep.notes
      ? `${rep.name} — ${rep.notes} (${countdown})`
      : `${rep.name} (${countdown})`;

    return `<div class="repeatable-item${showAvailable ? ' available' : ''}${lastDone ? ' done-recently' : ''}" data-tip="${escapeHtml(itemTip)}">
      <div class="repeatable-top">
        <input type="checkbox" class="rep-check has-tip" data-id="${rep.id}" data-tip="Mark done for this period. Resets on the ${RESET[rep.cadence].label.toLowerCase()} timer." ${lastDone && !status.available ? 'checked' : ''} aria-label="Mark ${escapeHtml(rep.name)} done" />
        <div class="repeatable-body">
          <span class="repeatable-cadence">${RESET[rep.cadence].label}</span>
          <a class="repeatable-name" href="${rep.wiki}" target="_blank" rel="noopener">${escapeHtml(rep.name)}</a>
          <span class="repeatable-meta has-tip ${showAvailable ? 'available-text' : ''}" data-tip="${escapeHtml(countdownTip)}">${countdown}</span>
        </div>
      </div>
    </div>`;
  }).join('');

  list.innerHTML = html;
  document.getElementById('repeatables-available').textContent = `${availableCount} ready`;

  list.querySelectorAll('.rep-check').forEach((input) => {
    input.onchange = () => {
      const id = input.dataset.id;
      if (input.checked) state.repeatablesDone[id] = new Date().toISOString();
      else delete state.repeatablesDone[id];
      saveState();
      renderRepeatables();
    };
  });
}

function renderTrainingBlock(title) {
  const training = getTrainingBlock(title);
  const gear = getGearBefore(title);
  if (!training && !gear.length) return '';

  let html = '';
  if (gear.length) {
    html += `<div class="training-block gear-block"><h4>⚔ Gear / unlocks first</h4><ul>${gear
      .map(
        (g) =>
          `<li><a href="${g.wiki}" target="_blank" rel="noopener">${escapeHtml(g.name)}</a>${g.minCombat ? ` <em>(~${g.minCombat} combat)</em>` : ''}</li>`
      )
      .join('')}</ul></div>`;
  }
  if (training) {
    if (training.gear?.length) {
      html += `<div class="training-block gear-block"><h4>Equipment & supplies</h4><ul>${training.gear
        .map((g) => `<li><a href="${g.wiki}" target="_blank" rel="noopener">${escapeHtml(g.name)}</a></li>`)
        .join('')}</ul></div>`;
    }
    if (training.method?.length) {
      html += `<div class="training-block"><h4>Recommended method <a href="${training.wiki}" target="_blank" rel="noopener">(wiki)</a></h4><ul>${training.method
        .map((m) => `<li>${escapeHtml(m)}</li>`)
        .join('')}</ul></div>`;
    }
    if (training.settings?.length) {
      html += `<div class="training-block"><h4>Combat settings</h4><ul>${training.settings
        .map((s) => `<li>${escapeHtml(s)}</li>`)
        .join('')}</ul></div>`;
    }
  }
  return html;
}

function renderSkillReqs(skills) {
  if (!skills?.length) return '';
  return `<div class="step-skills">${skills
    .map((req) => {
      if (req.skill === 'Combat') {
        const met = USER_PROFILE.combatLevel >= req.level;
        const label = `${req.level} Combat (${USER_PROFILE.combatLevel})`;
        return `<span class="req-skill ${met ? 'met' : 'unmet'}" data-tip="${escapeHtml(met ? TIPS.reqMet(label) : TIPS.reqUnmet(label))}">${label}</span>`;
      }
      if (req.skill === 'Quest Points') {
        const met = USER_PROFILE.questPoints >= req.level;
        const label = `${req.level} QP (${USER_PROFILE.questPoints})`;
        return `<span class="req-skill ${met ? 'met' : 'unmet'}" data-tip="${escapeHtml(met ? TIPS.reqMet(label) : TIPS.reqUnmet(label))}">${label}</span>`;
      }
      if (req.skill === 'Any Port Skill') {
        const portSkills = [
          'Agility', 'Cooking', 'Construction', 'Divination', 'Dungeoneering', 'Farming',
          'Fishing', 'Herblore', 'Hunter', 'Magic', 'Mining', 'Prayer', 'Ranged',
          'Runecrafting', 'Slayer', 'Smithing', 'Summoning', 'Thieving', 'Woodcutting',
          'Attack', 'Strength', 'Defence',
        ];
        const best = Math.max(...portSkills.map((s) => USER_PROFILE.skills[s] ?? 0));
        const met = best >= req.level;
        const label = `${req.level} any port skill (${best})`;
        return `<span class="req-skill ${met ? 'met' : 'unmet'}" data-tip="${escapeHtml(met ? TIPS.reqMet(label) : TIPS.reqUnmet(label))}">${escapeHtml(label)}</span>`;
      }
      const skill = normalizeSkillName(req.skill);
      if (!skill) {
        const label = `${req.skill} ${req.level}+`;
        return `<span class="req-skill" data-tip="${escapeHtml(label)}">${escapeHtml(label)}</span>`;
      }
      const have = USER_PROFILE.skills[skill] ?? 0;
      const met = have >= req.level;
      const label = `${req.level} ${skill} (${have})`;
      return `<span class="req-skill ${met ? 'met' : 'unmet'}" data-tip="${escapeHtml(met ? TIPS.reqMet(label) : TIPS.reqUnmet(label))}">
        <img src="${skillIconUrl(skill)}" alt="" loading="lazy" onerror="this.remove()" />
        ${escapeHtml(label)}
      </span>`;
    })
    .join('')}</div>`;
}

function tagTip(tag) {
  const map = {
    quest: TIPS.tagQuest,
    pof: TIPS.tagPof,
    training: TIPS.tagTraining,
    extra: TIPS.tagExtra,
    pvm: TIPS.tagPvm,
    prep: TIPS.tagPrep,
    daily: TIPS.tagDaily,
    weekly: TIPS.tagWeekly,
    monthly: TIPS.tagMonthly,
  };
  return map[tag] || `Tag: ${tag}`;
}

function renderTags(tags = [], repeat, extra = []) {
  const all = [...(tags || []), ...(repeat ? [repeat] : []), ...extra];
  return all
    .map((t) => {
      const cls = t === 'pof' ? 'pof' : t === 'training' ? 'training' : t === 'extra' ? 'extra' : t === 'pvm' ? 'pvm' : t === 'prep' ? 'prep' : '';
      return `<span class="tag ${cls}" data-tip="${escapeHtml(tagTip(t))}">${escapeHtml(t)}</span>`;
    })
    .join('');
}

function renderStepMaterials(title) {
  let items = getStepMaterials(title);
  if (!items?.length) {
    const training = getTrainingBlock(title);
    if (training?.gear?.length) {
      items = training.gear.map((g) => g.name);
    } else {
      const gear = getGearBefore(title);
      if (gear?.length) items = gear.map((g) => g.name);
    }
  }
  if (!items?.length) return '';
  const lis = items.map((line) => `<li>${escapeHtml(line)}</li>`).join('');
  return `<div class="step-materials"><span class="step-materials-label">Materials</span><ul>${lis}</ul></div>`;
}

function stepMatchesSearch(step, q) {
  if (!q) return true;
  const training = getTrainingBlock(step.title);
  const hay = [step.title, step.notes, step.partTitle, ...(step.tags || []), ...(training?.method || [])]
    .join(' ')
    .toLowerCase();
  return hay.includes(q.toLowerCase());
}

function shouldShowStep(step, currentStepId) {
  const isCurrent = step.id === currentStepId;
  if (!isCurrent && state.partFilter !== 'all' && step.partId !== state.partFilter) return false;
  if (state.hideCompleted && state.completed.has(step.id)) return false;
  if (state.readyOnly && !meetsRequirements(step) && !isCurrent) return false;
  if (!isCurrent && !stepMatchesSearch(step, state.search)) return false;
  return true;
}

function renderGuide() {
  const current = getFirstIncompleteStep();
  const container = document.getElementById('guide-sections');

  container.innerHTML = GUIDE_PARTS.map((part, partIndex) => {
    const partSteps = allSteps.filter((s) => s.partId === part.id);
    const partDone = partSteps.filter((s) => state.completed.has(s.id)).length;
    const partPct = partSteps.length ? Math.round((partDone / partSteps.length) * 100) : 0;

    const rows = partSteps
      .map((step) => {
        const completed = state.completed.has(step.id);
        const ready = meetsRequirements(step);
        const selected = state.multiSelect.has(step.id);
        const training = isTrainingStep(step.title);
        const visible = shouldShowStep(step, current?.id);
        const isCurrent = current?.id === step.id;
        const wikiLink = step.wiki
          ? `<a href="${step.wiki}" target="_blank" rel="noopener">${step.tags?.includes('quest') ? 'Quick guide' : 'Wiki'}</a>`
          : '';
        const pathwayLink = `<a href="${WIKI.pathwayGuide}" target="_blank" rel="noopener">Pathway</a>`;

        const cardTips = [
          completed ? TIPS.stepCompleted : '',
          isCurrent ? TIPS.stepCurrent : '',
          !ready && !completed ? TIPS.stepNotReady : '',
        ]
          .filter(Boolean)
          .join(' ');

        return `<article id="${step.id}" class="step-card${completed ? ' completed' : ''}${selected ? ' multi-selected' : ''}${!ready ? ' not-ready' : ''}${step.tags?.includes('pof') ? ' pof-step' : ''}${step.tags?.includes('prep') ? ' prep-step' : ''}${training ? ' is-training' : ''}${isCurrent ? ' step-current' : ''}${visible ? '' : ' hidden-by-filter'}"${cardTips ? ` data-tip="${escapeHtml(cardTips)}"` : ''}>
          <div class="step-row-top">
            <div class="step-check-wrap">
              <input type="checkbox" class="step-complete has-tip" data-id="${step.id}" data-tip="${escapeHtml(completed ? TIPS.stepCompleted : 'Mark this step complete.')}" ${completed ? 'checked' : ''} aria-label="Complete" />
            </div>
            <div class="step-select-wrap" ${state.multiSelectMode ? '' : 'hidden'}>
              <input type="checkbox" class="step-multi" data-id="${step.id}" ${selected ? 'checked' : ''} aria-label="Select" />
            </div>
            <div class="step-body">
              <div class="step-title-line">
                <span class="step-num">#${step.globalIndex}</span>
                <span class="step-title">${escapeHtml(step.title)}</span>
                ${renderTags(step.tags, step.repeat, [
                  ...(training ? ['training'] : []),
                  ...(EXTRA_ONLY_TITLES.has(step.title) ? ['extra'] : []),
                ])}
              </div>
              ${step.notes ? `<p class="step-notes">${escapeHtml(step.notes)}</p>` : ''}
              ${renderStepMaterials(step.title)}
              ${renderSkillReqs(step.skills)}
              ${training ? renderTrainingBlock(step.title) : ''}
              <div class="step-links">${wikiLink}${wikiLink ? ' · ' : ''}${pathwayLink}</div>
              <textarea class="user-note" data-id="${step.id}" placeholder="Your notes…" rows="2">${escapeHtml(state.notes[step.id] || '')}</textarea>
            </div>
          </div>
        </article>`;
      })
      .join('');

    return `<section class="guide-part">
      <div class="part-header" style="z-index:${41 + partIndex}">
        <div class="part-header-row">
          <h3>${escapeHtml(part.title)}</h3>
          <span class="part-meta">${partDone}/${partSteps.length}</span>
          ${part.wiki ? `<a href="${part.wiki}" target="_blank" rel="noopener" class="part-meta">Wiki ↗</a>` : ''}
        </div>
        <div class="part-progress" aria-label="${partPct}% complete"><div class="part-progress-fill" style="width:${partPct}%"></div></div>
      </div>
      ${part.description ? `<p class="part-desc">${escapeHtml(part.description)}</p>` : ''}
      ${rows}
    </section>`;
  }).join('');

  bindStepEvents();
}

function bindStepEvents() {
  document.querySelectorAll('.step-complete').forEach((input) => {
    input.onchange = () => {
      const id = input.dataset.id;
      const markingDone = input.checked;
      if (markingDone) state.completed.add(id);
      else state.completed.delete(id);
      saveState();
      renderAll(false);
      if (markingDone) scrollToNextStep();
    };
  });

  document.querySelectorAll('.step-multi').forEach((input) => {
    input.onchange = () => {
      const id = input.dataset.id;
      if (input.checked) state.multiSelect.add(id);
      else state.multiSelect.delete(id);
      updateMultiSelectUi();
    };
  });

  document.querySelectorAll('.user-note').forEach((ta) => {
    ta.oninput = debounce(() => {
      state.notes[ta.dataset.id] = ta.value;
      saveState();
    }, 400);
  });
}

function updateMultiSelectUi() {
  const mode = state.multiSelectMode;
  document.getElementById('mark-selected-done').hidden = !mode;
  document.getElementById('mark-selected-undone').hidden = !mode;
  document.querySelectorAll('.step-select-wrap').forEach((el) => {
    el.hidden = !mode;
  });
}

function populatePartFilter() {
  const select = document.getElementById('part-filter');
  GUIDE_PARTS.forEach((p) => {
    const opt = document.createElement('option');
    opt.value = p.id;
    opt.textContent = p.title.replace(/^Part \d+: /, 'P');
    select.appendChild(opt);
  });
}

function startCountdownLoop() {
  if (countdownTimer) clearInterval(countdownTimer);
  countdownTimer = setInterval(renderRepeatables, 30000);
}

function startAutoSync() {
  if (syncTimer) clearInterval(syncTimer);
  syncTimer = setInterval(() => syncStats(false), (USER_PROFILE.autoSyncMinutes || 15) * 60 * 1000);
}

function initToolbar() {
  document.getElementById('rsn-input').value = USER_PROFILE.rsn || '';
  document.getElementById('game-mode').value = USER_PROFILE.gameMode || 'ironman';

  document.getElementById('rsn-input').addEventListener('change', (e) => {
    USER_PROFILE.rsn = e.target.value.trim();
    saveState();
    syncStats(true);
  });

  document.getElementById('game-mode').addEventListener('change', (e) => {
    USER_PROFILE.gameMode = e.target.value;
    saveState();
    syncStats(true);
  });

  document.getElementById('sync-btn').addEventListener('click', () => syncStats(true));

  document.getElementById('multi-select-toggle').addEventListener('change', (e) => {
    state.multiSelectMode = e.target.checked;
    if (!state.multiSelectMode) state.multiSelect.clear();
    updateMultiSelectUi();
    renderGuide();
  });

  document.getElementById('mark-selected-done').addEventListener('click', () => {
    state.multiSelect.forEach((id) => state.completed.add(id));
    state.multiSelect.clear();
    saveState();
    renderAll(false);
    scrollToNextStep();
  });

  document.getElementById('mark-selected-undone').addEventListener('click', () => {
    state.multiSelect.forEach((id) => state.completed.delete(id));
    state.multiSelect.clear();
    saveState();
    renderAll(false);
  });

  document.getElementById('hide-completed').addEventListener('change', (e) => {
    state.hideCompleted = e.target.checked;
    renderGuide();
  });

  document.getElementById('ready-only').addEventListener('change', (e) => {
    state.readyOnly = e.target.checked;
    renderGuide();
  });

  document.getElementById('part-filter').addEventListener('change', (e) => {
    state.partFilter = e.target.value;
    renderGuide();
  });

  document.getElementById('search-input').addEventListener(
    'input',
    debounce((e) => {
      state.search = e.target.value.trim();
      renderGuide();
    }, 200)
  );
}

function renderAll(full = true) {
  renderHeroStats();
  renderQpDisplay();
  renderNextUpBanner();
  renderRepeatables();
  renderGuide();
  if (full) renderSkillGrid();
}

const _savedMeta = loadState();
ensureWikiProgress(_savedMeta);
populatePartFilter();
initToolbar();
renderAll();
scrollToNextStep({ initial: true });
syncStats(false);
startCountdownLoop();
startAutoSync();

window.__USER_PROFILE__ = USER_PROFILE;
initAgentChat();
