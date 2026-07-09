// Clean minimalist palette — light background, card-based panels, one clear accent color.
// Location backgrounds (locationThemes.ts) keep their own per-city accent, surfaced now as a thin
// identity bar at the top of the screen rather than a full-bleed mood background (see background.ts).
// All text colors below are contrast-checked against the near-white THEME.background/card white.

export const FONT_BODY = '"Nunito", sans-serif';
export const FONT_TITLE = '"Nunito", sans-serif';

export const THEME = {
  background: 0xf6f4fb,
  text: '#2e2b3d',
  textMuted: '#726c8d',

  primary: 0xd6336c, // deep rose — ~4.6:1 on white
  primaryHex: '#d6336c',
  secondary: 0x1b6fc4, // azure — ~5.1:1 on white
  secondaryHex: '#1b6fc4',
  tertiary: 0x6741d9, // violet — ~7:1 on white
  tertiaryHex: '#6741d9',

  success: 0x177a46, // emerald — ~5.4:1 on white
  successHex: '#177a46',
  danger: 0xc92a2a, // brick red — ~6:1 on white
  dangerHex: '#c92a2a',

  buttonFill: 0xedeaf7,
  buttonHoverFill: 0xddd2f2,
  buttonPressedFill: 0xcfc0ec,
  buttonDisabledFill: 0xf0eef6,
  buttonDisabledFillHex: '#f0eef6',
  buttonDisabledText: '#b9b5cc',
} as const;
