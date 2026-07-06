/** Player profile — skills auto-sync from hiscores when RSN is set */

export const DEFAULT_PROFILE = {
  rsn: 'James',
  gameMode: 'ironman',
  questPoints: 105,
  autoSyncMinutes: 15,
  lastSync: null,
  syncError: null,
  questSyncError: null,
  questsComplete: null,
  skills: {
    Attack: 44,
    Constitution: 52,
    Mining: 52,
    Strength: 31,
    Agility: 37,
    Smithing: 40,
    Defence: 47,
    Herblore: 27,
    Fishing: 52,
    Ranged: 45,
    Thieving: 31,
    Cooking: 24,
    Prayer: 33,
    Crafting: 47,
    Firemaking: 36,
    Magic: 55,
    Fletching: 40,
    Woodcutting: 59,
    Runecrafting: 50,
    Slayer: 46,
    Farming: 17,
    Construction: 65,
    Hunter: 1,
    Summoning: 19,
    Dungeoneering: 5,
    Divination: 17,
    Invention: 1,
    Archaeology: 15,
    Necromancy: 50,
  },
  totalLevel: 1038,
  combatLevel: 66,
};

export const USER_PROFILE = structuredClone(DEFAULT_PROFILE);

export const WIKI = {
  pathwayGuide:
    'https://runescape.wiki/w/Ironman_Mode/Guide/Efficient_Ironman_Pathway_Guide',
  pofGuide: 'https://runescape.wiki/w/Player-owned_farm',
  hiscoresApi: 'https://runescape.wiki/w/Application_programming_interface#Hiscores',
  runemetrics: 'https://runescape.wiki/w/Application_programming_interface#Runemetrics',
};

export function skillIconUrl(skill) {
  const file = skill.replace(/ /g, '_');
  return `https://runescape.wiki/images/thumb/${file}.png/21px-${file}.png`;
}

export function quickGuideUrl(title) {
  const slug = title
    .replace(/\(Quick Guide\)/gi, '')
    .replace(/'/g, '%27')
    .trim()
    .replace(/ /g, '_');
  return `https://runescape.wiki/w/${encodeURIComponent(slug.replace(/_/g, ' ')).replace(/%20/g, '_')}/Quick_guide`;
}

export function wikiPageUrl(title) {
  const slug = title.replace(/'/g, '%27').trim().replace(/ /g, '_');
  return `https://runescape.wiki/w/${slug}`;
}

export function applyHiscores(data) {
  USER_PROFILE.skills = { ...data.skills };
  USER_PROFILE.totalLevel = data.totalLevel;
  USER_PROFILE.combatLevel = data.combatLevel;
  USER_PROFILE.lastSync = new Date().toISOString();
  USER_PROFILE.syncError = null;
}

export function applyQuestProfile(questData) {
  if (questData?.questPoints != null) {
    USER_PROFILE.questPoints = questData.questPoints;
  }
  USER_PROFILE.questsComplete = questData?.questsComplete ?? null;
  USER_PROFILE.questSyncError = questData?.error ?? null;
}

export function getDynamicNotes() {
  const s = USER_PROFILE.skills;
  const notes = [];
  if (s.Farming >= 17 && s.Construction >= 20) {
    notes.push(`PoF ready — Farming ${s.Farming}, Construction ${s.Construction}.`);
  }
  if (s.Hunter < 53) {
    notes.push(`Hunter ${s.Hunter} — need 53+ before PoF grey chinchompas (Farming 54).`);
  }
  if (s.Invention < 80) {
    notes.push(`Invention locked until 80 Divination (${s.Divination}), Smithing (${s.Smithing}), Crafting (${s.Crafting}).`);
  }
  if (USER_PROFILE.questSyncError === 'NO_PROFILE') {
    notes.push('Enable RuneMetrics public profile in-game to auto-sync quests & QP.');
  }
  if (USER_PROFILE.lastSync) {
    notes.push(`Skills synced ${new Date(USER_PROFILE.lastSync).toLocaleString()}.`);
  }
  return notes;
}
