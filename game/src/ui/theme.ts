// Dark "nuevo-tokyo" palette — near-black base, sparing orange-red accent (not a dominant fill),
// light "ink" pill buttons. Location backgrounds (locationThemes.ts) drive a soft radial glow per
// segment (see ui/background.ts's drawRadialGlow) instead of a flat fill.
// All contrast ratios below are WCAG relative-luminance, checked against THEME.background unless noted.

export const FONT_BODY = '"Nunito", sans-serif';
export const FONT_TITLE = '"Nunito", sans-serif';
// Titles use this heavier weight (Nunito 800, already loaded) + letter-spacing to read as a
// distinct display style instead of just being body text at a bigger size.
export const FONT_TITLE_WEIGHT = '800';

export const THEME = {
  background: 0x141318,
  surface: 0x1c1b22, // panel/card fill, progress-bar track fill
  surfaceHex: '#1c1b22',

  text: '#f3f1ec', // 16.4:1
  textMuted: '#a9a6ad', // 7.57:1

  ink: 0xf3f1ec, // numeric form of `text` — default button fill, progress-bar "lit" neutral
  inkHex: '#f3f1ec',

  primary: 0xff5a36, // 5.96:1 — sparing accent (progress-bar milestones), not the default button color
  primaryHex: '#ff5a36',
  secondary: 0xf3f1ec, // reuses `ink` — light neutral for emphasis text
  secondaryHex: '#f3f1ec',
  tertiary: 0x827e8c, // 4.67:1 — muted cool grey for de-emphasized labels/borders
  tertiaryHex: '#827e8c',

  success: 0x3ddc84, // 10.36:1
  successHex: '#3ddc84',
  danger: 0xff4d6d, // 5.75:1 — hue-distinct from primary orange
  dangerHex: '#ff4d6d',

  // Light "ink" pill buttons (inverts the old light-theme button logic — pops against the dark
  // ground automatically). buttonText is dark since the pill itself is now light.
  buttonFill: 0xf3f1ec,
  buttonHoverFill: 0xffffff,
  buttonPressedFill: 0xd9d6cf,
  buttonText: '#18161c', // 15.9:1 on buttonFill

  buttonDisabledFill: 0x2a2930, // recedes into the dark ground
  buttonDisabledText: '#6b6870',
} as const;
