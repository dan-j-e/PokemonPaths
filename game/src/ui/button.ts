import Phaser from 'phaser';
import { THEME, FONT_BODY } from './theme';

const NORMAL_FONT_SIZE = 20;
const NORMAL_PADDING_X = 16;
const NORMAL_PADDING_Y = 10;
const NORMAL_RADIUS = 12;

// Compact sizing for dense list rows (e.g. per-row reorder/swap actions), where a full-size
// button's height exceeds typical row spacing and overlaps its neighbors.
const COMPACT_FONT_SIZE = 13;
const COMPACT_PADDING_X = 10;
const COMPACT_PADDING_Y = 6;
const COMPACT_RADIUS = 8;

export interface ButtonOptions {
  disabled?: boolean;
  compact?: boolean;
}

export type Button = Phaser.GameObjects.Text & { setDisabled: (disabled: boolean) => void };

export function createButton(
  scene: Phaser.Scene,
  x: number,
  y: number,
  label: string,
  onClick: () => void,
  opts: ButtonOptions = {},
): Button {
  const compact = !!opts.compact;
  const fontSize = compact ? COMPACT_FONT_SIZE : NORMAL_FONT_SIZE;
  const paddingX = compact ? COMPACT_PADDING_X : NORMAL_PADDING_X;
  const paddingY = compact ? COMPACT_PADDING_Y : NORMAL_PADDING_Y;
  const radius = compact ? COMPACT_RADIUS : NORMAL_RADIUS;

  const text = scene.add
    .text(x, y, label, {
      fontFamily: FONT_BODY,
      fontSize: `${fontSize}px`,
      color: THEME.text,
    })
    .setOrigin(0.5)
    .setDepth(1);

  const width = text.width + paddingX * 2;
  const height = text.height + paddingY * 2;

  // Drawn relative to the button's own center (not the world origin) so a press/scale effect
  // scales about the button itself.
  const bg = scene.add.graphics().setDepth(0).setPosition(x, y);
  const drawBg = (fillColor: number) => {
    bg.clear();
    bg.fillStyle(fillColor, 1);
    bg.fillRoundedRect(-width / 2, -height / 2, width, height, radius);
  };

  let disabled = !!opts.disabled;
  let hovering = false;

  const paint = () => {
    if (disabled) {
      drawBg(THEME.buttonDisabledFill);
      text.setColor(THEME.buttonDisabledText);
    } else {
      drawBg(hovering ? THEME.buttonHoverFill : THEME.buttonFill);
      text.setColor(THEME.text);
    }
  };

  const release = () => {
    if (disabled) return;
    scene.tweens.add({ targets: [bg, text], scale: 1, duration: 90, ease: 'Quad.easeOut' });
    paint();
  };

  text
    .setInteractive({ useHandCursor: true })
    .on('pointerdown', () => {
      if (disabled) return;
      drawBg(THEME.buttonPressedFill);
      scene.tweens.add({ targets: [bg, text], scale: 0.96, duration: 70, ease: 'Quad.easeOut' });
      onClick();
    })
    .on('pointerup', release)
    .on('pointerupoutside', release)
    .on('pointerover', () => {
      hovering = true;
      if (!disabled) drawBg(THEME.buttonHoverFill);
    })
    .on('pointerout', () => {
      hovering = false;
      release();
    });

  text.once(Phaser.GameObjects.Events.DESTROY, () => bg.destroy());

  const setDisabled = (next: boolean) => {
    disabled = next;
    if (disabled) {
      text.disableInteractive();
    } else if (!text.input) {
      text.setInteractive({ useHandCursor: true });
    }
    paint();
  };

  const button = Object.assign(text, { setDisabled });
  paint();
  return button;
}
