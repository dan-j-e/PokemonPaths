import Phaser from 'phaser';
import { SEGMENTS } from '../data/segments';
import { computeBattleOdds, spinBattle } from '../battle/roulette';
import { createButton } from '../ui/button';
import { ensureSpeciesSprites, spriteKey } from '../data/sprites';
import { themeFor } from '../data/locationThemes';
import { drawProgressBar } from '../ui/progressBar';
import { THEME } from '../ui/theme';
import { applyBattleWin, applyEvolution } from '../data/evolutions';
import type { EvolutionOffer } from '../data/evolutions';
import type { RunState } from '../data/types';

export class BattleScene extends Phaser.Scene {
  private runState!: RunState;

  constructor() {
    super('battle');
  }

  init(data: RunState) {
    this.runState = data;
  }

  create() {
    const segment = SEGMENTS[this.runState.segmentIndex];
    const battles = segment.battles ?? [];
    const subIndex = this.runState.battleSubIndex ?? 0;
    const battle = this.runState.adHocBattle ?? battles[subIndex];
    const locationLabel = this.runState.adHocBattle ? 'Trainer Encounter' : segment.name;

    this.cameras.main.setBackgroundColor(themeFor(segment.id));
    drawProgressBar(this, this.runState.segmentIndex);

    const playerLead = this.runState.team[0].species;
    const opponentLead = battle.roster[0];

    // Consumed by this battle's odds regardless of outcome — a fresh pendingBoost only ever applies once.
    const stateAfterBoost: RunState = { ...this.runState, pendingBoost: 0 };

    ensureSpeciesSprites(this, [playerLead, opponentLead], () => {
      this.add.image(220, 130, spriteKey(playerLead)).setDisplaySize(96, 96);
      this.add.image(580, 130, spriteKey(opponentLead)).setDisplaySize(96, 96);

      this.add
        .text(400, 90, `${locationLabel}\nvs. ${battle.trainer}`, {
          fontFamily: 'monospace',
          fontSize: '22px',
          color: THEME.text,
          align: 'center',
          wordWrap: { width: 700 },
        })
        .setOrigin(0.5);

      this.add
        .text(400, 190, `Roster: ${battle.roster.join(', ')}`, {
          fontFamily: 'monospace',
          fontSize: '15px',
          color: THEME.textMuted,
          align: 'center',
          wordWrap: { width: 700 },
        })
        .setOrigin(0.5);

      const odds = computeBattleOdds(this.runState.team, battle, this.runState.pendingBoost);
      const winPct = Math.round(odds.winProbability * 100);

      this.add
        .text(400, 240, `Lead matchup: ${odds.tier}`, {
          fontFamily: 'monospace',
          fontSize: '18px',
          color: THEME.secondaryHex,
        })
        .setOrigin(0.5);

      const barWidth = 400;
      const barX = 400 - barWidth / 2;
      const barY = 280;
      this.add.rectangle(barX, barY, barWidth, 30, THEME.danger, 0.35).setOrigin(0, 0);
      this.add.rectangle(barX, barY, (barWidth * winPct) / 100, 30, THEME.success, 0.85).setOrigin(0, 0);
      this.add
        .text(400, barY + 15, `Win ${winPct}% / Lose ${100 - winPct}%`, {
          fontFamily: 'monospace',
          fontSize: '16px',
          color: THEME.text,
        })
        .setOrigin(0.5);

      const resultText = this.add
        .text(400, 350, '', {
          fontFamily: 'monospace',
          fontSize: '20px',
          color: THEME.primaryHex,
          align: 'center',
          wordWrap: { width: 600 },
        })
        .setOrigin(0.5);

      const advanceToNext = () => {
        if (stateAfterBoost.adHocBattle) {
          this.scene.start('overworld', {
            ...stateAfterBoost,
            segmentIndex: this.runState.segmentIndex + 1,
            battleSubIndex: undefined,
            adHocBattle: undefined,
          });
        } else if (subIndex + 1 < battles.length) {
          this.scene.start('team-management', { ...stateAfterBoost, battleSubIndex: subIndex + 1 });
        } else {
          this.scene.start('overworld', {
            ...stateAfterBoost,
            segmentIndex: this.runState.segmentIndex + 1,
            battleSubIndex: undefined,
          });
        }
      };

      const showLossOptions = () => {
        resultText.setText('You lost...');
        let y = 500;

        if (stateAfterBoost.items.revive > 0) {
          createButton(this, 400, y, `Use Revive (x${stateAfterBoost.items.revive}) — retry, same lead`, () => {
            const items = { ...stateAfterBoost.items, revive: stateAfterBoost.items.revive - 1 };
            this.scene.start('battle', { ...stateAfterBoost, items });
          });
          y += 45;
        }

        if (stateAfterBoost.items.potion > 0) {
          createButton(this, 400, y, `Use Potion (x${stateAfterBoost.items.potion}) — retry, change lead`, () => {
            const items = { ...stateAfterBoost.items, potion: stateAfterBoost.items.potion - 1 };
            this.scene.start('team-management', { ...stateAfterBoost, items, mustChangeLeadFrom: playerLead });
          });
          y += 45;
        }

        createButton(this, 400, y, 'Give up', () => {
          this.scene.start('game-over', { location: segment.name, trainer: battle.trainer });
        });
      };

      const showEvolvePrompt = (offer: EvolutionOffer) => {
        const promptText = this.add
          .text(400, 470, `${offer.from} wants to evolve into ${offer.to}!`, {
            fontFamily: 'monospace',
            fontSize: '16px',
            color: THEME.secondaryHex,
            align: 'center',
            wordWrap: { width: 700 },
          })
          .setOrigin(0.5);

        const yesBtn = createButton(this, 320, 500, 'Yes', () => {
          yesBtn.disableInteractive();
          noBtn.disableInteractive();
          stateAfterBoost.team = applyEvolution(stateAfterBoost.team, offer.memberIndex, offer.to);
          promptText.setText(`${offer.from} evolved into ${offer.to}!`);
          createButton(this, 400, 540, 'Continue', advanceToNext);
        });
        const noBtn = createButton(this, 480, 500, 'No', () => {
          yesBtn.disableInteractive();
          noBtn.disableInteractive();
          createButton(this, 400, 540, 'Continue', advanceToNext);
        });
      };

      const spinBtn = createButton(this, 400, 440, 'Spin', () => {
        spinBtn.disableInteractive();
        const won = spinBattle(odds);

        if (won) {
          resultText.setText('You won!');
          const result = applyBattleWin(stateAfterBoost);
          stateAfterBoost.team = result.team;
          if (result.evolutionOffer) {
            showEvolvePrompt(result.evolutionOffer);
          } else {
            createButton(this, 400, 500, 'Continue', advanceToNext);
          }
        } else if (battle.runEnding) {
          showLossOptions();
        } else {
          resultText.setText('You lost, but no penalty.');
          createButton(this, 400, 500, 'Continue', advanceToNext);
        }
      });
    });
  }
}
