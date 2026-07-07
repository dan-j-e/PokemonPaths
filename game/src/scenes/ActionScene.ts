import Phaser from 'phaser';
import { SEGMENTS } from '../data/segments';
import { ACTION_LABELS, ACTION_FLAVOR } from '../data/actions';
import { ENCOUNTER_TABLES, pickWeightedSpecies } from '../data/encounters';
import { getSpecies, catchChance } from '../data/species';
import { themeFor } from '../data/locationThemes';
import { ITEM_LABELS, XATTACK_BOOST, pickRandomItem } from '../data/items';
import { createButton } from '../ui/button';
import type { ActionType, RunState } from '../data/types';

const MAX_ACTIVE_TEAM = 6;

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
    const buttons: Phaser.GameObjects.Text[] = [];

    this.cameras.main.setBackgroundColor(themeFor(segment.id));

    this.add
      .text(400, 30, segment.name, {
        fontFamily: 'monospace',
        fontSize: '20px',
        color: '#ffffff',
        align: 'center',
        wordWrap: { width: 700 },
      })
      .setOrigin(0.5);

    this.add.text(
      20,
      20,
      `X-Attack: ${this.runState.items.xAttack}  Potion: ${this.runState.items.potion}  Revive: ${this.runState.items.revive}`,
      { fontFamily: 'monospace', fontSize: '13px', color: '#aaaaaa' },
    );

    const resultText = this.add
      .text(400, 420, '', {
        fontFamily: 'monospace',
        fontSize: '16px',
        color: '#ffff88',
        align: 'center',
        wordWrap: { width: 700 },
      })
      .setOrigin(0.5);

    const lockButtons = () => buttons.forEach((b) => b.disableInteractive());

    const addToTeam = (species: string) => {
      if (this.runState.team.length < MAX_ACTIVE_TEAM) {
        this.runState.team = [...this.runState.team, { species }];
      } else {
        this.runState.bench = [...this.runState.bench, { species }];
      }
    };

    const advance = () => {
      this.scene.start('overworld', { ...this.runState, segmentIndex: this.runState.segmentIndex + 1 });
    };

    const showResultThenContinue = (lines: string[]) => {
      resultText.setText(lines.join('\n'));
      createButton(this, 400, 560, 'Continue', advance);
    };

    const resolveFindItem = (): string => {
      const item = pickRandomItem();
      this.runState.items = { ...this.runState.items, [item]: this.runState.items[item] + 1 };
      return `Found a ${ITEM_LABELS[item]}!`;
    };

    const resolveUseXAttack = (): string => {
      if (this.runState.items.xAttack <= 0) return "You don't have any X-Attacks.";
      this.runState.items = { ...this.runState.items, xAttack: this.runState.items.xAttack - 1 };
      this.runState.pendingBoost += XATTACK_BOOST;
      return 'Used an X-Attack! Your next battle odds are boosted.';
    };

    const resolveAction = (action: ActionType): string => {
      if (action === 'item') return resolveFindItem();
      if (action === 'heal') return resolveUseXAttack();
      return ACTION_FLAVOR[action] ?? '';
    };

    const resolveCatchAuto = (): string => {
      const table = ENCOUNTER_TABLES[segment.id];
      if (!table) return 'No wild Pokemon here.';
      const species = pickWeightedSpecies(table);
      const rate = getSpecies(species).catchRate ?? 200;
      const success = Math.random() < catchChance(rate);
      if (success) {
        addToTeam(species);
        return `A wild ${species} appeared and was caught!`;
      }
      return `A wild ${species} appeared and broke free.`;
    };

    const runManualCatch = () => {
      const table = ENCOUNTER_TABLES[segment.id];
      if (!table) {
        showResultThenContinue(['No wild Pokemon here.']);
        return;
      }
      const species = pickWeightedSpecies(table);
      const rate = getSpecies(species).catchRate ?? 200;
      const chance = catchChance(rate);

      resultText.setText(`A wild ${species} appeared!\nCatch chance: ${Math.round(chance * 100)}%`);

      const throwBtn = createButton(this, 400, 500, 'Throw a Poke Ball', () => {
        throwBtn.disableInteractive();
        const success = Math.random() < chance;
        if (success) {
          addToTeam(species);
          showResultThenContinue([`Caught ${species}!`]);
        } else {
          showResultThenContinue([`${species} broke free. No penalty.`]);
        }
      });
    };

    pool.forEach((action, i) => {
      const y = 120 + i * 55;

      if (action === 'heal' && this.runState.items.xAttack === 0) {
        this.add
          .text(400, y, `${ACTION_LABELS[action]} (none available)`, {
            fontFamily: 'monospace',
            fontSize: '20px',
            color: '#666666',
            backgroundColor: '#2a2a2a',
            padding: { x: 12, y: 8 },
          })
          .setOrigin(0.5);
        return;
      }

      const btn = createButton(this, 400, y, ACTION_LABELS[action], () => {
        lockButtons();
        if (action === 'catch') {
          runManualCatch();
        } else {
          showResultThenContinue([resolveAction(action)]);
        }
      });
      buttons.push(btn);
    });

    const resolveOneRandom = (): string => {
      const eligible = pool.filter((a) => a !== 'heal' || this.runState.items.xAttack > 0);
      const action = eligible[Math.floor(Math.random() * eligible.length)];
      return action === 'catch' ? resolveCatchAuto() : resolveAction(action);
    };

    const spinBtn = createButton(this, 400, 120 + pool.length * 55 + 20, 'Spin (random x2)', () => {
      lockButtons();
      const lines = [resolveOneRandom(), resolveOneRandom()];
      showResultThenContinue(lines);
    });
    buttons.push(spinBtn);
  }
}
