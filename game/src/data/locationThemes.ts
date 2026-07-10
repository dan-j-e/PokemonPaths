// Glow-center color for the per-location radial background accent (see ui/background.ts's
// drawRadialGlow). Values are the original dark per-location palette (tuned for a since-removed
// full-bleed dark background) lightened 40% toward white per channel — the compounded 12-ring
// glow only reaches ~52% of this color at its brightest point, so a too-dark input reads as an
// almost invisible glow against the THEME.background it's composited over.
export const LOCATION_THEMES: Record<string, number> = {
  'twinleaf-town': 0x798b80,
  'route-201-202': 0x7c8179,
  'route-203-oreburgh-gate': 0x857f76,
  'oreburgh-city-gym1': 0x857f76,
  'route-204-floaroma': 0x81797f,
  'valley-windworks': 0x7b858f,
  'route-205-eterna-forest': 0x737f77,
  'eterna-city-gym2': 0x778b77,
  'mt-coronet-crossing': 0x7f7d84,
  'hearthome-outskirts': 0x8b7994,
  'veilstone-city-gym3': 0x808082,
  'celestic-town': 0x7f7c8c,
  'route-213-214': 0x747c80,
  'lake-verity': 0x76838c,
  'pastoria-city-gym4': 0x768986,
  'route-210-north': 0x778579,
  'lake-valor': 0x788992,
  'hearthome-city-gym5': 0x8b7994,
  'route-218': 0x728392,
  'canalave-city-gym6': 0x767c88,
  'coronet-to-snowpoint': 0x7a8288,
  'snowpoint-city-gym7': 0x77808b,
  'veilstone-city-cyrus': 0x808082,
  'mt-coronet-pre-spear-pillar': 0x7c7c82,
  'spear-pillar': 0x767682,
  'spear-pillar-legendary': 0x767682,
  'sunyshore-city-gym8': 0x8b8571,
  'route-223-victory-road': 0x7f7374,
  'pokemon-league': 0x85806f,
};

export const DEFAULT_THEME = 0x6c6c71;

export function themeFor(segmentId: string): number {
  return LOCATION_THEMES[segmentId] ?? DEFAULT_THEME;
}
