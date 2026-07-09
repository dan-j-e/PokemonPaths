import Phaser from 'phaser';
import { StarterSelectScene } from './scenes/StarterSelectScene';
import { OverworldScene } from './scenes/OverworldScene';
import { ActionScene } from './scenes/ActionScene';
import { TeamManagementScene } from './scenes/TeamManagementScene';
import { BattleScene } from './scenes/BattleScene';
import { GameOverScene } from './scenes/GameOverScene';
import { VictoryScene } from './scenes/VictoryScene';

const GAME_WIDTH = 800;
const GAME_HEIGHT = 600;
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

// The canvas backing store below is rendered at DPR-multiplied pixel dimensions (so it has enough
// real pixels for a HiDPI screen — otherwise the browser has to upscale the whole canvas bitmap,
// blurring Graphics/Sprites too, not just text) while every scene still authors at the original
// logical 800x600 coordinate space via a matching camera zoom, applied here (not per scene) via a
// plain subclass wrapper — no Phaser internals touched, just normal JS inheritance.
type SceneWithCreate = Phaser.Scene & { create(...args: unknown[]): void };

function withHiDPI<T extends new (...args: any[]) => SceneWithCreate>(SceneClass: T): T {
  return class extends SceneClass {
    create(...args: unknown[]) {
      this.cameras.main.setZoom(DPR);
      super.create(...args);
    }
  };
}

new Phaser.Game({
  type: Phaser.AUTO,
  width: Math.round(GAME_WIDTH * DPR),
  height: Math.round(GAME_HEIGHT * DPR),
  backgroundColor: '#f6f4fb',
  pixelArt: true,
  parent: document.body,
  scene: [
    withHiDPI(StarterSelectScene),
    withHiDPI(OverworldScene),
    withHiDPI(ActionScene),
    withHiDPI(TeamManagementScene),
    withHiDPI(BattleScene),
    withHiDPI(GameOverScene),
    withHiDPI(VictoryScene),
  ],
});
