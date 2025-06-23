interface MegaMenuOptions {
    selector: string;
    animationSpeed?: number;
}
declare class MegaMenu {
    private element;
    private options;
    constructor(options: MegaMenuOptions);
    private init;
    private openMenu;
    private closeMenu;
    destroy(): void;
}
export declare function createMegaMenu(options: MegaMenuOptions): MegaMenu;
export default MegaMenu;
