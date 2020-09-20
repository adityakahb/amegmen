declare namespace AMegMen {
    interface IAMegMenSettings {
        activeClass?: string;
        actOnHoverAt?: number;
        backButtonClass?: string;
        closeButtonClass?: string;
        colClass?: string;
        colShiftClass?: string;
        colWidthClass?: string;
        focusClass?: string;
        hoverClass?: string;
        idPrefix?: string;
        isRightToLeft?: boolean;
        l0AnchorClass?: string;
        l0PanelClass?: string;
        l1AnchorClass?: string;
        l1PanelClass?: string;
        l2AnchorClass?: string;
        landingCtaClass?: string;
        lastcolClass?: string;
        mainButtonClass?: string;
        mainElementClass?: string;
        menuClass?: string;
        offcanvasclass?: string;
        overflowHiddenClass?: string;
        panelClass?: string;
        rightToLeftClass?: string;
        shiftColumns?: boolean;
        shouldActOnHover?: boolean;
        supportedCols?: number;
        toggleButtonClass?: string;
    }
    export class Root {
        private instances;
        protected static instance: Root | null;
        constructor();
        static getInstance(): Root;
        init: (query: string, options?: IAMegMenSettings | undefined) => void;
    }
    export {};
}
//# sourceMappingURL=amegmen.d.ts.map