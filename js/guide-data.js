import { quickGuideUrl, wikiPageUrl } from './user-profile.js';
import { getQuestRequirements } from './quest-requirements.js';

function q(name, notes = '', skills = [], extras = {}) {
  const wikiReqs = getQuestRequirements(name);
  return {
    title: name,
    notes,
    skills: wikiReqs.length ? wikiReqs : skills,
    wiki: extras.wiki || quickGuideUrl(name),
    tags: extras.tags || ['quest'],
    repeat: extras.repeat || null,
    ...extras,
  };
}

function step(title, notes = '', skills = [], extras = {}) {
  return {
    title,
    notes,
    skills,
    wiki: extras.wiki || wikiPageUrl(title),
    tags: extras.tags || ['misc'],
    repeat: extras.repeat || null,
    ...extras,
  };
}

function pof(title, notes, skills = [], extras = {}) {
  return step(title, notes, skills, { tags: ['pof', 'farming'], ...extras });
}

function pvm(title, notes, skills = [], extras = {}) {
  return step(title, notes, skills, {
    tags: ['pvm'],
    wiki: extras.wiki || 'https://runescape.wiki/w/PvM_unlock_guide',
    ...extras,
  });
}

function prep(title, notes = '', skills = [], extras = {}) {
  return step(title, notes, skills, { tags: ['prep', 'misc'], ...extras });
}

