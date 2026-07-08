import type { RunState, TeamMember } from './types';

export const EVOLUTION_WIN_THRESHOLD = 2;
export const EXP_SHARE_BONUS = 0.33;

// Win-count evolution applies uniformly regardless of the real games' method (level/stone/trade/
// happiness) — a deliberate simplification. No stage is skipped: branch points (currently only
// Wurmple) list every real option and are picked with equal odds; the second stage after a branch
// is deterministic where it is in the real games (Silcoon always -> Beautifly, Cascoon -> Dustox).
export const EVOLUTIONS: Record<string, string | string[]> = {
  Turtwig: 'Grotle',
  Grotle: 'Torterra',
  Chimchar: 'Monferno',
  Monferno: 'Infernape',
  Piplup: 'Prinplup',
  Prinplup: 'Empoleon',
  Bidoof: 'Bibarel',
  Starly: 'Staravia',
  Staravia: 'Staraptor',
  Shinx: 'Luxio',
  Luxio: 'Luxray',
  Budew: 'Roselia',
  Roselia: 'Roserade',
  Geodude: 'Graveler',
  Graveler: 'Golem',
  Machop: 'Machoke',
  Machoke: 'Machamp',
  Zubat: 'Golbat',
  Golbat: 'Crobat',
  Wurmple: ['Silcoon', 'Cascoon'],
  Silcoon: 'Beautifly',
  Cascoon: 'Dustox',
  Ponyta: 'Rapidash',
  Meditite: 'Medicham',
  Psyduck: 'Golduck',
  Abra: 'Kadabra',
  Kadabra: 'Alakazam',
  Gastly: 'Haunter',
  Haunter: 'Gengar',
  Bronzor: 'Bronzong',
  Chingling: 'Chimecho',
  Wingull: 'Pelipper',
  Sneasel: 'Weavile',
  Snover: 'Abomasnow',
  Buneary: 'Lopunny',
  Onix: 'Steelix',
};

export function pickEvolutionTarget(species: string): string | undefined {
  const target = EVOLUTIONS[species];
  if (!target) return undefined;
  if (Array.isArray(target)) return target[Math.floor(Math.random() * target.length)];
  return target;
}

export interface EvolutionOffer {
  memberIndex: number;
  from: string;
  to: string;
}

export interface WinResult {
  team: TeamMember[];
  evolutionOffer?: EvolutionOffer;
}

export function applyBattleWin(runState: RunState): WinResult {
  const team = runState.team.map((member, i) => {
    if (i === 0) return { ...member, wins: (member.wins ?? 0) + 1 };
    if (runState.hasExpShare) return { ...member, wins: (member.wins ?? 0) + EXP_SHARE_BONUS };
    return member;
  });

  // Check the lead first (priority, since they just fought), then the rest — EXP Share can push
  // a non-lead member past the threshold too, and they deserve an offer just as much.
  for (let i = 0; i < team.length; i++) {
    const member = team[i];
    if ((member.wins ?? 0) >= EVOLUTION_WIN_THRESHOLD) {
      const target = pickEvolutionTarget(member.species);
      if (target) {
        return { team, evolutionOffer: { memberIndex: i, from: member.species, to: target } };
      }
    }
  }
  return { team };
}

export function applyEvolution(team: TeamMember[], memberIndex: number, newSpecies: string): TeamMember[] {
  return team.map((member, i) => (i === memberIndex ? { species: newSpecies, wins: 0 } : member));
}
