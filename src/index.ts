namespace AMegMen {
  interface ISettings {
    idPrefix: string;
  }
  interface IReceivedSettings {
    idPrefix?: string;
  }
  interface IEvent {
    element: Element | Document | Window;
    remove: () => void;
  }
  interface IInstances {
    [key: string]: Core;
  }
  interface ICore {
    cToggle: Element;
    events: IEvent[];
    options: ISettings;
    oToggle: Element;
    root: Element;
  }

  let commonLoopCount = 0;
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

  const removeEventListeners = (core: any, element: Element | Document | Window) => {
    let j = core.eH.length;
    while (j--) {
      if (core.eH[j].element.isEqualNode && core.eH[j].element.isEqualNode(element)) {
        core.eH[j].remove();
        core.eH.splice(j, 1);
      }
    }
  };

  const eventHandler = (
    element: Element | Document | Window,
    type: string,
    listener: EventListenerOrEventListenerObject,
  ) => {
    const eventHandlerObj: IEvent = {
      element,
      remove: () => {
        element.removeEventListener(type, listener, false);
      },
    };
    element.addEventListener(type, listener, false);
    return eventHandlerObj;
  };

  const initCoreFn = (root: Element, options: ISettings): ICore => {
    const core: ICore = {
      cToggle: $(root, '.amegmen-nav-cta-close'),
      events: [],
      options,
      oToggle: $(root, '.amegmen-nav-cta-open'),
      root,
    };

    core.events.push(
      eventHandler(core.cToggle, 'click', () => {
        console.log('================================================== toggle mobile close');
      }),
    );

    core.events.push(
      eventHandler(core.oToggle, 'click', () => {
        console.log('================================================== toggle mobile open');
      }),
    );

    return core;
  };
  class Core {
    private root: Element;
    private options: ISettings;

    constructor(root: Element, options: ISettings) {
      this.root = root;
      this.options = options;

      initCoreFn(this.root, this.options);
    }
  }

  export const init = (root: Element, options: ISettings) => {
    const rootId = root.getAttribute('id') || toggleUniqueId(root, options, 0, true);
    if (!allInstances[rootId]) {
      allInstances[rootId] = new Core(root, options);
    }
  };
  // export const destroy = () => new Root();

  export const initGlobal = () => {
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
  export const destroyGlobal = () => {
    console.log(
      '==================================================removeEventListeners',
      removeEventListeners,
    );
  };
  globalEvents.push(eventHandler(document as Document, 'DOMContentLoaded', initGlobal));
}

export default AMegMen;
