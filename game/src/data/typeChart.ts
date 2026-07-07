export type PokemonType =
  | 'normal'
  | 'fire'
  | 'water'
  | 'electric'
  | 'grass'
  | 'ice'
  | 'fighting'
  | 'poison'
  | 'ground'
  | 'flying'
  | 'psychic'
  | 'bug'
  | 'rock'
  | 'ghost'
  | 'dragon'
  | 'dark'
  | 'steel';

const SUPER_EFFECTIVE: Record<PokemonType, PokemonType[]> = {
  normal: [],
  fire: ['grass', 'ice', 'bug', 'steel'],
  water: ['fire', 'ground', 'rock'],
  electric: ['water', 'flying'],
  grass: ['water', 'ground', 'rock'],
  ice: ['grass', 'ground', 'flying', 'dragon'],
  fighting: ['normal', 'ice', 'rock', 'dark', 'steel'],
  poison: ['grass'],
  ground: ['fire', 'electric', 'poison', 'rock', 'steel'],
  flying: ['grass', 'fighting', 'bug'],
  psychic: ['fighting', 'poison'],
  bug: ['grass', 'psychic', 'dark'],
  rock: ['fire', 'ice', 'flying', 'bug'],
  ghost: ['ghost', 'psychic'],
  dragon: ['dragon'],
  dark: ['ghost', 'psychic'],
  steel: ['ice', 'rock'],
};

const NOT_VERY_EFFECTIVE: Record<PokemonType, PokemonType[]> = {
  normal: ['rock', 'steel'],
  fire: ['fire', 'water', 'rock', 'dragon'],
  water: ['water', 'grass', 'dragon'],
  electric: ['electric', 'grass', 'dragon'],
  grass: ['fire', 'grass', 'poison', 'flying', 'bug', 'dragon', 'steel'],
  ice: ['fire', 'water', 'ice', 'steel'],
  fighting: ['poison', 'flying', 'psychic', 'bug'],
  poison: ['poison', 'ground', 'rock', 'ghost'],
  ground: ['grass', 'bug'],
  flying: ['electric', 'rock', 'steel'],
  psychic: ['psychic', 'steel'],
  bug: ['fire', 'fighting', 'poison', 'flying', 'ghost', 'steel'],
  rock: ['fighting', 'ground', 'steel'],
  ghost: ['dark'],
  dragon: ['steel'],
  dark: ['fighting', 'dark'],
  steel: ['fire', 'water', 'electric', 'steel'],
};

const NO_EFFECT: Record<PokemonType, PokemonType[]> = {
  normal: ['ghost'],
  fire: [],
  water: [],
  electric: ['ground'],
  grass: [],
  ice: [],
  fighting: ['ghost'],
  poison: ['steel'],
  ground: ['flying'],
  flying: [],
  psychic: ['dark'],
  bug: [],
  rock: [],
  ghost: ['normal'],
  dragon: [],
  dark: [],
  steel: [],
};

function singleTypeMultiplier(attacker: PokemonType, defender: PokemonType): number {
  if (NO_EFFECT[attacker].includes(defender)) return 0;
  if (SUPER_EFFECTIVE[attacker].includes(defender)) return 2;
  if (NOT_VERY_EFFECTIVE[attacker].includes(defender)) return 0.5;
  return 1;
}

export function typeMultiplier(attacker: PokemonType, defenderTypes: PokemonType[]): number {
  return defenderTypes.reduce((mult, def) => mult * singleTypeMultiplier(attacker, def), 1);
}

export type MatchupTier = 'overwhelming' | 'advantage' | 'neutral' | 'disadvantage' | 'overwhelmed';

export interface TypedPokemon {
  type1: PokemonType;
  type2?: PokemonType;
}

function bestOffense(attacker: TypedPokemon, defenderTypes: PokemonType[]): number {
  const attackerTypes = [attacker.type1, ...(attacker.type2 ? [attacker.type2] : [])];
  return Math.max(...attackerTypes.map((t) => typeMultiplier(t, defenderTypes)));
}

export function matchupTier(mine: TypedPokemon, theirs: TypedPokemon): MatchupTier {
  const theirTypes = [theirs.type1, ...(theirs.type2 ? [theirs.type2] : [])];
  const myTypes = [mine.type1, ...(mine.type2 ? [mine.type2] : [])];

  const myBest = bestOffense(mine, theirTypes);
  const theirBest = bestOffense(theirs, myTypes);
  const ratio = myBest / Math.max(theirBest, 0.25);

  if (ratio >= 4) return 'overwhelming';
  if (ratio >= 2) return 'advantage';
  if (ratio > 0.5) return 'neutral';
  if (ratio > 0.25) return 'disadvantage';
  return 'overwhelmed';
}
