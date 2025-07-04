declare namespace AMegMen {
    interface IReceivedSettings {
        idPrefix?: string;
    }
    export const destroy: () => void;
    export const create: (selector: string, receivedOptions: IReceivedSettings) => void;
    export {};
}
export default AMegMen;
