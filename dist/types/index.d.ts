declare namespace AMegMen {
    class Root {
    }
    export const init: () => Root;
    export const destroy: () => Root;
    export const initGlobal: () => void;
    export const destroyGlobal: () => void;
    export {};
}
export default AMegMen;
