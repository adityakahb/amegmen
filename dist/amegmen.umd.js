(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
    typeof define === 'function' && define.amd ? define(['exports'], factory) :
    (global = typeof globalThis !== 'undefined' ? globalThis : global || self, factory(global.AMegMen = {}));
})(this, (function (exports) { 'use strict';

    // src/index.ts
    class MegaMenu {
        element;
        options;
        constructor(options) {
            this.options = {
                animationSpeed: 300, // Default value
                ...options,
            };
            const element = document.querySelector(this.options.selector);
            if (!element) {
                throw new Error(`MegaMenu: Element with selector "${this.options.selector}" not found.`);
            }
            this.element = element;
            this.init();
        }
        init() {
            console.log(`MegaMenu initialized for element: ${this.options.selector}`);
            console.log(`Animation speed: ${this.options.animationSpeed}ms`);
            // Add your megamenu logic here
            this.element.addEventListener('mouseenter', this.openMenu.bind(this));
            this.element.addEventListener('mouseleave', this.closeMenu.bind(this));
            // Example: If you have a specific content area within the megamenu
            const content = this.element.querySelector('.megamenu-content');
            if (content) {
                content.setAttribute('style', `--animation-speed: ${this.options.animationSpeed}ms;`);
            }
        }
        openMenu() {
            console.log('Opening megamenu');
            this.element.classList.add('is-open');
        }
        closeMenu() {
            console.log('Closing megamenu');
            this.element.classList.remove('is-open');
        }
        // Public method to destroy the instance, if needed
        destroy() {
            this.element.removeEventListener('mouseenter', this.openMenu.bind(this));
            this.element.removeEventListener('mouseleave', this.closeMenu.bind(this));
            console.log('MegaMenu destroyed.');
        }
    }
    // Export a factory function for easier instantiation
    function createMegaMenu(options) {
        return new MegaMenu(options);
    }

    exports.createMegaMenu = createMegaMenu;
    exports["default"] = MegaMenu;

    Object.defineProperty(exports, '__esModule', { value: true });

}));
