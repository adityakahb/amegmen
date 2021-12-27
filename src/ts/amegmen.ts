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
  let AllAMegMenInstances: any = {};
  let active_amegmen: any = {};

  interface IAMegMenRoot {
    [key: string]: any;
  }
  interface IAMegMenSettings {
    activeCls: string;
    actOnHover?: boolean;
    actOnHoverAt?: number;
    backBtnCls: string;
    closeBtnCls: string;
    colCls: string;
    colShiftCls: string;
    colWidthCls: string;
    focusCls: string;
    hoverCls: string;
    idPrefix?: string;
    isRTL?: boolean;
    l0AnchorCls: string;
    l0PanelCls: string;
    l1ActiveCls: string;
    l1AnchorCls: string;
    l1PanelCls: string;
    l2ActiveCls: string;
    l2AnchorCls: string;
    landingCtaCls: string;
    lastColCls: string;
    mainBtnCls: string;
    mainElementCls: string;
    offcanvasCls: string;
    overflowHiddenCls: string;
    panelCls: string;
    rootCls: string;
    rtlCls: string;
    shiftColumns?: boolean;
    supportedCols?: number;
    toggleBtnCls: string;
  }
  interface IAMegMenCore {
    closenav: HTMLElement | null;
    eHandlers: any[];
    l0nav: IAMegMenL0[];
    mainEl: HTMLElement | null;
    offcanvas: HTMLElement | null;
    root: HTMLElement | null;
    opts: IAMegMenSettings;
    togglenav: HTMLElement | null;
    tomain: NodeListOf<Element>;
    toprev: NodeListOf<Element>;
  }
  interface IAMegMenEventHandler {
    currentElement: HTMLElement | null;
    removeEvent?: Function;
  }
  interface IAMegMenL0 {
    l0li: HTMLElement | null;
    l0anchor: HTMLElement | null;
    l0panel: HTMLElement | null;
    l0tomain: HTMLElement | null;
    navelement: HTMLElement | null;
    l1cols: number;
    l1nav: IAMegMenL1[];
  }
  interface IAMegMenL1 {
    l1li: HTMLElement | null;
    l1anchor: HTMLElement | null;
    l1panel: HTMLElement | null;
    l1tomain: HTMLElement | null;
    l1toback: HTMLElement | null;
    navelement: HTMLElement | null;
    l2cols: number;
    l2nav: NodeListOf<Element>;
  }
  const _useCapture = false;
  const _Defaults = {
    activeCls: `__amegmen-active`,
    actOnHover: false,
    actOnHoverAt: 1280,
    backBtnCls: `__amegmen--back-cta`,
    closeBtnCls: `__amegmen--close-cta`,
    colCls: `__amegmen--col`,
    colShiftCls: `__amegmen-shift`,
    colWidthCls: `__amegmen-width`,
    focusCls: `__amegmen-focus`,
    hoverCls: `__amegmen-hover`,
    idPrefix: `__amegmen_id`,
    isRTL: false,
    l0AnchorCls: `__amegmen--anchor-l0`,
    l0PanelCls: `__amegmen--panel-l0`,
    l1ActiveCls: `__amegmen--l1-active`,
    l1AnchorCls: `__amegmen--anchor-l1`,
    l1PanelCls: `__amegmen--panel-l1`,
    l2ActiveCls: `__amegmen--l2-active`,
    l2AnchorCls: `__amegmen--anchor-l2`,
    landingCtaCls: `__amegmen--landing`,
    lastColCls: `__amegmen--col-last`,
    mainBtnCls: `__amegmen--main-cta`,
    mainElementCls: `__amegmen--main`,
    offcanvasCls: `__amegmen--canvas`,
    overflowHiddenCls: `__amegmen--nooverflow`,
    panelCls: `__amegmen--panel`,
    rootCls: `__amegmen`,
    rtlCls: `__amegmen--r-to-l`,
    shiftColumns: false,
    supportedCols: 4,
    toggleBtnCls: `__amegmen--toggle-cta`,
  };

  /**
   * Polyfill function for `:scope` for `QuerySelector` and `QuerySelectorAll`
   *
   */
  const _EnableQSQSAScope = () => {
    try {
      window.document.querySelector(`:scope body`);
    } catch (err) {
      const qsarr = [`querySelector`, `querySelectorAll`];
      for (let i = 0; i < qsarr.length; i++) {
        let nativ = (Element.prototype as any)[qsarr[i]];
        (Element.prototype as any)[qsarr[i]] = function (selectors: string) {
          if (/(^|,)\s*:scope/.test(selectors)) {
            let id = this.id;
            this.id = `ID_` + Date.now();
            selectors = selectors.replace(/((^|,)\s*):scope/g, `$1#` + this.id);
            let result = (window.document as any)[qsarr[i]](selectors);
            this.id = id;
            return result;
          } else {
            return nativ.call(this, selectors);
          }
        };
      }
    }
  };

  /**
   * Polyfill function for `Element.closest`
   *
   */
  const _EnableClosest = () => {
    if (!Element.prototype.matches) {
      Element.prototype.matches =
        (Element.prototype as any).msMatchesSelector ||
        Element.prototype.webkitMatchesSelector;
    }

    if (!Element.prototype.closest) {
      Element.prototype.closest = function (s: string) {
        var el = this;

        do {
          if (Element.prototype.matches.call(el, s)) return el;
          const parent = el.parentElement || el.parentNode;
          if (parent) {
            el = parent as Element;
          }
        } while (el !== null && el.nodeType === 1);
        return null;
      };
    }
  };

  /**
   * Function to trim whitespaces from a string
   *
   * @param str - The string which needs to be trimmed
   *
   * @returns The trimmed string.
   *
   */
  const _StringTrim = (str: string) => {
    return str.replace(/^\s+|\s+$/g, ``);
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
  const _HasClass = (element: Element, cls: string) => {
    if (element && typeof element.className === `string`) {
      const clsarr = (element as HTMLElement).className.split(` `);
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
  const _AddClass = (element: Element, cls: string) => {
    if (element && typeof element.className === `string`) {
      let clsarr = cls.split(` `);
      let clsarrLength = clsarr.length;
      for (let i = 0; i < clsarrLength; i++) {
        let thiscls = clsarr[i];
        if (!_HasClass(element, thiscls)) {
          (element as HTMLElement).className += ` ` + thiscls;
        }
      }
      (element as HTMLElement).className = _StringTrim(element.className);
    }
  };

  /**
   * Function to remove a string from an element`s class attribute
   *
   * @param element - An HTML Element
   * @param cls - A string
   *
   */
  const _RemoveClass = (element: Element, cls: string) => {
    if (element && typeof element.className === `string`) {
      let clsarr = cls.split(` `);
      let curclass = element.className.split(` `);
      let curclassLength = curclass.length;
      for (let i = 0; i < curclassLength; i++) {
        let thiscls = curclass[i];
        if (clsarr.indexOf(thiscls) > -1) {
          curclass.splice(i, 1);
          i--;
        }
      }
      (element as HTMLElement).className = _StringTrim(curclass.join(` `));
    }
  };

  /**
   * Function to add a unique id attribute if it is not present already.
   * This is required to monitor the outside click and hover behavior
   *
   * @param element - An HTML Element
   * @param settings - Options specific to individual AMegMen instance
   * @param unique_number - A unique number as additional identification
   * @param shouldAdd - If `true`, adds an id. Otherwise it is removed.
   *
   */
  const _ToggleUniqueId = (
    element: HTMLElement,
    settings: IAMegMenSettings,
    unique_number: number,
    shouldAddId: boolean
  ) => {
    if (settings.idPrefix) {
      if (shouldAddId && !element.getAttribute(`id`)) {
        element.setAttribute(
          `id`,
          `${settings.idPrefix}_${new Date().getTime()}_${unique_number}`
        );
      } else if (!shouldAddId && element.getAttribute(`id`)) {
        const thisid = element.getAttribute(`id`);
        const regex = new RegExp(settings.idPrefix, `gi`);
        if (regex.test(thisid || ``)) {
          element.removeAttribute(`id`);
        }
      }
    }
  };

  /**
   * Function to remove all local events assigned to the navigation elements.
   *
   * @param core - AMegMen instance core object
   * @param element - An HTML Element from which the events need to be removed
   *
   */
  const amm_removeEventListeners = (core: IAMegMenCore, element: Element) => {
    if ((core.eHandlers || []).length > 0) {
      let j = core.eHandlers.length;
      while (j--) {
        if (
          core.eHandlers[j].currentElement.isEqualNode &&
          core.eHandlers[j].currentElement.isEqualNode(element)
        ) {
          core.eHandlers[j].removeEvent();
          core.eHandlers.splice(j, 1);
        }
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
  const amm_eventHandler = (
    element: HTMLElement,
    type: string,
    listener: EventListenerOrEventListenerObject
  ) => {
    const eventHandler: IAMegMenEventHandler = {
      currentElement: element,
      removeEvent: () => {
        element.removeEventListener(type, listener, _useCapture);
      },
    };
    element.addEventListener(type, listener, _useCapture);
    return eventHandler;
  };

  /**
   * Function to close the Level 1 and Level 2 Megamenues if click or hover happens on document or window
   *
   * @param event - `click` or `mouseover` event to close the megamenu
   * @param overflowHiddenCls - Class which disables scrollbars on mobile
   * @param activeCls - Class which activates the megamenu links and panels
   * @param eventtype - Is `click` or `mouseover`
   *
   */
  const amm_document_out = (
    event: Event,
    overflowHiddenCls: string,
    activeCls: string,
    l1ActiveCls: string,
    l2ActiveCls: string,
    eventtype: string
  ) => {
    if (event && _StringTrim(active_amegmen.closestl0li || ``).length > 0) {
      const closest = (event.target as HTMLElement).closest(
        `#${active_amegmen.closestl0li}`
      );
      if (!closest) {
        amm_subnavclose(
          true,
          overflowHiddenCls,
          activeCls,
          l1ActiveCls,
          l2ActiveCls,
          eventtype
        );
      }
    }
  };

  /**
   * Function to close the Level 2 Megamenu if click or hover happens on Level 1 Megamenu Panel
   *
   * @param event - `click` or `mouseover` event to close the megamenu
   * @param overflowHiddenCls - Class which disables scrollbars on mobile
   * @param activeCls - Class which activates the megamenu links and panels
   * @param eventtype - Is `click` or `mouseover`
   *
   */
  const amm_subnav_out = (
    event: Event,
    overflowHiddenCls: string,
    activeCls: string,
    l1ActiveCls: string,
    l2ActiveCls: string,
    eventtype: string
  ) => {
    if (event && _StringTrim(active_amegmen.closestl1li || ``).length > 0) {
      const closest = (event.target as HTMLElement).closest(
        `#${active_amegmen.closestl1li}`
      );
      if (!closest) {
        amm_subnavclose(
          false,
          overflowHiddenCls,
          activeCls,
          l1ActiveCls,
          l2ActiveCls,
          eventtype
        );
      }
    }
  };

  /**
   * Function to close the Megamenu Panel
   *
   * @param shouldCloseL0Panel - If `true`, loses Level 0 and Level 1 Panels. Otherwise closes Level 1 panels only
   * @param overflowHiddenCls - Class which disables scrollbars on mobile
   * @param activeCls - Class which activates the megamenu links and panels
   * @param eventtype - Is `click` or `mouseover`
   *
   */
  const amm_subnavclose = (
    shouldCloseL0Panel: boolean,
    overflowHiddenCls: string,
    activeCls: string,
    l1ActiveCls: string,
    l2ActiveCls: string,
    eventtype: string
  ) => {
    for (let i in AllAMegMenInstances) {
      const thiscore = AllAMegMenInstances[i];
      const rootElem = thiscore.root;
      const offcanvas = thiscore.offcanvas;
      let shouldExecute = false;
      if (
        eventtype === `mouseover` &&
        (thiscore.settings || {}).actOnHover === true
      ) {
        shouldExecute = true;
      }
      if (eventtype === `click`) {
        shouldExecute = true;
      }
      if (shouldExecute && _HasClass(rootElem, activeCls)) {
        const mainElem = thiscore.mainEl;
        const l0nav = thiscore.l0nav || [];
        if (shouldCloseL0Panel) {
          _RemoveClass(offcanvas, l1ActiveCls);
          _RemoveClass(rootElem, activeCls);
          _RemoveClass(mainElem, overflowHiddenCls);
        }
        _RemoveClass(offcanvas, l2ActiveCls);
        for (let j = l0nav.length - 1; j >= 0; j--) {
          let thisl0 = l0nav[j] || {};
          if (shouldCloseL0Panel) {
            if (thisl0.l0anchor) {
              _RemoveClass(thisl0.l0anchor, activeCls);
              thisl0.l0anchor.setAttribute(`aria-expanded`, `false`);
            }
            if (thisl0.l0panel) {
              _RemoveClass(thisl0.l0panel, activeCls);
              thisl0.l0panel.setAttribute(`aria-expanded`, `false`);
              thisl0.l0panel.setAttribute(`aria-hidden`, `true`);
            }
          }
          if (thisl0.navelement) {
            _RemoveClass(thisl0.navelement, overflowHiddenCls);
          }
          const l1nav = thisl0.l1nav || [];
          if (l1nav.length > 0) {
            for (let k = l1nav.length - 1; k >= 0; k--) {
              let thisl1 = l1nav[k] || {};
              if (thisl1.l1anchor) {
                _RemoveClass(thisl1.l1anchor, activeCls);
                thisl1.l1anchor.setAttribute(`aria-expanded`, `false`);
              }
              if (thisl1.l1panel) {
                _RemoveClass(thisl1.l1panel, activeCls);
                thisl1.l1panel.setAttribute(`aria-expanded`, `false`);
                thisl1.l1panel.setAttribute(`aria-hidden`, `true`);
              }
            }
          }
        }
      }
    }
  };

  /**
   * Mouseenter event for Landing link on the panels
   *
   * @param landingElement - An HTML Element
   * @param hoverCls - CSS Class for hovered element
   *
   */
  const amm_landingMouseenterFn = (
    landingElement: HTMLElement,
    hoverCls: string
  ) => {
    _AddClass(landingElement, hoverCls);
  };

  /**
   * Mouseleave event for Landing link on the panels
   *
   * @param landingElement - An HTML Element
   * @param hoverCls - CSS Class for hovered element
   *
   */
  const amm_landingMouseleaveFn = (
    landingElement: HTMLElement,
    hoverCls: string
  ) => {
    _RemoveClass(landingElement, hoverCls);
  };

  /**
   * Focus event for Landing link on the panels
   *
   * @param landingElement - An HTML Element
   * @param focusCls - CSS Class for focussed element
   *
   */
  const amm_landingFocusFn = (
    landingElement: HTMLElement,
    focusCls: string
  ) => {
    _AddClass(landingElement, focusCls);
  };

  /**
   * Blur event for Landing link on the panels
   *
   * @param landingElement - An HTML Element
   * @param focusCls - CSS Class for focussed element
   *
   */
  const amm_landingBlurFn = (landingElement: HTMLElement, focusCls: string) => {
    _RemoveClass(landingElement, focusCls);
  };

  /**
   * Focus event for Level 0 link
   *
   * @param l0anchor - An HTML Anchor element at Level 0 Navigation
   * @param focusCls - CSS Class for focussed element
   *
   */
  const amm_l0FocusFn = (l0anchor: HTMLElement, focusCls: string) => {
    _AddClass(l0anchor, focusCls);
  };

  /**
   * Blur event for Level 0 link
   *
   * @param l0anchor - An HTML Anchor element at Level 0 Navigation
   * @param focusCls - CSS Class for focussed element
   *
   */
  const amm_l0BlurFn = (l0anchor: HTMLElement, focusCls: string) => {
    _RemoveClass(l0anchor, focusCls);
  };

  /**
   * Focus event for Level 1 link
   *
   * @param l1anchor - An HTML Anchor element at Level 1 Navigation
   * @param focusCls - CSS Class for focussed element
   *
   */
  const amm_l1FocusFn = (l1anchor: HTMLElement, focusCls: string) => {
    _AddClass(l1anchor, focusCls);
  };

  /**
   * Blur event for Level 1 link
   *
   * @param l1anchor - An HTML Anchor element at Level 1 Navigation
   * @param focusCls - CSS Class for focussed element
   *
   */
  const amm_l1BlurFn = (l1anchor: HTMLElement, focusCls: string) => {
    _RemoveClass(l1anchor, focusCls);
  };

  /**
   * Mouseenter event for Level 2 link
   *
   * @param l2anchor - An HTML Anchor element at Level 2 Navigation
   * @param hoverCls - CSS Class for hovered element
   *
   */
  const amm_l2MouseenterFn = (l2anchor: HTMLElement, hoverCls: string) => {
    _AddClass(l2anchor, hoverCls);
  };

  /**
   * Mouseleave event for Level 2 link
   *
   * @param l2anchor - An HTML Anchor element at Level 2 Navigation
   * @param hoverCls - CSS Class for hovered element
   *
   */
  const amm_l2MouseleaveFn = (l2anchor: HTMLElement, hoverCls: string) => {
    _RemoveClass(l2anchor, hoverCls);
  };

  /**
   * Focus event for Level 2 link
   *
   * @param l2anchor - An HTML Anchor element at Level 2 Navigation
   * @param focusCls - CSS Class for focussed element
   *
   */
  const amm_l2FocusFn = (l2anchor: HTMLElement, focusCls: string) => {
    _AddClass(l2anchor, focusCls);
  };

  /**
   * Blur event for Level 2 link
   *
   * @param l2anchor - An HTML Anchor element at Level 2 Navigation
   * @param focusCls - CSS Class for focussed element
   *
   */
  const amm_l2BlurFn = (l2anchor: HTMLElement, focusCls: string) => {
    _RemoveClass(l2anchor, focusCls);
  };

  /**
   * Click event for Level 0 link
   *
   * @param event - `click` event to prevent the default action when subnav panel is present
   * @param l0anchor - An HTML Anchor element at Level 0 Navigation
   * @param l0panel - Adjecent Panel to the l0anchor
   * @param parent - Parent LI element
   * @param mainElem - Main Wrapper which contains the navigation elements
   * @param overflowHiddenCls - Class which disables scrollbars on mobile
   * @param activeCls - Class for active elements
   * @param eventtype - `Click` or `Mouseenter` for hoverable megamenues
   *
   */
  const amm_l0ClickFn = (
    event: Event,
    l0anchor: HTMLElement | null,
    l0panel: HTMLElement | null,
    parent: HTMLElement | null,
    mainElem: HTMLElement | null,
    offcanvas: HTMLElement | null,
    overflowHiddenCls: string,
    activeCls: string,
    l1ActiveCls: string,
    l2ActiveCls: string,
    eventtype: string
  ) => {
    if (event && l0panel) {
      event.preventDefault();
    }
    if (l0anchor && _HasClass(l0anchor, activeCls)) {
      (active_amegmen as any).elem = null;
      (active_amegmen as any).closestl0li = ``;
      amm_subnavclose(
        true,
        overflowHiddenCls,
        activeCls,
        l1ActiveCls,
        l2ActiveCls,
        eventtype
      );
    } else {
      if (l0anchor && l0panel && parent && offcanvas && mainElem) {
        amm_subnavclose(
          true,
          overflowHiddenCls,
          activeCls,
          l1ActiveCls,
          l2ActiveCls,
          eventtype
        );
        (active_amegmen as any).elem = parent;
        (active_amegmen as any).closestl0li = (
          l0anchor.closest(`li`) as HTMLElement
        ).getAttribute(`id`);
        l0anchor.setAttribute(`aria-expanded`, `true`);
        l0panel.setAttribute(`aria-expanded`, `true`);
        l0panel.setAttribute(`aria-hidden`, `false`);
        _AddClass(parent, activeCls);
        _AddClass(offcanvas, l1ActiveCls);
        _AddClass(l0anchor, activeCls);
        _AddClass(l0panel, activeCls);
        _AddClass(mainElem, overflowHiddenCls);
      }
    }
  };

  /**
   * Mouseenter event for Level 0 link
   *
   * @param l0anchor - An HTML Anchor element at Level 0 Navigation
   * @param hoverCls - Class for hovered elements
   * @param actOnHover - If `true`, megamenu activates on hover
   * @param actOnHoverAt - The minimum breakpoint at or after which the hover will work
   *
   */
  const amm_l0MouseenterFn = (
    l0anchor: HTMLElement,
    hoverCls: string,
    actOnHover: boolean,
    actOnHoverAt: number
  ) => {
    _AddClass(l0anchor, hoverCls);
    if (actOnHover) {
      const windowwidth =
        window.innerWidth ||
        document.documentElement.clientWidth ||
        document.body.clientWidth;
      if (windowwidth >= actOnHoverAt) {
        l0anchor.click();
      }
    }
  };

  /**
   * Mouseleave event for Level 0 link
   *
   * @param l0anchor - An HTML Anchor element at Level 0 Navigation
   * @param hoverCls - Class for hovered elements
   *
   */
  const amm_l0MouseleaveFn = (l0anchor: HTMLElement, hoverCls: string) => {
    _RemoveClass(l0anchor, hoverCls);
  };

  /**
   * Click event for Level 1 link
   *
   * @param event - `click` event to prevent the default action when subnav panel is present
   * @param l1anchor - An HTML Anchor element at Level 1 Navigation
   * @param l1panel - Adjecent Panel to the l1anchor
   * @param l0navelement - Parent `nav` element of l1anchor
   * @param overflowHiddenCls - Class which disables scrollbars on mobile
   * @param activeCls - Class for active elements
   * @param eventtype - `Click` or `Mouseenter` for hoverable megamenues
   *
   */
  const amm_l1ClickFn = (
    event: Event,
    l1anchor: HTMLElement | null,
    l1panel: HTMLElement | null,
    offcanvas: HTMLElement | null,
    l0navelement: HTMLElement | null,
    overflowHiddenCls: string,
    activeCls: string,
    l1ActiveCls: string,
    l2ActiveCls: string,
    eventtype: string
  ) => {
    if (event && l1panel) {
      event.preventDefault();
    }
    if (l1anchor && _HasClass(l1anchor, activeCls)) {
      (active_amegmen as any).closestl1li = ``;
      amm_subnavclose(
        false,
        overflowHiddenCls,
        activeCls,
        l1ActiveCls,
        l2ActiveCls,
        eventtype
      );
    } else {
      if (l1anchor && l1panel && offcanvas && l0navelement) {
        (active_amegmen as any).closestl1li = (
          l1anchor.closest(`li`) as HTMLElement
        ).getAttribute(`id`);
        amm_subnavclose(
          false,
          overflowHiddenCls,
          activeCls,
          l1ActiveCls,
          l2ActiveCls,
          eventtype
        );
        l1anchor.setAttribute(`aria-expanded`, `true`);
        l1panel.setAttribute(`aria-expanded`, `true`);
        l1panel.setAttribute(`aria-hidden`, `false`);
        _AddClass(offcanvas, l2ActiveCls);
        _AddClass(l1anchor, activeCls);
        _AddClass(l1panel, activeCls);
        _AddClass(l0navelement, overflowHiddenCls);
      }
    }
  };

  /**
   * Mouseenter event for Level 1 link
   *
   * @param l1anchor - An HTML Anchor element at Level 1 Navigation
   * @param hoverCls - Class for hovered elements
   * @param actOnHover - If `true`, megamenu activates on hover
   * @param actOnHoverAt - The minimum breakpoint at or after which the hover will work
   *
   */
  const amm_l1MouseenterFn = (
    l1anchor: HTMLElement,
    hoverCls: string,
    actOnHover: boolean,
    actOnHoverAt: number
  ) => {
    _AddClass(l1anchor, hoverCls);
    if (actOnHover) {
      const windowwidth =
        window.innerWidth ||
        document.documentElement.clientWidth ||
        document.body.clientWidth;
      if (windowwidth >= actOnHoverAt) {
        l1anchor.click();
      }
    }
  };

  /**
   * Mouseleave event for Level 1 link
   *
   * @param l1anchor - An HTML Anchor element at Level 1 Navigation
   * @param hoverCls - Class for hovered elements
   *
   */
  const amm_l1MouseleaveFn = (l1anchor: HTMLElement, hoverCls: string) => {
    _RemoveClass(l1anchor, hoverCls);
  };

  /**
   * Function to navigate the megamenu to Level 0 from Level 1 and Level 1
   *
   * @param event - `click` event to prevent the default action
   * @param shouldCloseL0Panel - If `true`, loses Level 0 and Level 1 Panels. Otherwise closes Level 1 panels only
   * @param overflowHiddenCls - Class which disables scrollbars on mobile
   * @param activeCls - Class which activates the megamenu links and panels
   * @param eventtype - Is `click` or `mouseover`
   *
   */
  const amm_gotoMain = (
    event: Event,
    shouldCloseL0Panel: boolean,
    overflowHiddenCls: string,
    activeCls: string,
    l1ActiveCls: string,
    l2ActiveCls: string,
    eventtype: string
  ) => {
    if (event) {
      event.preventDefault();
    }
    amm_subnavclose(
      shouldCloseL0Panel,
      overflowHiddenCls,
      activeCls,
      l1ActiveCls,
      l2ActiveCls,
      eventtype
    );
  };

  /**
   * Click event for closing megamenu on mobile
   *
   * @param event - `click` event to prevent the default action
   * @param togglenav - Button element to close Offcanvas on mobile
   * @param offcanvas - Offcanvas element containing megamenu
   * @param activeCls - Class which activates the megamenu links and panels
   *
   */
  const amm_closeMain = (
    event: Event,
    togglenav: HTMLElement,
    offcanvas: HTMLElement,
    shouldCloseL0Panel: boolean,
    overflowHiddenCls: string,
    activeCls: string,
    l1ActiveCls: string,
    l2ActiveCls: string,
    eventtype: string
  ) => {
    if (event) {
      event.preventDefault();
    }
    amm_subnavclose(
      shouldCloseL0Panel,
      overflowHiddenCls,
      activeCls,
      l1ActiveCls,
      l2ActiveCls,
      eventtype
    );
    _RemoveClass(togglenav, activeCls);
    _RemoveClass(offcanvas, activeCls);
  };

  /**
   * Click event for opening/closing megamenu on mobile
   *
   * @param event - `click` event to prevent the default action
   * @param togglenav - Button element to close Offcanvas on mobile
   * @param offcanvas - Offcanvas element containing megamenu
   * @param activeCls - Class which activates the megamenu links and panels
   *
   */
  const amm_toggleMain = (
    event: Event,
    togglenav: HTMLElement,
    offcanvas: HTMLElement,
    shouldCloseL0Panel: boolean,
    overflowHiddenCls: string,
    activeCls: string,
    l1ActiveCls: string,
    l2ActiveCls: string,
    eventtype: string
  ) => {
    if (event) {
      event.preventDefault();
    }
    if (_HasClass(togglenav, activeCls)) {
      amm_closeMain(
        event,
        togglenav,
        offcanvas,
        shouldCloseL0Panel,
        overflowHiddenCls,
        activeCls,
        l1ActiveCls,
        l2ActiveCls,
        eventtype
      );
    } else {
      _AddClass(togglenav, activeCls);
      _AddClass(offcanvas, activeCls);
    }
  };

  /**
   * Function to toggle events to AMegMen instance elements
   *
   * @param core - AMegMen instance core object
   * @param settings - AMegMen instance settings object
   *
   */
  const amm_toggleevents = (core: IAMegMenCore, settings: IAMegMenSettings) => {
    const togglenav = core.togglenav;
    const closenav = core.closenav;
    const offcanvas = core.offcanvas;
    const tomain = core.tomain;
    const toprevious = core.toprev;
    const overflowHiddenCls = settings.overflowHiddenCls
      ? settings.overflowHiddenCls
      : ``;
    const activeCls = settings.activeCls;
    const hoverCls = settings.hoverCls;
    const focusCls = settings.focusCls;
    const l1ActiveCls = settings.l1ActiveCls;
    const l2ActiveCls = settings.l2ActiveCls;
    const hoverprops: any = {
      actOnHover: settings.actOnHover ? settings.actOnHover : false,
      actOnHoverAt: settings.actOnHoverAt ? settings.actOnHoverAt : 1280,
    };

    if (settings.landingCtaCls && core.root) {
      const landingElements = core.root.querySelectorAll(
        `.${settings.landingCtaCls} > a`
      );
      for (let i = landingElements.length - 1; i >= 0; i--) {
        let thislandingelem = landingElements[i] as HTMLElement;
        if (thislandingelem) {
          core.eHandlers.push(
            amm_eventHandler(thislandingelem, `mouseenter`, () => {
              amm_landingMouseenterFn(thislandingelem as HTMLElement, hoverCls);
            })
          );
          core.eHandlers.push(
            amm_eventHandler(thislandingelem, `mouseleave`, () => {
              amm_landingMouseleaveFn(thislandingelem as HTMLElement, hoverCls);
            })
          );
          core.eHandlers.push(
            amm_eventHandler(thislandingelem, `focus`, () => {
              amm_landingFocusFn(thislandingelem as HTMLElement, focusCls);
            })
          );
          core.eHandlers.push(
            amm_eventHandler(thislandingelem, `blur`, () => {
              amm_landingBlurFn(thislandingelem as HTMLElement, focusCls);
            })
          );
        }
      }
    }

    if (togglenav && offcanvas) {
      core.eHandlers.push(
        amm_eventHandler(togglenav, `click`, (event: Event) => {
          amm_toggleMain(
            event,
            togglenav,
            offcanvas,
            true,
            overflowHiddenCls,
            activeCls,
            l1ActiveCls,
            l2ActiveCls,
            `click`
          );
        })
      );
    }

    if (togglenav && closenav && offcanvas) {
      core.eHandlers.push(
        amm_eventHandler(closenav, `click`, (event: Event) => {
          amm_closeMain(
            event,
            togglenav,
            offcanvas,
            true,
            overflowHiddenCls,
            activeCls,
            l1ActiveCls,
            l2ActiveCls,
            `click`
          );
        })
      );
    }

    if (tomain.length > 0) {
      for (let i = tomain.length - 1; i >= 0; i--) {
        let thismain = tomain[i] as HTMLElement;
        core.eHandlers.push(
          amm_eventHandler(thismain, `click`, (event: Event) => {
            amm_gotoMain(
              event,
              true,
              overflowHiddenCls,
              activeCls,
              l1ActiveCls,
              l2ActiveCls,
              `click`
            );
          })
        );
      }
    }

    if (toprevious.length > 0) {
      for (let i = toprevious.length - 1; i >= 0; i--) {
        let thisprevious = toprevious[i] as HTMLElement;
        core.eHandlers.push(
          amm_eventHandler(thisprevious, `click`, (event: Event) => {
            amm_gotoMain(
              event,
              false,
              overflowHiddenCls,
              activeCls,
              l1ActiveCls,
              l2ActiveCls,
              `click`
            );
          })
        );
      }
    }

    const l0nav = core.l0nav || [];
    for (let i = l0nav.length - 1; i >= 0; i--) {
      let thisl0nav = l0nav[i];
      const l0anchor = thisl0nav.l0anchor;
      const l0panel = thisl0nav.l0panel;
      const l0navelement = thisl0nav.navelement;
      const l1nav = thisl0nav.l1nav || [];

      if (l0anchor) {
        core.eHandlers.push(
          amm_eventHandler(l0anchor, `click`, (event: Event) => {
            amm_l0ClickFn(
              event,
              l0anchor,
              l0panel,
              core.root,
              core.mainEl,
              offcanvas,
              overflowHiddenCls,
              activeCls,
              l1ActiveCls,
              l2ActiveCls,
              `click`
            );
          })
        );
        core.eHandlers.push(
          amm_eventHandler(l0anchor, `mouseenter`, () => {
            amm_l0MouseenterFn(
              l0anchor,
              hoverCls,
              hoverprops.actOnHover,
              hoverprops.actOnHoverAt
            );
          })
        );
        core.eHandlers.push(
          amm_eventHandler(l0anchor, `mouseleave`, () => {
            amm_l0MouseleaveFn(l0anchor, hoverCls);
          })
        );
        core.eHandlers.push(
          amm_eventHandler(l0anchor, `focus`, () => {
            amm_l0FocusFn(l0anchor, focusCls);
          })
        );
        core.eHandlers.push(
          amm_eventHandler(l0anchor, `blur`, () => {
            amm_l0BlurFn(l0anchor, focusCls);
          })
        );
      }

      if (l0panel) {
        core.eHandlers.push(
          amm_eventHandler(l0panel, `click`, (event: Event) => {
            amm_subnav_out(
              event,
              overflowHiddenCls,
              activeCls,
              l1ActiveCls,
              l2ActiveCls,
              `click`
            );
          })
        );
        if (hoverprops.actOnHover) {
          core.eHandlers.push(
            amm_eventHandler(l0panel, `mouseover`, (event: Event) => {
              amm_subnav_out(
                event,
                overflowHiddenCls,
                activeCls,
                l1ActiveCls,
                l2ActiveCls,
                `mouseover`
              );
            })
          );
        }
      }

      for (let j = l1nav.length - 1; j >= 0; j--) {
        const l1anchor = l1nav[j].l1anchor;
        const l1panel = l1nav[j].l1panel;
        const l2nav = l1nav[j].l2nav || [];

        if (l1anchor) {
          core.eHandlers.push(
            amm_eventHandler(l1anchor, `click`, (event: Event) => {
              amm_l1ClickFn(
                event,
                l1anchor,
                l1panel,
                offcanvas,
                l0navelement,
                overflowHiddenCls,
                activeCls,
                l1ActiveCls,
                l2ActiveCls,
                `click`
              );
            })
          );
          core.eHandlers.push(
            amm_eventHandler(l1anchor, `mouseenter`, () => {
              amm_l1MouseenterFn(
                l1anchor,
                hoverCls,
                hoverprops.actOnHover,
                hoverprops.actOnHoverAt
              );
            })
          );
          core.eHandlers.push(
            amm_eventHandler(l1anchor, `mouseleave`, () => {
              amm_l1MouseleaveFn(l1anchor, hoverCls);
            })
          );
          core.eHandlers.push(
            amm_eventHandler(l1anchor, `focus`, () => {
              amm_l1FocusFn(l1anchor, focusCls);
            })
          );
          core.eHandlers.push(
            amm_eventHandler(l1anchor, `blur`, () => {
              amm_l1BlurFn(l1anchor, focusCls);
            })
          );
        }

        for (let k = l2nav.length - 1; k >= 0; k--) {
          const l2anchor = l2nav[k];
          core.eHandlers.push(
            amm_eventHandler(l2anchor as HTMLElement, `mouseenter`, () => {
              amm_l2MouseenterFn(l2anchor as HTMLElement, hoverCls);
            })
          );
          core.eHandlers.push(
            amm_eventHandler(l2anchor as HTMLElement, `mouseleave`, () => {
              amm_l2MouseleaveFn(l2anchor as HTMLElement, hoverCls);
            })
          );
          core.eHandlers.push(
            amm_eventHandler(l2anchor as HTMLElement, `focus`, () => {
              amm_l2FocusFn(l2anchor as HTMLElement, focusCls);
            })
          );
          core.eHandlers.push(
            amm_eventHandler(l2anchor as HTMLElement, `blur`, () => {
              amm_l2BlurFn(l2anchor as HTMLElement, focusCls);
            })
          );
        }
      }
    }

    core.eHandlers.push(
      amm_eventHandler(document as any, `click`, (event: Event) => {
        amm_document_out(
          event,
          overflowHiddenCls,
          activeCls,
          l1ActiveCls,
          l2ActiveCls,
          `click`
        );
      })
    );
    if (hoverprops.actOnHover) {
      core.eHandlers.push(
        amm_eventHandler(window as any, `mouseover`, (event: Event) => {
          amm_document_out(
            event,
            overflowHiddenCls,
            activeCls,
            l1ActiveCls,
            l2ActiveCls,
            `mouseover`
          );
        })
      );
    }
  };

  /**
   * Function to initialize AMegMen instance
   *
   * @param core - AMegMen instance core object
   * @param rootElem - Parent `nav` element
   * @param settings - AMegMen instance settings object
   *
   * @returns The AMegMen instance core object after updating elements and events
   *
   */
  const amm_init = (
    core: IAMegMenCore,
    rootElem: HTMLElement,
    settings: IAMegMenSettings
  ) => {
    _AddClass(rootElem, settings.rootCls ? settings.rootCls : ``);
    core.root = rootElem;
    core.opts = settings;
    core.mainEl = core.root.querySelector(`.${settings.mainElementCls}`);
    core.togglenav = core.root.querySelector(`.${settings.toggleBtnCls}`);
    core.closenav = core.root.querySelector(`.${settings.closeBtnCls}`);
    core.offcanvas = core.root.querySelector(`.${settings.offcanvasCls}`);
    core.tomain = core.root.querySelectorAll(`.${settings.mainBtnCls}`);
    core.toprev = core.root.querySelectorAll(`.${settings.backBtnCls}`);
    core.eHandlers = [];

    if (core.opts.isRTL) {
      _AddClass(core.root as HTMLElement, settings.rtlCls);
    }

    if (core.mainEl) {
      core.l0nav = <IAMegMenL0[]>[];
      const l0li = core.mainEl.querySelectorAll(`:scope > ul > li`);

      for (let i = l0li.length - 1; i >= 0; i--) {
        let thisl0li = l0li[i] as HTMLElement;
        _ToggleUniqueId(thisl0li, settings, i, true);

        let nav0obj = <IAMegMenL0>{};
        nav0obj.l0li = thisl0li;
        nav0obj.l0anchor = thisl0li.querySelector(`:scope > a`);
        if (nav0obj.l0anchor) {
          _AddClass(nav0obj.l0anchor, settings.l0AnchorCls);
          const l0panel = thisl0li.querySelector(
            `:scope > .${settings.panelCls}`
          );
          if (l0panel) {
            nav0obj.l0anchor.setAttribute(`role`, `button`);
            nav0obj.l0anchor.setAttribute(`aria-expanded`, `false`);
            l0panel.setAttribute(`role`, `region`);
            l0panel.setAttribute(`aria-expanded`, `false`);
            l0panel.setAttribute(`aria-hidden`, `true`);
            _AddClass(l0panel as HTMLElement, settings.l0PanelCls);
            nav0obj.l0panel = l0panel as HTMLElement;
            nav0obj.l0tomain = l0panel.querySelector(`.${settings.mainBtnCls}`);
            const l1navelement = l0panel.querySelector(`:scope > nav`);

            if (l1navelement) {
              nav0obj.navelement = l1navelement as HTMLElement;
              const l1cols = l1navelement.querySelectorAll(
                `:scope > .${settings.colCls}`
              );
              nav0obj.l1cols = l1cols.length;
              nav0obj.l1nav = <IAMegMenL1[]>[];

              if (l1cols.length > 0) {
                const shiftnum = (settings.supportedCols || 0) - l1cols.length;
                const l1li = l1navelement.querySelectorAll(
                  `:scope > .${settings.colCls} > ul > li`
                );
                const colnum = parseInt((settings.supportedCols || 0) + ``);
                for (let j = l1cols.length - 1; j >= 0; j--) {
                  let thisl1col = l1cols[j];
                  _AddClass(
                    thisl1col as HTMLElement,
                    `${settings.colCls}-${colnum > 0 ? colnum : 2}`
                  );
                  if (j === colnum - 1 && j > 1) {
                    _AddClass(thisl1col as HTMLElement, settings.lastColCls);
                  }
                }
                for (let j = l1li.length - 1; j >= 0; j--) {
                  let thisl1li = l1li[j];
                  _ToggleUniqueId(thisl1li as HTMLElement, settings, j, true);
                  let nav1obj = <IAMegMenL1>{};
                  nav1obj.l1li = thisl1li as HTMLElement;
                  nav1obj.l1anchor = thisl1li.querySelector(`:scope > a`);
                  _AddClass(
                    nav1obj.l1anchor as HTMLElement,
                    settings.l1AnchorCls ? settings.l1AnchorCls : ``
                  );
                  const l1panel = thisl1li.querySelector(
                    `:scope > .${settings.panelCls}`
                  );

                  if (l1panel && nav1obj.l1anchor) {
                    nav1obj.l1anchor.setAttribute(`role`, `button`);
                    nav1obj.l1anchor.setAttribute(`aria-expanded`, `false`);
                    l1panel.setAttribute(`role`, `region`);
                    l1panel.setAttribute(`aria-expanded`, `false`);
                    l1panel.setAttribute(`aria-hidden`, `true`);
                    _AddClass(l1panel as HTMLElement, settings.l1PanelCls);
                    nav1obj.l1panel = l1panel as HTMLElement;
                    nav1obj.l1toback = l1panel.querySelector(
                      `.${settings.backBtnCls}`
                    );
                    const l2navelement = l1panel.querySelector(`:scope > nav`);

                    if (l2navelement) {
                      nav1obj.navelement = l2navelement as HTMLElement;
                      const l2cols = l2navelement.querySelectorAll(
                        `:scope > .${settings.colCls}`
                      );

                      if (l2cols.length > 0) {
                        if (settings.shiftColumns) {
                          _AddClass(
                            l1navelement as HTMLElement,
                            `${settings.colShiftCls}-${shiftnum}`
                          );
                        }
                        _AddClass(
                          l1panel as HTMLElement,
                          `${settings.colWidthCls}-${shiftnum}`
                        );
                        const l2a = l2navelement.querySelectorAll(
                          `:scope > .${settings.colCls} > ul > li > a`
                        );

                        for (let k = l2a.length - 1; k >= 0; k--) {
                          let thisl2anchor = l2a[k] as HTMLElement;
                          _AddClass(thisl2anchor, settings.l2AnchorCls);
                        }
                        for (let k = l2cols.length - 1; k >= 0; k--) {
                          let thisl2col = l2cols[k] as HTMLElement;
                          // _AddClass(l2cols[k], `__amegmen--col-${l2cols.length}`);
                          _AddClass(
                            thisl2col,
                            `${settings.colCls ? settings.colCls : ``}-1`
                          );
                        }
                        nav1obj.l2nav = l2a;
                      }
                    }
                  }
                  nav0obj.l1nav.push(nav1obj);
                }
              }
            }
          }
        }

        core.l0nav.push(nav0obj);
      }
    }
    amm_toggleevents(core, settings);
    return core;
  };

  /**
   * Function to destroy AMegMen instance
   *
   * @param thisid - Element id of the AMegMen instance
   * @param core - AMegMen instance core object
   *
   */
  const amm_destroy = (thisid: string, core: IAMegMenCore) => {
    if (core.root) {
      const settings = core.opts;
      const allElems = core.root.querySelectorAll(
        `.${settings.landingCtaCls} > a, .${settings.toggleBtnCls}, .${settings.closeBtnCls}, .${settings.mainBtnCls}, .${settings.backBtnCls}, .${settings.l0AnchorCls}, .${settings.l0PanelCls}, .${settings.l1AnchorCls}, .${settings.l2AnchorCls}`
      );
      const cls = `${settings.rootCls} ${settings.l0AnchorCls} ${settings.l0PanelCls} ${settings.l1AnchorCls} ${settings.l1PanelCls} ${settings.l2AnchorCls} ${settings.lastColCls} ${settings.activeCls} ${settings.focusCls} ${settings.hoverCls} ${settings.rtlCls} ${settings.l2ActiveCls} ${settings.l1ActiveCls} ${settings.overflowHiddenCls}`;

      for (let i = allElems.length - 1; i >= 0; i--) {
        let thiselem = allElems[i] as HTMLElement;
        amm_removeEventListeners(core, thiselem);

        if (
          (_HasClass(thiselem, settings.l0AnchorCls) ||
            _HasClass(thiselem, settings.l1AnchorCls)) &&
          thiselem.getAttribute(`role`) === `button`
        ) {
          thiselem.removeAttribute(`role`);
          thiselem.removeAttribute(`aria-expanded`);
        }
        if (
          (_HasClass(thiselem, settings.l0PanelCls) ||
            _HasClass(thiselem, settings.l1PanelCls)) &&
          thiselem.getAttribute(`role`) === `region`
        ) {
          thiselem.removeAttribute(`role`);
          thiselem.removeAttribute(`aria-expanded`);
          thiselem.removeAttribute(`aria-hidden`);
        }

        _RemoveClass(thiselem, cls);
        _ToggleUniqueId(thiselem, settings, i, false);
      }

      let keycount = 0;
      for (let i in AllAMegMenInstances) {
        if (AllAMegMenInstances.hasOwnProperty(i)) {
          keycount++;
        }
      }

      if (keycount === 1) {
        amm_removeEventListeners(core, document as any);
        if (settings.actOnHover) {
          amm_removeEventListeners(core, window as any);
        }
      }

      _RemoveClass(core.root, cls);
      delete AllAMegMenInstances[thisid];
    }
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
    private core = <IAMegMenCore>{};

    constructor(
      thisid: string,
      rootElem: HTMLElement,
      options?: IAMegMenSettings
    ) {
      this.core = amm_init(this.core, rootElem, { ..._Defaults, ...options });
      AllAMegMenInstances[thisid] = this.core;
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
    private instances: IAMegMenRoot = {};
    protected static instance: Root | null = null;

    /**
     * Constructor to initiate polyfills
     *
     */
    constructor() {
      _EnableQSQSAScope();
      _EnableClosest();
      // _EnableAssign();
    }

    /**
     * Function to return single instance
     *
     * @returns Single AMegMen Instance
     *
     */
    public static getInstance(): Root {
      if (!Root.instance) {
        Root.instance = new Root();
      }
      return Root.instance;
    }

    /**
     * Function to initialize the AMegMen plugin for provided query strings.
     *
     * @param query - The CSS selector for which the AMegMen needs to be initialized.
     * @param options - The optional object to customize every AMegMen instance.
     *
     */
    protected init = (query: string, options?: IAMegMenSettings) => {
      const roots = document.querySelectorAll(query);
      const rootsLen = roots.length;
      let instancelen = 0;
      for (let i in this.instances) {
        if (this.instances.hasOwnProperty(i)) {
          instancelen++;
        }
      }
      if (rootsLen > 0) {
        for (let i = 0; i < rootsLen; i++) {
          const id = (roots[i] as HTMLElement).getAttribute(`id`);
          let iselempresent = false;
          if (id) {
            for (let j = 0; j < instancelen; j++) {
              if (this.instances[id]) {
                iselempresent = true;
                break;
              }
            }
          }

          if (!iselempresent) {
            if (id) {
              this.instances[id] = new Core(
                id,
                roots[i] as HTMLElement,
                options
              );
            } else {
              const thisid = id
                ? id
                : { ...options, ..._Defaults }.idPrefix +
                  `_` +
                  new Date().getTime() +
                  `_root_` +
                  (i + 1);
              (roots[i] as HTMLElement).setAttribute(`id`, thisid);
              this.instances[thisid] = new Core(
                thisid,
                roots[i] as HTMLElement,
                options
              );
            }
          }
        }
      } else {
        console.error(`Element(s) with the provided query do(es) not exist`);
      }
    };

    /**
     * Function to destroy the AMegMen plugin for provided query strings.
     *
     * @param query - The CSS selector for which the AMegMen needs to be initialized.
     *
     */
    protected destroy = (query: string) => {
      const roots = document.querySelectorAll(query);
      const rootsLen = roots.length;
      if (rootsLen > 0) {
        for (let i = 0; i < rootsLen; i++) {
          const id = (roots[i] as HTMLElement).getAttribute(`id`);
          if (id && this.instances[id]) {
            amm_destroy(id, this.instances[id].core);
            delete this.instances[id];
          }
        }
      } else {
        console.error(`Element(s) with the provided query do(es) not exist`);
      }
    };
  }
}
if (typeof exports === `object` && typeof module !== `undefined`) {
  module.exports = AMegMen;
}
