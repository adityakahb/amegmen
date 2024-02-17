const AMegMen = (() => {
  type FunctionType = (...args: any[]) => void;

  type IBreakpoint = {
    actOnHover: boolean;
    layout: string;
    minWidth: number;
  };

  type ISettings = {
    afterInitFn: FunctionType | undefined;
    beforeInitFn: FunctionType | undefined;
    breakpoints: IBreakpoint[];
    isRTL?: boolean;
    zIndex?: number;
  };

  type IBreakpointShortened = {
    hov: boolean;
    lay: string;
    minW: number;
  };

  type ISettingsShortened = {
    bps: IBreakpointShortened[];
    rtl?: boolean;
    z?: number;
  };

  type ICore = {
    close?: HTMLElement;
    eH: IEventHandler[];
    id: string;
    main: HTMLElement;
    o: ISettingsShortened;
    open?: HTMLElement;
    r: HTMLElement;
  };

  type IInstances = {
    [key: string]: ICore;
  };

  type IEventHandler = {
    element: Element | Document | Window;
    remove: () => void;
  };

  type IReturnObj = {
    id: string;
    destroy: FunctionType;
    extraOpen: FunctionType;
    extraClose: FunctionType;
  };

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

  const allInstances: IInstances = {};
  const allReturnInstances: IReturnObj[] = [];
  let instanceIndex = 0;

  let resizeTimer: any;

  const cDefaults: ISettings = {
    afterInitFn: undefined,
    beforeInitFn: undefined,
    breakpoints: [],
  };

  const isVisible = (element: HTMLElement) => {
    const elementStyle = win.getComputedStyle(element);
    return (
      elementStyle.display !== "none" && elementStyle.visibility !== "hidden"
    );
  };

  const isFocusable = (element: HTMLElement) => {
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

  const keyAccessFn = (event: KeyboardEvent) => {
    console.log("==========event.key", event.key.toLowerCase());
  };

  const $$ = (parent: Element | Document, str: string) =>
    Array.prototype.slice.call(parent.querySelectorAll(str) || []);

  const $ = (parent: Element | Document, str: string) => $$(parent, str)[0];

  const generateID = (element: Element): string =>
    element.getAttribute("id") ||
    `${_idPrefix}_${new Date().getTime()}_root_${instanceIndex++}`;

  const addClass = (elem: HTMLElement, classNames: string) => {
    elem.classList.add(...classNames.split(" "));
  };

  const removeClass = (elem: HTMLElement, classNames: string) => {
    elem.classList.remove(...classNames.split(" "));
  };

  const addAttribute = (
    elem: HTMLElement,
    attribute: string,
    value: string,
  ) => {
    elem.setAttribute(attribute, value);
  };

  const removeAttribute = (elem: HTMLElement, attribute: string) => {
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

  const deepMerge = (target: any, source: any) => {
    if (typeof target !== "object" || typeof source !== "object") {
      return source;
    }

    for (const key in source) {
      if (source[key] instanceof Array) {
        !target[key] || (!(target[key] instanceof Array) && (target[key] = []));
        target[key] = target[key].concat(source[key]);
      } else if (source[key] instanceof Object) {
        !target[key] ||
          (!(target[key] instanceof Object) && (target[key] = {}));
        target[key] = deepMerge(target[key], source[key]);
      } else {
        target[key] = source[key];
      }
    }

    return target;
  };

  const eventHandler = (
    element: Element | Document | Window,
    type: string,
    listener: EventListenerOrEventListenerObject,
  ) => {
    const eventHandlerObj: IEventHandler = {
      element,
      remove: () => {
        element.removeEventListener(type, listener, _useCapture);
      },
    };
    element.addEventListener(type, listener, _useCapture);
    return eventHandlerObj;
  };

  const areValidOptions = (localOptions: ISettings): boolean => {
    const receivedArr: number[] | string[] = Object.keys(localOptions);
    const defaultArr: number[] | string[] = Object.keys(cDefaults);
    const breakpointsArr: number[] = [];
    const duplicates: number[] = [];
    const seen: number[] = [];
    const resultArr: number[] | string[] = receivedArr.filter(
      (key) => defaultArr.indexOf(key) === -1,
    );

    if (resultArr.length) {
      return false;
    }

    localOptions.breakpoints?.forEach((breakpoint) => {
      breakpoint.minWidth && breakpointsArr.push(breakpoint.minWidth);
    });

    breakpointsArr?.forEach((item) => {
      seen.includes(item) && !duplicates.includes(item)
        ? duplicates.push(item)
        : seen.push(item);
    });

    return duplicates.length === 0;
  };

  const mergeOptions = (s: ISettings): ISettingsShortened => {
    const o: ISettingsShortened = {
      bps: [],
      z: s.zIndex,
      rtl: s.isRTL ? true : false,
    };

    const defaultItem: IBreakpointShortened = {
      hov: false,
      lay: "xs",
      minW: 0,
    };

    if ((s.breakpoints || []).length > 0) {
      const bps = s.breakpoints.sort((a, b) => a.minWidth - b.minWidth);
      let currentIndex = 0;
      const newBps: IBreakpointShortened[] = [];
      newBps.push(defaultItem);
      bps.forEach((bp, index) => {
        if (bp.minWidth !== 0 || index !== 0) {
          newBps.push({
            hov: [true, false].includes(bp.actOnHover)
              ? bp.actOnHover
              : newBps[currentIndex].hov,
            lay: bp.layout ? bp.layout : newBps[currentIndex].lay,
            minW: bp.minWidth ? bp.minWidth : newBps[currentIndex].minW,
          } as IBreakpointShortened);
          currentIndex++;
        }
      });
      o.bps = newBps.sort((a, b) => a.minW - b.minW);
    } else {
      o.bps.push(defaultItem as IBreakpointShortened);
    }
    return o;
  };

  const applyLayout = (core: ICore) => {
    let currentBP = core.o.bps.filter((bp) => win.outerWidth >= bp.minW).pop();
    !currentBP && (currentBP = core.o.bps.filter((bp) => bp.minW === 0)[0]);
    core.r.setAttribute(_selectors.vp.slice(1, -1), currentBP.lay);
  };

  const toggleOpenCloseMobile = (
    event: Event,
    core: ICore,
    shouldOpen: boolean,
  ) => {
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

  const initiateStylesAndEvents = (core: ICore) => {
    core.close &&
      core.eH.push(
        eventHandler(core.close, _events.c, (event) => {
          toggleOpenCloseMobile(event, core, false);
        }),
      );
    core.open &&
      core.eH.push(
        eventHandler(core.open, _events.c, (event) => {
          toggleOpenCloseMobile(event, core, true);
        }),
      );
  };

  const initAmegmen = (
    menuId: string,
    nav: Element,
    options: ISettings,
  ): ICore | null => {
    if (areValidOptions(options)) {
      typeof options.beforeInitFn === "function" && options.beforeInitFn();
      const core: ICore = {
        close: $(nav, _selectors.close) as HTMLElement,
        eH: [],
        id: menuId,
        main: $(nav, _selectors.main) as HTMLElement,
        o: mergeOptions(options),
        open: $(nav, _selectors.open) as HTMLElement,
        r: nav as HTMLElement,
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

  const destroy = (core: ICore, cores: ICore[]) => {
    console.log("=========================destroy", core.id, cores);
  };

  const openMegamenu = (core: ICore, cores: ICore[]) => {
    console.log("=========================openMegamenu", core.id, cores);
  };

  const closeMegamenu = (core: ICore, cores: ICore[]) => {
    console.log("=========================openMegamenu", core.id, cores);
  };

  class Root {
    private static instance: Root;

    public static getInstance(): Root {
      !Root.instance && (Root.instance = new Root());
      return Root.instance;
    }

    public initGlobal() {
      win.addEventListener("resize", winResizeFn, _useCapture);
      win.addEventListener("keyup", keyAccessFn, _useCapture);
      this.init(true, "");
    }

    public init(selector: boolean | string, opts: string | undefined) {
      const coreArr: ICore[] = [];
      const returnArr: IReturnObj[] = [];
      const isGlobal = typeof selector === "boolean" && selector;
      const allMegamenus = isGlobal
        ? $$(document as Document, _selectors.global)
        : $$(document as Document, selector.toString());

      allMegamenus.forEach((thisMegamenu: Element) => {
        const megamenuId = generateID(thisMegamenu);
        let core: ICore | null;

        addAttribute(thisMegamenu as HTMLElement, "id", megamenuId);

        if (!allInstances[megamenuId]) {
          const receivedOptionsStr: ISettings = isGlobal
            ? JSON.parse(
                (
                  thisMegamenu.getAttribute(_selectors.global.slice(1, -1)) ||
                  ""
                ).replace(/'/g, '"'),
              )
            : opts
              ? opts
              : {};
          core = initAmegmen(
            megamenuId,
            thisMegamenu,
            deepMerge({ ...cDefaults }, receivedOptionsStr),
          );
          if (core) {
            allInstances[megamenuId] = core;
            coreArr.push(core);
          }
        }
      });

      coreArr.forEach((core: ICore) => {
        const returnObj: IReturnObj = {
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
