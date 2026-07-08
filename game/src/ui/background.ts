import Phaser from 'phaser';
import { THEME } from './theme';

const CANVAS_WIDTH = 800;
const CANVAS_HEIGHT = 600;

function lighten(color: number, amount: number): number {
  const r = Math.min(255, ((color >> 16) & 0xff) + amount);
  const g = Math.min(255, ((color >> 8) & 0xff) + amount);
  const b = Math.min(255, (color & 0xff) + amount);
  return (r << 16) | (g << 8) | b;
}

/** Layered "neo Tokyo" background: a vertical gradient (base color at the bottom, lifted toward
 * the theme's purple at the top) plus a sparse low-alpha grid, instead of a flat solid fill.
 * Drawn first in each scene's create() so everything else layers on top. */
export function drawNeoBackground(scene: Phaser.Scene, baseColor: number): void {
  const top = lighten(baseColor, 24);
  const bg = scene.add.graphics().setDepth(-10);
  bg.fillGradientStyle(top, top, baseColor, baseColor, 1);
  bg.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

  const grid = scene.add.graphics().setDepth(-9);
  grid.lineStyle(1, THEME.secondary, 0.06);
  for (let x = 0; x <= CANVAS_WIDTH; x += 80) {
    grid.lineBetween(x, 0, x, CANVAS_HEIGHT);
  }
  for (let y = 0; y <= CANVAS_HEIGHT; y += 60) {
    grid.lineBetween(0, y, CANVAS_WIDTH, y);
  }
}

/** A rounded, semi-transparent panel for grouping related content, matching the button radius. */
export function drawPanel(
  scene: Phaser.Scene,
  x: number,
  y: number,
  width: number,
  height: number,
  alpha = 0.35,
): Phaser.GameObjects.Graphics {
  const panel = scene.add.graphics().setDepth(-1);
  panel.fillStyle(0x000000, alpha);
  panel.fillRoundedRect(x, y, width, height, 12);
  panel.lineStyle(1, THEME.tertiary, 0.4);
  panel.strokeRoundedRect(x, y, width, height, 12);
  return panel;
}
