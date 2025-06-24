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
    events: IEvent[];
  }

  const globalEvents: IEvent[] = [];
  const allInstances: IInstances = {};

  const $$ = (parent: Element | Document, selector: string) =>
    Array.from(parent.querySelectorAll(selector));
  // const $ = (parent: Element | Document, selector: string) => $$(parent, selector)[0];

  const defaults: ISettings = {
    idPrefix: 'amegmen_id_',
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

  console.log('==================================================toggleUniqueId', toggleUniqueId);
  console.log('==================================================defaults', defaults);

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
    console.log('==================================================root', root);
    console.log('==================================================options', options);
    return {
      events: [],
    };
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
