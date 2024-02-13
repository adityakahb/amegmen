declare const AMegMen: {
    version: string;
    init: (selector: boolean | string, opts: string | undefined) => {
        id: string;
        destroy: (...args: any[]) => void;
        extraOpen: (...args: any[]) => void;
        extraClose: (...args: any[]) => void;
    }[];
    getAllInstances: {
        id: string;
        destroy: (...args: any[]) => void;
        extraOpen: (...args: any[]) => void;
        extraClose: (...args: any[]) => void;
    }[];
};
