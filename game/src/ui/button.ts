import Phaser from 'phaser';
import { THEME } from './theme';

const PADDING_X = 16;
const PADDING_Y = 10;
const RADIUS = 12;

export function createButton(
  scene: Phaser.Scene,
  x: number,
  y: number,
  label: string,
  onClick: () => void,
): Phaser.GameObjects.Text {
  const text = scene.add
    .text(x, y, label, {
      fontFamily: 'monospace',
      fontSize: '20px',
      color: THEME.text,
    })
    .setOrigin(0.5)
    .setDepth(1);

  const width = text.width + PADDING_X * 2;
  const height = text.height + PADDING_Y * 2;

  const bg = scene.add.graphics().setDepth(0);
  const drawBg = (fillColor: number) => {
    bg.clear();
    bg.fillStyle(fillColor, 1);
    bg.fillRoundedRect(x - width / 2, y - height / 2, width, height, RADIUS);
  };
  drawBg(THEME.buttonFill);

  text
    .setInteractive({ useHandCursor: true })
    .on('pointerdown', onClick)
    .on('pointerover', () => drawBg(THEME.buttonHoverFill))
    .on('pointerout', () => drawBg(THEME.buttonFill));

  return text;
}
