namespace AMegMen {
  interface IRoot {
    [key: string]: any;
  }

  interface IBreakpoint {
    actOnHover: boolean;
    layout: string;
    minWidth: number | string;
  }

  interface IamegmenEasing {
    [key: string]: (t: number) => number;
  }

  interface ISettings {
    activeClass: string;
    actOnHover: boolean;
    afterInitFn?: () => void;
    animationEffect: string;
    animationSpeed: number;
    beforeInitFn?: () => void;
    breakpoints?: IBreakpoint[];
    disabledClass: string;
    easingFunction: string;
    editModeClass: string;
    hiddenClass: string;
    idPrefix: string;
    isRtl: boolean;
    l1Cols: number;
    layout: string;
    touchThreshold: number;
  }

  interface ITimer {
    id: any;
    elapsed: number;
    nX: number; // nextX
    position: number;
    pX: number; // prevX
    progress: number;
    start: number;
    total: number;
  }

  interface ICore {
    _t: ITimer;
  }

  interface ICoreInstance {
    [key: string]: ICore;
  }

  /*
   * Easing Functions - inspired from http://gizma.com/easing/
   * only considering the t value for the range [0, 1] => [0, 1]
   */
  const cEasingFunctions: IamegmenEasing = {
    // no easing, no acceleration
    linear: (t: number) => t,
    // accelerating from zero velocity
    easeInQuad: (t: number) => t * t,
    // decelerating to zero velocity
    easeOutQuad: (t: number) => t * (2 - t),
    // acceleration until halfway, then deceleration
    easeInOutQuad: (t: number) => (t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t),
    // accelerating from zero velocity
    easeInCubic: (t: number) => t * t * t,
    // decelerating to zero velocity
    easeOutCubic: (t: number) => --t * t * t + 1,
    // acceleration until halfway, then deceleration
    easeInOutCubic: (t: number) =>
      t < 0.5 ? 4 * t * t * t : (t - 1) * (2 * t - 2) * (2 * t - 2) + 1,
    // accelerating from zero velocity
    easeInQuart: (t: number) => t * t * t * t,
    // decelerating to zero velocity
    easeOutQuart: (t: number) => 1 - --t * t * t * t,
    // acceleration until halfway, then deceleration
    easeInOutQuart: (t: number) =>
      t < 0.5 ? 8 * t * t * t * t : 1 - 8 * --t * t * t * t,
    // accelerating from zero velocity
    easeInQuint: (t: number) => t * t * t * t * t,
    // decelerating to zero velocity
    easeOutQuint: (t: number) => 1 + --t * t * t * t * t,
    // acceleration until halfway, then deceleration
    easeInOutQuint: (t: number) =>
      t < 0.5 ? 16 * t * t * t * t * t : 1 + 16 * --t * t * t * t * t
    // elastic bounce effect at the beginning
    // easeInElastic: (t: number) => (0.04 - 0.04 / t) * Math.sin(25 * t) + 1,
    // elastic bounce effect at the end
    // easeOutElastic: (t: number) => ((0.04 * t) / --t) * Math.sin(25 * t),
    // elastic bounce effect at the beginning and end
    // easeInOutElastic: (t: number) =>
    //   (t -= 0.5) < 0
    //     ? (0.02 + 0.01 / t) * Math.sin(50 * t)
    //     : (0.02 - 0.01 / t) * Math.sin(50 * t) + 1,
  };

