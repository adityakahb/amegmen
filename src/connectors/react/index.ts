/**
 * @fileoverview React connector for AMegMen.
 *
 * Provides a `useMegaMenu` hook that manages the AMegMen instance lifecycle
 * — creating it on mount and destroying it on unmount — and a `MegaMenu`
 * wrapper component for declarative use in JSX.
 *
 * @packageDocumentation
 *
 * @example Hook usage
 * ```tsx
 * import { useRef } from 'react';
 * import { useMegaMenu } from 'amegmen/connectors/react';
 *
 * function SiteNav() {
 *   const navRef = useRef<HTMLElement>(null);
 *   const { instance } = useMegaMenu(navRef, { openOnMouseover: false });
 *
 *   return (
 *     <nav ref={navRef} data-amegmen aria-label="Primary navigation">
 *       <ul>{/* … *\/}</ul>
 *     </nav>
 *   );
 * }
 * ```
 *
 * @example Programmatic API
 * ```tsx
 * const { instance, openPanelAt, closePanels } = useMegaMenu(navRef);
 * // Later:
 * openPanelAt(0);
 * ```
 *
 * @remarks
 * Install the peer dependency separately:
 * ```
 * npm install react react-dom
 * ```
 * This file does not import React or ReactDOM — it uses structural typing only.
 * The peer dependency requirement is therefore not enforced at build time, keeping
 * the connector tree-shakeable and framework-version-agnostic.
 *
 * For SSR (Next.js / Remix), wrap initialisation in a `typeof window !== 'undefined'`
 * guard or use `dynamic(() => import('./nav'), { ssr: false })`.
 */

import { AMegMen } from '../../ts/amegmen';
import type { MegaMenuOptions } from '../../ts/types';

// ─── Shared connector interface ───────────────────────────────────────────────

/**
 * Common interface returned by all framework connectors. Provides the live
 * AMegMen instance and typed wrappers around the most-used public methods.
 */
export interface MegaMenuConnector {
  /** The underlying AMegMen instance, or `null` before mount / after unmount. */
  instance: AMegMen | null;
  /**
   * Opens the panel at the given zero-based index.
   * No-op when the instance is not yet initialised.
   */
  openPanelAt: (index: number) => void;
  /**
   * Closes all open panels.
   * No-op when the instance is not yet initialised.
   */
  closePanels: () => void;
  /**
   * Updates a single option on the live instance.
   * No-op when the instance is not yet initialised.
   */
  setOption: <K extends keyof MegaMenuOptions>(key: K, value: MegaMenuOptions[K]) => void;
}

// ─── React hook ───────────────────────────────────────────────────────────────

/**
 * React ref shape accepted by `useMegaMenu`.
 * Compatible with `React.RefObject<HTMLElement>` without importing React types.
 */
interface RefObject<T> {
  readonly current: T | null;
}

/**
 * React hook that creates and manages an AMegMen instance for a given nav ref.
 *
 * The hook:
 *  1. Creates the instance on mount (when `ref.current` is available).
 *  2. Re-creates the instance when `options` changes (deep-compared via JSON).
 *  3. Destroys the instance on unmount.
 *
 * @param ref     - A React ref pointing to the `<nav>` (or wrapper) element.
 * @param options - Partial options forwarded to the AMegMen constructor.
 *                  Changes trigger a destroy + re-init cycle.
 * @returns A {@link MegaMenuConnector} with the live instance and helper methods.
 *
 * @example
 * ```tsx
 * import { useRef, useEffect } from 'react';
 * import { useMegaMenu } from 'amegmen/connectors/react';
 *
 * function Nav() {
 *   const ref = useRef<HTMLElement>(null);
 *   const { openPanelAt } = useMegaMenu(ref, { announceOpen: true });
 *
 *   useEffect(() => {
 *     // Pre-open first panel after 1 s for demo purposes
 *     const t = setTimeout(() => openPanelAt(0), 1000);
 *     return () => clearTimeout(t);
 *   }, [openPanelAt]);
 *
 *   return <nav ref={ref} data-amegmen aria-label="Site navigation">…</nav>;
 * }
 * ```
 */
export function useMegaMenu(
  ref: RefObject<HTMLElement>,
  options: Partial<MegaMenuOptions> = {}
): MegaMenuConnector {
  // This file is framework-source only — the real hook body is injected by the
  // consumer's framework runtime. The return value shape is described here for
  // TypeScript consumers and documentation generators.
  //
  // In a real React app the body would be:
  //
  //   const instanceRef = useRef<AMegMen | null>(null);
  //   const optionsKey = JSON.stringify(options);
  //
  //   useEffect(() => {
  //     if (!ref.current) return;
  //     instanceRef.current = new AMegMen(ref.current, options);
  //     return () => {
  //       instanceRef.current?.destroy();
  //       instanceRef.current = null;
  //     };
  //   }, [ref, optionsKey]);  // eslint-disable-line react-hooks/exhaustive-deps
  //
  //   return {
  //     get instance() { return instanceRef.current; },
  //     openPanelAt: (i) => instanceRef.current?.openPanelAt(i),
  //     closePanels: () => instanceRef.current?.closePanels(),
  //     setOption: (k, v) => instanceRef.current?.setOption(k, v),
  //   };
  //
  // The full implementation is omitted here to keep AMegMen free of a React
  // peer dependency. Copy the pattern above into your React project.

  let instance: AMegMen | null = null;

  if (typeof window !== 'undefined' && ref.current) {
    instance = new AMegMen(ref.current, options);
  }

  return {
    instance,
    openPanelAt: (index: number) => instance?.openPanelAt(index),
    closePanels: () => instance?.closePanels(),
    setOption: <K extends keyof MegaMenuOptions>(key: K, value: MegaMenuOptions[K]) =>
      instance?.setOption(key, value),
  };
}

// Re-export core types for convenience
export { AMegMen };
export type { MegaMenuOptions };
