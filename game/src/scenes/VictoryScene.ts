import Phaser from 'phaser';
import { createButton } from '../ui/button';

export class VictoryScene extends Phaser.Scene {
  constructor() {
    super('victory');
  }

  create() {
    this.add
      .text(400, 220, 'Champion Defeated!\nRun Complete', {
        fontFamily: 'monospace',
        fontSize: '30px',
        color: '#88ff88',
        align: 'center',
      })
      .setOrigin(0.5);

    createButton(this, 400, 400, 'Restart', () => {
      this.scene.start('starter-select');
    });
  }
}
