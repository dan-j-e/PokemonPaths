import type { PokemonType } from './typeChart';

export interface SpeciesData {
  type1: PokemonType;
  type2?: PokemonType;
  /** National Dex number, used to build PokeAPI sprite URLs. */
  dexNumber: number;
  /** Base catch rate (3-255, Bulbapedia). Only present for species that appear in a wild encounter table. */
  catchRate?: number;
  /** Manual power override (1-8) for trainer-only species with no catch rate (never wild-encountered). */
  power?: number;
}

// Catch rates sourced from Bulbapedia (List of Pokemon by catch rate / individual species pages).
// A handful of common early-Sinnoh species that showed up in encounter-table research but weren't
// in the original catch-rate research pass are filled from general Pokemon knowledge (noted in the GDD).
// Trainer-only species (never wild-encountered in this game) get a manual `power` instead.
export const SPECIES: Record<string, SpeciesData> = {
  // Starters
  Turtwig: { type1: 'grass', dexNumber: 387, power: 4 },
  Chimchar: { type1: 'fire', dexNumber: 390, power: 4 },
  Piplup: { type1: 'water', dexNumber: 393, power: 4 },

  // Wild — catch rate sourced (route/cave encounter species)
  Bidoof: { type1: 'normal', dexNumber: 399, catchRate: 255 },
  Bibarel: { type1: 'normal', type2: 'water', dexNumber: 400, catchRate: 127 },
  Starly: { type1: 'normal', type2: 'flying', dexNumber: 396, catchRate: 255 },
  Staravia: { type1: 'normal', type2: 'flying', dexNumber: 397, catchRate: 120 },
  Kricketot: { type1: 'bug', dexNumber: 401, catchRate: 255 },
  Kricketune: { type1: 'bug', dexNumber: 402, catchRate: 45 },
  Shinx: { type1: 'electric', dexNumber: 403, catchRate: 235 },
  Budew: { type1: 'grass', type2: 'poison', dexNumber: 406, catchRate: 255 },
  Ponyta: { type1: 'fire', dexNumber: 77, catchRate: 190 },
  Geodude: { type1: 'rock', type2: 'ground', dexNumber: 74, catchRate: 255 },
  Machop: { type1: 'fighting', dexNumber: 66, catchRate: 180 },
  Zubat: { type1: 'poison', type2: 'flying', dexNumber: 41, catchRate: 255 },
  Meditite: { type1: 'fighting', type2: 'psychic', dexNumber: 307, catchRate: 180 },
  Wurmple: { type1: 'bug', dexNumber: 265, catchRate: 255 },
  Beautifly: { type1: 'bug', type2: 'flying', dexNumber: 267, catchRate: 45 },
  Dustox: { type1: 'bug', type2: 'poison', dexNumber: 269, catchRate: 45 },
  Buizel: { type1: 'water', dexNumber: 418, catchRate: 190 },
  Shellos: { type1: 'water', dexNumber: 422, catchRate: 190 },
  Gastrodon: { type1: 'water', type2: 'ground', dexNumber: 423, catchRate: 75 },
  Abra: { type1: 'psychic', dexNumber: 63, catchRate: 200 },
  Kadabra: { type1: 'psychic', dexNumber: 64, catchRate: 100 },
  Stunky: { type1: 'poison', type2: 'dark', dexNumber: 434, catchRate: 225 },
  Bronzor: { type1: 'steel', type2: 'psychic', dexNumber: 436, catchRate: 255 },
  Cleffa: { type1: 'normal', dexNumber: 173, catchRate: 150 },
  Chingling: { type1: 'psychic', dexNumber: 433, catchRate: 120 },
  Psyduck: { type1: 'water', dexNumber: 54, catchRate: 190 },
  Golduck: { type1: 'water', dexNumber: 55, catchRate: 75 },
  Barboach: { type1: 'water', type2: 'ground', dexNumber: 339, catchRate: 190 },
  Wingull: { type1: 'water', type2: 'flying', dexNumber: 278, catchRate: 190 },
  Pelipper: { type1: 'water', type2: 'flying', dexNumber: 279, catchRate: 45 },
  Tentacool: { type1: 'water', type2: 'poison', dexNumber: 72, catchRate: 190 },
  Tentacruel: { type1: 'water', type2: 'poison', dexNumber: 73, catchRate: 60 },
  Mantyke: { type1: 'water', type2: 'flying', dexNumber: 458, catchRate: 25 },
  Pachirisu: { type1: 'electric', dexNumber: 417, catchRate: 200 },
  Sneasel: { type1: 'dark', type2: 'ice', dexNumber: 215, catchRate: 60 },
  Snover: { type1: 'grass', type2: 'ice', dexNumber: 459, catchRate: 120 },
  Gastly: { type1: 'ghost', type2: 'poison', dexNumber: 92, catchRate: 190 },
  Chansey: { type1: 'normal', dexNumber: 113, catchRate: 30 },
  Bonsly: { type1: 'rock', dexNumber: 438, catchRate: 255 },
  'Mr. Mime': { type1: 'psychic', dexNumber: 122, catchRate: 45 },
  Girafarig: { type1: 'normal', type2: 'psychic', dexNumber: 203, catchRate: 60 },
  Hoothoot: { type1: 'normal', type2: 'flying', dexNumber: 163, catchRate: 190 },
  Noctowl: { type1: 'normal', type2: 'flying', dexNumber: 164, catchRate: 90 },
  Floatzel: { type1: 'water', dexNumber: 419, catchRate: 45 },
  Machoke: { type1: 'fighting', dexNumber: 67, catchRate: 90 },
  Onix: { type1: 'rock', type2: 'ground', dexNumber: 95, catchRate: 45 },
  Cranidos: { type1: 'rock', dexNumber: 408, catchRate: 45 },
  Golbat: { type1: 'poison', type2: 'flying', dexNumber: 42, catchRate: 90 },
  Croagunk: { type1: 'poison', type2: 'fighting', dexNumber: 453, catchRate: 140 },
  Graveler: { type1: 'rock', type2: 'ground', dexNumber: 75, catchRate: 120 },
  Buneary: { type1: 'normal', dexNumber: 427, catchRate: 190 },
  Medicham: { type1: 'fighting', type2: 'psychic', dexNumber: 308, catchRate: 180 },

  // Trainer-only (never wild-encountered here) — manual power by battle-tier/evolution stage
  Purugly: { type1: 'normal', dexNumber: 432, power: 4 },
  Roserade: { type1: 'grass', type2: 'poison', dexNumber: 407, power: 5 },
  Skuntank: { type1: 'poison', type2: 'dark', dexNumber: 435, power: 4 },
  Lucario: { type1: 'fighting', type2: 'steel', dexNumber: 448, power: 6 },
  Gyarados: { type1: 'water', type2: 'flying', dexNumber: 130, power: 6 },
  Quagsire: { type1: 'water', type2: 'ground', dexNumber: 195, power: 4 },
  Houndour: { type1: 'dark', type2: 'fire', dexNumber: 228, power: 3 },
  Drifblim: { type1: 'ghost', type2: 'flying', dexNumber: 426, power: 5 },
  Gengar: { type1: 'ghost', type2: 'poison', dexNumber: 94, power: 6 },
  Mismagius: { type1: 'ghost', dexNumber: 429, power: 5 },
  Steelix: { type1: 'steel', type2: 'ground', dexNumber: 208, power: 6 },
  Bastiodon: { type1: 'rock', type2: 'steel', dexNumber: 411, power: 5 },
  Toxicroak: { type1: 'poison', type2: 'fighting', dexNumber: 454, power: 4 },
  Piloswine: { type1: 'ice', type2: 'ground', dexNumber: 221, power: 4 },
  Abomasnow: { type1: 'grass', type2: 'ice', dexNumber: 460, power: 5 },
  Murkrow: { type1: 'dark', type2: 'flying', dexNumber: 198, power: 3 },
  Honchkrow: { type1: 'dark', type2: 'flying', dexNumber: 430, power: 6 },
  Crobat: { type1: 'poison', type2: 'flying', dexNumber: 169, power: 5 },
  Weavile: { type1: 'dark', type2: 'ice', dexNumber: 461, power: 6 },
  Raichu: { type1: 'electric', dexNumber: 26, power: 5 },
  Ambipom: { type1: 'normal', dexNumber: 424, power: 4 },
  Octillery: { type1: 'water', dexNumber: 224, power: 4 },
  Luxray: { type1: 'electric', dexNumber: 405, power: 6 },
  Vespiquen: { type1: 'bug', type2: 'flying', dexNumber: 416, power: 5 },
  Heracross: { type1: 'bug', type2: 'fighting', dexNumber: 214, power: 6 },
  Drapion: { type1: 'poison', type2: 'dark', dexNumber: 452, power: 6 },
  Whiscash: { type1: 'water', type2: 'ground', dexNumber: 340, power: 4 },
  Golem: { type1: 'rock', type2: 'ground', dexNumber: 76, power: 5 },
  Sudowoodo: { type1: 'rock', dexNumber: 185, power: 4 },
  Hippowdon: { type1: 'ground', dexNumber: 450, power: 6 },
  Rapidash: { type1: 'fire', dexNumber: 78, power: 4 },
  Lopunny: { type1: 'normal', dexNumber: 428, power: 4 },
  Infernape: { type1: 'fire', type2: 'fighting', dexNumber: 392, power: 7 },
  Alakazam: { type1: 'psychic', dexNumber: 65, power: 6 },
  Bronzong: { type1: 'steel', type2: 'psychic', dexNumber: 437, power: 6 },
  Spiritomb: { type1: 'ghost', type2: 'dark', dexNumber: 442, power: 6 },
  Milotic: { type1: 'water', dexNumber: 350, power: 6 },
  Garchomp: { type1: 'dragon', type2: 'ground', dexNumber: 445, power: 8 },
  Cherubi: { type1: 'grass', dexNumber: 420, power: 2 },

  // Evolution-only stages (reached via win-count evolution, never wild/trainer-rostered directly)
  Grotle: { type1: 'grass', dexNumber: 388, power: 5 },
  Torterra: { type1: 'grass', type2: 'ground', dexNumber: 389, power: 7 },
  Monferno: { type1: 'fire', type2: 'fighting', dexNumber: 391, power: 5 },
  Prinplup: { type1: 'water', dexNumber: 394, power: 5 },
  Empoleon: { type1: 'water', type2: 'steel', dexNumber: 395, power: 7 },
  Luxio: { type1: 'electric', dexNumber: 404, power: 4 },
  Roselia: { type1: 'grass', type2: 'poison', dexNumber: 315, power: 4 },
  Machamp: { type1: 'fighting', dexNumber: 68, power: 7 },
  Haunter: { type1: 'ghost', type2: 'poison', dexNumber: 93, power: 5 },
  Chimecho: { type1: 'psychic', dexNumber: 358, power: 4 },
  Staraptor: { type1: 'normal', type2: 'flying', dexNumber: 398, power: 7 },
  Silcoon: { type1: 'bug', dexNumber: 266, power: 2 },
  Cascoon: { type1: 'bug', dexNumber: 268, power: 2 },
};

export function getSpecies(name: string): SpeciesData {
  const data = SPECIES[name];
  if (!data) {
    throw new Error(`Unknown species: ${name}`);
  }
  return data;
}

export function derivePowerFromCatchRate(catchRate: number): number {
  const raw = 1 + ((255 - catchRate) / 255) * 7;
  return Math.min(8, Math.max(1, Math.round(raw)));
}

export function getPower(name: string): number {
  const data = getSpecies(name);
  if (data.power !== undefined) return data.power;
  if (data.catchRate !== undefined) return derivePowerFromCatchRate(data.catchRate);
  return 4;
}

export function catchChance(catchRate: number): number {
  return Math.min(0.95, Math.max(0.1, catchRate / 255));
}
