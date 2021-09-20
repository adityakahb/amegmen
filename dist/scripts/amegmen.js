/**
 *  █████  ███    ███ ███████  ██████  ███    ███ ███████ ███    ██
 * ██   ██ ████  ████ ██      ██       ████  ████ ██      ████   ██
 * ███████ ██ ████ ██ █████   ██   ███ ██ ████ ██ █████   ██ ██  ██
 * ██   ██ ██  ██  ██ ██      ██    ██ ██  ██  ██ ██      ██  ██ ██
 * ██   ██ ██      ██ ███████  ██████  ██      ██ ███████ ██   ████
 *
 * AMegMen Namespace contains the Root class, Core class and related constants.
 *
 */
var AMegMen;
(function (AMegMen) {
    "use strict";
    var AllAMegMenInstances = {};
    var active_amegmen = {};
    var _useCapture = false;
    var _Defaults = {
        activeCls: '__amegmen-active',
        actOnHover: false,
        actOnHoverAt: 1280,
        backBtnCls: '__amegmen--back-cta',
        closeBtnCls: '__amegmen--close-cta',
        colCls: '__amegmen--col',
        colShiftCls: '__amegmen-shift',
        colWidthCls: '__amegmen-width',
        focusCls: '__amegmen-focus',
        hoverCls: '__amegmen-hover',
        idPrefix: '__amegmen_id',
        isRTL: false,
        l0AnchorCls: '__amegmen--anchor-l0',
        l0PanelCls: '__amegmen--panel-l0',
        l1ActiveCls: '__amegmen--l1-active',
        l1AnchorCls: '__amegmen--anchor-l1',
        l1PanelCls: '__amegmen--panel-l1',
        l2ActiveCls: '__amegmen--l2-active',
        l2AnchorCls: '__amegmen--anchor-l2',
        landingCtaCls: '__amegmen--landing',
        lastcolCls: '__amegmen--col-last',
        mainBtnCls: '__amegmen--main-cta',
        mainElementCls: '__amegmen--main',
        offcanvasCls: '__amegmen--canvas',
        overflowHiddenCls: '__amegmen--nooverflow',
        panelCls: '__amegmen--panel',
        rootCls: '__amegmen',
        rtl_Cls: '__amegmen--r-to-l',
        shiftColumns: false,
        supportedCols: 4,
        toggleBtnCls: '__amegmen--toggle-cta'
    };
    /**
     * Polyfill function for Object.assign
     *
     */
    var _EnableAssign = function () {
        if (typeof Object.assign !== 'function') {
            Object.defineProperty(Object, 'assign', {
                value: function assign(target) {
                    // function assign(target: any, varArgs: any)
                    'use strict';
                    if (target === null || target === undefined) {
                        throw new TypeError('Cannot convert undefined or null to object');
                    }
                    var to = Object(target);
                    for (var index = 1; index < arguments.length; index++) {
                        var nextSource = arguments[index];
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
                configurable: true
            });
        }
    };
    /**
     * Polyfill function for `:scope` for `QuerySelector` and `QuerySelectorAll`
     *
     */
    var _EnableQSQSAScope = function () {
        try {
            window.document.querySelector(':scope body');
        }
        catch (err) {
            var qsarr_1 = ['querySelector', 'querySelectorAll'];
            var _loop_1 = function (i) {
                var nativ = Element.prototype[qsarr_1[i]];
                Element.prototype[qsarr_1[i]] = function (selectors) {
                    if (/(^|,)\s*:scope/.test(selectors)) {
                        var id = this.id;
                        this.id = 'ID_' + Date.now();
                        selectors = selectors.replace(/((^|,)\s*):scope/g, '$1#' + this.id);
                        var result = window.document[qsarr_1[i]](selectors);
                        this.id = id;
                        return result;
                    }
                    else {
                        return nativ.call(this, selectors);
                    }
                };
            };
            for (var i = 0; i < qsarr_1.length; i++) {
                _loop_1(i);
            }
        }
    };
    /**
     * Polyfill function for `Element.closest`
     *
     */
    var _EnableClosest = function () {
        if (!Element.prototype.matches) {
            Element.prototype.matches =
                Element.prototype.msMatchesSelector ||
                    Element.prototype.webkitMatchesSelector;
        }
        if (!Element.prototype.closest) {
            Element.prototype.closest = function (s) {
                var el = this;
                do {
                    if (Element.prototype.matches.call(el, s))
                        return el;
                    var parent_1 = el.parentElement || el.parentNode;
                    if (parent_1) {
                        el = parent_1;
                    }
                } while (el !== null && el.nodeType === 1);
                return null;
            };
        }
    };
    /**
     * Function to trim whitespaces from a string
     *
     * @param str - The string which needs to be trimmed
     *
     * @returns The trimmed string.
     *
     */
    var _StringTrim = function (str) {
        return str.replace(/^\s+|\s+$/g, '');
    };
    /**
     * Function to convert NodeList and other lists to loopable Arrays
     *
     * @param arr - Either Nodelist of any type of array
     *
     * @returns A loopable Array.
     *
     */
    var _ArrayCall = function (arr) {
        try {
            return Array.prototype.slice.call(arr);
        }
        catch (e) {
            return [];
        }
    };
    /**
     * Function to check wheather an element has a string in its class attribute
     *
     * @param element - An HTML Element
     * @param cls - A string
     *
     * @returns `true` if the string exists in class attribute, otherwise `false`
     *
     */
    var _HasClass = function (element, cls) {
        if (element) {
            var clsarr = element.className.split(' ');
            return clsarr.indexOf(cls) > -1 ? true : false;
        }
        return false;
    };
    /**
     * Function to add a string to an element's class attribute
     *
     * @param element - An HTML Element
     * @param cls - A string
     *
     */
    var _AddClass = function (element, cls) {
        if (element) {
            var clsarr = cls.split(' ');
            var clsarrLength = clsarr.length;
            for (var i = 0; i < clsarrLength; i++) {
                var thiscls = clsarr[i];
                if (!_HasClass(element, thiscls)) {
                    element.className += ' ' + thiscls;
                }
            }
            element.className = _StringTrim(element.className);
        }
    };
    /**
     * Function to remove a string from an element's class attribute
     *
     * @param element - An HTML Element
     * @param cls - A string
     *
     */
    var _RemoveClass = function (element, cls) {
        if (element) {
            var clsarr = cls.split(' ');
            var curclass = element.className.split(' ');
            var curclassLength = curclass.length;
            for (var i = 0; i < curclassLength; i++) {
                var thiscls = curclass[i];
                if (clsarr.indexOf(thiscls) > -1) {
                    curclass.splice(i, 1);
                    i--;
                }
            }
            element.className = _StringTrim(curclass.join(' '));
        }
    };
    /**
     * Function to add a unique id attribute if it is not present already.
     * This is required to monitor the outside click and hover behavior
     *
     * @param element - An HTML Element
     * @param settings - Options specific to individual AMegMen instance
     * @param unique_number - A unique number as additional identification
     * @param shouldAdd - If `true`, adds an id. Otherwise it is removed.
     *
     */
    var _ToggleUniqueId = function (element, settings, unique_number, shouldAddId) {
        if (settings.idPrefix) {
            if (shouldAddId && !element.getAttribute('id')) {
                element.setAttribute('id', settings.idPrefix + '_' + new Date().getTime() + '_' + unique_number);
            }
            else if (!shouldAddId && element.getAttribute('id')) {
                var thisid = element.getAttribute('id');
                var regex = new RegExp(settings.idPrefix, 'gi');
                if (regex.test(thisid || '')) {
                    element.removeAttribute('id');
                }
            }
        }
    };
    /**
     * Function to remove all local events assigned to the navigation elements.
     *
     * @param core - AMegMen instance core object
     * @param element - An HTML Element from which the events need to be removed
     *
     */
    var amm_removeEventListeners = function (core, element) {
        if ((core.eventHandlers || []).length > 0) {
            var j = core.eventHandlers.length;
            while (j--) {
                if (core.eventHandlers[j].currentElement.isEqualNode && core.eventHandlers[j].currentElement.isEqualNode(element)) {
                    core.eventHandlers[j].removeEvent();
                    core.eventHandlers.splice(j, 1);
                }
            }
        }
    };
    /**
     * Function to remove all local events assigned to the navigation elements.
     *
     * @param element - An HTML Element which needs to be assigned an event
     * @param type - Event type
     * @param listener - The Event handler function
     *
     * @returns The event handler object
     *
     */
    var amm_eventHandler = function (element, type, listener) {
        var eventHandler = {
            currentElement: element,
            removeEvent: function () {
                element.removeEventListener(type, listener, _useCapture);
            }
        };
        element.addEventListener(type, listener, _useCapture);
        return eventHandler;
    };
    /**
     * Function to close the Level 1 and Level 2 Megamenues if click or hover happens on document or window
     *
     * @param event - `click` or `mouseover` event to close the megamenu
     * @param overflowHiddenCls - Class which disables scrollbars on mobile
     * @param activeCls - Class which activates the megamenu links and panels
     * @param eventtype - Is `click` or `mouseover`
     *
     */
    var amm_document_out = function (event, overflowHiddenCls, activeCls, l1ActiveCls, l2ActiveCls, eventtype) {
        if (event && _StringTrim(active_amegmen.closestl0li || '').length > 0) {
            var closest = event.target.closest('#' + active_amegmen.closestl0li);
            if (!closest) {
                amm_subnavclose(true, overflowHiddenCls, activeCls, l1ActiveCls, l2ActiveCls, eventtype);
            }
        }
    };
    /**
     * Function to close the Level 2 Megamenu if click or hover happens on Level 1 Megamenu Panel
     *
     * @param event - `click` or `mouseover` event to close the megamenu
     * @param overflowHiddenCls - Class which disables scrollbars on mobile
     * @param activeCls - Class which activates the megamenu links and panels
     * @param eventtype - Is `click` or `mouseover`
     *
     */
    var amm_subnav_out = function (event, overflowHiddenCls, activeCls, l1ActiveCls, l2ActiveCls, eventtype) {
        if (event && _StringTrim(active_amegmen.closestl1li || '').length > 0) {
            var closest = event.target.closest('#' + active_amegmen.closestl1li);
            if (!closest) {
                amm_subnavclose(false, overflowHiddenCls, activeCls, l1ActiveCls, l2ActiveCls, eventtype);
            }
        }
    };
    /**
     * Function to close the Megamenu Panel
     *
     * @param shouldCloseL0Panel - If `true`, loses Level 0 and Level 1 Panels. Otherwise closes Level 1 panels only
     * @param overflowHiddenCls - Class which disables scrollbars on mobile
     * @param activeCls - Class which activates the megamenu links and panels
     * @param eventtype - Is `click` or `mouseover`
     *
     */
    var amm_subnavclose = function (shouldCloseL0Panel, overflowHiddenCls, activeCls, l1ActiveCls, l2ActiveCls, eventtype) {
        for (var i in AllAMegMenInstances) {
            var thiscore = AllAMegMenInstances[i];
            var rootElem = thiscore.rootElem;
            var offcanvas = thiscore.offcanvas;
            var shouldExecute = false;
            if (eventtype === 'mouseover' && (thiscore.settings || {}).actOnHover === true) {
                shouldExecute = true;
            }
            if (eventtype === 'click') {
                shouldExecute = true;
            }
            if (shouldExecute && _HasClass(rootElem, activeCls)) {
                var mainElem = thiscore.mainElem;
                var l0nav = thiscore.l0nav || [];
                if (shouldCloseL0Panel) {
                    _RemoveClass(offcanvas, l1ActiveCls);
                    _RemoveClass(rootElem, activeCls);
                    _RemoveClass(mainElem, overflowHiddenCls);
                }
                _RemoveClass(offcanvas, l2ActiveCls);
                for (var j = l0nav.length - 1; j >= 0; j--) {
                    var thisl0 = l0nav[j] || {};
                    if (shouldCloseL0Panel) {
                        if (thisl0.l0anchor) {
                            _RemoveClass(thisl0.l0anchor, activeCls);
                            thisl0.l0anchor.setAttribute('aria-expanded', 'false');
                        }
                        if (thisl0.l0panel) {
                            _RemoveClass(thisl0.l0panel, activeCls);
                            thisl0.l0panel.setAttribute('aria-expanded', 'false');
                            thisl0.l0panel.setAttribute('aria-hidden', 'true');
                        }
                    }
                    if (thisl0.navelement) {
                        _RemoveClass(thisl0.navelement, overflowHiddenCls);
                    }
                    var l1nav = thisl0.l1nav || [];
                    if (l1nav.length > 0) {
                        for (var k = l1nav.length - 1; k >= 0; k--) {
                            var thisl1 = l1nav[k] || {};
                            if (thisl1.l1anchor) {
                                _RemoveClass(thisl1.l1anchor, activeCls);
                                thisl1.l1anchor.setAttribute('aria-expanded', 'false');
                            }
                            if (thisl1.l1panel) {
                                _RemoveClass(thisl1.l1panel, activeCls);
                                thisl1.l1panel.setAttribute('aria-expanded', 'false');
                                thisl1.l1panel.setAttribute('aria-hidden', 'true');
                            }
                        }
                    }
                }
            }
        }
    };
    /**
     * Mouseenter event for Landing link on the panels
     *
     * @param landingElement - An HTML Element
     * @param hoverCls - CSS Class for hovered element
     *
     */
    var amm_landingMouseenterFn = function (landingElement, hoverCls) {
        _AddClass(landingElement, hoverCls);
    };
    /**
     * Mouseleave event for Landing link on the panels
     *
     * @param landingElement - An HTML Element
     * @param hoverCls - CSS Class for hovered element
     *
     */
    var amm_landingMouseleaveFn = function (landingElement, hoverCls) {
        _RemoveClass(landingElement, hoverCls);
    };
    /**
     * Focus event for Landing link on the panels
     *
     * @param landingElement - An HTML Element
     * @param focusCls - CSS Class for focussed element
     *
     */
    var amm_landingFocusFn = function (landingElement, focusCls) {
        _AddClass(landingElement, focusCls);
    };
    /**
     * Blur event for Landing link on the panels
     *
     * @param landingElement - An HTML Element
     * @param focusCls - CSS Class for focussed element
     *
     */
    var amm_landingBlurFn = function (landingElement, focusCls) {
        _RemoveClass(landingElement, focusCls);
    };
    /**
     * Focus event for Level 0 link
     *
     * @param l0anchor - An HTML Anchor element at Level 0 Navigation
     * @param focusCls - CSS Class for focussed element
     *
     */
    var amm_l0FocusFn = function (l0anchor, focusCls) {
        _AddClass(l0anchor, focusCls);
    };
    /**
     * Blur event for Level 0 link
     *
     * @param l0anchor - An HTML Anchor element at Level 0 Navigation
     * @param focusCls - CSS Class for focussed element
     *
     */
    var amm_l0BlurFn = function (l0anchor, focusCls) {
        _RemoveClass(l0anchor, focusCls);
    };
    /**
     * Focus event for Level 1 link
     *
     * @param l1anchor - An HTML Anchor element at Level 1 Navigation
     * @param focusCls - CSS Class for focussed element
     *
     */
    var amm_l1FocusFn = function (l1anchor, focusCls) {
        _AddClass(l1anchor, focusCls);
    };
    /**
     * Blur event for Level 1 link
     *
     * @param l1anchor - An HTML Anchor element at Level 1 Navigation
     * @param focusCls - CSS Class for focussed element
     *
     */
    var amm_l1BlurFn = function (l1anchor, focusCls) {
        _RemoveClass(l1anchor, focusCls);
    };
    /**
     * Mouseenter event for Level 2 link
     *
     * @param l2anchor - An HTML Anchor element at Level 2 Navigation
     * @param hoverCls - CSS Class for hovered element
     *
     */
    var amm_l2MouseenterFn = function (l2anchor, hoverCls) {
        _AddClass(l2anchor, hoverCls);
    };
    /**
     * Mouseleave event for Level 2 link
     *
     * @param l2anchor - An HTML Anchor element at Level 2 Navigation
     * @param hoverCls - CSS Class for hovered element
     *
     */
    var amm_l2MouseleaveFn = function (l2anchor, hoverCls) {
        _RemoveClass(l2anchor, hoverCls);
    };
    /**
     * Focus event for Level 2 link
     *
     * @param l2anchor - An HTML Anchor element at Level 2 Navigation
     * @param focusCls - CSS Class for focussed element
     *
     */
    var amm_l2FocusFn = function (l2anchor, focusCls) {
        _AddClass(l2anchor, focusCls);
    };
    /**
     * Blur event for Level 2 link
     *
     * @param l2anchor - An HTML Anchor element at Level 2 Navigation
     * @param focusCls - CSS Class for focussed element
     *
     */
    var amm_l2BlurFn = function (l2anchor, focusCls) {
        _RemoveClass(l2anchor, focusCls);
    };
    /**
     * Click event for Level 0 link
     *
     * @param event - `click` event to prevent the default action when subnav panel is present
     * @param l0anchor - An HTML Anchor element at Level 0 Navigation
     * @param l0panel - Adjecent Panel to the l0anchor
     * @param parent - Parent LI element
     * @param mainElem - Main Wrapper which contains the navigation elements
     * @param overflowHiddenCls - Class which disables scrollbars on mobile
     * @param activeCls - Class for active elements
     * @param eventtype - 'Click' or 'Mouseenter' for hoverable megamenues
     *
     */
    var amm_l0ClickFn = function (event, l0anchor, l0panel, parent, mainElem, offcanvas, overflowHiddenCls, activeCls, l1ActiveCls, l2ActiveCls, eventtype) {
        if (event && l0panel) {
            event.preventDefault();
        }
        if (_HasClass(l0anchor, activeCls)) {
            active_amegmen.elem = null;
            active_amegmen.closestl0li = '';
            amm_subnavclose(true, overflowHiddenCls, activeCls, l1ActiveCls, l2ActiveCls, eventtype);
        }
        else {
            amm_subnavclose(true, overflowHiddenCls, activeCls, l1ActiveCls, l2ActiveCls, eventtype);
            active_amegmen.elem = parent;
            active_amegmen.closestl0li = l0anchor.closest('li').getAttribute('id');
            l0anchor.setAttribute('aria-expanded', 'true');
            l0panel.setAttribute('aria-expanded', 'true');
            l0panel.setAttribute('aria-hidden', 'false');
            _AddClass(parent, activeCls);
            _AddClass(offcanvas, l1ActiveCls);
            _AddClass(l0anchor, activeCls);
            _AddClass(l0panel, activeCls);
            _AddClass(mainElem, overflowHiddenCls);
        }
    };
    /**
     * Mouseenter event for Level 0 link
     *
     * @param l0anchor - An HTML Anchor element at Level 0 Navigation
     * @param hoverCls - Class for hovered elements
     * @param actOnHover - If `true`, megamenu activates on hover
     * @param actOnHoverAt - The minimum breakpoint at or after which the hover will work
     *
     */
    var amm_l0MouseenterFn = function (l0anchor, hoverCls, actOnHover, actOnHoverAt) {
        _AddClass(l0anchor, hoverCls);
        if (actOnHover) {
            var windowwidth = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;
            if (windowwidth >= actOnHoverAt) {
                l0anchor.click();
            }
        }
    };
    /**
     * Mouseleave event for Level 0 link
     *
     * @param l0anchor - An HTML Anchor element at Level 0 Navigation
     * @param hoverCls - Class for hovered elements
     *
     */
    var amm_l0MouseleaveFn = function (l0anchor, hoverCls) {
        _RemoveClass(l0anchor, hoverCls);
    };
    /**
     * Click event for Level 1 link
     *
     * @param event - `click` event to prevent the default action when subnav panel is present
     * @param l1anchor - An HTML Anchor element at Level 1 Navigation
     * @param l1panel - Adjecent Panel to the l1anchor
     * @param l0navelement - Parent `nav` element of l1anchor
     * @param overflowHiddenCls - Class which disables scrollbars on mobile
     * @param activeCls - Class for active elements
     * @param eventtype - 'Click' or 'Mouseenter' for hoverable megamenues
     *
     */
    var amm_l1ClickFn = function (event, l1anchor, l1panel, offcanvas, l0navelement, overflowHiddenCls, activeCls, l1ActiveCls, l2ActiveCls, eventtype) {
        if (event && l1panel) {
            event.preventDefault();
        }
        if (_HasClass(l1anchor, activeCls)) {
            active_amegmen.closestl1li = '';
            amm_subnavclose(false, overflowHiddenCls, activeCls, l1ActiveCls, l2ActiveCls, eventtype);
        }
        else {
            active_amegmen.closestl1li = l1anchor.closest('li').getAttribute('id');
            amm_subnavclose(false, overflowHiddenCls, activeCls, l1ActiveCls, l2ActiveCls, eventtype);
            l1anchor.setAttribute('aria-expanded', 'true');
            l1panel.setAttribute('aria-expanded', 'true');
            l1panel.setAttribute('aria-hidden', 'false');
            _AddClass(offcanvas, l2ActiveCls);
            _AddClass(l1anchor, activeCls);
            _AddClass(l1panel, activeCls);
            _AddClass(l0navelement, overflowHiddenCls);
        }
    };
    /**
     * Mouseenter event for Level 1 link
     *
     * @param l1anchor - An HTML Anchor element at Level 1 Navigation
     * @param hoverCls - Class for hovered elements
     * @param actOnHover - If `true`, megamenu activates on hover
     * @param actOnHoverAt - The minimum breakpoint at or after which the hover will work
     *
     */
    var amm_l1MouseenterFn = function (l1anchor, hoverCls, actOnHover, actOnHoverAt) {
        _AddClass(l1anchor, hoverCls);
        if (actOnHover) {
            var windowwidth = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;
            if (windowwidth >= actOnHoverAt) {
                l1anchor.click();
            }
        }
    };
    /**
     * Mouseleave event for Level 1 link
     *
     * @param l1anchor - An HTML Anchor element at Level 1 Navigation
     * @param hoverCls - Class for hovered elements
     *
     */
    var amm_l1MouseleaveFn = function (l1anchor, hoverCls) {
        _RemoveClass(l1anchor, hoverCls);
    };
    /**
     * Function to navigate the megamenu to Level 0 from Level 1 and Level 1
     *
     * @param event - `click` event to prevent the default action
     * @param shouldCloseL0Panel - If `true`, loses Level 0 and Level 1 Panels. Otherwise closes Level 1 panels only
     * @param overflowHiddenCls - Class which disables scrollbars on mobile
     * @param activeCls - Class which activates the megamenu links and panels
     * @param eventtype - Is `click` or `mouseover`
     *
     */
    var amm_gotoMain = function (event, shouldCloseL0Panel, overflowHiddenCls, activeCls, l1ActiveCls, l2ActiveCls, eventtype) {
        if (event) {
            event.preventDefault();
        }
        amm_subnavclose(shouldCloseL0Panel, overflowHiddenCls, activeCls, l1ActiveCls, l2ActiveCls, eventtype);
    };
    /**
     * Click event for closing megamenu on mobile
     *
     * @param event - `click` event to prevent the default action
     * @param togglenav - Button element to close Offcanvas on mobile
     * @param offcanvas - Offcanvas element containing megamenu
     * @param activeCls - Class which activates the megamenu links and panels
     *
     */
    var amm_closeMain = function (event, togglenav, offcanvas, shouldCloseL0Panel, overflowHiddenCls, activeCls, l1ActiveCls, l2ActiveCls, eventtype) {
        if (event) {
            event.preventDefault();
        }
        amm_subnavclose(shouldCloseL0Panel, overflowHiddenCls, activeCls, l1ActiveCls, l2ActiveCls, eventtype);
        _RemoveClass(togglenav, activeCls);
        _RemoveClass(offcanvas, activeCls);
    };
    /**
     * Click event for opening/closing megamenu on mobile
     *
     * @param event - `click` event to prevent the default action
     * @param togglenav - Button element to close Offcanvas on mobile
     * @param offcanvas - Offcanvas element containing megamenu
     * @param activeCls - Class which activates the megamenu links and panels
     *
     */
    var amm_toggleMain = function (event, togglenav, offcanvas, shouldCloseL0Panel, overflowHiddenCls, activeCls, l1ActiveCls, l2ActiveCls, eventtype) {
        if (event) {
            event.preventDefault();
        }
        if (_HasClass(togglenav, activeCls)) {
            amm_closeMain(event, togglenav, offcanvas, shouldCloseL0Panel, overflowHiddenCls, activeCls, l1ActiveCls, l2ActiveCls, eventtype);
        }
        else {
            _AddClass(togglenav, activeCls);
            _AddClass(offcanvas, activeCls);
        }
    };
    /**
     * Function to toggle events to AMegMen instance elements
     *
     * @param core - AMegMen instance core object
     * @param settings - AMegMen instance settings object
     *
     */
    var amm_toggleevents = function (core, settings) {
        var togglenav = core.togglenav;
        var closenav = core.closenav;
        var offcanvas = core.offcanvas;
        var tomain = _ArrayCall(core.tomain);
        var toprevious = _ArrayCall(core.toprevious);
        var overflowHiddenCls = settings.overflowHiddenCls ? settings.overflowHiddenCls : '';
        var activeCls = settings.activeCls ? settings.activeCls : '';
        var hoverCls = settings.hoverCls ? settings.hoverCls : '';
        var focusCls = settings.focusCls ? settings.focusCls : '';
        var l1ActiveCls = settings.l1ActiveCls ? settings.l1ActiveCls : '';
        var l2ActiveCls = settings.l2ActiveCls ? settings.l2ActiveCls : '';
        var hoverprops = {
            actOnHover: settings.actOnHover ? settings.actOnHover : false,
            actOnHoverAt: settings.actOnHoverAt ? settings.actOnHoverAt : 1280
        };
        if (settings.landingCtaCls) {
            var landingElements = _ArrayCall(core.rootElem.querySelectorAll('.' + settings.landingCtaCls + ' > a'));
            var _loop_2 = function (i) {
                var thislandingelem = landingElements[i];
                core.eventHandlers.push(amm_eventHandler(thislandingelem, 'mouseenter', function () {
                    amm_landingMouseenterFn(thislandingelem, hoverCls);
                }));
                core.eventHandlers.push(amm_eventHandler(thislandingelem, 'mouseleave', function () {
                    amm_landingMouseleaveFn(thislandingelem, hoverCls);
                }));
                core.eventHandlers.push(amm_eventHandler(thislandingelem, 'focus', function () {
                    amm_landingFocusFn(thislandingelem, focusCls);
                }));
                core.eventHandlers.push(amm_eventHandler(thislandingelem, 'blur', function () {
                    amm_landingBlurFn(thislandingelem, focusCls);
                }));
            };
            for (var i = landingElements.length - 1; i >= 0; i--) {
                _loop_2(i);
            }
        }
        if (togglenav && offcanvas) {
            core.eventHandlers.push(amm_eventHandler(togglenav, 'click', function (event) {
                amm_toggleMain(event, togglenav, offcanvas, true, overflowHiddenCls, activeCls, l1ActiveCls, l2ActiveCls, 'click');
            }));
        }
        if (closenav && offcanvas) {
            core.eventHandlers.push(amm_eventHandler(closenav, 'click', function (event) {
                amm_closeMain(event, togglenav, offcanvas, true, overflowHiddenCls, activeCls, l1ActiveCls, l2ActiveCls, 'click');
            }));
        }
        if (tomain.length > 0) {
            for (var i = tomain.length - 1; i >= 0; i--) {
                var thismain = tomain[i];
                core.eventHandlers.push(amm_eventHandler(thismain, 'click', function (event) {
                    amm_gotoMain(event, true, overflowHiddenCls, activeCls, l1ActiveCls, l2ActiveCls, 'click');
                }));
            }
        }
        if (toprevious.length > 0) {
            for (var i = toprevious.length - 1; i >= 0; i--) {
                var thisprevious = toprevious[i];
                core.eventHandlers.push(amm_eventHandler(thisprevious, 'click', function (event) {
                    amm_gotoMain(event, false, overflowHiddenCls, activeCls, l1ActiveCls, l2ActiveCls, 'click');
                }));
            }
        }
        var l0nav = core.l0nav || [];
        var _loop_3 = function (i) {
            var thisl0nav = l0nav[i];
            var l0anchor = thisl0nav.l0anchor;
            var l0panel = thisl0nav.l0panel;
            var l0navelement = thisl0nav.navelement;
            var l1nav = thisl0nav.l1nav || [];
            core.eventHandlers.push(amm_eventHandler(l0anchor, 'click', function (event) {
                amm_l0ClickFn(event, l0anchor, l0panel, core.rootElem, core.mainElem, offcanvas, overflowHiddenCls, activeCls, l1ActiveCls, l2ActiveCls, 'click');
            }));
            core.eventHandlers.push(amm_eventHandler(l0anchor, 'mouseenter', function () {
                amm_l0MouseenterFn(l0anchor, hoverCls, hoverprops.actOnHover, hoverprops.actOnHoverAt);
            }));
            core.eventHandlers.push(amm_eventHandler(l0anchor, 'mouseleave', function () {
                amm_l0MouseleaveFn(l0anchor, hoverCls);
            }));
            core.eventHandlers.push(amm_eventHandler(l0anchor, 'focus', function () {
                amm_l0FocusFn(l0anchor, focusCls);
            }));
            core.eventHandlers.push(amm_eventHandler(l0anchor, 'blur', function () {
                amm_l0BlurFn(l0anchor, focusCls);
            }));
            if (l0panel) {
                core.eventHandlers.push(amm_eventHandler(l0panel, 'click', function (event) {
                    amm_subnav_out(event, overflowHiddenCls, activeCls, l1ActiveCls, l2ActiveCls, 'click');
                }));
                if (hoverprops.actOnHover) {
                    core.eventHandlers.push(amm_eventHandler(l0panel, 'mouseover', function (event) {
                        amm_subnav_out(event, overflowHiddenCls, activeCls, l1ActiveCls, l2ActiveCls, 'mouseover');
                    }));
                }
            }
            var _loop_4 = function (j) {
                var l1anchor = l1nav[j].l1anchor;
                var l1panel = l1nav[j].l1panel;
                var l2nav = l1nav[j].l2nav || [];
                if (l1anchor) {
                    core.eventHandlers.push(amm_eventHandler(l1anchor, 'click', function (event) {
                        amm_l1ClickFn(event, l1anchor, l1panel, offcanvas, l0navelement, overflowHiddenCls, activeCls, l1ActiveCls, l2ActiveCls, 'click');
                    }));
                    core.eventHandlers.push(amm_eventHandler(l1anchor, 'mouseenter', function () {
                        amm_l1MouseenterFn(l1anchor, hoverCls, hoverprops.actOnHover, hoverprops.actOnHoverAt);
                    }));
                    core.eventHandlers.push(amm_eventHandler(l1anchor, 'mouseleave', function () {
                        amm_l1MouseleaveFn(l1anchor, hoverCls);
                    }));
                    core.eventHandlers.push(amm_eventHandler(l1anchor, 'focus', function () {
                        amm_l1FocusFn(l1anchor, focusCls);
                    }));
                    core.eventHandlers.push(amm_eventHandler(l1anchor, 'blur', function () {
                        amm_l1BlurFn(l1anchor, focusCls);
                    }));
                }
                var _loop_5 = function (k) {
                    var l2anchor = l2nav[k];
                    core.eventHandlers.push(amm_eventHandler(l2anchor, 'mouseenter', function () {
                        amm_l2MouseenterFn(l2anchor, hoverCls);
                    }));
                    core.eventHandlers.push(amm_eventHandler(l2anchor, 'mouseleave', function () {
                        amm_l2MouseleaveFn(l2anchor, hoverCls);
                    }));
                    core.eventHandlers.push(amm_eventHandler(l2anchor, 'focus', function () {
                        amm_l2FocusFn(l2anchor, focusCls);
                    }));
                    core.eventHandlers.push(amm_eventHandler(l2anchor, 'blur', function () {
                        amm_l2BlurFn(l2anchor, focusCls);
                    }));
                };
                for (var k = l2nav.length - 1; k >= 0; k--) {
                    _loop_5(k);
                }
            };
            for (var j = l1nav.length - 1; j >= 0; j--) {
                _loop_4(j);
            }
        };
        for (var i = l0nav.length - 1; i >= 0; i--) {
            _loop_3(i);
        }
        core.eventHandlers.push(amm_eventHandler(document, 'click', function (event) {
            amm_document_out(event, overflowHiddenCls, activeCls, l1ActiveCls, l2ActiveCls, 'click');
        }));
        if (hoverprops.actOnHover) {
            core.eventHandlers.push(amm_eventHandler(window, 'mouseover', function (event) {
                amm_document_out(event, overflowHiddenCls, activeCls, l1ActiveCls, l2ActiveCls, 'mouseover');
            }));
        }
    };
    /**
     * Function to initialize AMegMen instance
     *
     * @param core - AMegMen instance core object
     * @param rootElem - Parent `nav` element
     * @param settings - AMegMen instance settings object
     *
     * @returns The AMegMen instance core object after updating elements and events
     *
     */
    var amm_init = function (core, rootElem, settings) {
        _AddClass(rootElem, settings.rootCls ? settings.rootCls : '');
        core.rootElem = rootElem;
        core.settings = settings;
        core.mainElem = core.rootElem.querySelector("." + settings.mainElementCls);
        core.togglenav = core.rootElem.querySelector("." + settings.toggleBtnCls);
        core.closenav = core.rootElem.querySelector("." + settings.closeBtnCls);
        core.offcanvas = core.rootElem.querySelector("." + settings.offcanvasCls);
        core.tomain = core.rootElem.querySelectorAll("." + settings.mainBtnCls);
        core.toprevious = core.rootElem.querySelectorAll("." + settings.backBtnCls);
        core.eventHandlers = [];
        if (core.settings.isRTL) {
            _AddClass(core.rootElem, settings.rtl_Cls ? settings.rtl_Cls : '');
        }
        if (core.mainElem) {
            core.l0nav = [];
            var l0li = _ArrayCall(core.mainElem.querySelectorAll(':scope > ul > li'));
            for (var i = l0li.length - 1; i >= 0; i--) {
                var thisl0li = l0li[i];
                _ToggleUniqueId(thisl0li, settings, i, true);
                var nav0obj = {};
                nav0obj.l0li = thisl0li;
                nav0obj.l0anchor = thisl0li.querySelector(':scope > a');
                _AddClass(nav0obj.l0anchor, settings.l0AnchorCls ? settings.l0AnchorCls : '');
                var l0panel = thisl0li.querySelector(":scope > ." + settings.panelCls);
                if (l0panel) {
                    nav0obj.l0anchor.setAttribute('role', 'button');
                    nav0obj.l0anchor.setAttribute('aria-expanded', 'false');
                    l0panel.setAttribute('role', 'region');
                    l0panel.setAttribute('aria-expanded', 'false');
                    l0panel.setAttribute('aria-hidden', 'true');
                    _AddClass(l0panel, settings.l0PanelCls ? settings.l0PanelCls : '');
                    nav0obj.l0panel = l0panel;
                    nav0obj.l0tomain = l0panel.querySelector("." + settings.mainBtnCls);
                    var l1navelement = l0panel.querySelector(':scope > nav');
                    if (l1navelement) {
                        nav0obj.navelement = l1navelement;
                        var l1cols = _ArrayCall(l1navelement.querySelectorAll(":scope > ." + settings.colCls)) || [];
                        nav0obj.l1cols = l1cols.length;
                        nav0obj.l1nav = [];
                        if (l1cols.length > 0) {
                            var shiftnum = (settings.supportedCols || 0) - l1cols.length;
                            var l1li = _ArrayCall(l1navelement.querySelectorAll(":scope > ." + settings.colCls + " > ul > li")) || [];
                            var colnum = parseInt((settings.supportedCols || 0) + '');
                            for (var j = l1cols.length - 1; j >= 0; j--) {
                                var thisl1col = l1cols[j];
                                _AddClass(thisl1col, settings.colCls + "-" + (colnum > 0 ? colnum : 2));
                                if (j === colnum - 1 && j > 1) {
                                    _AddClass(thisl1col, settings.lastcolCls ? settings.lastcolCls : '');
                                }
                            }
                            for (var j = l1li.length - 1; j >= 0; j--) {
                                var thisl1li = l1li[j];
                                _ToggleUniqueId(thisl1li, settings, j, true);
                                var nav1obj = {};
                                nav1obj.l1li = thisl1li;
                                nav1obj.l1anchor = thisl1li.querySelector(':scope > a');
                                _AddClass(nav1obj.l1anchor, settings.l1AnchorCls ? settings.l1AnchorCls : '');
                                var l1panel = thisl1li.querySelector(":scope > ." + settings.panelCls);
                                if (l1panel) {
                                    nav1obj.l1anchor.setAttribute('role', 'button');
                                    nav1obj.l1anchor.setAttribute('aria-expanded', 'false');
                                    l1panel.setAttribute('role', 'region');
                                    l1panel.setAttribute('aria-expanded', 'false');
                                    l1panel.setAttribute('aria-hidden', 'true');
                                    _AddClass(l1panel, settings.l1PanelCls ? settings.l1PanelCls : '');
                                    nav1obj.l1panel = l1panel;
                                    nav1obj.l1toback = l1panel.querySelector("." + settings.backBtnCls);
                                    var l2navelement = l1panel.querySelector(':scope > nav');
                                    if (l2navelement) {
                                        nav1obj.navelement = l2navelement;
                                        var l2cols = _ArrayCall(l2navelement.querySelectorAll(":scope > ." + settings.colCls)) || [];
                                        if (l2cols.length > 0) {
                                            if (settings.shiftColumns) {
                                                _AddClass(l1navelement, (settings.colShiftCls ? settings.colShiftCls : '') + "-" + shiftnum);
                                            }
                                            _AddClass(l1panel, (settings.colWidthCls ? settings.colWidthCls : '') + "-" + shiftnum);
                                            var l2a = _ArrayCall(l2navelement.querySelectorAll(":scope > ." + settings.colCls + " > ul > li > a")) || [];
                                            for (var k = l2a.length - 1; k >= 0; k--) {
                                                var thisl2anchor = l2a[k];
                                                _AddClass(thisl2anchor, settings.l2AnchorCls ? settings.l2AnchorCls : '');
                                            }
                                            for (var k = l2cols.length - 1; k >= 0; k--) {
                                                var thisl2col = l2cols[k];
                                                // _AddClass(l2cols[k], `__amegmen--col-${l2cols.length}`);
                                                _AddClass(thisl2col, (settings.colCls ? settings.colCls : '') + "-1");
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
    /**
     * Function to destroy AMegMen instance
     *
     * @param thisid - Element id of the AMegMen instance
     * @param core - AMegMen instance core object
     *
     */
    var amm_destroy = function (thisid, core) {
        var rootElem = core.rootElem;
        var settings = core.settings;
        var allElems = _ArrayCall(rootElem.querySelectorAll('.' + settings.landingCtaCls + ' > a' +
            ',.' + settings.toggleBtnCls +
            ',.' + settings.closeBtnCls +
            ',.' + settings.mainBtnCls +
            ',.' + settings.backBtnCls +
            ',.' + settings.l0AnchorCls +
            ',.' + settings.l0PanelCls +
            ',.' + settings.l1AnchorCls +
            ',.' + settings.l2AnchorCls));
        var cls = settings.rootCls + ' '
            + settings.l0AnchorCls + ' '
            + settings.l0PanelCls + ' '
            + settings.l1AnchorCls + ' '
            + settings.l1PanelCls + ' '
            + settings.l2AnchorCls + ' '
            + settings.lastcolCls + ' '
            + settings.activeCls + ' '
            + settings.focusCls + ' '
            + settings.hoverCls + ' '
            + settings.rtl_Cls + ' '
            + settings.l2ActiveCls + ' '
            + settings.l1ActiveCls + ' '
            + settings.overflowHiddenCls;
        for (var i = allElems.length - 1; i >= 0; i--) {
            var thiselem = allElems[i];
            amm_removeEventListeners(core, thiselem);
            if ((_HasClass(thiselem, settings.l0AnchorCls) || _HasClass(thiselem, settings.l1AnchorCls)) && thiselem.getAttribute('role') === 'button') {
                thiselem.removeAttribute('role');
                thiselem.removeAttribute('aria-expanded');
            }
            if ((_HasClass(thiselem, settings.l0PanelCls) || _HasClass(thiselem, settings.l1PanelCls)) && thiselem.getAttribute('role') === 'region') {
                thiselem.removeAttribute('role');
                thiselem.removeAttribute('aria-expanded');
                thiselem.removeAttribute('aria-hidden');
            }
            _RemoveClass(thiselem, cls);
            _ToggleUniqueId(thiselem, settings, i, false);
        }
        var keycount = 0;
        for (var i in AllAMegMenInstances) {
            if (AllAMegMenInstances.hasOwnProperty(i)) {
                keycount++;
            }
        }
        if (keycount === 1) {
            amm_removeEventListeners(core, document);
            if (settings.actOnHover) {
                amm_removeEventListeners(core, window);
            }
        }
        _RemoveClass(rootElem, cls);
        delete AllAMegMenInstances[thisid];
    };
    /**
     *  ██████  ██████  ██████  ███████
     * ██      ██    ██ ██   ██ ██
     * ██      ██    ██ ██████  █████
     * ██      ██    ██ ██   ██ ██
     *  ██████  ██████  ██   ██ ███████
     *
     * Class for every AMegMen instance.
     *
     */
    var Core = /** @class */ (function () {
        function Core(thisid, rootElem, options) {
            var _this = this;
            this.core = {};
            this.destroy = function (thisid) {
                amm_destroy(thisid, _this.core);
            };
            this.core = amm_init(this.core, rootElem, Object.assign({}, _Defaults, options));
            AllAMegMenInstances[thisid] = this.core;
        }
        return Core;
    }());
    /**
     * ██████   ██████   ██████  ████████
     * ██   ██ ██    ██ ██    ██    ██
     * ██████  ██    ██ ██    ██    ██
     * ██   ██ ██    ██ ██    ██    ██
     * ██   ██  ██████   ██████     ██
     *
     * Exposed Singleton Class for global usage.
     *
     */
    var Root = /** @class */ (function () {
        /**
         * Constructor to initiate polyfills
         *
         */
        function Root() {
            var _this = this;
            this.instances = {};
            /**
             * Function to initialize the AMegMen plugin for provided query strings.
             *
             * @param query - The CSS selector for which the AMegMen needs to be initialized.
             * @param options - The optional object to customize every AMegMen instance.
             *
             */
            this.init = function (query, options) {
                var roots = _ArrayCall(document.querySelectorAll(query));
                var rootsLen = roots.length;
                var instancelen = 0;
                for (var i in _this.instances) {
                    if (_this.instances.hasOwnProperty(i)) {
                        instancelen++;
                    }
                }
                if (rootsLen > 0) {
                    for (var i = 0; i < rootsLen; i++) {
                        var id = roots[i].getAttribute('id');
                        var iselempresent = false;
                        if (id) {
                            for (var j = 0; j < instancelen; j++) {
                                if (_this.instances[id]) {
                                    iselempresent = true;
                                    break;
                                }
                            }
                        }
                        if (!iselempresent) {
                            if (id) {
                                _this.instances[id] = new Core(id, roots[i], options);
                            }
                            else {
                                var thisid = id ? id : Object.assign({}, _Defaults, options).idPrefix + '_' + new Date().getTime() + '_root_' + (i + 1);
                                roots[i].setAttribute('id', thisid);
                                _this.instances[thisid] = new Core(thisid, roots[i], options);
                            }
                        }
                    }
                }
                else {
                    console.error('Element(s) with the provided query do(es) not exist');
                }
            };
            /**
             * Function to destroy the AMegMen plugin for provided query strings.
             *
             * @param query - The CSS selector for which the AMegMen needs to be initialized.
             *
             */
            this.destroy = function (query) {
                var roots = _ArrayCall(document.querySelectorAll(query));
                var rootsLen = roots.length;
                if (rootsLen > 0) {
                    for (var i = 0; i < rootsLen; i++) {
                        var id = roots[i].getAttribute('id');
                        if (id && _this.instances[id]) {
                            _this.instances[id].destroy(id);
                            delete _this.instances[id];
                        }
                    }
                }
                else {
                    console.error('Element(s) with the provided query do(es) not exist');
                }
            };
            _EnableQSQSAScope();
            _EnableClosest();
            _EnableAssign();
        }
        /**
         * Function to return single instance
         *
         * @returns Single AMegMen Instance
         *
         */
        Root.getInstance = function () {
            if (!Root.instance) {
                Root.instance = new Root();
            }
            return Root.instance;
        };
        Root.instance = null;
        return Root;
    }());
    AMegMen.Root = Root;
})(AMegMen || (AMegMen = {}));
if (typeof exports === 'object' && typeof module !== 'undefined') {
    module.exports = AMegMen;
}
//# sourceMappingURL=amegmen.js.map