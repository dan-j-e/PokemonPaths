import Phaser from 'phaser';
import { getSpecies } from './species';

const BASE_URL = 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon';

export function spriteUrl(dexNumber: number): string {
  return `${BASE_URL}/${dexNumber}.png`;
}

export function spriteKey(name: string): string {
  return `sprite-${name}`;
}

export function ensureSpeciesSprites(scene: Phaser.Scene, speciesNames: string[], onReady: () => void): void {
  const toLoad = speciesNames.filter((name) => !scene.textures.exists(spriteKey(name)));

  if (toLoad.length === 0) {
    onReady();
    return;
  }

  toLoad.forEach((name) => {
    const dexNumber = getSpecies(name).dexNumber;
    scene.load.image(spriteKey(name), spriteUrl(dexNumber));
  });

  scene.load.once(Phaser.Loader.Events.COMPLETE, onReady);
  scene.load.start();
}
