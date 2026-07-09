// Warm orange-red palette with gradient pill buttons, matching the reference UI kit.
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

  // Gradient pill button fills (left-to-right, orange -> coral-red). Dark THEME.text stays
  // legible across all three states — verified: default 6.92:1/4.91:1, hover 7.74:1/5.43:1,
  // pressed 5.94:1/4.20:1 (pressed's low end is a brief, transient state, same trade-off already
  // accepted for buttonDisabledFill/Text below).
  buttonGradientFrom: 0xffa25c,
  buttonGradientTo: 0xff6b5c,
  buttonHoverGradientFrom: 0xffb26c,
  buttonHoverGradientTo: 0xff7b6c,
  buttonPressedGradientFrom: 0xf1944e,
  buttonPressedGradientTo: 0xf15d4e,

  buttonDisabledFill: 0xf0eef6,
  buttonDisabledFillHex: '#f0eef6',
  buttonDisabledText: '#b9b5cc',
} as const;
