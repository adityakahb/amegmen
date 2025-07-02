(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
    typeof define === 'function' && define.amd ? define(factory) :
    (global = typeof globalThis !== 'undefined' ? globalThis : global || self, global.AMegMen = factory());
})(this, (function () { 'use strict';

    var AMegMen;
    (function (AMegMen) {
        /* SLIDE UP */
        const slideUp = (target, duration, callback) => {
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
                callback && callback();
            }, duration);
        };
        /* SLIDE DOWN */
        const slideDown = (target, duration, callback) => {
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
                callback && callback();
            }, duration);
        };
        const globalEvents = [];
        const allInstances = {};
        const $$ = (parent, selector) => Array.from(parent.querySelectorAll(selector));
        const $ = (parent, selector) => $$(parent, selector)[0];
        const debounce = (func) => {
            let timer;
            return function (event) {
                if (timer) {
                    clearTimeout(timer);
                }
                timer = setTimeout(func, 100, event);
            };
        };
        const defaults = {
            idPrefix: 'amegmen_id_',
            duration: 250,
        };
        const stringTrim = (str) => {
            return str.replace(/^\s+|\s+$|\s+(?=\s)/g, '');
        };
        const hasClass = (element, cls) => stringTrim(cls)
            .split(' ')
            .some((classStr) => element.classList.contains(classStr));
        const addClass = (element, cls) => {
            cls.split(' ').forEach((classStr) => {
                element.classList.add(classStr);
            });
        };
        const removeClass = (element, cls) => {
            cls.split(' ').forEach((classStr) => {
                element.classList.remove(classStr);
            });
        };
        const toggleClass = (element, cls) => {
            hasClass(element, cls) ? removeClass(element, cls) : addClass(element, cls);
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
        const removeEventListeners = (core, el) => {
            let j = core.eH.length;
            while (j--) {
                if (core.eH[j].el.isEqualNode && core.eH[j].element.isEqualNode(el)) {
                    core.eH[j].remove();
                    core.eH.splice(j, 1);
                }
            }
        };
        const eventHandler = (el, type, listener) => {
            const eventHandlerObj = {
                el,
                remove: () => {
                    el.removeEventListener(type, listener, false);
                },
            };
            el.addEventListener(type, listener, false);
            return eventHandlerObj;
        };
        const closeAllSubnavs = (core, presentAnchor) => {
            core.l0.l0li.forEach((l0liEl_2) => {
                const subnavContainer = l0liEl_2.subnav?.container;
                if (subnavContainer && !(presentAnchor && l0liEl_2.anchor === presentAnchor)) {
                    removeClass(subnavContainer, 'amegmen-subnav-active');
                    slideUp(subnavContainer, core.opts.duration, () => {
                        removeClass(l0liEl_2.anchor, 'amegmen-nav-item-active');
                    });
                }
            });
        };
        const performArrowRight = (core, current) => {
            if (current.next) {
                current.next.anchor.focus();
            }
        };
        const performArrowLeft = (core, current) => {
            if (current.prev) {
                current.prev.anchor.focus();
            }
        };
        const addBasicEvents = (core) => {
            core.events.push(eventHandler(core._close, 'click', () => {
                removeClass(core.root, 'amegmen-root-active');
            }));
            core.events.push(eventHandler(core._open, 'click', () => {
                addClass(core.root, 'amegmen-root-active');
            }));
            core.l0.l0li.forEach((l0liEl) => {
                if (l0liEl.subnav?.container) {
                    const subnavContainer = l0liEl.subnav?.container;
                    core.events.push(eventHandler(l0liEl.anchor, 'click', (event) => {
                        event.preventDefault();
                        toggleClass(subnavContainer, 'amegmen-subnav-active');
                        closeAllSubnavs(core, l0liEl.anchor);
                        if (hasClass(subnavContainer, 'amegmen-subnav-active')) {
                            addClass(l0liEl.anchor, 'amegmen-nav-item-active');
                            slideDown(subnavContainer, core.opts.duration, () => {
                                addClass(core.root, 'amegmen-root-active');
                            });
                        }
                        else {
                            slideUp(subnavContainer, core.opts.duration, () => {
                                removeClass(core.root, 'amegmen-root-active');
                                removeClass(l0liEl.anchor, 'amegmen-nav-item-active');
                            });
                        }
                    }));
                }
                core.events.push(eventHandler(l0liEl.anchor, 'keyup', (event) => {
                    switch (event.key) {
                        case 'ArrowRight':
                            performArrowRight(core, l0liEl);
                            break;
                        case 'ArrowLeft':
                            performArrowLeft(core, l0liEl);
                            break;
                    }
                }));
            });
            core.events.push(eventHandler(window, 'resize', debounce(() => {
                closeAllSubnavs(core);
            })));
            core.events.push(eventHandler(document, 'click', (event) => {
                if (hasClass(core.root, 'amegmen-root-active') && // Only close if it's currently open
                    !core.root.contains(event.target)) {
                    closeAllSubnavs(core);
                }
            }));
        };
        const constructDOM = (root, opts) => {
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
            const li0Arr = [];
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
        const initCoreFn = (root, opts) => {
            const core = constructDOM(root, opts);
            addBasicEvents(core);
            return core;
        };
        class Core {
            constructor(root, options) {
                initCoreFn(root, options);
            }
        }
        AMegMen.init = (root, options) => {
            const rootId = root.getAttribute('id') || toggleUniqueId(root, options, 0, true);
            if (!allInstances[rootId]) {
                allInstances[rootId] = new Core(root, options);
            }
        };
        AMegMen.destroy = () => { };
        const initGlobal = () => {
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
        // const destroyGlobal = () => {
        //   console.log(
        //     '==================================================removeEventListeners',
        //     removeEventListeners,
        //   );
        // };
        console.log('==================================================removeEventListeners', removeEventListeners, slideDown, slideUp);
        globalEvents.push(eventHandler(document, 'DOMContentLoaded', initGlobal));
    })(AMegMen || (AMegMen = {}));
    var AMegMen$1 = AMegMen;

    return AMegMen$1;

}));
