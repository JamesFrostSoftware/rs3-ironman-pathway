/** Repeatable activities — cadence per RS3 daily/weekly/monthly resets (00:00 UTC; weekly: Wednesday) */

export const RESET = {
  daily: { label: 'Daily', hourUtc: 0 },
  weekly: { label: 'Weekly', weekdayUtc: 3, hourUtc: 0 },
  monthly: { label: 'Monthly', dayUtc: 1, hourUtc: 0 },
};

export const REPEATABLES = [
  {
    id: 'daily-challenges',
    name: 'Daily Challenges',
    cadence: 'daily',
    wiki: 'https://runescape.wiki/w/Daily_Challenge',
    notes: 'Put combat XP into Ranged (pathway guide).',
  },
  {
    id: 'guthixian-cache',
    name: 'Guthixian Cache',
    cadence: 'daily',
    wiki: 'https://runescape.wiki/w/Guthixian_Cache',
    notes: 'Opens after 800 memories at a rift. Requires 35 Divination.',
    skills: [{ skill: 'Divination', level: 35 }],
  },
  {
    id: 'nemi-forest',
    name: 'Nemi Forest',
    cadence: 'daily',
    wiki: 'https://runescape.wiki/w/Nemi_Forest',
    notes: 'Divination/Prayer XP.',
  },
  {
    id: 'pof-daily',
    name: 'Player-Owned Farm',
    cadence: 'daily',
    wiki: 'https://runescape.wiki/w/Player-owned_farm',
    notes: 'Check animals, beehives, breed/sell cycle.',
    skills: [{ skill: 'Farming', level: 17 }],
  },
  {
    id: 'soul-obelisk',
    name: 'Soul Obelisk',
    cadence: 'daily',
    wiki: 'https://runescape.wiki/w/Soul_obelisk',
    notes: 'Menaphos reputation (Soulobby FC).',
  },
  {
    id: 'rapid-growth',
    name: 'Rapid Growth (Het\'s Oasis)',
    cadence: 'daily',
    wiki: 'https://runescape.wiki/w/Rapid_Growth',
    notes: '4 bushes, 2× per bush. Requires 88 Magic.',
    skills: [{ skill: 'Magic', level: 88 }],
  },
  {
    id: 'pop-daily',
    name: 'Player-Owned Ports',
    cadence: 'daily',
    wiki: 'https://runescape.wiki/w/Player-owned_port',
    notes: 'Requires 90 in a port skill.',
    skills: [{ skill: 'Any Port Skill', level: 90 }],
  },
  {
    id: 'reaper',
    name: 'Reaper Task',
    cadence: 'weekly',
    wiki: 'https://runescape.wiki/w/Reaper',
    notes: 'Up to 300 Reaper points/week. 45 Slayer, 50 Combat.',
    skills: [{ skill: 'Slayer', level: 45 }, { skill: 'Combat', level: 50 }],
  },
  {
    id: 'herby-werby',
    name: 'Herby Werby',
    cadence: 'weekly',
    wiki: 'https://runescape.wiki/w/Herby_Werby',
    notes: 'Anachronia weekly.',
  },
  {
    id: 'penguin',
    name: 'Penguin Hide and Seek',
    cadence: 'weekly',
    wiki: 'https://runescape.wiki/w/Penguin_Hide_and_Seek',
    notes: 'Herblore book reward option.',
  },
  {
    id: 'tog',
    name: 'Tears of Guthix',
    cadence: 'weekly',
    wiki: 'https://runescape.wiki/w/Tears_of_Guthix',
    notes: 'After Tears of Guthix quest.',
  },
  {
    id: 'circus',
    name: 'The Circus',
    cadence: 'weekly',
    wiki: 'https://runescape.wiki/w/The_Circus',
    notes: 'Agility XP.',
  },
  {
    id: 'miscellania',
    name: 'Managing Miscellania',
    cadence: 'weekly',
    wiki: 'https://runescape.wiki/w/Managing_Miscellania',
    notes: 'Mahogany full bar; maple remainder.',
  },
  {
    id: 'agoroth',
    name: 'Agoroth',
    cadence: 'weekly',
    wiki: 'https://runescape.wiki/w/Agoroth',
    notes: 'After A Shadow over Ashdale.',
  },
  {
    id: 'water-filtration',
    name: 'Water Filtration (Het\'s Oasis)',
    cadence: 'weekly',
    wiki: 'https://runescape.wiki/w/Het%27s_Oasis#Water_filtration',
    notes: 'After repair quest step.',
  },
  {
    id: 'shop-run',
    name: 'Shop Run',
    cadence: 'weekly',
    wiki: 'https://runescape.wiki/w/Ironman_Mode/Guide/Efficient_Ironman_Pathway_Guide#Weeklies',
    notes: 'Broad arrowheads, runes, vials, bloodweed seeds, etc.',
  },
  {
    id: 'fort-xp',
    name: 'Fort Forinthry XP Claim',
    cadence: 'weekly',
    wiki: 'https://runescape.wiki/w/Fort_Forinthry',
    notes: 'Claim rested XP from Town Hall.',
  },
  {
    id: 'crystal-blossom',
    name: 'Crystal Tree Blossom',
    cadence: 'weekly',
    wiki: 'https://runescape.wiki/w/Crystal_tree_(Prifddinas)',
    notes: '94 Farming. Charges accumulate up to 30 days.',
    skills: [{ skill: 'Farming', level: 94 }],
  },
  {
    id: 'troll-invasion',
    name: 'Troll Invasion',
    cadence: 'monthly',
    wiki: 'https://runescape.wiki/w/Troll_Invasion',
    notes: 'Monthly combat minigame.',
  },
  {
    id: 'giant-oyster',
    name: 'Giant Oyster',
    cadence: 'monthly',
    wiki: 'https://runescape.wiki/w/Giant_Oyster',
    notes: 'Fishing/Farming XP + clue table loot.',
  },
  {
    id: 'god-statues',
    name: 'God Statues',
    cadence: 'monthly',
    wiki: 'https://runescape.wiki/w/God_Statues',
    notes: 'Construction/Slayer XP.',
  },
];

