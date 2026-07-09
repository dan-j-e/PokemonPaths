import Phaser from 'phaser';
import { ensureSpeciesSprites, spriteKey } from '../data/sprites';
import { emptyInventory } from '../data/items';
import { drawNeoBackground } from '../ui/background';
import { THEME, FONT_BODY, FONT_TITLE } from '../ui/theme';

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
      // Fixed-size pill buttons can't sit 3-across at 200px spacing (they're 340px wide each) —
      // instead the starter portraits themselves are the clickable choice, which also reads more
      // like a character-select screen than a form.
      const disableAll: (() => void)[] = [];

      STARTERS.forEach((starter, i) => {
        const x = 200 + i * 200;
        let selected = false;

        const glow = this.add.circle(x, 240, 100, THEME.primary, 0.08).setDepth(-1);
        const portrait = this.add.image(x, 240, spriteKey(starter)).setDisplaySize(192, 192);
        const label = this.add
          .text(x, 350, starter, {
            fontFamily: FONT_BODY,
            fontSize: '18px',
            color: THEME.text,
            align: 'center',
          })
          .setOrigin(0.5);

        disableAll.push(() => {
          portrait.disableInteractive();
          portrait.setAlpha(0.4);
          glow.setAlpha(0.04);
          label.setColor(THEME.buttonDisabledText);
        });

        portrait
          .setInteractive({ useHandCursor: true })
          .on('pointerover', () => {
            if (selected) return;
            portrait.setDepth(1); // pop above neighbors while enlarged, regardless of draw order
            glow.setFillStyle(THEME.primary, 0.2);
            this.tweens.add({ targets: portrait, scale: 1.2, y: 228, duration: 180, ease: 'Back.easeOut' });
            this.tweens.add({ targets: glow, scale: 1.15, y: 228, duration: 180, ease: 'Back.easeOut' });
          })
          .on('pointerout', () => {
            if (selected) return;
            portrait.setDepth(0);
            glow.setFillStyle(THEME.primary, 0.08);
            this.tweens.add({ targets: portrait, scale: 1, y: 240, duration: 150, ease: 'Quad.easeOut' });
            this.tweens.add({ targets: glow, scale: 1, y: 240, duration: 150, ease: 'Quad.easeOut' });
          })
          .on('pointerdown', () => {
            selected = true;
            disableAll.forEach((disable) => disable());
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
