import Phaser from 'phaser';
import { SEGMENTS } from '../data/segments';

const GYM_SEGMENT_INDICES = SEGMENTS.reduce<number[]>((acc, seg, i) => {
  if (seg.isGym) acc.push(i);
  return acc;
}, []);

const LEAGUE_INDEX = SEGMENTS.findIndex((s) => s.id === 'pokemon-league');

const TRACK_X = 780;
const TRACK_TOP_Y = 30;
const TRACK_BOTTOM_Y = 570;

/** Vertical badge-case track on the right edge: gym pips light up as they're passed, a Champion
 * star sits at the top as the run's ultimate goal. */
export function drawProgressBar(scene: Phaser.Scene, segmentIndex: number): void {
  const gymCount = GYM_SEGMENT_INDICES.length;
  const spacing = (TRACK_BOTTOM_Y - TRACK_TOP_Y) / (gymCount + 1);

  scene.add.rectangle(TRACK_X, TRACK_TOP_Y, 2, TRACK_BOTTOM_Y - TRACK_TOP_Y, 0x444444).setOrigin(0.5, 0);

  const championLit = segmentIndex >= LEAGUE_INDEX;
  scene.add
    .text(TRACK_X, TRACK_TOP_Y, '★', {
      fontFamily: 'monospace',
      fontSize: '20px',
      color: championLit ? '#ffd700' : '#555555',
    })
    .setOrigin(0.5);

  GYM_SEGMENT_INDICES.forEach((gymIndex, i) => {
    const positionFromTop = gymCount - i;
    const y = TRACK_TOP_Y + positionFromTop * spacing;
    const lit = segmentIndex > gymIndex;
    scene.add.circle(TRACK_X, y, 8, lit ? 0xffd700 : 0x333333).setStrokeStyle(2, lit ? 0xffffff : 0x555555);
  });
}
