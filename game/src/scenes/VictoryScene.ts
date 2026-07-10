import Phaser from 'phaser';
import { createSelfDisablingButton } from '../ui/button';
import { drawNeoBackground } from '../ui/background';
import { THEME, FONT_BODY, FONT_TITLE, FONT_TITLE_WEIGHT } from '../ui/theme';

export class VictoryScene extends Phaser.Scene {
  constructor() {
    super('victory');
  }

  create() {
    drawNeoBackground(this, THEME.primary);

    this.add
      .text(400, 200, 'CHAMPION DEFEATED', {
        fontFamily: FONT_TITLE,
        fontStyle: FONT_TITLE_WEIGHT,
        fontSize: '36px',
        color: THEME.primaryHex,
        align: 'center',
        letterSpacing: 2,
      })
      .setOrigin(0.5);

    this.add
      .text(400, 260, 'Run Complete', {
        fontFamily: FONT_BODY,
        fontSize: '20px',
        color: THEME.secondaryHex,
        align: 'center',
      })
      .setOrigin(0.5);

    createSelfDisablingButton(this, 400, 400, 'Restart', () => {
      this.scene.start('starter-select');
    });
  }
}
