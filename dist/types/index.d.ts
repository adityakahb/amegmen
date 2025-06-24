declare namespace AMegMen {
    interface ISettings {
        idPrefix: string;
    }
    export const init: (root: Element, options: ISettings) => void;
    export const initGlobal: () => void;
    export const destroyGlobal: () => void;
    export {};
}
export default AMegMen;
