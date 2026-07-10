import Phaser from 'phaser';
import { createButton } from './button';
import { applyEvolution } from '../data/evolutions';
import type { EvolutionOffer } from '../data/evolutions';
import type { TeamMember } from '../data/types';
import { THEME, FONT_BODY } from './theme';

/** The "X wants to evolve into Y?" Yes/No dialog, shared by ActionScene and BattleScene. Applies
 * the evolution itself on "Yes" (or leaves `team` unchanged on "No") and hands the resulting team
 * back to the caller via `onResolved`, since each caller stores its team in a different place
 * (`RunState.team` vs a scene-local working copy) and has its own follow-up "Continue" flow. */
export function showEvolvePrompt(
  scene: Phaser.Scene,
  offer: EvolutionOffer,
  team: TeamMember[],
  y: number,
  onResolved: (newTeam: TeamMember[]) => void,
): Phaser.GameObjects.Text {
  const promptText = scene.add
    .text(400, y, `${offer.from} wants to evolve into ${offer.to}?`, {
      fontFamily: FONT_BODY,
      fontSize: '16px',
      color: THEME.secondaryHex,
      align: 'center',
      wordWrap: { width: 700 },
    })
    .setOrigin(0.5);

  const yesBtn = createButton(
    scene,
    340,
    y + 40,
    'Yes',
    () => {
      yesBtn.destroy();
      noBtn.destroy();
      const newTeam = applyEvolution(team, offer.memberIndex, offer.to);
      promptText.setText(`${offer.from} evolved into ${offer.to}!`);
      onResolved(newTeam);
    },
    { size: 'small' },
  );
  const noBtn = createButton(
    scene,
    460,
    y + 40,
    'No',
    () => {
      yesBtn.destroy();
      noBtn.destroy();
      onResolved(team);
    },
    { size: 'small' },
  );

  return promptText;
}
