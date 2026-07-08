import { buildStepIndex, GUIDE_PARTS } from './guide-data.js';

/**
 * Custom PoF steps — stay unchecked so you can see what extra work remains.
 */
export const EXTRA_ONLY_TITLES = new Set([
  'PoF prep: verify 17 Farming & 20 Construction',
  "Purchase small pen deed (I) from Farmers' Market",
  'Set up pre-64 PoF: breeding pen + small pens',
  'Daily PoF: check animals, collect beehives, sell adolescents (pre-64)',
  'PoF: purchase medium pen deed (I) when you reach 35 Farming',
  'PoF: purchase large pen deed (I) when you reach 49 Farming',
  'PoF: place grey chinchompas in small pens (Farming 54+)',
  'PoF post-64: spider breeding pair from Lumbridge Catacombs',
  'PoF: unlock shop rewards in order',
  'PoF post-unlocks pen setup',
  'PoF: after all shop unlocks, grow animals to elder',
]);

/**
 * PvM unlock steps woven into the main pathway — not in the original wiki order,
 * so they stay unchecked unless you tick them yourself.
 */
export const PVM_INSERT_TITLES = new Set([
  'Pathfinder equipment + Ring of potency (Gudrik)',
  'Enhanced Excalibur (hard Seers\' Village achievements)',
  'Craft spiky vambraces (as Ranged allows)',
  'Broken Home',
  'Equip Salve amulet (e) vs undead bosses',
  'Requiem for a Dragon',
  'Contact!',
  'Animal Magnetism',
  'Curse of the Black Stone',
  'Illuminate god book',
  'Buy Ring of vigour (50,000 DG tokens)',
  'Buy Spirit cape (45,000 DG tokens)',
  'War\'s Retreat — progress War\'s Wares unlocks',
  'Beneath Scabaras\' Sands',
  'Succession',
  'Daughter of Chaos',
  'Song from the Depths',
  'Twilight of the Gods',
  'Elite dungeon chest upgrade (750,000 DG tokens)',
  'The Brink of Extinction',
  'The Elder Kiln',
  'Reaper store: Reaper\'s Choice + Instance cost + Death\'s Support',
  'Reaper Crew — defeat every Reaper boss once',
]);

/**
 * Steps added or split during efficiency review — before the Shilo anchor but
 * not assumed done; stay unchecked unless you tick them.
 */
export const INSERTED_EFFICIENCY_TITLES = new Set([
  'Make Goblin Diplomacy dyes with Aggie',
  'Purchase runes from Aubury\'s Rune Shop',
  'Purchase yew shortbow + arrows from Brian\'s Archery Supplies',
  'Purchase runes from Void Knight Magic Store',
  'Build Fort Forinthry: Kitchen T2, Chapel T2',
  'Return to Taverley',
  'Complete 5 Supply and Demand deliveries',
  'Swept Away',
  'Train Farming to 27 (marigolds + onions)',
  'PoF: purchase small pen deed (II) at Farming 27',
  'Build Fort Forinthry: Botanist\'s Workbench T1',
  'Some Like It Cold',
  'Back to the Freezer',
  'Rune Mysteries',
  'Rune Memories',
  'Train Magic to 65 (before Ancient Awakening)',
  'Go Shopping Funch\'s Fine Groceries',
  'Purchase mystic wand and mystic orb from Marvellous Mysticism',
  'Purchase runes from Lundail\'s Arena-side Rune Shop',
  'Train Magic to 65',
  'Start Tears of Guthix weekly',
  'Mine and smelt 2 iron bars for The Knight\'s Sword',
  'Kill hill giants for 25 big bones',
  'Buy needle, thread & spider silk from Varrock',
  'Smith 150 steel nails for PoF small pens',
  'Prep spiky vambraces: leather, kebbit claws & vambraces',
  'Sawmill acadia planks & craft stone wall segments',
  'Prep Shades of Mort\'ton: flamtaer & sacred oil',
  'Prep Dragon Slayer: 50 dragon bones & combat gear',
  'Smith 150 mithril nails for PoF medium pen',
  'Chop mahogany & smith rune nails for PoF large pen',
  'Buy box traps for chinchompa hunting',
  'Gather Animal Magnetism quest items',
  'Farm 63M Shattered Worlds anima — Bladed Dive',
  'Collect 4 torn god pages for Illuminate',
  'Kill Vindicta for noted dragon bones',
  'Gather materials for 3000 Sign of the porter IV',
  'Gather marigold & onion seeds for Farming 27',
  'Gather Rellekkan cream rabbit breeding pair',
  'Buy sheep for medium pens (Farmers\' Market)',
  'Buy bulls for large pens (Farmers\' Market)',
  'Gather grey chinchompas for PoF pens',
  'Gather spider eggs for PoF breeding (Lumbridge Catacombs)',
  'Gather red chinchompas & yaks for PoF pen setup',
  'Gather pineapples for My Arm\'s Big Adventure',
  'Gather seeds for Garden of Tranquillity',
  'Gather crops for A Fairy Tale I - Growing Pains',
]);

const AUTO_CHECK_SKIP = new Set([
  ...EXTRA_ONLY_TITLES,
  ...PVM_INSERT_TITLES,
  ...INSERTED_EFFICIENCY_TITLES,
]);

/** Bump when guide structure changes — triggers progress remigration. */
export const GUIDE_DATA_VERSION = 9;

/** Last original wiki Part 1 step completed before current step 128. */
export const WIKI_ANCHOR_TITLE = 'Shilo Village';
export const WIKI_CURRENT_STEP = 128;

export function getCompletedTitlesThroughWikiStep(steps = buildStepIndex(GUIDE_PARTS)) {
  const anchor = steps.find(
    (s) => s.partId === 'part1' && s.title === WIKI_ANCHOR_TITLE
  );
  if (!anchor) return new Set();

  const cutoff = anchor.globalIndex;
  return new Set(
    steps
      .filter(
        (s) =>
          s.partId === 'part1' &&
          s.globalIndex <= cutoff &&
          !AUTO_CHECK_SKIP.has(s.title)
      )
      .map((s) => s.title)
  );
}

export function applyWikiProgress(completedSet, steps = buildStepIndex(GUIDE_PARTS)) {
  const titles = getCompletedTitlesThroughWikiStep(steps);
  for (const step of steps) {
    if (titles.has(step.title)) {
      completedSet.add(step.id);
    }
  }
}

/** Clear all, then restore wiki progress + any manually completed titles. */
export function remigrateProgress(completedSet, extraTitles = new Set()) {
  completedSet.clear();
  const steps = buildStepIndex(GUIDE_PARTS);
  const wikiTitles = getCompletedTitlesThroughWikiStep(steps);
  for (const step of steps) {
    if (wikiTitles.has(step.title) || extraTitles.has(step.title)) {
      completedSet.add(step.id);
    }
  }
}

export function listOpenExtraSteps(steps = buildStepIndex(GUIDE_PARTS)) {
  const anchor = steps.find((s) => s.title === WIKI_ANCHOR_TITLE);
  const cutoff = anchor?.globalIndex ?? 0;
  return steps.filter(
    (s) =>
      s.partId === 'part1' &&
      s.globalIndex <= cutoff &&
      EXTRA_ONLY_TITLES.has(s.title)
  );
}
