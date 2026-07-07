import Phaser from 'phaser';
import { SEGMENTS } from '../data/segments';
import { computeBattleOdds, spinBattle } from '../battle/roulette';
import { createButton } from '../ui/button';
import { ensureSpeciesSprites, spriteKey } from '../data/sprites';
import { themeFor } from '../data/locationThemes';
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
    const battle = battles[subIndex];

    this.cameras.main.setBackgroundColor(themeFor(segment.id));

    const playerLead = this.runState.team[0].species;
    const opponentLead = battle.roster[0];

    // Consumed by this battle's odds regardless of outcome — a fresh pendingBoost only ever applies once.
    const stateAfterBoost: RunState = { ...this.runState, pendingBoost: 0 };

    ensureSpeciesSprites(this, [playerLead, opponentLead], () => {
      this.add.image(220, 130, spriteKey(playerLead)).setDisplaySize(96, 96);
      this.add.image(580, 130, spriteKey(opponentLead)).setDisplaySize(96, 96);

      this.add
        .text(400, 90, `${segment.name}\nvs. ${battle.trainer}`, {
          fontFamily: 'monospace',
          fontSize: '22px',
          color: '#ffffff',
          align: 'center',
          wordWrap: { width: 700 },
        })
        .setOrigin(0.5);

      this.add
        .text(400, 190, `Roster: ${battle.roster.join(', ')}`, {
          fontFamily: 'monospace',
          fontSize: '15px',
          color: '#cccccc',
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
          color: '#88ccff',
        })
        .setOrigin(0.5);

      const barWidth = 400;
      const barX = 400 - barWidth / 2;
      const barY = 280;
      this.add.rectangle(barX, barY, barWidth, 30, 0x883333).setOrigin(0, 0);
      this.add.rectangle(barX, barY, (barWidth * winPct) / 100, 30, 0x33aa33).setOrigin(0, 0);
      this.add
        .text(400, barY + 15, `Win ${winPct}% / Lose ${100 - winPct}%`, {
          fontFamily: 'monospace',
          fontSize: '16px',
          color: '#ffffff',
        })
        .setOrigin(0.5);

      const resultText = this.add
        .text(400, 350, '', {
          fontFamily: 'monospace',
          fontSize: '20px',
          color: '#ffff88',
          align: 'center',
          wordWrap: { width: 600 },
        })
        .setOrigin(0.5);

      const advanceToNext = () => {
        if (subIndex + 1 < battles.length) {
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

      const spinBtn = createButton(this, 400, 440, 'Spin', () => {
        spinBtn.disableInteractive();
        const won = spinBattle(odds);

        if (won) {
          resultText.setText('You won!');
          createButton(this, 400, 500, 'Continue', advanceToNext);
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
