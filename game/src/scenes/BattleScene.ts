import Phaser from 'phaser';
import { SEGMENTS } from '../data/segments';
import { computeBattleOdds, spinBattle } from '../battle/roulette';
import { createButton } from '../ui/button';
import { ensureSpeciesSprites, spriteKey } from '../data/sprites';
import { themeFor } from '../data/locationThemes';
import { drawProgressBar } from '../ui/progressBar';
import { drawNeoBackground, drawPanel } from '../ui/background';
import { THEME, FONT_BODY, FONT_TITLE } from '../ui/theme';
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

    drawNeoBackground(this, themeFor(segment.id));
    drawProgressBar(this, this.runState.segmentIndex);

    const playerLead = this.runState.team[0].species;
    const opponentLead = battle.roster[0];

    // Consumed by this battle's odds regardless of outcome — a fresh pendingBoost only ever applies once.
    const stateAfterBoost: RunState = { ...this.runState, pendingBoost: 0 };

    ensureSpeciesSprites(this, [playerLead, opponentLead], () => {
      this.add.circle(220, 145, 75, THEME.secondary, 0.15).setDepth(-1);
      this.add.circle(580, 145, 75, THEME.danger, 0.15).setDepth(-1);
      this.add.image(220, 145, spriteKey(playerLead)).setDisplaySize(128, 128);
      this.add.image(580, 145, spriteKey(opponentLead)).setDisplaySize(128, 128);

      this.add
        .text(400, 45, `${locationLabel}\nvs. ${battle.trainer}`, {
          fontFamily: FONT_TITLE,
          fontSize: '22px',
          color: THEME.text,
          align: 'center',
          wordWrap: { width: 700 },
        })
        .setOrigin(0.5);

      this.add
        .text(400, 225, `Roster: ${battle.roster.join(', ')}`, {
          fontFamily: FONT_BODY,
          fontSize: '15px',
          color: THEME.textMuted,
          align: 'center',
          wordWrap: { width: 700 },
        })
        .setOrigin(0.5);

      drawPanel(this, 150, 248, 500, 100);

      const odds = computeBattleOdds(this.runState.team, battle, this.runState.pendingBoost);
      const winPct = Math.round(odds.winProbability * 100);

      this.add
        .text(400, 265, `Lead matchup: ${odds.tier}`, {
          fontFamily: FONT_BODY,
          fontSize: '18px',
          color: THEME.secondaryHex,
        })
        .setOrigin(0.5);

      const barWidth = 400;
      const barX = 400 - barWidth / 2;
      const barY = 295;
      const barHeight = 26;
      const oddsBg = this.add.graphics();
      oddsBg.fillStyle(THEME.danger, 0.35);
      oddsBg.fillRoundedRect(barX, barY, barWidth, barHeight, 12);
      const oddsFill = this.add.graphics();
      oddsFill.fillStyle(THEME.success, 0.85);
      oddsFill.fillRoundedRect(barX, barY, Math.max(24, (barWidth * winPct) / 100), barHeight, 12);
      this.add
        .text(400, barY + barHeight / 2, `Win ${winPct}% / Lose ${100 - winPct}%`, {
          fontFamily: FONT_BODY,
          fontSize: '16px',
          color: THEME.text,
        })
        .setOrigin(0.5);

      this.add
        .text(400, 335, "Only your lead Pokemon's matchup counts — reorder in Team Management", {
          fontFamily: FONT_BODY,
          fontSize: '11px',
          fontStyle: 'italic',
          color: THEME.textMuted,
          align: 'center',
        })
        .setOrigin(0.5);

      const resultText = this.add
        .text(400, 375, '', {
          fontFamily: FONT_BODY,
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
        let y = 480;

        if (stateAfterBoost.items.revive > 0) {
          createButton(this, 400, y, `Use Revive (x${stateAfterBoost.items.revive}) — retry, same lead`, () => {
            const items = { ...stateAfterBoost.items, revive: stateAfterBoost.items.revive - 1 };
            this.scene.start('battle', { ...stateAfterBoost, items });
          });
          y += 40;
        }

        // Only offer a lead change if one is actually possible — otherwise this would
        // demand a lead change TeamManagementScene has no way to satisfy (a soft-lock).
        const canChangeLead = stateAfterBoost.team.length > 1 || stateAfterBoost.bench.length > 0;
        if (stateAfterBoost.items.potion > 0 && canChangeLead) {
          createButton(this, 400, y, `Use Potion (x${stateAfterBoost.items.potion}) — retry, change lead`, () => {
            const items = { ...stateAfterBoost.items, potion: stateAfterBoost.items.potion - 1 };
            this.scene.start('team-management', { ...stateAfterBoost, items, mustChangeLeadFrom: playerLead });
          });
          y += 40;
        }

        createButton(this, 400, y, 'Give up', () => {
          this.scene.start('game-over', { location: segment.name, trainer: battle.trainer });
        });
      };

      const showEvolvePrompt = (offer: EvolutionOffer) => {
        const promptText = this.add
          .text(400, 480, `${offer.from} wants to evolve into ${offer.to}! Evolving changes its species and type.`, {
            fontFamily: FONT_BODY,
            fontSize: '16px',
            color: THEME.secondaryHex,
            align: 'center',
            wordWrap: { width: 700 },
          })
          .setOrigin(0.5);

        const yesBtn = createButton(this, 320, 525, 'Yes', () => {
          yesBtn.disableInteractive();
          noBtn.disableInteractive();
          stateAfterBoost.team = applyEvolution(stateAfterBoost.team, offer.memberIndex, offer.to);
          promptText.setText(`${offer.from} evolved into ${offer.to}!`);
          createButton(this, 400, 565, 'Continue', advanceToNext);
        });
        const noBtn = createButton(this, 480, 525, 'No', () => {
          yesBtn.disableInteractive();
          noBtn.disableInteractive();
          createButton(this, 400, 565, 'Continue', advanceToNext);
        });
      };

      const spinBtn = createButton(this, 400, 420, 'Spin', () => {
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
