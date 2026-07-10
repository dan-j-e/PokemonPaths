import Phaser from 'phaser';

/** An icon + text pair, positioned independently (rows across scenes don't share a fixed
 * icon-to-label offset). Returns both so callers can push them into their own destroy-tracking
 * arrays. */
export function drawIconLabelRow(
  scene: Phaser.Scene,
  iconX: number,
  iconY: number,
  iconKey: string,
  iconSize: number,
  labelX: number,
  labelY: number,
  label: string,
  labelStyle: Phaser.Types.GameObjects.Text.TextStyle,
): [Phaser.GameObjects.Image, Phaser.GameObjects.Text] {
  const icon = scene.add.image(iconX, iconY, iconKey).setDisplaySize(iconSize, iconSize);
  const text = scene.add.text(labelX, labelY, label, labelStyle);
  return [icon, text];
}
