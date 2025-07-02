namespace AMegMen {
  interface ISettings {
    idPrefix: string;
  }
  interface IReceivedSettings {
    idPrefix?: string;
  }
  interface IEvent {
    el: Element | Document | Window;
    remove: () => void;
  }
  interface IInstances {
    [key: string]: Core;
  }
  interface ISubnav0 {
    container: Element;
  }
  interface ILi0 {
    li: Element;
    anchor: Element;
    prev?: ILi0;
    next?: ILi0;
    subnav?: ISubnav0;
  }
  interface IUl0 {
    l0ul: Element;
    l0li: ILi0[];
  }
  interface ICore {
    _close: Element;
    _open: Element;
    events: IEvent[];
    opts: ISettings;
    root: Element;
    l0: IUl0;
  }

  /* SLIDE UP */
  const slideUp = (target: HTMLElement, duration = 250) => {
    target.style.transitionProperty = 'height, margin, padding';
    target.style.transitionDuration = `${duration}ms`;
    // target.style.boxSizing = 'border-box';
    target.style.height = `${target.offsetHeight}px`;
    target && target.offsetHeight;
    target.style.overflow = 'hidden';
    target.style.height = '0';
    target.style.paddingTop = '0';
    target.style.paddingBottom = '0';
    target.style.marginTop = '0';
    target.style.marginBottom = '0';
    window.setTimeout(() => {
      target.style.display = 'none';
      target.style.removeProperty('height');
      target.style.removeProperty('padding-top');
      target.style.removeProperty('padding-bottom');
      target.style.removeProperty('margin-top');
      target.style.removeProperty('margin-bottom');
      target.style.removeProperty('overflow');
      target.style.removeProperty('transition-duration');
      target.style.removeProperty('transition-property');
    }, duration);
  };

  /* SLIDE DOWN */
  const slideDown = (target: HTMLElement, duration = 250) => {
    target.style.removeProperty('display');
    let display = window.getComputedStyle(target).display;
    if (display === 'none') {
      display = 'block';
    }
    target.style.display = display;
    const height = target.offsetHeight;
    target.style.overflow = 'hidden';
    target.style.height = '0';
    target.style.paddingTop = '0';
    target.style.paddingBottom = '0';
    target.style.marginTop = '0';
    target.style.marginBottom = '0';
    target && target.offsetHeight;
    // target.style.boxSizing = 'border-box';
    target.style.transitionProperty = 'height, margin, padding';
    target.style.transitionDuration = `${duration}ms`;
    target.style.height = `${height}px`;
    target.style.removeProperty('padding-top');
    target.style.removeProperty('padding-bottom');
    target.style.removeProperty('margin-top');
    target.style.removeProperty('margin-bottom');
    window.setTimeout(() => {
      target.style.removeProperty('height');
      target.style.removeProperty('overflow');
      target.style.removeProperty('transition-duration');
      target.style.removeProperty('transition-property');
    }, duration);
  };

  const globalEvents: IEvent[] = [];
  const allInstances: IInstances = {};

  const $$ = (parent: Element | Document, selector: string) =>
    Array.from(parent.querySelectorAll(selector));
  const $ = (parent: Element | Document, selector: string) => $$(parent, selector)[0];

  const debounce = (func: Function) => {
    let timer: any;
    return function (event: any) {
      if (timer) {
        clearTimeout(timer);
      }
      timer = setTimeout(func, 100, event);
    };
  };

  const defaults: ISettings = {
    idPrefix: 'amegmen_id_',
  };

  const stringTrim = (str: string) => {
    return str.replace(/^\s+|\s+$|\s+(?=\s)/g, '');
  };

  const hasClass = (element: Element, cls: string) =>
    stringTrim(cls)
      .split(' ')
      .some((classStr) => element.classList.contains(classStr));

  const addClass = (element: Element, cls: string) => {
    cls.split(' ').forEach((classStr) => {
      element.classList.add(classStr);
    });
  };

  const removeClass = (element: Element, cls: string) => {
    cls.split(' ').forEach((classStr) => {
      element.classList.remove(classStr);
    });
  };

  const toggleClass = (element: Element, cls: string) => {
    hasClass(element, cls) ? removeClass(element, cls) : addClass(element, cls);
  };

  const toggleUniqueId = (
    element: Element,
    settings: ISettings,
    unique_number: number,
    shouldAddId: boolean,
  ): string => {
    let instanceId = '';
    if (shouldAddId && !element.getAttribute('id')) {
      instanceId = `${settings.idPrefix}_${new Date().getTime()}_${unique_number}`;
      element.setAttribute('id', instanceId);
    } else if (!shouldAddId && element.getAttribute('id')) {
      const thisid = element.getAttribute('id') || '';
      const regex = new RegExp(settings.idPrefix, 'gi');
      instanceId = thisid;
      if (regex.test(thisid || '')) {
        element.removeAttribute('id');
      }
    }
    return instanceId;
  };

  const removeEventListeners = (core: any, el: Element | Document | Window) => {
    let j = core.eH.length;
    while (j--) {
      if (core.eH[j].el.isEqualNode && core.eH[j].element.isEqualNode(el)) {
        core.eH[j].remove();
        core.eH.splice(j, 1);
      }
    }
  };

  const eventHandler = (
    el: Element | Document | Window,
    type: string,
    listener: EventListenerOrEventListenerObject,
  ) => {
    const eventHandlerObj: IEvent = {
      el,
      remove: () => {
        el.removeEventListener(type, listener, false);
      },
    };
    el.addEventListener(type, listener, false);
    return eventHandlerObj;
  };

  const closeAllSubnavs = (core: ICore, presentAnchor?: Element) => {
    core.l0.l0li.forEach((l0liEl_2) => {
      if (l0liEl_2.subnav?.container && !(presentAnchor && l0liEl_2.anchor === presentAnchor)) {
        removeClass(l0liEl_2.subnav?.container, 'amegmen-subnav-active');
        slideUp(l0liEl_2.subnav?.container as HTMLElement);
      }
    });
  };

  const addBasicEvents = (core: ICore) => {
    core.events.push(
      eventHandler(core._close, 'click', () => {
        removeClass(core.root, 'amegmen-root-active');
      }),
    );

    core.events.push(
      eventHandler(core._open, 'click', () => {
        addClass(core.root, 'amegmen-root-active');
      }),
    );

    core.l0.l0li.forEach((l0liEl) => {
      if (l0liEl.subnav?.container) {
        const subnavContainer = l0liEl.subnav?.container;
        core.events.push(
          eventHandler(l0liEl.anchor, 'click', (event) => {
            event.preventDefault();
            toggleClass(subnavContainer, 'amegmen-subnav-active');
            closeAllSubnavs(core, l0liEl.anchor);
            if (hasClass(subnavContainer, 'amegmen-subnav-active')) {
              slideDown(subnavContainer as HTMLElement);
              addClass(core.root, 'amegmen-root-active');
            } else {
              slideUp(subnavContainer as HTMLElement);
              removeClass(core.root, 'amegmen-root-active');
            }
          }),
        );
      }
    });

    core.events.push(
      eventHandler(
        window,
        'resize',
        debounce(() => {
          closeAllSubnavs(core);
        }),
      ),
    );

    core.events.push(
      eventHandler(document, 'click', (event) => {
        if (
          hasClass(core.root, 'amegmen-root-active') && // Only close if it's currently open
          !core.root.contains(event.target as Node)
        ) {
          closeAllSubnavs(core);
        }
      }),
    );
  };

  const constructDOM = (root: Element, opts: ISettings): ICore => {
    const toggleOpen = $(root, '.amegmen-nav-cta-open');
    const toggleClose = $(root, '.amegmen-nav-cta-close');

    // interface ISubnav0 {
    //     container: Element;
    //   }
    //   interface ILi0 {
    //     li: Element;
    //     anchor: Element;
    //     prev: ILi0 | null;
    //     next: ILi0 | null;
    //     subnav: ISubnav0 | null;
    //   }
    //   interface IUl0 {
    //     l0ul: Element;
    //     l0li: ILi0[];
    //   }

    const l0ul = $(root, '.amegmen-ul-0');
    const l0links = $$(l0ul, ':scope > li');
    const li0Arr: ILi0[] = [];
    l0links.forEach((li) => {
      li0Arr.push({
        li,
        anchor: $(li, ':scope .amegmen-nav-item'),
        subnav: {
          container: $(li, ':scope > .amegmen-subnav'),
        },
      });
    });

    li0Arr.forEach((l0item, index) => {
      li0Arr[index - 1] && (l0item.prev = li0Arr[index - 1]);
      li0Arr[index + 1] && (l0item.next = li0Arr[index + 1]);
    });

    return {
      _close: toggleClose,
      _open: toggleOpen,
      events: [],
      opts,
      root,
      l0: {
        l0ul,
        l0li: li0Arr,
      },
    };
  };

  const initCoreFn = (root: Element, opts: ISettings): ICore => {
    const core: ICore = constructDOM(root, opts);

    addBasicEvents(core);

    return core;
  };
  class Core {
    constructor(root: Element, options: ISettings) {
      initCoreFn(root, options);
    }
  }

  export const init = (root: Element, options: ISettings) => {
    const rootId = root.getAttribute('id') || toggleUniqueId(root, options, 0, true);
    if (!allInstances[rootId]) {
      allInstances[rootId] = new Core(root, options);
    }
  };
  export const destroy = () => {};

  const initGlobal = () => {
    const allMenuElements = $$(document, '[data-amegmen]');
    // const allGlobalInstances = [];
    // console.log(
    //   '==================================================allGlobalInstances',
    //   allGlobalInstances,
    // );
    allMenuElements.forEach((menuEl) => {
      try {
        const receivedOptions: IReceivedSettings = Object.fromEntries(
          Object.entries({
            idPrefix: (menuEl as HTMLElement).dataset.amegmenIdPrefix,
          }).filter(([, value]) => value !== undefined),
        );
        // menuEl.getAttribute('data-amegmen') || '{}';
        const menuOptions: ISettings = { ...defaults, ...receivedOptions };
        init(menuEl, menuOptions);
      } catch (error) {
        console.error(error);
      }
    });
  };
  // const destroyGlobal = () => {
  //   console.log(
  //     '==================================================removeEventListeners',
  //     removeEventListeners,
  //   );
  // };
  console.log(
    '==================================================removeEventListeners',
    removeEventListeners,
    slideDown,
    slideUp,
  );
  globalEvents.push(eventHandler(document as Document, 'DOMContentLoaded', initGlobal));
}

export default AMegMen;
