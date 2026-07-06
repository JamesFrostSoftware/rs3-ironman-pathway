/** RuneMetrics quests API — wiki: Application programming interface#Runemetrics */

async function fetchJson(url) {
  try {
    const res = await fetch(url);
    if (res.ok) return res.json();
  } catch {
    /* CORS */
  }
  const proxies = [
    (u) => `https://api.allorigins.win/raw?url=${encodeURIComponent(u)}`,
    (u) => `https://corsproxy.io/?${encodeURIComponent(u)}`,
  ];
  for (const wrap of proxies) {
    try {
      const res = await fetch(wrap(url));
      if (!res.ok) continue;
      return res.json();
    } catch {
      /* try next */
    }
  }
  throw new Error('Could not reach RuneMetrics.');
}

export function normalizeQuestTitle(title) {
  return title
    .toLowerCase()
    .replace(/\(miniquest\)/gi, '')
    .replace(/\(quick guide\)/gi, '')
    .replace(/'/g, '')
    .replace(/[^a-z0-9 ]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

export async function fetchQuestData(playerName) {
  const slug = encodeURIComponent(playerName.trim().replace(/ /g, '%20'));
  const url = `https://apps.runescape.com/runemetrics/quests?user=${slug}`;
  const data = await fetchJson(url);

  if (data.error === 'NO_PROFILE') {
    return { error: 'NO_PROFILE', quests: [], questPoints: null };
  }

  const list = data.quests || [];
  if (!list.length) {
    return {
      error: 'NO_PROFILE',
      quests: [],
      questPoints: null,
      questsComplete: 0,
      completedTitles: new Set(),
    };
  }

  const completed = list.filter((q) => q.status === 'COMPLETED');
  const questPoints = completed.reduce((sum, q) => sum + (q.questPoints || 0), 0);
  const completedTitles = new Set(completed.map((q) => normalizeQuestTitle(q.title)));

  return {
    error: null,
    quests: list,
    questPoints,
    questsComplete: completed.length,
    completedTitles,
  };
}

/** Match guide step titles to RuneMetrics completed quests. */
export function matchQuestStep(title, completedTitles) {
  const n = normalizeQuestTitle(title);
  if (completedTitles.has(n)) return true;

  for (const ct of completedTitles) {
    if (n.includes(ct) || ct.includes(n)) return true;
  }

  const aliases = [
    ['dimension of disaster demon slayer', 'demon slayer'],
    ['tears of guthix quest', 'tears of guthix'],
    ['kili row', 'kili row'],
  ];
  for (const [a, b] of aliases) {
    if (n.includes(a) && completedTitles.has(b)) return true;
  }
  return false;
}

export function syncQuestSteps(allSteps, completedSet, completedTitles) {
  let added = 0;
  for (const step of allSteps) {
    if (!step.tags?.includes('quest')) continue;
    if (matchQuestStep(step.title, completedTitles)) {
      if (!completedSet.has(step.id)) added += 1;
      completedSet.add(step.id);
    }
  }
  return added;
}
