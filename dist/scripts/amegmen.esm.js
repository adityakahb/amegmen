var __defProp = Object.defineProperty;
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __publicField = (obj, key, value) => __defNormalProp(obj, typeof key !== "symbol" ? key + "" : key, value);
/*! AMegMen v2.0.0 ESM build — import { AMegMen } from "amegmen" | Apache-2.0 */
const Key = {
  Down: "ArrowDown",
  End: "End",
  Enter: "Enter",
  Escape: "Escape",
  Home: "Home",
  Left: "ArrowLeft",
  Right: "ArrowRight",
  Space: " ",
  Tab: "Tab",
  Up: "ArrowUp"
};
function isVisible(el) {
  let current = el;
  while (current && current !== document.documentElement) {
    try {
      const style = window.getComputedStyle(current);
      if (style.display === "none" || style.visibility === "hidden") return false;
    } catch {
    }
    current = current.parentElement;
  }
  return true;
}
function isFocusable(el) {
  if (!(el instanceof HTMLElement)) return false;
  const tag = el.tagName.toLowerCase();
  if (["input", "select", "textarea", "button"].includes(tag)) {
    return !el.disabled && isVisible(el);
  }
  if (tag === "a") {
    const hasHref = el.getAttribute("href") !== null;
    const hasExplicitTabindex = el.getAttribute("tabindex") !== null;
    return (hasHref || hasExplicitTabindex) && isVisible(el);
  }
  if (tag === "area") {
    const map = el.closest("map");
    if (!(map == null ? void 0 : map.name)) return false;
    const img = document.querySelector(`img[usemap="#${map.name}"]`);
    return !!img && isVisible(img);
  }
  return el.getAttribute("tabindex") !== null && isVisible(el);
}
function isTabbable(el) {
  if (!(el instanceof HTMLElement)) return false;
  if (!isFocusable(el)) return false;
  const rawTi = el.getAttribute("tabindex");
  if (rawTi === null) return true;
  const ti = parseInt(rawTi, 10);
  return !Number.isNaN(ti) && ti >= 0;
}
function getTabbable(container) {
  return Array.from(
    container.querySelectorAll(
      "a[href], button, input, select, textarea, [tabindex], area[href]"
    )
  ).filter((el) => isTabbable(el));
}
function closestEl(el, selector) {
  return (el == null ? void 0 : el.closest(selector)) ?? null;
}
let _counter = 0;
function generateId(prefix) {
  return `${prefix}-${Date.now()}-${++_counter}`;
}
function ensureId(el, prefix) {
  if (!el.id) {
    el.id = generateId(prefix);
  }
  return el.id;
}
const PLUGIN_STORE = /* @__PURE__ */ new WeakMap();
const _AMegMen = class _AMegMen {
  constructor(element, options = {}) {
    // `!` assertions: these are always assigned before use. The constructor
    // may return an existing instance (double-init guard) so TypeScript can't
    // prove assignment for the new `this` — but it will never be used unset.
    __publicField(this, "element");
    __publicField(this, "settings");
    __publicField(this, "menu");
    __publicField(this, "topnavitems");
    __publicField(this, "panels", []);
    __publicField(this, "navHeadings", []);
    __publicField(this, "toggleButton", null);
    __publicField(this, "liveRegion", null);
    __publicField(this, "backdropEl", null);
    __publicField(this, "wrapperEl", null);
    __publicField(this, "mediaQuery", null);
    // Timers
    __publicField(this, "mouseTimeoutId", null);
    __publicField(this, "focusTimeoutId", null);
    __publicField(this, "keydownTimeoutId", null);
    __publicField(this, "panelOpenTimeoutId", null);
    __publicField(this, "keydownSearchString", "");
    // Interaction state flags
    __publicField(this, "mouseFocused", false);
    __publicField(this, "justFocused", false);
    // Lifecycle controllers
    __publicField(this, "mainAbort", null);
    __publicField(this, "outerAbort", null);
    __publicField(this, "trapFocusAbort", null);
    __publicField(this, "panelObservers", []);
    // ─── Event handlers (arrow functions for stable `this` binding) ─────────────
    /** Cancels any pending close timer, applies `focusClass`, and switches panels on keyboard focus change. */
    __publicField(this, "onFocusIn", (event) => {
      if (this.focusTimeoutId !== null) {
        clearTimeout(this.focusTimeoutId);
        this.focusTimeoutId = null;
      }
      const target = event.target;
      const panel = closestEl(target, `.${this.settings.panelClass}`);
      target.classList.add(this.settings.focusClass);
      this.justFocused = !this.mouseFocused;
      this.mouseFocused = false;
      const otherOpenPanel = this.panels.find(
        (p) => p !== panel && p.classList.contains(this.settings.openClass)
      );
      if (this.justFocused && otherOpenPanel) {
        this.togglePanel(event);
      }
    });
    /** Removes `focusClass` and starts the `focusOutDelay` timer to close the open panel. */
    __publicField(this, "onFocusOut", (event) => {
      this.justFocused = false;
      event.target.classList.remove(this.settings.focusClass);
      this.focusTimeoutId = setTimeout(() => {
        if (this.mouseFocused && event.relatedTarget === null) return;
        this.togglePanel(event, true);
      }, this.settings.focusOutDelay);
    });
    /** Main keyboard handler — routes Arrow/Home/End/Tab/Escape/Enter/Space and type-ahead. */
    __publicField(this, "onKeyDown", (event) => {
      var _a, _b, _c, _d, _e, _f, _g, _h, _i, _j, _k, _l, _m, _n, _o, _p, _q;
      const { settings } = this;
      const target = event.target;
      if (target.matches(
        'input:not([type="button"]):not([type="submit"]):not([type="reset"]), select, textarea'
      )) {
        return;
      }
      const menu = this.menu;
      const topnavitems = this.topnavitems;
      const tabbables = getTabbable(menu);
      const topli = closestEl(target, `.${settings.topNavItemClass}`);
      const panel = target.classList.contains(settings.panelClass) ? target : closestEl(target, `.${settings.panelClass}`);
      const panelGroups = panel ? Array.from(panel.querySelectorAll(`.${settings.panelGroupClass}`)) : [];
      const currentPanelGroup = closestEl(target, `.${settings.panelGroupClass}`);
      const isTopNavItem = !!topli && !panel;
      switch (event.key) {
        case Key.Escape: {
          this.mouseFocused = false;
          const hadOpenPanel = !!this.menu.querySelector(
            `.${settings.panelClass}.${settings.openClass}`
          );
          this.togglePanel(event, true);
          if (!hadOpenPanel && this.element.classList.contains("amegmen-offcanvas-open")) {
            this.closeOffcanvas();
            setTimeout(() => {
              var _a2;
              return (_a2 = this.toggleButton) == null ? void 0 : _a2.focus();
            }, 0);
          }
          break;
        }
        case Key.Down: {
          event.preventDefault();
          this.mouseFocused = false;
          if (isTopNavItem) {
            this.togglePanel(event);
            const openPanel = topli.querySelector(`.${settings.panelClass}`);
            if (openPanel) (_a = getTabbable(openPanel)[0]) == null ? void 0 : _a.focus();
          } else {
            const idx = tabbables.indexOf(target);
            (_b = tabbables[idx + 1]) == null ? void 0 : _b.focus();
          }
          break;
        }
        case Key.Up: {
          event.preventDefault();
          this.mouseFocused = false;
          if (isTopNavItem && target.classList.contains(settings.openClass)) {
            this.togglePanel(event, true);
            const topliIdx = topnavitems.indexOf(topli);
            const prev = topnavitems[topliIdx - 1];
            if (prev) this.openAndFocusLast(prev);
          } else if (!isTopNavItem) {
            const idx = tabbables.indexOf(target);
            if (idx > 0) (_c = tabbables[idx - 1]) == null ? void 0 : _c.focus();
          }
          break;
        }
        case Key.Right: {
          event.preventDefault();
          this.mouseFocused = false;
          if (isTopNavItem) {
            const topliIdx = topnavitems.indexOf(topli);
            const next = topnavitems[topliIdx + 1];
            if (next) (_d = getTabbable(next)[0]) == null ? void 0 : _d.focus();
          } else {
            if (panelGroups.length && currentPanelGroup) {
              const groupIdx = panelGroups.indexOf(currentPanelGroup);
              const nextGroup = panelGroups[groupIdx + 1];
              if (nextGroup) {
                (_e = getTabbable(nextGroup)[0]) == null ? void 0 : _e.focus();
                break;
              }
            }
            if (topli) (_f = getTabbable(topli)[0]) == null ? void 0 : _f.focus();
          }
          break;
        }
        case Key.Left: {
          event.preventDefault();
          this.mouseFocused = false;
          if (isTopNavItem) {
            const topliIdx = topnavitems.indexOf(topli);
            const prev = topnavitems[topliIdx - 1];
            if (prev) (_g = getTabbable(prev)[0]) == null ? void 0 : _g.focus();
          } else {
            if (panelGroups.length && currentPanelGroup) {
              const groupIdx = panelGroups.indexOf(currentPanelGroup);
              const prevGroup = panelGroups[groupIdx - 1];
              if (prevGroup) {
                (_h = getTabbable(prevGroup)[0]) == null ? void 0 : _h.focus();
                break;
              }
            }
            if (topli) (_i = getTabbable(topli)[0]) == null ? void 0 : _i.focus();
          }
          break;
        }
        case Key.Home: {
          event.preventDefault();
          this.mouseFocused = false;
          if (isTopNavItem) {
            const first = topnavitems[0];
            if (first) (_j = getTabbable(first)[0]) == null ? void 0 : _j.focus();
          } else if (currentPanelGroup) {
            (_k = getTabbable(currentPanelGroup)[0]) == null ? void 0 : _k.focus();
          } else if (panel) {
            (_l = getTabbable(panel)[0]) == null ? void 0 : _l.focus();
          }
          break;
        }
        case Key.End: {
          event.preventDefault();
          this.mouseFocused = false;
          if (isTopNavItem) {
            const last = topnavitems.at(-1);
            if (last) (_m = getTabbable(last)[0]) == null ? void 0 : _m.focus();
          } else if (currentPanelGroup) {
            (_n = getTabbable(currentPanelGroup).at(-1)) == null ? void 0 : _n.focus();
          } else if (panel) {
            (_o = getTabbable(panel).at(-1)) == null ? void 0 : _o.focus();
          }
          break;
        }
        case Key.Tab: {
          this.mouseFocused = false;
          const i = tabbables.indexOf(target);
          let found = false;
          if (event.shiftKey && isTopNavItem && target.classList.contains(settings.openClass)) {
            this.togglePanel(event, true);
            const topliIdx = topnavitems.indexOf(topli);
            const prev = topnavitems[topliIdx - 1];
            if (prev) {
              const prevPanel = prev.querySelector(`.${settings.panelClass}`);
              if (prevPanel) {
                this.openAndFocusLast(prev);
                found = true;
              }
            }
          } else if (event.shiftKey && i > 0) {
            (_p = tabbables[i - 1]) == null ? void 0 : _p.focus();
            found = true;
          } else if (!event.shiftKey && i < tabbables.length - 1) {
            (_q = tabbables[i + 1]) == null ? void 0 : _q.focus();
            found = true;
          }
          if (found) event.preventDefault();
          break;
        }
        case Key.Space:
        case Key.Enter:
          if (isTopNavItem) {
            if (target.getAttribute("aria-haspopup") === "true") {
              event.preventDefault();
              if (target.classList.contains(settings.openClass)) {
                this.mouseFocused = false;
                this.togglePanel(event, true);
              } else {
                this.handleMenuClick(event);
              }
            } else if (event.key === Key.Enter) {
              this.handleMenuClick(event);
            }
          }
          break;
        default: {
          if (event.key.length !== 1 || event.ctrlKey || event.metaKey || event.altKey) break;
          if (this.keydownTimeoutId !== null) clearTimeout(this.keydownTimeoutId);
          this.keydownSearchString += event.key;
          this.keydownTimeoutId = setTimeout(() => {
            this.keydownSearchString = "";
          }, this.settings.typeAheadTimeout);
          let searchSet;
          if (isTopNavItem && !target.classList.contains(settings.openClass)) {
            searchSet = tabbables.filter((el) => !closestEl(el, `.${settings.panelClass}`));
          } else if (topli) {
            searchSet = getTabbable(topli);
          } else {
            searchSet = tabbables;
          }
          if (event.shiftKey) searchSet = [...searchSet].reverse();
          const escaped = this.keydownSearchString.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
          const regex = new RegExp(`^${escaped}`, "i");
          const startIdx = this.keydownSearchString.length === 1 ? searchSet.indexOf(target) + 1 : searchSet.indexOf(target);
          const ordered = [...searchSet.slice(startIdx), ...searchSet.slice(0, startIdx)];
          const match = ordered.find((el) => {
            return regex.test((el.textContent ?? "").trim());
          });
          match == null ? void 0 : match.focus();
          break;
        }
      }
      this.justFocused = false;
    });
    /** Sets `mouseFocused` on pointer press and clears any pending `focusTimeoutId` after 1 ms. */
    __publicField(this, "onPointerDown", (event) => {
      const el = event.target;
      if (closestEl(el, `.${this.settings.panelClass}`) || isFocusable(el)) {
        this.mouseFocused = true;
      }
      if (this.mouseTimeoutId !== null) clearTimeout(this.mouseTimeoutId);
      this.mouseTimeoutId = setTimeout(() => {
        if (this.focusTimeoutId !== null) {
          clearTimeout(this.focusTimeoutId);
          this.focusTimeoutId = null;
        }
      }, 1);
    });
    /** Opens the hovered item's panel after `openDelay` ms (`openOnMouseover` mode, desktop only). */
    __publicField(this, "onPointerOver", (event) => {
      if (!this.settings.openOnMouseover) return;
      if (!this.element.classList.contains("amegmen-desktop")) return;
      if (this.mouseTimeoutId !== null) clearTimeout(this.mouseTimeoutId);
      const target = event.target;
      this.mouseTimeoutId = setTimeout(() => {
        target.classList.add(this.settings.hoverClass);
        this.togglePanel(event);
      }, this.settings.openDelay);
    });
    /** Schedules panel close after `closeDelay` ms when the pointer leaves (`openOnMouseover` mode, desktop only). */
    __publicField(this, "onPointerOut", (event) => {
      if (!this.settings.openOnMouseover) return;
      if (!this.element.classList.contains("amegmen-desktop")) return;
      if (this.mouseTimeoutId !== null) clearTimeout(this.mouseTimeoutId);
      event.target.classList.remove(this.settings.hoverClass);
      this.mouseTimeoutId = setTimeout(() => {
        this.togglePanel(event, true);
      }, this.settings.closeDelay);
    });
    /** Routes menu list click events through `handleMenuClick`. */
    __publicField(this, "onClickMenu", (event) => {
      this.handleMenuClick(event);
    });
    /** Closes all open panels when a `pointerup` fires outside the menu (`closeOnOutsideClick`). */
    __publicField(this, "onPointerUpOutside", (event) => {
      if (!this.menu.contains(event.target)) {
        event.preventDefault();
        event.stopPropagation();
        this.togglePanel(event, true);
      }
    });
    /** Toggles the mobile offcanvas drawer open/closed when the toggle button is clicked. */
    __publicField(this, "onToggleClick", () => {
      const btn = this.toggleButton;
      if (!btn) return;
      const isExpanded = btn.getAttribute("aria-expanded") === "true";
      const next = !isExpanded;
      btn.setAttribute("aria-expanded", String(next));
      this.menu.classList.toggle(this.settings.openClass, next);
      this.element.classList.toggle("amegmen-offcanvas-open", next);
      this.forceCloseAllPanels();
      if (next) {
        if (this.settings.trapFocus && !this.element.classList.contains("amegmen-desktop")) {
          this.attachTrapFocus();
        }
      } else {
        this.detachTrapFocus();
      }
    });
    /** Cycles Tab/Shift+Tab focus within the open offcanvas container. */
    __publicField(this, "onTrapFocusKeyDown", (event) => {
      if (event.key !== Key.Tab) return;
      if (!this.element.classList.contains("amegmen-offcanvas-open")) return;
      if (this.element.classList.contains("amegmen-desktop")) return;
      const container = this.wrapperEl ?? this.element;
      const focusable = getTabbable(container);
      if (!focusable.length) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (!first || !last) return;
      const active = document.activeElement;
      if (event.shiftKey) {
        if (active === first || !container.contains(active)) {
          event.preventDefault();
          last.focus();
        }
      } else {
        if (active === last || !container.contains(active)) {
          event.preventDefault();
          first.focus();
        }
      }
    });
    __publicField(this, "onMediaChange", () => {
      var _a, _b;
      const isDesktop = ((_a = this.mediaQuery) == null ? void 0 : _a.matches) ?? false;
      this.element.classList.toggle("amegmen-desktop", isDesktop);
      (_b = this.wrapperEl) == null ? void 0 : _b.classList.toggle("amegmen-desktop", isDesktop);
      if (isDesktop) {
        this.closeOffcanvas();
      } else {
        this.forceCloseAllPanels();
      }
    });
    /** Closes the offcanvas drawer when the backdrop overlay is clicked. */
    __publicField(this, "onBackdropClick", () => {
      this.closeOffcanvas();
    });
    const existing = PLUGIN_STORE.get(element);
    if (existing) return existing;
    this.element = element;
    this.settings = { ..._AMegMen.defaults, ...options };
    PLUGIN_STORE.set(element, this);
    this.init();
  }
  // ─── Public API ────────────────────────────────────────────────────────────
  /** Returns the library version string (e.g. `"2.0.0"`). */
  static getVersion() {
    return _AMegMen.version;
  }
  /** Returns the static default options object shared by all instances. */
  getDefaults() {
    return _AMegMen.defaults;
  }
  /** Returns the current value of the given option key. */
  getOption(key) {
    return this.settings[key];
  }
  /** Returns a shallow copy of all current option values. */
  getAllOptions() {
    return { ...this.settings };
  }
  /**
   * Updates a single option value.
   * @param reinitialize - When `true`, re-runs `init()` so the change takes effect immediately.
   */
  setOption(key, value, reinitialize = false) {
    this.settings[key] = value;
    if (reinitialize) this.init();
  }
  /**
   * Opens the mobile offcanvas navigation drawer programmatically — equivalent
   * to the user clicking the toggle button when the drawer is closed.
   * No-op if the drawer is already open.
   */
  openMenu() {
    var _a;
    if (this.menu.classList.contains(this.settings.openClass)) return;
    (_a = this.toggleButton) == null ? void 0 : _a.setAttribute("aria-expanded", "true");
    this.menu.classList.add(this.settings.openClass);
    this.element.classList.add("amegmen-offcanvas-open");
    this.forceCloseAllPanels();
    if (this.settings.trapFocus && !this.element.classList.contains("amegmen-desktop")) {
      this.attachTrapFocus();
    }
  }
  /**
   * Closes the mobile offcanvas navigation drawer programmatically — equivalent
   * to the user clicking the toggle button when the drawer is open.
   * No-op if the drawer is already closed.
   */
  closeMenu() {
    if (!this.menu.classList.contains(this.settings.openClass)) return;
    this.closeOffcanvas();
  }
  /**
   * Opens the panel for the top-level item at the given zero-based index.
   * Closes any currently open panel first. Honors `onBeforeOpen` if set.
   * No-op if the index is out of range or the item has no panel.
   */
  openPanelAt(index) {
    const topli = this.topnavitems[index];
    if (!topli) return;
    const panel = topli.querySelector(`.${this.settings.panelClass}`);
    if (!panel) return;
    const trigger = topli.querySelector('[aria-haspopup="true"]') ?? null;
    this.forceCloseAllPanels();
    const applyOpen = () => {
      const { settings } = this;
      topli.querySelectorAll("[aria-expanded]").forEach((el) => {
        el.setAttribute("aria-expanded", "true");
        el.classList.add(settings.openClass);
      });
      panel.classList.add(settings.openClass);
      panel.setAttribute("aria-hidden", "false");
      this.slideDown(panel);
      const panelTopAbs = topli.getBoundingClientRect().top + window.scrollY;
      const scrollTarget = panelTopAbs - settings.stickyOffset;
      if (window.scrollY > scrollTarget) {
        window.scrollTo({ top: scrollTarget, behavior: settings.scrollBehavior });
      }
      if (this.liveRegion) {
        const labelId = panel.getAttribute("aria-labelledby") ?? "";
        const labelEl = labelId ? document.getElementById(labelId) : null;
        const labelText = labelEl == null ? void 0 : labelEl.textContent;
        const label = panel.getAttribute("aria-label") ?? (labelText ? labelText.trim() : null) ?? "submenu";
        this.liveRegion.textContent = `${label} expanded`;
      }
      panel.dispatchEvent(
        new CustomEvent("amegmenopen", {
          bubbles: true,
          composed: true,
          detail: { panel, trigger }
        })
      );
      if (settings.onOpen && trigger) {
        settings.onOpen(panel, trigger);
      }
      this.attachOuterHandlers();
    };
    if (this.settings.onBeforeOpen && trigger) {
      this.settings.onBeforeOpen(panel, trigger, applyOpen);
    } else {
      applyOpen();
    }
  }
  /**
   * Closes all open panels immediately. Fires `amegmenclose` events and the
   * `onClose` callback. Equivalent to programmatically dismissing the menu.
   */
  closePanels() {
    this.forceCloseAllPanels();
  }
  /**
   * Animates an element from `display:none` to its natural height, like
   * jQuery's `$.slideDown()`. No-op if the element is already visible.
   * Skips the animation when `prefers-reduced-motion: reduce` is active.
   *
   * Respects per-element `data-amegmen-open-duration` override and the
   * `maxPanelHeight` option.
   */
  slideDown(el) {
    if (getComputedStyle(el).display !== "none") return;
    const duration = el.dataset.amegmenOpenDuration !== void 0 ? Number(el.dataset.amegmenOpenDuration) : this.settings.panelOpenDuration;
    const maxH = this.settings.maxPanelHeight;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      el.style.display = "block";
      if (maxH > 0) {
        el.style.maxHeight = `${maxH}px`;
        el.style.overflowY = "auto";
      }
      return;
    }
    el.style.display = "block";
    el.style.overflow = "hidden";
    el.style.height = "0px";
    void el.offsetHeight;
    const natural = el.scrollHeight;
    const target = maxH > 0 ? Math.min(natural, maxH) : natural;
    const capped = maxH > 0 && natural > maxH;
    el.style.transition = `height ${duration}ms ${this.settings.animationEasing}`;
    el.style.height = `${target}px`;
    el.addEventListener(
      "transitionend",
      () => {
        if (capped) {
          el.style.overflowY = "auto";
          el.style.overflow = "";
        } else {
          el.style.height = "auto";
          el.style.overflow = "";
        }
        el.style.transition = "";
      },
      { once: true }
    );
  }
  /**
   * Animates an element from its current height down to zero then sets
   * `display:none`, like jQuery's `$.slideUp()`. No-op if already hidden.
   * Skips the animation when `prefers-reduced-motion: reduce` is active.
   *
   * Respects per-element `data-amegmen-close-duration` override.
   */
  slideUp(el) {
    if (getComputedStyle(el).display === "none") return;
    const duration = el.dataset.amegmenCloseDuration !== void 0 ? Number(el.dataset.amegmenCloseDuration) : this.settings.panelCloseDuration;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      el.style.display = "none";
      el.style.maxHeight = "";
      el.style.overflowY = "";
      return;
    }
    el.style.height = `${el.offsetHeight}px`;
    el.style.overflow = "hidden";
    void el.offsetHeight;
    el.style.transition = `height ${duration}ms ${this.settings.animationEasing}`;
    el.style.height = "0px";
    el.addEventListener(
      "transitionend",
      () => {
        el.style.display = "none";
        el.style.height = "";
        el.style.overflow = "";
        el.style.transition = "";
        el.style.maxHeight = "";
        el.style.overflowY = "";
      },
      { once: true }
    );
  }
  /**
   * Slides the element down if it is hidden, or up if it is visible — like
   * jQuery's `$.slideToggle()`.
   */
  slideToggle(el) {
    if (getComputedStyle(el).display === "none") {
      this.slideDown(el);
    } else {
      this.slideUp(el);
    }
  }
  /**
   * Tears down the instance: removes all event listeners, reverts ARIA attributes,
   * and removes injected DOM elements (live region, backdrop, `<h2>` nav wrappers).
   * After calling this the element can be safely re-initialised with `new AMegMen(el)`.
   */
  destroy() {
    var _a, _b, _c, _d;
    this.menu.classList.remove(this.settings.menuClass, `js-${this.settings.menuClass}`);
    this.removeEventHandlers();
    this.detachTrapFocus();
    if (this.panelOpenTimeoutId !== null) {
      clearTimeout(this.panelOpenTimeoutId);
      this.panelOpenTimeoutId = null;
    }
    (_a = this.mediaQuery) == null ? void 0 : _a.removeEventListener("change", this.onMediaChange);
    this.mediaQuery = null;
    this.element.classList.remove("amegmen-desktop", "amegmen-offcanvas-open");
    (_b = this.wrapperEl) == null ? void 0 : _b.classList.remove("amegmen-desktop");
    this.wrapperEl = null;
    this.element.removeAttribute("data-amegmen-offcanvas-dir");
    this.element.removeAttribute("data-amegmen-nav-align");
    this.element.style.removeProperty("--amegmen-sticky-offset");
    (_c = this.liveRegion) == null ? void 0 : _c.remove();
    this.liveRegion = null;
    (_d = this.backdropEl) == null ? void 0 : _d.remove();
    this.backdropEl = null;
    this.navHeadings.forEach((h2) => {
      const link = h2.firstElementChild;
      if (link && h2.parentElement) {
        h2.parentElement.insertBefore(link, h2);
      }
      h2.remove();
    });
    this.navHeadings = [];
    PLUGIN_STORE.delete(this.element);
  }
  // ─── Initialization ────────────────────────────────────────────────────────
  /**
   * Wires ARIA, event listeners, and responsive behaviour. Safe to call
   * multiple times (e.g. after `setOption(…, reinitialize: true)`); existing
   * DOM mutations (e.g. `<h2>` wrappers) are detected and skipped.
   */
  init() {
    const { settings, element } = this;
    const menu = element.querySelector(":scope > ol, :scope > ul");
    if (!menu) throw new Error("AMegMen: no <ul>/<ol> found as a direct child.");
    this.menu = menu;
    this.topnavitems = Array.from(menu.children);
    const parentEl = element.parentElement;
    this.wrapperEl = (parentEl == null ? void 0 : parentEl.classList.contains("amegmen-wrapper")) ? parentEl : null;
    const toggleSearchRoot = this.wrapperEl ?? element;
    this.toggleButton = toggleSearchRoot.querySelector(`button.${settings.toggleButtonClass}`) ?? toggleSearchRoot.querySelector("button") ?? null;
    if (settings.navigationLabel) {
      element.setAttribute("aria-label", settings.navigationLabel);
    }
    ensureId(menu, settings.uuidPrefix);
    menu.classList.add(settings.menuClass, `js-${settings.menuClass}`);
    this.topnavitems.forEach((item) => {
      item.classList.add(settings.topNavItemClass);
      this.setupTopNavItem(item);
    });
    this.panels = Array.from(menu.querySelectorAll(`.${settings.panelClass}`));
    menu.querySelectorAll("hr").forEach((hr) => {
      hr.setAttribute("role", "separator");
    });
    if (this.toggleButton) {
      const btn = this.toggleButton;
      btn.classList.add(settings.toggleButtonClass);
      btn.setAttribute("aria-expanded", "false");
      btn.setAttribute("aria-controls", menu.id);
      if (!btn.getAttribute("aria-label") && !(btn.textContent ?? "").trim()) {
        btn.setAttribute("aria-label", "Toggle navigation");
      }
    }
    if (settings.announceOpen && !this.liveRegion) {
      this.liveRegion = document.createElement("div");
      this.liveRegion.setAttribute("aria-live", "polite");
      this.liveRegion.setAttribute("aria-atomic", "true");
      this.liveRegion.className = "amegmen-sr-only";
      element.appendChild(this.liveRegion);
    }
    element.setAttribute("data-amegmen-offcanvas-dir", settings.offcanvasDirection);
    element.setAttribute("data-amegmen-nav-align", settings.navAlignment);
    if (settings.stickyOffset > 0) {
      element.style.setProperty("--amegmen-sticky-offset", `${settings.stickyOffset}px`);
    } else {
      element.style.removeProperty("--amegmen-sticky-offset");
    }
    if (!this.backdropEl) {
      const bd = document.createElement("div");
      bd.className = "amegmen-backdrop";
      bd.setAttribute("aria-hidden", "true");
      element.insertBefore(bd, element.firstChild);
      this.backdropEl = bd;
    }
    this.addEventHandlers();
    this.setupResponsive();
    const active = document.activeElement;
    if (active && element.contains(active) && active !== element) {
      active.dispatchEvent(new FocusEvent("focusin", { bubbles: true, relatedTarget: null }));
    }
  }
  /**
   * Detects which markup pattern is in use for each top-level item, wraps the
   * nav label in an `<h2>` for heading hierarchy, and wires ARIA attributes:
   *
   *  1. `<a>` + `<div.panel>`              — link-as-trigger (backwards-compat)
   *  2. `<a>` + `<button>` + `<div.panel>` — separate disclosure button
   *  3. `<button>` + `<div.panel>`         — button-only trigger (no nav link)
   *  4. No panel child                      — plain link/button; only `<h2>` wrap runs
   *
   * On re-init (via `setOption(…, true)`) elements already inside an `<h2>` are
   * found through the wrapper and the wrapping step is skipped.
   */
  setupTopNavItem(item) {
    var _a;
    const { settings } = this;
    const directChildren = Array.from(item.children);
    const panel = directChildren.find((el) => el.classList.contains(settings.panelClass));
    const h2Wrapper = directChildren.find((el) => el.tagName === "H2");
    const aChild = directChildren.find((el) => el.tagName === "A") ?? (h2Wrapper == null ? void 0 : h2Wrapper.querySelector("a")) ?? void 0;
    const buttonChild = directChildren.find(
      (el) => el.tagName === "BUTTON" && el !== panel
    ) ?? (h2Wrapper == null ? void 0 : h2Wrapper.querySelector("button")) ?? void 0;
    const wrapTarget = aChild ?? buttonChild;
    if (wrapTarget && ((_a = wrapTarget.parentElement) == null ? void 0 : _a.tagName) !== "H2") {
      const h2 = document.createElement("h2");
      item.insertBefore(h2, wrapTarget);
      h2.appendChild(wrapTarget);
      this.navHeadings.push(h2);
    }
    if (!panel) return;
    const trigger = buttonChild ?? aChild ?? null;
    if (!trigger) return;
    ensureId(trigger, settings.uuidPrefix);
    ensureId(panel, settings.uuidPrefix);
    if (trigger.tagName === "A") {
      trigger.setAttribute("role", "button");
    }
    trigger.setAttribute("aria-controls", panel.id);
    trigger.setAttribute("aria-expanded", "false");
    trigger.setAttribute("aria-haspopup", "true");
    if (trigger.tabIndex < 0) trigger.tabIndex = 0;
    panel.setAttribute("role", "region");
    panel.setAttribute("aria-hidden", "true");
    if (!panel.getAttribute("aria-labelledby")) {
      panel.setAttribute("aria-labelledby", trigger.id);
    }
  }
  // ─── Event management ──────────────────────────────────────────────────────
  /** Registers all menu-level listeners using an `AbortController` signal. */
  addEventHandlers() {
    var _a, _b;
    this.removeEventHandlers();
    this.mainAbort = new AbortController();
    const { signal } = this.mainAbort;
    const menu = this.menu;
    menu.addEventListener("focusin", this.onFocusIn, { signal });
    menu.addEventListener("focusout", this.onFocusOut, { signal });
    menu.addEventListener("keydown", this.onKeyDown, { signal });
    menu.addEventListener("pointerover", this.onPointerOver, { signal });
    menu.addEventListener("pointerout", this.onPointerOut, { signal });
    menu.addEventListener("pointerdown", this.onPointerDown, { signal });
    menu.addEventListener("click", this.onClickMenu, { signal });
    (_a = this.toggleButton) == null ? void 0 : _a.addEventListener("click", this.onToggleClick, { signal });
    (_b = this.backdropEl) == null ? void 0 : _b.addEventListener("click", this.onBackdropClick, { signal });
  }
  /** Aborts all menu-level listeners and tears down outer (document-level) handlers. */
  removeEventHandlers() {
    var _a;
    (_a = this.mainAbort) == null ? void 0 : _a.abort();
    this.mainAbort = null;
    this.detachOuterHandlers();
  }
  /** Attaches document-level click-outside handler and MutationObserver for
   *  Windows Narrator aria-expanded changes (replaces DOMAttrModified). */
  attachOuterHandlers() {
    this.detachOuterHandlers();
    this.outerAbort = new AbortController();
    if (this.settings.closeOnOutsideClick) {
      document.addEventListener("pointerup", this.onPointerUpOutside, {
        signal: this.outerAbort.signal
      });
    }
    const openPanels = this.menu.querySelectorAll(
      `[aria-expanded="true"].${this.settings.panelClass}`
    );
    openPanels.forEach((panel) => {
      const obs = new MutationObserver((mutations) => {
        for (const m of mutations) {
          if (m.attributeName === "aria-expanded" && m.target.getAttribute("aria-expanded") === "false" && m.target.classList.contains(this.settings.openClass)) {
            this.togglePanel(new Event("mutation"), true);
          }
        }
      });
      obs.observe(panel, { attributes: true, attributeFilter: ["aria-expanded"] });
      this.panelObservers.push(obs);
    });
  }
  /** Aborts the document-level `pointerup` listener and disconnects all `MutationObserver` instances. */
  detachOuterHandlers() {
    var _a;
    (_a = this.outerAbort) == null ? void 0 : _a.abort();
    this.outerAbort = null;
    this.panelObservers.forEach((obs) => {
      obs.disconnect();
    });
    this.panelObservers = [];
  }
  /** Attaches a document-level Tab trap that cycles focus within the offcanvas container. */
  attachTrapFocus() {
    this.detachTrapFocus();
    this.trapFocusAbort = new AbortController();
    document.addEventListener("keydown", this.onTrapFocusKeyDown, {
      signal: this.trapFocusAbort.signal
    });
  }
  /** Removes the Tab trap listener. */
  detachTrapFocus() {
    var _a;
    (_a = this.trapFocusAbort) == null ? void 0 : _a.abort();
    this.trapFocusAbort = null;
  }
  // ─── Panel toggle ──────────────────────────────────────────────────────────
  /**
   * @param event  The triggering event; used for type and relatedTarget checks.
   * @param hide   If true, close all open panels. If false/omitted, open the panel
   *               associated with event.target's top-level item.
   */
  togglePanel(event, hide = false) {
    this.detachOuterHandlers();
    if (hide) {
      this.closeAllPanels(event);
    } else {
      this.openPanel(event);
    }
  }
  /**
   * Closes all open panels. Skips closing if focus is still inside the same
   * top-level item (e.g. during an internal focus shift), and returns focus
   * to the trigger when triggered by `Escape`.
   */
  closeAllPanels(event) {
    const { settings, menu } = this;
    const openTrigger = menu.querySelector('[aria-expanded="true"]');
    if (!openTrigger) return;
    const topli = closestEl(openTrigger, `.${settings.topNavItemClass}`);
    if (!topli) return;
    const related = event.relatedTarget;
    if (related instanceof Element && topli.contains(related)) return;
    if ((event.type === "focusout" || event.type === "pointerout") && topli.contains(document.activeElement)) {
      return;
    }
    topli.querySelectorAll(`.${settings.panelClass}.${settings.openClass}`).forEach((panel) => {
      panel.dispatchEvent(
        new CustomEvent("amegmenclose", {
          bubbles: true,
          composed: true,
          detail: { panel, trigger: openTrigger }
        })
      );
      if (settings.onClose) {
        settings.onClose(panel, openTrigger);
      }
    });
    topli.querySelectorAll("[aria-expanded]").forEach((el) => {
      el.setAttribute("aria-expanded", "false");
      el.classList.remove(settings.openClass);
    });
    topli.querySelectorAll(`.${settings.panelClass}`).forEach((panel) => {
      panel.classList.remove(settings.openClass);
      panel.setAttribute("aria-hidden", "true");
      this.slideUp(panel);
    });
    if (event.type === "keydown" && event.key === Key.Escape) {
      const trigger = topli.querySelector("[aria-expanded]");
      if (trigger) {
        setTimeout(() => {
          trigger.focus();
          this.justFocused = false;
        }, 0);
      }
    }
    if (this.liveRegion) this.liveRegion.textContent = "";
  }
  /**
   * Opens the panel belonging to the top-level item that contains `event.target`.
   * Closes any other currently-open panel first and scrolls the item into view
   * if it is above the current scroll position.
   */
  openPanel(event) {
    const { settings, menu } = this;
    if (this.focusTimeoutId !== null) {
      clearTimeout(this.focusTimeoutId);
      this.focusTimeoutId = null;
    }
    if (this.panelOpenTimeoutId !== null) {
      clearTimeout(this.panelOpenTimeoutId);
      this.panelOpenTimeoutId = null;
    }
    const target = event.target;
    const topli = closestEl(target, `.${settings.topNavItemClass}`);
    if (!topli) return;
    const trigger = topli.querySelector('[aria-haspopup="true"]') ?? null;
    const newPanel = topli.querySelector(`.${settings.panelClass}`) ?? null;
    const openTrigger = menu.querySelector('[aria-expanded="true"]');
    const openTopli = openTrigger ? closestEl(openTrigger, `.${settings.topNavItemClass}`) : null;
    const hasPrev = openTopli !== null && openTopli !== topli;
    if (hasPrev) {
      openTopli.querySelectorAll(`.${settings.panelClass}.${settings.openClass}`).forEach((p) => {
        const prevTrigger = openTopli.querySelector('[aria-haspopup="true"]') ?? null;
        p.dispatchEvent(
          new CustomEvent("amegmenclose", {
            bubbles: true,
            composed: true,
            detail: { panel: p, trigger: prevTrigger }
          })
        );
        if (settings.onClose && prevTrigger) {
          settings.onClose(p, prevTrigger);
        }
      });
      openTopli.querySelectorAll("[aria-expanded]").forEach((el) => {
        el.setAttribute("aria-expanded", "false");
        el.classList.remove(settings.openClass);
      });
      openTopli.querySelectorAll(`.${settings.panelClass}`).forEach((p) => {
        p.classList.remove(settings.openClass);
        p.setAttribute("aria-hidden", "true");
        this.slideUp(p);
      });
    }
    const applyOpen = () => {
      topli.querySelectorAll("[aria-expanded]").forEach((el) => {
        el.setAttribute("aria-expanded", "true");
        el.classList.add(settings.openClass);
      });
      if (newPanel) {
        newPanel.classList.add(settings.openClass);
        newPanel.setAttribute("aria-hidden", "false");
        this.slideDown(newPanel);
        const panelTopAbs = topli.getBoundingClientRect().top + window.scrollY;
        const scrollTarget = panelTopAbs - settings.stickyOffset;
        if (window.scrollY > scrollTarget) {
          window.scrollTo({ top: scrollTarget, behavior: settings.scrollBehavior });
        }
        if (this.liveRegion) {
          const labelId = newPanel.getAttribute("aria-labelledby") ?? "";
          const labelEl = labelId ? document.getElementById(labelId) : null;
          const rawText = labelEl == null ? void 0 : labelEl.textContent;
          const label = newPanel.getAttribute("aria-label") ?? (rawText ? rawText.trim() : null) ?? "submenu";
          this.liveRegion.textContent = `${label} expanded`;
        }
        newPanel.dispatchEvent(
          new CustomEvent("amegmenopen", {
            bubbles: true,
            composed: true,
            detail: { panel: newPanel, trigger }
          })
        );
        if (settings.onOpen && trigger) {
          settings.onOpen(newPanel, trigger);
        }
      }
      if (event.type === "pointerover" && target instanceof HTMLElement && isTabbable(target) && !newPanel && menu.contains(document.activeElement)) {
        target.focus();
        this.justFocused = false;
      }
      this.panelOpenTimeoutId = null;
      this.attachOuterHandlers();
    };
    const runApply = () => {
      if (settings.onBeforeOpen && newPanel && trigger) {
        settings.onBeforeOpen(newPanel, trigger, applyOpen);
      } else {
        applyOpen();
      }
    };
    if (hasPrev) {
      this.panelOpenTimeoutId = setTimeout(
        runApply,
        settings.panelCloseDuration + settings.panelSwitchGap
      );
    } else {
      runApply();
    }
  }
  // ─── Helpers ────────────────────────────────────────────────────────────────
  /**
   * Shared click/keyboard handler for top-level items. Toggles panels for
   * disclosure triggers (`aria-haspopup="true"`); navigates the `href` for
   * plain links when activated by keyboard Enter.
   */
  handleMenuClick(event) {
    const { settings } = this;
    const rawTarget = event.target;
    const target = rawTarget instanceof HTMLElement && isTabbable(rawTarget) ? rawTarget : closestEl(rawTarget, "a, button") ?? null;
    if (!target) return;
    const topli = closestEl(target, `.${settings.topNavItemClass}`);
    const panel = closestEl(target, `.${settings.panelClass}`);
    if (topli && !panel && topli.querySelector(`.${settings.panelClass}`) && target.getAttribute("aria-haspopup") === "true") {
      const isOpen = target.classList.contains(settings.openClass);
      if (!isOpen) {
        event.preventDefault();
        event.stopPropagation();
        this.togglePanel(event);
        this.justFocused = false;
      } else if (this.justFocused) {
        event.preventDefault();
        event.stopPropagation();
        this.justFocused = false;
      } else {
        const isTouch = event instanceof PointerEvent && event.pointerType === "touch";
        if (isTouch || !this.settings.openOnMouseover) {
          event.preventDefault();
          event.stopPropagation();
          this.togglePanel(event, true);
        }
      }
    } else if (topli && !panel && event.type === "keydown" && target instanceof HTMLAnchorElement && target.href && target.protocol !== "javascript:") {
      window.location.href = target.href;
    }
  }
  /**
   * Creates a `matchMedia` listener for the `desktopBreakpoint` and applies the
   * `amegmen-desktop` class immediately; also fires on every breakpoint crossing.
   */
  setupResponsive() {
    var _a;
    if (typeof window === "undefined") return;
    (_a = this.mediaQuery) == null ? void 0 : _a.removeEventListener("change", this.onMediaChange);
    this.mediaQuery = window.matchMedia(`(min-width: ${this.settings.desktopBreakpoint}px)`);
    this.onMediaChange();
    this.mediaQuery.addEventListener("change", this.onMediaChange);
  }
  closeOffcanvas() {
    var _a;
    this.forceCloseAllPanels();
    this.menu.classList.remove(this.settings.openClass);
    this.element.classList.remove("amegmen-offcanvas-open");
    (_a = this.toggleButton) == null ? void 0 : _a.setAttribute("aria-expanded", "false");
    this.detachTrapFocus();
  }
  forceCloseAllPanels(announce = true) {
    const { settings, menu } = this;
    if (this.panelOpenTimeoutId !== null) {
      clearTimeout(this.panelOpenTimeoutId);
      this.panelOpenTimeoutId = null;
    }
    if (announce) {
      menu.querySelectorAll(`.${settings.panelClass}.${settings.openClass}`).forEach((panel) => {
        const topli = closestEl(panel, `.${settings.topNavItemClass}`);
        const trigger = (topli == null ? void 0 : topli.querySelector('[aria-haspopup="true"]')) ?? null;
        panel.dispatchEvent(
          new CustomEvent("amegmenclose", {
            bubbles: true,
            composed: true,
            detail: { panel, trigger }
          })
        );
        if (settings.onClose && trigger) {
          settings.onClose(panel, trigger);
        }
      });
    }
    menu.querySelectorAll("[aria-expanded]").forEach((el) => {
      el.setAttribute("aria-expanded", "false");
      el.classList.remove(settings.openClass);
    });
    menu.querySelectorAll(`.${settings.panelClass}`).forEach((panel) => {
      panel.classList.remove(settings.openClass);
      panel.setAttribute("aria-hidden", "true");
      panel.style.transition = "";
      panel.style.height = "";
      panel.style.overflow = "";
      panel.style.display = "";
      panel.style.maxHeight = "";
      panel.style.overflowY = "";
    });
    this.detachOuterHandlers();
    if (this.liveRegion) this.liveRegion.textContent = "";
  }
  /**
   * Opens the panel for `topli` and moves focus to its last tabbable element.
   * Used by `ArrowUp` and `Shift+Tab` to navigate backwards across top-level items.
   */
  openAndFocusLast(topli) {
    var _a;
    const { settings } = this;
    const prevPanel = topli.querySelector(`.${settings.panelClass}`);
    if (prevPanel) {
      const prevTrigger = topli.querySelector('[aria-haspopup="true"]') ?? null;
      topli.querySelectorAll("[aria-expanded]").forEach((el) => {
        el.setAttribute("aria-expanded", "true");
        el.classList.add(settings.openClass);
      });
      prevPanel.classList.add(settings.openClass);
      prevPanel.setAttribute("aria-hidden", "false");
      this.slideDown(prevPanel);
      prevPanel.dispatchEvent(
        new CustomEvent("amegmenopen", {
          bubbles: true,
          composed: true,
          detail: { panel: prevPanel, trigger: prevTrigger }
        })
      );
      if (settings.onOpen && prevTrigger) {
        settings.onOpen(prevPanel, prevTrigger);
      }
      (_a = getTabbable(prevPanel).at(-1)) == null ? void 0 : _a.focus();
      this.attachOuterHandlers();
    }
  }
};
/** Library version, sourced from `package.json` at build time. */
__publicField(_AMegMen, "version", "2.0.0");
__publicField(_AMegMen, "defaults", {
  uuidPrefix: "amegmen",
  menuClass: "amegmen",
  topNavItemClass: "amegmen-top-nav-item",
  panelClass: "amegmen-panel",
  panelGroupClass: "amegmen-panel-group",
  hoverClass: "amegmen-hover",
  focusClass: "amegmen-focus",
  openClass: "amegmen-open",
  toggleButtonClass: "amegmen-toggle",
  openDelay: 0,
  closeDelay: 250,
  openOnMouseover: false,
  navigationLabel: "Main navigation",
  announceOpen: false,
  offcanvasDirection: "right",
  desktopBreakpoint: 1280,
  navAlignment: "left",
  panelOpenDuration: 250,
  panelCloseDuration: 250,
  panelSwitchGap: 0,
  focusOutDelay: 300,
  typeAheadTimeout: 1e3,
  scrollBehavior: "smooth",
  closeOnOutsideClick: true,
  animationEasing: "ease-out",
  onOpen: null,
  onClose: null,
  onBeforeOpen: null,
  trapFocus: false,
  stickyOffset: 0,
  maxPanelHeight: 0
});
let AMegMen = _AMegMen;
function parseDataOptions(el) {
  const opts = {};
  for (const attr of Array.from(el.attributes)) {
    if (!attr.name.startsWith("data-amegmen-")) continue;
    const key = attr.name.slice("data-amegmen-".length).replace(/-([a-z])/g, (_, c) => c.toUpperCase());
    if (!(key in AMegMen.defaults)) continue;
    const raw = attr.value;
    if (raw === "true") opts[key] = true;
    else if (raw === "false") opts[key] = false;
    else if (raw !== "" && !Number.isNaN(Number(raw))) opts[key] = Number(raw);
    else opts[key] = raw;
  }
  return opts;
}
function autoInit(selector = "[data-amegmen]", options = {}) {
  return Array.from(document.querySelectorAll(selector)).map(
    (el) => new AMegMen(el, { ...parseDataOptions(el), ...options })
  );
}
if (typeof document !== "undefined") {
  const run = () => {
    document.querySelectorAll("[data-amegmen]").forEach((el) => {
      new AMegMen(el, parseDataOptions(el));
    });
  };
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", run, { once: true });
  } else {
    run();
  }
}
export {
  AMegMen,
  autoInit
};
//# sourceMappingURL=amegmen.esm.js.map
