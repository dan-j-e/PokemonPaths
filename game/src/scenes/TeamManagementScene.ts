import Phaser from 'phaser';
import { SEGMENTS } from '../data/segments';
import { getSpecies } from '../data/species';
import { createButton } from '../ui/button';
import { ensureSpeciesSprites, spriteKey } from '../data/sprites';
import { themeFor } from '../data/locationThemes';
import { drawProgressBar } from '../ui/progressBar';
import { THEME } from '../ui/theme';
import { EVOLUTIONS, EVOLUTION_WIN_THRESHOLD } from '../data/evolutions';
import type { RunState, TeamMember } from '../data/types';

const ICON_SIZE = 28;

function describe(species: string): string {
  const s = getSpecies(species);
  return `${species} (${s.type1}${s.type2 ? '/' + s.type2 : ''})`;
}

function describeMember(member: TeamMember): string {
  const base = describe(member.species);
  const wins = member.wins ?? 0;
  if (wins > 0 && EVOLUTIONS[member.species]) {
    return `${base} — ${wins}/${EVOLUTION_WIN_THRESHOLD} wins`;
  }
  return base;
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
    const battle = this.runState.adHocBattle ?? (segment.battles ?? [])[this.runState.battleSubIndex ?? 0];
    const locationLabel = this.runState.adHocBattle ? 'Trainer Encounter' : segment.name;

    this.cameras.main.setBackgroundColor(themeFor(segment.id));

    drawProgressBar(this, this.runState.segmentIndex);

    const allSpecies = [
      ...this.runState.team.map((m) => m.species),
      ...this.runState.bench.map((m) => m.species),
      ...battle.roster,
    ];

    ensureSpeciesSprites(this, allSpecies, () => {
      this.add
        .text(400, 25, `${locationLabel}\nvs. ${battle.trainer}`, {
          fontFamily: 'monospace',
          fontSize: '18px',
          color: THEME.text,
          align: 'center',
          wordWrap: { width: 760 },
        })
        .setOrigin(0.5);

      this.add.text(560, 80, 'Opponent team:', {
        fontFamily: 'monospace',
        fontSize: '14px',
        color: THEME.dangerHex,
      });
      battle.roster.forEach((species, i) => {
        this.add.image(575, 108 + i * 34, spriteKey(species)).setDisplaySize(ICON_SIZE, ICON_SIZE);
        this.add.text(595, 108 + i * 34 - 10, describe(species), {
          fontFamily: 'monospace',
          fontSize: '13px',
          color: THEME.dangerHex,
        });
      });

      if (this.runState.mustChangeLeadFrom) {
        this.add
          .text(400, 55, `Potion used — reorder so ${this.runState.mustChangeLeadFrom} is no longer leading.`, {
            fontFamily: 'monospace',
            fontSize: '13px',
            color: THEME.primaryHex,
            align: 'center',
            wordWrap: { width: 700 },
          })
          .setOrigin(0.5);
      }

      this.redrawTeam();

      const warningText = this.add.text(400, 540, '', {
        fontFamily: 'monospace',
        fontSize: '13px',
        color: THEME.dangerHex,
        align: 'center',
        wordWrap: { width: 700 },
      }).setOrigin(0.5);

      createButton(this, 400, 570, 'Continue to Battle', () => {
        if (this.runState.mustChangeLeadFrom && this.runState.team[0].species === this.runState.mustChangeLeadFrom) {
          warningText.setText(`You must lead with a Pokemon other than ${this.runState.mustChangeLeadFrom}.`);
          return;
        }
        this.scene.start('battle', { ...this.runState, mustChangeLeadFrom: undefined });
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
        color: THEME.successHex,
      }),
    );

    this.runState.team.forEach((member, i) => {
      const y = 110 + i * 34;
      const icon = this.add.image(50, y + 10, spriteKey(member.species)).setDisplaySize(ICON_SIZE, ICON_SIZE);
      const row = this.add.text(70, y, `${i + 1}. ${describeMember(member)}`, {
        fontFamily: 'monospace',
        fontSize: '14px',
        color: THEME.text,
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
        color: THEME.tertiaryHex,
      }),
    );

    this.runState.bench.forEach((member, i) => {
      const y = benchY + 30 + i * 34;
      const icon = this.add.image(50, y + 10, spriteKey(member.species)).setDisplaySize(ICON_SIZE, ICON_SIZE);
      const row = this.add.text(70, y, describeMember(member), {
        fontFamily: 'monospace',
        fontSize: '14px',
        color: THEME.textMuted,
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
