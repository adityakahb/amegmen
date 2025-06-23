'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var AMegMen;
(function (AMegMen) {
    const globalEvents = [];
    const $$ = (parent, selector) => Array.from(parent.querySelectorAll(selector));
    // const $ = (parent: Element | Document, selector: string) => $$(parent, selector)[0];
    const defaults = {
        idPrefix: 'amegmen_id_',
    };
    const toggleUniqueId = (element, settings, unique_number, shouldAddId) => {
        if (settings.idPrefix) {
            if (shouldAddId && !element.getAttribute('id')) {
                element.setAttribute('id', `${settings.idPrefix}_${new Date().getTime()}_${unique_number}`);
            }
            else if (!shouldAddId && element.getAttribute('id')) {
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
    const removeEventListeners = (core, element) => {
        let j = core.eH.length;
        while (j--) {
            if (core.eH[j].element.isEqualNode && core.eH[j].element.isEqualNode(element)) {
                core.eH[j].remove();
                core.eH.splice(j, 1);
            }
        }
    };
    const eventHandler = (element, type, listener) => {
        const eventHandlerObj = {
            element,
            remove: () => {
                element.removeEventListener(type, listener, false);
            },
        };
        element.addEventListener(type, listener, false);
        return eventHandlerObj;
    };
    class Root {
    }
    AMegMen.init = () => new Root();
    AMegMen.destroy = () => new Root();
    AMegMen.initGlobal = () => {
        const allMenuElements = $$(document, '[data-amegmen]');
        // const allGlobalInstances = [];
        // console.log(
        //   '==================================================allGlobalInstances',
        //   allGlobalInstances,
        // );
        allMenuElements.forEach((menuEl) => {
            try {
                const receivedOptions = menuEl.getAttribute('data-amegmen') || '{}';
                const menuOptions = { ...defaults, ...JSON.parse(receivedOptions) };
                console.log('==================================================menuOptions', menuOptions);
            }
            catch (error) {
                console.error(error);
            }
        });
    };
    AMegMen.destroyGlobal = () => {
        console.log('==================================================removeEventListeners', removeEventListeners);
    };
    globalEvents.push(eventHandler(document, 'DOMContentLoaded', AMegMen.initGlobal));
})(AMegMen || (AMegMen = {}));
var AMegMen$1 = AMegMen;

exports["default"] = AMegMen$1;
