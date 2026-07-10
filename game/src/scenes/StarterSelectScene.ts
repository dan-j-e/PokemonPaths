import Phaser from 'phaser';
import { ensureSpeciesSprites, spriteKey } from '../data/sprites';
import { emptyInventory } from '../data/items';
import { nextMemberId } from '../data/memberId';
import { drawNeoBackground } from '../ui/background';
import { THEME, FONT_BODY, FONT_TITLE, FONT_TITLE_WEIGHT } from '../ui/theme';
import { LOCATION_THEMES } from '../data/locationThemes';

const STARTERS = ['Turtwig', 'Chimchar', 'Piplup'];

const BASE_SIZE = 192;
const REST_SCALE = 0.33;
const HOVER_SCALE = 0.66;
const ZONE_SIZE = BASE_SIZE * HOVER_SCALE;

export class StarterSelectScene extends Phaser.Scene {
  constructor() {
    super('starter-select');
  }

  create() {
    drawNeoBackground(this, LOCATION_THEMES['twinleaf-town']);

    this.add
      .text(400, 60, 'Twinleaf Town\nChoose your starter', {
        fontFamily: FONT_TITLE,
        fontStyle: FONT_TITLE_WEIGHT,
        fontSize: '28px',
        color: THEME.text,
        align: 'center',
        letterSpacing: 1,
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
        const portrait = this.add.image(x, 240, spriteKey(starter)).setDisplaySize(BASE_SIZE, BASE_SIZE);
        // Normalizing scale for THIS sprite's native texture size to a uniform 192px box — captured
        // once, then REST_SCALE/HOVER_SCALE multiply on top of it, so every starter ends up the same
        // apparent size regardless of differing source resolutions.
        const baseScaleX = portrait.scaleX;
        const baseScaleY = portrait.scaleY;
        portrait.setScale(baseScaleX * REST_SCALE, baseScaleY * REST_SCALE);

        const label = this.add
          .text(x, 350, starter, {
            fontFamily: FONT_BODY,
            fontSize: '18px',
            color: THEME.text,
            align: 'center',
          })
          .setOrigin(0.5);

        // A separate fixed-size Zone (matching ui/button.ts's Zone-as-hit-area pattern) instead of
        // the portrait's own default hit area, which — sized off each sprite's native texture — gave
        // the 3 starters inconsistent hit boxes despite the same visual display size.
        const zone = this.add.zone(x, 240, ZONE_SIZE, ZONE_SIZE).setOrigin(0.5);

        disableAll.push(() => {
          zone.disableInteractive();
          portrait.setAlpha(0.4);
          glow.setAlpha(0.04);
          label.setColor(THEME.buttonDisabledText);
        });

        zone
          .setInteractive({ useHandCursor: true })
          .on('pointerover', () => {
            if (selected) return;
            portrait.setDepth(1); // pop above neighbors while enlarged, regardless of draw order
            glow.setFillStyle(THEME.primary, 0.2);
            this.tweens.killTweensOf(portrait);
            this.tweens.add({
              targets: portrait,
              scaleX: baseScaleX * HOVER_SCALE,
              scaleY: baseScaleY * HOVER_SCALE,
              y: 232,
              duration: 180,
              ease: 'Quad.easeOut', // monotonic growth — no overshoot, so it never dips/shrinks mid-hover
              onComplete: () => {
                this.tweens.add({
                  targets: portrait,
                  y: '+=6',
                  duration: 260,
                  ease: 'Sine.easeInOut',
                  yoyo: true,
                  repeat: -1,
                });
              },
            });
          })
          .on('pointerout', () => {
            if (selected) return;
            portrait.setDepth(0);
            glow.setFillStyle(THEME.primary, 0.08);
            this.tweens.killTweensOf(portrait);
            this.tweens.add({
              targets: portrait,
              scaleX: baseScaleX * REST_SCALE,
              scaleY: baseScaleY * REST_SCALE,
              y: 240,
              duration: 150,
              ease: 'Quad.easeOut',
            });
          })
          .on('pointerdown', () => {
            selected = true;
            disableAll.forEach((disable) => disable());
            this.scene.start('overworld', {
              segmentIndex: 0,
              starter,
              team: [{ species: starter, id: nextMemberId() }],
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
