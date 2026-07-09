// Warm orange-red palette with flat single-color pill buttons.
// Location backgrounds (locationThemes.ts) keep their own per-city accent, surfaced as a thin
// identity bar at the top of the screen rather than a full-bleed mood background (see background.ts).
// All text colors below are contrast-checked (WCAG) against the near-white THEME.background/card white.

export const FONT_BODY = '"Nunito", sans-serif';
export const FONT_TITLE = '"Nunito", sans-serif';

export const THEME = {
  background: 0xf6f4fb,
  text: '#2e2b3d',
  textMuted: '#726c8d',

  primary: 0xc7361f, // deep rust-orange — ~4.8:1 on white
  primaryHex: '#c7361f',
  secondary: 0x23243a, // dark navy — ~13.9:1 on white
  secondaryHex: '#23243a',
  tertiary: 0x9c5a1e, // amber-brown — ~4.9:1 on white
  tertiaryHex: '#9c5a1e',

  success: 0x177a46, // emerald — ~4.9:1 on white
  successHex: '#177a46',
  danger: 0xb91c1c, // deep red, distinct from the primary rust-orange — ~5.9:1 on white
  dangerHex: '#b91c1c',

  // Flat single-color pill button fills (one coral-orange, tone-shifted per state — no gradient).
  // Dark THEME.text stays legible across all three: default 5.89:1, hover 6.48:1, pressed 4.70:1.
  buttonFill: 0xff8a50,
  buttonHoverFill: 0xff985e,
  buttonPressedFill: 0xeb763c,

  buttonDisabledFill: 0xf0eef6,
  buttonDisabledFillHex: '#f0eef6',
  buttonDisabledText: '#b9b5cc',
} as const;
