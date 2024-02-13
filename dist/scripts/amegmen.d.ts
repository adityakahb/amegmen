declare const AMegMen: {
    version: string;
    init: (selector: boolean | string, opts: string | undefined) => {
        destroy: () => void;
        extraOpen: () => void;
        extraClose: () => void;
    };
};
