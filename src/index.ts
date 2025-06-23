interface IAMegMenSettings {
  idPrefix?: string;
}
interface IEventHandler {
  element: Element | Document | Window;
  remove: () => void;
}

interface ICore {
  id: string;
  events: [];
}

namespace AMegMen {
  const globalEvents: IEventHandler[] = [];
  const allInstances: ICore[] = [];

  const $$ = (parent: Element | Document, selector: string) =>
    Array.from(parent.querySelectorAll(selector));
  // const $ = (parent: Element | Document, selector: string) => $$(parent, selector)[0];

  const defaults: IAMegMenSettings = {
    idPrefix: 'amegmen_id_',
  };

  const toggleUniqueId = (
    element: HTMLElement,
    settings: IAMegMenSettings,
    unique_number: number,
    shouldAddId: boolean,
  ) => {
    if (settings.idPrefix) {
      if (shouldAddId && !element.getAttribute('id')) {
        element.setAttribute('id', `${settings.idPrefix}_${new Date().getTime()}_${unique_number}`);
      } else if (!shouldAddId && element.getAttribute('id')) {
        const thisid = element.getAttribute('id');
        const regex = new RegExp(settings.idPrefix, 'gi');
        if (regex.test(thisid || '')) {
          element.removeAttribute('id');
        }
      }
    }
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
    const eventHandlerObj: IEventHandler = {
      element,
      remove: () => {
        element.removeEventListener(type, listener, false);
      },
    };
    element.addEventListener(type, listener, false);
    return eventHandlerObj;
  };

  class Root {}
  export const init = () => new Root();
  export const destroy = () => new Root();

  export const initGlobal = () => {
    const allMenuElements = $$(document, '[data-amegmen]');
    // const allGlobalInstances = [];
    // console.log(
    //   '==================================================allGlobalInstances',
    //   allGlobalInstances,
    // );
    allMenuElements.forEach((menuEl) => {
      try {
        const receivedOptions = menuEl.getAttribute('data-amegmen') || '{}';
        const menuOptions: IAMegMenSettings = { ...defaults, ...JSON.parse(receivedOptions) };
        console.log('==================================================menuOptions', menuOptions);
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
