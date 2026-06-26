import { describe, it, expect, beforeEach, vi } from 'vitest';
import { isFocusable, isTabbable, getTabbable, closestEl } from '../src/ts/utils/dom';

describe('DOM utilities', () => {
  let container: HTMLElement;

  beforeEach(() => {
    container = document.createElement('div');
    document.body.appendChild(container);
  });

  afterEach(() => {
    container.remove();
  });

  // ── isFocusable ──────────────────────────────────────────────────────────

  it('link with href is focusable', () => {
    const a = document.createElement('a');
    a.href = '#test';
    container.appendChild(a);
    expect(isFocusable(a)).toBe(true);
  });

  it('link without href and without tabindex is not focusable', () => {
    const a = document.createElement('a');
    container.appendChild(a);
    expect(isFocusable(a)).toBe(false);
  });

  it('button is focusable', () => {
    const btn = document.createElement('button');
    container.appendChild(btn);
    expect(isFocusable(btn)).toBe(true);
  });

  it('disabled button is not focusable', () => {
    const btn = document.createElement('button');
    btn.disabled = true;
    container.appendChild(btn);
    expect(isFocusable(btn)).toBe(false);
  });

  it('input is focusable', () => {
    const input = document.createElement('input');
    container.appendChild(input);
    expect(isFocusable(input)).toBe(true);
  });

  it('disabled input is not focusable', () => {
    const input = document.createElement('input');
    input.disabled = true;
    container.appendChild(input);
    expect(isFocusable(input)).toBe(false);
  });

  it('div with tabindex="0" is focusable', () => {
    const div = document.createElement('div');
    div.tabIndex = 0;
    container.appendChild(div);
    expect(isFocusable(div)).toBe(true);
  });

  it('plain div is not focusable', () => {
    const div = document.createElement('div');
    container.appendChild(div);
    expect(isFocusable(div)).toBe(false);
  });

  // ── isTabbable ───────────────────────────────────────────────────────────

  it('link with href is tabbable', () => {
    const a = document.createElement('a');
    a.href = '#test';
    container.appendChild(a);
    expect(isTabbable(a)).toBe(true);
  });

  it('element with tabindex="-1" is focusable but not tabbable', () => {
    const div = document.createElement('div');
    div.tabIndex = -1;
    container.appendChild(div);
    expect(isFocusable(div)).toBe(true);
    expect(isTabbable(div)).toBe(false);
  });

  // ── getTabbable ──────────────────────────────────────────────────────────

  it('returns all tabbable descendants in DOM order', () => {
    container.innerHTML = `
      <a href="#a">A</a>
      <button>B</button>
      <span tabindex="0">C</span>
      <div tabindex="-1">D</div>
    `;
    const result = getTabbable(container);
    expect(result).toHaveLength(3);
    expect(result[0]?.tagName).toBe('A');
    expect(result[1]?.tagName).toBe('BUTTON');
    expect(result[2]?.tagName).toBe('SPAN');
  });

  it('skips disabled form elements', () => {
    container.innerHTML = `
      <button>Enabled</button>
      <button disabled>Disabled</button>
      <input type="text" />
      <input type="text" disabled />
    `;
    const result = getTabbable(container);
    expect(result).toHaveLength(2);
  });

  it('excludes elements with display:none', () => {
    container.innerHTML = `
      <button>Visible</button>
      <button style="display:none">Hidden</button>
    `;
    expect(getTabbable(container)).toHaveLength(1);
  });

  // ── isFocusable: additional element types ────────────────────────────────

  it('select is focusable', () => {
    const el = document.createElement('select');
    container.appendChild(el);
    expect(isFocusable(el)).toBe(true);
  });

  it('textarea is focusable', () => {
    const el = document.createElement('textarea');
    container.appendChild(el);
    expect(isFocusable(el)).toBe(true);
  });

  it('link with no href but explicit tabindex="0" is focusable', () => {
    const a = document.createElement('a');
    a.setAttribute('tabindex', '0');
    container.appendChild(a);
    expect(isFocusable(a)).toBe(true);
  });

  it('button with display:none is not focusable', () => {
    const btn = document.createElement('button');
    btn.style.display = 'none';
    container.appendChild(btn);
    expect(isFocusable(btn)).toBe(false);
  });

  it('button with visibility:hidden is not focusable', () => {
    const btn = document.createElement('button');
    btn.style.visibility = 'hidden';
    container.appendChild(btn);
    expect(isFocusable(btn)).toBe(false);
  });

  // ── isTabbable: additional cases ─────────────────────────────────────────

  it('div with tabindex="0" is tabbable', () => {
    const div = document.createElement('div');
    div.tabIndex = 0;
    container.appendChild(div);
    expect(isTabbable(div)).toBe(true);
  });

  it('select and textarea are tabbable', () => {
    const select = document.createElement('select');
    const textarea = document.createElement('textarea');
    container.append(select, textarea);
    expect(isTabbable(select)).toBe(true);
    expect(isTabbable(textarea)).toBe(true);
  });

  // ── isFocusable: area element ────────────────────────────────────────────

  it('area with href is focusable when a matching usemap image exists', () => {
    const map = document.createElement('map');
    map.name = 'testmap';
    const area = document.createElement('area');
    area.href = '#section';
    map.appendChild(area);

    const img = document.createElement('img');
    img.setAttribute('usemap', '#testmap');
    container.append(map, img);

    expect(isFocusable(area)).toBe(true);
  });

  it('area element is not focusable when no matching image exists in the DOM', () => {
    const map = document.createElement('map');
    map.name = 'orphan';
    const area = document.createElement('area');
    area.href = '#section';
    map.appendChild(area);
    container.appendChild(map);

    expect(isFocusable(area)).toBe(false);
  });

  // ── closestEl ────────────────────────────────────────────────────────────

  describe('closestEl', () => {
    it('returns the element itself when it matches the selector', () => {
      const div = document.createElement('div');
      div.className = 'target';
      container.appendChild(div);
      expect(closestEl(div, '.target')).toBe(div);
    });

    it('returns the nearest ancestor matching the selector', () => {
      container.innerHTML = '<div class="outer"><span class="inner"></span></div>';
      const inner = container.querySelector('.inner')!;
      const outer = container.querySelector('.outer')!;
      expect(closestEl(inner, '.outer')).toBe(outer);
    });

    it('returns null when no ancestor matches', () => {
      const div = document.createElement('div');
      container.appendChild(div);
      expect(closestEl(div, '.nonexistent')).toBeNull();
    });

    it('returns null for null input', () => {
      expect(closestEl(null, '.anything')).toBeNull();
    });
  });

  // ── isVisible catch fallback ─────────────────────────────────────────────
  // Covers the catch block inside isVisible that handles non-browser environments
  // where getComputedStyle throws (dom.ts:12-13).

  describe('isVisible catch fallback', () => {
    it('isFocusable returns true when getComputedStyle throws', () => {
      const a = document.createElement('a');
      a.href = '#test';
      container.appendChild(a);

      const spy = vi.spyOn(window, 'getComputedStyle').mockImplementation(() => {
        throw new Error('no style');
      });
      try {
        expect(isFocusable(a)).toBe(true);
      } finally {
        spy.mockRestore();
      }
    });
  });
});
