/**
 * Walks up the element tree checking for CSS visibility.
 * Returns false if any ancestor has display:none or visibility:hidden.
 */
function isVisible(el: Element): boolean {
  let current: Element | null = el;
  while (current && current !== document.documentElement) {
    try {
      const style = window.getComputedStyle(current);
      if (style.display === 'none' || style.visibility === 'hidden') return false;
    } catch {
      // Non-browser environment — assume visible
    }
    current = current.parentElement;
  }
  return true;
}

/**
 * Returns true if the element can receive focus (including tabindex="-1" which
 * is focusable programmatically but not in the tab order).
 * Uses getAttribute('tabindex') — not the DOM tabIndex property — so the check
 * reflects only explicit author intent rather than browser-computed defaults.
 */
export function isFocusable(el: Element): boolean {
  if (!(el instanceof HTMLElement)) return false;
  const tag = el.tagName.toLowerCase();

  if (['input', 'select', 'textarea', 'button'].includes(tag)) {
    return !(el as HTMLInputElement).disabled && isVisible(el);
  }
  if (tag === 'a') {
    const hasHref = (el as HTMLAnchorElement).getAttribute('href') !== null;
    const hasExplicitTabindex = el.getAttribute('tabindex') !== null;
    return (hasHref || hasExplicitTabindex) && isVisible(el);
  }
  if (tag === 'area') {
    const map = el.closest('map');
    if (!map?.name) return false;
    const img = document.querySelector<HTMLImageElement>(`img[usemap="#${map.name}"]`);
    return !!img && isVisible(img);
  }
  // Other elements: focusable only when an explicit tabindex attribute is present
  return el.getAttribute('tabindex') !== null && isVisible(el);
}

/**
 * Returns true if the element is in the natural tab order.
 * An element with tabindex="-1" is focusable but NOT tabbable.
 */
export function isTabbable(el: Element): boolean {
  if (!(el instanceof HTMLElement)) return false;
  if (!isFocusable(el)) return false;
  const rawTi = el.getAttribute('tabindex');
  // No explicit tabindex → native tabbable element (button, a[href], input, etc.)
  if (rawTi === null) return true;
  const ti = parseInt(rawTi, 10);
  return !Number.isNaN(ti) && ti >= 0;
}

/** Returns all tabbable descendants of container, in DOM order. */
export function getTabbable(container: Element): HTMLElement[] {
  return Array.from(
    container.querySelectorAll<HTMLElement>(
      'a[href], button, input, select, textarea, [tabindex], area[href]'
    )
  ).filter((el) => isTabbable(el));
}

/** Returns the closest ancestor (or self) matching selector. */
export function closestEl(el: Element | null, selector: string): HTMLElement | null {
  return el?.closest<HTMLElement>(selector) ?? null;
}
