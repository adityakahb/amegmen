/**
 * AMegMen Namespace contains the Root class, Core class and related constants.
 *
 */
namespace AMegMen {
  let AllAMegMenInstances: any = {};
  let active_amegmen: any = {};

  interface IRoot {
    [key: string]: any;
  }
  interface IAMegMenSettings {
    activeCls?: string;
    actOnHoverAt?: number;
    backBtnCls?: string;
    closeBtnCls?: string;
    colCls?: string;
    colShiftCls?: string;
    colWidthCls?: string;
    focusCls?: string;
    hoverCls?: string;
    idPrefix?: string;
    isRTL?: boolean;
    l0AnchorCls?: string;
    l0PanelCls?: string;
    l1AnchorCls?: string;
    l1PanelCls?: string;
    l2AnchorCls?: string;
    landingCtaCls?: string;
    lastcolCls?: string;
    mainBtnCls?: string;
    mainElementCls?: string;
    rootCls?: string;
    offcanvasCls?: string;
    overflowHiddenCls?: string;
    panelCls?: string;
    rtl_Cls?: string;
    shiftColumns?: boolean;
    actOnHover?: boolean;
    supportedCols?: number;
    toggleBtnCls?: string;
  }

  const _EventList = ['amm_landingMouseenterFn', 'amm_landingMouseleaveFn', 'amm_landingFocusFn', 'amm_landingBlurFn', 'amm_toggleMainClickFn', 'amm_closeMainClickFn',
    'amm_gotoMainClickFn', 'amm_l0ClickFn', 'amm_l0MouseenterFn', 'amm_l0MouseleaveFn', 'amm_l0FocusFn', 'amm_l0BlurFn', 'amm_panelMouseoverFn', 'amm_panelClickFn',
    'amm_l1ClickFn', 'amm_l1MouseenterFn', 'amm_l1MouseleaveFn', 'amm_l1FocusFn', 'amm_l1BlurFn', 'amm_l2MouseenterFn', 'amm_l2MouseleaveFn', 'amm_l2FocusFn',
    'amm_l2BlurFn', 'amm_docMouseoverFn', 'amm_docClickFn'];

  const _Defaults = {
    activeCls: 'active',
    actOnHoverAt: 1280,
    backBtnCls: '__amegmen--back-cta',
    closeBtnCls: '__amegmen--close-cta',
    colCls: '__amegmen--col',
    colShiftCls: '__amegmen-shift',
    colWidthCls: '__amegmen-width',
    focusCls: 'focus',
    hoverCls: 'hover',
    idPrefix: '__amegmen_id',
    isRTL: false,
    l0AnchorCls: '__amegmen--anchor-l0',
    l0PanelCls: '__amegmen--panel-l0',
    l1AnchorCls: '__amegmen--anchor-l1',
    l1PanelCls: '__amegmen--panel-l1',
    l2AnchorCls: '__amegmen--anchor-l2',
    landingCtaCls: '__amegmen--landing',
    lastcolCls: '__amegmen--col-last',
    mainBtnCls: '__amegmen--main-cta',
    mainElementCls: '__amegmen--main',
    rootCls: '__amegmen',
    offcanvasCls: '__amegmen--canvas',
    overflowHiddenCls: '__amegmen--nooverflow',
    panelCls: '__amegmen--panel',
    rtl_Cls: '__amegmen--r-to-l',
    shiftColumns: false,
    actOnHover: false,
    supportedCols: 4,
    toggleBtnCls: '__amegmen--toggle-cta',
  };

  /**
   * Polyfill function for Object.assign
   * 
   */
  const _EnableAssign = () => {
    if (typeof (Object as any).assign !== 'function') {
      Object.defineProperty(Object, 'assign', {
        value: function assign(target: any) {
          // function assign(target: any, varArgs: any)
          'use strict';
          if (target === null || target === undefined) {
            throw new TypeError('Cannot convert undefined or null to object');
          }

          let to = Object(target);

          for (var index = 1; index < arguments.length; index++) {
            let nextSource = arguments[index];

            if (nextSource !== null && nextSource !== undefined) {
              for (var nextKey in nextSource) {
                if (Object.prototype.hasOwnProperty.call(nextSource, nextKey)) {
                  to[nextKey] = nextSource[nextKey];
                }
              }
            }
          }
          return to;
        },
        writable: true,
        configurable: true,
      });
    }
  };

