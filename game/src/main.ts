import Phaser from 'phaser';
import { StarterSelectScene } from './scenes/StarterSelectScene';
import { OverworldScene } from './scenes/OverworldScene';
import { ActionScene } from './scenes/ActionScene';
import { TeamManagementScene } from './scenes/TeamManagementScene';
import { BattleScene } from './scenes/BattleScene';
import { GameOverScene } from './scenes/GameOverScene';
import { VictoryScene } from './scenes/VictoryScene';

const DPR = window.devicePixelRatio || 1;

// Phaser 3.60+ dropped the old global `resolution` game-config option; every Text object now
// renders to its internal canvas at resolution 1 regardless of the display's real pixel density
// (see Phaser's Text.js), which reads as soft/blurry on HiDPI (Retina) screens. There's no
// supported config hook to set a game-wide default anymore, so patch the `add.text` factory once
// here — every scene's `this.add.text(...)` picks up the display's actual pixel ratio for free.
const originalTextFactory = Phaser.GameObjects.GameObjectFactory.prototype.text;
Phaser.GameObjects.GameObjectFactory.prototype.text = function (x, y, text, style) {
  return originalTextFactory.call(this, x, y, text, { resolution: DPR, ...style });
};

new Phaser.Game({
  type: Phaser.AUTO,
  width: 800,
  height: 600,
  backgroundColor: '#f6f4fb',
  // Smooth/anti-aliased sprite scaling instead of blocky nearest-neighbor pixel-art scaling —
  // the small team/opponent icons (26-28px, downscaled from a 96px source) looked noisy under
  // nearest-neighbor, which only looks good when upscaling, not downscaling this much.
  antialias: true,
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
