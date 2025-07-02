declare namespace AMegMen {
    interface ISettings {
        duration: number;
        idPrefix: string;
    }
    export const init: (root: Element, options: ISettings) => void;
    export const destroy: () => void;
    export {};
}
export default AMegMen;
