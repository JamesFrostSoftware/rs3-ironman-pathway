/**
 * Exact material breakdowns keyed by step title (matches guide-data.js exactly).
 * Shown below step notes in the UI — smelt/craft/gather math spelled out.
 *
 * RS3 recipe constants (wiki bundle — no live wiki):
 * - Nails (steel/mithril/rune): 75 per bar (infobox output1qty)
 * - Steel bar: 1 iron ore + 1 coal
 * - Mithril bar: 1 mithril ore + 1 coal
 * - Rune bar: 1 runite ore + 1 luminite
 * - Iron bar: 1 iron ore (bar page empty in bundle; same post-rework pattern as steel)
 * - Mithril bar: 1 mithril ore + 1 coal (bar page empty; nails recipe confirms bar input)
 * - Stone wall segment: 4 limestone bricks (Construction/training — Fort stonecutter)
 * - Kitchen T2 + Chapel T2: 22 + 24 acadia frames, 6 stone wall segments each (Construction/training)
 */

export const STEP_MATERIALS = {
  'Teleport to Burthorpe lodestone': [
    '28 flax → bowstrings (sell to Jack Oval).',
    'Bronze: mine tin + copper at Burthorpe → smelt bronze bars → ore box + 4 bronze wires.',
    'Buy 1 bag of salt from Turael.',
  ],
  'Purchase Lumbridge general store supplies': ['6 buckets', '2 pots', '2 tinderboxes'],
  'Purchase from Beefy Bill': ['10 redberries', '1 pie dish', '1 jug of water'],
  'Fill 4 buckets with milk': ['4× bucket of milk (4 uses of empty buckets from store step)'],
  'Druidic Ritual': ['Free quest kit from Jatix + buy 20 vials of water (Varrock/herblore shop)'],
  'Mine and smelt 2 iron bars for The Knight\'s Sword': [
    '2 iron bars ← 2 iron ore (no coal).',
    'Lumbridge SW mine + furnace.',
  ],
  'The Knight\'s Sword': [
    '1 redberry pie now (1 pie dish + 3 redberries + flour/water from prior shopping).',
    'Bake 6 extra redberry pies for later quests (18 more redberries + 6 dishes).',
    '2 iron bars (from prep step).',
  ],
  'Cut and burn 20 logs; pick up ashes': ['20 logs (any tree) + tinderbox → 20 ashes'],
  'Necromancy!': [
    'Bank big bones from trolls/chickens.',
    'Lupe (City of Um): basic ghostly ink, impure essence, ritual bones — buy starter pack for first rituals.',
  ],
  'Perform 7 lesser necroplasm rituals': [
    '12 basic ghostly ink (Lupe).',
    '~1400 weak necroplasm from offering chicken bones at ritual spot.',
    'Keep 1 impure essence for Easy Underworld achievements.',
  ],
  'Gather 116 wooden planks, 120 oak planks, 386 limestone bricks': [
    'Logs → sawmill: 116 regular planks, 120 oak planks.',
    '386 limestone bricks: Silvarea quarry (~386 limestone + coins) OR Fort supplies 250/day × 2 days.',
  ],
  'Mine 42 iron + 14 coal; smelt 14 iron & steel bars': [
    'Mine: 42 iron ore + 14 coal (Lumbridge SW).',
    'Smelt 14 iron bars (14 iron ore, no coal).',
    'Smelt 14 steel bars (14 iron ore + 14 coal) — uses remaining ores.',
  ],
  'Kill hill giants for 25 big bones': ['25× big bones (Edgeville dungeon or Boneyard)'],
  'Perform 25 lesser communion rituals (big bones → 50 souls)': [
    '25 big bones (prep step).',
    '46 basic ghostly ink (Lupe).',
  ],
  'Buy needle, thread & spider silk from Varrock': [
    '1 needle + thread (craft shop).',
    '28× spider silk (Zaff).',
    '10× thread for ensoul rituals (buy spool).',
  ],
  'Perform 38 lesser ensoul material rituals': [
    '28 lesser ensouled cloth (from spider silk rituals).',
    '10 thread.',
  ],
  'Smith 150 steel nails for PoF small pens': [
    '150 nails = 2 steel bars (75 nails/bar).',
    'Smelt 2 steel bars: 2 iron ore + 2 coal.',
    'One small pen build uses 75 nails (1 bar) + 10 oak planks — bank spare 75 nails.',
  ],
  'Purchase small pen deed (I) from Farmers\' Market': [
    'Build cost: 10 oak planks + 75 steel nails (from nail prep step).',
    'Deed cost: beans from tutorial animals.',
  ],
  'Gather marigold & onion seeds for Farming 27': [
    'Olivia\'s Seed Market (Draynor): marigold seeds + onion seeds (~20+ each).',
    'Compost or supercompost + empty buckets for protection payments.',
    'Optional: pickpocket Master Farmer for extra seeds.',
  ],
  'Train Farming to 27 (marigolds + onions)': [
    'Plant seeds from gather step on allotment patches (marigolds + onions).',
    'Pay farmers to protect; harvest and replant until Farming 27.',
  ],
  'PoF: purchase small pen deed (II) at Farming 27': [
    'Buy from Farmers\' Market when Farming 27+.',
    'Upgrades small pen to tier 2 (deed I is tier 1 at Farming 17).',
  ],
  'Gather Rellekkan cream rabbit breeding pair': [
    'Rellekka rabbit burrows: kill until unchecked male + female Rellekkan cream rabbit.',
    'OR use tutorial rabbits from Granny Potterington.',
  ],
  'Set up pre-64 PoF: breeding pen + small pens': [
    'Breeding pen: place rabbit pair from gather step.',
    'Small pens: move adolescents; sell for beans (keep breeding pair).',
    'Feed animals woad leaves (1010 woad prep step).',
  ],
  'Purchase 1010 woad leaves from Wyson (Falador Park)': [
    '1010 woad leaves (~26k gp — cheapest PoF food bulk buy).',
    'Buy before placing animals in pens.',
  ],
  'Gather logs & limestone for Fort Forinthry': [
    'Chop: 96 regular, 120 oak, 288 willow, 480 teak, 432 maple logs.',
    '192 limestone bricks (quarry or Fort supplies).',
    'Sawmill all logs → planks at Fort or portable sawmill.',
  ],
  'Make Goblin Diplomacy dyes with Aggie': [
    'Red dye: 3 redberries + 5 coins (Beefy Bill redberries).',
    'Yellow dye: 2 onions + 5 coins (Draynor onion step).',
    'Blue dye: 2 woad leaves + 5 coins (Wyson bulk buy).',
  ],
  'Get Reaper assignment from Death': [
    '15 logs (willow/oak from bank).',
    'Sticky fungus: pick inside Croesus instance.',
    'Super restores: Mazcab merchants (sail from Port Sarim).',
  ],
  'Purchase runes from Aubury\'s Rune Shop': ['300 each: fire, water, air, earth runes'],
  'Purchase yew shortbow + arrows from Brian\'s Archery Supplies': ['1 yew shortbow + arrows (adamant or mithril)'],
  'Purchase runes from Void Knight Magic Store': ['1000 each: fire, water, air, earth runes'],
  'Prep spiky vambraces: leather, kebbit claws & vambraces': [
    '1 cowhide → tan → leather vambraces (needle + thread).',
    'Deadfall trap + knife (Ayleth Beaststalker, Burthorpe).',
    '6+ kebbit claws (Wild kebbits, Feldip — Hunter 23).',
    'Train Hunter on crimson swifts (Taverley) if below 23.',
  ],
  'Craft spiky vambraces (as Ranged allows)': [
    'Attach 1 claw per vambraces tier (leather → green → blue → red → black → royal).',
    '6 claws for full leather→royal spiky set.',
  ],
  'Gather 768 Acadia logs in Menaphos Imperial District': ['768 acadia logs (Imperial faction active for rep)'],
  'Sawmill acadia planks & craft stone wall segments': [
    '552 acadia planks from 768 logs (portable sawmill — rest banked for later Fort).',
    '46 acadia frames (Kitchen T2 ×22 + Chapel T2 ×24): 3 refined acadia planks each → 138 refined → 552 acadia planks (4:1 at Fort).',
    '12 stone wall segments: 48 limestone bricks at Fort stonecutter (4 bricks per segment).',
  ],
  'Build Fort Forinthry: Botanist\'s Workbench T1': [
    'Requires Ancient Awakening quest complete (original pathway step ~228).',
    '4 acadia frames + 6 stone wall segments at Fort building table.',
  ],
  'Build Fort Forinthry: Kitchen T2, Chapel T2': [
    '552 acadia planks → 46 acadia frames + 12 stone wall segments (from sawmill prep).',
  ],
  'Train Firemaking to 35': ['290 oak logs → burn at Seers\' Village bonfire'],
  'Obtain 5 willow logs': ['5 willow logs'],
  'Go Shopping Funch\'s Fine Groceries': [
    '2 lemon, 1 orange, 1 pineapple, 1 cocktail glass, 1 cocktail shaker, 1 vodka (skip if Dig Site fruit blast).',
  ],
  'Observatory Quest': ['1 bucket of sand + 1 soda ash → molten glass on furnace'],
  'Prep Shades of Mort\'ton: flamtaer & sacred oil': [
    '20× flamtaer bracelet: 20 jade + 20 silver bars → jade bracelets (Craft 29); Lvl-2 Enchant each (3 air + 1 cosmic).',
    'Flamtaer hammer: buy from Rasolo or Razmire General Store (13,000 gp).',
    'Extra sacred oil for Legacy of Seergaze (olive oil + pyre logs at temple).',
    'World 88 recommended for temple minigame.',
  ],
  'Big Chompy Bird Hunting': ['3 extra raw chompys beyond quest requirement (bank for later)'],
  'Purchase mystic wand and mystic orb from Marvellous Mysticism': ['1 mystic wand + 1 mystic orb (Magic 60 shop)'],
  'Prep Dragon Slayer: 50 dragon bones & combat gear': [
    '50× dragon bones (blue dragons, Taverley dungeon + anti-dragon shield).',
    '1 rune battleaxe + full adamant armour set (shops).',
  ],
  'Dragon Slayer': [
    '50 dragon bones → offer at Chaos altar for Prayer XP (if not done in prep).',
    'Combat gear from prep step for Elvarg.',
  ],
  'Train Slayer to 35': ['Buy earmuffs + facemask from any Slayer master'],
  'Smoking Kills': [
    'Slayer helmet parts: black mask, earmuffs, facemask, nose peg, spiny helmet, reinforced goggles.',
    'All from Slayer Tower drops or Slayer masters (earmuffs/facemask shops).',
    'Crafting 25 to assemble.',
  ],
  'Purchase runes from Lundail\'s Arena-side Rune Shop': ['100 law runes', '100 cosmic runes', '500 air runes'],
  'Smith 150 mithril nails for PoF medium pen': [
    '150 nails = 2 mithril bars (75 nails/bar).',
    'Smelt 2 mithril bars: 2 mithril ore + 2 coal.',
    'Build also needs 15 teak planks per medium pen.',
  ],
  'PoF: purchase medium pen deed (I) when you reach 35 Farming': [
    '15 teak planks + 150 mithril nails per pen build.',
    'Buy sheep (next step) before filling pens.',
  ],
  'Buy sheep for medium pens (Farmers\' Market)': [
    '4× common white sheep per medium pen (beans from rabbit sales).',
    'Place sheep immediately after building the pen.',
  ],
  'PoF: purchase large pen deed (I) when you reach 49 Farming': [
    '20 mahogany planks + 225 rune nails per pen (see mahogany prep after Monkey Madness).',
    'Buy bulls (next step) before filling pens.',
  ],
  'Buy bulls for large pens (Farmers\' Market)': [
    '3× Hereford cattle per large pen (beans from sheep/rabbit sales).',
    'Place bulls immediately after building the pen.',
  ],
  'Chop mahogany & smith rune nails for PoF large pen': [
    '20 mahogany logs → planks on Ape Atoll (post–Monkey Madness).',
    '225 rune nails = 3 rune bars (75 nails/bar).',
    'Smelt 3 rune bars: 3 runite ore + 3 luminite.',
  ],
  'Train Fletching to 25': ['Oak logs + knife → oak shortbow (u) — use logs from bank/gather steps'],
  'Buy adamant & rune pickaxes; train DG for 2000 tokens': ['Adamant pickaxe + rune pickaxe (Nurmof) before DG grind'],
  'Buy box traps for chinchompa hunting': ['5–10 box traps (hunter shops — Ayleth / Nardah)'],
  'Gather grey chinchompas for PoF pens': [
    'During Eagles\' Peak hunt: bank all caught grey chins.',
    '1/1500 per trap: unchecked grey chinchompa — keep for breeding unlock.',
  ],
  'Train Hunter to 63 — Grey chinchompas at Eagles\' Peak': ['Box traps + food. Bank all grey chins for Part 2 Ranged + PoF.'],
  'PoF: place grey chinchompas in small pens (Farming 54+)': [
    'Place banked grey chins from gather/hunt steps.',
    'Requires Small pen breeding unlock from bean shop + woad leaves for food.',
  ],
  'Train Hunter to 70 — Red chinchompas north of Oo\'glog': ['Box traps. Bank red chins for Part 2 Ranged + PoF breeding.'],
  'Gather spider eggs for PoF breeding (Lumbridge Catacombs)': [
    'Kill spiders in Lumbridge Catacombs until you have spider eggs.',
    'Check eggs at PoF pens → spirit spiders for breeding pen.',
  ],
  'PoF post-64: spider breeding pair from Lumbridge Catacombs': [
    'Place checked spirit spiders from egg gather step into breeding pen.',
  ],
  'Gather red chinchompas & yaks for PoF pen setup': [
    'Red chins: breeding pair from Oo\'glog hunt bank.',
    'Yaks/dragons/red chins: breeding pairs from Adam Antite (shop unlock step).',
  ],
  'PoF post-unlocks pen setup': [
    'Breeding pen: spiders → yaks/dragons.',
    'Small pens: red chins. Medium: bred spiders. Large: yaks > dragons.',
  ],
  'Train Prayer to 47': ['Dragon bones at Chaos altar — farm blues/greens as needed'],
  'Train Smithing to 50': ['See miniguide: ~248 adamantite + luminite burial sets at Artisans\' Workshop'],
  'Buy adamant crossbow, rune crossbow, rune halberd & dragon halberd': [
    'Adamant + rune crossbows (Keldagrim/Varrock shops).',
    'Rune halberd (Keldagrim quartermaster).',
    'Dragon halberd (Heathor, Oo\'glog — after Regicide).',
  ],
  'Gather Animal Magnetism quest items': [
    'Hard leather: 1 cowhide + needle/thread.',
    'Polished buttons: H.A.M. storeroom or pickpocket.',
    '5 iron bars ← 5 iron ore.',
    '1 steel bar ← 1 iron ore + 1 coal.',
    '200 steel nails ← 3 steel bars (225 nails; 75 nails/bar) = 3 iron ore + 3 coal.',
    '30 undead chickens (farm west Ardougne).',
    '3 oak planks.',
    'Ghostspeak amulet (Restless Ghost).',
    'Mithril hatchet on toolbelt (Bob shopping step).',
  ],
  'Farm 63M Shattered Worlds anima — Bladed Dive': [
    '63,000,000 anima from Shattered Worlds (continue Part 1 SW training).',
    'Buy Bladed Dive from SW reward shop when banked.',
  ],
  'Collect 4 torn god pages for Illuminate': [
    '1 page each: Guthix, Saradomin, Zamorak, Bandos emissaries (reputation grind).',
  ],
  'Illuminate god book': [
    'God book (Horror from the Deep) + 4 torn pages + One Piercing Note.',
    '60 Crafting + 60 Prayer at church.',
  ],
  'Kill Vindicta for noted dragon bones': ['Noted dragon bones drop — bring combat gear + food'],
  'Train Prayer to 75': ['Use noted bones from Vindicta at altar (252 bones ≈ 75 Prayer from ~47 — adjust to your level)'],
  'Train Fletching to 52': [
    '14,250 steel arrows: smith arrowheads + buy feathers/headless arrows (see pathway miniguide).',
  ],
  'Buy broad arrow ability; train Fletching to 75': [
    '68,000 broad arrows — broad arrowheads from Slayer masters + weekly shop run.',
  ],
  'Train Crafting to 76': ['~17,000 uncut gems from Al Kharid gem rocks (gem bag) → cut all'],
  'Gather materials for 3000 Sign of the porter IV': [
    'Per porter IV: divine energy + porter charges (Sign of the porter IV recipe in bundle).',
    '×3000 — farm memories at Memorial/Divination or buy energy.',
  ],
  'Create 3000 Sign of the porter IV': ['Materials from prior prep step'],
  'Complete Fight Cave for fire cape': ['Food, potions, Obsidian armour (Brink of Extinction) recommended'],
  'The Elder Kiln': ['Sacrifice fire cape from Fight Cave to enter'],
  'Weekly Shop Run': [
    'Broad arrowheads (until 400k banked), bloodweed seeds, runes, vials, meat boxes, insulated boots, scimitars.',
  ],
  'Train Crafting to 15': [
    'Clay (Varrock mine or Fort workers) + chisel.',
    'Craft rings/bowls; bless clay ring; sell to Morgan.',
    'Bank 1 unfired bowl for Dragon Slayer.',
  ],
  'Catch and cook 50 raw shrimp': ['Small fishing net + 50 raw shrimp → cook at fire (or skip via Once Upon a Slime)'],
  'Perform 14 lesser ensoul material rituals': ['Check Kili Row ritual tab for exact ensouled bars/cloth per weapon tier upgrade.'],
  'Upgrade necromancy armour & weapons to tier 20': ['Complete Kili\'s Knowledge tier before each upgrade — materials shown in ritual UI.'],
  'Purchase steel, mithril, adamant hatchets from Bob': ['1 steel, 1 mithril, 1 adamant hatchet (toolbelt as levels allow)'],
  'New Foundations': ['Uses gathered planks + limestone from gather step (116 regular, 120 oak, 386 limestone bricks).'],
  'Build Fort Forinthry: Workshop T2, Command Centre T1, Chapel T1, Town Hall T2': ['Materials from second Fort gather step (logs/limestone list).'],
  'Activate Catherby lodestone': ['1 insect repellent', '1 big fishing net', '1 noted seaweed (Arhein)'],
  'Collect 6 onions behind Draynor bank': ['6 onions'],
  'Gertrude\'s Cat': ['Several sardines (fish Catherby or buy Arhein)'],
  'Monkey Madness': ['Pick up during quest: 2 monkey dentures, 3 talismans'],
  'The Fremennik Trials': [
    'Spined: dagannoth hides. Skeletal: flax → bowstring/hides. Rock-shell: dagannoth hides + limestone.',
    'Craft power armour variants — see quest guide for exact counts.',
  ],
  'Train Mining to 60 & Crafting to 61': ['Mine uncut gems at Al Kharid uncommon rocks (gem bag). Cut all for Crafting XP.'],
  'Buy Gem bag (2000 DG tokens)': ['2000 Dungeoneering tokens (high complexity small floors)'],
  'Train Magic to 55 in Shattered Worlds': ['Tier 20+ necromancy gear from ensoul steps'],
  'Train Ranged to 45 in Shattered Worlds': ['Yew shortbow + arrows (Brian\'s Archery step later, or chargebow until then)'],
  'Train Magic to 80': ['65–75: Guthix staff + cape. 75–80: Vanquish. Tendril at 75 from Terry Balando.'],
  'Train Ranged to 80': ['Grey chins (Hunter 63) + adamant cbow → red chins + rune cbow (Part 2 shop step)'],
  'Train Attack to 80': ['50–60: rune halberd. 60–75: dragon halberd. 75–80: Vanquish melee.'],
  'Train Strength to 80': ['Vanquish melee (same as Attack path)'],
  'Train Summoning to 37': ['Charms from dagannoths (Waterbirth) or slayer'],
  'Train Firemaking to 50': ['Willow logs from bank'],
  'Train Hunter to 29 (early route)': ['Bird snares (Ayleth Beaststalker)'],
  'Train Hunter to 45': ['Upgrade traps per Hunter training page'],
  'Cast Divine Storm 100× on Battle mage': ['Mystic wand + orb', 'Law/cosmic/air runes (Lundail shop)'],
  'Gather pineapples for My Arm\'s Big Adventure': [
    'North of Karamja lodestone: pick pineapples from patches.',
    'Make supercompost in bin (needed during quest).',
  ],
  'My Arm\'s Big Adventure': ['Uses supercompost from pineapple gather step.'],
  'Gather seeds for Garden of Tranquillity': [
    'Olivia\'s Seed Market: 1 marigold seed, 1 red rose seed, 1 cadavaberry bush seed.',
    '1 plant pot + compost + secateurs.',
  ],
  'Gather crops for A Fairy Tale I - Growing Pains': [
    'Allotment seeds if patches empty: cabbage, onion, potato, wheat.',
    'Secateurs + compost; quest inspects/cures diseased crops on Falador patches.',
  ],
  'Recipe for Disaster: Freeing Sir Amik Varze': ['1 sweetcorn (farm or buy)'],
  '128,500 DG tokens — Charming imp, Bonecrusher, Twisted bird skull, Gem bag upgrade': [
    '128,500 DG tokens total for listed rewards (prioritize gem bag upgrade if not done).',
  ],
  'Buy Ring of vigour (50,000 DG tokens)': ['50,000 DG tokens'],
  'Buy Spirit cape (45,000 DG tokens)': ['45,000 DG tokens'],
  'Obtain 2 dragon mattocks in Big Game Hunter': ['2× dragon mattock (Big Game Hunter — Bagrada rex priority)'],
  'Augment 2 black salamanders → level 5 → disassemble': ['2 black salamanders (Hunter 76 step) + augmentors'],
};

export function getStepMaterials(title) {
  return STEP_MATERIALS[title] || null;
}
