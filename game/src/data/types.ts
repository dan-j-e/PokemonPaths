import type { ItemType } from './items';

export type ActionType = 'catch' | 'item' | 'interact';

export interface BattleSpec {
  trainer: string;
  roster: string[];
  runEnding: boolean;
  /** Battle difficulty weight used by the roulette odds: 1=grunt/rival, 2=commander, 3=gym, 4=elite four, 5=champion. */
  tier: number;
}

export interface Segment {
  id: string;
  name: string;
  kind: 'battle' | 'non-battle';
  battles?: BattleSpec[];
  actionPool?: ActionType[];
  /** True for the 8 gym battle segments — used by the progress bar to count badges earned. */
  isGym?: boolean;
}

export interface TeamMember {
  species: string;
  /** Wins as active lead, toward EVOLUTION_WIN_THRESHOLD. Fractional when boosted by EXP Share. */
  wins?: number;
}

export interface RunState {
  segmentIndex: number;
  battleSubIndex?: number;
  starter?: string;
  team: TeamMember[];
  bench: TeamMember[];
  items: Record<ItemType, number>;
  /** X-Attack's queued win-odds bonus for the very next battle only. */
  pendingBoost: number;
  /** Set after a Potion retry: the lead species that must NOT still be leading when continuing. */
  mustChangeLeadFrom?: string;
  /** A one-off route encounter battle, not part of any segment's static battle list. */
  adHocBattle?: BattleSpec;
  /** Granted after winning Gym 4: every win also gives non-lead active team members partial win progress. */
  hasExpShare: boolean;
}
