import Phaser from 'phaser';
import { SEGMENTS } from '../data/segments';
import { createButton } from '../ui/button';
import type { RunState } from '../data/types';

export class OverworldScene extends Phaser.Scene {
  private runState!: RunState;

  constructor() {
    super('overworld');
  }

  init(data: RunState) {
    this.runState = data;
  }

  create() {
    if (this.runState.segmentIndex >= SEGMENTS.length) {
      this.scene.start('victory', this.runState);
      return;
    }

    const segment = SEGMENTS[this.runState.segmentIndex];

    this.add
      .text(400, 200, segment.name, {
        fontFamily: 'monospace',
        fontSize: '26px',
        color: '#ffffff',
        align: 'center',
        wordWrap: { width: 600 },
      })
      .setOrigin(0.5);

    createButton(this, 400, 350, 'Continue', () => {
      if (segment.kind === 'battle') {
        this.scene.start('battle', { ...this.runState, battleSubIndex: 0 });
      } else {
        this.scene.start('action', this.runState);
      }
    });
  }
}
