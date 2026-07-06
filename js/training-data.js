/**
 * Training step enrichments — sourced from Efficient Ironman Pathway Guide + skill training wiki pages.
 * Keys match step titles in guide-data.js exactly.
 */

export const TRAINING = {
  'Train Crafting to 15': {
    wiki: 'https://runescape.wiki/w/Crafting_training',
    gear: [
      { name: 'Clay from Varrock mine or Fort Forinthry workers', wiki: 'https://runescape.wiki/w/Clay' },
      { name: 'Chisel on toolbelt', wiki: 'https://runescape.wiki/w/Chisel' },
    ],
    method: [
      'Craft pottery at Lumbridge kiln: bowls/rings/pots.',
      'Bless clay ring at church; sell to Morgan for Lumbridge easy tasks.',
      'Save one unfired bowl for Dragon Slayer.',
    ],
  },
  'Train Necromancy to 24 in City of Um troll cave': {
    wiki: 'https://runescape.wiki/w/Necromancy_training',
    gear: [
      { name: 'Starter necromancy robes (Sostratus after Necromancy!)', wiki: 'https://runescape.wiki/w/Necromancer_robes' },
      { name: 'Basic ghostly ink & ritual supplies from Lupe', wiki: 'https://runescape.wiki/w/Ghostly_ink' },
    ],
    method: [
      'Fight trolls in City of Um cave with Revolution.',
      'Bank impure essence and bones for later rituals.',
    ],
  },
  'Train Magic to 55 in Shattered Worlds': {
    wiki: 'https://runescape.wiki/w/Shattered_Worlds',
    gear: [
      { name: 'Best necromancy weapon/armour you have (tier 20+ after ensoul steps)', wiki: 'https://runescape.wiki/w/Necromancy_equipment' },
      { name: 'Surge + Escape from Circus', wiki: 'https://runescape.wiki/w/Surge' },
    ],
    method: [
      'Revolution combat; disable Defence XP.',
      'Do NOT pick Feeling Pumped mutator.',
      'Complete slayer tasks inside if assigned.',
    ],
    settings: ['Revolution', 'Defence XP off', 'Avoid Feeling Pumped'],
  },
  'Train Ranged to 45 in Shattered Worlds': {
    wiki: 'https://runescape.wiki/w/Shattered_Worlds',
    gear: [
      { name: 'Kayle\'s chargebow or yew shortbow + mithril/adamant arrows', wiki: 'https://runescape.wiki/w/Yew_shortbow' },
      { name: 'Necromancy armour for tanking if needed', wiki: 'https://runescape.wiki/w/Necromancy_equipment' },
    ],
    method: ['Same settings as Magic Shattered Worlds training.'],
    settings: ['Revolution', 'Defence XP off', 'Avoid Feeling Pumped'],
  },
  'Train Runecrafting to 50': {
    wiki: 'https://runescape.wiki/w/Runespan',
    gear: [
      { name: 'Wicked hood with elemental talismans/runes', wiki: 'https://runescape.wiki/w/Wicked_hood' },
      { name: 'Runecrafting pouches when available', wiki: 'https://runescape.wiki/w/Runecrafting_pouch' },
    ],
    method: [
      'Train in Runespan (recommended in guide).',
      'Do runespheres on bottom/middle floor when available.',
    ],
  },
  'Train Firemaking to 35': {
    wiki: 'https://runescape.wiki/w/Firemaking_training',
    gear: [{ name: '290 oak logs (chop at Seers\' Village)', wiki: 'https://runescape.wiki/w/Oak_logs' }],
    method: ['Burn logs at Seers\' Village lodestone bonfire.'],
  },
  'Train Fishing to 53': {
    wiki: 'https://runescape.wiki/w/Fishing_training',
    gear: [
      { name: 'Big fishing net from Catherby', wiki: 'https://runescape.wiki/w/Big_fishing_net' },
      { name: 'Fly fishing rod + feathers after Shilo unlock', wiki: 'https://runescape.wiki/w/Fly_fishing_rod' },
    ],
    method: [
      'Fish inside Shilo Village (guide step).',
      'Later: Menaphos port fishing for 68.',
    ],
  },
  'Train Prayer to 37': {
    wiki: 'https://runescape.wiki/w/Prayer_training',
    gear: [
      { name: 'Dragon bones from green/blue dragons (HCIM-safe blues)', wiki: 'https://runescape.wiki/w/Dragon_bones' },
      { name: 'Anti-dragon shield for dragon kills', wiki: 'https://runescape.wiki/w/Anti-dragon_shield' },
    ],
    method: ['Offer bones at Chaos Temple altar in Wilderness (lever access).'],
  },
  'Train Slayer to 35': {
    wiki: 'https://runescape.wiki/w/Slayer_training',
    gear: [
      { name: 'Necromancy combat gear ~tier 30–40', wiki: 'https://runescape.wiki/w/Necromancy_equipment' },
      { name: 'Buy earmuffs & face mask from slayer master', wiki: 'https://runescape.wiki/w/Earmuffs' },
    ],
    method: ['Train with the Raptor at Fort Forinthry unless on Reaper task.'],
  },
  'Train Slayer to 40': {
    wiki: 'https://runescape.wiki/w/Slayer_training',
    gear: [{ name: 'Same as Slayer 35; upgrade necromancy gear if available', wiki: 'https://runescape.wiki/w/Slayer_equipment' }],
    method: ['Continue Raptor or Reaper tasks post-45 Slayer.'],
  },
  'Train Thieving to 41': {
    wiki: 'https://runescape.wiki/w/Thieving_training',
    gear: [{ name: 'Food from Ardougne bakery stalls', wiki: 'https://runescape.wiki/w/Bread' }],
    method: ['Pickpocket progression per thieving training page (post-rework).'],
  },
  'Train Thieving to 53': {
    wiki: 'https://runescape.wiki/w/Thieves%27_Guild',
    gear: [
      { name: 'Lockpick from Dodgy Derek for southern doors', wiki: 'https://runescape.wiki/w/Lockpick' },
    ],
    method: ['Open northern & southern cell doors; world hop when exhausted.'],
  },
  'Train Hunter to 29 (early route)': {
    wiki: 'https://runescape.wiki/w/Hunter_training',
    gear: [
      { name: 'Bird snares from Ayleth Beaststalker', wiki: 'https://runescape.wiki/w/Bird_snare' },
      { name: 'Activate Divination echo for memory strands → Sign of the porter IV later', wiki: 'https://runescape.wiki/w/Memorial_to_Guthix' },
    ],
    method: [
      'Crimson swift (Taverley) → Cerulean twitch (Rellekka) → Tropical wagtail (north Oo\'glog).',
    ],
  },
  'Train Hunter to 45': {
    wiki: 'https://runescape.wiki/w/Hunter_training',
    gear: [{ name: 'Best traps you can use at level', wiki: 'https://runescape.wiki/w/Box_trap' }],
    method: ['Follow Hunter training page for best creature at your level.'],
  },
  'Train Fletching to 25': {
    wiki: 'https://runescape.wiki/w/Fletching_training',
    gear: [{ name: 'Oak logs + knife on toolbelt', wiki: 'https://runescape.wiki/w/Knife' }],
    method: ['Fletch oak shortbow (u) while doing oak logs for other steps.'],
  },
  'Train Firemaking to 50': {
    wiki: 'https://runescape.wiki/w/Firemaking_training',
    gear: [{ name: 'Willow logs from bank or Seers\' area', wiki: 'https://runescape.wiki/w/Willow_logs' }],
    method: ['Burn willow logs on bonfire.'],
  },
  'Train Mining to 60 & Crafting to 61': {
    wiki: 'https://runescape.wiki/w/Mining_training',
    gear: [
      { name: 'Adamant/rune pickaxe from Nurmof', wiki: 'https://runescape.wiki/w/Adamant_pickaxe' },
      { name: 'Gem bag (2000 DG tokens) — buy before/during this grind', wiki: 'https://runescape.wiki/w/Gem_bag' },
    ],
    method: [
      'Mine uncommon gem rocks in Al Kharid.',
      'Bank via War\'s Retreat tele or Archaeology journal.',
      'Cut gems for Crafting XP.',
    ],
  },
  'Train Prayer to 47': {
    wiki: 'https://runescape.wiki/w/Prayer_training',
    gear: [
      { name: 'Dragon bones (green/blue dragons)', wiki: 'https://runescape.wiki/w/Dragon_bones' },
      { name: 'Underworld Grimoire 1 — auto-bank bones', wiki: 'https://runescape.wiki/w/Underworld_Grimoire' },
    ],
    method: ['Chaos altar in Wilderness; Ivar colossal bones if Havenhythe unlocked.'],
  },
  'Train Necromancy to 60': {
    wiki: 'https://runescape.wiki/w/Necromancy_training',
    gear: [
      { name: 'Upgrade armour/weapons every 10 levels via ensoul materials', wiki: 'https://runescape.wiki/w/Necromancy_equipment' },
      { name: 'Complete Kili\'s Knowledge tiers before each upgrade', wiki: 'https://runescape.wiki/w/Kili%27s_Knowledge' },
    ],
    method: ['Slayer/combat with necromancy; rituals for gear upgrades.'],
  },
  'Train Smithing to 50': {
    wiki: 'https://runescape.wiki/w/Artisans%27_Workshop',
    gear: [
      { name: 'Ores from Mining or Fort Forinthry', wiki: 'https://runescape.wiki/w/Mining' },
      { name: 'Artisans\' Workshop — world 70 recommended', wiki: 'https://runescape.wiki/w/Artisans%27_Workshop' },
    ],
    method: [
      '40–50: 248 adamantite + luminite → burial sets.',
      'See pathway miniguide for full 40–80 route.',
    ],
  },
  'Train Thieving to 62': {
    wiki: 'https://runescape.wiki/w/Thieving_training',
    gear: [{ name: 'Food; safecracking when unlocked', wiki: 'https://runescape.wiki/w/Safecracking' }],
    method: ['Low-level pickpocket targets (faster than guild doors post-rework).'],
  },
  'Train Thieving to 90': {
    wiki: 'https://runescape.wiki/w/Thieving_training',
    gear: [{ name: 'Master thief\'s lockpick from safecracking (Desert Treasure prep)', wiki: 'https://runescape.wiki/w/Master_thief%27s_lockpick' }],
    method: ['Safecracking / high-level pickpocket per training page.'],
  },
  'Train Fishing to 68': {
    wiki: 'https://runescape.wiki/w/Fishing_training',
    gear: [
      { name: 'Menaphos port faction active; deposit box', wiki: 'https://runescape.wiki/w/Menaphos' },
      { name: 'Optional Prawn broker 63+ for baitless fishing', wiki: 'https://runescape.wiki/w/Prawn_broker' },
    ],
    method: ['Fish in Menaphos Port district for reputation + XP.'],
  },
  'Train Agility to 56': {
    wiki: 'https://runescape.wiki/w/Agility_training',
    gear: [
      { name: 'Demonic Skull (Wilderness course — regular ironman)', wiki: 'https://runescape.wiki/w/Demonic_Skull' },
      { name: 'HCIM: Northern Anachronia course 30–50+', wiki: 'https://runescape.wiki/w/Anachronia_Agility_Course' },
    ],
    method: ['Wilderness Agility Course (regular) or Northern Anachronia (HCIM).'],
  },
  'Train Hunter to 63 — Grey chinchompas at Eagles\' Peak': {
    wiki: 'https://runescape.wiki/w/Grey_chinchompa',
    gear: [
      { name: 'Box traps', wiki: 'https://runescape.wiki/w/Box_trap' },
      { name: 'Eagles\' Peak lodestone', wiki: 'https://runescape.wiki/w/Eagles%27_Peak' },
    ],
    method: [
      'Catch grey chinchompas north of Eagles\' Peak.',
      'Bank chins for Ranged training AND PoF (1/1500 unchecked drop per trap).',
    ],
  },
  'Train Hunter to 70 — Red chinchompas north of Oo\'glog': {
    wiki: 'https://runescape.wiki/w/Red_chinchompa',
    gear: [{ name: 'Box traps; Oo\'glog lodestone', wiki: 'https://runescape.wiki/w/Red_chinchompa' }],
    method: [
      'Red chins north of Oo\'glog for Ranged + PoF breeding.',
      'Alternative: Het\'s Oasis whirligigs (~120–160k XP/h).',
    ],
  },
  'Train Hunter to 50 (guide checkpoint)': {
    wiki: 'https://runescape.wiki/w/Hunter_training',
    method: ['Continue box trap methods or Het\'s Oasis whirligigs.'],
  },
  'Train Hunter to 62 (guide checkpoint)': {
    wiki: 'https://runescape.wiki/w/Hunter_training',
    method: ['Croesus Hunter trash runs or red chins.'],
  },
  'Train Magic to 80': {
    wiki: 'https://runescape.wiki/w/Magic_training',
    gear: [
      { name: '65–75: Guthix staff + Guthix cape (Mage Arena)', wiki: 'https://runescape.wiki/w/Guthix_staff' },
      { name: '75–80: Vanquish (magic) from May', wiki: 'https://runescape.wiki/w/Vanquish' },
      { name: '75 Magic: unlock Tendril abilities from Terry Balando', wiki: 'https://runescape.wiki/w/Tendril' },
    ],
    method: ['Abyss combat, Shattered Worlds, or Arc contracts.'],
  },
  'Train Defence to 80': {
    wiki: 'https://runescape.wiki/w/Defence_training',
    gear: [
      { name: '65–75: Guthix staff method (shared with Magic)', wiki: 'https://runescape.wiki/w/Guthix_staff' },
      { name: '75–80: Vanquish (magic)', wiki: 'https://runescape.wiki/w/Vanquish' },
    ],
    method: ['Same as Magic training — shared combat method.'],
  },
  'Train Ranged to 80': {
    wiki: 'https://runescape.wiki/w/Ranged_training',
    gear: [
      { name: '45–55: Grey chinchompa + off-hand adamant crossbow', wiki: 'https://runescape.wiki/w/Grey_chinchompa' },
      { name: '55–80: Red chinchompa + off-hand rune crossbow', wiki: 'https://runescape.wiki/w/Red_chinchompa' },
      { name: 'Buy off-hand cbows in Keldagrim (Part 2 step)', wiki: 'https://runescape.wiki/w/Crossbow' },
    ],
    method: ['Chinchompa training at catacombs or slayer tasks.'],
  },
  'Train Attack to 80': {
    wiki: 'https://runescape.wiki/w/Attack_training',
    gear: [
      { name: '50–60: Rune halberd (Keldagrim quartermaster)', wiki: 'https://runescape.wiki/w/Rune_halberd' },
      { name: '60–75: Dragon halberd', wiki: 'https://runescape.wiki/w/Dragon_halberd' },
      { name: '75–80: Vanquish (melee)', wiki: 'https://runescape.wiki/w/Vanquish' },
    ],
    method: ['Shared combat training methods with Strength.'],
  },
  'Train Strength to 80': {
    wiki: 'https://runescape.wiki/w/Strength_training',
    gear: [
      { name: '50–75 & 75–80: Vanquish (melee)', wiki: 'https://runescape.wiki/w/Vanquish' },
    ],
    method: ['Halberd/Vanquish melee — do NOT train with bronze gear at this stage.'],
  },
  'Train Summoning to 37': {
    wiki: 'https://runescape.wiki/w/Summoning_training',
    gear: [{ name: 'Charms from dagannoths or slayer', wiki: 'https://runescape.wiki/w/Charms' }],
    method: ['Use Summoning calculator for charm counts.'],
  },
  'Train Summoning to 75': {
    wiki: 'https://runescape.wiki/w/Summoning_training',
    gear: [{ name: 'Waterbirth dagannoths or slayer charms', wiki: 'https://runescape.wiki/w/Dagannoth' }],
    method: ['Pouch batching at Obelisk.'],
  },
  'Train Prayer to 75': {
    wiki: 'https://runescape.wiki/w/Prayer_training',
    gear: [
      { name: 'Noted dragon bones from Vindicta & Gorvek', wiki: 'https://runescape.wiki/w/Vindicta' },
      { name: 'HCIM: Ectofuntus instead of Wilderness altar', wiki: 'https://runescape.wiki/w/Ectofuntus' },
    ],
    method: ['Mass altar use with bonecrusher + demon slayer prayer.'],
  },
  'Train Magic to 90': {
    wiki: 'https://runescape.wiki/w/Magic_training',
    gear: [
      { name: 'Vanquish or better magic weapon', wiki: 'https://runescape.wiki/w/Vanquish' },
      { name: 'Vampyrism spell (69 Magic) for sustain post-aura removal', wiki: 'https://runescape.wiki/w/Vampyrism' },
    ],
    method: ['Slayer, Abyss, Shattered Worlds, or Arc contracts.'],
  },
  'Train Defence to 90': { wiki: 'https://runescape.wiki/w/Defence_training', gear: [{ name: 'Vanquish magic setup', wiki: 'https://runescape.wiki/w/Vanquish' }], method: ['Shared with Magic 90.'] },
  'Train Necromancy to 90': {
    wiki: 'https://runescape.wiki/w/Necromancy_training',
    gear: [{ name: 'Upgrade gear via Smithing/Crafting as you level', wiki: 'https://runescape.wiki/w/Necromancy_equipment' }],
    method: ['Combat + ritual upgrades every tier.'],
  },
  'Train Ranged to 90': {
    wiki: 'https://runescape.wiki/w/Ranged_training',
    gear: [{ name: 'Red chins + ascensions path later; royal crossbow etc.', wiki: 'https://runescape.wiki/w/Ranged_training' }],
    method: ['Chins + off-hand crossbow at high levels.'],
  },
  'Train Attack to 90': {
    wiki: 'https://runescape.wiki/w/Attack_training',
    gear: [{ name: 'Dragon halberd → Vanquish → tier 90 weapons from PvM', wiki: 'https://runescape.wiki/w/Vanquish' }],
    method: ['Slayer/PvM with halberd or better.'],
  },
  'Train Strength to 90': {
    wiki: 'https://runescape.wiki/w/Strength_training',
    gear: [{ name: 'Vanquish melee through 80; upgrade to PvM weapons', wiki: 'https://runescape.wiki/w/Vanquish' }],
    method: ['Never grind 90 Strength on bronze — use Vanquish/halberd path from Part 2.'],
  },
  'Train Woodcutting to 61': {
    wiki: 'https://runescape.wiki/w/Woodcutting_training',
    gear: [
      { name: 'Best hatchet on toolbelt (rune from Champions\' Guild step)', wiki: 'https://runescape.wiki/w/Rune_hatchet' },
      { name: 'Acadia logs in Menaphos Imperial', wiki: 'https://runescape.wiki/w/Acadia_logs' },
    ],
    method: ['Chop acadia; bank at Imperial deposit box.'],
  },
  'Train Woodcutting to 79': {
    wiki: 'https://runescape.wiki/w/Woodcutting_training',
    gear: [{ name: 'Dragon hatchet from Dagannoth Rex (earlier step)', wiki: 'https://runescape.wiki/w/Dragon_hatchet' }],
    method: ['Acadia or higher-tier trees per training page.'],
  },
  'Train Fletching to 52': {
    wiki: 'https://runescape.wiki/w/Fletching_training',
    gear: [{ name: 'Acadia logs from Menaphos', wiki: 'https://runescape.wiki/w/Acadia_logs' }],
    method: ['Pathway: 14250 steel arrows from acadia logs + smithing arrowheads.'],
  },
  'Train Firemaking to 75': {
    wiki: 'https://runescape.wiki/w/Firemaking_training',
    gear: [{ name: 'Maple & acadia logs from bank', wiki: 'https://runescape.wiki/w/Maple_logs' }],
    method: ['Burn logs on bonfire.'],
  },
  'Train Smithing to 80': {
    wiki: 'https://runescape.wiki/w/Artisans%27_Workshop',
    gear: [{ name: 'Burial sets at Artisans\' Workshop (world 70)', wiki: 'https://runescape.wiki/w/Burial_armour' }],
    method: [
      '50–70: runite burial sets.',
      '70–80: necronium burial sets.',
      'Buy Solemn Smith I, Golden Cannon, Royale Cannon rewards in order.',
    ],
  },
  'Train Crafting to 76': {
    wiki: 'https://runescape.wiki/w/Crafting_training',
    gear: [
      { name: 'Gem bag (upgraded) from DG store', wiki: 'https://runescape.wiki/w/Gem_bag' },
      { name: 'Al Kharid uncommon gem rocks', wiki: 'https://runescape.wiki/w/Gem_rock' },
    ],
    method: ['Mine ~17000 uncut gems; cut all for XP.'],
  },
  'Train Agility to 77': {
    wiki: 'https://runescape.wiki/w/Agility_training',
    gear: [{ name: 'Wilderness course + demonic skull OR Het\'s Oasis (HCIM)', wiki: 'https://runescape.wiki/w/Het%27s_Oasis' }],
    method: ['Per pathway Part 5 method split.'],
  },
  'Train Slayer to 67': {
    wiki: 'https://runescape.wiki/w/Slayer_training',
    gear: [{ name: 'Best combat gear available (~80s combat stats)', wiki: 'https://runescape.wiki/w/Slayer_equipment' }],
    method: ['Reaper tasks; reclaim glossy lamp at 70 Slayer in Guthix Cave.'],
  },
  'Train Construction to 70 then 79': {
    wiki: 'https://runescape.wiki/w/Construction_training',
    gear: [
      { name: 'Steel/rune bars → nails; mahogany planks from kingdom', wiki: 'https://runescape.wiki/w/Construction' },
    ],
    method: ['Construction contracts OR Fort Forinthry upgrades.'],
  },
  'Train Hunter to 76': {
    wiki: 'https://runescape.wiki/w/Hunter_training',
    gear: [{ name: 'Logs for Croesus; black salamanders on Entrana post-quest', wiki: 'https://runescape.wiki/w/Black_salamander' }],
    method: ['Croesus Hunter trash runs (solo, 25 logs, rot spores).'],
  },
  'Train Herblore to 80': {
    wiki: 'https://runescape.wiki/w/Herblore_training',
    gear: [{ name: 'Penguin points; Helwyr lantadyme for antifire/super magic', wiki: 'https://runescape.wiki/w/Herblore_training' }],
    method: ['Penguin Hide and Seek XP on Herblore recommended in guide.'],
  },
  'Train Archaeology to 74': {
    wiki: 'https://runescape.wiki/w/Archaeology_training',
    gear: [{ name: 'Mattock upgrades; mysteries when available', wiki: 'https://runescape.wiki/w/Mattock' }],
    method: ['Excavate hotspots; prioritise mysteries/collections per miniguide.'],
  },
  'Train Crafting to 83': {
    wiki: 'https://runescape.wiki/w/Crafting_training',
    gear: [{ name: 'Prifddinas harps after Plague\'s End', wiki: 'https://runescape.wiki/w/Crystal_singing' }],
    method: ['Harps in Prifddinas.'],
  },
  'Train Agility to 80': {
    wiki: 'https://runescape.wiki/w/Agility_training',
    method: ['Wilderness or Het\'s Oasis per account type.'],
  },
  'Train Prayer to 80': {
    wiki: 'https://runescape.wiki/w/Prayer_training',
    gear: [{ name: 'Vyrewatch Sunspear route; cleansing crystals in Prif', wiki: 'https://runescape.wiki/w/Sunspear' }],
    method: ['Post-Plague\'s End prayer methods.'],
  },
  'Train Slayer to 80': {
    wiki: 'https://runescape.wiki/w/Slayer_training',
    gear: [{ name: 'Tier 80+ combat gear', wiki: 'https://runescape.wiki/w/Slayer_equipment' }],
    method: ['High-tier slayer tasks and bosses.'],
  },
  'Train Prayer to 95': {
    wiki: 'https://runescape.wiki/w/Prayer_training',
    gear: [
      { name: 'Vindicta noted bones; vyres; cleansing crystals', wiki: 'https://runescape.wiki/w/Vindicta' },
      { name: 'Ivar colossal bones (Havenhythe)', wiki: 'https://runescape.wiki/w/Ivar,_King_of_Bones' },
    ],
    method: ['Combine altar methods from Part 6.'],
  },
  'Train Summoning to 99': {
    wiki: 'https://runescape.wiki/w/Summoning_training',
    gear: [{ name: 'Arch-Glacor charms (recommended); Croesus charms', wiki: 'https://runescape.wiki/w/Arch-Glacor' }],
    method: ['Batch pouches at obelisk.'],
  },
  'Train Archaeology to 95': {
    wiki: 'https://runescape.wiki/w/Archaeology_training',
    method: ['Red Rum Relics I collections; Howl\'s Workshop mysteries.'],
  },
  'Prep spiky vambraces: leather, kebbit claws & vambraces': {
    wiki: 'https://runescape.wiki/w/Kebbit_claws',
    gear: [
      { name: 'Cowhide → tan at Al Kharid → leather vambraces', wiki: 'https://runescape.wiki/w/Leather' },
      { name: 'Deadfall trap + knife (Burthorpe hunter shop)', wiki: 'https://runescape.wiki/w/Deadfall_trap' },
    ],
    method: [
      'Train Hunter on crimson swifts (Taverley) to 23 if needed.',
      'Hunt Wild kebbits in Feldip Hunter area for claws.',
    ],
  },
  'Craft spiky vambraces (as Ranged allows)': {
    wiki: 'https://runescape.wiki/w/Spiky_vambraces',
    gear: [
      { name: 'Kebbit claws from prep step', wiki: 'https://runescape.wiki/w/Kebbit_claws' },
      { name: 'Leather vambraces + needle/thread', wiki: 'https://runescape.wiki/w/Leather_vambraces' },
    ],
    method: [
      'Attach claws to leather vambraces, then upgrade green → blue → red → black → royal as stats allow.',
    ],
  },
};

