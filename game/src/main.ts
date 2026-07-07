import Phaser from 'phaser';
import { StarterSelectScene } from './scenes/StarterSelectScene';
import { OverworldScene } from './scenes/OverworldScene';
import { ActionScene } from './scenes/ActionScene';
import { TeamManagementScene } from './scenes/TeamManagementScene';
import { BattleScene } from './scenes/BattleScene';
import { GameOverScene } from './scenes/GameOverScene';
import { VictoryScene } from './scenes/VictoryScene';

new Phaser.Game({
  type: Phaser.AUTO,
  width: 800,
  height: 600,
  backgroundColor: '#1d2b53',
  parent: document.body,
  scene: [
    StarterSelectScene,
    OverworldScene,
    ActionScene,
    TeamManagementScene,
    BattleScene,
    GameOverScene,
    VictoryScene,
  ],
});
