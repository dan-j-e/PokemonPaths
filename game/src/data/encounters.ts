export interface EncounterEntry {
  species: string;
  weight: number;
}

// Simplified from Bulbapedia Diamond/Pearl encounter tables: grass/cave land encounters only
// (surf, fishing rods, swarms, Poke Radar, dual-slot, and time-of-day/version splits dropped —
// see GDD "Battle & Catch System" for the full simplification rationale). Weights are relative,
// not literal percentages. Segment ids here reflect the trimmed-run merges (each combines the
// pooled tables of the original individual locations it replaced — weights summed where a
// species appeared in more than one of them).
export const ENCOUNTER_TABLES: Record<string, EncounterEntry[]> = {
  'route-201-202': [
    { species: 'Starly', weight: 115 },
    { species: 'Bidoof', weight: 98 },
    { species: 'Kricketot', weight: 20 },
    { species: 'Shinx', weight: 55 },
  ],
  'route-203-oreburgh-gate': [
    { species: 'Zubat', weight: 30 },
    { species: 'Abra', weight: 15 },
    { species: 'Geodude', weight: 80 },
  ],
  'route-204-floaroma': [
    { species: 'Zubat', weight: 10 },
    { species: 'Starly', weight: 30 },
    { species: 'Bidoof', weight: 25 },
    { species: 'Kricketot', weight: 10 },
    { species: 'Shinx', weight: 15 },
    { species: 'Budew', weight: 20 },
  ],
  'route-205-eterna-forest': [
    { species: 'Bidoof', weight: 10 },
    { species: 'Pachirisu', weight: 10 },
    { species: 'Buizel', weight: 35 },
    { species: 'Shellos', weight: 45 },
    { species: 'Wurmple', weight: 25 },
    { species: 'Budew', weight: 25 },
    { species: 'Buneary', weight: 19 },
  ],
  'mt-coronet-crossing': [
    { species: 'Zubat', weight: 65 },
    { species: 'Geodude', weight: 157 },
    { species: 'Machop', weight: 72 },
    { species: 'Bronzor', weight: 10 },
    { species: 'Meditite', weight: 27 },
    { species: 'Chingling', weight: 10 },
    { species: 'Gastly', weight: 10 },
    { species: 'Abra', weight: 10 },
    { species: 'Kadabra', weight: 15 },
    { species: 'Kricketune', weight: 37 },
    { species: 'Bonsly', weight: 8 },
    { species: 'Cranidos', weight: 8 },
  ],
  'hearthome-outskirts': [
    { species: 'Ponyta', weight: 100 },
    { species: 'Kricketot', weight: 20 },
    { species: 'Stunky', weight: 25 },
    { species: 'Cleffa', weight: 12 },
    { species: 'Psyduck', weight: 30 },
    { species: 'Bidoof', weight: 20 },
    { species: 'Chansey', weight: 10 },
    { species: 'Starly', weight: 20 },
    { species: 'Staravia', weight: 20 },
    { species: 'Bibarel', weight: 38 },
    { species: 'Mr. Mime', weight: 8 },
  ],
  'route-213-214': [
    { species: 'Geodude', weight: 20 },
    { species: 'Ponyta', weight: 30 },
    { species: 'Girafarig', weight: 10 },
    { species: 'Kricketune', weight: 15 },
    { species: 'Stunky', weight: 15 },
    { species: 'Wingull', weight: 15 },
    { species: 'Buizel', weight: 30 },
    { species: 'Floatzel', weight: 10 },
    { species: 'Shellos', weight: 45 },
    { species: 'Croagunk', weight: 15 },
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
    { species: 'Barboach', weight: 20 },
  ],
  'coronet-to-snowpoint': [
    { species: 'Zubat', weight: 35 },
    { species: 'Machop', weight: 25 },
    { species: 'Geodude', weight: 20 },
    { species: 'Cleffa', weight: 12 },
    { species: 'Meditite', weight: 30 },
    { species: 'Chingling', weight: 10 },
    { species: 'Machoke', weight: 40 },
    { species: 'Graveler', weight: 10 },
    { species: 'Noctowl', weight: 20 },
    { species: 'Sneasel', weight: 50 },
    { species: 'Snover', weight: 50 },
  ],
  'mt-coronet-pre-spear-pillar': [
    { species: 'Zubat', weight: 15 },
    { species: 'Machop', weight: 25 },
    { species: 'Geodude', weight: 20 },
    { species: 'Cleffa', weight: 12 },
    { species: 'Meditite', weight: 10 },
    { species: 'Chingling', weight: 10 },
  ],
  // 50/50 legendary encounter — a fixed 2-entry table doubles as the coin flip (no other
  // action is offered on this segment, see segments.ts's 'spear-pillar-legendary' entry).
  'spear-pillar-legendary': [
    { species: 'Dialga', weight: 1 },
    { species: 'Palkia', weight: 1 },
  ],
  'route-223-victory-road': [
    { species: 'Tentacruel', weight: 60 },
    { species: 'Tentacool', weight: 40 },
    { species: 'Pelipper', weight: 30 },
    { species: 'Mantyke', weight: 10 },
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
