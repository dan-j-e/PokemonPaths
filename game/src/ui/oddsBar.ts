import Phaser from 'phaser';
import { THEME, FONT_BODY } from './theme';

/** A win/loss probability bar — a rounded track filled proportionally to `winPct`, with a
 * centered "Win X% / Lose Y%" label. Returns every created object so callers can push them into
 * their own destroy-tracking arrays (both current call sites redraw this on state changes). */
export function drawOddsBar(
  scene: Phaser.Scene,
  x: number,
  y: number,
  width: number,
  height: number,
  winPct: number,
  fontSize = 16,
): Phaser.GameObjects.GameObject[] {
  const radius = height / 2;
  const track = scene.add.graphics();
  track.fillStyle(THEME.danger, 0.35);
  track.fillRoundedRect(x, y, width, height, radius);

  const fill = scene.add.graphics();
  fill.fillStyle(THEME.success, 0.85);
  fill.fillRoundedRect(x, y, Math.max(height, (width * winPct) / 100), height, radius);

  const label = scene.add
    .text(x + width / 2, y + height / 2, `Win ${winPct}% / Lose ${100 - winPct}%`, {
      fontFamily: FONT_BODY,
      fontSize: `${fontSize}px`,
      color: THEME.text,
    })
    .setOrigin(0.5);

  return [track, fill, label];
}
