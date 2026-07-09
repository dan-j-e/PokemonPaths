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
import { computeBattleOdds } from '../battle/roulette';
import type { RunState, TeamMember, BattleSpec } from '../data/types';

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
  private oddsObjects: Phaser.GameObjects.GameObject[] = [];
  // Scene instances are reused by Phaser across visits (see main.ts's `scene: [...]` registration),
  // so this must be reset in init() — a bare field initializer would only run once, ever.
  private xAttackActive = false;
  private battle!: BattleSpec;
  private oppPanelBottom = 0;

  constructor() {
    super('team-management');
  }

  init(data: RunState) {
    this.runState = data;
    this.xAttackActive = false;
  }

  create() {
    const segment = SEGMENTS[this.runState.segmentIndex];
    this.battle = this.runState.adHocBattle ?? (segment.battles ?? [])[this.runState.battleSubIndex ?? 0];
    const battle = this.battle;
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

      this.oppPanelBottom = 60 + 40 + battle.roster.length * ROW_HEIGHT + 10;

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
        const topBtn = createButton(this, 460, y + 8, '↑ Top', () => {
          const team = [...this.runState.team];
          const [moved] = team.splice(i, 1);
          team.unshift(moved);
          this.runState = { ...this.runState, team };
          this.redrawTeam();
        });
        this.dynamicObjects.push(topBtn);
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

    this.redrawOddsPanel();
  }

  private redrawOddsPanel() {
    this.oddsObjects.forEach((obj) => obj.destroy());
    this.oddsObjects = [];

    const oppPanelBottom = this.oppPanelBottom;

    if (this.xAttackActive) {
      const cancelBtn = createButton(this, 655, oppPanelBottom + 40, 'X-Attack: ON (tap to cancel)', () => {
        this.runState.items = { ...this.runState.items, xAttack: this.runState.items.xAttack + 1 };
        this.runState.pendingBoost -= XATTACK_BOOST;
        this.xAttackActive = false;
        this.redrawOddsPanel();
      });
      this.oddsObjects.push(cancelBtn);
    } else if (this.runState.items.xAttack > 0) {
      const useBtn = createButton(this, 655, oppPanelBottom + 40, `Use X-Attack (×${this.runState.items.xAttack})`, () => {
        this.runState.items = { ...this.runState.items, xAttack: this.runState.items.xAttack - 1 };
        this.runState.pendingBoost += XATTACK_BOOST;
        this.xAttackActive = true;
        this.redrawOddsPanel();
      });
      this.oddsObjects.push(useBtn);
    } else {
      this.oddsObjects.push(
        this.add
          .text(655, oppPanelBottom + 40, 'X-Attack (none available)', {
            fontFamily: FONT_BODY,
            fontSize: '13px',
            color: THEME.buttonDisabledText,
            fontStyle: 'italic',
            align: 'center',
            wordWrap: { width: 200 },
          })
          .setOrigin(0.5),
      );
    }

    const odds = computeBattleOdds(this.runState.team, this.battle, this.runState.pendingBoost);
    const winPct = Math.round(odds.winProbability * 100);
    const oddsPanelTop = oppPanelBottom + 80;

    this.oddsObjects.push(drawPanel(this, 545, oddsPanelTop, 220, 70));
    this.oddsObjects.push(
      this.add
        .text(655, oddsPanelTop + 18, `Matchup: ${odds.tier}`, {
          fontFamily: FONT_BODY,
          fontSize: '13px',
          color: THEME.secondaryHex,
        })
        .setOrigin(0.5),
    );

    const barX = 555;
    const barY = oddsPanelTop + 36;
    const barWidth = 200;
    const barHeight = 20;
    const oddsBg = this.add.graphics();
    oddsBg.fillStyle(THEME.danger, 0.35);
    oddsBg.fillRoundedRect(barX, barY, barWidth, barHeight, 10);
    const oddsFill = this.add.graphics();
    oddsFill.fillStyle(THEME.success, 0.85);
    oddsFill.fillRoundedRect(barX, barY, Math.max(16, (barWidth * winPct) / 100), barHeight, 10);
    this.oddsObjects.push(oddsBg, oddsFill);
    this.oddsObjects.push(
      this.add
        .text(655, barY + barHeight / 2, `Win ${winPct}% / Lose ${100 - winPct}%`, {
          fontFamily: FONT_BODY,
          fontSize: '12px',
          color: THEME.text,
        })
        .setOrigin(0.5),
    );
  }
}
