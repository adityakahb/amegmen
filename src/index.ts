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
  interface ICore {
    _close: Element;
    _open: Element;
    events: IEvent[];
    opts: ISettings;
    root: Element;
  }

  /* SLIDE UP */
  const slideUp = (target: HTMLElement, duration = 500) => {
    target.style.transitionProperty = 'height, margin, padding';
    target.style.transitionDuration = `${duration}ms`;
    target.style.boxSizing = 'border-box';
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
  const slideDown = (target: HTMLElement, duration = 500) => {
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
    target.style.boxSizing = 'border-box';
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

  const defaults: ISettings = {
    idPrefix: 'amegmen_id_',
  };

  const stringTrim = (str: string) => {
    return str.replace(/^\s+|\s+$|\s+(?=\s)/g, '');
  };

  const hasClass = (element: Element, cls: string) =>
    !!stringTrim(cls)
      .split(' ')
      .find((classStr) => element.classList.contains(classStr));

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

  const initCoreFn = (root: Element, opts: ISettings): ICore => {
    const core: ICore = {
      _close: $(root, '.amegmen-nav-cta-close'),
      _open: $(root, '.amegmen-nav-cta-open'),
      events: [],
      opts,
      root,
    };

    console.log(
      '==================================================hasClass, addClass, removeClass',
      hasClass,
    );

    core.events.push(
      eventHandler(core._close, 'click', () => {
        removeClass(root, 'amegmen-root-active');
      }),
    );

    core.events.push(
      eventHandler(core._open, 'click', () => {
        addClass(root, 'amegmen-root-active');
      }),
    );

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
