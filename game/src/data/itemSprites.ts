import Phaser from 'phaser';
import type { ItemType } from './items';

const BASE_URL = `${import.meta.env.BASE_URL}sprites/items`;

// PokeAPI's item sprite filenames — bundled locally (see sprites.ts for the same pattern with Pokemon).
const ITEM_SPRITE_NAMES: Record<ItemType, string> = {
  xAttack: 'x-attack',
  potion: 'potion',
  revive: 'revive',
};

export function itemSpriteUrl(item: ItemType): string {
  return `${BASE_URL}/${ITEM_SPRITE_NAMES[item]}.png`;
}

export function itemSpriteKey(item: ItemType): string {
  return `item-sprite-${item}`;
}

const ALL_ITEMS: ItemType[] = ['xAttack', 'potion', 'revive'];

export function ensureItemSprites(scene: Phaser.Scene, onReady: () => void): void {
  const toLoad = ALL_ITEMS.filter((item) => !scene.textures.exists(itemSpriteKey(item)));

  if (toLoad.length === 0) {
    onReady();
    return;
  }

  toLoad.forEach((item) => {
    scene.load.image(itemSpriteKey(item), itemSpriteUrl(item));
  });

  scene.load.once(Phaser.Loader.Events.COMPLETE, onReady);
  scene.load.start();
}
