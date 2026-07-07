import { getSpecies, getPower } from '../data/species';
import { matchupTier } from '../data/typeChart';
import type { MatchupTier } from '../data/typeChart';
import type { BattleSpec, TeamMember } from '../data/types';

export interface BattleOdds {
  winProbability: number;
  tier: MatchupTier;
}

const TYPE_BONUS: Record<MatchupTier, { win: number; lose: number }> = {
  overwhelming: { win: 3, lose: 0 },
  advantage: { win: 2, lose: 0 },
  neutral: { win: 0, lose: 0 },
  disadvantage: { win: 0, lose: 1 },
  overwhelmed: { win: 0, lose: 2 },
};

export function computeBattleOdds(activeTeam: TeamMember[], battle: BattleSpec, bonusWin = 0): BattleOdds {
  const lead = activeTeam[0];
  const leadSpecies = getSpecies(lead.species);
  const opponentLeadSpecies = getSpecies(battle.roster[0]);

  const tier = matchupTier(leadSpecies, opponentLeadSpecies);
  const bonus = TYPE_BONUS[tier];

  const teamPower = activeTeam.reduce((sum, m) => sum + getPower(m.species), 0);

  const winWeight = 1 + teamPower + bonus.win + bonusWin;
  const loseWeight = 1 + battle.tier * 2 + bonus.lose;

  return {
    winProbability: winWeight / (winWeight + loseWeight),
    tier,
  };
}

export function spinBattle(odds: BattleOdds): boolean {
  return Math.random() < odds.winProbability;
}
