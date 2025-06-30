declare namespace AMegMen {
    interface ISettings {
        idPrefix: string;
    }
    export const init: (root: Element, options: ISettings) => void;
    export const destroy: () => void;
    export {};
}
export default AMegMen;
