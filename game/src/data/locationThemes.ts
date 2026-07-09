// Dark, mood-appropriate background color per segment id, matching each location's real
// personality (e.g. Hearthome purple for Fantina, Jubilife beige/silver as the media city).
// Kept in sync with the trimmed 23-segment game/src/data/segments.ts — every id here should
// correspond to a real current segment; merged segments blend their constituent locations' colors.
export const LOCATION_THEMES: Record<string, number> = {
  'twinleaf-town': 0x1f3d2b,
  'route-201-202': 0x242d20,
  'route-203-oreburgh-gate': 0x33291a,
  'oreburgh-city-gym1': 0x33291a,
  'route-204-floaroma': 0x2d1f2a,
  'valley-windworks': 0x233344,
  'route-205-eterna-forest': 0x162a1c,
  'eterna-city-gym2': 0x1c3d1c,
  'mt-coronet-crossing': 0x2a2632,
  'hearthome-outskirts': 0x3d1f4d,
  'veilstone-city-gym3': 0x2b2b2f,
  'celestic-town': 0x2a2440,
  'route-213-214': 0x18242c,
  'lake-verity': 0x1a3040,
  'pastoria-city-gym4': 0x1a3a36,
  'route-210-north': 0x1c3320,
  'lake-valor': 0x1e3a4a,
  'hearthome-city-gym5': 0x3d1f4d,
  'route-218': 0x14304a,
  'canalave-city-gym6': 0x1a2438,
  'coronet-to-snowpoint': 0x212e38,
  'snowpoint-city-gym7': 0x1c2c3d,
  'veilstone-city-cyrus': 0x2b2b2f,
  'mt-coronet-pre-spear-pillar': 0x24242e,
  'spear-pillar': 0x1a1a2e,
  'spear-pillar-legendary': 0x1a1a2e,
  'sunyshore-city-gym8': 0x3d3312,
  'route-223-victory-road': 0x2a1518,
  'pokemon-league': 0x332b0f,
};

export const DEFAULT_THEME = 0x0a0a12;

export function themeFor(segmentId: string): number {
  return LOCATION_THEMES[segmentId] ?? DEFAULT_THEME;
}
