/* eslint-disable @typescript-eslint/no-unnecessary-condition -- runtime polyfill guards */
/* eslint-disable @typescript-eslint/no-empty-function -- polyfill stubs need empty methods */

// Polyfill PointerEvent for jsdom
if (typeof window !== 'undefined' && !window.PointerEvent) {
  class PointerEvent extends MouseEvent {
    pointerType: string;
    constructor(type: string, init: PointerEventInit = {}) {
      super(type, init);
      this.pointerType = init.pointerType ?? 'mouse';
    }
  }
  // @ts-expect-error -- patching jsdom which lacks PointerEvent
  window.PointerEvent = PointerEvent;
}

// Polyfill window.matchMedia for jsdom (not implemented by default)
if (typeof window !== 'undefined' && !window.matchMedia) {
  window.matchMedia = (query: string): MediaQueryList => {
    const listeners: ((e: MediaQueryListEvent) => void)[] = [];
    const mql: MediaQueryList = {
      matches: false,
      media: query,
      onchange: null,
      addEventListener(_type: string, listener: EventListenerOrEventListenerObject) {
        if (typeof listener === 'function') listeners.push(listener);
      },
      removeEventListener(_type: string, listener: EventListenerOrEventListenerObject) {
        const idx = listeners.indexOf(listener as (e: MediaQueryListEvent) => void);
        if (idx !== -1) listeners.splice(idx, 1);
      },
      dispatchEvent: () => false,
      addListener: () => {},
      removeListener: () => {},
    };
    return mql;
  };
}

// Polyfill AbortController if needed (jsdom usually has it)
if (typeof window !== 'undefined' && !window.AbortController) {
  // @ts-expect-error -- patching jsdom which may lack AbortController
  window.AbortController = class {
    signal = { aborted: false, addEventListener: () => {} };
    abort() {
      this.signal.aborted = true;
    }
  };
}
