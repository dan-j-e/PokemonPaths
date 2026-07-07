import Phaser from 'phaser';
import { createButton } from '../ui/button';

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
    this.add
      .text(400, 220, `Run Over\nLost to ${this.info.trainer}\nat ${this.info.location}`, {
        fontFamily: 'monospace',
        fontSize: '26px',
        color: '#ff8888',
        align: 'center',
        wordWrap: { width: 600 },
      })
      .setOrigin(0.5);

    createButton(this, 400, 400, 'Restart', () => {
      this.scene.start('starter-select');
    });
  }
}
