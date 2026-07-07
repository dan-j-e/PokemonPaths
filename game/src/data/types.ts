export type ActionType = 'heal' | 'catch' | 'item' | 'lore';

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
}

export interface TeamMember {
  species: string;
}

export interface RunState {
  segmentIndex: number;
  battleSubIndex?: number;
  starter?: string;
  team: TeamMember[];
  bench: TeamMember[];
}
