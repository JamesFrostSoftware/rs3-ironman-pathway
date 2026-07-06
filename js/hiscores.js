/** RS3 Hiscores Lite — wiki: Application programming interface */

export const SKILL_ORDER = [
  'Overall',
  'Attack',
  'Defence',
  'Strength',
  'Constitution',
  'Ranged',
  'Prayer',
  'Magic',
  'Cooking',
  'Woodcutting',
  'Fletching',
  'Fishing',
  'Firemaking',
  'Crafting',
  'Smithing',
  'Mining',
  'Herblore',
  'Agility',
  'Thieving',
  'Slayer',
  'Farming',
  'Runecrafting',
  'Hunter',
  'Construction',
  'Summoning',
  'Dungeoneering',
  'Divination',
  'Invention',
  'Archaeology',
  'Necromancy',
];

const ENDPOINTS = {
  ironman: 'hiscore_ironman',
  hardcore: 'hiscore_hardcore_ironman',
  normal: 'hiscore',
};

function buildUrl(player, mode) {
  const slug = player.trim().replace(/ /g, '_');
  const table = ENDPOINTS[mode] || ENDPOINTS.ironman;
  return `https://secure.runescape.com/m=${table}/index_lite.ws?player=${encodeURIComponent(slug)}`;
}

function isValidCsv(text) {
  const first = text.trim().split('\n')[0] || '';
  return /^\d+,\d+,\d+/.test(first) && !text.includes('<!DOCTYPE');
}

async function fetchViaProxy(url) {
  const proxies = [
    (u) => `https://api.allorigins.win/raw?url=${encodeURIComponent(u)}`,
    (u) => `https://corsproxy.io/?${encodeURIComponent(u)}`,
  ];
  let lastErr;
  for (const wrap of proxies) {
    try {
      const res = await fetch(wrap(url));
      if (!res.ok) {
        lastErr = new Error(`Proxy error ${res.status}`);
        continue;
      }
      const text = await res.text();
      if (isValidCsv(text)) return text;
      lastErr = new Error('Player not found or invalid response.');
    } catch (e) {
      lastErr = e;
    }
  }
  throw lastErr || new Error('Could not reach hiscores.');
}

async function fetchText(url) {
  try {
    const res = await fetch(url);
    if (res.ok) {
      const text = await res.text();
      if (isValidCsv(text)) return text;
    }
  } catch {
    /* direct blocked by CORS in browser */
  }
  return fetchViaProxy(url);
}

export function parseHiscoresCsv(csv) {
  const lines = csv.trim().split('\n');
  if (lines.length < SKILL_ORDER.length) {
    throw new Error('Unexpected hiscores response.');
  }

  const skills = {};
  const xp = {};
  SKILL_ORDER.forEach((name, i) => {
    const parts = lines[i].split(',');
    skills[name] = parseInt(parts[1], 10) || 1;
    xp[name] = parseInt(parts[2], 10) || 0;
  });

  const profileSkills = {};
  for (const name of SKILL_ORDER) {
    if (name === 'Overall') continue;
    profileSkills[name] = skills[name];
  }

  return {
    totalLevel: skills.Overall,
    skills: profileSkills,
    xp,
    combatLevel: estimateCombatLevel(profileSkills),
  };
}

/** RS3 combat level — wiki: Combat level (Necromancy-inclusive) */
export function estimateCombatLevel(s) {
  const base = (def, con, hp, pray) =>
    0.25 * (def + con + Math.floor(hp / 2) + Math.floor(pray / 2));

  const melee = 0.325 * (s.Attack + s.Strength);
  const range = 0.325 * (Math.floor(s.Ranged / 2) + s.Ranged);
  const magic = 0.325 * (Math.floor(s.Magic / 2) + s.Magic);
  const necro = 0.325 * (Math.floor(s.Necromancy / 2) + s.Necromancy);
  const b = base(s.Defence, s.Constitution, s.Constitution, s.Prayer);
  return Math.floor(b + Math.max(melee, range, magic, necro));
}

export async function fetchPlayerStats(playerName, mode = 'ironman') {
  if (!playerName?.trim()) throw new Error('Enter your RuneScape name.');
  const url = buildUrl(playerName, mode);
  const csv = await fetchText(url);
  return parseHiscoresCsv(csv);
}
