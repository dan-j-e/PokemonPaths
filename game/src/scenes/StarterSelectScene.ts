import Phaser from 'phaser';
import { createButton } from '../ui/button';

export class StarterSelectScene extends Phaser.Scene {
  constructor() {
    super('starter-select');
  }

  create() {
    this.add
      .text(400, 100, 'Twinleaf Town\nChoose your starter', {
        fontFamily: 'monospace',
        fontSize: '28px',
        color: '#ffffff',
        align: 'center',
      })
      .setOrigin(0.5);

    const starters = ['Turtwig', 'Chimchar', 'Piplup'];
    starters.forEach((starter, i) => {
      createButton(this, 400, 250 + i * 70, starter, () => {
        this.scene.start('overworld', { segmentIndex: 0, starter });
      });
    });
  }
}
