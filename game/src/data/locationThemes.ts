// Dark, mood-appropriate background color per segment id, matching each location's real
// personality (e.g. Hearthome purple for Fantina, Jubilife beige/silver as the media city).
export const LOCATION_THEMES: Record<string, number> = {
  'twinleaf-town': 0x1f3d2b,
  'route-201': 0x1c3320,
  'route-202': 0x1c3320,
  'jubilife-city-grunts': 0x3a3630,
  'route-203': 0x1c3320,
  'oreburgh-gate': 0x2b2620,
  'oreburgh-city-gym1': 0x33291a,
  'jubilife-city-mars1': 0x3a3630,
  'route-204': 0x1c3320,
  'floaroma-town': 0x3d1f33,
  'valley-windworks': 0x233344,
  'route-205': 0x14304a,
  'eterna-forest': 0x14260f,
  'eterna-city-gym2': 0x1c3d1c,
  'mt-coronet-crossing': 0x2e2e33,
  'hearthome-outskirts': 0x2a1f3d,
  'veilstone-city-gym3': 0x2b2b2f,
  'route-214': 0x1c3320,
  'route-213': 0x14304a,
  'pastoria-city-gym4': 0x1a3a36,
  'route-210-north': 0x1c3320,
  'celestic-town': 0x22204a,
  'hearthome-city-gym5': 0x3d1f4d,
  'route-218': 0x14304a,
  'canalave-city-gym6': 0x1a2438,
  'lake-valor': 0x102436,
  'lake-verity': 0x102436,
  'mt-coronet-2': 0x2e2e33,
  'routes-216-217': 0x24303a,
  'snowpoint-city-gym7': 0x1c2c3d,
  'veilstone-city-triple': 0x2b2b2f,
  'mt-coronet-3': 0x2e2e33,
  'spear-pillar': 0x1a1a2e,
  'sunyshore-city-gym8': 0x3d3312,
  'route-223': 0x102436,
  'victory-road': 0x3d1414,
  'pokemon-league': 0x332b0f,
};

export const DEFAULT_THEME = 0x1d2b53;

export function themeFor(segmentId: string): number {
  return LOCATION_THEMES[segmentId] ?? DEFAULT_THEME;
}
