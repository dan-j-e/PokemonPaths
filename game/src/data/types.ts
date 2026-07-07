export type ActionType = 'heal' | 'catch' | 'item' | 'lore';

export interface BattleSpec {
  trainer: string;
  roster: string[];
  runEnding: boolean;
}

export interface Segment {
  id: string;
  name: string;
  kind: 'battle' | 'non-battle';
  battles?: BattleSpec[];
  actionPool?: ActionType[];
}

export interface RunState {
  segmentIndex: number;
  battleSubIndex?: number;
  starter?: string;
}
