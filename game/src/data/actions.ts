import type { ActionType } from './types';

export const ACTION_LABELS: Record<ActionType, string> = {
  heal: 'Use X-Attack',
  catch: 'Search for a wild Pokemon',
  item: 'Look for an item',
  interact: 'Interact',
};

export const DEFAULT_ACTION_POOL: ActionType[] = ['heal', 'catch', 'item', 'interact'];
