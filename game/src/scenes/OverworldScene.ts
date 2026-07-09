import Phaser from 'phaser';
import { SEGMENTS } from '../data/segments';
import { themeFor } from '../data/locationThemes';
import { createButton } from '../ui/button';
import { drawProgressBar } from '../ui/progressBar';
import { drawNeoBackground } from '../ui/background';
import { THEME, FONT_TITLE } from '../ui/theme';
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
        fontSize: '26px',
        color: THEME.text,
        align: 'center',
        wordWrap: { width: 600 },
      })
      .setOrigin(0.5);

    const continueBtn = createButton(this, 400, 350, 'Continue', () => {
      continueBtn.setDisabled(true);
      if (segment.kind === 'battle') {
        this.scene.start('team-management', { ...this.runState, battleSubIndex: 0 });
      } else {
        this.scene.start('action', this.runState);
      }
    });
  }
}