  const cAnimationEffects = [`slide`, `fade`];
  const cRootSelectorTypeError = `Element(s) with the provided query do(es) not exist`;
  const cOptionsParseTypeError = `Unable to parse the options string`;
  const cDuplicateBreakpointsTypeError = `Duplicate breakpoints found`;
  const cBreakpointsParseTypeError = `Error parsing breakpoints`;
  const cNoEffectFoundError = `Animation effect function not found in presets. Try using one from (${cAnimationEffects.join(
    `, `
  )}). Setting the animation effect to ${cAnimationEffects[0]}.`;
  const cNoEasingFoundError = `Easing function not found in presets. Try using one from [${Object.keys(
    cEasingFunctions
  ).join(`, `)}]. Setting the easing function to ${
    Object.keys(cEasingFunctions)[0]
  }.`;
  const cUseCapture = false;
  const cSelectors = {
    arrowN: `[data-amegmen-nextarrow]`,
    arrowP: `[data-amegmen-previousarrow]`,
    cntr: `[data-amegmen-centered]`,
    ctrlW: `[data-amegmen-ctrlWrapper]`,
    curp: `[data-amegmen-currentpage]`,
    dot: `[data-amegmen-dot]`,
    nav: `[data-amegmen-navigation]`,
    navW: `[data-amegmen-navigationwrapper]`,
    pauseBtn: `[data-amegmen-pause]`,
    playBtn: `[data-amegmen-play]`,
    root: `[data-amegmen]`,
    rootAuto: `[data-amegmen-auto]`,
    rtl: `[data-amegmen-rtl]`,
    scbar: `[data-amegmen-hasscrollbar]`,
    scbarB: `[data-amegmen-scrollbarthumb]`,
    scbarT: `[data-amegmen-scrollbartrack]`,
    scbarW: `[data-amegmen-scrollbarwrapper]`,
    slide: `[data-amegmen-slide]`,
    stitle: `[data-amegmen-title]`,
    totp: `[data-amegmen-totalpages]`,
    trk: `[data-amegmen-track]`,
    trkM: `[data-amegmen-trackMask]`,
    trkO: `[data-amegmen-trackOuter]`,
    trkW: `[data-amegmen-trackWrapper]`,
    ver: `[data-amegmen-vertical]`
  };
  const cDefaults: ISettings = {
    activeClass: `__amegmen-active`,
    actOnHover: false,
    animationEffect: cAnimationEffects[0],
    animationSpeed: 500,
    breakpoints: [],
    disabledClass: `__amegmen-disabled`,
    easingFunction: `linear`,
    editModeClass: `__amegmen-editmode`,
    hiddenClass: `__amegmen-hidden`,
    idPrefix: `__amegmen`,
    isRtl: false,
    l1Cols: 3,
    layout: 'mobile',
    touchThreshold: 125
  };
  const allLocalInstances: ICoreInstance = {};
  let iloop = 0;
  let jloop = 0;
  let windowResizeAny: any;
  let isWindowEventAttached = false;

  /**
   * Function to trim whitespaces from a string
   *
   * @param str - The string which needs to be trimmed
   *
   * @returns The trimmed string.
   *
   */
  const stringTrim = (str: string) => {
    return str.replace(/^\s+|\s+$|\s+(?=\s)/g, ``);
  };

  /**
   * Function to check wheather an element has a string in its class attribute
   *
   * @param element - An HTML Element
   * @param cls - A string
   *
   * @returns `true` if the string exists in class attribute, otherwise `false`
   *
   */
  const hasClass = (element: HTMLElement, cls: string) => {
    if (typeof element?.className === `string`) {
      const clsarr = element.className.split(` `);
      return clsarr.indexOf(cls) > -1 ? true : false;
    }

    return false;
  };

  /**
   * Function to add a string to an element`s class attribute
   *
   * @param element - An HTML Element
   * @param cls - A string
   *
   */
  const addClass = (element: HTMLElement, cls: string) => {
    if (typeof element?.className === `string`) {
      const clsarr = cls.split(` `);
      const clsarrLength = clsarr.length;
      for (iloop = 0; iloop < clsarrLength; iloop++) {
        const thiscls = clsarr[iloop];
        if (!hasClass(element, thiscls)) {
          element.className += ` ` + thiscls;
        }
      }
      element.className = stringTrim(element.className);
    }
  };

  /**
   * Function to remove a string from an element`s class attribute
   *
   * @param element - An HTML Element
   * @param cls - A string
   *
   */
  const removeClass = (element: HTMLElement, cls: string) => {
    if (typeof element?.className === `string`) {
      const clsarr = cls.split(` `);
      const curclass = element.className.split(` `);
      const curclassLen = curclass.length;
      for (iloop = 0; iloop < curclassLen; iloop++) {
        const thiscls = curclass[iloop];
        if (clsarr.indexOf(thiscls) > -1) {
          curclass.splice(iloop, 1);
          iloop--;
        }
      }
      element.className = stringTrim(curclass.join(` `));
    }
  };

  /**
   * Function to fix the decimal places to 4
   *
   * @param num - A number
   *
   * @returns A string converted by applying toFixed function with decimal places 4
   *
   */
  const toFixed4 = (num: number) => {
    return parseFloat(num.toFixed(4));
  };

