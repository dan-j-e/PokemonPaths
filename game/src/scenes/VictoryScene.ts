import Phaser from 'phaser';
import { createButton } from '../ui/button';
import { drawNeoBackground } from '../ui/background';
import { THEME, FONT_BODY, FONT_TITLE } from '../ui/theme';

export class VictoryScene extends Phaser.Scene {
  constructor() {
    super('victory');
  }

  create() {
    drawNeoBackground(this, 0x120a1a);

    this.add
      .text(400, 200, 'CHAMPION DEFEATED', {
        fontFamily: FONT_TITLE,
        fontSize: '36px',
        color: THEME.primaryHex,
        align: 'center',
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

    createButton(this, 400, 400, 'Restart', () => {
      this.scene.start('starter-select');
    });
  }
}
