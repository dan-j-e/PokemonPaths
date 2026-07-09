import type { ActionType } from './types';

export const ACTION_LABELS: Record<ActionType, string> = {
  catch: 'Search for a wild Pokemon',
  item: 'Look for an item',
  interact: 'Interact',
};

export const DEFAULT_ACTION_POOL: ActionType[] = ['catch', 'item', 'interact'];
