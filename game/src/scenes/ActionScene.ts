import Phaser from 'phaser';
import { SEGMENTS } from '../data/segments';
import { ACTION_LABELS } from '../data/actions';
import { ENCOUNTER_TABLES, pickWeightedSpecies } from '../data/encounters';
import { getSpecies, catchChance } from '../data/species';
import { themeFor } from '../data/locationThemes';
import { ITEM_LABELS, pickRandomItem } from '../data/items';
import { ensureItemSprites, itemSpriteKey } from '../data/itemSprites';
import { generateRouteTrainer } from '../data/routeTrainers';
import { computeBattleOdds, spinBattle } from '../battle/roulette';
import { applyBattleWin } from '../data/evolutions';
import { createButton, createSelfDisablingButton } from '../ui/button';
import type { Button } from '../ui/button';
import { showEvolvePrompt } from '../ui/evolvePrompt';
import { drawIconLabelRow } from '../ui/listRow';
import { drawProgressBar } from '../ui/progressBar';
import { drawNeoBackground } from '../ui/background';
import { THEME, FONT_BODY, FONT_TITLE, FONT_TITLE_WEIGHT } from '../ui/theme';
import type { ItemType } from '../data/items';
import type { EvolutionOffer } from '../data/evolutions';
import type { RunState } from '../data/types';

const MAX_ACTIVE_TEAM = 6;
const MAX_TOTAL_ROSTER = 12;

type InteractOutcome = 'battle' | 'item' | 'nothing';

interface RandomResult {
  line: string;
  evolutionOffer?: EvolutionOffer;
}

export class ActionScene extends Phaser.Scene {
  private runState!: RunState;

  constructor() {
    super('action');
  }

  init(data: RunState) {
    this.runState = data;
  }

