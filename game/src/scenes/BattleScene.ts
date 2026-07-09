import Phaser from 'phaser';
import { SEGMENTS } from '../data/segments';
import { computeBattleOdds, spinBattle } from '../battle/roulette';
import { createButton } from '../ui/button';
import type { Button } from '../ui/button';
import { ensureSpeciesSprites, ensureBackSpeciesSprites, spriteKey, backSpriteKey } from '../data/sprites';
import { themeFor } from '../data/locationThemes';
import { drawProgressBar } from '../ui/progressBar';
import { drawNeoBackground, drawPanel } from '../ui/background';
import { THEME, FONT_BODY, FONT_TITLE } from '../ui/theme';
import { applyBattleWin, applyEvolution } from '../data/evolutions';
import type { EvolutionOffer } from '../data/evolutions';
import type { RunState } from '../data/types';

const OPPONENT_ICON_SIZE = 24;
const OPPONENT_ICON_SPACING = 27;
const OPPONENT_ICON_ROW_CAPACITY = 6;
const OPPONENT_ICON_ROW_HEIGHT = 28;

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

    ensureSpeciesSprites(this, battle.roster, () => {
      ensureBackSpeciesSprites(this, [playerLead], () => {
        this.add
          .text(400, 22, `${locationLabel}\nvs. ${battle.trainer}`, {
            fontFamily: FONT_TITLE,
            fontSize: '15px',
            color: THEME.text,
            align: 'center',
            wordWrap: { width: 700 },
          })
          .setOrigin(0.5);

        // Player: back sprite, large and close, lower-left — "on the ground" DS-style framing.
        const playerShadow = this.add.ellipse(180, 258, 150, 24, 0x2e2b3d, 0.14).setDepth(-2);
        const playerGlow = this.add.circle(180, 195, 88, THEME.secondary, 0.1).setDepth(-1);
        const playerImage = this.add.image(180, 195, backSpriteKey(playerLead)).setDisplaySize(140, 140);

        // Opponent: front sprite, small and distant, upper-right.
        const opponentGlow = this.add.circle(616, 96, 54, THEME.danger, 0.08).setDepth(-1);
        const opponentImage = this.add.image(616, 96, spriteKey(opponentLead)).setDisplaySize(90, 90);

        this.add
          .text(616, 148, 'Opponent Team', {
            fontFamily: FONT_BODY,
            fontSize: '10px',
            color: THEME.textMuted,
          })
          .setOrigin(0.5);

        battle.roster.forEach((species, i) => {
          const row = Math.floor(i / OPPONENT_ICON_ROW_CAPACITY);
          const col = i % OPPONENT_ICON_ROW_CAPACITY;
          const rowCount = Math.min(OPPONENT_ICON_ROW_CAPACITY, battle.roster.length - row * OPPONENT_ICON_ROW_CAPACITY);
          const rowStartX = 616 - ((rowCount - 1) * OPPONENT_ICON_SPACING) / 2;
          const x = rowStartX + col * OPPONENT_ICON_SPACING;
          const y = 168 + row * OPPONENT_ICON_ROW_HEIGHT;
          this.add.image(x, y, spriteKey(species)).setDisplaySize(OPPONENT_ICON_SIZE, OPPONENT_ICON_SIZE);
        });

        // Entrance: both sprites slide in and fade in, opponent staggered slightly after the player.
        this.tweens.add({
          targets: playerImage,
          x: { from: 120, to: 180 },
          alpha: { from: 0, to: 1 },
          duration: 450,
          ease: 'Back.easeOut',
          delay: 100,
          onComplete: () => {
            this.tweens.add({
              targets: playerImage,
              y: '+=8',
              duration: 1400,
              ease: 'Sine.easeInOut',
              yoyo: true,
              repeat: -1,
            });
          },
        });
        this.tweens.add({
          targets: playerGlow,
          alpha: { from: 0, to: playerGlow.alpha },
          duration: 500,
          ease: 'Sine.easeOut',
          delay: 100,
        });
        this.tweens.add({
          targets: playerShadow,
          alpha: { from: 0, to: playerShadow.alpha },
          duration: 500,
          ease: 'Sine.easeOut',
          delay: 100,
        });
        this.tweens.add({
          targets: opponentImage,
          x: { from: 676, to: 616 },
          alpha: { from: 0, to: 1 },
          duration: 450,
          ease: 'Back.easeOut',
          delay: 250,
          onComplete: () => {
            this.tweens.add({
              targets: opponentImage,
              y: '+=6',
              duration: 1600,
              ease: 'Sine.easeInOut',
              yoyo: true,
              repeat: -1,
              delay: 150,
            });
          },
        });
        this.tweens.add({
          targets: opponentGlow,
          alpha: { from: 0, to: opponentGlow.alpha },
          duration: 500,
          ease: 'Sine.easeOut',
          delay: 250,
        });

        drawPanel(this, 150, 285, 500, 92);

        const odds = computeBattleOdds(this.runState.team, battle, this.runState.pendingBoost);
        const winPct = Math.round(odds.winProbability * 100);

        this.add
          .text(400, 302, `Lead matchup: ${odds.tier}`, {
            fontFamily: FONT_BODY,
            fontSize: '16px',
            color: THEME.secondaryHex,
          })
          .setOrigin(0.5);

        const barWidth = 400;
        const barX = 200;
        const barY = 328;
        const barHeight = 24;
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

        const resultText = this.add
          .text(400, 400, '', {
            fontFamily: FONT_BODY,
            fontSize: '18px',
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

        const createContinueButton = (y: number) => {
          const btn = createButton(this, 400, y, 'Continue', () => {
            btn.setDisabled(true);
            advanceToNext();
          });
          return btn;
        };

        const showLossOptions = () => {
          resultText.setText('You lost...');
          let y = 478;
          const lossButtons: Button[] = [];
          const disableLossButtons = () => lossButtons.forEach((b) => b.setDisabled(true));

          if (stateAfterBoost.items.revive > 0) {
            lossButtons.push(
              createButton(this, 400, y, `Use Revive (×${stateAfterBoost.items.revive})`, () => {
                disableLossButtons();
                const items = { ...stateAfterBoost.items, revive: stateAfterBoost.items.revive - 1 };
                this.scene.start('battle', { ...stateAfterBoost, items });
              }),
            );
            y += 38;
          }

          // Only offer a lead change if one is actually possible — otherwise this would
          // demand a lead change TeamManagementScene has no way to satisfy (a soft-lock).
          const canChangeLead = stateAfterBoost.team.length > 1 || stateAfterBoost.bench.length > 0;
          if (stateAfterBoost.items.potion > 0 && canChangeLead) {
            lossButtons.push(
              createButton(this, 400, y, `Use Potion (×${stateAfterBoost.items.potion})`, () => {
                disableLossButtons();
                const items = { ...stateAfterBoost.items, potion: stateAfterBoost.items.potion - 1 };
                this.scene.start('team-management', { ...stateAfterBoost, items, mustChangeLeadFrom: playerLead });
              }),
            );
            y += 38;
          }

          lossButtons.push(
            createButton(this, 400, y, 'Give up', () => {
              disableLossButtons();
              this.scene.start('game-over', { location: segment.name, trainer: battle.trainer });
            }),
          );
        };

        const showEvolvePrompt = (offer: EvolutionOffer) => {
          const promptText = this.add
            .text(400, 478, `${offer.from} wants to evolve into ${offer.to}?`, {
              fontFamily: FONT_BODY,
              fontSize: '16px',
              color: THEME.secondaryHex,
              align: 'center',
              wordWrap: { width: 700 },
            })
            .setOrigin(0.5);

          const yesBtn = createButton(this, 320, 520, 'Yes', () => {
            yesBtn.destroy();
            noBtn.destroy();
            stateAfterBoost.team = applyEvolution(stateAfterBoost.team, offer.memberIndex, offer.to);
            promptText.setText(`${offer.from} evolved into ${offer.to}!`);
            createContinueButton(558);
          });
          const noBtn = createButton(this, 480, 520, 'No', () => {
            yesBtn.destroy();
            noBtn.destroy();
            createContinueButton(558);
          });
        };

        const spinBtn = createButton(this, 400, 438, 'Spin', () => {
          spinBtn.destroy();
          const won = spinBattle(odds);

          if (won) {
            const result = applyBattleWin(stateAfterBoost);
            stateAfterBoost.team = result.team;
            let winMessage = 'You won!';
            if (segment.id === 'pastoria-city-gym4' && !stateAfterBoost.hasExpShare) {
              stateAfterBoost.hasExpShare = true;
              winMessage += '\nYou received an EXP Share!';
            }
            resultText.setText(winMessage);

            this.tweens.add({ targets: playerImage, x: '+=30', duration: 120, ease: 'Quad.easeOut', yoyo: true, hold: 60 });
            this.tweens.add({
              targets: opponentImage,
              x: '+=6',
              duration: 60,
              ease: 'Sine.easeInOut',
              yoyo: true,
              repeat: 3,
              onComplete: () => {
                this.tweens.add({
                  targets: opponentImage,
                  alpha: 0,
                  scale: opponentImage.scale * 0.8,
                  duration: 300,
                  ease: 'Sine.easeIn',
                });
              },
            });

            if (result.evolutionOffer) {
              showEvolvePrompt(result.evolutionOffer);
            } else {
              createContinueButton(478);
            }
          } else if (battle.runEnding) {
            this.tweens.add({
              targets: [playerImage, playerGlow, playerShadow],
              y: '+=20',
              alpha: 0.3,
              duration: 400,
              ease: 'Quad.easeIn',
            });
            showLossOptions();
          } else {
            this.tweens.add({
              targets: [playerImage, playerGlow, playerShadow],
              y: '+=20',
              alpha: 0.3,
              duration: 400,
              ease: 'Quad.easeIn',
            });
            resultText.setText('You lost, but no penalty.');
            createContinueButton(478);
          }
        });
      });
    });
  }
}
