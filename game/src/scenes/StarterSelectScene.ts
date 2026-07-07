import Phaser from 'phaser';
import { createButton } from '../ui/button';
import { ensureSpeciesSprites, spriteKey } from '../data/sprites';
import { emptyInventory } from '../data/items';

const STARTERS = ['Turtwig', 'Chimchar', 'Piplup'];

export class StarterSelectScene extends Phaser.Scene {
  constructor() {
    super('starter-select');
  }

  create() {
    this.cameras.main.setBackgroundColor(0x1f3d2b);

    this.add
      .text(400, 60, 'Twinleaf Town\nChoose your starter', {
        fontFamily: 'monospace',
        fontSize: '28px',
        color: '#ffffff',
        align: 'center',
      })
      .setOrigin(0.5);

    ensureSpeciesSprites(this, STARTERS, () => {
      STARTERS.forEach((starter, i) => {
        const x = 200 + i * 200;

        this.add.image(x, 250, spriteKey(starter)).setDisplaySize(120, 120);

        createButton(this, x, 360, starter, () => {
          this.scene.start('overworld', {
            segmentIndex: 0,
            starter,
            team: [{ species: starter }],
            bench: [],
            items: emptyInventory(),
            pendingBoost: 0,
            hasExpShare: false,
          });
        });
      });
    });
  }
}
