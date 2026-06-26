/**
 * @fileoverview Angular connector for AMegMen.
 *
 * Provides an `AmegmenDirective` that manages the AMegMen instance lifecycle
 * on an Angular component host element. Use it as an attribute directive on
 * a `<nav>` element.
 *
 * @packageDocumentation
 *
 * @example Standalone directive (Angular 14+)
 * ```ts
 * import { Component } from '@angular/core';
 * import { AmegmenDirective } from 'amegmen/connectors/angular';
 *
 * @Component({
 *   selector: 'app-nav',
 *   standalone: true,
 *   imports: [AmegmenDirective],
 *   template: `
 *     <nav amegmen [amegmenOptions]="{ openOnMouseover: true }" aria-label="Primary navigation">
 *       <ul><!-- … --></ul>
 *     </nav>
 *   `,
 * })
 * export class NavComponent {}
 * ```
 *
 * @example NgModule usage (Angular 12–13)
 * ```ts
 * import { NgModule } from '@angular/core';
 * import { AmegmenModule } from 'amegmen/connectors/angular';
 *
 * @NgModule({ imports: [AmegmenModule] })
 * export class AppModule {}
 * ```
 *
 * @remarks
 * Install the peer dependency separately:
 * ```
 * npm install @angular/core @angular/common
 * ```
 *
 * No zone concerns: AMegMen uses native DOM events only and never touches
 * Angular's change-detection cycle.
 */

import { AMegMen } from '../../ts/amegmen';
import type { MegaMenuOptions } from '../../ts/types';
import type { MegaMenuConnector } from '../react/index';

// ─── Angular structural types ─────────────────────────────────────────────────
// Minimal structural interfaces so this file compiles without importing
// @angular/core (which would add it as a hard peer dependency).

/** Structural shape of Angular's ElementRef<T>. */
interface ElementRef<T extends HTMLElement = HTMLElement> {
  nativeElement: T;
}

/** Structural shape of Angular's SimpleChanges map. */
type SimpleChanges = Record<
  string,
  { currentValue: unknown; previousValue: unknown; firstChange: boolean }
>;

// ─── Directive implementation ─────────────────────────────────────────────────

/**
 * Angular attribute directive that creates and manages an AMegMen instance.
 *
 * Lifecycle:
 *  - `ngAfterViewInit`  — creates the instance (DOM is ready)
 *  - `ngOnChanges`      — calls `setOption` for each changed input
 *  - `ngOnDestroy`      — destroys the instance and releases resources
 *
 * Inputs:
 *  - `[amegmenOptions]` — `Partial<MegaMenuOptions>` — forwarded to constructor.
 *     Individual option changes are applied via `setOption` to avoid full re-init.
 *
 * @example
 * ```html
 * <nav amegmen [amegmenOptions]="{ announceOpen: true }" aria-label="Main">
 *   <ul><!-- … --></ul>
 * </nav>
 * ```
 *
 * To access the instance programmatically, use `@ViewChild`:
 * ```ts
 * @ViewChild(AmegmenDirective) megaMenu!: AmegmenDirective;
 * ngAfterViewInit() { this.megaMenu.openPanelAt(0); }
 * ```
 */
export class AmegmenDirective implements MegaMenuConnector {
  /**
   * AMegMen options forwarded to the constructor.
   * Changes are applied via `setOption` in `ngOnChanges`.
   */
  amegmenOptions: Partial<MegaMenuOptions> = {};

  /** The live AMegMen instance. `null` before `ngAfterViewInit`. */
  instance: AMegMen | null = null;

  private readonly elementRef: ElementRef;

  /**
   * @param elementRef - Angular-injected reference to the host `<nav>` element.
   */
  constructor(elementRef: ElementRef) {
    this.elementRef = elementRef;
  }

  /**
   * Creates the AMegMen instance. Called after Angular has fully initialised
   * the component's view, ensuring the DOM is available.
   */
  ngAfterViewInit(): void {
    this.instance = new AMegMen(this.elementRef.nativeElement, this.amegmenOptions);
  }

  /**
   * Applies changed `amegmenOptions` keys to the live instance via `setOption`.
   * Avoids a full destroy/re-init for routine option changes.
   */
  ngOnChanges(changes: SimpleChanges): void {
    const optChanges = changes.amegmenOptions;
    if (!this.instance || !optChanges || optChanges.firstChange) return;

    const newOpts = (optChanges.currentValue ?? {}) as Partial<MegaMenuOptions>;
    const oldOpts = (optChanges.previousValue ?? {}) as Partial<MegaMenuOptions>;

    (Object.keys(newOpts) as (keyof MegaMenuOptions)[]).forEach((key) => {
      if (newOpts[key] !== oldOpts[key]) {
        this.instance?.setOption(key, newOpts[key] as MegaMenuOptions[typeof key]);
      }
    });
  }

  /** Destroys the AMegMen instance and releases all event listeners. */
  ngOnDestroy(): void {
    this.instance?.destroy();
    this.instance = null;
  }

  // ─── MegaMenuConnector helpers ──────────────────────────────────────────────

  /** Opens the panel at the given zero-based index. */
  openPanelAt(index: number): void {
    this.instance?.openPanelAt(index);
  }

  /** Closes all open panels. */
  closePanels(): void {
    this.instance?.closePanels();
  }

  /** Updates a single option on the live instance. */
  setOption<K extends keyof MegaMenuOptions>(key: K, value: MegaMenuOptions[K]): void {
    this.instance?.setOption(key, value);
  }
}

// ─── NgModule ─────────────────────────────────────────────────────────────────

/**
 * Angular module that declares and exports `AmegmenDirective`.
 * Use with `imports: [AmegmenModule]` for NgModule-based applications.
 */
// eslint-disable-next-line @typescript-eslint/no-extraneous-class
export class AmegmenModule {
  /** Directives exported by this module. */
  static readonly declarations = [AmegmenDirective];
  static readonly exports = [AmegmenDirective];
}

// Re-export core types
export { AMegMen };
export type { MegaMenuOptions, MegaMenuConnector };
