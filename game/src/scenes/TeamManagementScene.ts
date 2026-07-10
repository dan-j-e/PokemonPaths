import Phaser from 'phaser';
import { SEGMENTS } from '../data/segments';
import { getSpecies } from '../data/species';
import { createButton } from '../ui/button';
import type { Button } from '../ui/button';
import { ensureSpeciesSprites, spriteKey } from '../data/sprites';
import { themeFor } from '../data/locationThemes';
import { drawProgressBar } from '../ui/progressBar';
import { drawNeoBackground, drawPanel } from '../ui/background';
import { drawOddsBar } from '../ui/oddsBar';
import { drawIconLabelRow } from '../ui/listRow';
import { drawEvolutionProgress } from '../ui/evolutionProgress';
import { THEME, FONT_BODY, FONT_TITLE, FONT_TITLE_WEIGHT } from '../ui/theme';
import { EVOLUTIONS, EVOLUTION_WIN_THRESHOLD } from '../data/evolutions';
import { XATTACK_BOOST } from '../data/items';
import { computeBattleOdds } from '../battle/roulette';
import type { RunState, TeamMember, BattleSpec } from '../data/types';

// Active team gets the biggest icons (always <=6, guaranteed to fit); bench stays compact since
// it's reserve, not the emphasis. Icon size must stay under its row height or adjacent rows
// visually overlap — verified via worst-case (6 team + 6 bench + 6 opponent) layout math.
const ACTIVE_ICON_SIZE = 36;
const ACTIVE_ROW_HEIGHT = 40;
const BENCH_ICON_SIZE = 22;
const BENCH_ROW_HEIGHT = 24;
const OPPONENT_ICON_SIZE = 40;
const OPPONENT_ROW_HEIGHT = 44;

function describe(species: string): string {
  const s = getSpecies(species);
  return `${species} (${s.type1}${s.type2 ? '/' + s.type2 : ''})`;
}

function hasEvolutionProgress(member: TeamMember): boolean {
  return (member.wins ?? 0) > 0 && !!EVOLUTIONS[member.species];
}

export class TeamManagementScene extends Phaser.Scene {
  private runState!: RunState;
  private dynamicObjects: Phaser.GameObjects.GameObject[] = [];
  private oddsObjects: Phaser.GameObjects.GameObject[] = [];
  // Scene instances are reused by Phaser across visits (see main.ts's `scene: [...]` registration),
  // so this must be reset in init() — a bare field initializer would only run once, ever.
  private xAttackActive = false;
  private xAttackButton: Button | null = null;
  private battle!: BattleSpec;
  private oppPanelBottom = 0;
  private panelsTop = 60;

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
      const titleText = this.add
        .text(400, 22, `${locationLabel} vs. ${battle.trainer}`, {
          fontFamily: FONT_TITLE,
          fontStyle: FONT_TITLE_WEIGHT,
          fontSize: '18px',
          color: THEME.text,
          align: 'center',
          letterSpacing: 1,
          wordWrap: { width: 760 },
        })
        .setOrigin(0.5);

      let headerBottom = titleText.y + titleText.height / 2;

      if (this.runState.faintedIds?.length) {
        const infoText = this.add
          .text(400, headerBottom + 12, "A Pokemon has fainted — reorder your team so it isn't leading before continuing.", {
            fontFamily: FONT_BODY,
            fontSize: '12px',
            color: THEME.primaryHex,
            align: 'center',
            wordWrap: { width: 700 },
          })
          .setOrigin(0.5);
        headerBottom = infoText.y + infoText.height / 2;
      }

      // Dynamic instead of a hardcoded 60 — keeps the panels clear of the title/info text above
      // regardless of whether the title wraps to 2 lines or the potion-retry message is shown.
      this.panelsTop = Math.max(60, headerBottom + 10);

      drawPanel(this, 545, this.panelsTop, 220, 40 + battle.roster.length * OPPONENT_ROW_HEIGHT + 10);
      this.add.text(560, this.panelsTop + 10, 'Opponent Team', {
        fontFamily: FONT_BODY,
        fontSize: '14px',
        color: THEME.dangerHex,
      });
      battle.roster.forEach((species, i) => {
        const y = this.panelsTop + 40 + i * OPPONENT_ROW_HEIGHT;
        drawIconLabelRow(this, 578, y + 12, spriteKey(species), OPPONENT_ICON_SIZE, 602, y, describe(species), {
          fontFamily: FONT_BODY,
          fontSize: '13px',
          color: THEME.text,
          wordWrap: { width: 158 },
        });
      });

      this.oppPanelBottom = this.panelsTop + 40 + battle.roster.length * OPPONENT_ROW_HEIGHT + 10;

      this.redrawTeam();

      const warningText = this.add
        .text(400, 518, '', {
          fontFamily: FONT_BODY,
          fontSize: '13px',
          color: THEME.dangerHex,
          align: 'center',
          wordWrap: { width: 700 },
        })
        .setOrigin(0.5);

      this.redrawXAttackButton();

