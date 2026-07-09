import Phaser from 'phaser';
import { THEME, FONT_BODY } from './theme';

// Fixed pill dimensions per size tier — every button of a given tier looks identical regardless
// of label length. 340px (normal) comfortably fits the longest label used anywhere ("Search for
// a wild Pokemon", 25 chars) at 20px with margin to spare for dynamic count suffixes like "(×99)".
const NORMAL_WIDTH = 340;
const NORMAL_HEIGHT = 48;
const NORMAL_RADIUS = NORMAL_HEIGHT / 2;
const NORMAL_FONT_SIZE = 20;

// Small: short binary-choice labels (Yes/No) that sit side by side — a normal-size pill would
// force them ~360px apart, turning a quick either/or tap into a long mouse trip.
const SMALL_WIDTH = 110;
const SMALL_HEIGHT = 44;
const SMALL_RADIUS = SMALL_HEIGHT / 2;
const SMALL_FONT_SIZE = 18;

// Compact: dense list rows (party reorder/swap actions only), where even Small would exceed
// typical row spacing and overlap its neighbors.
const COMPACT_WIDTH = 64;
const COMPACT_HEIGHT = 22;
const COMPACT_RADIUS = COMPACT_HEIGHT / 2;
const COMPACT_FONT_SIZE = 12;

export type ButtonSize = 'normal' | 'small' | 'compact';

export interface ButtonOptions {
  disabled?: boolean;
  size?: ButtonSize;
}

export type Button = Phaser.GameObjects.Text & { setDisabled: (disabled: boolean) => void };

function paintFlat(g: Phaser.GameObjects.Graphics, width: number, height: number, radius: number, color: number) {
  g.clear();
  g.fillStyle(color, 1);
  g.fillRoundedRect(-width / 2, -height / 2, width, height, radius);
}

function dimensionsFor(size: ButtonSize) {
  if (size === 'small') return { width: SMALL_WIDTH, height: SMALL_HEIGHT, radius: SMALL_RADIUS, fontSize: SMALL_FONT_SIZE };
  if (size === 'compact') {
    return { width: COMPACT_WIDTH, height: COMPACT_HEIGHT, radius: COMPACT_RADIUS, fontSize: COMPACT_FONT_SIZE };
  }
  return { width: NORMAL_WIDTH, height: NORMAL_HEIGHT, radius: NORMAL_RADIUS, fontSize: NORMAL_FONT_SIZE };
}

export function createButton(
  scene: Phaser.Scene,
  x: number,
  y: number,
  label: string,
  onClick: () => void,
  opts: ButtonOptions = {},
): Button {
  const { width, height, radius, fontSize } = dimensionsFor(opts.size ?? 'normal');

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
      paintFlat(bg, width, height, radius, THEME.buttonHoverFill);
      text.setColor(THEME.text);
    } else {
      paintFlat(bg, width, height, radius, THEME.buttonFill);
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
      paintFlat(bg, width, height, radius, THEME.buttonPressedFill);
      scene.tweens.add({ targets: [bg, text], scale: 0.96, duration: 70, ease: 'Quad.easeOut' });
      onClick();
    })
    .on('pointerup', release)
    .on('pointerupoutside', release)
    .on('pointerover', () => {
      hovering = true;
      if (!disabled) paintFlat(bg, width, height, radius, THEME.buttonHoverFill);
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
