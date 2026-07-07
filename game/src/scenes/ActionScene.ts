import Phaser from 'phaser';
import { SEGMENTS } from '../data/segments';
import { ACTION_LABELS, ACTION_FLAVOR } from '../data/actions';
import { createButton } from '../ui/button';
import type { RunState } from '../data/types';

export class ActionScene extends Phaser.Scene {
  private runState!: RunState;

  constructor() {
    super('action');
  }

  init(data: RunState) {
    this.runState = data;
  }

  create() {
    const segment = SEGMENTS[this.runState.segmentIndex];
    const pool = segment.actionPool ?? [];
    const buttons: Phaser.GameObjects.Text[] = [];

    this.add
      .text(400, 60, segment.name, {
        fontFamily: 'monospace',
        fontSize: '22px',
        color: '#ffffff',
        align: 'center',
        wordWrap: { width: 600 },
      })
      .setOrigin(0.5);

    const resultText = this.add
      .text(400, 460, '', {
        fontFamily: 'monospace',
        fontSize: '18px',
        color: '#ffff88',
        align: 'center',
        wordWrap: { width: 600 },
      })
      .setOrigin(0.5);

    const advance = () => {
      this.scene.start('overworld', { ...this.runState, segmentIndex: this.runState.segmentIndex + 1 });
    };

    const showResultThenContinue = (lines: string[]) => {
      buttons.forEach((b) => b.disableInteractive());
      resultText.setText(lines.join('\n'));
      createButton(this, 400, 540, 'Continue', advance);
    };

    pool.forEach((action, i) => {
      const btn = createButton(this, 400, 130 + i * 55, ACTION_LABELS[action], () => {
        showResultThenContinue([ACTION_FLAVOR[action]]);
      });
      buttons.push(btn);
    });

    const spinBtn = createButton(this, 400, 130 + pool.length * 55 + 20, 'Spin (random x2)', () => {
      const shuffled = [...pool].sort(() => Math.random() - 0.5);
      const picked = shuffled.slice(0, 2);
      showResultThenContinue(picked.map((a) => ACTION_FLAVOR[a]));
    });
    buttons.push(spinBtn);
  }
}
