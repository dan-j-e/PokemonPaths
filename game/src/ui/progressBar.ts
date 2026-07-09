import Phaser from 'phaser';
import { SEGMENTS } from '../data/segments';
import { THEME, FONT_BODY } from './theme';

const GYM_SEGMENT_INDICES = SEGMENTS.reduce<number[]>((acc, seg, i) => {
  if (seg.isGym) acc.push(i);
  return acc;
}, []);

const LEAGUE_INDEX = SEGMENTS.findIndex((s) => s.id === 'pokemon-league');

const TRACK_X = 780;
const TRACK_TOP_Y = 30;
const TRACK_BOTTOM_Y = 570;

/** Vertical badge-case track on the right edge: gym pips light up as they're passed, a Champion
 * star sits at the top as the run's ultimate goal. Labeled so it reads as a deliberate UI element
 * rather than stray lines/glyphs. */
export function drawProgressBar(scene: Phaser.Scene, segmentIndex: number): void {
  const gymCount = GYM_SEGMENT_INDICES.length;
  const spacing = (TRACK_BOTTOM_Y - TRACK_TOP_Y) / (gymCount + 1);

  scene.add.rectangle(TRACK_X, TRACK_TOP_Y, 4, TRACK_BOTTOM_Y - TRACK_TOP_Y, THEME.tertiary, 0.7).setOrigin(0.5, 0);

  const championLit = segmentIndex >= LEAGUE_INDEX;
  scene.add
    .text(TRACK_X, TRACK_TOP_Y, '★', {
      fontFamily: FONT_BODY,
      fontSize: '22px',
      color: championLit ? THEME.primaryHex : '#C7C2DC',
    })
    .setOrigin(0.5);
  scene.add
    .text(798, TRACK_TOP_Y + 22, 'Champion', {
      fontFamily: FONT_BODY,
      fontSize: '10px',
      color: THEME.textMuted,
    })
    .setOrigin(1, 0);

  GYM_SEGMENT_INDICES.forEach((gymIndex, i) => {
    const positionFromTop = gymCount - i;
    const y = TRACK_TOP_Y + positionFromTop * spacing;
    const lit = segmentIndex > gymIndex;
    scene.add
      .circle(TRACK_X, y, 9, lit ? THEME.secondary : 0xe3e0ee)
      .setStrokeStyle(2, lit ? THEME.secondary : 0xc7c2dc);
  });

  const bottomPipY = TRACK_TOP_Y + gymCount * spacing;
  scene.add
    .text(798, bottomPipY + 18, 'Badges', {
      fontFamily: FONT_BODY,
      fontSize: '10px',
      color: THEME.textMuted,
    })
    .setOrigin(1, 0);
}
