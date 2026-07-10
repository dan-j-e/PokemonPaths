import Phaser from 'phaser';
import { SEGMENTS } from '../data/segments';
import { THEME, FONT_BODY } from './theme';

const GYM_INDICES = new Set(SEGMENTS.reduce<number[]>((acc, seg, i) => {
  if (seg.isGym) acc.push(i);
  return acc;
}, []));

const LEAGUE_INDEX = SEGMENTS.findIndex((s) => s.id === 'pokemon-league');

const BAR_MARGIN_X = 40;
const BAR_Y = 588;
const BAR_HEIGHT = 20;
const USABLE_WIDTH = 800 - BAR_MARGIN_X * 2;
const STOP_SPACING = USABLE_WIDTH / (SEGMENTS.length - 1);
const SQUARE_SIZE = 10;
const BADGE_SIZE = 14;
const STAR_FONT_SIZE = 16;
export const UNLIT_COLOR = 0x3a3742;

function stopX(i: number): number {
  return BAR_MARGIN_X + i * STOP_SPACING;
}

function isLit(i: number, segmentIndex: number): boolean {
  return i === LEAGUE_INDEX ? segmentIndex >= LEAGUE_INDEX : segmentIndex > i;
}

function drawSquare(scene: Phaser.Scene, x: number, y: number, color: number): void {
  const g = scene.add.graphics();
  g.fillStyle(color, 1);
  g.fillRoundedRect(x - SQUARE_SIZE / 2, y - SQUARE_SIZE / 2, SQUARE_SIZE, SQUARE_SIZE, 2);
}

function drawBadge(scene: Phaser.Scene, x: number, y: number, color: number): void {
  const half = BADGE_SIZE / 2;
  const g = scene.add.graphics();
  g.fillStyle(color, 1);
  g.beginPath();
  g.moveTo(x, y - half);
  g.lineTo(x + half, y);
  g.lineTo(x, y + half);
  g.lineTo(x - half, y);
  g.closePath();
  g.fillPath();
  g.lineStyle(1, THEME.ink, 0.5);
  g.strokePath();
}

function drawStar(scene: Phaser.Scene, x: number, y: number, color: number): void {
  scene.add
    .text(x, y, '★', { fontFamily: FONT_BODY, fontSize: `${STAR_FONT_SIZE}px`, color: `#${color.toString(16).padStart(6, '0')}` })
    .setOrigin(0.5);
}

/** Horizontal pill at the bottom of the canvas showing every segment as a small marker — a plain
 * square for ordinary stops, a diamond "badge" for the 8 gyms, a star for the final stop (Elite
 * Four + Champion, combined into the 'pokemon-league' segment). Unlit (not yet reached) stops are
 * a flat muted grey regardless of shape; lit gym badges and the final star turn the accent color
 * (reserving it for the run's real milestones), lit plain stops turn the light "ink" neutral. */
export function drawProgressBar(scene: Phaser.Scene, segmentIndex: number): void {
  const track = scene.add.graphics().setDepth(-1);
  track.fillStyle(THEME.surface, 0.85);
  track.fillRoundedRect(BAR_MARGIN_X, BAR_Y - BAR_HEIGHT / 2, USABLE_WIDTH, BAR_HEIGHT, BAR_HEIGHT / 2);
  track.lineStyle(1, THEME.ink, 0.12);
  track.strokeRoundedRect(BAR_MARGIN_X, BAR_Y - BAR_HEIGHT / 2, USABLE_WIDTH, BAR_HEIGHT, BAR_HEIGHT / 2);

  SEGMENTS.forEach((_, i) => {
    const x = stopX(i);
    const lit = isLit(i, segmentIndex);

    if (i === LEAGUE_INDEX) {
      drawStar(scene, x, BAR_Y, lit ? THEME.primary : UNLIT_COLOR);
    } else if (GYM_INDICES.has(i)) {
      drawBadge(scene, x, BAR_Y, lit ? THEME.primary : UNLIT_COLOR);
    } else {
      drawSquare(scene, x, BAR_Y, lit ? THEME.ink : UNLIT_COLOR);
    }
  });
}