function nextDailyUtc(from) {
  const d = new Date(from);
  const n = new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate() + 1, 0, 0, 0));
  return n;
}

function nextWeeklyUtc(from) {
  const d = new Date(from);
  const day = d.getUTCDay();
  const wed = 3;
  let daysUntil = (wed - day + 7) % 7;
  if (daysUntil === 0) {
    const todayReset = Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate(), 0, 0, 0);
    if (from.getTime() >= todayReset) daysUntil = 7;
  }
  const target = new Date(d.getTime() + daysUntil * 86400000);
  return new Date(Date.UTC(target.getUTCFullYear(), target.getUTCMonth(), target.getUTCDate(), 0, 0, 0));
}

function nextMonthlyUtc(from) {
  const d = new Date(from);
  let y = d.getUTCFullYear();
  let m = d.getUTCMonth();
  const thisReset = Date.UTC(y, m, 1, 0, 0, 0);
  if (from.getTime() >= thisReset) {
    m += 1;
    if (m > 11) {
      m = 0;
      y += 1;
    }
  }
  return new Date(Date.UTC(y, m, 1, 0, 0, 0));
}

export function nextResetAfter(completedAt, cadence) {
  const from = completedAt ? new Date(completedAt) : new Date(0);
  if (cadence === 'daily') return nextDailyUtc(from);
  if (cadence === 'weekly') return nextWeeklyUtc(from);
  return nextMonthlyUtc(from);
}

export function getRepeatableStatus(lastDoneIso, cadence, now = new Date()) {
  if (!lastDoneIso) {
    return { available: true, nextAt: null, msRemaining: 0 };
  }
  const next = nextResetAfter(lastDoneIso, cadence);
  const ms = next.getTime() - now.getTime();
  return { available: ms <= 0, nextAt: next, msRemaining: Math.max(0, ms) };
}

export function formatCountdown(ms) {
  if (ms <= 0) return 'Available now';
  const s = Math.floor(ms / 1000);
  const d = Math.floor(s / 86400);
  const h = Math.floor((s % 86400) / 3600);
  const m = Math.floor((s % 3600) / 60);
  if (d > 0) return `${d}d ${h}h`;
  if (h > 0) return `${h}h ${m}m`;
  return `${m}m ${s % 60}s`;
}
