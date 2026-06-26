let _counter = 0;

/**
 * Generates a unique string id using a prefix, the current timestamp, and a
 * monotonically-incrementing counter. Collisions within the same millisecond
 * are prevented by the counter.
 */
export function generateId(prefix: string): string {
  return `${prefix}-${Date.now()}-${++_counter}`;
}

/** Ensures the element has an id, generating one if absent. Returns the id. */
export function ensureId(el: HTMLElement, prefix: string): string {
  if (!el.id) {
    el.id = generateId(prefix);
  }
  return el.id;
}
