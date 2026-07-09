import type { BattleSpec } from './types';

// tier: 1=grunt/rival, 2=commander, 3=gym, 4=elite four, 5=champion (feeds the roulette's lose weight)

export const BARRY_1: BattleSpec = { trainer: 'Barry', roster: ['Starly'], runEnding: false, tier: 1 };

export const GYM_ROARK: BattleSpec = {
  trainer: 'Roark (Gym Leader)',
  roster: ['Geodude', 'Onix', 'Cranidos'],
  runEnding: true,
  tier: 3,
};

export const MARS_2: BattleSpec = {
  trainer: 'Commander Mars',
  roster: ['Zubat', 'Purugly'],
  runEnding: false,
  tier: 2,
};

export const GYM_GARDENIA: BattleSpec = {
  trainer: 'Gardenia (Gym Leader)',
  roster: ['Cherubi', 'Turtwig', 'Roserade'],
  runEnding: true,
  tier: 3,
};

export const JUPITER_1: BattleSpec = {
  trainer: 'Commander Jupiter',
  roster: ['Zubat', 'Skuntank'],
  runEnding: false,
  tier: 2,
};

export const GYM_MAYLENE: BattleSpec = {
  trainer: 'Maylene (Gym Leader)',
  roster: ['Meditite', 'Machoke', 'Lucario'],
  runEnding: true,
  tier: 3,
};

export const GYM_CRASHER_WAKE: BattleSpec = {
  trainer: 'Crasher Wake (Gym Leader)',
  roster: ['Gyarados', 'Quagsire', 'Floatzel'],
  runEnding: true,
  tier: 3,
};

export const GYM_FANTINA: BattleSpec = {
  trainer: 'Fantina (Gym Leader)',
  roster: ['Drifblim', 'Gengar', 'Mismagius'],
  runEnding: true,
  tier: 3,
};

export const GYM_BYRON: BattleSpec = {
  trainer: 'Byron (Gym Leader)',
  roster: ['Bronzor', 'Steelix', 'Bastiodon'],
  runEnding: true,
  tier: 3,
};

export const GYM_CANDICE: BattleSpec = {
  trainer: 'Candice (Gym Leader)',
  roster: ['Sneasel', 'Piloswine', 'Medicham', 'Abomasnow'],
  runEnding: true,
  tier: 3,
};

export const CYRUS_1: BattleSpec = {
  trainer: 'Cyrus',
  roster: ['Murkrow', 'Sneasel', 'Golbat'],
  runEnding: false,
  tier: 2,
};

// Reinstated from the original 37-segment design (cut in the trim to 23) to space Team Galactic
// battles between gyms 3-5 instead of leaving the Spear Pillar trio as the only mid/late-game showing.
export const GALACTIC_GRUNT_CELESTIC: BattleSpec = {
  trainer: 'Team Galactic Grunt',
  roster: ['Golbat', 'Houndour', 'Croagunk'],
  runEnding: false,
  tier: 1,
};
export const MARS_3: BattleSpec = {
  trainer: 'Commander Mars',
  roster: ['Golbat', 'Purugly'],
  runEnding: false,
  tier: 2,
};
export const JUPITER_2: BattleSpec = {
  trainer: 'Commander Jupiter',
  roster: ['Golbat', 'Bronzor', 'Skuntank'],
  runEnding: false,
  tier: 2,
};

export const MARS_4: BattleSpec = {
  trainer: 'Commander Mars',
  roster: ['Golbat', 'Purugly'],
  runEnding: false,
  tier: 2,
};
export const JUPITER_3: BattleSpec = {
  trainer: 'Commander Jupiter',
  roster: ['Bronzor', 'Skuntank'],
  runEnding: false,
  tier: 2,
};
export const CYRUS_2: BattleSpec = {
  trainer: 'Cyrus',
  roster: ['Honchkrow', 'Gyarados', 'Crobat', 'Weavile'],
  runEnding: false,
  tier: 2,
};

export const GYM_VOLKNER: BattleSpec = {
  trainer: 'Volkner (Gym Leader)',
  roster: ['Raichu', 'Ambipom', 'Octillery', 'Luxray'],
  runEnding: true,
  tier: 3,
};

export const E4_AARON: BattleSpec = {
  trainer: 'Aaron (Elite Four)',
  roster: ['Dustox', 'Beautifly', 'Vespiquen', 'Heracross', 'Drapion'],
  runEnding: true,
  tier: 4,
};
export const E4_BERTHA: BattleSpec = {
  trainer: 'Bertha (Elite Four)',
  roster: ['Quagsire', 'Whiscash', 'Golem', 'Sudowoodo', 'Hippowdon'],
  runEnding: true,
  tier: 4,
};
export const E4_FLINT: BattleSpec = {
  trainer: 'Flint (Elite Four)',
  roster: ['Rapidash', 'Steelix', 'Lopunny', 'Drifblim', 'Infernape'],
  runEnding: true,
  tier: 4,
};
export const E4_LUCIAN: BattleSpec = {
  trainer: 'Lucian (Elite Four)',
  roster: ['Mr. Mime', 'Girafarig', 'Medicham', 'Alakazam', 'Bronzong'],
  runEnding: true,
  tier: 4,
};

export const CHAMPION_CYNTHIA: BattleSpec = {
  trainer: 'Cynthia (Champion)',
  roster: ['Spiritomb', 'Roserade', 'Gastrodon', 'Lucario', 'Milotic', 'Garchomp'],
  runEnding: true,
  tier: 5,
};
