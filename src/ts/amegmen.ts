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
  "use strict";
  let AllAMegMenInstances: any = {};
  let active_amegmen: any = {};

  interface IRoot {
    [key: string]: any;
  }
  interface IAMegMenSettings {
    activeCls?: string;
    actOnHover?: boolean;
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
    l1ActiveCls?: string;
    l1AnchorCls?: string;
    l1PanelCls?: string;
    l2ActiveCls?: string;
    l2AnchorCls?: string;
    landingCtaCls?: string;
    lastcolCls?: string;
    mainBtnCls?: string;
    mainElementCls?: string;
    offcanvasCls?: string;
    overflowHiddenCls?: string;
    panelCls?: string;
    rootCls?: string;
    rtl_Cls?: string;
    shiftColumns?: boolean;
    supportedCols?: number;
    toggleBtnCls?: string;
  }

  const _Defaults = {
    activeCls: '__amegmen-active',
    actOnHover: false,
    actOnHoverAt: 1280,
    backBtnCls: '__amegmen--back-cta',
    closeBtnCls: '__amegmen--close-cta',
    colCls: '__amegmen--col',
    colShiftCls: '__amegmen-shift',
    colWidthCls: '__amegmen-width',
    focusCls: '__amegmen-focus',
    hoverCls: '__amegmen-hover',
    idPrefix: '__amegmen_id',
    isRTL: false,
    l0AnchorCls: '__amegmen--anchor-l0',
    l0PanelCls: '__amegmen--panel-l0',
    l1ActiveCls: '__amegmen--l1-active',
    l1AnchorCls: '__amegmen--anchor-l1',
    l1PanelCls: '__amegmen--panel-l1',
    l2ActiveCls: '__amegmen--l2-active',
    l2AnchorCls: '__amegmen--anchor-l2',
    landingCtaCls: '__amegmen--landing',
    lastcolCls: '__amegmen--col-last',
    mainBtnCls: '__amegmen--main-cta',
    mainElementCls: '__amegmen--main',
    offcanvasCls: '__amegmen--canvas',
    overflowHiddenCls: '__amegmen--nooverflow',
    panelCls: '__amegmen--panel',
    rootCls: '__amegmen',
    rtl_Cls: '__amegmen--r-to-l',
    shiftColumns: false,
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
  const amm_document_out = (event: Event, overflowHiddenCls: string, activeCls: string, l1ActiveCls: string, l2ActiveCls: string, eventtype: string) => {
    if (event && _StringTrim(active_amegmen.closestl0li || '').length > 0) {
      const closest = (event.target as HTMLElement).closest('#' + active_amegmen.closestl0li);
      if (!closest) {
        amm_subnavclose(true, overflowHiddenCls, activeCls, l1ActiveCls, l2ActiveCls, eventtype);
      }
    }
  };

  /**
   * Function to close the Level 2 Megamenu if click or hover happens on Level 1 Megamenu Panel
   * 
   * @param overflowHiddenCls - Class which disables scrollbars on mobile
   * @param activeCls - Class which activates the megamenu links and panels
   * @param eventtype - Is `click` or `mouseover`
   *
   */
  const amm_subnav_out = (event: Event, overflowHiddenCls: string, activeCls: string, l1ActiveCls: string, l2ActiveCls: string, eventtype: string) => {
    if (event && _StringTrim(active_amegmen.closestl1li || '').length > 0) {
      const closest = (event.target as HTMLElement).closest('#' + active_amegmen.closestl1li);
      if (!closest) {
        amm_subnavclose(false, overflowHiddenCls, activeCls, l1ActiveCls, l2ActiveCls, eventtype);
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
  const amm_subnavclose = (shouldCloseL0Panel: boolean, overflowHiddenCls: string, activeCls: string, l1ActiveCls: string, l2ActiveCls: string, eventtype: string) => {
    for (let i in AllAMegMenInstances) {
      const thiscore = AllAMegMenInstances[i];
      const rootElem = thiscore.rootElem;
      const offcanvas = thiscore.offcanvas;
      let shouldExecute = false;
      if (eventtype === 'mouseover' && (thiscore.settings || {}).actOnHover === true) {
        shouldExecute = true;
      }
      if (eventtype === 'click') {
        shouldExecute = true;
      }
      if (shouldExecute && _HasClass(rootElem, activeCls)) {
        const mainElem = thiscore.mainElem;
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
              thisl0.l0anchor.setAttribute('aria-expanded', 'false');
            }
            if (thisl0.l0panel) {
              _RemoveClass(thisl0.l0panel, activeCls);
              thisl0.l0panel.setAttribute('aria-expanded', 'false');
              thisl0.l0panel.setAttribute('aria-hidden', 'true');
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
                thisl1.l1anchor.setAttribute('aria-expanded', 'false');
              }
              if (thisl1.l1panel) {
                _RemoveClass(thisl1.l1panel, activeCls);
                thisl1.l1panel.setAttribute('aria-expanded', 'false');
                thisl1.l1panel.setAttribute('aria-hidden', 'true');
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
  const amm_landingMouseenterFn = (landingElement: HTMLElement, hoverCls: string) => {
    _AddClass(landingElement, hoverCls);
  };

  /**
   * Mouseleave event for Landing link on the panels
   * 
   * @param landingElement - An HTML Element
   * @param hoverCls - CSS Class for hovered element
   *
   */
  const amm_landingMouseleaveFn = (landingElement: HTMLElement, hoverCls: string) => {
    _RemoveClass(landingElement, hoverCls);
  };

  /**
   * Focus event for Landing link on the panels 
   * 
   * @param landingElement - An HTML Element
   * @param focusCls - CSS Class for focussed element
   *
   */
  const amm_landingFocusFn = (landingElement: HTMLElement, focusCls: string) => {
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
   * @param l0anchor - An HTML Anchor element at Level 0 Navigation
   * @param l0panel - Adjecent Panel to the l0anchor
   * @param parent - Parent LI element
   * @param mainElem - Main Wrapper which contains the navigation elements
   * @param overflowHiddenCls - Class which disables scrollbars on mobile
   * @param activeCls - Class for active elements
   * @param eventtype - 'Click' or 'Mouseenter' for hoverable megamenues
   *
   */
  const amm_l0ClickFn = (event: Event, l0anchor: HTMLElement, l0panel: HTMLElement, parent: HTMLElement, mainElem: HTMLElement, offcanvas: HTMLElement, overflowHiddenCls: string, activeCls: string, l1ActiveCls: string, l2ActiveCls: string, eventtype: string) => {
    if (event && l0panel) {
      event.preventDefault();
    }
    if (_HasClass(l0anchor, activeCls)) {
      (active_amegmen as any).elem = null;
      (active_amegmen as any).closestl0li = '';
      amm_subnavclose(true, overflowHiddenCls, activeCls, l1ActiveCls, l2ActiveCls, eventtype);
    } else {
      amm_subnavclose(true, overflowHiddenCls, activeCls, l1ActiveCls, l2ActiveCls, eventtype);
      (active_amegmen as any).elem = parent;
      (active_amegmen as any).closestl0li = (l0anchor.closest('li') as HTMLElement).getAttribute('id');
      l0anchor.setAttribute('aria-expanded', 'true');
      l0panel.setAttribute('aria-expanded', 'true');
      l0panel.setAttribute('aria-hidden', 'false');
      _AddClass(parent, activeCls);
      _AddClass(offcanvas, l1ActiveCls);
      _AddClass(l0anchor, activeCls);
      _AddClass(l0panel, activeCls);
      _AddClass(mainElem, overflowHiddenCls);
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
  const amm_l0MouseenterFn = (l0anchor: HTMLElement, hoverCls: string, actOnHover: boolean, actOnHoverAt: number) => {
    _AddClass(l0anchor, hoverCls);
    if (actOnHover) {
      const windowwidth = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;
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
   * @param l1anchor - An HTML Anchor element at Level 1 Navigation
   * @param l1panel - Adjecent Panel to the l1anchor
   * @param l0navelement - Parent `nav` element of l1anchor
   * @param overflowHiddenCls - Class which disables scrollbars on mobile
   * @param activeCls - Class for active elements
   * @param eventtype - 'Click' or 'Mouseenter' for hoverable megamenues
   *
   */
  const amm_l1ClickFn = (event: Event, l1anchor: HTMLElement, l1panel: HTMLElement, offcanvas: HTMLElement, l0navelement: HTMLElement, overflowHiddenCls: string, activeCls: string, l1ActiveCls: string, l2ActiveCls: string, eventtype: string) => {
    if (event && l1panel) {
      event.preventDefault();
    }
    if (_HasClass(l1anchor, activeCls)) {
      (active_amegmen as any).closestl1li = '';
      setTimeout(() => {
        amm_subnavclose(false, overflowHiddenCls, activeCls, l1ActiveCls, l2ActiveCls, eventtype);
      }, 0);
    } else {
      (active_amegmen as any).closestl1li = (l1anchor.closest('li') as HTMLElement).getAttribute('id');
      setTimeout(() => {
        amm_subnavclose(false, overflowHiddenCls, activeCls, l1ActiveCls, l2ActiveCls, eventtype);
      }, 0);
      l1anchor.setAttribute('aria-expanded', 'true');
      l1panel.setAttribute('aria-expanded', 'true');
      l1panel.setAttribute('aria-hidden', 'false');
      setTimeout(() => {
        _AddClass(offcanvas, l2ActiveCls);
        _AddClass(l1anchor, activeCls);
        _AddClass(l1panel, activeCls);
        _AddClass(l0navelement, overflowHiddenCls);
      }, 0);
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
  const amm_l1MouseenterFn = (l1anchor: HTMLElement, hoverCls: string, actOnHover: boolean, actOnHoverAt: number) => {
    _AddClass(l1anchor, hoverCls);
    if (actOnHover) {
      const windowwidth = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;
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
   * @param shouldCloseL0Panel - If `true`, loses Level 0 and Level 1 Panels. Otherwise closes Level 1 panels only
   * @param overflowHiddenCls - Class which disables scrollbars on mobile
   * @param activeCls - Class which activates the megamenu links and panels
   * @param eventtype - Is `click` or `mouseover`
   *
   */
  const amm_gotoMain = (event: Event, shouldCloseL0Panel: boolean, overflowHiddenCls: string, activeCls: string, l1ActiveCls: string, l2ActiveCls: string, eventtype: string) => {
    if (event) {
      event.preventDefault();
    }
    setTimeout(() => {
      amm_subnavclose(shouldCloseL0Panel, overflowHiddenCls, activeCls, l1ActiveCls, l2ActiveCls, eventtype);
    }, 0);
  };

  /**
   * Click event for closing megamenu on mobile 
   * 
   * @param togglenav - Button element to close Offcanvas on mobile
   * @param offcanvas - Offcanvas element containing megamenu
   * @param activeCls - Class which activates the megamenu links and panels
   *
   */
  const amm_closeMain = (event: Event, togglenav: HTMLElement, offcanvas: HTMLElement, shouldCloseL0Panel: boolean, overflowHiddenCls: string, activeCls: string, l1ActiveCls: string, l2ActiveCls: string, eventtype: string) => {
    if (event) {
      event.preventDefault();
    }
    setTimeout(() => {
      amm_subnavclose(shouldCloseL0Panel, overflowHiddenCls, activeCls, l1ActiveCls, l2ActiveCls, eventtype);
      _RemoveClass(togglenav, activeCls);
      _RemoveClass(offcanvas, activeCls);
    }, 0);
  };

  /**
   * Click event for opening/closing megamenu on mobile 
   * 
   * @param togglenav - Button element to close Offcanvas on mobile
   * @param offcanvas - Offcanvas element containing megamenu
   * @param activeCls - Class which activates the megamenu links and panels
   *
   */
  const amm_toggleMain = (event: Event, togglenav: HTMLElement, offcanvas: HTMLElement, shouldCloseL0Panel: boolean, overflowHiddenCls: string, activeCls: string, l1ActiveCls: string, l2ActiveCls: string, eventtype: string) => {
    if (event) {
      event.preventDefault();
    }
    if (_HasClass(togglenav, activeCls)) {
      setTimeout(() => {
        // _RemoveClass(togglenav, activeCls);
        // _RemoveClass(offcanvas, activeCls);
        amm_closeMain(event, togglenav, offcanvas, shouldCloseL0Panel, overflowHiddenCls, activeCls, l1ActiveCls, l2ActiveCls, eventtype);
      }, 0);
    } else {
      setTimeout(() => {
        _AddClass(togglenav, activeCls);
        _AddClass(offcanvas, activeCls);
      }, 0);
    }
  };

  /**
   * Function to toggle events to AMegMen instance elements 
   * 
   * @param core - AMegMen instance core object
   * @param settings - AMegMen instance settings object
   *
   */
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
    const l1ActiveCls = settings.l1ActiveCls ? settings.l1ActiveCls : '';
    const l2ActiveCls = settings.l2ActiveCls ? settings.l2ActiveCls : '';
    const hoverprops: any = {
      actOnHover: settings.actOnHover ? settings.actOnHover : false,
      actOnHoverAt: settings.actOnHoverAt ? settings.actOnHoverAt : 1280
    };
    
    if (settings.landingCtaCls) {
      const landingElements = _ArrayCall(core.rootElem.querySelectorAll('.' + settings.landingCtaCls + ' > a'));
      for (let i = landingElements.length - 1; i >= 0; i--) {
        let thislandingelem = landingElements[i];
        (thislandingelem as HTMLElement).addEventListener('mouseenter', thislandingelem.mouseenterClosure = function amm_landingMouseenterClosure() {
          amm_landingMouseenterFn(thislandingelem, hoverCls);
        }, false);
        (thislandingelem as HTMLElement).addEventListener('mouseleave', thislandingelem.mouseleaveClosure = function amm_landingMouseleaveClosure() {
          amm_landingMouseleaveFn(thislandingelem, hoverCls);
        }, false);
        (thislandingelem as HTMLElement).addEventListener('focus', thislandingelem.focusClosure = function amm_landingFocusClosure() {
          amm_landingFocusFn(thislandingelem, focusCls);
        }, false);
        (thislandingelem as HTMLElement).addEventListener('blur', thislandingelem.blurClosure = function amm_landingBlurClosure() {
          amm_landingBlurFn(thislandingelem, focusCls);
        }, false);
      }
    }

    if (togglenav && offcanvas) {
      (togglenav as HTMLElement).addEventListener('click', togglenav.clickClosure = function amm_toggleMainClickClosure(event: any) {
        amm_toggleMain(event, togglenav, offcanvas, true, overflowHiddenCls, activeCls, l1ActiveCls, l2ActiveCls, 'click');
      }, false);
    }

    if (closenav && offcanvas) {
      (closenav as HTMLElement).addEventListener('click', closenav.clickClosure = function amm_closeMainClickClosure(event: any) {
        amm_closeMain(event, togglenav, offcanvas, true, overflowHiddenCls, activeCls, l1ActiveCls, l2ActiveCls, 'click');
      }, false);      
    }

    if (tomain.length > 0) {
      for (let i = tomain.length - 1; i >= 0 ; i--) {
        let thismain = tomain[i];
        (thismain as HTMLElement).addEventListener('click', thismain.clickClosure = function amm_gotoMainClickClosure(event: any) {
          amm_gotoMain(event, true, overflowHiddenCls, activeCls, l1ActiveCls, l2ActiveCls, 'click');
        }, false);
      }
    }

    if (toprevious.length > 0) {
      for (let i = toprevious.length - 1; i >= 0 ; i--) {
        let thisprevious = toprevious[i];
        (thisprevious as HTMLElement).addEventListener('click', thisprevious.clickClosure = function amm_gotoMainClickClosure(event: any) {
          amm_gotoMain(event, false, overflowHiddenCls, activeCls, l1ActiveCls, l2ActiveCls, 'click');
        }, false);
      }
    }

    const l0nav = core.l0nav || [];
    for (let i = l0nav.length - 1; i >= 0; i--) {
      let thisl0nav = l0nav[i];
      const l0anchor = thisl0nav.l0anchor;
      const l0panel = thisl0nav.l0panel;
      const l0navelement = thisl0nav.navelement;
      const l1nav = thisl0nav.l1nav || [];

      l0anchor.addEventListener('click', l0anchor.clickClosure = function amm_l0ClickClosure(event: any) {
        amm_l0ClickFn(event, l0anchor, l0panel, core.rootElem, core.mainElem, offcanvas, overflowHiddenCls, activeCls, l1ActiveCls, l2ActiveCls, 'click');
      }, false);
      l0anchor.addEventListener('mouseenter', l0anchor.mouseenterClosure = function amm_l0MouseenterClosure() {
        amm_l0MouseenterFn(l0anchor, hoverCls, hoverprops.actOnHover, hoverprops.actOnHoverAt);
      }, false);
      l0anchor.addEventListener('mouseleave', l0anchor.mouseleaveClosure = function amm_l0MouseleaveClosure() {
        amm_l0MouseleaveFn(l0anchor, hoverCls);
      }, false);
      l0anchor.addEventListener('focus', l0anchor.focusClosure = function amm_l0FocusClosure() {
        amm_l0FocusFn(l0anchor, focusCls);
      }, false);
      l0anchor.addEventListener('blur', l0anchor.blurClosure = function amm_l0BlurClosure() {
        amm_l0BlurFn(l0anchor, focusCls);
      }, false);

      if (l0panel) {
        l0panel.addEventListener('click', l0panel.clickClosure = function ammSubnavOutClickClosure(event:any) {
          amm_subnav_out(event, overflowHiddenCls, activeCls, l1ActiveCls, l2ActiveCls, 'click');
        }, false);
        if (hoverprops.actOnHover) {
          l0panel.addEventListener('mouseover', l0panel.mouseoverClosure = function ammSubnavOutMouseoverClosure(event:any) {
            amm_subnav_out(event, overflowHiddenCls, activeCls, l1ActiveCls, l2ActiveCls, 'mouseover');
          }, false);
        }
      }

      for (let j = l1nav.length - 1; j >= 0; j--) {
        const l1anchor = l1nav[j].l1anchor;
        const l1panel = l1nav[j].l1panel;
        const l2nav = l1nav[j].l2nav || [];
        
        if (l1anchor) {
          l1anchor.addEventListener('click', l1anchor.clickClosure = function amm_l1ClickClosure(event: any) {
            amm_l1ClickFn(event, l1anchor, l1panel, offcanvas, l0navelement, overflowHiddenCls, activeCls, l1ActiveCls, l2ActiveCls, 'click');
          }, false);  
          l1anchor.addEventListener('mouseenter', l1anchor.mouseenterClosure = function amm_l1MouseenterClosure() {
            amm_l1MouseenterFn(l1anchor, hoverCls, hoverprops.actOnHover, hoverprops.actOnHoverAt);
          }, false);
          l1anchor.addEventListener('mouseleave', l1anchor.mouseleaveClosure = function amm_l1MouseleaveClosure() {
            amm_l1MouseleaveFn(l1anchor, hoverCls);
          }, false);
          l1anchor.addEventListener('focus', l1anchor.focusClosure = function amm_l1FocusClosure() {
            amm_l1FocusFn(l1anchor, focusCls);
          }, false);
          l1anchor.addEventListener('blur', l1anchor.blurClosure = function amm_l1BlurClosure() {
            amm_l1BlurFn(l1anchor, focusCls);
          }, false);
        }

        for (let k = l2nav.length - 1; k >= 0; k--) {
          const l2anchor = l2nav[k];
          (l2anchor as HTMLElement).addEventListener('mouseenter', l2anchor.mouseenterClosure = function amm_l2MouseenterClosure() {
            amm_l2MouseenterFn(l2anchor, hoverCls);
          }, false);
          (l2anchor as HTMLElement).addEventListener('mouseleave', l2anchor.mouseleaveClosure = function amm_l2MouseleaveClosure() {
            amm_l2MouseleaveFn(l2anchor, hoverCls);
          }, false);
          (l2anchor as HTMLElement).addEventListener('focus', l2anchor.focusClosure = function amm_l2FocusClosure() {
            amm_l2FocusFn(l2anchor, focusCls);
          }, false);
          (l2anchor as HTMLElement).addEventListener('blur', l2anchor.blurClosure = function amm_l2BlurClosure() {
            amm_l2BlurFn(l2anchor, focusCls);
          }, false);
        }
      }
    }

    (document as any).addEventListener('click', (document as any).clickClosure = function amm_docClickClosure(event: any) {
      amm_document_out(event, overflowHiddenCls, activeCls, l1ActiveCls, l2ActiveCls, 'click');
    }, false);
    if (hoverprops.actOnHover) {
      (window as any).addEventListener('mouseover', (window as any).mouseoverClosure = function amm_winMouseoverClosure(event: any) {
        amm_document_out(event, overflowHiddenCls, activeCls, l1ActiveCls, l2ActiveCls, 'mouseover');
      }, false); 
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
          nav0obj.l0anchor.setAttribute('role', 'button');
          nav0obj.l0anchor.setAttribute('aria-expanded', 'false');
          l0panel.setAttribute('role', 'region');
          l0panel.setAttribute('aria-expanded', 'false');
          l0panel.setAttribute('aria-hidden', 'true');
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
                  nav1obj.l1anchor.setAttribute('role', 'button');
                  nav1obj.l1anchor.setAttribute('aria-expanded', 'false');
                  l1panel.setAttribute('role', 'region');
                  l1panel.setAttribute('aria-expanded', 'false');
                  l1panel.setAttribute('aria-hidden', 'true');
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

  /**
   * Function to destroy AMegMen instance 
   * 
   * @param thisid - Element id of the AMegMen instance
   * @param core - AMegMen instance core object
   *
   */
  const amm_destroy = (thisid: string, core: any) => {
    const rootElem = core.rootElem;
    const settings = core.settings;
    console.log('.' + settings.landingCtaCls +
    ',.' + settings.toggleBtnCls +
    ',.' + settings.closeBtnCls +
    ',.' + settings.mainBtnCls +
    ',.' + settings.backBtnCls +
    ',.' + settings.l0AnchorCls +
    ',.' + settings.l0PanelCls +
    ',.' + settings.l1AnchorCls +
    ',.' + settings.l2AnchorCls);
    const allElems = _ArrayCall(rootElem.querySelectorAll(
      '.' + settings.landingCtaCls +
      ',.' + settings.toggleBtnCls +
      ',.' + settings.closeBtnCls +
      ',.' + settings.mainBtnCls +
      ',.' + settings.backBtnCls +
      ',.' + settings.l0AnchorCls +
      ',.' + settings.l0PanelCls +
      ',.' + settings.l1AnchorCls +
      ',.' + settings.l2AnchorCls
    ));
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
      + settings.l2ActiveCls + ' '
      + settings.l1ActiveCls + ' '
      + settings.overflowHiddenCls;

      console.log('============allElems', allElems.length);
    for (let i = allElems.length - 1; i >= 0; i--) {
      let thiselem = allElems[i];
      if ((_HasClass(thiselem, settings.l0AnchorCls) || _HasClass(thiselem, settings.l1AnchorCls)) && thiselem.getAttribute('role') === 'button') {
        thiselem.removeAttribute('role');
        thiselem.removeAttribute('aria-expanded');
      }
      if ((_HasClass(thiselem, settings.l0PanelCls) || _HasClass(thiselem, settings.l1PanelCls)) && thiselem.getAttribute('role') === 'region') {
        thiselem.removeAttribute('role');
        thiselem.removeAttribute('aria-expanded');
        thiselem.removeAttribute('aria-hidden');
      }

      _RemoveClass(thiselem, cls);
      _ToggleUniqueId(thiselem, settings, i, false);
      console.log('============thiselem.clickClosure', thiselem.clickClosure);
      if (thiselem.clickClosure) {
        thiselem.removeEventListener('click', thiselem.clickClosure, false);
        delete thiselem.clickClosure;
      }
      if (thiselem.mouseenterClosure) {
        thiselem.removeEventListener('mouseenter', thiselem.mouseenterClosure, false);
        delete thiselem.mouseenterClosure;
      }
      if (thiselem.mouseleaveClosure) {
        thiselem.removeEventListener('mouseleave', thiselem.mouseleaveClosure, false);
        delete thiselem.mouseleaveClosure;
      }
      if (thiselem.mouseoverClosure) {
        thiselem.removeEventListener('mouseover', thiselem.mouseoverClosure, false);
        delete thiselem.mouseoverClosure;
      }
      if (thiselem.focusClosure) {
        thiselem.removeEventListener('focus', thiselem.focusClosure, false);
        delete thiselem.focusClosure;
      }
      if (thiselem.blurClosure) {
        thiselem.removeEventListener('blur', thiselem.blurClosure, false);
        delete thiselem.blurClosure;
      }
    }

    let keycount = 0;
    for (let i in AllAMegMenInstances) {
      if (AllAMegMenInstances.hasOwnProperty(i)) {
        keycount++;
      }
    }

    if (keycount === 1) {
      if ((document as any).clickClosure) {
        (document as any).removeEventListener('click', (document as any).clickClosure, false);
        delete (document as any).clickClosure;
      }
      if ((window as any).mouseoverClosure) {
        (window as any).removeEventListener('mouseover', (window as any).mouseoverClosure, false);
        delete (window as any).mouseoverClosure;
      }
    }

    setTimeout(() => {
      _RemoveClass(rootElem, cls);
    }, 0);
    setTimeout(() => {
      delete AllAMegMenInstances[thisid];
    }, 0);
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
     * Constructor to initiate polyfills
     *
     */
    constructor() {
      _EnableQSQSAScope();
      _EnableClosest();
      _EnableAssign();
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
    public init = (query: string, options?: IAMegMenSettings) => {
      const roots = _ArrayCall(document.querySelectorAll(query));
      const rootsLen = roots.length;
      let instancelen = 0;
      for (let i in this.instances) {
        if (this.instances.hasOwnProperty(i)) {
          instancelen++;
        }
      }
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
if (typeof exports === 'object' && typeof module !== 'undefined') {
  module.exports = AMegMen;
}