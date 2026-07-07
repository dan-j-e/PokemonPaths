import Phaser from 'phaser';
import { SEGMENTS } from '../data/segments';
import { ACTION_LABELS, ACTION_FLAVOR } from '../data/actions';
import { ENCOUNTER_TABLES, pickWeightedSpecies } from '../data/encounters';
import { getSpecies, catchChance } from '../data/species';
import { themeFor } from '../data/locationThemes';
import { createButton } from '../ui/button';
import type { RunState } from '../data/types';

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
      .text(400, 40, segment.name, {
        fontFamily: 'monospace',
        fontSize: '20px',
        color: '#ffffff',
        align: 'center',
        wordWrap: { width: 700 },
      })
      .setOrigin(0.5);

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
      const btn = createButton(this, 400, 110 + i * 55, ACTION_LABELS[action], () => {
        lockButtons();
        if (action === 'catch') {
          runManualCatch();
        } else {
          showResultThenContinue([ACTION_FLAVOR[action]]);
        }
      });
      buttons.push(btn);
    });

    const spinBtn = createButton(this, 400, 110 + pool.length * 55 + 20, 'Spin (random x2)', () => {
      lockButtons();
      const shuffled = [...pool].sort(() => Math.random() - 0.5);
      const picked = shuffled.slice(0, 2);
      const lines = picked.map((a) => (a === 'catch' ? resolveCatchAuto() : ACTION_FLAVOR[a]));
      showResultThenContinue(lines);
    });
    buttons.push(spinBtn);
  }
}
