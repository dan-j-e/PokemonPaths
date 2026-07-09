import Phaser from 'phaser';
import { THEME, FONT_BODY } from './theme';

// Fixed pill dimensions — every button of a given size looks identical regardless of label length.
// 340px comfortably fits the longest label used anywhere ("Search for a wild Pokemon", 25 chars)
// at 20px with margin to spare for dynamic count suffixes like "(×99)".
const NORMAL_WIDTH = 340;
const NORMAL_HEIGHT = 48;
const NORMAL_RADIUS = NORMAL_HEIGHT / 2;
const NORMAL_FONT_SIZE = 20;

// Compact sizing for dense list rows (party reorder/swap actions only), where even the smallest
// full-size pill would exceed typical row spacing and overlap its neighbors.
const COMPACT_WIDTH = 64;
const COMPACT_HEIGHT = 22;
const COMPACT_RADIUS = COMPACT_HEIGHT / 2;
const COMPACT_FONT_SIZE = 12;

export interface ButtonOptions {
  disabled?: boolean;
  compact?: boolean;
}

export type Button = Phaser.GameObjects.Text & { setDisabled: (disabled: boolean) => void };

function paintGradient(
  g: Phaser.GameObjects.Graphics,
  width: number,
  height: number,
  radius: number,
  from: number,
  to: number,
) {
  g.clear();
  g.fillGradientStyle(from, to, from, to, 1);
  g.fillRoundedRect(-width / 2, -height / 2, width, height, radius);
}

function paintFlat(g: Phaser.GameObjects.Graphics, width: number, height: number, radius: number, color: number) {
  g.clear();
  g.fillStyle(color, 1);
  g.fillRoundedRect(-width / 2, -height / 2, width, height, radius);
}

export function createButton(
  scene: Phaser.Scene,
  x: number,
  y: number,
  label: string,
  onClick: () => void,
  opts: ButtonOptions = {},
): Button {
  const compact = !!opts.compact;
  const width = compact ? COMPACT_WIDTH : NORMAL_WIDTH;
  const height = compact ? COMPACT_HEIGHT : NORMAL_HEIGHT;
  const radius = compact ? COMPACT_RADIUS : NORMAL_RADIUS;
  const fontSize = compact ? COMPACT_FONT_SIZE : NORMAL_FONT_SIZE;

  const bg = scene.add.graphics().setDepth(0).setPosition(x, y);

  const text = scene.add
    .text(x, y, label, {
      fontFamily: FONT_BODY,
      fontSize: `${fontSize}px`,
      color: THEME.text,
    })
    .setOrigin(0.5)
    .setDepth(1);

  // The pill is a fixed size independent of the label's rendered width, so the clickable area
  // must be too — a Zone sized to the button avoids the text object's own (smaller) natural
  // bounds being used for hit-testing.
  const zone = scene.add.zone(x, y, width, height).setOrigin(0.5).setDepth(2);

  let disabled = !!opts.disabled;
  let hovering = false;

  const paint = () => {
    if (disabled) {
      paintFlat(bg, width, height, radius, THEME.buttonDisabledFill);
      text.setColor(THEME.buttonDisabledText);
    } else if (hovering) {
      paintGradient(bg, width, height, radius, THEME.buttonHoverGradientFrom, THEME.buttonHoverGradientTo);
      text.setColor(THEME.text);
    } else {
      paintGradient(bg, width, height, radius, THEME.buttonGradientFrom, THEME.buttonGradientTo);
      text.setColor(THEME.text);
    }
  };

  const release = () => {
    if (disabled) return;
    scene.tweens.add({ targets: [bg, text], scale: 1, duration: 90, ease: 'Quad.easeOut' });
    paint();
  };

  zone
    .setInteractive({ useHandCursor: true })
    .on('pointerdown', () => {
      if (disabled) return;
      paintGradient(bg, width, height, radius, THEME.buttonPressedGradientFrom, THEME.buttonPressedGradientTo);
      scene.tweens.add({ targets: [bg, text], scale: 0.96, duration: 70, ease: 'Quad.easeOut' });
      onClick();
    })
    .on('pointerup', release)
    .on('pointerupoutside', release)
    .on('pointerover', () => {
      hovering = true;
      if (!disabled) paintGradient(bg, width, height, radius, THEME.buttonHoverGradientFrom, THEME.buttonHoverGradientTo);
    })
    .on('pointerout', () => {
      hovering = false;
      release();
    });

  text.once(Phaser.GameObjects.Events.DESTROY, () => {
    bg.destroy();
    zone.destroy();
  });

  const setDisabled = (next: boolean) => {
    disabled = next;
    if (disabled) {
      zone.disableInteractive();
    } else if (!zone.input) {
      zone.setInteractive({ useHandCursor: true });
    }
    paint();
  };

  const button = Object.assign(text, { setDisabled });
  paint();
  return button;
}
