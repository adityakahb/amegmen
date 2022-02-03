/**
 *  █████  ███    ███ ███████  ██████  ███    ███ ███████ ███    ██
 * ██   ██ ████  ████ ██      ██       ████  ████ ██      ████   ██
 * ███████ ██ ████ ██ █████   ██   ███ ██ ████ ██ █████   ██ ██  ██
 * ██   ██ ██  ██  ██ ██      ██    ██ ██  ██  ██ ██      ██  ██ ██
 * ██   ██ ██      ██ ███████  ██████  ██      ██ ███████ ██   ████
 *
 * AMegMen Namespace contains the Root class, Core class and related constants.
 *
 */
namespace AMegMen {
  `use strict`;
  interface ISettings {
    activeClass: string;
    actOnHover: boolean;
    afterInitFn?: Function;
    animationSpeed: number;
    appendUrlHash: boolean;
    beforeInitFn?: Function;
    disabledClass: string;
    editModeClass: string;
    hiddenClass: string;
    idPrefix: string;
    isRtl: boolean;
  }
  interface ITimer {
    id: any;
    elapsed: number;
    nextX: number;
    o: number;
    position: number;
    prevX: number;
    progress: number;
    start: number;
    total: number;
  }
  interface ICoreSettings {
    activeCls: string;
    disableCls: string;
    editCls: string;
    hidCls: string;
  }
  interface ICore {
    _t: ITimer;
    canvas: HTMLElement | null;
    cCta: HTMLElement | null;
    eHandlers: any[];
    l0a: NodeListOf<Element>;
    l0li: NodeListOf<Element>;
    l0ul: NodeListOf<Element>;
    l1a: NodeListOf<Element>;
    l1li: NodeListOf<Element>;
    l1ul: NodeListOf<Element>;
    l2a: NodeListOf<Element>;
    l2li: NodeListOf<Element>;
    l2ul: NodeListOf<Element>;
    l3a: NodeListOf<Element>;
    l3li: NodeListOf<Element>;
    l3ul: NodeListOf<Element>;
    l1W: NodeListOf<Element>;
    l1H: NodeListOf<Element>;
    l2W: NodeListOf<Element>;
    l2H: NodeListOf<Element>;
    l3W: NodeListOf<Element>;
    l3H: NodeListOf<Element>;
    l4W: NodeListOf<Element>;
    l4H: NodeListOf<Element>;
    oCta: HTMLElement | null;
    opts: ICoreSettings;
    root: HTMLElement | null;
  }
  interface ICoreInstance {
    [key: string]: ICore;
  }
  interface IEventHandler {
    element: Element | Document | Window;
    remove: Function;
  }
  const _rootSelectorTypeError = `Element(s) with the provided query do(es) not exist`;
  const _optionsParseTypeError = `Unable to parse the options string`;
  const _useCapture = false;
  const _Selectors = {
    canvas: `[data-amegmen-canvas]`,
    cCta: `[data-amegmen-closecta]`,
    l0ul: `[data-amegmen-navl0]`,
    l1H: `[data-amegmen-navllheader]`,
    l1ul: `[data-amegmen-navl1]`,
    l1W: `[data-amegmen-navl1wrap]`,
    l2H: `[data-amegmen-navl2header]`,
    l2ul: `[data-amegmen-navl2]`,
    l2W: `[data-amegmen-navl2wrap]`,
    l3H: `[data-amegmen-navl3header]`,
    l3ul: `[data-amegmen-navl3]`,
    l3W: `[data-amegmen-navl3wrap]`,
    l4H: `[data-amegmen-navl4header]`,
    l4W: `[data-amegmen-navl4wrap]`,
    oCta: `[data-amegmen-opencta]`,
    root: `[data-amegmen]`,
    rootAuto: `[data-amegmen-auto]`,
    rtl: `[data-amegmen-rtl]`,
  };
  const _Defaults: ISettings = {
    activeClass: `__amegmen-active`,
    actOnHover: false,
    animationSpeed: 500,
    appendUrlHash: false,
    disabledClass: `__amegmen-disabled`,
    editModeClass: `__amegmen-editmode`,
    hiddenClass: `__amegmen-hidden`,
    idPrefix: `__amegmen`,
    isRtl: false,
  };

