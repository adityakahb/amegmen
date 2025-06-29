'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var AMegMen;
(function (AMegMen) {
    const globalEvents = [];
    const allInstances = {};
    const $$ = (parent, selector) => Array.from(parent.querySelectorAll(selector));
    const $ = (parent, selector) => $$(parent, selector)[0];
    const defaults = {
        idPrefix: 'amegmen_id_',
    };
    const toggleUniqueId = (element, settings, unique_number, shouldAddId) => {
        let instanceId = '';
        if (shouldAddId && !element.getAttribute('id')) {
            instanceId = `${settings.idPrefix}_${new Date().getTime()}_${unique_number}`;
            element.setAttribute('id', instanceId);
        }
        else if (!shouldAddId && element.getAttribute('id')) {
            const thisid = element.getAttribute('id') || '';
            const regex = new RegExp(settings.idPrefix, 'gi');
            instanceId = thisid;
            if (regex.test(thisid || '')) {
                element.removeAttribute('id');
            }
        }
        return instanceId;
    };
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
    const initCoreFn = (root, options) => {
        const core = {
            cToggle: $(root, '.amegmen-nav-cta-close'),
            events: [],
            options,
            oToggle: $(root, '.amegmen-nav-cta-open'),
            root,
        };
        core.events.push(eventHandler(core.cToggle, 'click', () => {
            console.log('================================================== toggle mobile close');
        }));
        core.events.push(eventHandler(core.oToggle, 'click', () => {
            console.log('================================================== toggle mobile open');
        }));
        return core;
    };
    class Core {
        root;
        options;
        constructor(root, options) {
            this.root = root;
            this.options = options;
            initCoreFn(this.root, this.options);
        }
    }
    AMegMen.init = (root, options) => {
        const rootId = root.getAttribute('id') || toggleUniqueId(root, options, 0, true);
        if (!allInstances[rootId]) {
            allInstances[rootId] = new Core(root, options);
        }
    };
    // export const destroy = () => new Root();
    AMegMen.initGlobal = () => {
        const allMenuElements = $$(document, '[data-amegmen]');
        // const allGlobalInstances = [];
        // console.log(
        //   '==================================================allGlobalInstances',
        //   allGlobalInstances,
        // );
        allMenuElements.forEach((menuEl) => {
            try {
                const receivedOptions = Object.fromEntries(Object.entries({
                    idPrefix: menuEl.dataset.amegmenIdPrefix,
                }).filter(([, value]) => value !== undefined));
                // menuEl.getAttribute('data-amegmen') || '{}';
                const menuOptions = { ...defaults, ...receivedOptions };
                AMegMen.init(menuEl, menuOptions);
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
