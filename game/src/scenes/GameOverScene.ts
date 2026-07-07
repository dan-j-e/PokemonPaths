import Phaser from 'phaser';
import { createButton } from '../ui/button';
import { THEME } from '../ui/theme';

interface GameOverData {
  location: string;
  trainer: string;
}

export class GameOverScene extends Phaser.Scene {
  private info!: GameOverData;

  constructor() {
    super('game-over');
  }

  init(data: GameOverData) {
    this.info = data;
  }

  create() {
    this.cameras.main.setBackgroundColor(0x140a0a);

    this.add
      .text(400, 200, 'RUN OVER', {
        fontFamily: 'monospace',
        fontSize: '40px',
        color: THEME.dangerHex,
        align: 'center',
      })
      .setOrigin(0.5);

    this.add
      .text(400, 260, `Lost to ${this.info.trainer}\nat ${this.info.location}`, {
        fontFamily: 'monospace',
        fontSize: '20px',
        color: THEME.text,
        align: 'center',
        wordWrap: { width: 600 },
      })
      .setOrigin(0.5);

    createButton(this, 400, 400, 'Restart', () => {
      this.scene.start('starter-select');
    });
  }
}