  let allLocalInstances: ICoreInstance = {};
  let isWindowEventAttached = false;
  let windowResizeAny: any;

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
  const hasClass = (element: Element, cls: string) => {
    if (element && typeof element.className === `string`) {
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
  const addClass = (element: Element, cls: string) => {
    if (element && typeof element.className === `string`) {
      let clsarr = cls.split(` `);
      let clsarrLength = clsarr.length;
      for (let i = 0; i < clsarrLength; i++) {
        let thiscls = clsarr[i];
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
  const removeClass = (element: Element, cls: string) => {
    if (element && typeof element.className === `string`) {
      let clsarr = cls.split(` `);
      let curclass = element.className.split(` `);
      let curclassLen = curclass.length;
      for (let i = 0; i < curclassLen; i++) {
        let thiscls = curclass[i];
        if (clsarr.indexOf(thiscls) > -1) {
          curclass.splice(i, 1);
          i--;
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
    return num.toFixed(4);
  };

  /**
   * Function to apply the settings to all the instances w.r.t. applicable breakpoint
   *
   */
  const winResizeFn = () => {
    if (typeof windowResizeAny !== `undefined`) {
      clearTimeout(windowResizeAny);
    }
    windowResizeAny = setTimeout(() => {}, 0);
  };
  /**
   * Function to return the number of Instances created
   *
   */
  const getCoreInstancesLength = () => {
    return Object.keys(allLocalInstances).length;
  };

  /**
   * Function to remove all local events assigned to the navigation elements.
   *
   * @param core - Carouzel instance core object
   * @param element - An HTML Element from which the events need to be removed
   *
   */
  const removeEventListeners = (
    core: any,
    element: Element | Document | Window
  ) => {
    let j = core.eHandlers.length;
    while (j--) {
      if (
        core.eHandlers[j].element.isEqualNode &&
        core.eHandlers[j].element.isEqualNode(element)
      ) {
        core.eHandlers[j].remove();
        core.eHandlers.splice(j, 1);
      }
    }
  };

  /**
   * Function to remove all local events assigned to the navigation elements.
   *
   * @param element - An HTML Element which needs to be assigned an event
   * @param type - Event type
   * @param listener - The Event handler function
   *
   * @returns The event handler object
   *
   */
  const eventHandler = (
    element: Element | Document | Window,
    type: string,
    listener: EventListenerOrEventListenerObject
  ) => {
    const eventHandler: IEventHandler = {
      element: element,
      remove: () => {
        element.removeEventListener(type, listener, _useCapture);
      },
    };
    element.addEventListener(type, listener, _useCapture);
    return eventHandler;
  };

  const toggleEvents = (core: ICore) => {
    if (core.oCta && core.canvas && core.root) {
      core.eHandlers.push(
        eventHandler(core.oCta, `click`, function (event: Event) {
          event.preventDefault();
          if (hasClass(core.oCta as Element, core.opts.activeCls)) {
            removeClass(core.root as Element, core.opts.activeCls);
            removeClass(core.canvas as Element, core.opts.activeCls);
            removeClass(core.oCta as Element, core.opts.activeCls);
          } else {
            addClass(core.root as Element, core.opts.activeCls);
            addClass(core.canvas as Element, core.opts.activeCls);
            addClass(core.oCta as Element, core.opts.activeCls);
          }
        })
      );
    }
    if (core.cCta && core.canvas && core.root) {
      core.eHandlers.push(
        eventHandler(core.cCta, `click`, function (event: Event) {
          event.preventDefault();
          removeClass(core.root as Element, core.opts.activeCls);
          removeClass(core.canvas as Element, core.opts.activeCls);
          removeClass(core.oCta as Element, core.opts.activeCls);
        })
      );
    }
    for (let i = 0; i < core.l0a.length; i++) {
      let parent = core.l0a[i].closest('li');
      if (parent && parent.querySelector(_Selectors.l1W)) {
        core.eHandlers.push(
          eventHandler(core.l0a[i], `click`, function (event: Event) {
            event.preventDefault();
          })
        );
      }
    }
  };

  /**
   * Function to map default and custom settings to Core settings with shorter names
   *
   * @param settings - Settings object containing merge of default and custom settings
   *
   */
  const mapSettings = (settings: ISettings) => {
    let settingsobj: ICoreSettings = {
      activeCls: settings.activeClass,
      disableCls: settings.disabledClass,
      editCls: settings.editModeClass,
      hidCls: settings.hiddenClass,
    };
    return settingsobj;
  };
  /**
   * Function to initialize the carouzel core object and assign respective events
   *
   * @param core - Carouzel instance core object
   *
   */
  const init = (root: HTMLElement, settings: ISettings) => {
    if (typeof settings.beforeInitFn === `function`) {
      settings.beforeInitFn();
    }
    let _core = <ICore>{};
    _core.root = root;
    _core.eHandlers = [];
    _core.opts = mapSettings(settings);
    _core.canvas = root.querySelector(`${_Selectors.canvas}`);
    _core.cCta = root.querySelector(`${_Selectors.cCta}`);
    _core.oCta = root.querySelector(`${_Selectors.oCta}`);
    _core.l0ul = root.querySelectorAll(`${_Selectors.l0ul}`);
    _core.l0li = root.querySelectorAll(`${_Selectors.l0ul} > li`);
    _core.l0a = root.querySelectorAll(`${_Selectors.l0ul} > li > a`);
    _core.l1W = root.querySelectorAll(
      `${_Selectors.l0ul} > li > ${_Selectors.l1W}`
    );
    console.log(_core);
    toggleEvents(_core);
    return _core;
  };
  removeEventListeners;
  eventHandler;
  addClass;
  removeClass;
  toFixed4;
  /**
   *  ██████  ██████  ██████  ███████
   * ██      ██    ██ ██   ██ ██
   * ██      ██    ██ ██████  █████
   * ██      ██    ██ ██   ██ ██
   *  ██████  ██████  ██   ██ ███████
   *
   * Class for every Carouzel instance.
   *
   */
  class Core {
    constructor(thisid: string, root: HTMLElement, options?: ISettings) {
      allLocalInstances[thisid] = init(root, { ..._Defaults, ...options });
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
     * Constructor to initiate polyfills
     *
     */
    constructor() {
      this.init(_Selectors.rootAuto);
    }
    /**
     * Function to return single instance
     *
     * @returns Single Carouzel Instance
     *
     */
    public static getInstance(): Root {
      if (!Root.instance) {
        Root.instance = new Root();
      }
      return Root.instance;
    }

    /**
     * Function to return count of all available carouzel objects
     *
     * @returns count of all available carouzel objects
     *
     */
    protected getLength = () => {
      getCoreInstancesLength();
    };

    /**
     * Function to initialize the Carouzel plugin for provided query strings.
     *
     * @param query - The CSS selector for which the Carouzel needs to be initialized.
     * @param options - The optional object to customize every Carouzel instance.
     *
     */
    public init = (query: string, options?: ISettings) => {
      const elements = document?.querySelectorAll(query);
      const elementsLength = elements.length;
      const instanceLength = getCoreInstancesLength();

      if (elementsLength > 0) {
        for (let i = 0; i < elementsLength; i++) {
          const id = elements[i].getAttribute(`id`);
          let isElementPresent = false;
          if (id) {
            for (let j = 0; j < instanceLength; j++) {
              if (allLocalInstances[id]) {
                isElementPresent = true;
                break;
              }
            }
          }

          if (!isElementPresent) {
            let newOptions;
            let autoDataAttr =
              (elements[i] as HTMLElement).getAttribute(
                _Selectors.rootAuto.slice(1, -1)
              ) || ``;
            if (autoDataAttr) {
              try {
                newOptions = JSON.parse(
                  stringTrim(autoDataAttr).replace(/'/g, `"`)
                );
              } catch (e) {
                // throw new TypeError(_optionsParseTypeError);
                console.error(_optionsParseTypeError);
              }
            } else {
              newOptions = options;
            }
            if (id) {
              new Core(id, elements[i] as HTMLElement, newOptions);
            } else {
              const thisid = id
                ? id
                : { ..._Defaults, ...newOptions }.idPrefix +
                  `_` +
                  new Date().getTime() +
                  `_root_` +
                  (i + 1);
              elements[i].setAttribute(`id`, thisid);
              new Core(thisid, elements[i] as HTMLElement, newOptions);
            }
          }
        }
        if (getCoreInstancesLength() > 0 && !isWindowEventAttached) {
          isWindowEventAttached = true;
          window?.addEventListener(`resize`, winResizeFn, false);
        }
      } else {
        if (query !== _Selectors.rootAuto) {
          // throw new TypeError(_rootSelectorTypeError);
          console.error(`init() "${query}": ${_rootSelectorTypeError}`);
        }
      }
    };
  }
}
if (typeof exports === `object` && typeof module !== `undefined`) {
  module.exports = AMegMen;
}
