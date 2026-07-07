export type ItemType = 'xAttack' | 'potion' | 'revive';

export const ITEM_LABELS: Record<ItemType, string> = {
  xAttack: 'X-Attack',
  potion: 'Potion',
  revive: 'Revive',
};

export const XATTACK_BOOST = 5;

/** Chance a "find item" resolution finds the permanent EXP Share instead, rather than a stackable item. */
export const EXP_SHARE_FIND_CHANCE = 0.1;

const FIND_WEIGHTS: Record<ItemType, number> = {
  xAttack: 60,
  potion: 30,
  revive: 10,
};

export function emptyInventory(): Record<ItemType, number> {
  return { xAttack: 0, potion: 0, revive: 0 };
}

export function pickRandomItem(): ItemType {
  const entries = Object.entries(FIND_WEIGHTS) as [ItemType, number][];
  const total = entries.reduce((sum, [, w]) => sum + w, 0);
  let roll = Math.random() * total;
  for (const [item, weight] of entries) {
    roll -= weight;
    if (roll <= 0) return item;
  }
  return entries[entries.length - 1][0];
}
