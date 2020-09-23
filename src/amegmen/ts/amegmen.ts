/***
 *     █████  ███    ███ ███████  ██████  ███    ███ ███████ ███    ██
 *    ██   ██ ████  ████ ██      ██       ████  ████ ██      ████   ██
 *    ███████ ██ ████ ██ █████   ██   ███ ██ ████ ██ █████   ██ ██  ██
 *    ██   ██ ██  ██  ██ ██      ██    ██ ██  ██  ██ ██      ██  ██ ██
 *    ██   ██ ██      ██ ███████  ██████  ██      ██ ███████ ██   ████
 *
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
    rTL_Cls?: string;
    shiftColumns?: boolean;
    actOnHover?: boolean;
    supportedCols?: number;
    toggleBtnCls?: string;
  }

  const _EventList = ['amm_landingMouseenterFn', 'amm_landingMouseleaveFn', 'amm_landingFocusFn', 'amm_landingBlurFn', 'amm_toggleMainClickFn', 'amm_closeMainClickFn',
    'amm_gotoLevelClickFn', 'amm_l0ClickFn', 'amm_l0MouseenterFn', 'amm_l0MouseleaveFn', 'amm_l0FocusFn', 'amm_l0BlurFn', 'amm_panelMouseoverFn', 'amm_panelClickFn',
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
    rTL_Cls: '__amegmen--r-to-l',
    shiftColumns: false,
    actOnHover: false,
    supportedCols: 4,
    toggleBtnCls: '__amegmen--toggle-cta',
  };

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

  const _StringTrim = (str: string) => {
    return str.replace(/^\s+|\s+$/g, '');
  };

  const _ArrayCall = (arr: any[] | NodeListOf<Element>) => {
    try {
      return Array.prototype.slice.call(arr || []);
    } catch (e) {
      return [];
    }
  };

  const _HasClass = (element: HTMLElement, cls: string) => {
    if (element) {
      const clsarr = element.className.split(' ');
      return clsarr.indexOf(cls) > -1 ? true : false;
    }

    return false;
  };

  const _AddClass = (element: HTMLElement, cls: string) => {
    if (element) {
      let clsarr = cls.split(' ');
      for (let i = 0; i < clsarr.length; i++) {
        if (!_HasClass(element, clsarr[i])) {
          element.className += ' ' + clsarr[i];
        }
      }
      element.className = _StringTrim(element.className);
    }
  };

  const _RemoveClass = (element: HTMLElement, cls: string) => {
    if (element) {
      let clsarr = cls.split(' ');
      let curclass = element.className.split(' ');
      for (let i = 0; i < curclass.length; i++) {
        if (clsarr.indexOf(curclass[i]) > -1) {
          curclass.splice(i, 1);
          i--;
        }
      }
      element.className = _StringTrim(curclass.join(' '));
    }
  };

  const _ToggleUniqueId = (element: HTMLElement, settings: IAMegMenSettings, uuid: number, shouldAddId: boolean) => {
    if (settings.idPrefix) {
      if (shouldAddId && !element.getAttribute('id')) {
        element.setAttribute('id', settings.idPrefix + '_' + new Date().getTime() + '_' + uuid);
      } else if (!shouldAddId && element.getAttribute('id')) {
        const thisid = element.getAttribute('id');
        const regex = new RegExp(settings.idPrefix, 'gi');
        if (regex.test(thisid || '')) {
          element.removeAttribute('id');
        }
      }
    }
  };

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

  const amm_subnav_out = (overflowHiddenCls: string, activeCls: string, eventtype: string) => {
    return () => {
      if (event) {
        const closest = (event.target as HTMLElement).closest(
          '#' + active_amegmen.closestl1li
        );
        if (!closest) {
          amm_subnavclose(false, overflowHiddenCls, activeCls, eventtype);
        }
      }
    };
  };

  const amm_subnavclose = (closeOnlyTopLevel: boolean, overflowHiddenCls: string, activeCls: string, eventtype: string) => {
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
        if (closeOnlyTopLevel) {
          _RemoveClass(rootElem, activeCls);
          _RemoveClass(mainElem, overflowHiddenCls);
        }
        for (let j = 0; j < l0nav.length; j++) {
          if (closeOnlyTopLevel) {
            _RemoveClass(l0nav[j].l0anchor, activeCls);
            _RemoveClass(l0nav[j].l0panel, activeCls);
          }
          _RemoveClass(l0nav[j].navelement, overflowHiddenCls);
          for (let k = 0; k < (l0nav[j].l1nav || []).length; k++) {
            _RemoveClass((l0nav[j].l1nav || [])[k].l1anchor, activeCls);
            _RemoveClass((l0nav[j].l1nav || [])[k].l1panel, activeCls);
          }
        }
      }
    }
  };

  const amm_gotoLevel = (closeOnlyTopLevel: boolean, overflowHiddenCls: string, activeCls: string, eventtype: string) => {
    return () => {
      if (event) {
        event.preventDefault();
      }
      amm_subnavclose(closeOnlyTopLevel, overflowHiddenCls, activeCls, eventtype);
    };
  };

  const amm_landingMouseenterFn = (landingElement: HTMLElement, hoverCls: string) => {
    return () => {
      _AddClass(landingElement, hoverCls);
    };
  };

  const amm_landingMouseleaveFn = (landingElement: HTMLElement, hoverCls: string) => {
    return () => {
      _RemoveClass(landingElement, hoverCls);
    };
  };

  const amm_landingFocusFn = (landingElement: HTMLElement, focusCls: string) => {
    return () => {
      _AddClass(landingElement, focusCls);
    };
  };

  const amm_landingBlurFn = (landingElement: HTMLElement, focusCls: string) => {
    return () => {
      _AddClass(landingElement, focusCls);
    };
  };

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

      for (let i = 0; i < landingElements.length; i++) {
        if (!landingElements[i].amm_landingMouseenterFn) {
          landingElements[i].amm_landingMouseenterFn = amm_landingMouseenterFn(landingElements[i], hoverCls);
        }
        if (!landingElements[i].amm_landingMouseleaveFn) {
          landingElements[i].amm_landingMouseleaveFn = amm_landingMouseleaveFn(landingElements[i], hoverCls);
        }
        if (!landingElements[i].amm_landingFocusFn) {
          landingElements[i].amm_landingFocusFn = amm_landingFocusFn(landingElements[i], focusCls);
        }
        if (!landingElements[i].amm_landingBlurFn) {
          landingElements[i].amm_landingBlurFn = amm_landingBlurFn(landingElements[i], focusCls);
        }
        amm_eventScheduler(true, landingElements[i] as HTMLElement, 'mouseenter', landingElements[i].amm_landingMouseenterFn);
        amm_eventScheduler(true, landingElements[i] as HTMLElement, 'mouseleave', landingElements[i].amm_landingMouseleaveFn);
        amm_eventScheduler(true, landingElements[i] as HTMLElement, 'focus', landingElements[i].amm_landingFocusFn);
        amm_eventScheduler(true, landingElements[i] as HTMLElement, 'blur', landingElements[i].amm_landingBlurFn);
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
      for (let i = 0; i < tomain.length; i++) {
        if (!tomain[i].amm_gotoLevelClickFn) {
          tomain[i].amm_gotoLevelClickFn = amm_gotoLevel(true, overflowHiddenCls, activeCls, 'click');
        }
        amm_eventScheduler(true, tomain[i] as HTMLElement, 'click', tomain[i].amm_gotoLevelClickFn);
      }
    }

    if (toprevious.length > 0) {
      for (let i = 0; i < toprevious.length; i++) {
        if (!toprevious[i].amm_gotoLevelClickFn) {
          toprevious[i].amm_gotoLevelClickFn = amm_gotoLevel(false, overflowHiddenCls, activeCls, 'click');
        }
        amm_eventScheduler(true, toprevious[i] as HTMLElement, 'click', toprevious[i].amm_gotoLevelClickFn);
      }
    }

    const l0nav = core.l0nav || [];
    for (let i = 0; i < l0nav.length; i++) {
      const l0anchor = l0nav[i].l0anchor;
      const l0panel = l0nav[i].l0panel;
      const l0navelement = l0nav[i].navelement;
      const l1nav = l0nav[i].l1nav || [];

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

      for (let j = 0; j < l1nav.length; j++) {
        const l1anchor = l1nav[j].l1anchor;
        const l1panel = l1nav[j].l1panel;
        const l2nav = l1nav[j].l2nav || [];

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

        for (let k = 0; k < l2nav.length; k++) {
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
      _AddClass(core.rootElem as HTMLElement, settings.rTL_Cls ? settings.rTL_Cls : '');
    }

    if (core.mainElem) {
      core.l0nav = [];
      const l0li = _ArrayCall(core.mainElem.querySelectorAll(':scope > ul > li'));
      for (let i = 0; i < l0li.length; i++) {
        _ToggleUniqueId(l0li[i], settings, i, true);
        let nav0obj: any = {};
        nav0obj.l0li = l0li[i];
        nav0obj.l0anchor = l0li[i].querySelector(':scope > a');
        _AddClass(nav0obj.l0anchor, settings.l0AnchorCls ? settings.l0AnchorCls : '');
        const l0panel = l0li[i].querySelector(`:scope > .${settings.panelCls}`);

        if (l0panel) {
          _AddClass(l0panel, settings.l0PanelCls ? settings.l0PanelCls : '');
          nav0obj.l0panel = l0panel;
          nav0obj.l0tomain = l0panel.querySelector(`.${settings.mainBtnCls}`);
          const l1navelement = l0panel.querySelector(':scope > nav');

          if (l1navelement) {
            nav0obj.navelement = l1navelement;
            const l1cols = _ArrayCall(l1navelement.querySelectorAll(`:scope > .${settings.colCls}`));
            nav0obj.l1cols = l1cols.length;
            nav0obj.l1nav = [];

            if (l1cols.length > 0) {
              const shiftnum = (settings.supportedCols || 0) - l1cols.length;
              const l1li = _ArrayCall(l1navelement.querySelectorAll(`:scope > .${settings.colCls} > ul > li`));
              const colnum = parseInt((settings.supportedCols || 0) + '');

              for (let j = 0; j < l1cols.length; j++) {
                _AddClass(l1cols[j], `${settings.colCls}-${colnum > 0 ? colnum : 2}`);
                if (j === colnum - 1 && j > 1) {
                  _AddClass(l1cols[j], settings.lastcolCls ? settings.lastcolCls : '');
                }
              }
              for (let j = 0; j < l1li.length; j++) {
                _ToggleUniqueId(l1li[j], settings, j, true);
                let nav1obj: any = {};
                nav1obj.l1li = l1li[j];
                nav1obj.l1anchor = l1li[j].querySelector(':scope > a');
                _AddClass(nav1obj.l1anchor, settings.l1AnchorCls ? settings.l1AnchorCls : '');
                const l1panel = l1li[j].querySelector(`:scope > .${settings.panelCls}`);

                if (l1panel) {
                  _AddClass(l1panel, settings.l1PanelCls ? settings.l1PanelCls : '');
                  nav1obj.l1panel = l1panel;
                  nav1obj.l1toback = l1panel.querySelector(`.${settings.backBtnCls}`);
                  const l2navelement = l1panel.querySelector(':scope > nav');

                  if (l2navelement) {
                    nav1obj.navelement = l2navelement;
                    const l2cols = _ArrayCall(l2navelement.querySelectorAll(`:scope > .${settings.colCls}`));

                    if (l2cols.length) {
                      if (settings.shiftColumns) {
                        _AddClass(l1navelement, `${settings.colShiftCls ? settings.colShiftCls : ''}-${shiftnum}`);
                      }
                      _AddClass(l1panel, `${settings.colWidthCls ? settings.colWidthCls : ''}-${shiftnum}`);
                      const l2a = _ArrayCall(
                        l2navelement.querySelectorAll(`:scope > .${settings.colCls} > ul > li > a`)
                      );

                      for (let k = 0; k < l2a.length; k++) {
                        _AddClass(l2a[k], settings.l2AnchorCls ? settings.l2AnchorCls : '');
                      }
                      for (let k = 0; k < l2cols.length; k++) {
                        // _AddClass(l2cols[k], `__amegmen--col-${l2cols.length}`);
                        _AddClass(l2cols[k], `${settings.colCls ? settings.colCls : ''}-1`);
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
      + settings.rTL_Cls + ' '
      + settings.overflowHiddenCls;

    _RemoveClass(rootElem, cls);

    for (let i = 0; i < allElems.length; i++) {
      _RemoveClass(allElems[i], cls);
      _ToggleUniqueId(allElems[i], settings, i, false);

      for (let j = 0; j < _EventList.length; j++) {
        if (allElems[i][_EventList[j]]) {
          if (/focus/gi.test(_EventList[j])) {
            amm_eventScheduler(false, allElems[i] as HTMLElement, 'focus', allElems[i][_EventList[j]]);
          }
          if (/blur/gi.test(_EventList[j])) {
            amm_eventScheduler(false, allElems[i] as HTMLElement, 'blur', allElems[i][_EventList[j]]);
          }
          if (/click/gi.test(_EventList[j])) {
            amm_eventScheduler(false, allElems[i] as HTMLElement, 'click', allElems[i][_EventList[j]]);
          }
          if (/mouseenter/gi.test(_EventList[j])) {
            amm_eventScheduler(false, allElems[i] as HTMLElement, 'mouseenter', allElems[i][_EventList[j]]);
          }
          if (/mouseleave/gi.test(_EventList[j])) {
            amm_eventScheduler(false, allElems[i] as HTMLElement, 'mouseleave', allElems[i][_EventList[j]]);
          }
          if (/mouseover/gi.test(_EventList[j])) {
            amm_eventScheduler(false, allElems[i] as HTMLElement, 'mouseover', allElems[i][_EventList[j]]);
          }
          allElems[i][_EventList[j]] = null;
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

  /***
   *     ██████  ██████  ██████  ███████
   *    ██      ██    ██ ██   ██ ██
   *    ██      ██    ██ ██████  █████
   *    ██      ██    ██ ██   ██ ██
   *     ██████  ██████  ██   ██ ███████
   *
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

  /***
   *    ██████   ██████   ██████  ████████
   *    ██   ██ ██    ██ ██    ██    ██
   *    ██████  ██    ██ ██    ██    ██
   *    ██   ██ ██    ██ ██    ██    ██
   *    ██   ██  ██████   ██████     ██
   *
   *
   */

  export class Root {
    private instances: IRoot = {};
    protected static instance: Root | null = null;
    constructor() {
      _EnableQSQSAScope();
      _EnableClosest();
      _EnableAssign();
      
      if (window && document && !(window as any).AMegMen) {
        (window as any).AMegMen = AMegMen;
      }
    }
    public static getInstance(): Root {
      if (!Root.instance) {
        Root.instance = new Root();
      }
      return Root.instance;
    }

    public init = (query: string, options?: IAMegMenSettings) => {
      const roots = _ArrayCall(document.querySelectorAll(query));
      if (roots.length > 0) {
        for (let i = 0; i < roots.length; i++) {
          const id = (roots[i] as HTMLElement).getAttribute('id');
          let iselempresent = false;
          if (id) {
            for (let j = 0; j < this.instances.length; j++) {
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

    public destroy = (query: string) => {
      const roots = _ArrayCall(document.querySelectorAll(query));
      if (roots.length > 0) {
        for (let i = 0; i < roots.length; i++) {
          const id = (roots[i] as HTMLElement).getAttribute('id');
          if (id && this.instances[id]) {
            this.instances[id].destroy(id);
            delete this.instances[id];
          }
        }
      }
    };
  }
}
