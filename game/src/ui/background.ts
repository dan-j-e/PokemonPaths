import Phaser from 'phaser';
import { THEME } from './theme';

const CANVAS_WIDTH = 800;
const CANVAS_HEIGHT = 600;

/** Flat light background plus a thin per-location accent bar — a light-touch identity strip
 * replacing the old full-bleed dark gradient+grid. Drawn first in each scene's create() so
 * everything else layers on top. */
export function drawNeoBackground(scene: Phaser.Scene, baseColor: number): void {
  const bg = scene.add.graphics().setDepth(-10);
  bg.fillStyle(THEME.background, 1);
  bg.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

  const accentBar = scene.add.graphics().setDepth(-9);
  accentBar.fillStyle(baseColor, 0.9);
  accentBar.fillRect(0, 0, CANVAS_WIDTH, 5);
}

/** A rounded white card with a soft drop shadow (two low-alpha offset passes, no image assets),
 * matching the button radius. */
export function drawPanel(
  scene: Phaser.Scene,
  x: number,
  y: number,
  width: number,
  height: number,
  alpha = 1,
): Phaser.GameObjects.Graphics {
  const panel = scene.add.graphics().setDepth(-1);
  panel.fillStyle(0x2e2b3d, 0.03);
  panel.fillRoundedRect(x - 2, y + 6, width + 4, height + 4, 20);
  panel.fillStyle(0x2e2b3d, 0.06);
  panel.fillRoundedRect(x, y + 3, width, height, 18);
  panel.fillStyle(0xffffff, alpha);
  panel.fillRoundedRect(x, y, width, height, 16);
  panel.lineStyle(1, THEME.buttonFill, 0.8);
  panel.strokeRoundedRect(x, y, width, height, 16);
  return panel;
}
