import Phaser from 'phaser';
import { createButton } from '../ui/button';
import type { Button } from '../ui/button';
import { ensureSpeciesSprites, spriteKey } from '../data/sprites';
import { emptyInventory } from '../data/items';
import { drawNeoBackground } from '../ui/background';
import { THEME, FONT_TITLE } from '../ui/theme';

const STARTERS = ['Turtwig', 'Chimchar', 'Piplup'];

export class StarterSelectScene extends Phaser.Scene {
  constructor() {
    super('starter-select');
  }

  create() {
    drawNeoBackground(this, 0x1f3d2b);

    this.add
      .text(400, 60, 'Twinleaf Town\nChoose your starter', {
        fontFamily: FONT_TITLE,
        fontSize: '28px',
        color: THEME.text,
        align: 'center',
      })
      .setOrigin(0.5);

    ensureSpeciesSprites(this, STARTERS, () => {
      const pickButtons: Button[] = [];

      STARTERS.forEach((starter, i) => {
        const x = 200 + i * 200;

        // 96px native PokeAPI sprite doubled for a sizeable hero image (smooth-scaled, see main.ts).
        this.add.image(x, 240, spriteKey(starter)).setDisplaySize(192, 192);

        const btn = createButton(this, x, 370, starter, () => {
          pickButtons.forEach((b) => b.setDisabled(true));
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
        pickButtons.push(btn);
      });
    });
  }
}
