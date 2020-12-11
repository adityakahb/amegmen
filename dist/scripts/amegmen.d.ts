/**
 *  █████  ███    ███ ███████  ██████  ███    ███ ███████ ███    ██
 * ██   ██ ████  ████ ██      ██       ████  ████ ██      ████   ██
 * ███████ ██ ████ ██ █████   ██   ███ ██ ████ ██ █████   ██ ██  ██
 * ██   ██ ██  ██  ██ ██      ██    ██ ██  ██  ██ ██      ██  ██ ██
 * ██   ██ ██      ██ ███████  ██████  ██      ██ ███████ ██   ████
 *
 * AMegMen Namespace contains the Root class, Core class and related constants.
 *
 */
declare namespace AMegMen {
    interface IAMegMenSettings {
        activeCls?: string;
        actOnHover?: boolean;
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
        l1ActiveCls?: string;
        l1AnchorCls?: string;
        l1PanelCls?: string;
        l2ActiveCls?: string;
        l2AnchorCls?: string;
        landingCtaCls?: string;
        lastcolCls?: string;
        mainBtnCls?: string;
        mainElementCls?: string;
        offcanvasCls?: string;
        overflowHiddenCls?: string;
        panelCls?: string;
        rootCls?: string;
        rtl_Cls?: string;
        shiftColumns?: boolean;
        supportedCols?: number;
        toggleBtnCls?: string;
    }
    /**
     * ██████   ██████   ██████  ████████
     * ██   ██ ██    ██ ██    ██    ██
     * ██████  ██    ██ ██    ██    ██
     * ██   ██ ██    ██ ██    ██    ██
     * ██   ██  ██████   ██████     ██
     *
     * Exposed Singleton Class for global usage.
     *
     */
    export class Root {
        private instances;
        protected static instance: Root | null;
        /**
         * Constructor to initiate polyfills
         *
         */
        constructor();
        /**
         * Function to return single instance
         *
         * @returns Single AMegMen Instance
         *
         */
        static getInstance(): Root;
        /**
         * Function to initialize the AMegMen plugin for provided query strings.
         *
         * @param query - The CSS selector for which the AMegMen needs to be initialized.
         * @param options - The optional object to customize every AMegMen instance.
         *
         */
        init: (query: string, options?: IAMegMenSettings | undefined) => void;
        /**
         * Function to destroy the AMegMen plugin for provided query strings.
         *
         * @param query - The CSS selector for which the AMegMen needs to be initialized.
         *
         */
        destroy: (query: string) => void;
    }
    export {};
}
//# sourceMappingURL=amegmen.d.ts.map