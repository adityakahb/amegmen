import { describe, it, expect, beforeEach } from 'vitest';
import { generateId, ensureId } from '../src/ts/utils/uid';

describe('generateId', () => {
  it('returns a string starting with the given prefix', () => {
    const id = generateId('test');
    expect(id).toMatch(/^test-/);
  });

  it('includes the prefix as the first segment', () => {
    const id = generateId('menu');
    expect(id.startsWith('menu-')).toBe(true);
  });

  it('returns a string (not a number or object)', () => {
    expect(typeof generateId('x')).toBe('string');
  });

  it('returns unique values across multiple calls', () => {
    const ids = Array.from({ length: 10 }, () => generateId('uid'));
    const unique = new Set(ids);
    expect(unique.size).toBe(10);
  });

  it('returns unique values even when called with the same prefix', () => {
    const a = generateId('prefix');
    const b = generateId('prefix');
    expect(a).not.toBe(b);
  });

  it('works with an empty string prefix', () => {
    const id = generateId('');
    expect(typeof id).toBe('string');
    expect(id.length).toBeGreaterThan(0);
  });
});

describe('ensureId', () => {
  let el: HTMLElement;

  beforeEach(() => {
    el = document.createElement('div');
  });

  it('assigns a generated id when the element has no id', () => {
    expect(el.id).toBe('');
    ensureId(el, 'nav');
    expect(el.id).not.toBe('');
  });

  it('assigns an id that starts with the given prefix', () => {
    ensureId(el, 'nav');
    expect(el.id).toMatch(/^nav-/);
  });

  it('returns the newly assigned id', () => {
    const result = ensureId(el, 'panel');
    expect(result).toBe(el.id);
  });

  it('preserves an existing id and does not overwrite it', () => {
    el.id = 'my-existing-id';
    ensureId(el, 'should-not-use');
    expect(el.id).toBe('my-existing-id');
  });

  it('returns the existing id when one is already set', () => {
    el.id = 'already-set';
    const result = ensureId(el, 'prefix');
    expect(result).toBe('already-set');
  });

  it('returns the element id in both the assigned and existing cases', () => {
    // Case 1: no id — returns the generated id
    const noId = document.createElement('span');
    const returned1 = ensureId(noId, 'x');
    expect(returned1).toBe(noId.id);

    // Case 2: existing id — returns the existing id
    const withId = document.createElement('span');
    withId.id = 'fixed-id';
    const returned2 = ensureId(withId, 'x');
    expect(returned2).toBe('fixed-id');
    expect(returned2).toBe(withId.id);
  });

  it('generates unique ids for different elements without ids', () => {
    const el2 = document.createElement('div');
    ensureId(el, 'comp');
    ensureId(el2, 'comp');
    expect(el.id).not.toBe(el2.id);
  });
});