  create() {
    const segment = SEGMENTS[this.runState.segmentIndex];
    const pool = segment.actionPool ?? [];
    const buttons: Button[] = [];

    drawNeoBackground(this, themeFor(segment.id));
    drawProgressBar(this, this.runState.segmentIndex);

    ensureItemSprites(this, () => {
      this.add
        .text(400, 30, segment.name, {
          fontFamily: FONT_TITLE,
          fontStyle: FONT_TITLE_WEIGHT,
          fontSize: '20px',
          color: THEME.text,
          align: 'center',
          letterSpacing: 1,
          wordWrap: { width: 700 },
        })
        .setOrigin(0.5);

      const itemCounts: Record<ItemType, number> = {
        xAttack: this.runState.items.xAttack,
        potion: this.runState.items.potion,
        revive: this.runState.items.revive,
      };
      (Object.keys(itemCounts) as ItemType[]).forEach((item, i) => {
        const x = 20 + i * 90;
        drawIconLabelRow(this, x, 22, itemSpriteKey(item), 24, x + 16, 14, `×${itemCounts[item]}`, {
          fontFamily: FONT_BODY,
          fontSize: '13px',
          color: THEME.textMuted,
        });
      });

      const resultText = this.add
        .text(400, 420, '', {
          fontFamily: FONT_BODY,
          fontSize: '16px',
          color: THEME.primaryHex,
          align: 'center',
          wordWrap: { width: 700 },
        })
        .setOrigin(0.5);

      const lockButtons = () => buttons.forEach((b) => b.setDisabled(true));

      const addToTeam = (species: string): boolean => {
        if (this.runState.team.length + this.runState.bench.length >= MAX_TOTAL_ROSTER) {
          return false;
        }
        if (this.runState.team.length < MAX_ACTIVE_TEAM) {
          this.runState.team = [...this.runState.team, { species }];
        } else {
          this.runState.bench = [...this.runState.bench, { species }];
        }
        return true;
      };

      const advance = () => {
        this.scene.start('overworld', { ...this.runState, segmentIndex: this.runState.segmentIndex + 1 });
      };

      const createContinueButton = (y: number, onDone: () => void) => createSelfDisablingButton(this, 400, y, 'Continue', onDone);

      const showResultThenContinue = (lines: string[], evolutionOffer?: EvolutionOffer) => {
        resultText.setText(lines.join('\n'));
        if (evolutionOffer) {
          showEvolvePrompt(this, evolutionOffer, this.runState.team, 480, (newTeam) => {
            this.runState.team = newTeam;
            createContinueButton(552, advance);
          });
        } else {
          createContinueButton(552, advance);
        }
      };

      const resolveFindItem = (): string => {
        const item = pickRandomItem();
        this.runState.items = { ...this.runState.items, [item]: this.runState.items[item] + 1 };
        return `Found a ${ITEM_LABELS[item]}!`;
      };

      const resolveCatchAuto = (): string => {
        const table = ENCOUNTER_TABLES[segment.id];
        if (!table || table.length === 0) return 'No wild Pokemon here.';
        const species = pickWeightedSpecies(table);
        const rate = getSpecies(species).catchRate ?? 200;
        const pct = Math.round(catchChance(rate) * 100);
        const success = Math.random() < catchChance(rate);
        if (success) {
          const added = addToTeam(species);
          return added
            ? `A wild ${species} appeared (${pct}% catch chance) and was caught!`
            : `A wild ${species} appeared (${pct}% catch chance) and was caught, but your party is full!`;
        }
        return `A wild ${species} appeared (${pct}% catch chance) and broke free.`;
      };

      const runManualCatch = () => {
        const table = ENCOUNTER_TABLES[segment.id];
        if (!table || table.length === 0) {
          showResultThenContinue(['No wild Pokemon here.']);
          return;
        }
        const species = pickWeightedSpecies(table);
        const rate = getSpecies(species).catchRate ?? 200;
        const chance = catchChance(rate);

        resultText.setText(`A wild ${species} appeared!\nCatch chance: ${Math.round(chance * 100)}%`);

        const throwBtn = createButton(this, 400, 500, 'Throw a Poke Ball', () => {
          throwBtn.destroy();
          const success = Math.random() < chance;
          if (success) {
            const added = addToTeam(species);
            showResultThenContinue([added ? `Caught ${species}!` : `Caught ${species}, but your party is full!`]);
          } else {
            showResultThenContinue([`${species} broke free. No penalty.`]);
          }
        });
      };

      const rollInteractOutcome = (): InteractOutcome => {
        const roll = Math.random();
        if (roll < 1 / 3) return 'battle';
        if (roll < 2 / 3) return 'item';
        return 'nothing';
      };

      const resolveInteractAuto = (): RandomResult => {
        const outcome = rollInteractOutcome();
        if (outcome === 'item') return { line: resolveFindItem() };
        if (outcome === 'nothing') return { line: 'You look around but find nothing.' };

        const battle = generateRouteTrainer(segment.id);
        const odds = computeBattleOdds(this.runState.team, battle, this.runState.pendingBoost);
        this.runState.pendingBoost = 0;
        const won = spinBattle(odds);
        if (!won) {
          return { line: `You battled a ${battle.trainer} and lost. No penalty.` };
        }
        const result = applyBattleWin(this.runState);
        this.runState.team = result.team;
        return { line: `You battled a ${battle.trainer} and won!`, evolutionOffer: result.evolutionOffer };
      };

      const runManualInteract = () => {
        const outcome = rollInteractOutcome();
        if (outcome === 'item') {
          showResultThenContinue([resolveFindItem()]);
          return;
        }
        if (outcome === 'nothing') {
          showResultThenContinue(['You look around but find nothing.']);
          return;
        }

        const battle = generateRouteTrainer(segment.id);
        this.scene.start('team-management', { ...this.runState, adHocBattle: battle, battleSubIndex: 0 });
      };

      pool.forEach((action, i) => {
        const y = 120 + i * 55;

        const btn = createButton(this, 400, y, ACTION_LABELS[action], () => {
          lockButtons();
          if (action === 'catch') {
            runManualCatch();
          } else if (action === 'interact') {
            runManualInteract();
          } else {
            showResultThenContinue([resolveFindItem()]);
          }
        });
        buttons.push(btn);
      });

      const resolveOneRandom = (): RandomResult => {
        const action = pool[Math.floor(Math.random() * pool.length)];
        if (action === 'catch') return { line: resolveCatchAuto() };
        if (action === 'interact') return resolveInteractAuto();
        return { line: resolveFindItem() };
      };

      if (pool.length > 1) {
        // A single-action pool (e.g. a one-off legendary encounter) has nothing meaningful to
        // randomize between — two rolls of the same action could double-resolve a one-time moment.
        const spinBtn = createButton(this, 400, 120 + pool.length * 55 + 20, 'Spin: 2 Random Rolls', () => {
          lockButtons();
          const result1 = resolveOneRandom();
          const result2 = resolveOneRandom();
          const evolutionOffer = result2.evolutionOffer ?? result1.evolutionOffer;
          showResultThenContinue([result1.line, result2.line], evolutionOffer);
        });
        buttons.push(spinBtn);
      }
    });
  }
}