export const GUIDE_PARTS = [
  {
    id: 'part1',
    title: 'Part 1: Starting Off',
    wiki: 'https://runescape.wiki/w/Ironman_Mode/Guide/Efficient_Ironman_Pathway_Guide#Main_guide',
    description: 'Unlock repeatable activities and complete early quests as fast as possible.',
    steps: [
      step('Start as a female character', 'Required for Recruitment Drive later.', [], { tags: ['setup'] }),
      step(
        'Complete The Circus agility minigame',
        'Open Adventures → Minigames → The Circus. Lowest level first. Add Surge to ability bar.',
        [],
        { tags: ['setup'], wiki: 'https://runescape.wiki/w/The_Circus' }
      ),
      step('Skip all basic Daily Challenges with Challenge Mistress Fara', '', [], { tags: ['setup'] }),
      step(
        'Obtain the Dwarven Army Axe',
        'Speak to Major Mary Rancour.',
        [],
        { wiki: 'https://runescape.wiki/w/Dwarven_Army_Axe' }
      ),
      pvm(
        'Pathfinder equipment + Ring of potency (Gudrik)',
        'Port Sarim — free starter PvM gear for all styles. Silverhawk boots (Diango) are NOT obtainable on new ironmen — skip unless you reclaimed pre-oddments boots.',
        [],
        { wiki: 'https://runescape.wiki/w/Pathfinder_equipment' }
      ),
      step(
        'Obtain the Wicked Hood from Tam McGrubor',
        'Teleport to Mind Altar, run east to Edgeville lodestone. Hood is altar teleport only (no free daily essence/runes as of DailyScape Overhaul).',
        [{ skill: 'Runecrafting', level: 5 }],
        { wiki: 'https://runescape.wiki/w/Wicked_hood' }
      ),
      step('Teleport to Burthorpe lodestone', 'While here: pick 28 flax, spin bowstrings, sell to Jack Oval; mine/smelt bronze; smith ore box & 4 bronze wires; buy bag of salt from Turael.', [], { tags: ['burthorpe'] }),
      step('Activate Taverley lodestone', '', [], { tags: ['lodestone'] }),
      step('Sail to Daemonheim', 'Speak to Bryll Thoksdottir. Get Ring of kinship from tutor.', [{ skill: 'Dungeoneering', level: 5 }], { wiki: 'https://runescape.wiki/w/Daemonheim' }),
      step('Sail to Al Kharid', 'Talk to Fremennik shipmaster.', [{ skill: 'Dungeoneering', level: 6 }]),
      step('Activate Al Kharid lodestone', '', [], { tags: ['lodestone'] }),
      q('One Piercing Note', 'Unlocks transfigure, sacrifice, devotion.', [{ skill: 'Attack', level: 2 }, { skill: 'Constitution', level: 2 }]),
      step('Activate Lumbridge lodestone', '', [], { tags: ['lodestone'] }),
      q('The Blood Pact', 'Keep Caitlin\'s staff and Kayle\'s chargebow.', [{ skill: 'Attack', level: 2 }, { skill: 'Magic', level: 2 }]),
      q('The Restless Ghost', 'Keep the ghostspeak amulet.', [{ skill: 'Prayer', level: 2 }]),
      q('Cook\'s Assistant', '', [{ skill: 'Cooking', level: 2 }]),
      step('Train Crafting to 15', 'Craft clay ring, get blessed, sell to Morgan (Lumbridge easy tasks). Craft unfired bowl for Dragon Slayer.', [{ skill: 'Crafting', level: 15 }]),
      step('Purchase Lumbridge general store supplies', '6 buckets, 2 pots, 2 tinderbox.', [], { tags: ['shopping'] }),
      step('Purchase from Beefy Bill', '10 redberries, 1 pie dish, 1 jug of water.', [], { tags: ['shopping'] }),
      step('Fill 4 buckets with milk', 'Cows next to Beefy Bill.', [], { tags: ['misc'] }),
      step('Activate Varrock lodestone', '', [], { tags: ['lodestone'] }),
      step('Complete Archaeology tutorial at Varrock Dig Site', 'Head east to Archaeology Guild.', [{ skill: 'Archaeology', level: 1 }], { wiki: 'https://runescape.wiki/w/Archaeology/Tutorial' }),
      step('Travel to Anachronia on The Stormbreaker', 'Complete base camp tutorial; set 10 workers to clay.', [], { wiki: 'https://runescape.wiki/w/Anachronia' }),
      step('Complete a run of Herby Werby', 'Stop green-particle zygomites; optionally purple to speed herb pickup.', [], { tags: ['weekly'], repeat: 'weekly' }),
      step('Build Anachronia lodestone', 'Manage base camp — keep workers busy.', [{ skill: 'Construction', level: 13 }]),
      step('Return to Taverley', 'Teleport back after Anachronia lodestone (original pathway order).', [], { tags: ['lodestone'] }),
      q('Violet is Blue', '3 XP lamps on Farming.', [{ skill: 'Farming', level: 3 }]),
      q('Violet is Blue Too', '', [{ skill: 'Farming', level: 16 }]),
      q('Wolf Whistle', '1 XP lamp Archaeology, 1 Construction, 1 Summoning.', [{ skill: 'Summoning', level: 19 }]),
      q('Druidic Ritual', 'Collect free supplies from Jatix; buy 20 vials of water.', [{ skill: 'Herblore', level: 3 }]),
      q('Death Plateau', '3 XP lamps on Smithing.', [{ skill: 'Defence', level: 5 }]),
      step('Complete 5 Supply and Demand deliveries', 'Taverley — original pathway step after Death Plateau.', [{ skill: 'Farming', level: 1 }]),
      q('What\'s Mine is Yours', 'Use lamps: 1 on Attack, 7 on Mining, 7 on Smithing.', [{ skill: 'Attack', level: 11 }]),
      q('Gunnar\'s Ground', 'Activate Falador lodestone. Gofannon amulet XP on Smithing.', [{ skill: 'Smithing', level: 12 }]),
      step('Catch and cook 50 raw shrimp', 'Or do Once Upon a Slime instead.', [{ skill: 'Fishing', level: 5 }]),
      prep(
        'Mine and smelt 2 iron bars for The Knight\'s Sword',
        'Lumbridge SW mine + furnace. You will mine more iron at the later necromancy step.',
        [{ skill: 'Mining', level: 15 }, { skill: 'Smithing', level: 15 }]
      ),
      q('The Knight\'s Sword', 'Bake 1 redberry pie + smelt 2 iron bars. Bake 6 extra redberry pies for future quests.', [{ skill: 'Cooking', level: 5 }]),
      step('Complete Stronghold of Security floors 1–3', 'Fourth floor optional (fancy/fighting boots).', [{ skill: 'Attack', level: 5 }], { wiki: 'https://runescape.wiki/w/Stronghold_of_Security' }),
      step('Cut and burn 20 logs; pick up ashes', '', [{ skill: 'Firemaking', level: 5 }]),
      q('Necromancy!', 'Bank big bones. Talk to Sostratus for robes; buy starter ritual supplies from Lupe (ghostly ink, impure essence, ritual bones).', [{ skill: 'Necromancy', level: 5 }]),
      step('Perform 7 lesser necroplasm rituals', 'Buy 12 basic ghostly ink from Lupe. Offer chicken bones at ritual spot for 1400 weak necroplasm. Save 1 impure essence for Easy Underworld achievements.', [{ skill: 'Necromancy', level: 7 }]),
      q('Kili Row', '', [{ skill: 'Necromancy', level: 25 }]),
      q('Rune Mythos', '1 XP lamp Construction.', [{ skill: 'Necromancy', level: 3 }]),
      step('Train Necromancy to 24 in City of Um troll cave', '', [{ skill: 'Necromancy', level: 24 }]),
      q('Demon Slayer', '3 XP lamp Ranged.', [{ skill: 'Magic', level: 25 }]),
      q('Ernest the Chicken', '', [{ skill: 'Crafting', level: 7 }]),
      q('Swept Away', 'During quest: activate Port Sarim lodestone; buy 10 sardines (Gerrant) + 1 chocolate bar (Wydin).', [{ skill: 'Herblore', level: 10 }]),
      step('Claim 25 QP reward from May\'s Quest Caravan', 'Repeat every 25 QP.', [{ skill: 'Quest Points', level: 25 }]),
      step('Purchase steel, mithril, adamant hatchets from Bob', 'Add to toolbelt at required levels. Mithril hatchet reused in Animal Magnetism.', [], { tags: ['shopping'] }),
      step('Gather 116 wooden planks, 120 oak planks, 386 limestone bricks', 'Limestone: Silvarea quarry OR buy 250/day from Fort Forinthry supplies (2-day prep).', [{ skill: 'Construction', level: 26 }]),
      q('New Foundations', 'Use gathered materials. AFK skill in Fort; check rested XP daily.', [{ skill: 'Construction', level: 42 }]),
      step('Build Fort Forinthry lodestone', 'Interact with building table → Miscellaneous.', [{ skill: 'Construction', level: 41 }]),
      step('Build Town Hall (Tier 1)', 'For rested experience.', [{ skill: 'Construction', level: 41 }]),
      step('Train Magic to 55 in Shattered Worlds', 'Revolution, disable Defence XP, avoid Feeling Pumped mutator.', [{ skill: 'Magic', level: 55 }], { wiki: 'https://runescape.wiki/w/Shattered_Worlds' }),
      step('Train Ranged to 45 in Shattered Worlds', 'Same combat settings as Magic training.', [{ skill: 'Ranged', level: 45 }]),
      step('Mine 42 iron + 14 coal; smelt 14 iron & steel bars', 'Lumbridge SW mine. Deposit to metal bank.', [{ skill: 'Mining', level: 20 }]),
      step('Unlock Command Skeleton Warrior talent', '', [{ skill: 'Necromancy', level: 30 }]),
      prep(
        'Kill hill giants for 25 big bones',
        'Edgeville dungeon or Boneyard (City of Um). Bank bones — Underworld Grimoire 1 auto-banks when worn.',
        [{ skill: 'Combat', level: 20 }]
      ),
      step('Perform 25 lesser communion rituals (big bones → 50 souls)', 'Need 25 big bones + 46 basic ghostly ink from Lupe. Ivar (Havenhythe) is faster if unlocked.', [{ skill: 'Necromancy', level: 30 }]),
      step('Perform 14 lesser ensoul material rituals', 'Follow Kili Row tier — upgrade weapons with ensouled bars/cloth from ritual materials tab.', [{ skill: 'Necromancy', level: 32 }]),
      prep('Buy needle, thread & spider silk from Varrock', 'Needle + thread from craft shop; 28× spider silk from Zaff for ensouled cloth rituals.', [{ skill: 'Crafting', level: 1 }], { tags: ['shopping'] }),
      step('Perform 38 lesser ensoul material rituals', '28 lesser ensouled cloth + 10 thread (from prep step).', [{ skill: 'Necromancy', level: 36 }]),
      step('Upgrade necromancy armour & weapons to tier 20', 'Complete next Kili\'s Knowledge tier before each upgrade.', [{ skill: 'Necromancy', level: 37 }]),
      step('Complete Easy Underworld achievements', 'Wear Underworld Grimoire 1 to bank bones. Use XP lamp on Smithing.', [], { wiki: 'https://runescape.wiki/w/Underworld_achievements' }),
      step('Travel to Ardougne & activate lodestone', 'Pull Edgeville↔Wilderness levers for fast travel (no PvP unless toggled).', [], { tags: ['lodestone'] }),
      pof(
        'PoF prep: verify 17 Farming & 20 Construction',
        'You need Farming 17 and Construction 20 for Manor Farm. Bank oak planks for small pens (10 oak + 75 steel nails each).',
        [
          { skill: 'Farming', level: 17 },
          { skill: 'Construction', level: 20 },
        ],
        { wiki: 'https://runescape.wiki/w/Player-owned_farm/Tutorial', anchor: 'pof-start' }
      ),
      pof(
        'Complete Player-Owned Farm tutorial with Granny Potterington',
        'North of East Ardougne. Receive tutorial rabbits. Quick guide linked.',
        [{ skill: 'Farming', level: 17 }, { skill: 'Construction', level: 20 }],
        { wiki: 'https://runescape.wiki/w/Player-owned_farm/Tutorial' }
      ),
      prep(
        'Smith 150 steel nails for PoF small pens',
        'See Materials box below for bar/ore counts.',
        [{ skill: 'Smithing', level: 20 }]
      ),
      pof(
        'Purchase small pen deed (I) from Farmers\' Market',
        'Tier 1 small pen only (Farming 17). Costs beans from tutorial animals. Build: 10 oak planks + 75 steel nails.',
        [{ skill: 'Farming', level: 17 }, { skill: 'Construction', level: 20 }]
      ),
      prep(
        'Gather marigold & onion seeds for Farming 27',
        'Olivia\'s Seed Market (Draynor): buy marigold seeds + onion seeds (bring ~20+ of each). Compost or supercompost + empty buckets for allotment protection payments.',
        [{ skill: 'Farming', level: 17 }],
        { tags: ['pof', 'shopping'] }
      ),
      pof(
        'Train Farming to 27 (marigolds + onions)',
        'Use seeds from prep step. Allotment patches: plant marigolds + onions; pay farmers to protect. Repeat harvest/replant until 27 — required before small pen tier 2 deed.',
        [{ skill: 'Farming', level: 27 }]
      ),
      pof(
        'PoF: purchase small pen deed (II) at Farming 27',
        'Upgrades small pen to tier 2. Buy from Farmers\' Market when Farming 27+.',
        [{ skill: 'Farming', level: 27 }, { skill: 'Construction', level: 20 }]
      ),
      pof(
        'Purchase 1010 woad leaves from Wyson (Falador Park)',
        'Cheapest PoF animal food bulk buy — get this before placing animals in pens.',
        [],
        { tags: ['pof', 'shopping'], anchor: 'pof-woad' }
      ),
      prep(
        'Gather Rellekkan cream rabbit breeding pair',
        'Fremennik (Rellekka rabbit burrows / swaying tree area): kill rabbits until you have an unchecked male + female Rellekkan cream rabbit. OR use the tutorial pair from Granny Potterington.',
        [{ skill: 'Farming', level: 17 }]
      ),
      pof(
        'Set up pre-64 PoF: breeding pen + small pens',
        'Place rabbit breeding pair (from gather step) in breeding pen. Move adolescents to small pens; sell for beans (keep breeding pair). Feed with woad leaves.',
        [{ skill: 'Farming', level: 17 }]
      ),
      pof(
        'Daily PoF: check animals, collect beehives, sell adolescents (pre-64)',
        'Every day: check all pens, collect beehives, sell adolescent animals (not breeding pairs). Pre-64 focus = beans for shop unlocks.',
        [{ skill: 'Farming', level: 17 }],
        { repeat: 'daily' }
      ),
      step('Activate Seers\' Village lodestone', '', [], { tags: ['lodestone'] }),
      step('Activate Catherby lodestone', 'Pick insect repellent (easternmost house); add to toolbelt. Buy big fishing net. Buy 1 noted seaweed from Arhein.', [], { tags: ['lodestone'] }),
      step(
        'Gather logs & limestone for Fort Forinthry',
        '96 regular, 120 oak, 288 willow, 480 teak, 432 maple, 192 limestone bricks. Optional: fletch wood boxes while gathering.',
        [{ skill: 'Woodcutting', level: 50 }]
      ),
      step('Build Fort Forinthry: Workshop T2, Command Centre T1, Chapel T1, Town Hall T2', '', [{ skill: 'Construction', level: 51 }]),
      q('Murder on the Border', 'Optional ironman: Woodcutting 20 for planks.', []),
      q('Unwelcome Guests', 'Bank prismatic lamp for 30 Herblore. Build Kitchen T1.', [{ skill: 'Construction', level: 50 }, { skill: 'Slayer', level: 10 }]),
      step('Build Guardhouse T1, Eastern wall, Grove Cabin T1–T2', '', [{ skill: 'Construction', level: 54 }]),
      step('Get Reaper assignment from Death', 'Before 60 combat = Croesus. World 68 public instance. Bring 15 logs (chop willows/oaks) + sticky fungus (pick inside instance). Super restores: sail to Mazcab → merchants near World Guardian lodestone.', [{ skill: 'Slayer', level: 45 }, { skill: 'Combat', level: 50 }]),
      step('Collect 6 onions behind Draynor bank', '', [], { tags: ['misc'] }),
      step(
        'Make Goblin Diplomacy dyes with Aggie',
        'Red dye (3 redberries), yellow dye (2 onions), blue dye (2 woad leaves).',
        [{ skill: 'Crafting', level: 23 }]
      ),
      q('Goblin Diplomacy', 'Use dyes from Aggie step.', [{ skill: 'Crafting', level: 23 }]),
      q('Monk\'s Friend', '', [{ skill: 'Thieving', level: 11 }]),
      step('Train Runecrafting to 50', 'At Runespan; do runespheres when available.', [{ skill: 'Runecrafting', level: 50 }], { wiki: 'https://runescape.wiki/w/Runespan' }),
      step('Kill giant spiders in Clocktower for earth talisman', 'Add to Wicked hood.', [{ skill: 'Combat', level: 10 }]),
      step('Purchase runes from Aubury\'s Rune Shop', '300 fire, water, air, and earth runes each.', [], { tags: ['shopping'] }),
      step('Purchase yew shortbow + arrows from Brian\'s Archery Supplies', '', [{ skill: 'Ranged', level: 40 }], { tags: ['shopping'] }),
      step('Purchase runes from Void Knight Magic Store', '1000 fire, water, air, and earth runes each.', [], { tags: ['shopping'] }),
      q('Missing, Presumed Death', '1 XP lamp Strength. Can be dangerous for HCIM.', [{ skill: 'Constitution', level: 13 }]),
      q('Gertrude\'s Cat', 'Start growing cat; feed sardines (fish at Catherby or buy from Arhein).', [{ skill: 'Cooking', level: 17 }]),
      q('Priest in Peril', '', [{ skill: 'Prayer', level: 11 }]),
      step('Activate Canifis lodestone', '', [], { tags: ['lodestone'] }),
      q('Sheep Herder', '', [{ skill: 'Cooking', level: 14 }]),
      q('Hazeel Cult', '', [{ skill: 'Thieving', level: 14 }]),
      step('Steal & bank 2 inventories from Ardougne Bakery', '', [{ skill: 'Thieving', level: 30 }]),
      q('Waterfall Quest', '', [{ skill: 'Attack', level: 30 }]),
      step('Repair Water filtration at Het\'s Oasis', 'Weekly from now on.', [], { tags: ['weekly'], repeat: 'weekly' }),
      q('Merlin\'s Crystal', 'Keep replaying for hair clips (Desert Treasure prep).', [{ skill: 'Prayer', level: 31 }]),
      pvm(
        'Enhanced Excalibur (hard Seers\' Village achievements)',
        'After Merlin\'s Crystal — complete hard Seers\' Village tasks when ready; elite doubles heal duration.',
        [],
        { wiki: 'https://runescape.wiki/w/Enhanced_Excalibur' }
      ),
      q('Holy Grail', '1 XP lamp Strength.', [{ skill: 'Prayer', level: 15 }]),
      step('Start Nemi Forest daily & God Statues monthly', '', [], { tags: ['daily', 'monthly'] }),
      q('Stolen Hearts', '', [{ skill: 'Agility', level: 16 }]),
      q('Diamond in the Rough', '', [{ skill: 'Summoning', level: 5 }]),
      step('Buy rune hatchet from Champions\' Guild', '', [{ skill: 'Attack', level: 40 }]),
      prep(
        'Prep spiky vambraces: leather, kebbit claws & vambraces',
        'Buy needle + thread (Varrock craft shop). Tan cowhide at Al Kharid tanner → craft leather vambraces (Crafting 11). Buy deadfall trap + knife from Ayleth Beaststalker (Burthorpe). Hunt Wild kebbits in Feldip Hunter area for kebbit claws — train Hunter on crimson swifts (Taverley) to 23 if needed.',
        [{ skill: 'Hunter', level: 23 }, { skill: 'Crafting', level: 32 }],
        { wiki: 'https://runescape.wiki/w/Kebbit_claws' }
      ),
      pvm(
        'Craft spiky vambraces (as Ranged allows)',
        'Use kebbit claws on leather vambraces, then upgrade through green → blue → red → black → royal dragonhide vambraces as Crafting/Ranged allow (32 Crafting for leather tier).',
        [{ skill: 'Ranged', level: 40 }],
        { wiki: 'https://runescape.wiki/w/Spiky_vambraces' }
      ),
      q('The Jack of Spades', 'Activate Menaphos lodestone.', [{ skill: 'Agility', level: 17 }]),
      step('Start Penguin Hide and Seek weekly', '', [], { tags: ['weekly'], repeat: 'weekly' }),
      step('Gather 768 Acadia logs in Menaphos Imperial District', 'Set Imperial faction active for reputation.', [{ skill: 'Woodcutting', level: 55 }]),
      q('Dead and Buried', 'Optional ironman: Woodcutting 50 for acadia planks.', []),
      prep(
        'Sawmill acadia planks & craft stone wall segments',
        'Portable sawmill: convert 768 acadia logs → planks (552 for Kitchen+Chapel). Craft 46 acadia frames + 12 stone wall segments at Fort (4 limestone bricks per segment at stonecutter; Construction/training).',
        [{ skill: 'Construction', level: 61 }]
      ),
      step(
        'Build Fort Forinthry: Kitchen T2, Chapel T2',
        'Uses prepped planks + stone wall segments from sawmill step.',
        [{ skill: 'Construction', level: 61 }]
      ),
      step('Train Firemaking to 35', '290 oak logs at Seers\' Village lodestone.', [{ skill: 'Firemaking', level: 35 }]),
      step('Obtain 5 willow logs', '', [{ skill: 'Woodcutting', level: 56 }]),
      q('Icthlarin\'s Little Helper', '', [{ skill: 'Agility', level: 24 }]),
      q('Once Upon a Slime', '', [{ skill: 'Cooking', level: 25 }]),
      q('Tribal Totem', '', [{ skill: 'Thieving', level: 19 }]),
      q('Jungle Potion', '', [{ skill: 'Herblore', level: 26 }]),
      q('Recruitment Drive', 'Female character required.', [{ skill: 'Prayer', level: 19 }]),
      q('The Dig Site', 'Turn Level 3 cert to Seth Minas for Fruit blast. Unlocks Smoke & Shadow Tendrils. Use lamps on Agility.', [{ skill: 'Agility', level: 32 }]),
      q('Witch\'s House', '', [{ skill: 'Thieving', level: 24 }]),
      q('The Lost Tribe', '', [{ skill: 'Agility', level: 19 }]),
      q('The Tourist Trap', '', [{ skill: 'Fletching', level: 21 }]),
      step('Start Circus weekly', '', [], { tags: ['weekly'], repeat: 'weekly' }),
      q('Murder Mystery', '', [{ skill: 'Crafting', level: 26 }]),
      q('Plague City', '', [{ skill: 'Herblore', level: 28 }]),
      q('Biohazard', '', [{ skill: 'Herblore', level: 28 }]),
      q('Fight Arena', '', []),
      step('Activate Yanille lodestone', '', [], { tags: ['lodestone'] }),
      q('Tree Gnome Village', 'Start quest to unlock Elkoy maze skip.', [{ skill: 'Agility', level: 36 }]),
      q('The Grand Tree', '', [{ skill: 'Agility', level: 40 }]),
      step(
        'Go Shopping Funch\'s Fine Groceries',
        'If no fruit blast from Dig Site: 2 lemon, 1 orange, 1 pineapple, 1 cocktail glass, 1 cocktail shaker, 1 vodka.',
        [],
        { tags: ['shopping'] }
      ),
      q('Observatory Quest', 'Make molten glass: buy bucket of sand (Yanille/Entrana) + soda ash (Charter ship or Seers\' Village).', [{ skill: 'Crafting', level: 22 }]),
      q('Recipe for Disaster: Another Cook\'s Quest', '', [{ skill: 'Cooking', level: 26 }]),
      q('Nature Spirit', '', [{ skill: 'Crafting', level: 29 }]),
      q('Creature of Fenkenstrain', '', [{ skill: 'Crafting', level: 30 }]),
      q('Elemental Workshop I', '', [{ skill: 'Mining', level: 34 }]),
      q('Elemental Workshop II', '', [{ skill: 'Smithing', level: 34 }]),
      q('Sea Slug', 'Buy swamp paste from Rasolo.', [{ skill: 'Firemaking', level: 30 }]),
      q('Fishing Contest', '', [{ skill: 'Fishing', level: 34 }]),
      q('Shilo Village', 'Unlocks Shilo Village and cart system.', [{ skill: 'Agility', level: 32 }, { skill: 'Crafting', level: 20 }]),
      step('Train Fishing to 53', 'Fish inside Shilo Village after the quest. Skip if already 53+.', [{ skill: 'Fishing', level: 53 }]),
      step('Cook trout & salmon at Yeti Town bonfire', 'Via Land of Snow portal (Violet is Blue).', [{ skill: 'Cooking', level: 55 }]),
      prep(
        'Prep Shades of Mort\'ton: flamtaer & sacred oil',
        'Gather limestone (Silvarea quarry / shops), swamp tar (Lumbridge swamp), olive oil (Fat Tony), silver bars (bank). Temple on world 88: craft 20+ flamtaer hammers + flamtaer bracelets. Make extra sacred oil for Legacy of Seergaze.',
        [{ skill: 'Firemaking', level: 24 }, { skill: 'Crafting', level: 20 }],
        { wiki: 'https://runescape.wiki/w/Shades_of_Mort%27ton' }
      ),
      q('Shades of Mort\'ton', 'Use prepped flamtaer gear at temple (world 88).', [{ skill: 'Firemaking', level: 24 }]),
      q('Big Chompy Bird Hunting', 'Get 3 extra raw chompy for later.', [{ skill: 'Fletching', level: 37 }]),
      step('Activate Oo\'glog lodestone', '', [], { tags: ['lodestone'] }),
      q('Zogre Flesh Eaters', '', [{ skill: 'Herblore', level: 12 }]),
      step('Complete easy Troll Invasion', '', [], { tags: ['monthly'] }),
      step('Purchase house from Varrock Estate Agent', '', [{ skill: 'Construction', level: 31 }]),
      step('Complete Varrock Museum Quiz', '', [], { wiki: 'https://runescape.wiki/w/Varrock_Museum' }),
      q('The Golem', '', [{ skill: 'Crafting', level: 16 }]),
      q('Shadow of the Storm', '', [{ skill: 'Crafting', level: 26 }]),
      q('Recipe for Disaster: Freeing Evil Dave', '', [{ skill: 'Cooking', level: 31 }]),
      q('Evil Dave\'s Big Day Out', '', [{ skill: 'Agility', level: 28 }]),
      q('Beneath Cursed Tides', '', [{ skill: 'Dungeoneering', level: 9 }]),
      step('Complete Giant Oyster monthly', '', [], { tags: ['monthly'], repeat: 'monthly' }),
      step(
        'Purchase mystic wand and mystic orb from Marvellous Mysticism',
        'Required for Mage Arena miniquest chain.',
        [{ skill: 'Magic', level: 60 }],
        { tags: ['shopping'] }
      ),
      step('Dragon Slayer up to Anti-dragon shield', '', [{ skill: 'Quest Points', level: 32 }]),
      step('Train Prayer to 37', '', [{ skill: 'Prayer', level: 37 }]),
      prep(
        'Prep Dragon Slayer: 50 dragon bones & combat gear',
        'Kill blue dragons (Taverley dungeon — wear anti-dragon shield) for 50 dragon bones. Buy rune battleaxe + full adamant armour before the quest fight.',
        [{ skill: 'Prayer', level: 37 }],
        { wiki: 'https://runescape.wiki/w/Dragon_bones' }
      ),
      q('Dragon Slayer', 'Offer prepped bones at Chaos altar if not done yet. Use rune battleaxe + adamant armour for Elvarg.', [{ skill: 'Quest Points', level: 37 }]),
      q(
        'Broken Home',
        'Asylum surgeon\'s ring — replay under 37 minutes + all challenges for best ring.',
        [],
        { tags: ['pvm', 'quest'], wiki: 'https://runescape.wiki/w/Broken_Home' }
      ),
      step('Train Slayer to 35', 'Raptor at Fort Forinthry; buy earmuffs & face mask.', [{ skill: 'Slayer', level: 35 }]),
      q(
        'Smoking Kills',
        'Assemble slayer helmet when ready — needs: black mask (Slayer Tower), earmuffs + facemask (Slayer masters), nose peg (Slayer Tower), spiny helmet (Slayer Tower), reinforced goggles (Slayer Tower). Crafting 25 + Slayer 35.',
        [{ skill: 'Crafting', level: 25 }, { skill: 'Slayer', level: 35 }]
      ),
      step('Train Slayer to 40', 'Train with Magic; need Magic 60 for Mage Arena (train to 66 later).', [{ skill: 'Slayer', level: 40 }]),
      step('Train Magic to 60', 'Guide checkpoint before Mage Arena — train with Guthix staff on Slayer tasks.', [{ skill: 'Magic', level: 60 }]),
      step('Complete Mage Arena miniquest', 'Lever for quick access.', [], { wiki: 'https://runescape.wiki/w/Mage_Arena' }),
      step('Claim Guthix cape & staff from Mage Arena', '', [{ skill: 'Magic', level: 60 }]),
      step(
        'Purchase runes from Lundail\'s Arena-side Rune Shop',
        '100 law, 100 cosmic, 500 air runes.',
        [],
        { tags: ['shopping'] }
      ),
      step('Cast Divine Storm 100× on Battle mage', 'Full Manual with mystic wand/orb.', [{ skill: 'Magic', level: 60 }]),
      q('A Shadow over Ashdale', '', [{ skill: 'Attack', level: 40 }]),
      step('Start Agoroth weekly', '', [], { tags: ['weekly'], repeat: 'weekly' }),
      q('In Search of the Myreque', '', [{ skill: 'Agility', level: 46 }]),
      q('In Aid of the Myreque', '', [{ skill: 'Crafting', level: 32 }]),
      q('Buyers and Cellars', '', [{ skill: 'Thieving', level: 38 }]),
      q('From Tiny Acorns (miniquest)', '', [{ skill: 'Thieving', level: 30 }]),
      q('The Feud', '', [{ skill: 'Thieving', level: 37 }]),
      step('Build all 4 flower baskets at Het\'s Oasis', '', [{ skill: 'Hunter', level: 20 }]),
      step('Train Thieving to 41', '', [{ skill: 'Thieving', level: 41 }]),
      q('Lost Her Marbles (miniquest)', '', [{ skill: 'Thieving', level: 41 }]),
      step('Train Thieving to 53', 'Thieves\' Guild cell doors.', [{ skill: 'Thieving', level: 53 }]),
      q('Carnillean Rising', '', [{ skill: 'Thieving', level: 53 }]),
      q('Dimension of Disaster: Coin of the Realm', '', [{ skill: 'Attack', level: 39 }]),
      q('Dimension of Disaster: Demon Slayer', '', [{ skill: 'Attack', level: 42 }]),
      step('Complete Memorial to Guthix tutorial', '', [], { wiki: 'https://runescape.wiki/w/Memorial_to_Guthix' }),
      prep(
        'Smith 150 mithril nails for PoF medium pen',
        'See Materials box below for bar/ore counts.',
        [{ skill: 'Smithing', level: 50 }]
      ),
      pof(
        'PoF: purchase medium pen deed (I) when you reach 35 Farming',
        'Build pen: 15 teak planks + 150 mithril nails. Then gather sheep (next step) before filling pens.',
        [{ skill: 'Farming', level: 35 }, { skill: 'Construction', level: 40 }]
      ),
      prep(
        'Buy sheep for medium pens (Farmers\' Market)',
        'Spend beans from adolescent rabbit sales. Buy 4× common white sheep per medium pen; place immediately after building the pen.',
        [{ skill: 'Farming', level: 35 }]
      ),
      pof(
        'PoF: purchase large pen deed (I) when you reach 49 Farming',
        'Build pen: 20 mahogany planks + 225 rune nails (mahogany prep after Monkey Madness). Then gather bulls (next step).',
        [{ skill: 'Farming', level: 49 }, { skill: 'Construction', level: 60 }]
      ),
      prep(
        'Buy bulls for large pens (Farmers\' Market)',
        'Spend beans from sheep/rabbit sales. Buy 3× Hereford cattle per large pen; place after building the pen.',
        [{ skill: 'Farming', level: 49 }]
      ),
      step(
        'Train Hunter to 29 (early route)',
        'Buy bird snares. Crimson swift (Taverley) → Cerulean twitch (Rellekka) → Tropical wagtail (north Oo\'glog). Activate Divination echo in Memorial for porter shards while hunting.',
        [{ skill: 'Hunter', level: 29 }, { skill: 'Divination', level: 20 }]
      ),
      q('Eagles\' Peak', '', [{ skill: 'Hunter', level: 29 }]),
      step('Train Hunter to 45', 'Crimson swift (Taverley) → cerulean twitch (Rellekka) → tropical wagtail (north Oo\'glog).', [{ skill: 'Hunter', level: 45 }]),
      step('Train Hunter to 50 (guide checkpoint)', '', [{ skill: 'Hunter', level: 50 }]),
      q('Cold War', '', [{ skill: 'Hunter', level: 45 }]),
      q('Hunt for Red Raktuber', '', [{ skill: 'Construction', level: 30 }]),
      step('Train Fletching to 25', 'Oak shortbow (u) from oak logs.', [{ skill: 'Fletching', level: 25 }]),
      q('The Fremennik Trials', 'Craft spined / skeletal / rock-shell power armour — hunt dagannoths (Waterbirth) or buy hides; spin flax for skeletal. Preferred over tank armour for PvM.', [{ skill: 'Crafting', level: 56 }]),
      q('Monkey Madness', 'Pick 2 monkey dentures, 3 talismans. Choose Attack & Defence XP.', []),
      prep(
        'Chop mahogany & smith rune nails for PoF large pen',
        'See Materials box below. Return to large pen deed when Farming 49.',
        [{ skill: 'Woodcutting', level: 50 }, { skill: 'Smithing', level: 50 }]
      ),
      q('Haunted Mine', '', [{ skill: 'Agility', level: 57 }]),
      q('Lair of Tarn Razorlor (miniquest)', 'Use diary on Salve amulet.', [{ skill: 'Slayer', level: 40 }]),
      pvm(
        'Equip Salve amulet (e) vs undead bosses',
        'From Haunted Mine + Lair of Tarn. Swap out Essence of Finality where Salve applies.',
        [{ skill: 'Slayer', level: 40 }],
        { wiki: 'https://runescape.wiki/w/Salve_amulet_(e)' }
      ),
      q('The Darkness of Hallowvale', '', [{ skill: 'Agility', level: 45 }]),
      step('Train Firemaking to 50', 'Willow logs.', [{ skill: 'Firemaking', level: 50 }]),
      q('Troll Stronghold', '', [{ skill: 'Strength', level: 61 }]),
      q('Troll Romance', '', [{ skill: 'Agility', level: 61 }]),
      step('Buy adamant & rune pickaxes; train DG for 2000 tokens', 'High complexity small floors.', [{ skill: 'Dungeoneering', level: 5 }]),
      step('Buy Gem bag (2000 DG tokens)', '', [{ skill: 'Dungeoneering', level: 5 }]),
      step('Train Mining to 60 & Crafting to 61', 'Al Kharid uncommon gem rocks + gem bag.', [{ skill: 'Mining', level: 60 }, { skill: 'Crafting', level: 61 }]),
      q('Shield of Arrav', '', []),
      q('Lost City', '', [{ skill: 'Crafting', level: 61 }]),
      q('Heroes\' Quest', '', [{ skill: 'Cooking', level: 61 }]),
      q('Throne of Miscellania', '', []),
      q('Royal Trouble', '', [{ skill: 'Agility', level: 61 }]),
      step('Start Managing Miscellania weekly', 'Mahogany full bar; maple remainder. Requires mahogany from prep step or kingdom trees.', [], { tags: ['weekly'], repeat: 'weekly' }),
      q('Tears of Guthix (quest)', '', [{ skill: 'Mining', level: 61 }]),
      step('Start Tears of Guthix weekly', 'Juna in Lumbridge Swamp Caves.', [], { tags: ['weekly'], repeat: 'weekly' }),
      q('Pirate\'s Treasure', '', []),
      step('Train Prayer to 47', 'Dragon bones at Chaos altar.', [{ skill: 'Prayer', level: 47 }]),
      q('Ghosts Ahoy', '', [{ skill: 'Prayer', level: 47 }]),
      q('Rum Deal', '', [{ skill: 'Fishing', level: 61 }]),
      step(
        'Train Smithing to 50',
        'Mine ~248 adamantite + luminite; smith burial armour sets at Artisans\' Workshop (world 70). Bank sets for 50–80 route.',
        [{ skill: 'Smithing', level: 50 }]
      ),
      step('Train Necromancy to 60', 'Upgrade gear every 10 levels.', [{ skill: 'Necromancy', level: 60 }]),
      q('Vessel of the Harbinger', '', [{ skill: 'Necromancy', level: 60 }]),
      q(
        'Requiem for a Dragon',
        'Zorgoth\'s soul ring — upgrade at Ungael ritual site while wearing it.',
        [{ skill: 'Necromancy', level: 60 }],
        { tags: ['pvm', 'quest'] }
      ),
      q('Cabin Fever', '', [{ skill: 'Agility', level: 61 }]),
      q('Legacy of Seergaze', '', [{ skill: 'Crafting', level: 61 }]),
      q('Underground Pass', '', [{ skill: 'Ranged', level: 61 }]),
      q('Death to the Dorgeshuun', '', [{ skill: 'Agility', level: 61 }]),
      q('The Giant Dwarf', '', [{ skill: 'Mining', level: 61 }]),
      q('Another Slice of H.A.M.', '', [{ skill: 'Attack', level: 61 }]),
      q('Land of the Goblins', '', [{ skill: 'Thieving', level: 61 }]),
      q('The Chosen Commander', '', [{ skill: 'Agility', level: 61 }]),
      q('Family Crest', '', [{ skill: 'Magic', level: 61 }]),
      q('Temple of Ikov', '', [{ skill: 'Thieving', level: 61 }]),
      step('Train Thieving to 62', 'Low-level pickpocketing post-rework.', [{ skill: 'Thieving', level: 62 }]),
      q('A Guild of Our Own (miniquest)', '', [{ skill: 'Thieving', level: 62 }]),
      step('Train Thieving to 90', '', [{ skill: 'Thieving', level: 90 }]),
      step('Start Player-Owned Ports daily', 'Requires 90 in one port skill.', [{ skill: 'Any Port Skill', level: 90 }], { tags: ['daily'], repeat: 'daily' }),
      q('One Small Favour', '', [{ skill: 'Agility', level: 61 }]),
      q('King\'s Ransom', '', []),
      q('Desert Treasure', 'Unlock safecrack (Thieves\' Guild). Buy/master lockpick. Hair clips from replaying Merlin\'s Crystal.', []),
      q(
        'Contact!',
        'Keris — hard Desert achievements for Kalphite King/Queen.',
        [],
        { tags: ['pvm', 'quest'] }
      ),
      step(
        'Train Magic to 65 (before Ancient Awakening)',
        'Original pathway order: after Desert Treasure, before Ancient Awakening. Ogres west of Yanille lodestone recommended.',
        [{ skill: 'Magic', level: 65 }]
      ),
      q('Ancient Awakening', 'Required before Botanist\'s Workbench at Fort Forinthry.', []),
      step(
        'Build Fort Forinthry: Botanist\'s Workbench T1',
        'Requires Ancient Awakening complete. Unlocks herb cleaning and potion decanting at the fort.',
        [{ skill: 'Construction', level: 61 }]
      ),
      q('Lunar Diplomacy', '', [{ skill: 'Crafting', level: 61 }]),
      step('Get 6000 Menaphos Port reputation', 'Soulobby FC + soul obelisks; fish with faction active.', [{ skill: 'Fishing', level: 61 }]),
      step('Train Fishing to 68', '', [{ skill: 'Fishing', level: 68 }]),
      step('Cook all raw fish from Menaphos training', 'Cooking gauntlets + Dwarven Army Axe.', [{ skill: 'Cooking', level: 68 }]),
      q('Housing of Parliament', '', []),
      q('Some Like It Cold', '', [{ skill: 'Thieving', level: 61 }]),
      q('Back to the Freezer', 'Claim Invention lamp from Chuck after Invention tutorial (later).', []),
      q('Rune Mysteries', '', [{ skill: 'Runecrafting', level: 1 }]),
      q('Rune Memories', '', [{ skill: 'Runecrafting', level: 1 }]),
      q('Enter the Abyss', '', []),
      step('Train Agility to 56', 'Wilderness course (regular) or Northern Anachronia (HCIM).', [{ skill: 'Agility', level: 56 }]),
      q('Regicide', '', [{ skill: 'Agility', level: 56 }]),
      step('Train Hunter to 62 (guide checkpoint)', '', [{ skill: 'Hunter', level: 62 }]),
      prep(
        'Buy box traps for chinchompa hunting',
        'From hunter shops (Ayleth Beaststalker / Nardah). Need several for grey/red chin grind.',
        [{ skill: 'Hunter', level: 53 }],
        { tags: ['shopping'], wiki: 'https://runescape.wiki/w/Box_trap' }
      ),
      prep(
        'Gather grey chinchompas for PoF pens',
        'From Eagles\' Peak hunt (next steps): bank caught grey chins. While hunting, 1/1500 trap chance for unchecked grey chinchompa — keep any for later breeding unlock.',
        [{ skill: 'Hunter', level: 53 }]
      ),
      step(
        'Train Hunter to 63 — Grey chinchompas at Eagles\' Peak',
        'Use box traps from prep. Bank all grey chins. Activate Eagles\' Peak lodestone.',
        [{ skill: 'Hunter', level: 63 }]
      ),
      pof(
        'PoF: place grey chinchompas in small pens (Farming 54+)',
        'Place banked grey chins from gather/hunt steps into small pens (after Small pen breeding unlock from bean shop). Feed woad leaves.',
        [{ skill: 'Farming', level: 54 }, { skill: 'Hunter', level: 53 }]
      ),
      step(
        'Train Hunter to 70 — Red chinchompas north of Oo\'glog',
        'Bank all red chins for Ranged training and PoF breeding (later). Whirligigs at Het\'s Oasis alternative (~120–160k XP/h).',
        [{ skill: 'Hunter', level: 70 }]
      ),
      prep(
        'Gather spider eggs for PoF breeding (Lumbridge Catacombs)',
        'Kill spiders in Lumbridge Catacombs until you have spider eggs. Check eggs at PoF to get spirit spiders for breeding pen.',
        [{ skill: 'Farming', level: 64 }]
      ),
      pof(
        'PoF post-64: spider breeding pair from Lumbridge Catacombs',
        'Place checked spirit spiders from egg gather step into breeding pen immediately at 64 Farming — main bean source. Elder spider = +2% damage vs Araxxor.',
        [{ skill: 'Farming', level: 64 }]
      ),
      pof(
        'PoF: unlock shop rewards in order',
        '1 Adam Antite → 2 Medium pen breeding → 3 Small pen breeding → 4 Large pen breeding → 5 Master farmer outfit → 6 Master farmer fragment pack. Send Adam Antite until breeding pairs of red chins, yaks, dragons.',
        [{ skill: 'Farming', level: 64 }]
      ),
      prep(
        'Gather red chinchompas & yaks for PoF pen setup',
        'Red chins: breeding pair from Oo\'glog hunt bank. Yaks/dragons/red chins: keep breeding pairs from Adam Antite (shop unlock step above).',
        [{ skill: 'Farming', level: 64 }, { skill: 'Hunter', level: 70 }]
      ),
      pof(
        'PoF post-unlocks pen setup',
        'Breeding pen: spiders then yaks/dragons. Small pens: red chins (from gather step). Medium: bred spiders. Large: yaks > dragons. Bank strawberry/vanilla/chocolate cows from Adam Antite.',
        [{ skill: 'Farming', level: 64 }]
      ),
      pof(
        'PoF: after all shop unlocks, grow animals to elder',
        'Stop selling adolescents; elders for max XP + totem perks.',
        [{ skill: 'Farming', level: 64 }]
      ),
    ],
  },
  {
    id: 'part2',
    title: 'Part 2: Mid-Game Combat Training',
    wiki: 'https://runescape.wiki/w/Ironman_Mode/Guide/Efficient_Ironman_Pathway_Guide#Part_2:_Mid-game_combat_training',
    description: 'Train combat to meet Part 3 quest requirements.',
    steps: [
      step('Obtain Vanquish from May', '', [], { wiki: 'https://runescape.wiki/w/Vanquish' }),
      step(
        'Buy adamant crossbow, rune crossbow, rune halberd & dragon halberd',
        'Adamant/rune crossbows: crossbow shops (Keldagrim, Varrock). Rune halberd: Keldagrim quartermaster. Dragon halberd: Heathor (Oo\'glog) after Regicide.',
        [{ skill: 'Ranged', level: 50 }, { skill: 'Attack', level: 60 }],
        { tags: ['shopping'] }
      ),
      step('Train Magic to 80', '65–75 Guthix staff; 75–80 Vanquish. Unlock Tendril at 75 from Terry Balando.', [{ skill: 'Magic', level: 80 }]),
      step('Train Defence to 80', 'Same method as Magic.', [{ skill: 'Defence', level: 80 }]),
      step('Train Ranged to 80', '45–55 grey chins + off-hand adamant cbow; 55–80 red chins + off-hand rune cbow.', [{ skill: 'Ranged', level: 80 }]),
      step('Train Attack to 80', '50–60 rune halberd; 60–75 dragon halberd; 75–80 Vanquish.', [{ skill: 'Attack', level: 80 }]),
      step('Train Strength to 80', '50–75 and 75–80 Vanquish melee.', [{ skill: 'Strength', level: 80 }]),
      prep(
        'Gather Animal Magnetism quest items',
        'Hard leather (cowhide + needle/thread), polished buttons (H.A.M. storeroom or pickpocket), 5 iron bars, 1 steel bar, 30 undead chicken (farm west Ardougne), 200 steel nails, 3 oak planks, ghostspeak amulet (Restless Ghost).',
        [{ skill: 'Crafting', level: 50 }, { skill: 'Ranged', level: 50 }],
        { wiki: 'https://runescape.wiki/w/Animal_Magnetism' }
      ),
      q(
        'Animal Magnetism',
        'Passive ammo retrieval — important for ranged PvM.',
        [{ skill: 'Ranged', level: 50 }, { skill: 'Crafting', level: 50 }, { skill: 'Slayer', level: 18 }],
        { tags: ['pvm', 'quest'] }
      ),
      step('Train Summoning to 37', 'Charms from dagannoths (Waterbirth) or slayer tasks.', [{ skill: 'Summoning', level: 37 }]),
      step(
        'Farm 63M Shattered Worlds anima — Bladed Dive',
        'Continue Shattered Worlds from Part 1 Magic/Ranged training until 63M anima banked, then buy Bladed Dive from Shattered Worlds reward shop.',
        [{ skill: 'Magic', level: 55 }],
        { wiki: 'https://runescape.wiki/w/Bladed_Dive' }
      ),
    ],
  },
  {
    id: 'part3',
    title: 'Part 3: Mid-Game Questing',
    wiki: 'https://runescape.wiki/w/Ironman_Mode/Guide/Efficient_Ironman_Pathway_Guide#Part_3:_Mid-game_questing',
    description: 'Subquests for endgame unlocks. Keep up dailies/weeklies from intro section.',
    steps: [
      q('Visions of Havenhythe', 'Rusty Anchor Tavern, Port Sarim. Unlocks Ivar for Prayer.', []),
      q('Hearts of Sanguine', 'Unlocks Silverquill / havensilver bolts.', []),
      q('Roving Elves', 'Requires Regicide (done in Part 1).', [{ skill: 'Agility', level: 56 }]),
      q('Mourning\'s End Part I', '', [{ skill: 'Ranged', level: 60 }]),
      q('Mourning\'s End Part II', '', []),
      q('Impressing the Locals', '', []),
      q('Bringing Home the Bacon', '', []),
      q('Legends\' Quest', '', [{ skill: 'Magic', level: 80 }]),
      q('Recipe for Disaster: Freeing the Goblin Generals', '', []),
      q('Recipe for Disaster: Freeing the Lumbridge Sage', '', [{ skill: 'Cooking', level: 70 }]),
      q('Recipe for Disaster: Freeing the Mountain Dwarf', '', []),
      q('Recipe for Disaster: Freeing Pirate Pete', '', [{ skill: 'Agility', level: 70 }]),
      q('Recipe for Disaster: Freeing Skrach Uglogwee', '', [{ skill: 'Cooking', level: 70 }]),
      q('Recipe for Disaster: Freeing King Awowogei', '', [{ skill: 'Cooking', level: 70 }]),
      q('Recipe for Disaster: Freeing Sir Amik Varze', 'Farm a sweetcorn.', []),
      q('Bar Crawl (miniquest)', '', []),
      q('Horror from the Deep', 'Choose god book (Wisdom if stationary, Law if moving).', []),
      prep(
        'Collect 4 torn god pages for Illuminate',
        'One page each from Guthix/Saradomin/Zamorak/Bandos emissaries (reputation grind). See god emissaries page for locations.',
        [{ skill: 'Prayer', level: 60 }],
        { wiki: 'https://runescape.wiki/w/Torn_god_page' }
      ),
      pvm(
        'Illuminate god book',
        '60 Crafting + 60 Prayer + god book from Horror from the Deep + 4 torn pages + One Piercing Note.',
        [{ skill: 'Crafting', level: 60 }, { skill: 'Prayer', level: 60 }],
        { wiki: 'https://runescape.wiki/w/Illuminated_god_book' }
      ),
      q('Recipe for Disaster: Defeating the Culinaromancer', '', [{ skill: 'Cooking', level: 70 }]),
      q('Eadgar\'s Ruse', '', [{ skill: 'Herblore', level: 80 }]),
      q('Dream Mentor', '', []),
      prep(
        'Gather pineapples for My Arm\'s Big Adventure',
        'North of Karamja lodestone: pick pineapples from patches → make supercompost in bin (needed during quest).',
        [{ skill: 'Farming', level: 36 }]
      ),
      q('My Arm\'s Big Adventure', 'Uses supercompost from pineapple gather step.', [{ skill: 'Farming', level: 80 }]),
      q('The Eyes of Glouphrie', '', [{ skill: 'Magic', level: 80 }]),
      q('The Path of Glouphrie', '', [{ skill: 'Magic', level: 80 }]),
      step('Knight Waves training ground', 'Unlocks Piety, Rigour & Augury (70 Defence + 70 Prayer).', [{ skill: 'Defence', level: 70 }, { skill: 'Prayer', level: 70 }], { wiki: 'https://runescape.wiki/w/Knight_Waves_training_ground' }),
      q('What Lies Below', '', [{ skill: 'Runecrafting', level: 80 }]),
      q('The Hunt for Surok (miniquest)', '', [{ skill: 'Magic', level: 80 }]),
      q('The Hand in the Sand', '', [{ skill: 'Crafting', level: 80 }]),
      prep(
        'Gather seeds for Garden of Tranquillity',
        'Olivia\'s Seed Market (Draynor): 1 marigold seed, 1 red rose seed, 1 cadavaberry bush seed. Bring plant pot, compost, secateurs.',
        [{ skill: 'Farming', level: 25 }]
      ),
      q('Garden of Tranquillity', 'Plant seeds from gather step during quest.', [{ skill: 'Farming', level: 80 }]),
      q('The Tale of the Muspah', '', [{ skill: 'Magic', level: 80 }]),
      q('Missing My Mummy', '', [{ skill: 'Magic', level: 80 }]),
      q('A Tail of Two Cats', '', []),
      q('The Great Brain Robbery', '', [{ skill: 'Crafting', level: 80 }]),
      prep(
        'Gather crops for A Fairy Tale I - Growing Pains',
        'If Falador allotment patches are empty: cabbage, onion, potato, wheat seeds + compost + secateurs. Quest inspects and cures diseased crops on those patches.',
        [{ skill: 'Farming', level: 17 }]
      ),
      q('A Fairy Tale I - Growing Pains', 'Uses allotment crops/seeds from gather step.', []),
      q('A Fairy Tale II - Cure a Queen', '', [{ skill: 'Thieving', level: 80 }]),
      q('A Fairy Tale III - Battle at Ork\'s Rift', '', [{ skill: 'Magic', level: 80 }]),
      q('Enakhra\'s Lament', '', [{ skill: 'Magic', level: 80 }]),
      q('All Fired Up', '', [{ skill: 'Firemaking', level: 80 }]),
      q('The World Wakes', 'Destroy lamps — reclaim later. Unlock Death\'s Swiftness & Sunshine; add to ability bar for bosses.', []),
      q('Making History', '', [{ skill: 'Prayer', level: 80 }]),
      q('Meeting History', '', [{ skill: 'Farming', level: 80 }]),
      q('Dishonour among Thieves', '', [{ skill: 'Agility', level: 80 }]),
      q('You Are It', '', []),
      q('The Needle Skips', '', []),
      q('Desperate Times', '', []),
      q('Imp Catcher', '', []),
      q('Wanted!', '', []),
      q('Quiet Before the Swarm', '', []),
      q('Heart of Stone', '', []),
      q('Tai Bwo Wannai Trio', '', []),
      q('Dwarf Cannon', '', []),
      q('The Death of Chivalry', '', []),
    ],
  },
  {
    id: 'part4',
    title: 'Part 4: Endgame Combat Training',
    wiki: 'https://runescape.wiki/w/Ironman_Mode/Guide/Efficient_Ironman_Pathway_Guide#Part_4:_Endgame_combat_training',
    steps: [
      step('128,500 DG tokens — Charming imp, Bonecrusher, Twisted bird skull, Gem bag upgrade', '', [{ skill: 'Dungeoneering', level: 5 }]),
      pvm(
        'Buy Spirit cape (45,000 DG tokens)',
        'Permanently reduces familiar special move cost by 20% — buy before Summoning training.',
        [{ skill: 'Dungeoneering', level: 5 }],
        { wiki: 'https://runescape.wiki/w/Spirit_cape' }
      ),
      step('Train Summoning to 75', '', [{ skill: 'Summoning', level: 75 }]),
      step(
        'Train Prayer to 75',
        'Use dragon bones from blues/greens until Ritual of the Mahjarrat unlocks Vindicta (Part 5). Then farm noted bones there.',
        [{ skill: 'Prayer', level: 75 }]
      ),
      step('Train Magic to 90', '', [{ skill: 'Magic', level: 90 }]),
      step('Train Defence to 90', '', [{ skill: 'Defence', level: 90 }]),
      step('Train Necromancy to 90', 'Optional: smith/craft gear upgrades along the way.', [{ skill: 'Necromancy', level: 90 }]),
      step('Train Ranged to 90', '', [{ skill: 'Ranged', level: 90 }]),
      step('Train Attack to 90', '', [{ skill: 'Attack', level: 90 }]),
      step('Train Strength to 90', '', [{ skill: 'Strength', level: 90 }]),
    ],
  },
  {
    id: 'part5',
    title: 'Part 5: End-Game Skilling & Quests',
    wiki: 'https://runescape.wiki/w/Ironman_Mode/Guide/Efficient_Ironman_Pathway_Guide#Part_5:_End-game_skilling_&_quests',
    steps: [
      step('Train Woodcutting to 61', 'Acadia in Menaphos Imperial.', [{ skill: 'Woodcutting', level: 61 }]),
      q('As a First Resort', '', [{ skill: 'Construction', level: 61 }]),
      step('Train Fletching to 52', '14250 steel arrows — smith arrowheads + buy feathers/headless arrows per miniguide.', [{ skill: 'Fletching', level: 52 }]),
      q('Catapult Construction', '', [{ skill: 'Agility', level: 61 }]),
      q('A Void Dance', '', [{ skill: 'Hunter', level: 61 }]),
      step('Obtain Dragon hatchet from Dagannoth Rex', '', [{ skill: 'Attack', level: 61 }]),
      step('Train Woodcutting to 79', '', [{ skill: 'Woodcutting', level: 79 }]),
      step('Train Firemaking to 75', 'Burn maple & acadia from bank.', [{ skill: 'Firemaking', level: 75 }]),
      step('Train Smithing to 80', 'Artisans\' Workshop burial sets — see miniguide.', [{ skill: 'Smithing', level: 80 }]),
      q('Defender of Varrock', '', [{ skill: 'Smithing', level: 80 }]),
      q('Devious Minds', '', [{ skill: 'Smithing', level: 80 }]),
      step('Train Crafting to 76', 'Cut 17000 gems from Al Kharid.', [{ skill: 'Crafting', level: 76 }]),
      step('Train Agility to 77', 'Wilderness (regular) or Het\'s Oasis (HCIM).', [{ skill: 'Agility', level: 77 }]),
      step('Train Slayer to 67', 'Reclaim glossy lamp at 70 from Guthix Cave.', [{ skill: 'Slayer', level: 67 }]),
      step('Buy broad arrow ability; train Fletching to 75', '68000 broad arrows — buy broad arrowheads from Slayer masters + weekly shop run.', [{ skill: 'Fletching', level: 75 }]),
      q('The Branches of Darkmeyer', '', [{ skill: 'Agility', level: 77 }]),
      q('Kindred Spirits', '', [{ skill: 'Agility', level: 77 }]),
      q('While Guthix Sleeps', '', [{ skill: 'Agility', level: 77 }]),
      q('Spirit of Summer', '', [{ skill: 'Agility', level: 77 }]),
      q('Summer\'s End', '', [{ skill: 'Agility', level: 77 }]),
      q('The Curse of Arrav', '', [{ skill: 'Agility', level: 77 }]),
      q('The Temple at Senntisten', '', [{ skill: 'Prayer', level: 77 }]),
      q('Rocking Out', '', [{ skill: 'Agility', level: 77 }]),
      q('The Slug Menace', '', [{ skill: 'Slayer', level: 77 }]),
      q('Ritual of the Mahjarrat', '', []),
      prep(
        'Kill Vindicta for noted dragon bones',
        'Requires Ritual of the Mahjarrat. Noted bones for Prayer 80+ grinds and daily farming.',
        [{ skill: 'Combat', level: 85 }],
        { wiki: 'https://runescape.wiki/w/Vindicta' }
      ),
      step('Reclaim 3 Ancient lamps from Guthix\'s Cave', '', []),
      step('Train Construction to 70 then 79', 'Contracts or Fort Forinthry.', [{ skill: 'Construction', level: 79 }]),
      q('Within the Light', '', [{ skill: 'Agility', level: 77 }]),
      q('Plague\'s End', 'Unlocks Recipe Shop — elder overload potions & combination pots.', [{ skill: 'Agility', level: 77 }]),
      step('Train Hunter to 76', 'Croesus trash runs or black salamanders.', [{ skill: 'Hunter', level: 76 }]),
      q(
        'Beneath Scabaras\' Sands',
        'Primed keris — consecrated keris after 200 elite profane scabarites.',
        [],
        { tags: ['pvm', 'quest'] }
      ),
      q('One of a Kind', '', [{ skill: 'Hunter', level: 76 }]),
      q('The Lord of Vampyrium', '', [{ skill: 'Agility', level: 77 }]),
      step('Reclaim 30k XP lamp from Sliske (Empyrean Citadel)', '', []),
      step('Train Herblore to 80', '', [{ skill: 'Herblore', level: 80 }]),
      q('River of Blood', '', [{ skill: 'Agility', level: 77 }]),
      step('Train Archaeology to 74', 'See archaeology miniguide.', [{ skill: 'Archaeology', level: 74 }]),
      q('The Vault of Shadows', '', []),
      q('Desperate Measures', '', []),
      q('Desperate Creatures', '', []),
      q('Raksha, the Shadow Colossus (quest)', '', []),
      q('Azzanadra\'s Quest', '', []),
      q('Battle of the Monolith', 'Can skill at Digsite Exam Centre bank.', []),
      q('City of Senntisten', '', []),
      q('Eye of Het I', '', []),
      q('Eye of Het II', '', []),
      q('Sins of the Father', '', []),
      q('Extinction', 'Combine warped gem with Ring of vigour for passive effect (buy vigour step below).', []),
      pvm(
        'Buy Ring of vigour (50,000 DG tokens)',
        'Combine with warped gem from Extinction — essential passive for bossing.',
        [{ skill: 'Dungeoneering', level: 5 }],
        { wiki: 'https://runescape.wiki/w/Ring_of_vigour' }
      ),
      q('The Void Stares Back', '', [{ skill: 'Magic', level: 90 }]),
      q('The Mighty Fall', '', [{ skill: 'Agility', level: 77 }]),
      q('Nomad\'s Requiem', '', [{ skill: 'Magic', level: 90 }]),
      q('Nomad\'s Elegy', '', [{ skill: 'Magic', level: 90 }]),
      step('Complete Barbarian Training', '', [], { wiki: 'https://runescape.wiki/w/Barbarian_Training' }),
      q('Hero\'s Welcome', '', [{ skill: 'Smithing', level: 80 }]),
      q('Fate of the Gods', '', [{ skill: 'Magic', level: 90 }]),
      step('Train Crafting to 83', 'Prifddinas harps.', [{ skill: 'Crafting', level: 83 }]),
      step('Upgrade Tears of Guthix bowl', '', []),
      step('Train Agility to 80', '', [{ skill: 'Agility', level: 80 }]),
      step('Train Prayer to 80', '', [{ skill: 'Prayer', level: 80 }]),
      step('Reclaim 250k Prayer XP lamp from Guthixian High Druid', 'Requires 80 Prayer to use.', [{ skill: 'Prayer', level: 80 }]),
      step('Train Slayer to 80', '', [{ skill: 'Slayer', level: 80 }]),
      q('The Light Within', '', [{ skill: 'Agility', level: 80 }]),
      q('Children of Mah', '', []),
      q('Sliske\'s Endgame', '', []),
    ],
  },
  {
    id: 'part6',
    title: 'Part 6: Final Bossing Preparation',
    wiki: 'https://runescape.wiki/w/Ironman_Mode/Guide/Efficient_Ironman_Pathway_Guide#Part_6:_Final_bossing_preparation',
    steps: [
      step('Complete Invention Tutorial', 'Claim 10k free XP from Chuck (Back to the Freezer).', [{ skill: 'Invention', level: 80 }], { wiki: 'https://runescape.wiki/w/Invention/Tutorial' }),
      step('Augment 2 black salamanders → level 5 → disassemble', '', [{ skill: 'Invention', level: 80 }]),
      step('Train Prayer to 95', 'Vindicta bones, vyres, cleansing crystals, Ivar colossal bones.', [{ skill: 'Prayer', level: 95 }]),
      step('Train Summoning to 99', 'Arch-Glacor charms recommended.', [{ skill: 'Summoning', level: 99 }]),
      prep(
        'Gather materials for 3000 Sign of the porter IV',
        'Divine energy + porter charges per calculator. Farm memories at Memorial/Divination spots or buy energy.',
        [{ skill: 'Divination', level: 80 }],
        { wiki: 'https://runescape.wiki/w/Sign_of_the_porter' }
      ),
      step('Create 3000 Sign of the porter IV', '', [{ skill: 'Divination', level: 80 }]),
      step('Train Archaeology to 95', '', [{ skill: 'Archaeology', level: 95 }]),
      step('Obtain 2 dragon mattocks in Big Game Hunter', 'Prioritise Bagrada rex for vuln bombs at PoF. Corbicula rex & malletops PoF = PvM perks when ready.', [{ skill: 'Hunter', level: 76 }]),
      q(
        'Curse of the Black Stone',
        '10% damage reduction in Temple of Aminishi, Dragonkin Laboratory & Shadow Reef.',
        [],
        { tags: ['pvm', 'quest'] }
      ),
      pvm(
        'Elite dungeon chest upgrade (750,000 DG tokens)',
        'Bank inside EDs; bosses always roll 20% double-loot chance.',
        [{ skill: 'Dungeoneering', level: 5 }],
        { wiki: 'https://runescape.wiki/w/Dungeoneering#Rewards' }
      ),
      pvm(
        'War\'s Retreat — progress War\'s Wares unlocks',
        '10 kills: campfire. 100: teleport. 200: boss portal. 500: Altar of War. 1000: cooldown reset. 2000: adrenaline crystals.',
        [{ skill: 'Combat', level: 85 }],
        { wiki: 'https://runescape.wiki/w/War%27s_Retreat' }
      ),
      q(
        'Succession',
        'Dive ability + Infernal Puzzle Box on toolbelt. Infernus & Wilderness damage bonuses.',
        [],
        { tags: ['pvm', 'quest'] }
      ),
      q(
        'Daughter of Chaos',
        'Upgrades Infernal Puzzle Box — reduced environmental damage in Infernus.',
        [],
        { tags: ['pvm', 'quest'] }
      ),
      q(
        'Song from the Depths',
        'Reduced incoming damage vs Queen Black Dragon.',
        [],
        { tags: ['pvm', 'quest'] }
      ),
      q(
        'Twilight of the Gods',
        '10% damage reduction vs Zamorak, Lord of Chaos.',
        [],
        { tags: ['pvm', 'quest'] }
      ),
      q(
        'The Brink of Extinction',
        'Obsidian armour — 45% dr in Fight Cave, Fight Kiln & TzekHaar Front.',
        [{ skill: 'Summoning', level: 99 }],
        { tags: ['pvm', 'quest'] }
      ),
      prep(
        'Complete Fight Cave for fire cape',
        'Required before The Elder Kiln. Obsidian armour from Brink of Extinction helps. See Fight Cave guide.',
        [{ skill: 'Combat', level: 90 }],
        { wiki: 'https://runescape.wiki/w/Fight_Cave' }
      ),
      q(
        'The Elder Kiln',
        'TokHaar-Kal cape — sacrifice fire cape from Fight Cave to enter.',
        [{ skill: 'Summoning', level: 99 }],
        { tags: ['pvm', 'quest'] }
      ),
      pvm(
        'Reaper store: Reaper\'s Choice + Instance cost + Death\'s Support',
        '250 pts each — choose tasks, cheaper instances, stronger signs of life/death.',
        [],
        { wiki: 'https://runescape.wiki/w/Reaper_points#Rewards' }
      ),
      pvm(
        'Reaper Crew — defeat every Reaper boss once',
        'Permanent stat boost from Death.',
        [],
        { wiki: 'https://runescape.wiki/w/Reaper_Crew' }
      ),
    ],
  },
  {
    id: 'miniguides',
    title: 'Miniguides Reference',
    wiki: 'https://runescape.wiki/w/Ironman_Mode/Guide/Efficient_Ironman_Pathway_Guide#Miniguides',
    description: 'Shop runs, dailies detail, and training references from the wiki pathway guide.',
    steps: [
      step('Weekly Shop Run', 'Broad arrowheads (until 400k), bloodweed seeds, runes, vials, meat boxes, insulated boots, scimitars.', [], { tags: ['weekly'], repeat: 'weekly' }),
      step('Crystal tree blossom (94 Farming)', 'Accumulates 30 days of charges — check weekly.', [{ skill: 'Farming', level: 94 }], { tags: ['weekly'], repeat: 'weekly' }),
      step('Efficient Mining & Smithing (40–80)', 'Burial sets at Artisans\' Workshop world 70. Solemn Smith → Golden Cannon → Royale Cannon.', [{ skill: 'Smithing', level: 80 }], { wiki: 'https://runescape.wiki/w/Artisans%27_Workshop' }),
      step('Efficient Archaeology (95/99)', 'Complete mysteries & collections per wiki table; Armadylean I ×7, Green Gobbo ×46, Red Rum ×100.', [{ skill: 'Archaeology', level: 95 }], { wiki: 'https://runescape.wiki/w/Archaeology_training' }),
      step('Rapid growth on Het\'s Oasis bushes', '4 bushes, 2× per bush. Requires 88 Magic.', [{ skill: 'Magic', level: 88 }], { tags: ['daily'], repeat: 'daily' }),
      step('Soul Obelisk (daily)', 'Menaphos reputation / ports prep.', [], { tags: ['daily'], repeat: 'daily' }),
    ],
  },
];

/** Flatten parts into numbered steps with stable title-based IDs */
function stepSlug(title) {
  return String(title)
    .toLowerCase()
    .replace(/'/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
    .slice(0, 72);
}

export function buildStepIndex(parts = GUIDE_PARTS) {
  let index = 0;
  const flat = [];
  const usedIds = new Set();
  for (const part of parts) {
    for (const raw of part.steps) {
      index += 1;
      let slug = stepSlug(raw.title);
      let id = `${part.id}--${slug}`;
      let n = 2;
      while (usedIds.has(id)) {
        id = `${part.id}--${slug}-${n++}`;
      }
      usedIds.add(id);
      flat.push({
        ...raw,
        id,
        partId: part.id,
        partTitle: part.title,
        globalIndex: index,
      });
    }
  }
  return flat;
}
