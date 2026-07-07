import { ENCOUNTER_TABLES, pickWeightedSpecies } from './encounters';
import type { BattleSpec } from './types';

const GENERIC_TRAINER_NAMES = ['Youngster', 'Lass', 'Hiker', 'Bug Catcher'];

const FALLBACK_SPECIES = 'Bidoof';

export function generateRouteTrainer(segmentId: string): BattleSpec {
  const table = ENCOUNTER_TABLES[segmentId];
  const rosterSize = 1 + Math.floor(Math.random() * 2); // 1-2
  const roster = Array.from({ length: rosterSize }, () => (table ? pickWeightedSpecies(table) : FALLBACK_SPECIES));

  return {
    trainer: GENERIC_TRAINER_NAMES[Math.floor(Math.random() * GENERIC_TRAINER_NAMES.length)],
    roster,
    runEnding: false,
    tier: 1,
  };
}