/** Boss/gear unlock milestones inserted before high-level combat training */
export const GEAR_MILESTONES = [
  {
    beforeTitle: 'Craft spiky vambraces (as Ranged allows)',
    items: [
      { name: 'Kebbit claws + leather vambraces (prep step)', wiki: 'https://runescape.wiki/w/Kebbit_claws', minCombat: 0 },
    ],
  },
  {
    beforeTitle: 'Train Magic to 55 in Shattered Worlds',
    items: [
      { name: 'Necromancy tier 20 weapons/armour (ensoul rituals)', wiki: 'https://runescape.wiki/w/Necromancy_equipment', minCombat: 0 },
    ],
  },
  {
    beforeTitle: 'Train Ranged to 45 in Shattered Worlds',
    items: [
      { name: 'Yew shortbow + adamant/mithril arrows (Brian\'s Archery)', wiki: 'https://runescape.wiki/w/Yew_shortbow', minCombat: 0 },
    ],
  },
  {
    beforeTitle: 'Train Magic to 80',
    items: [
      { name: 'Guthix staff + cape (Mage Arena miniquest)', wiki: 'https://runescape.wiki/w/Guthix_staff', minCombat: 50 },
      { name: 'Vanquish from May (Part 2)', wiki: 'https://runescape.wiki/w/Vanquish', minCombat: 60 },
    ],
  },
  {
    beforeTitle: 'Train Ranged to 80',
    items: [
      { name: 'Grey chinchompas banked (Hunter 63 step)', wiki: 'https://runescape.wiki/w/Grey_chinchompa', minCombat: 0 },
      { name: 'Off-hand adamant/rune crossbow (Keldagrim)', wiki: 'https://runescape.wiki/w/Adamant_crossbow', minCombat: 0 },
    ],
  },
  {
    beforeTitle: 'Train Attack to 80',
    items: [
      { name: 'Rune halberd → dragon halberd (Keldagrim)', wiki: 'https://runescape.wiki/w/Dragon_halberd', minCombat: 60 },
    ],
  },
  {
    beforeTitle: 'Train Prayer to 75',
    items: [
      { name: 'Unlock Vindicta (after questing progression)', wiki: 'https://runescape.wiki/w/Vindicta', minCombat: 85 },
    ],
  },
  {
    beforeTitle: 'Train Woodcutting to 79',
    items: [
      { name: 'Dragon hatchet (Dagannoth Rex)', wiki: 'https://runescape.wiki/w/Dragon_hatchet', minCombat: 70 },
    ],
  },
];

export function getTrainingBlock(title) {
  return TRAINING[title] || null;
}

export function getGearBefore(title) {
  return GEAR_MILESTONES.find((g) => g.beforeTitle === title)?.items || [];
}

export function isTrainingStep(title) {
  return title.startsWith('Train ') || TRAINING[title];
}
