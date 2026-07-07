export interface EncounterEntry {
  species: string;
  weight: number;
}

// Simplified from Bulbapedia Diamond/Pearl encounter tables: grass/cave land encounters only
// (surf, fishing rods, swarms, Poke Radar, dual-slot, and time-of-day/version splits dropped —
// see GDD "Battle & Catch System" for the full simplification rationale). Weights are relative,
// not literal percentages, and multi-location merged segments pool their constituent locations'
// tables together.
export const ENCOUNTER_TABLES: Record<string, EncounterEntry[]> = {
  'route-201': [
    { species: 'Starly', weight: 47 },
    { species: 'Bidoof', weight: 53 },
  ],
  'route-202': [
    { species: 'Starly', weight: 33 },
    { species: 'Bidoof', weight: 30 },
    { species: 'Kricketot', weight: 10 },
    { species: 'Shinx', weight: 30 },
  ],
  'route-203': [
    { species: 'Zubat', weight: 10 },
    { species: 'Abra', weight: 15 },
    { species: 'Starly', weight: 35 },
    { species: 'Bidoof', weight: 15 },
    { species: 'Kricketot', weight: 10 },
    { species: 'Shinx', weight: 25 },
  ],
  'oreburgh-gate': [
    { species: 'Zubat', weight: 20 },
    { species: 'Geodude', weight: 80 },
  ],
  'route-204': [
    { species: 'Zubat', weight: 10 },
    { species: 'Starly', weight: 30 },
    { species: 'Bidoof', weight: 25 },
    { species: 'Kricketot', weight: 10 },
    { species: 'Shinx', weight: 15 },
    { species: 'Budew', weight: 20 },
  ],
  'route-205': [
    { species: 'Bidoof', weight: 10 },
    { species: 'Pachirisu', weight: 10 },
    { species: 'Buizel', weight: 35 },
    { species: 'Shellos', weight: 45 },
  ],
  'eterna-forest': [
    { species: 'Wurmple', weight: 25 },
    { species: 'Budew', weight: 25 },
    { species: 'Buneary', weight: 19 },
  ],
  'mt-coronet-crossing': [
    { species: 'Zubat', weight: 55 },
    { species: 'Geodude', weight: 97 },
    { species: 'Ponyta', weight: 35 },
    { species: 'Kricketot', weight: 20 },
    { species: 'Kricketune', weight: 10 },
    { species: 'Stunky', weight: 25 },
    { species: 'Bronzor', weight: 10 },
    { species: 'Machop', weight: 72 },
    { species: 'Cleffa', weight: 12 },
    { species: 'Meditite', weight: 27 },
    { species: 'Chingling', weight: 10 },
    { species: 'Psyduck', weight: 30 },
    { species: 'Bidoof', weight: 20 },
  ],
  'hearthome-outskirts': [
    { species: 'Zubat', weight: 10 },
    { species: 'Gastly', weight: 10 },
    { species: 'Chansey', weight: 10 },
    { species: 'Starly', weight: 20 },
    { species: 'Staravia', weight: 20 },
    { species: 'Bibarel', weight: 38 },
    { species: 'Bonsly', weight: 8 },
    { species: 'Mr. Mime', weight: 8 },
    { species: 'Geodude', weight: 60 },
    { species: 'Ponyta', weight: 65 },
    { species: 'Kricketune', weight: 27 },
    { species: 'Abra', weight: 10 },
    { species: 'Kadabra', weight: 15 },
  ],
  'route-214': [
    { species: 'Geodude', weight: 20 },
    { species: 'Ponyta', weight: 30 },
    { species: 'Girafarig', weight: 10 },
    { species: 'Kricketune', weight: 15 },
    { species: 'Stunky', weight: 15 },
  ],
  'route-213': [
    { species: 'Wingull', weight: 15 },
    { species: 'Buizel', weight: 30 },
    { species: 'Floatzel', weight: 10 },
    { species: 'Shellos', weight: 45 },
  ],
  'route-210-north': [
    { species: 'Psyduck', weight: 20 },
    { species: 'Machop', weight: 25 },
    { species: 'Machoke', weight: 10 },
    { species: 'Hoothoot', weight: 10 },
    { species: 'Noctowl', weight: 10 },
    { species: 'Meditite', weight: 25 },
    { species: 'Bibarel', weight: 20 },
  ],
  'route-218': [
    { species: 'Mr. Mime', weight: 15 },
    { species: 'Wingull', weight: 10 },
    { species: 'Floatzel', weight: 35 },
    { species: 'Shellos', weight: 20 },
    { species: 'Gastrodon', weight: 20 },
  ],
  'mt-coronet-2': [
    { species: 'Zubat', weight: 15 },
    { species: 'Machop', weight: 25 },
    { species: 'Geodude', weight: 20 },
    { species: 'Cleffa', weight: 12 },
    { species: 'Meditite', weight: 10 },
    { species: 'Chingling', weight: 10 },
  ],
  'routes-216-217': [
    { species: 'Zubat', weight: 20 },
    { species: 'Machoke', weight: 40 },
    { species: 'Graveler', weight: 10 },
    { species: 'Noctowl', weight: 20 },
    { species: 'Sneasel', weight: 50 },
    { species: 'Meditite', weight: 20 },
    { species: 'Snover', weight: 50 },
  ],
  'mt-coronet-3': [
    { species: 'Zubat', weight: 15 },
    { species: 'Machop', weight: 25 },
    { species: 'Geodude', weight: 20 },
    { species: 'Cleffa', weight: 12 },
    { species: 'Meditite', weight: 10 },
    { species: 'Chingling', weight: 10 },
  ],
  'route-223': [
    { species: 'Tentacruel', weight: 60 },
    { species: 'Pelipper', weight: 30 },
    { species: 'Mantyke', weight: 10 },
  ],
  'victory-road': [
    { species: 'Golbat', weight: 60 },
    { species: 'Machoke', weight: 50 },
    { species: 'Graveler', weight: 40 },
    { species: 'Onix', weight: 20 },
    { species: 'Steelix', weight: 20 },
    { species: 'Medicham', weight: 45 },
    { species: 'Kadabra', weight: 25 },
    { species: 'Floatzel', weight: 30 },
  ],
};

export function pickWeightedSpecies(entries: EncounterEntry[]): string {
  const total = entries.reduce((sum, e) => sum + e.weight, 0);
  let roll = Math.random() * total;
  for (const entry of entries) {
    roll -= entry.weight;
    if (roll <= 0) return entry.species;
  }
  return entries[entries.length - 1].species;
}
