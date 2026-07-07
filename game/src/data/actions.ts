import type { ActionType } from './types';

export const ACTION_LABELS: Record<ActionType, string> = {
  heal: 'Heal your team',
  catch: 'Search for a wild Pokemon',
  item: 'Look for an item',
  lore: 'Talk to a local',
};

export const ACTION_FLAVOR: Record<ActionType, string> = {
  heal: 'Your team feels refreshed!',
  catch: 'You caught a wild Pokemon!',
  item: 'You found an item!',
  lore: 'You hear a story about the region...',
};

export const DEFAULT_ACTION_POOL: ActionType[] = ['heal', 'catch', 'item', 'lore'];
