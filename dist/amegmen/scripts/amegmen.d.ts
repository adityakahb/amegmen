declare namespace AMegMen {
    interface IAMegMenSettings {
        activeCls?: string;
        actOnHoverAt?: number;
        backBtnCls?: string;
        closeBtnCls?: string;
        colCls?: string;
        colShiftCls?: string;
        colWidthCls?: string;
        focusCls?: string;
        hoverCls?: string;
        idPrefix?: string;
        isRTL?: boolean;
        l0AnchorCls?: string;
        l0PanelCls?: string;
        l1AnchorCls?: string;
        l1PanelCls?: string;
        l2AnchorCls?: string;
        landingCtaCls?: string;
        lastcolCls?: string;
        mainBtnCls?: string;
        mainElementCls?: string;
        rootCls?: string;
        offcanvasCls?: string;
        overflowHiddenCls?: string;
        panelCls?: string;
        rTL_Cls?: string;
        shiftColumns?: boolean;
        actOnHover?: boolean;
        supportedCols?: number;
        toggleBtnCls?: string;
    }
    export class Root {
        private instances;
        protected static instance: Root | null;
        constructor();
        static getInstance(): Root;
        init: (query: string, options?: IAMegMenSettings | undefined) => void;
        destroy: (query: string) => void;
    }
    export {};
}
//# sourceMappingURL=amegmen.d.ts.map