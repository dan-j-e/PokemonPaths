import Phaser from 'phaser';
import { SEGMENTS } from '../data/segments';
import { getSpecies } from '../data/species';
import { createButton } from '../ui/button';
import { ensureSpeciesSprites, spriteKey } from '../data/sprites';
import type { RunState } from '../data/types';

const ICON_SIZE = 28;

function describe(species: string): string {
  const s = getSpecies(species);
  return `${species} (${s.type1}${s.type2 ? '/' + s.type2 : ''})`;
}

export class TeamManagementScene extends Phaser.Scene {
  private runState!: RunState;
  private dynamicObjects: Phaser.GameObjects.GameObject[] = [];

  constructor() {
    super('team-management');
  }

  init(data: RunState) {
    this.runState = data;
  }

  create() {
    const segment = SEGMENTS[this.runState.segmentIndex];
    const battle = (segment.battles ?? [])[this.runState.battleSubIndex ?? 0];

    const allSpecies = [
      ...this.runState.team.map((m) => m.species),
      ...this.runState.bench.map((m) => m.species),
      ...battle.roster,
    ];

    ensureSpeciesSprites(this, allSpecies, () => {
      this.add
        .text(400, 25, `${segment.name}\nvs. ${battle.trainer}`, {
          fontFamily: 'monospace',
          fontSize: '18px',
          color: '#ffffff',
          align: 'center',
          wordWrap: { width: 760 },
        })
        .setOrigin(0.5);

      this.add.text(560, 80, 'Opponent team:', {
        fontFamily: 'monospace',
        fontSize: '14px',
        color: '#ffaaaa',
      });
      battle.roster.forEach((species, i) => {
        this.add.image(575, 108 + i * 34, spriteKey(species)).setDisplaySize(ICON_SIZE, ICON_SIZE);
        this.add.text(595, 108 + i * 34 - 10, describe(species), {
          fontFamily: 'monospace',
          fontSize: '13px',
          color: '#ffaaaa',
        });
      });

      this.redrawTeam();

      createButton(this, 400, 570, 'Continue to Battle', () => {
        this.scene.start('battle', this.runState);
      });
    });
  }

  private redrawTeam() {
    this.dynamicObjects.forEach((obj) => obj.destroy());
    this.dynamicObjects = [];

    this.dynamicObjects.push(
      this.add.text(40, 80, 'Your active team (top = lead):', {
        fontFamily: 'monospace',
        fontSize: '14px',
        color: '#88ff88',
      }),
    );

    this.runState.team.forEach((member, i) => {
      const y = 110 + i * 34;
      const icon = this.add.image(50, y + 10, spriteKey(member.species)).setDisplaySize(ICON_SIZE, ICON_SIZE);
      const row = this.add.text(70, y, `${i + 1}. ${describe(member.species)}`, {
        fontFamily: 'monospace',
        fontSize: '14px',
        color: '#ffffff',
      });
      this.dynamicObjects.push(icon, row);

      if (i > 0) {
        const upBtn = createButton(this, 420, y + 10, 'Move up', () => {
          const team = [...this.runState.team];
          [team[i - 1], team[i]] = [team[i], team[i - 1]];
          this.runState = { ...this.runState, team };
          this.redrawTeam();
        });
        this.dynamicObjects.push(upBtn);
      }
    });

    const benchY = 110 + this.runState.team.length * 34 + 30;
    this.dynamicObjects.push(
      this.add.text(40, benchY, 'Bench:', {
        fontFamily: 'monospace',
        fontSize: '14px',
        color: '#8888ff',
      }),
    );

    this.runState.bench.forEach((member, i) => {
      const y = benchY + 30 + i * 34;
      const icon = this.add.image(50, y + 10, spriteKey(member.species)).setDisplaySize(ICON_SIZE, ICON_SIZE);
      const row = this.add.text(70, y, describe(member.species), {
        fontFamily: 'monospace',
        fontSize: '14px',
        color: '#cccccc',
      });
      this.dynamicObjects.push(icon, row);

      const swapBtn = createButton(this, 420, y + 10, 'Swap in', () => {
        const bench = [...this.runState.bench];
        const team = [...this.runState.team];
        const [incoming] = bench.splice(i, 1);
        const [outgoing] = team.splice(team.length - 1, 1);
        team.push(incoming);
        bench.push(outgoing);
        this.runState = { ...this.runState, team, bench };
        this.redrawTeam();
      });
      this.dynamicObjects.push(swapBtn);
    });
  }
}
