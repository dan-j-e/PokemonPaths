import Phaser from 'phaser';
import { THEME } from './theme';

const CANVAS_WIDTH = 800;
const CANVAS_HEIGHT = 600;

// Radial glow approximation: Phaser Graphics has no native radial gradient, so this stacks N
// concentric circles of low, compounding alpha — center gets covered by every ring (darkest-to-
// accent-color blend deepest there), the outer edge only by the last ring or two. Biased above
// true canvas center so the footer/progress-bar zone (bottom of the screen) stays comparatively
// flat/dark, keeping the light "ink" buttons there at full contrast.
const GLOW_CENTER_X = 400;
const GLOW_CENTER_Y = 240;
const GLOW_RING_COUNT = 12;
const GLOW_RING_STEP = 22;
const GLOW_RING_ALPHA = 0.06;

const GRAIN_DOT_COUNT = 300;
const GRAIN_ALPHA = 0.03;

function drawRadialGlow(scene: Phaser.Scene, color: number): void {
  const g = scene.add.graphics().setDepth(-9);
  for (let i = GLOW_RING_COUNT; i >= 1; i--) {
    g.fillStyle(color, GLOW_RING_ALPHA);
    g.fillCircle(GLOW_CENTER_X, GLOW_CENTER_Y, i * GLOW_RING_STEP);
  }
}

function drawGrain(scene: Phaser.Scene): void {
  const g = scene.add.graphics().setDepth(-8);
  for (let i = 0; i < GRAIN_DOT_COUNT; i++) {
    const x = Math.random() * CANVAS_WIDTH;
    const y = Math.random() * CANVAS_HEIGHT;
    const size = i % 2 === 0 ? 1 : 2;
    g.fillStyle(Math.random() < 0.5 ? 0xffffff : 0x000000, GRAIN_ALPHA);
    g.fillRect(x, y, size, size);
  }
}

/** Dark base fill + a soft per-location radial glow + faint grain. Drawn first in each scene's
 * create() so everything else layers on top. */
export function drawNeoBackground(scene: Phaser.Scene, baseColor: number): void {
  const bg = scene.add.graphics().setDepth(-10);
  bg.fillStyle(THEME.background, 1);
  bg.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

  drawRadialGlow(scene, baseColor);
  drawGrain(scene);
}

/** A rounded dark surface card with a soft light rim (a drop-shadow doesn't read against a dark
 * background) and a faint hairline border, matching the button radius. */
export function drawPanel(
  scene: Phaser.Scene,
  x: number,
  y: number,
  width: number,
  height: number,
  alpha = 1,
): Phaser.GameObjects.Graphics {
  const panel = scene.add.graphics().setDepth(-1);
  panel.fillStyle(THEME.ink, 0.035);
  panel.fillRoundedRect(x - 3, y - 3, width + 6, height + 6, 19);
  panel.fillStyle(THEME.surface, alpha);
  panel.fillRoundedRect(x, y, width, height, 16);
  panel.lineStyle(1, THEME.ink, 0.12);
  panel.strokeRoundedRect(x, y, width, height, 16);
  return panel;
}
