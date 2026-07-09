import Phaser from 'phaser';
import { SEGMENTS } from '../data/segments';
import { getSpecies } from '../data/species';
import { createButton } from '../ui/button';
import { ensureSpeciesSprites, spriteKey } from '../data/sprites';
import { themeFor } from '../data/locationThemes';
import { drawProgressBar } from '../ui/progressBar';
import { drawNeoBackground, drawPanel } from '../ui/background';
import { THEME, FONT_BODY, FONT_TITLE } from '../ui/theme';
import { EVOLUTIONS, EVOLUTION_WIN_THRESHOLD } from '../data/evolutions';
import { XATTACK_BOOST } from '../data/items';
import type { RunState, TeamMember } from '../data/types';

const ICON_SIZE = 40;
const OPPONENT_ICON_SIZE = 36;
const ROW_HEIGHT = 32;

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

    drawNeoBackground(this, themeFor(segment.id));
    drawProgressBar(this, this.runState.segmentIndex);

    const allSpecies = [
      ...this.runState.team.map((m) => m.species),
      ...this.runState.bench.map((m) => m.species),
      ...battle.roster,
    ];

    ensureSpeciesSprites(this, allSpecies, () => {
      this.add
        .text(400, 25, `${locationLabel}\nvs. ${battle.trainer}`, {
          fontFamily: FONT_TITLE,
          fontSize: '18px',
          color: THEME.text,
          align: 'center',
          wordWrap: { width: 760 },
        })
        .setOrigin(0.5);

      drawPanel(this, 545, 60, 220, 40 + battle.roster.length * ROW_HEIGHT + 10);
      this.add.text(560, 70, 'Opponent Team', {
        fontFamily: FONT_BODY,
        fontSize: '14px',
        color: THEME.dangerHex,
      });
      battle.roster.forEach((species, i) => {
        const y = 100 + i * ROW_HEIGHT;
        this.add.image(578, y + 10, spriteKey(species)).setDisplaySize(OPPONENT_ICON_SIZE, OPPONENT_ICON_SIZE);
        this.add.text(602, y, describe(species), {
          fontFamily: FONT_BODY,
          fontSize: '13px',
          color: THEME.text,
          wordWrap: { width: 158 },
        });
      });

      const oppPanelBottom = 60 + 40 + battle.roster.length * ROW_HEIGHT + 10;
      let xAttackControl: Phaser.GameObjects.Text | null = null;
      const renderXAttackControl = () => {
        xAttackControl?.destroy();
        if (this.runState.items.xAttack > 0) {
          xAttackControl = createButton(this, 655, oppPanelBottom + 40, `Use X-Attack (×${this.runState.items.xAttack})`, () => {
            this.runState.items = { ...this.runState.items, xAttack: this.runState.items.xAttack - 1 };
            this.runState.pendingBoost += XATTACK_BOOST;
            renderXAttackControl();
          });
        } else {
          xAttackControl = this.add
            .text(655, oppPanelBottom + 40, 'X-Attack (none available)', {
              fontFamily: FONT_BODY,
              fontSize: '13px',
              color: THEME.buttonDisabledText,
              fontStyle: 'italic',
              align: 'center',
              wordWrap: { width: 200 },
            })
            .setOrigin(0.5);
        }
      };
      renderXAttackControl();

      if (this.runState.mustChangeLeadFrom) {
        this.add
          .text(400, 50, `Potion used — reorder so ${this.runState.mustChangeLeadFrom} is no longer leading.`, {
            fontFamily: FONT_BODY,
            fontSize: '13px',
            color: THEME.primaryHex,
            align: 'center',
            wordWrap: { width: 700 },
          })
          .setOrigin(0.5);
      }

      this.redrawTeam();

      const warningText = this.add
        .text(400, 542, '', {
          fontFamily: FONT_BODY,
          fontSize: '13px',
          color: THEME.dangerHex,
          align: 'center',
          wordWrap: { width: 700 },
        })
        .setOrigin(0.5);

      createButton(this, 400, 574, 'Continue to Battle', () => {
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

    const teamCount = this.runState.team.length;
    const benchCount = this.runState.bench.length;
    const teamRowsStartY = 112;
    const benchLabelY = teamRowsStartY + teamCount * ROW_HEIGHT + 10;
    const benchRowsStartY = benchLabelY + 20;
    const contentBottomY = benchRowsStartY + benchCount * ROW_HEIGHT + (benchCount === 0 ? 10 : 0);

    this.dynamicObjects.push(drawPanel(this, 20, 60, 505, contentBottomY - 60 + 10));

    this.dynamicObjects.push(
      this.add.text(40, 75, 'Your Team (top = lead)', {
        fontFamily: FONT_BODY,
        fontSize: '14px',
        color: THEME.successHex,
      }),
    );
    this.dynamicObjects.push(
      this.add.text(40, 93, 'Reordering changes battle odds', {
        fontFamily: FONT_BODY,
        fontSize: '11px',
        fontStyle: 'italic',
        color: THEME.textMuted,
      }),
    );

    this.runState.team.forEach((member, i) => {
      const y = teamRowsStartY + i * ROW_HEIGHT;
      const icon = this.add.image(60, y + 8, spriteKey(member.species)).setDisplaySize(ICON_SIZE, ICON_SIZE);
      const row = this.add.text(88, y, `${i + 1}. ${describeMember(member)}`, {
        fontFamily: FONT_BODY,
        fontSize: '13px',
        color: THEME.text,
        wordWrap: { width: 340 },
      });
      this.dynamicObjects.push(icon, row);

      if (i > 0) {
        const upBtn = createButton(this, 460, y + 8, 'Up', () => {
          const team = [...this.runState.team];
          [team[i - 1], team[i]] = [team[i], team[i - 1]];
          this.runState = { ...this.runState, team };
          this.redrawTeam();
        });
        this.dynamicObjects.push(upBtn);
      }
    });

    this.dynamicObjects.push(
      this.add.text(40, benchLabelY, 'Bench', {
        fontFamily: FONT_BODY,
        fontSize: '14px',
        color: THEME.tertiaryHex,
      }),
    );

    this.runState.bench.forEach((member, i) => {
      const y = benchRowsStartY + i * ROW_HEIGHT;
      const icon = this.add.image(60, y + 8, spriteKey(member.species)).setDisplaySize(ICON_SIZE, ICON_SIZE);
      const row = this.add.text(88, y, describeMember(member), {
        fontFamily: FONT_BODY,
        fontSize: '13px',
        color: THEME.textMuted,
        wordWrap: { width: 340 },
      });
      this.dynamicObjects.push(icon, row);

      const swapBtn = createButton(this, 460, y + 8, 'Swap', () => {
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
