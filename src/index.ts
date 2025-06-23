// src/index.ts

interface MegaMenuOptions {
  selector: string;
  animationSpeed?: number;
  // Add more options as needed for your plugin
}

class MegaMenu {
  private element: HTMLElement;
  private options: MegaMenuOptions;

  constructor(options: MegaMenuOptions) {
    this.options = {
      animationSpeed: 300, // Default value
      ...options,
    };
    const element = document.querySelector(this.options.selector);
    if (!element) {
      throw new Error(`MegaMenu: Element with selector "${this.options.selector}" not found.`);
    }
    this.element = element as HTMLElement;
    this.init();
  }

  private init(): void {
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

  private openMenu(): void {
    console.log('Opening megamenu');
    this.element.classList.add('is-open');
  }

  private closeMenu(): void {
    console.log('Closing megamenu');
    this.element.classList.remove('is-open');
  }

  // Public method to destroy the instance, if needed
  public destroy(): void {
    this.element.removeEventListener('mouseenter', this.openMenu.bind(this));
    this.element.removeEventListener('mouseleave', this.closeMenu.bind(this));
    console.log('MegaMenu destroyed.');
  }
}

// Export a factory function for easier instantiation
export function createMegaMenu(options: MegaMenuOptions): MegaMenu {
  return new MegaMenu(options);
}

// Optionally, export the class directly as a default for scenarios where that's preferred
export default MegaMenu;