      const continueBtn = createButton(this, 600, 552, 'Continue to Battle', () => {
        if (this.runState.faintedIds?.includes(this.runState.team[0].id)) {
          warningText.setText(`${this.runState.team[0].species} has fainted and can't lead. Reorder your team first.`);
          return;
        }
        continueBtn.setDisabled(true);
        this.scene.start('battle', { ...this.runState });
      });
    });
  }

  private redrawXAttackButton() {
    this.xAttackButton?.destroy();
    this.xAttackButton = null;

    if (this.xAttackActive) {
      this.xAttackButton = createButton(this, 200, 552, 'X-Attack: ON', () => {
        this.runState.items = { ...this.runState.items, xAttack: this.runState.items.xAttack + 1 };
        this.runState.pendingBoost -= XATTACK_BOOST;
        this.xAttackActive = false;
        this.redrawXAttackButton();
        this.redrawOddsPanel();
      });
    } else if (this.runState.items.xAttack > 0) {
      this.xAttackButton = createButton(this, 200, 552, `Use X-Attack (×${this.runState.items.xAttack})`, () => {
        this.runState.items = { ...this.runState.items, xAttack: this.runState.items.xAttack - 1 };
        this.runState.pendingBoost += XATTACK_BOOST;
        this.xAttackActive = true;
        this.redrawXAttackButton();
        this.redrawOddsPanel();
      });
    } else {
      this.xAttackButton = createButton(this, 200, 552, 'X-Attack (none available)', () => {}, { disabled: true });
    }
  }

  private redrawTeam() {
    this.dynamicObjects.forEach((obj) => obj.destroy());
    this.dynamicObjects = [];

    const teamCount = this.runState.team.length;
    const benchCount = this.runState.bench.length;
    const teamRowsStartY = this.panelsTop + 30;
    const benchLabelY = teamRowsStartY + teamCount * ACTIVE_ROW_HEIGHT + 4;
    const benchRowsStartY = benchLabelY + 12;
    const contentBottomY = benchRowsStartY + benchCount * BENCH_ROW_HEIGHT + (benchCount === 0 ? 10 : 0);

    this.dynamicObjects.push(drawPanel(this, 20, this.panelsTop, 505, contentBottomY - this.panelsTop + 10));

    this.dynamicObjects.push(
      this.add.text(40, this.panelsTop + 15, 'Your Team (top = lead)', {
        fontFamily: FONT_BODY,
        fontSize: '14px',
        color: THEME.successHex,
      }),
    );

    this.runState.team.forEach((member, i) => {
      const y = teamRowsStartY + i * ACTIVE_ROW_HEIGHT;
      const [icon, row] = drawIconLabelRow(
        this,
        64,
        y + 10,
        spriteKey(member.species),
        ACTIVE_ICON_SIZE,
        96,
        y,
        `${i + 1}. ${describe(member.species)}`,
        { fontFamily: FONT_BODY, fontSize: '13px', color: THEME.text, wordWrap: { width: 230 } },
      );
      this.dynamicObjects.push(icon, row);

      if (hasEvolutionProgress(member)) {
        const bar = drawEvolutionProgress(this, 340, y + 6, 80, 8, Math.min(1, (member.wins ?? 0) / EVOLUTION_WIN_THRESHOLD));
        this.dynamicObjects.push(bar);
      }

      if (i > 0) {
        const topBtn = createButton(
          this,
          460,
          y + 10,
          '↑ Top',
          () => {
            const team = [...this.runState.team];
            const [moved] = team.splice(i, 1);
            team.unshift(moved);
            this.runState = { ...this.runState, team };
            this.redrawTeam();
          },
          { size: 'compact' },
        );
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
      const y = benchRowsStartY + i * BENCH_ROW_HEIGHT;
      const [icon, row] = drawIconLabelRow(
        this,
        60,
        y + 8,
        spriteKey(member.species),
        BENCH_ICON_SIZE,
        88,
        y,
        describe(member.species),
        { fontFamily: FONT_BODY, fontSize: '12px', color: THEME.textMuted, wordWrap: { width: 190 } },
      );
      this.dynamicObjects.push(icon, row);

      if (hasEvolutionProgress(member)) {
        const bar = drawEvolutionProgress(this, 300, y + 4, 80, 6, Math.min(1, (member.wins ?? 0) / EVOLUTION_WIN_THRESHOLD));
        this.dynamicObjects.push(bar);
      }

      const swapBtn = createButton(
        this,
        460,
        y + 8,
        'Swap',
        () => {
          const bench = [...this.runState.bench];
          const team = [...this.runState.team];
          const [incoming] = bench.splice(i, 1);
          const [outgoing] = team.splice(team.length - 1, 1);
          team.push(incoming);
          bench.push(outgoing);
          this.runState = { ...this.runState, team, bench };
          this.redrawTeam();
        },
        { size: 'compact' },
      );
      this.dynamicObjects.push(swapBtn);
    });

    this.redrawOddsPanel();
  }

  private redrawOddsPanel() {
    this.oddsObjects.forEach((obj) => obj.destroy());
    this.oddsObjects = [];

    const oppPanelBottom = this.oppPanelBottom;

    const odds = computeBattleOdds(this.runState.team, this.battle, this.runState.pendingBoost);
    const winPct = Math.round(odds.winProbability * 100);
    const oddsPanelTop = oppPanelBottom + 20;

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

    this.oddsObjects.push(...drawOddsBar(this, 555, oddsPanelTop + 36, 200, 20, winPct, 12));
  }
}