  /**
   * Function to apply the settings to all the instances w.r.t. applicable breakpoint
   *
   */
  const winResizeFn = () => {
    if (typeof windowResizeAny !== `undefined`) {
      clearTimeout(windowResizeAny);
    }
    windowResizeAny = setTimeout(() => {
      for (const e in allLocalInstances) {
        if (allLocalInstances.hasOwnProperty(e)) {
          // applyLayout(allLocalInstances[e]);
        }
      }
    }, 0);
  };

  /**
   * Function to return the number of Instances created
   *
   */
  const getCoreInstancesLength = () => {
    return Object.keys(allLocalInstances).length;
  };

  /**
   *  ██████  ██████  ██████  ███████
   * ██      ██    ██ ██   ██ ██
   * ██      ██    ██ ██████  █████
   * ██      ██    ██ ██   ██ ██
   *  ██████  ██████  ██   ██ ███████
   *
   * Class for every AMegMen instance.
   *
   */
  class Core {
    /**
     * Constructor
     * @constructor
     */
    constructor(thisid: string, root: HTMLElement, options?: ISettings) {
      // allLocalInstances[thisid] = init(root, { ...cDefaults, ...options });
    }
  }

  /**
   * ██████   ██████   ██████  ████████
   * ██   ██ ██    ██ ██    ██    ██
   * ██████  ██    ██ ██    ██    ██
   * ██   ██ ██    ██ ██    ██    ██
   * ██   ██  ██████   ██████     ██
   *
   * Exposed Singleton Class for global usage.
   *
   */

  export class Root {
    protected static instance: Root | null = null;

    /**
     * Function to return single instance
     *
     * @returns Single amegmen Instance
     *
     */
    public static getInstance(): Root {
      if (!Root.instance) {
        Root.instance = new Root();
      }
      return Root.instance;
    }

    /**
     * Function to initialize the amegmen plugin for provided query strings.
     *
     * @param query - The CSS selector for which the amegmen needs to be initialized.
     * @param options - The optional object to customize every amegmen instance.
     *
     */
    public init = (query: string, options?: ISettings) => {
      query;
      options;
      cEasingFunctions;
      addClass;
      removeClass;
      toFixed4;
      const elements = document?.querySelectorAll(query);
      const elementsLength = elements.length;
      const instanceLength = getCoreInstancesLength();

      if (elementsLength > 0) {
        for (iloop = 0; iloop < elementsLength; iloop++) {
          const id = elements[iloop].getAttribute(`id`);
          let isElementPresent = false;
          if (id) {
            for (jloop = 0; jloop < instanceLength; jloop++) {
              if (allLocalInstances[id]) {
                isElementPresent = true;
                break;
              }
            }
          }

          if (!isElementPresent) {
            let newOptions;
            const autoDataAttr =
              (elements[iloop] as HTMLElement).getAttribute(
                cSelectors.rootAuto.slice(1, -1)
              ) || ``;
            if (autoDataAttr) {
              try {
                newOptions = JSON.parse(
                  stringTrim(autoDataAttr).replace(/'/g, `"`)
                );
              } catch (e) {
                // throw new TypeError(cOptionsParseTypeError);
                console.error(cOptionsParseTypeError);
              }
            } else {
              newOptions = options;
            }
            if (id) {
              new Core(id, elements[iloop] as HTMLElement, newOptions);
            } else {
              const thisid = id
                ? id
                : { ...cDefaults, ...newOptions }.idPrefix +
                  `_` +
                  new Date().getTime() +
                  `_root_` +
                  (iloop + 1);
              elements[iloop].setAttribute(`id`, thisid);
              new Core(thisid, elements[iloop] as HTMLElement, newOptions);
            }
          }
        }
        if (window && getCoreInstancesLength() > 0 && !isWindowEventAttached) {
          isWindowEventAttached = true;
          window.addEventListener(`resize`, winResizeFn, false);
        }
      } else {
        if (query !== cSelectors.rootAuto) {
          // throw new TypeError(cRootSelectorTypeError);
          console.error(`init() "${query}": ${cRootSelectorTypeError}`);
        }
      }
    };

    /**
     * Function to auto-initialize the amegmen plugin for specific amegmens
     */
    public initGlobal = () => {
      this.init(cSelectors.rootAuto, {} as ISettings);
    };
    protected destroy = (query: string) => {
      query;
    };
  }
}
AMegMen.Root.getInstance().initGlobal();
if (typeof exports === `object` && typeof module !== `undefined`) {
  module.exports = AMegMen;
}
