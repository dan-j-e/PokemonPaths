// "Neo Tokyo" palette — classic cyberpunk neon. Location backgrounds (locationThemes.ts) keep
// their own per-city accent colors; this is the uniform UI chrome layered on top of them
// (buttons, bars, progress track, standard text colors).

export const THEME = {
  background: 0x0a0a12,
  text: '#e0e0ff',
  textMuted: '#9a94c2',

  primary: 0xff2e88, // hot pink
  primaryHex: '#ff2e88',
  secondary: 0x00e5ff, // cyan
  secondaryHex: '#00e5ff',
  tertiary: 0x9d4edd, // purple
  tertiaryHex: '#9d4edd',

  success: 0x39ff14,
  successHex: '#39ff14',
  danger: 0xff2e2e,
  dangerHex: '#ff2e2e',

  buttonFill: 0x2d1b4e,
  buttonHoverFill: 0xff2e88,
  buttonDisabledFill: 0x1a1a2e,
  buttonDisabledText: '#666677',
} as const;
