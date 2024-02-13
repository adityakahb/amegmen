declare namespace AMegMen {
    const version = "2.0.0";
    const init: (selector: boolean | string, opts: string | undefined) => {
        destroy: () => void;
        extraOpen: () => void;
        extraClose: () => void;
    };
}
