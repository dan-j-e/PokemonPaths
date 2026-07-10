import Phaser from 'phaser';
import { SEGMENTS } from '../data/segments';
import { themeFor } from '../data/locationThemes';
import { createSelfDisablingButton } from '../ui/button';
import { drawProgressBar } from '../ui/progressBar';
import { drawNeoBackground } from '../ui/background';
import { THEME, FONT_TITLE, FONT_TITLE_WEIGHT } from '../ui/theme';
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
    drawNeoBackground(this, themeFor(segment.id));
    drawProgressBar(this, this.runState.segmentIndex);

    this.add
      .text(400, 200, segment.name, {
        fontFamily: FONT_TITLE,
        fontStyle: FONT_TITLE_WEIGHT,
        fontSize: '26px',
        color: THEME.text,
        align: 'center',
        letterSpacing: 1,
        wordWrap: { width: 600 },
      })
      .setOrigin(0.5);

    createSelfDisablingButton(this, 400, 350, 'Continue', () => {
      if (segment.kind === 'battle') {
        this.scene.start('team-management', { ...this.runState, battleSubIndex: 0, faintedIds: undefined });
      } else {
        this.scene.start('action', this.runState);
      }
    });
  }
}
