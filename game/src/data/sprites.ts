import Phaser from 'phaser';
import { getSpecies } from './species';

const BASE_URL = '/sprites/pokemon';
const BACK_BASE_URL = '/sprites/pokemon-back';

export function spriteUrl(dexNumber: number): string {
  return `${BASE_URL}/${dexNumber}.png`;
}

export function spriteKey(name: string): string {
  return `sprite-${name}`;
}

export function backSpriteUrl(dexNumber: number): string {
  return `${BACK_BASE_URL}/${dexNumber}.png`;
}

export function backSpriteKey(name: string): string {
  return `sprite-back-${name}`;
}

function ensureSprites(
  scene: Phaser.Scene,
  speciesNames: string[],
  keyFn: (name: string) => string,
  urlFn: (dexNumber: number) => string,
  onReady: () => void,
): void {
  const toLoad = speciesNames.filter((name) => !scene.textures.exists(keyFn(name)));

  if (toLoad.length === 0) {
    onReady();
    return;
  }

  toLoad.forEach((name) => {
    const dexNumber = getSpecies(name).dexNumber;
    scene.load.image(keyFn(name), urlFn(dexNumber));
  });

  scene.load.once(Phaser.Loader.Events.COMPLETE, onReady);
  scene.load.start();
}

export function ensureSpeciesSprites(scene: Phaser.Scene, speciesNames: string[], onReady: () => void): void {
  ensureSprites(scene, speciesNames, spriteKey, spriteUrl, onReady);
}

export function ensureBackSpeciesSprites(scene: Phaser.Scene, speciesNames: string[], onReady: () => void): void {
  ensureSprites(scene, speciesNames, backSpriteKey, backSpriteUrl, onReady);
}
