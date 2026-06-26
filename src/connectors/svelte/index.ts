/**
 * @fileoverview Svelte connector for AMegMen.
 *
 * Provides a Svelte action (`megamenu`) that manages the AMegMen instance
 * lifecycle. Actions are the idiomatic Svelte pattern for imperative DOM
 * manipulation — they receive the node on mount, can react to parameter
 * changes, and clean up on unmount.
 *
 * @packageDocumentation
 *
 * @example Basic usage
 * ```svelte
 * <script lang="ts">
 *   import { megamenu } from 'amegmen/connectors/svelte';
 * </script>
 *
 * <nav use:megamenu aria-label="Primary navigation">
 *   <ul><!-- … --></ul>
 * </nav>
 * ```
 *
 * @example With options
 * ```svelte
 * <script lang="ts">
 *   import { megamenu } from 'amegmen/connectors/svelte';
 *   import type { MegaMenuOptions } from 'amegmen';
 *
 *   let navOptions: Partial<MegaMenuOptions> = { openOnMouseover: true };
 * </script>
 *
 * <!-- Reactive: when navOptions changes, setOption is called for each diff -->
 * <nav use:megamenu={navOptions} aria-label="Primary navigation">
 *   <ul><!-- … --></ul>
 * </nav>
 * ```
 *
 * @example Accessing the instance
 * ```svelte
 * <script lang="ts">
 *   import { megamenu, type MegaMenuAction } from 'amegmen/connectors/svelte';
 *   import type { AMegMen } from 'amegmen';
 *
 *   let menu: AMegMen | null = null;
 *
 *   function handleAction(action: MegaMenuAction) {
 *     menu = action.instance;
 *   }
 * </script>
 *
 * <nav use:megamenu on:amegmenmount={handleAction}>…</nav>
 * ```
 *
 * @remarks
 * Install the peer dependency separately:
 * ```
 * npm install svelte
 * ```
 * The action itself has no Svelte import — it uses standard DOM APIs so it
 * can be used in non-Svelte contexts too (plain JS / Web Components).
 */

import { AMegMen } from '../../ts/amegmen';
import type { MegaMenuOptions } from '../../ts/types';

// ─── Action types ─────────────────────────────────────────────────────────────

/**
 * Object returned by the `megamenu` action. Provides access to the live
 * AMegMen instance and a typed `update` / `destroy` lifecycle interface that
 * Svelte calls automatically.
 */
export interface MegaMenuAction {
  /** The live AMegMen instance. Available immediately after action mount. */
  instance: AMegMen;
  /**
   * Called by Svelte when the action's parameter changes.
   * Diffs the new and old options and calls `setOption` for each changed key.
   */
  update: (newOptions?: Partial<MegaMenuOptions>) => void;
  /** Called by Svelte when the element is removed from the DOM. */
  destroy: () => void;
}

// ─── Svelte action ────────────────────────────────────────────────────────────

/**
 * Svelte action that attaches AMegMen to a `<nav>` (or any HTMLElement).
 *
 * Lifecycle:
 *  - **Mount**   — creates an `AMegMen` instance with the provided options.
 *  - **Update**  — diffs new vs. old options, calls `setOption` for each change.
 *  - **Destroy** — calls `instance.destroy()` to remove all event listeners and
 *                  revert DOM changes.
 *
 * The action fires a custom `amegmenmount` event on the element immediately
 * after initialisation so parent components can access the instance without
 * a Svelte store.
 *
 * @param node    - The host HTML element (typically `<nav>`).
 * @param options - Initial AMegMen options (optional).
 * @returns A {@link MegaMenuAction} with `update` and `destroy` callbacks.
 *
 * @example
 * ```svelte
 * <nav use:megamenu={{ announceOpen: true, desktopBreakpoint: 1024 }}>
 * ```
 */
export function megamenu(
  node: HTMLElement,
  options: Partial<MegaMenuOptions> = {}
): MegaMenuAction {
  let currentOptions = { ...options };
  const instance = new AMegMen(node, currentOptions);

  // Notify parent components that the instance is ready
  node.dispatchEvent(
    new CustomEvent<{ instance: AMegMen }>('amegmenmount', {
      bubbles: true,
      composed: true,
      detail: { instance },
    })
  );

  return {
    instance,

    /**
     * Called by Svelte's reactivity system when the bound option object changes.
     * Only keys that have actually changed are forwarded to `setOption`, avoiding
     * unnecessary re-renders and full re-inits.
     */
    update(newOptions: Partial<MegaMenuOptions> = {}) {
      (Object.keys(newOptions) as (keyof MegaMenuOptions)[]).forEach((key) => {
        if (newOptions[key] !== currentOptions[key]) {
          instance.setOption(key, newOptions[key] as MegaMenuOptions[typeof key]);
        }
      });
      currentOptions = { ...newOptions };
    },

    /** Tears down the AMegMen instance when the element leaves the DOM. */
    destroy() {
      instance.destroy();
    },
  };
}

// Re-export core types
export { AMegMen };
export type { MegaMenuOptions };
