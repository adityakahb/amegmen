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
  let AllAMegMenCores: any[] = [];
  let active_amegmen: any = {};

  interface IRoot {
    [key: string]: any;
  }
  interface IAMegMenSettings {
    activeClass?: string;
    actOnHoverAt?: number;
    backButtonClass?: string;
    closeButtonClass?: string;
    colClass?: string;
    colShiftClass?: string;
    colWidthClass?: string;
    focusClass?: string;
    hoverClass?: string;
    idPrefix?: string;
    isRightToLeft?: boolean;
    l0AnchorClass?: string;
    l0PanelClass?: string;
    l1AnchorClass?: string;
    l1PanelClass?: string;
    l2AnchorClass?: string;
    landingCtaClass?: string;
    lastcolClass?: string;
    mainButtonClass?: string;
    mainElementClass?: string;
    menuClass?: string;
    offcanvasclass?: string;
    overflowHiddenClass?: string;
    panelClass?: string;
    rightToLeftClass?: string;
    shiftColumns?: boolean;
    shouldActOnHover?: boolean;
    supportedCols?: number;
    toggleButtonClass?: string;
  }

  const _Defaults = {
    activeClass: 'active',
    actOnHoverAt: 1280,
    backButtonClass: '__amegmen--back-cta',
    closeButtonClass: '__amegmen--close-cta',
    colClass: '__amegmen--col',
    colShiftClass: '__amegmen-shift',
    colWidthClass: '__amegmen-width',
    focusClass: 'focus',
    hoverClass: 'hover',
    idPrefix: '__amegmen_id',
    isRightToLeft: false,
    l0AnchorClass: '__amegmen--anchor-l0',
    l0PanelClass: '__amegmen--panel-l0',
    l1AnchorClass: '__amegmen--anchor-l1',
    l1PanelClass: '__amegmen--panel-l1',
    l2AnchorClass: '__amegmen--anchor-l2',
    landingCtaClass: '__amegmen--landing',
    lastcolClass: '__amegmen--col-last',
    mainButtonClass: '__amegmen--main-cta',
    mainElementClass: '__amegmen--main',
    menuClass: '__amegmen',
    offcanvasclass: '__amegmen--canvas',
    overflowHiddenClass: '__amegmen--nooverflow',
    panelClass: '__amegmen--panel',
    rightToLeftClass: '__amegmen--r-to-l',
    shiftColumns: false,
    shouldActOnHover: false,
    supportedCols: 4,
    toggleButtonClass: '__amegmen--toggle-cta',
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

  const _AddUniqueId = (element: HTMLElement, settings: IAMegMenSettings, uuid: number) => {
    if (!element.getAttribute('id')) {
      element.setAttribute(
        'id',
        settings.idPrefix + '_' + new Date().getTime() + '_' + uuid
      );
    }
  };

  const amm_document_out = (overflowHiddenClass: string, activeClass: string) => {
    return () => {
      if (event && _StringTrim(active_amegmen.closestl0li || '').length > 0) {
        const closest = (event.target as HTMLElement).closest('#' + active_amegmen.closestl0li);
        if (!closest) {
          amm_subnavclose(true, overflowHiddenClass, activeClass);
        }
      }
    };
  };

  const amm_subnav_out = (overflowHiddenClass: string, activeClass: string) => {
    return () => {
      if (event) {
        const closest = (event.target as HTMLElement).closest(
          '#' + active_amegmen.closestl1li
        );
        if (!closest) {
          amm_subnavclose(false, overflowHiddenClass, activeClass);
        }
      }
    };
  };

  const amm_subnavclose = (closeOnlyTopLevel: boolean, overflowHiddenClass: string, activeClass: string) => {
    for (let i = 0; i < AllAMegMenCores.length; i++) {
      const mainElem = AllAMegMenCores[i].mainElem;
      const l0nav = AllAMegMenCores[i].l0nav || [];
      if (closeOnlyTopLevel) {
        _RemoveClass(mainElem, overflowHiddenClass);
      }
      for (let j = 0; j < l0nav.length; j++) {
        if (closeOnlyTopLevel) {
          _RemoveClass(l0nav[j].l0anchor, activeClass);
          _RemoveClass(l0nav[j].l0panel, activeClass);
        }
        _RemoveClass(l0nav[j].navelement, overflowHiddenClass);
        for (let k = 0; k < (l0nav[j].l1nav || []).length; k++) {
          _RemoveClass((l0nav[j].l1nav || [])[k].l1anchor, activeClass);
          _RemoveClass((l0nav[j].l1nav || [])[k].l1panel, activeClass);
        }
      }
    }
  };

  const amm_gotoLevel = (closeOnlyTopLevel: boolean, overflowHiddenClass: string, activeClass: string) => {
    return () => {
      if (event) {
        event.preventDefault();
      }
      amm_subnavclose(closeOnlyTopLevel, overflowHiddenClass, activeClass);
    };
  };

  const amm_landingMouseenterFn = (landingElement: HTMLElement, hoverClass: string) => {
    return () => {
      _AddClass(landingElement, hoverClass);
    };
  };

  const amm_landingMouseleaveFn = (landingElement: HTMLElement, hoverClass: string) => {
    return () => {
      _RemoveClass(landingElement, hoverClass);
    };
  };

  const amm_landingFocusFn = (landingElement: HTMLElement, focusClass: string) => {
    return () => {
      _AddClass(landingElement, focusClass);
    };
  };

  const amm_landingBlurFn = (landingElement: HTMLElement, focusClass: string) => {
    return () => {
      _AddClass(landingElement, focusClass);
    };
  };

  const amm_l0MouseenterFn = (l0anchor: HTMLElement, hoverClass: string) => {
    return () => {
      _AddClass(l0anchor, hoverClass);
    };
  };

  const amm_l0MouseleaveFn = (l0anchor: HTMLElement, hoverClass: string) => {
    return () => {
      _RemoveClass(l0anchor, hoverClass);
    };
  };

  const amm_l0FocusFn = (l0anchor: HTMLElement, focusClass: string) => {
    return () => {
      _AddClass(l0anchor, focusClass);
    };
  };

  const amm_l0BlurFn = (l0anchor: HTMLElement, focusClass: string) => {
    return () => {
      _RemoveClass(l0anchor, focusClass);
    };
  };

  const amm_l1MouseenterFn = (l1anchor: HTMLElement, hoverClass: string) => {
    return () => {
      _AddClass(l1anchor, hoverClass);
    };
  };

  const amm_l1MouseleaveFn = (l1anchor: HTMLElement, hoverClass: string) => {
    return () => {
      _RemoveClass(l1anchor, hoverClass);
    };
  };

  const amm_l1FocusFn = (l1anchor: HTMLElement, focusClass: string) => {
    return () => {
      _AddClass(l1anchor, focusClass);
    };
  };

  const amm_l1BlurFn = (l1anchor: HTMLElement, focusClass: string) => {
    return () => {
      _RemoveClass(l1anchor, focusClass);
    };
  };

  const amm_l2MouseenterFn = (l2anchor: HTMLElement, hoverClass: string) => {
    return () => {
      _AddClass(l2anchor, hoverClass);
    };
  };

  const amm_l2MouseleaveFn = (l2anchor: HTMLElement, hoverClass: string) => {
    return () => {
      _RemoveClass(l2anchor, hoverClass);
    };
  };

  const amm_l2FocusFn = (l2anchor: HTMLElement, focusClass: string) => {
    return () => {
      _AddClass(l2anchor, focusClass);
    };
  };

  const amm_l2BlurFn = (l2anchor: HTMLElement, focusClass: string) => {
    return () => {
      _RemoveClass(l2anchor, focusClass);
    };
  };

  const amm_l0ClickFn = (l0anchor: HTMLElement, l0panel: HTMLElement, parent: HTMLElement, mainElem: HTMLElement, overflowHiddenClass: string, activeClass: string) => {
    return () => {
      if (event && l0panel) {
        event.preventDefault();
      }
      if (_HasClass(l0anchor, activeClass)) {
        (active_amegmen as any).elem = null;
        (active_amegmen as any).closestl0li = '';
        amm_subnavclose(true, overflowHiddenClass, activeClass);
      } else {
        amm_subnavclose(true, overflowHiddenClass, activeClass);
        (active_amegmen as any).elem = parent;
        (active_amegmen as any).closestl0li = (l0anchor.closest('li') as HTMLElement).getAttribute('id');
        _AddClass(l0anchor, activeClass);
        _AddClass(l0panel, activeClass);
        _AddClass(mainElem, overflowHiddenClass);
      }
    };
  };

  const amm_l1ClickFn = (
    l1anchor: HTMLElement,
    l1panel: HTMLElement,
    l0navelement: HTMLElement,
    overflowHiddenClass: string,
    activeClass: string
  ) => {
    return () => {
      if (event && l1panel) {
        event.preventDefault();
      }
      if (_HasClass(l1anchor, activeClass)) {
        (active_amegmen as any).closestl1li = '';
        amm_subnavclose(false, overflowHiddenClass, activeClass);
      } else {
        (active_amegmen as any).closestl1li = (l1anchor.closest('li') as HTMLElement).getAttribute('id');
        amm_subnavclose(false, overflowHiddenClass, activeClass);
        _AddClass(l1anchor, activeClass);
        _AddClass(l1panel, activeClass);
        _AddClass(l0navelement, overflowHiddenClass);
      }
    };
  };

  const amm_closeMain = (
    togglenav: HTMLElement,
    offcanvas: HTMLElement,
    activeClass: string
  ) => {
    return () => {
      if (event) {
        event.preventDefault();
      }
      _RemoveClass(togglenav, activeClass);
      _RemoveClass(offcanvas, activeClass);
    };
  };

  const amm_toggleMain = (
    togglenav: HTMLElement,
    offcanvas: HTMLElement,
    activeClass: string
  ) => {
    return () => {
      if (event) {
        event.preventDefault();
        if (_HasClass(togglenav, activeClass)) {
          _RemoveClass(togglenav, activeClass);
          _RemoveClass(offcanvas, activeClass);
        } else {
          _AddClass(togglenav, activeClass);
          _AddClass(offcanvas, activeClass);
        }
      }
    };
  };

  const amm_eventScheduler = (shouldAdd: Boolean, element: HTMLElement | HTMLDocument | Window, eventtype: string, fn: EventListenerOrEventListenerObject) => {
    shouldAdd ? element.addEventListener(eventtype, fn, false) : element.removeEventListener(eventtype, fn, false);
  };

  const amm_toggleevents = (
    core: any,
    settings: IAMegMenSettings,
    shouldAddEevents: boolean
  ) => {
    const togglenav = core.togglenav;
    const closenav = core.closenav;
    const offcanvas = core.offcanvas;
    const tomain = _ArrayCall(core.tomain);
    const toprevious = _ArrayCall(core.toprevious);
    const overflowHiddenClass = settings.overflowHiddenClass ? settings.overflowHiddenClass : '';
    const activeClass = settings.activeClass ? settings.activeClass : '';
    const hoverClass = settings.hoverClass ? settings.hoverClass : '';
    const focusClass = settings.focusClass ? settings.focusClass : '';

    if (settings.landingCtaClass) {
      const landingElements = _ArrayCall(
        core.rootelem.querySelectorAll('.' + settings.landingCtaClass + ' > a')
      );

      for (let i = 0; i < landingElements.length; i++) {
        amm_eventScheduler(shouldAddEevents, landingElements[i] as HTMLElement, 'mouseenter', amm_landingMouseenterFn(landingElements[i], hoverClass));
        amm_eventScheduler(shouldAddEevents, landingElements[i] as HTMLElement, 'mouseleave', amm_landingMouseleaveFn(landingElements[i], hoverClass));
        amm_eventScheduler(shouldAddEevents, landingElements[i] as HTMLElement, 'focus', amm_landingFocusFn(landingElements[i], focusClass));
        amm_eventScheduler(shouldAddEevents, landingElements[i] as HTMLElement, 'blur', amm_landingBlurFn(landingElements[i], focusClass));
      }
    }

    if (togglenav && offcanvas) {
      amm_eventScheduler(shouldAddEevents, togglenav as HTMLElement, 'click', amm_toggleMain(togglenav, offcanvas, activeClass));
    }

    if (closenav && offcanvas) {
      amm_eventScheduler(shouldAddEevents, closenav as HTMLElement, 'click', amm_closeMain(togglenav, offcanvas, activeClass));
    }

    if (tomain.length > 0) {
      for (let i = 0; i < tomain.length; i++) {
        amm_eventScheduler(shouldAddEevents, tomain[i] as HTMLElement, 'click', amm_gotoLevel(true, overflowHiddenClass, activeClass));
      }
    }

    if (toprevious.length > 0) {
      for (let i = 0; i < toprevious.length; i++) {
        amm_eventScheduler(shouldAddEevents, toprevious[i] as HTMLElement, 'click', amm_gotoLevel(false, overflowHiddenClass, activeClass));
      }
    }

    const l0nav = core.l0nav || [];
    for (let i = 0; i < l0nav.length; i++) {
      const l0anchor = l0nav[i].l0anchor;
      const l0panel = l0nav[i].l0panel;
      const l0navelement = l0nav[i].navelement;
      const l1nav = l0nav[i].l1nav || [];

      amm_eventScheduler(shouldAddEevents, l0anchor as HTMLElement, 'click', amm_l0ClickFn(l0anchor, l0panel, core.rootelem, core.mainElem, overflowHiddenClass, activeClass));
      amm_eventScheduler(shouldAddEevents, l0anchor as HTMLElement, 'mouseenter', amm_l0MouseenterFn(l0anchor, hoverClass));
      amm_eventScheduler(shouldAddEevents, l0anchor as HTMLElement, 'mouseleave', amm_l0MouseleaveFn(l0anchor, hoverClass));
      amm_eventScheduler(shouldAddEevents, l0anchor as HTMLElement, 'focus', amm_l0FocusFn(l0anchor, focusClass));
      amm_eventScheduler(shouldAddEevents, l0anchor as HTMLElement, 'blur', amm_l0BlurFn(l0anchor, focusClass));

      if (l0panel) {
        amm_eventScheduler(shouldAddEevents, l0panel as HTMLElement, 'click', amm_subnav_out(overflowHiddenClass, activeClass));
      }

      for (let j = 0; j < l1nav.length; j++) {
        const l1anchor = l1nav[j].l1anchor;
        const l1panel = l1nav[j].l1panel;
        const l2nav = l1nav[j].l2nav || [];

        amm_eventScheduler(shouldAddEevents, l1anchor as HTMLElement, 'click', amm_l1ClickFn(l1anchor, l1panel, l0navelement, overflowHiddenClass, activeClass));
        amm_eventScheduler(shouldAddEevents, l1anchor as HTMLElement, 'mouseenter', amm_l1MouseenterFn(l1anchor, hoverClass));
        amm_eventScheduler(shouldAddEevents, l1anchor as HTMLElement, 'mouseleave', amm_l1MouseleaveFn(l1anchor, hoverClass));
        amm_eventScheduler(shouldAddEevents, l1anchor as HTMLElement, 'focus', amm_l1FocusFn(l1anchor, focusClass));
        amm_eventScheduler(shouldAddEevents, l1anchor as HTMLElement, 'blur', amm_l1BlurFn(l1anchor, focusClass));
      
        for (let k = 0; k < l2nav.length; k++) {
          const l2anchor = l2nav[k];

          amm_eventScheduler(shouldAddEevents, l2anchor as HTMLElement, 'mouseenter', amm_l2MouseenterFn(l2anchor, hoverClass));
          amm_eventScheduler(shouldAddEevents, l2anchor as HTMLElement, 'mouseleave', amm_l2MouseleaveFn(l2anchor, hoverClass));
          amm_eventScheduler(shouldAddEevents, l2anchor as HTMLElement, 'focus', amm_l2FocusFn(l2anchor, focusClass));
          amm_eventScheduler(shouldAddEevents, l2anchor as HTMLElement, 'blur', amm_l2BlurFn(l2anchor, focusClass));
        }
      }
    }

    amm_eventScheduler(shouldAddEevents, document as HTMLDocument, 'click', amm_document_out(overflowHiddenClass, activeClass));

  };

  const amm_init = (core: any, rootelem: HTMLElement, settings: IAMegMenSettings) => {
    core.rootelem = rootelem;
    core.settings = settings;
    core.mainElem = core.rootelem.querySelector(`.${settings.mainElementClass}`);
    core.togglenav = core.rootelem.querySelector(`.${settings.toggleButtonClass}`);
    core.closenav = core.rootelem.querySelector(`.${settings.closeButtonClass}`);
    core.offcanvas = core.rootelem.querySelector(`.${settings.offcanvasclass}`);
    core.tomain = core.rootelem.querySelectorAll(`.${settings.mainButtonClass}`);
    core.toprevious = core.rootelem.querySelectorAll(`.${settings.backButtonClass}`);

    if (core.settings.isRightToLeft) {
      _AddClass(core.rootelem as HTMLElement, settings.rightToLeftClass ? settings.rightToLeftClass : '');
    }

    if (core.mainElem) {
      core.l0nav = [];
      const l0li = _ArrayCall(core.mainElem.querySelectorAll(':scope > ul > li'));
      for (let i = 0; i < l0li.length; i++) {
        _AddUniqueId(l0li[i], settings, i);
        let nav0obj: any = {};
        nav0obj.l0li = l0li[i];
        nav0obj.l0anchor = l0li[i].querySelector(':scope > a');
        _AddClass(nav0obj.l0anchor,settings.l0AnchorClass ? settings.l0AnchorClass : '');
        const l0panel = l0li[i].querySelector(`:scope > .${settings.panelClass}`);

        if (l0panel) {
          _AddClass(l0panel, settings.l0PanelClass ? settings.l0PanelClass : '');
          nav0obj.l0panel = l0panel;
          nav0obj.l0tomain = l0panel.querySelector(`.${settings.mainButtonClass}`);
          const l1navelement = l0panel.querySelector(':scope > nav');

          if (l1navelement) {
            nav0obj.navelement = l1navelement;
            const l1cols = _ArrayCall(l1navelement.querySelectorAll(`:scope > .${settings.colClass}`));
            nav0obj.l1cols = l1cols.length;
            nav0obj.l1nav = [];

            if (l1cols.length > 0) {
              const shiftnum = (settings.supportedCols || 0) - l1cols.length;
              const l1li = _ArrayCall(l1navelement.querySelectorAll(`:scope > .${settings.colClass} > ul > li`));
              const colnum = parseInt((settings.supportedCols || 0) + '');

              for (let j = 0; j < l1cols.length; j++) {
                _AddClass(l1cols[j], `${settings.colClass}-${colnum > 0 ? colnum : 2}`);
                if (j === colnum - 1 && j > 1) {
                  _AddClass(l1cols[j], settings.lastcolClass ? settings.lastcolClass : '');
                }
              }
              for (let j = 0; j < l1li.length; j++) {
                _AddUniqueId(l1li[j], settings, j);
                let nav1obj: any = {};
                nav1obj.l1li = l1li[j];
                nav1obj.l1anchor = l1li[j].querySelector(':scope > a');
                _AddClass(nav1obj.l1anchor, settings.l1AnchorClass ? settings.l1AnchorClass : '');
                const l1panel = l1li[j].querySelector(`:scope > .${settings.panelClass}`);

                if (l1panel) {
                  _AddClass(l1panel, settings.l1PanelClass ? settings.l1PanelClass : '');
                  nav1obj.l1panel = l1panel;
                  nav1obj.l1toback = l1panel.querySelector(`.${settings.backButtonClass}`);
                  const l2navelement = l1panel.querySelector(':scope > nav');

                  if (l2navelement) {
                    nav1obj.navelement = l2navelement;
                    const l2cols = _ArrayCall(l2navelement.querySelectorAll(`:scope > .${settings.colClass}`));

                    if (l2cols.length) {
                      if (settings.shiftColumns) {
                        _AddClass(l1navelement, `${settings.colShiftClass ? settings.colShiftClass : ''}-${shiftnum}`);
                      }
                      _AddClass(l1panel, `${settings.colWidthClass ? settings.colWidthClass : ''}-${shiftnum}`);
                      const l2a = _ArrayCall(
                        l2navelement.querySelectorAll(`:scope > .${settings.colClass} > ul > li > a`)
                      );

                      for (let k = 0; k < l2a.length; k++) {
                        _AddClass(l2a[k], settings.l2AnchorClass ? settings.l2AnchorClass : '');
                      }
                      for (let k = 0; k < l2cols.length; k++) {
                        // _AddClass(l2cols[k], `__amegmen--col-${l2cols.length}`);
                        _AddClass(l2cols[k], `${settings.colClass ? settings.colClass : ''}-1`);
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
    amm_toggleevents(core, settings, true);
    return core;
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

    constructor(rootelem: HTMLElement, options?: IAMegMenSettings) {
      this.core = amm_init(
        this.core,
        rootelem,
        (Object as any).assign({}, _Defaults, options)
      );
      AllAMegMenCores.push(this.core);
    }
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

      if (window && document) {
        window.AMegMen = AMegMen;
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
              this.instances[id] = new Core((roots[i] as HTMLElement), options);
            } else {
              const thisid = id ? id : (Object as any).assign({}, _Defaults, options).idPrefix + '_' + new Date().getTime() + '_root_' + (i+1);
              (roots[i] as HTMLElement).setAttribute('id', thisid);
              this.instances[thisid] = new Core((roots[i] as HTMLElement), options);
            }
          }
        }
      } else {
        throw new Error('Element(s) with the provided query do(es) not exist');
      }
    };
  }
}
