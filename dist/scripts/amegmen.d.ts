declare namespace AMegMen {
    interface IBreakpoint {
        actOnHover: boolean;
        layout: string;
        minWidth: number | string;
    }
    interface ISettings {
        activeClass: string;
        actOnHover: boolean;
        afterInitFn?: () => void;
        animationEffect: string;
        animationSpeed: number;
        beforeInitFn?: () => void;
        breakpoints?: IBreakpoint[];
        disabledClass: string;
        easingFunction: string;
        editModeClass: string;
        hiddenClass: string;
        idPrefix: string;
        isRtl: boolean;
        l1Cols: number;
        layout: string;
        touchThreshold: number;
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
        protected static instance: Root | null;
        /**
         * Function to return single instance
         *
         * @returns Single amegmen Instance
         *
         */
        static getInstance(): Root;
        /**
         * Function to initialize the amegmen plugin for provided query strings.
         *
         * @param query - The CSS selector for which the amegmen needs to be initialized.
         * @param options - The optional object to customize every amegmen instance.
         *
         */
        init: (query: string, options?: ISettings | undefined) => void;
        /**
         * Function to auto-initialize the amegmen plugin for specific amegmens
         */
        initGlobal: () => void;
        protected destroy: (query: string) => void;
    }
    export {};
}
