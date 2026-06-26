/**
 * @fileoverview Vue 3 connector for AMegMen.
 *
 * Provides:
 *  - `useMegaMenu` composable — for use in `<script setup>` / Composition API
 *  - `vAmegmen` directive — for declarative use as `v-amegmen` on a `<nav>` element
 *  - `createAMegMenPlugin` — registers the directive globally via `app.use()`
 *
 * @packageDocumentation
 *
 * @example Composable usage
 * ```vue
 * <script setup lang="ts">
 * import { ref } from 'vue';
 * import { useMegaMenu } from 'amegmen/connectors/vue';
 *
 * const navRef = ref<HTMLElement | null>(null);
 * const { instance } = useMegaMenu(navRef, { openOnMouseover: true });
 * </script>
 *
 * <template>
 *   <nav ref="navRef" data-amegmen aria-label="Primary navigation">
 *     <ul><!-- … --></ul>
 *   </nav>
 * </template>
 * ```
 *
 * @example Directive usage
 * ```vue
 * <nav v-amegmen="{ openOnMouseover: true }" aria-label="Site nav">
 *   <ul><!-- … --></ul>
 * </nav>
 * ```
 *
 * @example Global plugin registration
 * ```ts
 * import { createApp } from 'vue';
 * import { createAMegMenPlugin } from 'amegmen/connectors/vue';
 * import App from './App.vue';
 *
 * createApp(App).use(createAMegMenPlugin()).mount('#app');
 * ```
 *
 * @remarks
 * Install the peer dependency separately:
 * ```
 * npm install vue
 * ```
 */

import { AMegMen } from '../../ts/amegmen';
import type { MegaMenuOptions } from '../../ts/types';
import type { MegaMenuConnector } from '../react/index';

// ─── Vue 3 structural types (avoids hard Vue dependency) ──────────────────────

/** Structural shape of a Vue 3 `Ref<T>`. */
interface VueRef<T> {
  value: T;
}

/** Structural shape of a Vue 3 custom directive binding. */
interface DirectiveBinding<V = unknown> {
  value: V;
  oldValue: V | null;
}

/** Structural shape of a Vue 3 custom directive object. */
interface ObjectDirective<El extends HTMLElement = HTMLElement, V = unknown> {
  mounted?: (el: El, binding: DirectiveBinding<V>) => void;
  updated?: (el: El, binding: DirectiveBinding<V>) => void;
  unmounted?: (el: El) => void;
}

/** Structural shape of a Vue 3 App instance (subset needed for plugin). */
interface VueApp {
  directive: (name: string, directive: ObjectDirective) => VueApp;
}

// ─── Composable ───────────────────────────────────────────────────────────────

/**
 * Vue 3 composable that manages an AMegMen instance for a template ref.
 *
 * Intended for use inside `<script setup>` or the `setup()` function. The
 * caller is responsible for calling `onMounted` / `onBeforeUnmount` lifecycle
 * hooks; the composable itself is framework-lifecycle-agnostic to keep it
 * importable without a Vue runtime dependency.
 *
 * Typical pattern:
 * ```ts
 * const navRef = ref<HTMLElement | null>(null);
 * let menu: AMegMen | null = null;
 *
 * onMounted(() => {
 *   if (navRef.value) menu = new AMegMen(navRef.value, options);
 * });
 * onBeforeUnmount(() => { menu?.destroy(); menu = null; });
 * ```
 *
 * @param ref     - Vue `Ref<HTMLElement | null>` pointing to the `<nav>` element.
 * @param options - Partial options forwarded to the AMegMen constructor.
 * @returns A {@link MegaMenuConnector} object with the live instance and helpers.
 */
export function useMegaMenu(
  ref: VueRef<HTMLElement | null>,
  options: Partial<MegaMenuOptions> = {}
): MegaMenuConnector {
  let instance: AMegMen | null = null;

  if (typeof window !== 'undefined' && ref.value) {
    instance = new AMegMen(ref.value, options);
  }

  return {
    instance,
    openPanelAt: (index: number) => instance?.openPanelAt(index),
    closePanels: () => instance?.closePanels(),
    setOption: <K extends keyof MegaMenuOptions>(key: K, value: MegaMenuOptions[K]) =>
      instance?.setOption(key, value),
  };
}

// ─── Custom directive ─────────────────────────────────────────────────────────

/** Symbol key used to store the AMegMen instance on the directive's element. */
const INSTANCE_KEY = Symbol('amegmen');

/**
 * Vue 3 custom directive (`v-amegmen`) that creates an AMegMen instance when
 * the element is mounted and destroys it when unmounted.
 *
 * Directive value is `Partial<MegaMenuOptions>`. Pass options directly:
 * ```html
 * <nav v-amegmen="{ openOnMouseover: true, desktopBreakpoint: 1024 }">
 * ```
 *
 * To react to option changes, use `:value` binding:
 * ```html
 * <nav v-amegmen="navOptions">
 * ```
 * where `navOptions` is a reactive ref — the directive calls `setOption` for
 * each changed key in the `updated` hook.
 */
export const vAmegmen: ObjectDirective<
  HTMLElement & { [INSTANCE_KEY]?: AMegMen },
  Partial<MegaMenuOptions>
> = {
  mounted(el, binding) {
    // binding.value is typed as non-optional in structural types but can be
    // absent at runtime when the directive is used without a value expression.
    // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
    el[INSTANCE_KEY] = new AMegMen(el, binding.value ?? {});
  },

  updated(el, binding) {
    const instance = el[INSTANCE_KEY];
    if (!instance) return;
    // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
    const newOpts = binding.value ?? {};
    const oldOpts = binding.oldValue ?? {};
    // Only update keys that changed — avoids a full destroy/re-init
    (Object.keys(newOpts) as (keyof MegaMenuOptions)[]).forEach((key) => {
      if (newOpts[key] !== oldOpts[key]) {
        instance.setOption(key, newOpts[key] as MegaMenuOptions[typeof key]);
      }
    });
  },

  unmounted(el) {
    el[INSTANCE_KEY]?.destroy();
    el[INSTANCE_KEY] = undefined;
  },
};

// ─── Vue plugin ───────────────────────────────────────────────────────────────

/**
 * Creates a Vue plugin that registers the `v-amegmen` directive globally.
 *
 * @example
 * ```ts
 * import { createApp } from 'vue';
 * import { createAMegMenPlugin } from 'amegmen/connectors/vue';
 *
 * createApp(App).use(createAMegMenPlugin()).mount('#app');
 * // Then in any component template:
 * // <nav v-amegmen="{ announceOpen: true }">…</nav>
 * ```
 */
export function createAMegMenPlugin(): { install: (app: VueApp) => void } {
  return {
    install(app: VueApp) {
      app.directive('amegmen', vAmegmen as ObjectDirective);
    },
  };
}

// Re-export core types
export { AMegMen };
export type { MegaMenuOptions, MegaMenuConnector };
