import Phaser from 'phaser';
import { SEGMENTS } from '../data/segments';
import { createButton } from '../ui/button';
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

    this.add
      .text(400, 150, `${segment.name}\nvs. ${battle.trainer}`, {
        fontFamily: 'monospace',
        fontSize: '24px',
        color: '#ffffff',
        align: 'center',
        wordWrap: { width: 600 },
      })
      .setOrigin(0.5);

    this.add
      .text(400, 260, `Roster: ${battle.roster.join(', ')}`, {
        fontFamily: 'monospace',
        fontSize: '18px',
        color: '#cccccc',
        align: 'center',
        wordWrap: { width: 600 },
      })
      .setOrigin(0.5);

    const advanceToNext = () => {
      if (subIndex + 1 < battles.length) {
        this.scene.start('battle', { ...this.runState, battleSubIndex: subIndex + 1 });
      } else {
        this.scene.start('overworld', {
          ...this.runState,
          segmentIndex: this.runState.segmentIndex + 1,
          battleSubIndex: undefined,
        });
      }
    };

    createButton(this, 300, 400, 'Win', advanceToNext);

    createButton(this, 500, 400, 'Lose', () => {
      if (battle.runEnding) {
        this.scene.start('game-over', { location: segment.name, trainer: battle.trainer });
      } else {
        advanceToNext();
      }
    });
  }
}