  /**
   * Polyfill function for `:scope` for `QuerySelector` and `QuerySelectorAll`
   *
   */
  const _EnableQSQSAScope = () => {
    try {
      window.document.querySelector(':scope body');
    } catch (err) {
      const qsarr = ['querySelector', 'querySelectorAll'];
      for (let i = 0; i < qsarr.length; i++) {
        let nativ = (Element.prototype as any)[qsarr[i]];
        (Element.prototype as any)[qsarr[i]] = function (selectors: string) {
          if (/(^|,)\s*:scope/.test(selectors)) {
            let id = this.id;
            this.id = 'ID_' + Date.now();
            selectors = selectors.replace(/((^|,)\s*):scope/g, '$1#' + this.id);
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
    return str.replace(/^\s+|\s+$/g, '');
  };

  /**
   * Function to convert NodeList and other lists to loopable Arrays
   * 
   * @param arr - Either Nodelist of any type of array
   * 
   * @returns A loopable Array.
   *
   */
  const _ArrayCall = (arr: any[] | NodeListOf<Element>) => {
    try {
      return Array.prototype.slice.call(arr);
    } catch (e) {
      return [];
    }
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
  const _HasClass = (element: HTMLElement, cls: string) => {
    if (element) {
      const clsarr = element.className.split(' ');
      return clsarr.indexOf(cls) > -1 ? true : false;
    }

    return false;
  };

  /**
   * Function to add a string to an element's class attribute
   * 
   * @param element - An HTML Element
   * @param cls - A string
   *
   */
  const _AddClass = (element: HTMLElement, cls: string) => {
    if (element) {
      let clsarr = cls.split(' ');
      let clsarrLength = clsarr.length;
      for (let i = 0; i < clsarrLength; i++) {
        let thiscls = clsarr[i];
        if (!_HasClass(element, thiscls)) {
          element.className += ' ' + thiscls;
        }
      }
      element.className = _StringTrim(element.className);
    }
  };

  /**
   * Function to remove a string from an element's class attribute
   * 
   * @param element - An HTML Element
   * @param cls - A string
   *
   */
  const _RemoveClass = (element: HTMLElement, cls: string) => {
    if (element) {
      let clsarr = cls.split(' ');
      let curclass = element.className.split(' ');
      let curclassLength = curclass.length;
      for (let i = 0; i < curclassLength; i++) {
        let thiscls = curclass[i];
        if (clsarr.indexOf(thiscls) > -1) {
          curclass.splice(i, 1);
          i--;
        }
      }
      element.className = _StringTrim(curclass.join(' '));
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
  const _ToggleUniqueId = (element: HTMLElement, settings: IAMegMenSettings, unique_number: number, shouldAddId: boolean) => {
    if (settings.idPrefix) {
      if (shouldAddId && !element.getAttribute('id')) {
        element.setAttribute('id', settings.idPrefix + '_' + new Date().getTime() + '_' + unique_number);
      } else if (!shouldAddId && element.getAttribute('id')) {
        const thisid = element.getAttribute('id');
        const regex = new RegExp(settings.idPrefix, 'gi');
        if (regex.test(thisid || '')) {
          element.removeAttribute('id');
        }
      }
    }
  };

  /**
   * Function to close the Level 1 and Level 2 Megamenues if click or hover happens on document or window
   * 
   * @param overflowHiddenCls - Class which disables scrollbars on mobile
   * @param activeCls - Class which activates the megamenu links and panels
   * @param eventtype - Is `click` or `mouseover`
   *
   */
  const amm_document_out = (overflowHiddenCls: string, activeCls: string, eventtype: string) => {
    return () => {
      if (event && _StringTrim(active_amegmen.closestl0li || '').length > 0) {
        const closest = (event.target as HTMLElement).closest('#' + active_amegmen.closestl0li);
        if (!closest) {
          amm_subnavclose(true, overflowHiddenCls, activeCls, eventtype);
        }
      }
    };
  };

  /**
   * Function to close the Level 2 Megamenu if click or hover happens on Level 1 Megamenu Panel
   * 
   * @param overflowHiddenCls - Class which disables scrollbars on mobile
   * @param activeCls - Class which activates the megamenu links and panels
   * @param eventtype - Is `click` or `mouseover`
   *
   */
  const amm_subnav_out = (overflowHiddenCls: string, activeCls: string, eventtype: string) => {
    return () => {
      if (event) {
        const closest = (event.target as HTMLElement).closest('#' + active_amegmen.closestl1li);
        if (!closest) {
          amm_subnavclose(false, overflowHiddenCls, activeCls, eventtype);
        }
      }
    };
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
  const amm_subnavclose = (shouldCloseL0Panel: boolean, overflowHiddenCls: string, activeCls: string, eventtype: string) => {
    for (let i in AllAMegMenInstances) {
      const thiscore = AllAMegMenInstances[i];
      const rootElem = thiscore.rootElem;
      let shouldExecute = false;
      if (eventtype === 'mouseover' && (AllAMegMenInstances[i].settings || {}).actOnHover === true) {
        shouldExecute = true;
      }
      if (eventtype === 'click') {
        shouldExecute = true;
      }
      if (shouldExecute && _HasClass(rootElem, activeCls)) {
        const mainElem = AllAMegMenInstances[i].mainElem;
        const l0nav = AllAMegMenInstances[i].l0nav || [];
        if (shouldCloseL0Panel) {
          _RemoveClass(rootElem, activeCls);
          _RemoveClass(mainElem, overflowHiddenCls);
        }
        for (let j = l0nav.length - 1; j >= 0; j--) {
          if (shouldCloseL0Panel) {
            _RemoveClass(l0nav[j].l0anchor, activeCls);
            _RemoveClass(l0nav[j].l0panel, activeCls);
          }
          _RemoveClass(l0nav[j].navelement, overflowHiddenCls);
          const l1nav = l0nav[j].l1nav || [];
          for (let k = l1nav.length - 1; k >= 0; k--) {
            let thisl1 = l1nav[k];
            _RemoveClass(thisl1.l1anchor, activeCls);
            _RemoveClass(thisl1.l1panel, activeCls);
          }
        }
      }
    }
  };

  /**
   * Function to navigate the megamenu to Level 0 from Level 1 and Level 1
   * 
   * @param shouldCloseL0Panel - If `true`, loses Level 0 and Level 1 Panels. Otherwise closes Level 1 panels only
   * @param overflowHiddenCls - Class which disables scrollbars on mobile
   * @param activeCls - Class which activates the megamenu links and panels
   * @param eventtype - Is `click` or `mouseover`
   *
   */
  const amm_gotoMain = (shouldCloseL0Panel: boolean, overflowHiddenCls: string, activeCls: string, eventtype: string) => {
    return () => {
      if (event) {
        event.preventDefault();
      }
      amm_subnavclose(shouldCloseL0Panel, overflowHiddenCls, activeCls, eventtype);
    };
  };

  /**
   * Mouseenter event for Landing link on the panel 
   * 
   * @param landingElement - An HTML Element
   * @param hoverCls - CSS Class for hovered element
   *
   */
  const amm_landingMouseenterFn = (landingElement: HTMLElement, hoverCls: string) => {
    return () => {
      _AddClass(landingElement, hoverCls);
    };
  };

  /**
   * Mouseleave event for Landing link on the panel 
   * 
   * @param landingElement - An HTML Element
   * @param hoverCls - CSS Class for hovered element
   *
   */
  const amm_landingMouseleaveFn = (landingElement: HTMLElement, hoverCls: string) => {
    return () => {
      _RemoveClass(landingElement, hoverCls);
    };
  };

  /**
   * Focus event for Landing link on the panel 
   * 
   * @param landingElement - An HTML Element
   * @param focusCls - CSS Class for focussed element
   *
   */
  const amm_landingFocusFn = (landingElement: HTMLElement, focusCls: string) => {
    return () => {
      _AddClass(landingElement, focusCls);
    };
  };

  /**
   * Blur event for Landing link on the panel 
   * 
   * @param landingElement - An HTML Element
   * @param focusCls - CSS Class for focussed element
   *
   */
  const amm_landingBlurFn = (landingElement: HTMLElement, focusCls: string) => {
    return () => {
      _AddClass(landingElement, focusCls);
    };
  };

  /**
   * Focus event for Level 0 link 
   * 
   * @param landingElement - An HTML Element
   * @param focusCls - CSS Class for focussed element
   *
   */
  const amm_l0FocusFn = (l0anchor: HTMLElement, focusCls: string) => {
    return () => {
      _AddClass(l0anchor, focusCls);
    };
  };

  const amm_l0BlurFn = (l0anchor: HTMLElement, focusCls: string) => {
    return () => {
      _RemoveClass(l0anchor, focusCls);
    };
  };

  const amm_l1FocusFn = (l1anchor: HTMLElement, focusCls: string) => {
    return () => {
      _AddClass(l1anchor, focusCls);
    };
  };

  const amm_l1BlurFn = (l1anchor: HTMLElement, focusCls: string) => {
    return () => {
      _RemoveClass(l1anchor, focusCls);
    };
  };

  const amm_l2MouseenterFn = (l2anchor: HTMLElement, hoverCls: string) => {
    return () => {
      _AddClass(l2anchor, hoverCls);
    };
  };

  const amm_l2MouseleaveFn = (l2anchor: HTMLElement, hoverCls: string) => {
    return () => {
      _RemoveClass(l2anchor, hoverCls);
    };
  };

  const amm_l2FocusFn = (l2anchor: HTMLElement, focusCls: string) => {
    return () => {
      _AddClass(l2anchor, focusCls);
    };
  };

  const amm_l2BlurFn = (l2anchor: HTMLElement, focusCls: string) => {
    return () => {
      _RemoveClass(l2anchor, focusCls);
    };
  };

  const amm_l0ClickFn = (l0anchor: HTMLElement, l0panel: HTMLElement, parent: HTMLElement, mainElem: HTMLElement, overflowHiddenCls: string, activeCls: string, eventtype: string) => {
    return () => {
      if (event && l0panel) {
        event.preventDefault();
      }
      if (_HasClass(l0anchor, activeCls)) {
        (active_amegmen as any).elem = null;
        (active_amegmen as any).closestl0li = '';
        amm_subnavclose(true, overflowHiddenCls, activeCls, eventtype);
      } else {
        amm_subnavclose(true, overflowHiddenCls, activeCls, eventtype);
        (active_amegmen as any).elem = parent;
        (active_amegmen as any).closestl0li = (l0anchor.closest('li') as HTMLElement).getAttribute('id');
        _AddClass(parent, activeCls);
        _AddClass(l0anchor, activeCls);
        _AddClass(l0panel, activeCls);
        _AddClass(mainElem, overflowHiddenCls);
      }
    };
  };

  const amm_l0MouseenterFn = (l0anchor: HTMLElement, hoverCls: string, actOnHover: boolean, actOnHoverAt: number) => {
    return () => {
      _AddClass(l0anchor, hoverCls);
      if (actOnHover) {
        const windowwidth = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;
        if (windowwidth >= actOnHoverAt) {
          l0anchor.click();
        }
      }
    };
  };

  const amm_l0MouseleaveFn = (l0anchor: HTMLElement, hoverCls: string) => {
    return () => {
      _RemoveClass(l0anchor, hoverCls);
    };
  };

  const amm_l1ClickFn = (l1anchor: HTMLElement, l1panel: HTMLElement, l0navelement: HTMLElement, overflowHiddenCls: string, activeCls: string, eventtype: string) => {
    return () => {
      if (event && l1panel) {
        event.preventDefault();
      }
      if (_HasClass(l1anchor, activeCls)) {
        (active_amegmen as any).closestl1li = '';
        amm_subnavclose(false, overflowHiddenCls, activeCls, eventtype);
      } else {
        (active_amegmen as any).closestl1li = (l1anchor.closest('li') as HTMLElement).getAttribute('id');
        amm_subnavclose(false, overflowHiddenCls, activeCls, eventtype);
        _AddClass(l1anchor, activeCls);
        _AddClass(l1panel, activeCls);
        _AddClass(l0navelement, overflowHiddenCls);
      }
    };
  };

  const amm_l1MouseenterFn = (l1anchor: HTMLElement, hoverCls: string, actOnHover: boolean, actOnHoverAt: number) => {
    return () => {
      _AddClass(l1anchor, hoverCls);
      if (actOnHover) {
        const windowwidth = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;
        if (windowwidth >= actOnHoverAt) {
          l1anchor.click();
        }
      }
    };
  };

  const amm_l1MouseleaveFn = (l1anchor: HTMLElement, hoverCls: string) => {
    return () => {
      _RemoveClass(l1anchor, hoverCls);
    };
  };

  const amm_closeMain = (togglenav: HTMLElement, offcanvas: HTMLElement, activeCls: string) => {
    return () => {
      if (event) {
        event.preventDefault();
      }
      _RemoveClass(togglenav, activeCls);
      _RemoveClass(offcanvas, activeCls);
    };
  };

  const amm_toggleMain = (togglenav: HTMLElement, offcanvas: HTMLElement, activeCls: string) => {
    return () => {
      if (event) {
        event.preventDefault();
        if (_HasClass(togglenav, activeCls)) {
          _RemoveClass(togglenav, activeCls);
          _RemoveClass(offcanvas, activeCls);
        } else {
          _AddClass(togglenav, activeCls);
          _AddClass(offcanvas, activeCls);
        }
      }
    };
  };

  const amm_eventScheduler = (shouldAdd: Boolean, element: HTMLElement | HTMLDocument | Window, eventtype: string, fn: EventListenerOrEventListenerObject) => {
    shouldAdd ? element.addEventListener(eventtype, fn, false) : element.removeEventListener(eventtype, fn, false);
  };

  const amm_toggleevents = (core: any, settings: IAMegMenSettings) => {

    const togglenav = core.togglenav;
    const closenav = core.closenav;
    const offcanvas = core.offcanvas;
    const tomain = _ArrayCall(core.tomain);
    const toprevious = _ArrayCall(core.toprevious);
    const overflowHiddenCls = settings.overflowHiddenCls ? settings.overflowHiddenCls : '';
    const activeCls = settings.activeCls ? settings.activeCls : '';
    const hoverCls = settings.hoverCls ? settings.hoverCls : '';
    const focusCls = settings.focusCls ? settings.focusCls : '';
    const hoverprops: any = {
      actOnHover: settings.actOnHover ? settings.actOnHover : false,
      actOnHoverAt: settings.actOnHoverAt ? settings.actOnHoverAt : 1280
    };

    if (settings.landingCtaCls) {
      const landingElements = _ArrayCall(core.rootElem.querySelectorAll('.' + settings.landingCtaCls + ' > a'));
      for (let i = landingElements.length - 1; i >= 0; i--) {
        let thislandingelem = landingElements[i];
        if (!thislandingelem.amm_landingMouseenterFn) {
          thislandingelem.amm_landingMouseenterFn = amm_landingMouseenterFn(thislandingelem, hoverCls);
        }
        if (!thislandingelem.amm_landingMouseleaveFn) {
          thislandingelem.amm_landingMouseleaveFn = amm_landingMouseleaveFn(thislandingelem, hoverCls);
        }
        if (!thislandingelem.amm_landingFocusFn) {
          thislandingelem.amm_landingFocusFn = amm_landingFocusFn(thislandingelem, focusCls);
        }
        if (!thislandingelem.amm_landingBlurFn) {
          thislandingelem.amm_landingBlurFn = amm_landingBlurFn(thislandingelem, focusCls);
        }
        amm_eventScheduler(true, thislandingelem as HTMLElement, 'mouseenter', thislandingelem.amm_landingMouseenterFn);
        amm_eventScheduler(true, thislandingelem as HTMLElement, 'mouseleave', thislandingelem.amm_landingMouseleaveFn);
        amm_eventScheduler(true, thislandingelem as HTMLElement, 'focus', thislandingelem.amm_landingFocusFn);
        amm_eventScheduler(true, thislandingelem as HTMLElement, 'blur', thislandingelem.amm_landingBlurFn);
      }
    }

    if (togglenav && offcanvas) {
      if (!togglenav.amm_toggleMainClickFn) {
        togglenav.amm_toggleMainClickFn = amm_toggleMain(togglenav, offcanvas, activeCls);
      }
      amm_eventScheduler(true, togglenav as HTMLElement, 'click', togglenav.amm_toggleMainClickFn);
    }

    if (closenav && offcanvas) {
      if (!closenav.amm_closeMainClickFn) {
        closenav.amm_closeMainClickFn = amm_closeMain(togglenav, offcanvas, activeCls);
      }
      amm_eventScheduler(true, closenav as HTMLElement, 'click', closenav.amm_closeMainClickFn);
    }

    if (tomain.length > 0) {
      for (let i = tomain.length - 1; i >= 0 ; i--) {
        let thismain = tomain[i];
        if (!thismain.amm_gotoMainClickFn) {
          thismain.amm_gotoMainClickFn = amm_gotoMain(true, overflowHiddenCls, activeCls, 'click');
        }
        amm_eventScheduler(true, thismain as HTMLElement, 'click', thismain.amm_gotoMainClickFn);
      }
    }

    if (toprevious.length > 0) {
      for (let i = toprevious.length - 1; i >= 0 ; i--) {
        let thisprevious = toprevious[i];
        if (!thisprevious.amm_gotoMainClickFn) {
          thisprevious.amm_gotoMainClickFn = amm_gotoMain(false, overflowHiddenCls, activeCls, 'click');
        }
        amm_eventScheduler(true, thisprevious as HTMLElement, 'click', thisprevious.amm_gotoMainClickFn);
      }
    }

    const l0nav = core.l0nav || [];
    for (let i = l0nav.length - 1; i >= 0; i--) {
      let thisl0nav = l0nav[i];
      const l0anchor = thisl0nav.l0anchor;
      const l0panel = thisl0nav.l0panel;
      const l0navelement = thisl0nav.navelement;
      const l1nav = thisl0nav.l1nav || [];
      
      if (!l0anchor.amm_l0ClickFn) {
        l0anchor.amm_l0ClickFn = amm_l0ClickFn(l0anchor, l0panel, core.rootElem, core.mainElem, overflowHiddenCls, activeCls, 'click');
      }
      if (!l0anchor.amm_l0MouseenterFn) {
        l0anchor.amm_l0MouseenterFn = amm_l0MouseenterFn(l0anchor, hoverCls, hoverprops.actOnHover, hoverprops.actOnHoverAt);
      }
      if (!l0anchor.amm_l0MouseleaveFn) {
        l0anchor.amm_l0MouseleaveFn = amm_l0MouseleaveFn(l0anchor, hoverCls);
      }
      if (!l0anchor.amm_l0FocusFn) {
        l0anchor.amm_l0FocusFn = amm_l0FocusFn(l0anchor, focusCls);
      }
      if (!l0anchor.amm_l0BlurFn) {
        l0anchor.amm_l0BlurFn = amm_l0BlurFn(l0anchor, focusCls);
      }

      amm_eventScheduler(true, l0anchor as HTMLElement, 'click', l0anchor.amm_l0ClickFn);
      amm_eventScheduler(true, l0anchor as HTMLElement, 'mouseenter', l0anchor.amm_l0MouseenterFn);
      amm_eventScheduler(true, l0anchor as HTMLElement, 'mouseleave', l0anchor.amm_l0MouseleaveFn);
      amm_eventScheduler(true, l0anchor as HTMLElement, 'focus', l0anchor.amm_l0FocusFn);
      amm_eventScheduler(true, l0anchor as HTMLElement, 'blur', l0anchor.amm_l0BlurFn);

      if (l0panel) {
        if (!l0panel.amm_panelClickFn) {
          l0panel.amm_panelClickFn = amm_subnav_out(overflowHiddenCls, activeCls, 'click');
        }
        amm_eventScheduler(true, l0panel as HTMLElement, 'click', l0panel.amm_panelClickFn);
        if (hoverprops.actOnHover) {
          if (!l0panel.amm_panelMouseoverFn) {
            l0panel.amm_panelMouseoverFn = amm_subnav_out(overflowHiddenCls, activeCls, 'mouseover');
          }
          amm_eventScheduler(true, l0panel as HTMLElement, 'mouseover', l0panel.amm_panelMouseoverFn);
        }
      }

      for (let j = l1nav.length - 1; j >= 0; j--) {
        const l1anchor = l1nav[j].l1anchor;
        const l1panel = l1nav[j].l1panel;
        const l2nav = l1nav[j].l2nav || [];
        
        if (l1anchor) {
          if (!l1anchor.amm_l1ClickFn) {
            l1anchor.amm_l1ClickFn = amm_l1ClickFn(l1anchor, l1panel, l0navelement, overflowHiddenCls, activeCls, 'click');
          }
          if (!l1anchor.amm_l1MouseenterFn) {
            l1anchor.amm_l1MouseenterFn = amm_l1MouseenterFn(l1anchor, hoverCls, hoverprops.actOnHover, hoverprops.actOnHoverAt);
          }
          if (!l1anchor.amm_l1MouseleaveFn) {
            l1anchor.amm_l1MouseleaveFn = amm_l1MouseleaveFn(l1anchor, hoverCls);
          }
          if (!l1anchor.amm_l1FocusFn) {
            l1anchor.amm_l1FocusFn = amm_l1FocusFn(l1anchor, focusCls);
          }
          if (!l1anchor.amm_l1BlurFn) {
            l1anchor.amm_l1BlurFn = amm_l1BlurFn(l1anchor, focusCls);
          }
  
          amm_eventScheduler(true, l1anchor as HTMLElement, 'click', l1anchor.amm_l1ClickFn);
          amm_eventScheduler(true, l1anchor as HTMLElement, 'mouseenter', l1anchor.amm_l1MouseenterFn);
          amm_eventScheduler(true, l1anchor as HTMLElement, 'mouseleave', l1anchor.amm_l1MouseleaveFn);
          amm_eventScheduler(true, l1anchor as HTMLElement, 'focus', l1anchor.amm_l1FocusFn);
          amm_eventScheduler(true, l1anchor as HTMLElement, 'blur', l1anchor.amm_l1BlurFn);
        }

        for (let k = l2nav.length - 1; k >= 0; k--) {
          const l2anchor = l2nav[k];

          if (!l2anchor.amm_l2MouseenterFn) {
            l2anchor.amm_l2MouseenterFn = amm_l2MouseenterFn(l2anchor, hoverCls);
          }
          if (!l2anchor.amm_l2MouseleaveFn) {
            l2anchor.amm_l2MouseleaveFn = amm_l2MouseleaveFn(l2anchor, hoverCls);
          }
          if (!l2anchor.amm_l2FocusFn) {
            l2anchor.amm_l2FocusFn = amm_l2FocusFn(l2anchor, focusCls);
          }
          if (!l2anchor.amm_l2BlurFn) {
            l2anchor.amm_l2BlurFn = amm_l2BlurFn(l2anchor, focusCls);
          }

          amm_eventScheduler(true, l2anchor as HTMLElement, 'mouseenter', l2anchor.amm_l2MouseenterFn);
          amm_eventScheduler(true, l2anchor as HTMLElement, 'mouseleave', l2anchor.amm_l2MouseleaveFn);
          amm_eventScheduler(true, l2anchor as HTMLElement, 'focus', l2anchor.amm_l2FocusFn);
          amm_eventScheduler(true, l2anchor as HTMLElement, 'blur', l2anchor.amm_l2BlurFn);
        }
      }
    }

    if (!(document as any).amm_docClickFn) {
      (document as any).amm_docClickFn = amm_document_out(overflowHiddenCls, activeCls, 'click');
    }
    amm_eventScheduler(true, document as HTMLDocument, 'click', (document as any).amm_docClickFn);
    if (hoverprops.actOnHover) {
      if (!(window as any).amm_docMouseoverFn) {
        (window as any).amm_docMouseoverFn = amm_document_out(overflowHiddenCls, activeCls, 'mouseover');
      }
      amm_eventScheduler(true, window as Window, 'mouseover', (window as any).amm_docMouseoverFn);
    }
  };

  const amm_init = (core: any, rootElem: HTMLElement, settings: IAMegMenSettings) => {
    _AddClass(rootElem, settings.rootCls ? settings.rootCls : '');
    core.rootElem = rootElem;
    core.settings = settings;
    core.mainElem = core.rootElem.querySelector(`.${settings.mainElementCls}`);
    core.togglenav = core.rootElem.querySelector(`.${settings.toggleBtnCls}`);
    core.closenav = core.rootElem.querySelector(`.${settings.closeBtnCls}`);
    core.offcanvas = core.rootElem.querySelector(`.${settings.offcanvasCls}`);
    core.tomain = core.rootElem.querySelectorAll(`.${settings.mainBtnCls}`);
    core.toprevious = core.rootElem.querySelectorAll(`.${settings.backBtnCls}`);

    if (core.settings.isRTL) {
      _AddClass(core.rootElem as HTMLElement, settings.rtl_Cls ? settings.rtl_Cls : '');
    }

    if (core.mainElem) {
      core.l0nav = [];
      const l0li = _ArrayCall(core.mainElem.querySelectorAll(':scope > ul > li'));
      
      for (let i = l0li.length - 1; i >= 0; i--) {
        let thisl0li = l0li[i];
        _ToggleUniqueId(thisl0li, settings, i, true);
        let nav0obj: any = {};
        nav0obj.l0li = thisl0li;
        nav0obj.l0anchor = thisl0li.querySelector(':scope > a');
        _AddClass(nav0obj.l0anchor, settings.l0AnchorCls ? settings.l0AnchorCls : '');
        const l0panel = thisl0li.querySelector(`:scope > .${settings.panelCls}`);

        if (l0panel) {
          _AddClass(l0panel, settings.l0PanelCls ? settings.l0PanelCls : '');
          nav0obj.l0panel = l0panel;
          nav0obj.l0tomain = l0panel.querySelector(`.${settings.mainBtnCls}`);
          const l1navelement = l0panel.querySelector(':scope > nav');

          if (l1navelement) {
            nav0obj.navelement = l1navelement;
            const l1cols = _ArrayCall(l1navelement.querySelectorAll(`:scope > .${settings.colCls}`)) || [];
            nav0obj.l1cols = l1cols.length;
            nav0obj.l1nav = [];

            if (l1cols.length > 0) {
              const shiftnum = (settings.supportedCols || 0) - l1cols.length;
              const l1li = _ArrayCall(l1navelement.querySelectorAll(`:scope > .${settings.colCls} > ul > li`)) || [];
              const colnum = parseInt((settings.supportedCols || 0) + '');
              for (let j = l1cols.length - 1; j >= 0; j--) {
                let thisl1col = l1cols[j];
                _AddClass(thisl1col, `${settings.colCls}-${colnum > 0 ? colnum : 2}`);
                if (j === colnum - 1 && j > 1) {
                  _AddClass(thisl1col, settings.lastcolCls ? settings.lastcolCls : '');
                }
              }
              for (let j = l1li.length - 1; j >= 0; j--) {
                let thisl1li = l1li[j];
                _ToggleUniqueId(thisl1li, settings, j, true);
                let nav1obj: any = {};
                nav1obj.l1li = thisl1li;
                nav1obj.l1anchor = thisl1li.querySelector(':scope > a');
                _AddClass(nav1obj.l1anchor, settings.l1AnchorCls ? settings.l1AnchorCls : '');
                const l1panel = thisl1li.querySelector(`:scope > .${settings.panelCls}`);

                if (l1panel) {
                  _AddClass(l1panel, settings.l1PanelCls ? settings.l1PanelCls : '');
                  nav1obj.l1panel = l1panel;
                  nav1obj.l1toback = l1panel.querySelector(`.${settings.backBtnCls}`);
                  const l2navelement = l1panel.querySelector(':scope > nav');

                  if (l2navelement) {
                    nav1obj.navelement = l2navelement;
                    const l2cols = _ArrayCall(l2navelement.querySelectorAll(`:scope > .${settings.colCls}`)) || [];
                    
                    if (l2cols.length > 0) {
                      if (settings.shiftColumns) {
                        _AddClass(l1navelement, `${settings.colShiftCls ? settings.colShiftCls : ''}-${shiftnum}`);
                      }
                      _AddClass(l1panel, `${settings.colWidthCls ? settings.colWidthCls : ''}-${shiftnum}`);
                      const l2a = _ArrayCall(l2navelement.querySelectorAll(`:scope > .${settings.colCls} > ul > li > a`)) || [];
                      
                      for (let k = l2a.length - 1; k >= 0; k--) {
                        let thisl2anchor = l2a[k];
                        _AddClass(thisl2anchor, settings.l2AnchorCls ? settings.l2AnchorCls : '');
                      }
                      for (let k = l2cols.length - 1; k >= 0; k--) {
                        let thisl2col = l2cols[k];
                        // _AddClass(l2cols[k], `__amegmen--col-${l2cols.length}`);
                        _AddClass(thisl2col, `${settings.colCls ? settings.colCls : ''}-1`);
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

        core.l0nav.push(nav0obj);
      }
    }
    amm_toggleevents(core, settings);
    return core;
  };

  const amm_destroy = (thisid: string, core: any) => {
    const rootElem = core.rootElem;
    const settings = core.settings;
    const allElems = _ArrayCall(rootElem.querySelectorAll('*'));
    const cls = settings.rootCls + ' '
      + settings.l0AnchorCls + ' '
      + settings.l0PanelCls + ' '
      + settings.l1AnchorCls + ' '
      + settings.l1PanelCls + ' '
      + settings.l2AnchorCls + ' '
      + settings.lastcolCls + ' '
      + settings.activeCls + ' '
      + settings.focusCls + ' '
      + settings.hoverCls + ' '
      + settings.rtl_Cls + ' '
      + settings.overflowHiddenCls;

    _RemoveClass(rootElem, cls);

    for (let i = allElems.length - 1; i >= 0; i--) {
      let thiselem = allElems[i];
      _RemoveClass(thiselem, cls);
      _ToggleUniqueId(thiselem, settings, i, false);

      for (let j = _EventList.length - 1; j >= 0; j--) {
        let thisevent = _EventList[j];
        if (thiselem[thisevent]) {
          if (/focus/gi.test(thisevent)) {
            amm_eventScheduler(false, thiselem as HTMLElement, 'focus', thiselem[thisevent]);
          }
          if (/blur/gi.test(thisevent)) {
            amm_eventScheduler(false, thiselem as HTMLElement, 'blur', thiselem[thisevent]);
          }
          if (/click/gi.test(thisevent)) {
            amm_eventScheduler(false, thiselem as HTMLElement, 'click', thiselem[thisevent]);
          }
          if (/mouseenter/gi.test(thisevent)) {
            amm_eventScheduler(false, thiselem as HTMLElement, 'mouseenter', thiselem[thisevent]);
          }
          if (/mouseleave/gi.test(thisevent)) {
            amm_eventScheduler(false, thiselem as HTMLElement, 'mouseleave', thiselem[thisevent]);
          }
          if (/mouseover/gi.test(thisevent)) {
            amm_eventScheduler(false, thiselem as HTMLElement, 'mouseover', thiselem[thisevent]);
          }
          thiselem[thisevent] = null;
        }
      }
    }

    let keycount = 0;
    for (let i in AllAMegMenInstances) {
      if (AllAMegMenInstances.hasOwnProperty(i)) {
        keycount++;
      }
    }

    if (keycount === 1) {
      if ((window as any).amm_docMouseoverFn) {
        amm_eventScheduler(false, window as any, 'mouseover', (window as any).amm_docMouseoverFn);
        (window as any).amm_docMouseoverFn = null;
      }
      if ((document as any).amm_docClickFn) {
        amm_eventScheduler(false, document as any, 'mouseover', (document as any).amm_docClickFn);
        (document as any).amm_docClickFn = null;
      }
    }
    delete AllAMegMenInstances[thisid];
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
    private core: any = {};

    constructor(thisid: string, rootElem: HTMLElement, options?: IAMegMenSettings) {
      this.core = amm_init(this.core, rootElem, (Object as any).assign({}, _Defaults, options));
      AllAMegMenInstances[thisid] = this.core;
    }
    public destroy = (thisid: string) => {
      amm_destroy(thisid, this.core);
    };
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
    private instances: IRoot = {};
    protected static instance: Root | null = null;
    
    /**
     * Constructor to initiate polyfills and adding the AMegMen to window object.
     *
     */
    constructor() {
      _EnableQSQSAScope();
      _EnableClosest();
      _EnableAssign();
      
      if (window && document && !(window as any).AMegMen) {
        (window as any).AMegMen = AMegMen;
      }
    }

    /**
     * Function to return single instance
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
    public init = (query: string, options?: IAMegMenSettings) => {
      const roots = _ArrayCall(document.querySelectorAll(query));
      const rootsLen = roots.length;
      const instancelen = this.instances.length;
      if (rootsLen > 0) {
        for (let i = 0; i < rootsLen; i++) {
          const id = (roots[i] as HTMLElement).getAttribute('id');
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
              this.instances[id] = new Core(id, (roots[i] as HTMLElement), options);
            } else {
              const thisid = id ? id : (Object as any).assign({}, _Defaults, options).idPrefix + '_' + new Date().getTime() + '_root_' + (i + 1);
              (roots[i] as HTMLElement).setAttribute('id', thisid);
              this.instances[thisid] = new Core(thisid, (roots[i] as HTMLElement), options);
            }
          }
        }
      } else {
        console.error('Element(s) with the provided query do(es) not exist');
      }
    };

    /**
     * Function to destroy the AMegMen plugin for provided query strings.
     * 
     * @param query - The CSS selector for which the AMegMen needs to be initialized.
     *
     */
    public destroy = (query: string) => {
      const roots = _ArrayCall(document.querySelectorAll(query));
      const rootsLen = roots.length;
      if (rootsLen > 0) {
        for (let i = 0; i < rootsLen; i++) {
          const id = (roots[i] as HTMLElement).getAttribute('id');
          if (id && this.instances[id]) {
            this.instances[id].destroy(id);
            delete this.instances[id];
          }
        }
      } else {
        console.error('Element(s) with the provided query do(es) not exist');
      }
    };
  }
}
