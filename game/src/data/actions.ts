import type { ActionType } from './types';

export const ACTION_LABELS: Record<ActionType, string> = {
  heal: 'Use X-Attack',
  catch: 'Search for a wild Pokemon',
  item: 'Look for an item',
  lore: 'Talk to a local',
};

// Only 'lore' stays pure flavor — catch/item/heal are resolved dynamically in ActionScene.
export const ACTION_FLAVOR: Partial<Record<ActionType, string>> = {
  lore: 'You hear a story about the region...',
};

export const DEFAULT_ACTION_POOL: ActionType[] = ['heal', 'catch', 'item', 'lore'];
