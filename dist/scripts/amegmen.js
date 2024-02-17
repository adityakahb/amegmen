"use strict";
const AMegMen = (() => {
    const __v = "2.0.0";
    const win = window;
    const _events = {
        c: "click",
        kd: "keydown",
        ku: "keyup",
        md: "mousedown",
        mu: "mouseup",
    };
    const _keys = {
        space: "space",
        enter: "enter",
        escape: "escape",
        rightarrow: "rightarrow",
        leftarrow: "leftarrow",
        toparrow: "toparrow",
        bottomarrow: "bottomarrow",
        home: "home",
        end: "end",
    };
    const _focusableElements = [
        "a[href]",
        "button:enabled",
        "input:enabled",
        "select:enabled",
        "textarea:enabled",
        "option:enabled",
        "[tabindex]:not([tabindex='-1'])",
    ].join(", ");
    const _idPrefix = "__amegmen";
    const _selectors = {
        close: `[data${_idPrefix}-close]`,
        global: `[data${_idPrefix}-auto]`,
        main: `[data${_idPrefix}-main]`,
        open: `[data${_idPrefix}-open]`,
        vp: `[data${_idPrefix}-viewport]`,
    };
    const _classes = {
        active: `${_idPrefix}-active`,
        hidden: `${_idPrefix}-hidden`,
        rtl: `${_idPrefix}-rtl`,
    };
    const _useCapture = false;
    const allInstances = {};
    const allReturnInstances = [];
    let instanceIndex = 0;
    let resizeTimer;
    const cDefaults = {
        afterInitFn: undefined,
        beforeInitFn: undefined,
        breakpoints: [],
    };
    const isVisible = (element) => {
        const elementStyle = win.getComputedStyle(element);
        return (elementStyle.display !== "none" && elementStyle.visibility !== "hidden");
    };
    const isFocusable = (element) => {
        return isVisible(element) && element.matches(_focusableElements);
    };
    const winResizeFn = () => {
        resizeTimer && clearTimeout(resizeTimer);
        resizeTimer = setTimeout(() => {
            Object.keys(allInstances).forEach((key) => {
                allInstances[key] && applyLayout(allInstances[key]);
            });
        }, 100);
    };
    const keyAccessFn = (event) => {
        console.log("==========event.key", event.key.toLowerCase());
    };
    const $$ = (parent, str) => Array.prototype.slice.call(parent.querySelectorAll(str) || []);
    const $ = (parent, str) => $$(parent, str)[0];
    const generateID = (element) => element.getAttribute("id") ||
        `${_idPrefix}_${new Date().getTime()}_root_${instanceIndex++}`;
    const addClass = (elem, classNames) => {
        elem.classList.add(...classNames.split(" "));
    };
    const removeClass = (elem, classNames) => {
        elem.classList.remove(...classNames.split(" "));
    };
    const addAttribute = (elem, attribute, value) => {
        elem.setAttribute(attribute, value);
    };
    const removeAttribute = (elem, attribute) => {
        elem.removeAttribute(attribute);
    };
    // const wrapAll = (elements: HTMLElement[], wrapper: HTMLElement) => {
    //   elements.length &&
    //     elements[0].parentNode &&
    //     elements[0].parentNode.insertBefore(wrapper, elements[0]);
    //   elements.forEach((element) => {
    //     wrapper.appendChild(element);
    //   });
    // };
    // const unwrapAll = (element: HTMLElement) => {
    //   if (element && element.parentNode) {
    //     while (element.firstChild) {
    //       element.parentNode.insertBefore(element.firstChild, element);
    //     }
    //     element.remove();
    //   }
    // };
    const deepMerge = (target, source) => {
        if (typeof target !== "object" || typeof source !== "object") {
            return source;
        }
        for (const key in source) {
            if (source[key] instanceof Array) {
                !target[key] || (!(target[key] instanceof Array) && (target[key] = []));
                target[key] = target[key].concat(source[key]);
            }
            else if (source[key] instanceof Object) {
                !target[key] ||
                    (!(target[key] instanceof Object) && (target[key] = {}));
                target[key] = deepMerge(target[key], source[key]);
            }
            else {
                target[key] = source[key];
            }
        }
        return target;
    };
    const eventHandler = (element, type, listener) => {
        const eventHandlerObj = {
            element,
            remove: () => {
                element.removeEventListener(type, listener, _useCapture);
            },
        };
        element.addEventListener(type, listener, _useCapture);
        return eventHandlerObj;
    };
    const areValidOptions = (localOptions) => {
        var _a;
        const receivedArr = Object.keys(localOptions);
        const defaultArr = Object.keys(cDefaults);
        const breakpointsArr = [];
        const duplicates = [];
        const seen = [];
        const resultArr = receivedArr.filter((key) => defaultArr.indexOf(key) === -1);
        if (resultArr.length) {
            return false;
        }
        (_a = localOptions.breakpoints) === null || _a === void 0 ? void 0 : _a.forEach((breakpoint) => {
            breakpoint.minWidth && breakpointsArr.push(breakpoint.minWidth);
        });
        breakpointsArr === null || breakpointsArr === void 0 ? void 0 : breakpointsArr.forEach((item) => {
            seen.includes(item) && !duplicates.includes(item)
                ? duplicates.push(item)
                : seen.push(item);
        });
        return duplicates.length === 0;
    };
    const mergeOptions = (s) => {
        const o = {
            bps: [],
            z: s.zIndex,
            rtl: s.isRTL ? true : false,
        };
        const defaultItem = {
            hov: false,
            lay: "xs",
            minW: 0,
        };
        if ((s.breakpoints || []).length > 0) {
            const bps = s.breakpoints.sort((a, b) => a.minWidth - b.minWidth);
            let currentIndex = 0;
            const newBps = [];
            newBps.push(defaultItem);
            bps.forEach((bp, index) => {
                if (bp.minWidth !== 0 || index !== 0) {
                    newBps.push({
                        hov: [true, false].includes(bp.actOnHover)
                            ? bp.actOnHover
                            : newBps[currentIndex].hov,
                        lay: bp.layout ? bp.layout : newBps[currentIndex].lay,
                        minW: bp.minWidth ? bp.minWidth : newBps[currentIndex].minW,
                    });
                    currentIndex++;
                }
            });
            o.bps = newBps.sort((a, b) => a.minW - b.minW);
        }
        else {
            o.bps.push(defaultItem);
        }
        return o;
    };
    const applyLayout = (core) => {
        let currentBP = core.o.bps.filter((bp) => win.outerWidth >= bp.minW).pop();
        !currentBP && (currentBP = core.o.bps.filter((bp) => bp.minW === 0)[0]);
        core.r.setAttribute(_selectors.vp.slice(1, -1), currentBP.lay);
    };
    const toggleOpenCloseMobile = (event, core, shouldOpen) => {
        event.preventDefault();
        if (shouldOpen) {
            core.open && addAttribute(core.open, "tabindex", "-1");
            core.close && removeAttribute(core.close, "tabindex");
            return;
        }
        core.close && addAttribute(core.close, "tabindex", "-1");
        core.open && removeAttribute(core.open, "tabindex");
        return;
    };
    const initiateStylesAndEvents = (core) => {
        core.close &&
            core.eH.push(eventHandler(core.close, _events.c, (event) => {
                toggleOpenCloseMobile(event, core, false);
            }));
        core.open &&
            core.eH.push(eventHandler(core.open, _events.c, (event) => {
                toggleOpenCloseMobile(event, core, true);
            }));
    };
    const initAmegmen = (menuId, nav, options) => {
        if (areValidOptions(options)) {
            typeof options.beforeInitFn === "function" && options.beforeInitFn();
            const core = {
                close: $(nav, _selectors.close),
                eH: [],
                id: menuId,
                main: $(nav, _selectors.main),
                o: mergeOptions(options),
                open: $(nav, _selectors.open),
                r: nav,
            };
            core.o.z && core.o.z > 0 && (core.main.style.zIndex = core.o.z + "");
            core.o.rtl && addClass(core.main, _classes.rtl);
            initiateStylesAndEvents(core);
            applyLayout(core);
            addClass(core.r, _classes.active);
            typeof options.afterInitFn === "function" && options.afterInitFn();
            return core;
        }
        // TODO: Log invalid options
        return null;
    };
    const destroy = (core, cores) => {
        console.log("=========================destroy", core.id, cores);
    };
    const openMegamenu = (core, cores) => {
        console.log("=========================openMegamenu", core.id, cores);
    };
    const closeMegamenu = (core, cores) => {
        console.log("=========================openMegamenu", core.id, cores);
    };
    class Root {
        static getInstance() {
            !Root.instance && (Root.instance = new Root());
            return Root.instance;
        }
        initGlobal() {
            win.addEventListener("resize", winResizeFn, _useCapture);
            win.addEventListener("keyup", keyAccessFn, _useCapture);
            this.init(true, "");
        }
        init(selector, opts) {
            const coreArr = [];
            const returnArr = [];
            const isGlobal = typeof selector === "boolean" && selector;
            const allMegamenus = isGlobal
                ? $$(document, _selectors.global)
                : $$(document, selector.toString());
            allMegamenus.forEach((thisMegamenu) => {
                const megamenuId = generateID(thisMegamenu);
                let core;
                addAttribute(thisMegamenu, "id", megamenuId);
                if (!allInstances[megamenuId]) {
                    const receivedOptionsStr = isGlobal
                        ? JSON.parse((thisMegamenu.getAttribute(_selectors.global.slice(1, -1)) ||
                            "").replace(/'/g, '"'))
                        : opts
                            ? opts
                            : {};
                    core = initAmegmen(megamenuId, thisMegamenu, deepMerge(Object.assign({}, cDefaults), receivedOptionsStr));
                    if (core) {
                        allInstances[megamenuId] = core;
                        coreArr.push(core);
                    }
                }
            });
            coreArr.forEach((core) => {
                const returnObj = {
                    destroy: destroy.bind(this, core, coreArr),
                    id: core.id,
                    extraOpen: openMegamenu.bind(this, core, coreArr),
                    extraClose: closeMegamenu.bind(this, core, coreArr),
                };
                returnArr.push(returnObj);
                allReturnInstances.push(returnObj);
            });
            return returnArr;
        }
    }
    setTimeout(() => {
        Root.getInstance().initGlobal();
    }, 0);
    return {
        version: __v,
        init: Root.getInstance().init,
        getAllInstances: allReturnInstances,
    };
})();

//# sourceMappingURL=amegmen.js.map
