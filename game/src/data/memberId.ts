let counter = 0;

/** Unique per-mon identity, assigned once at creation (starter pick or catch) and carried through
 * evolution — lets battle/lead logic distinguish individuals of the same species (e.g. two
 * Geodudes), rather than conflating them by species name. */
export function nextMemberId(): string {
  return `mon-${counter++}`;
}
