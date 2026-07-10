import Phaser from 'phaser';
import { THEME } from './theme';
import { UNLIT_COLOR } from './progressBar';

const SEGMENTS = 6;
const GAP = 2;

/** A 6-cell subdivided progress bar toward a mon's next evolution — finer-grained than the raw
 * win threshold so fractional EXP Share progress still visibly moves the bar, and more readable
 * than a raw "1.66/2 wins" number. Callers only draw this when the mon has started progressing. */
export function drawEvolutionProgress(
  scene: Phaser.Scene,
  x: number,
  y: number,
  width: number,
  height: number,
  progressFraction: number,
): Phaser.GameObjects.Graphics {
  const g = scene.add.graphics();
  const segWidth = (width - GAP * (SEGMENTS - 1)) / SEGMENTS;
  const litCount = Math.min(SEGMENTS, Math.floor(progressFraction * SEGMENTS + 1e-9));
  const radius = Math.min(2, height / 2);

  for (let i = 0; i < SEGMENTS; i++) {
    const segX = x + i * (segWidth + GAP);
    g.fillStyle(i < litCount ? THEME.primary : UNLIT_COLOR, 1);
    g.fillRoundedRect(segX, y, segWidth, height, radius);
  }

  return g;
}
