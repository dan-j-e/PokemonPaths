// Dark, mood-appropriate background color per segment id, matching each location's real
// personality (e.g. Hearthome purple for Fantina, Jubilife beige/silver as the media city).
// Kept in sync with the trimmed 23-segment game/src/data/segments.ts — every id here should
// correspond to a real current segment; merged segments blend their constituent locations' colors.
export const LOCATION_THEMES: Record<string, number> = {
  'twinleaf-town': 0x1f3d2b,
  'route-201-to-oreburgh-gate': 0x242d20,
  'oreburgh-city-gym1': 0x33291a,
  'route-204-floaroma': 0x2d1f2a,
  'valley-windworks': 0x233344,
  'route-205-eterna-forest': 0x162a1c,
  'eterna-city-gym2': 0x1c3d1c,
  'coronet-to-hearthome': 0x2a2632,
  'veilstone-city-gym3': 0x2b2b2f,
  'route-213-214': 0x18242c,
  'pastoria-city-gym4': 0x1a3a36,
  'route-210-north': 0x1c3320,
  'hearthome-city-gym5': 0x3d1f4d,
  'route-218': 0x14304a,
  'canalave-city-gym6': 0x1a2438,
  'coronet-to-snowpoint': 0x212e38,
  'snowpoint-city-gym7': 0x1c2c3d,
  'veilstone-city-cyrus': 0x2b2b2f,
  'mt-coronet-pre-spear-pillar': 0x24242e,
  'spear-pillar': 0x1a1a2e,
  'sunyshore-city-gym8': 0x3d3312,
  'route-223-victory-road': 0x2a1518,
  'pokemon-league': 0x332b0f,
};

export const DEFAULT_THEME = 0x0a0a12;

export function themeFor(segmentId: string): number {
  return LOCATION_THEMES[segmentId] ?? DEFAULT_THEME;
}
