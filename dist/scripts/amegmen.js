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
    var _EventList = ['amm_landingMouseenterFn', 'amm_landingMouseleaveFn', 'amm_landingFocusFn', 'amm_landingBlurFn', 'amm_toggleMainClickFn', 'amm_closeMainClickFn',
        'amm_gotoMainClickFn', 'amm_l0ClickFn', 'amm_l0MouseenterFn', 'amm_l0MouseleaveFn', 'amm_l0FocusFn', 'amm_l0BlurFn', 'amm_panelMouseoverFn', 'amm_panelClickFn',
        'amm_l1ClickFn', 'amm_l1MouseenterFn', 'amm_l1MouseleaveFn', 'amm_l1FocusFn', 'amm_l1BlurFn', 'amm_l2MouseenterFn', 'amm_l2MouseleaveFn', 'amm_l2FocusFn',
        'amm_l2BlurFn', 'amm_docMouseoverFn', 'amm_docClickFn'];
    var _Defaults = {
        activeCls: '__amegmen-active',
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
        rootCls: '__amegmen',
        offcanvasCls: '__amegmen--canvas',
        overflowHiddenCls: '__amegmen--nooverflow',
        panelCls: '__amegmen--panel',
        rtl_Cls: '__amegmen--r-to-l',
        shiftColumns: false,
        actOnHover: false,
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
     * Function to close the Level 1 and Level 2 Megamenues if click or hover happens on document or window
     *
     * @param overflowHiddenCls - Class which disables scrollbars on mobile
     * @param activeCls - Class which activates the megamenu links and panels
     * @param eventtype - Is `click` or `mouseover`
     *
     */
    var amm_document_out = function (overflowHiddenCls, activeCls, l1ActiveCls, l2ActiveCls, eventtype) {
        return function () {
            if (event && _StringTrim(active_amegmen.closestl0li || '').length > 0) {
                var closest = event.target.closest('#' + active_amegmen.closestl0li);
                if (!closest) {
                    amm_subnavclose(true, overflowHiddenCls, activeCls, l1ActiveCls, l2ActiveCls, eventtype);
                }
            }
        };
    };
    /**
     * Function to close the Level 2 Megamenu if click or hover happens on Level 1 Megamenu Panel
     *
     * @param overflowHiddenCls - Class which disables scrollbars on mobile
     * @param activeCls - Class which activates the megamenu links and panels
     * @param eventtype - Is `click` or `mouseover`
     *
     */
    var amm_subnav_out = function (overflowHiddenCls, activeCls, l1ActiveCls, l2ActiveCls, eventtype) {
        return function () {
            if (event && _StringTrim(active_amegmen.closestl1li || '').length > 0) {
                var closest = event.target.closest('#' + active_amegmen.closestl1li);
                if (!closest) {
                    amm_subnavclose(false, overflowHiddenCls, activeCls, l1ActiveCls, l2ActiveCls, eventtype);
                }
            }
        };
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
        return function () {
            _AddClass(landingElement, hoverCls);
        };
    };
    /**
     * Mouseleave event for Landing link on the panels
     *
     * @param landingElement - An HTML Element
     * @param hoverCls - CSS Class for hovered element
     *
     */
    var amm_landingMouseleaveFn = function (landingElement, hoverCls) {
        return function () {
            _RemoveClass(landingElement, hoverCls);
        };
    };
    /**
     * Focus event for Landing link on the panels
     *
     * @param landingElement - An HTML Element
     * @param focusCls - CSS Class for focussed element
     *
     */
    var amm_landingFocusFn = function (landingElement, focusCls) {
        return function () {
            _AddClass(landingElement, focusCls);
        };
    };
    /**
     * Blur event for Landing link on the panels
     *
     * @param landingElement - An HTML Element
     * @param focusCls - CSS Class for focussed element
     *
     */
    var amm_landingBlurFn = function (landingElement, focusCls) {
        return function () {
            _RemoveClass(landingElement, focusCls);
        };
    };
    /**
     * Focus event for Level 0 link
     *
     * @param l0anchor - An HTML Anchor element at Level 0 Navigation
     * @param focusCls - CSS Class for focussed element
     *
     */
    var amm_l0FocusFn = function (l0anchor, focusCls) {
        return function () {
            _AddClass(l0anchor, focusCls);
        };
    };
    /**
     * Blur event for Level 0 link
     *
     * @param l0anchor - An HTML Anchor element at Level 0 Navigation
     * @param focusCls - CSS Class for focussed element
     *
     */
    var amm_l0BlurFn = function (l0anchor, focusCls) {
        return function () {
            _RemoveClass(l0anchor, focusCls);
        };
    };
    /**
     * Focus event for Level 1 link
     *
     * @param l1anchor - An HTML Anchor element at Level 1 Navigation
     * @param focusCls - CSS Class for focussed element
     *
     */
    var amm_l1FocusFn = function (l1anchor, focusCls) {
        return function () {
            _AddClass(l1anchor, focusCls);
        };
    };
    /**
     * Blur event for Level 1 link
     *
     * @param l1anchor - An HTML Anchor element at Level 1 Navigation
     * @param focusCls - CSS Class for focussed element
     *
     */
    var amm_l1BlurFn = function (l1anchor, focusCls) {
        return function () {
            _RemoveClass(l1anchor, focusCls);
        };
    };
    /**
     * Mouseenter event for Level 2 link
     *
     * @param l2anchor - An HTML Anchor element at Level 2 Navigation
     * @param hoverCls - CSS Class for hovered element
     *
     */
    var amm_l2MouseenterFn = function (l2anchor, hoverCls) {
        return function () {
            _AddClass(l2anchor, hoverCls);
        };
    };
    /**
     * Mouseleave event for Level 2 link
     *
     * @param l2anchor - An HTML Anchor element at Level 2 Navigation
     * @param hoverCls - CSS Class for hovered element
     *
     */
    var amm_l2MouseleaveFn = function (l2anchor, hoverCls) {
        return function () {
            _RemoveClass(l2anchor, hoverCls);
        };
    };
    /**
     * Focus event for Level 2 link
     *
     * @param l2anchor - An HTML Anchor element at Level 2 Navigation
     * @param focusCls - CSS Class for focussed element
     *
     */
    var amm_l2FocusFn = function (l2anchor, focusCls) {
        return function () {
            _AddClass(l2anchor, focusCls);
        };
    };
    /**
     * Blur event for Level 2 link
     *
     * @param l2anchor - An HTML Anchor element at Level 2 Navigation
     * @param focusCls - CSS Class for focussed element
     *
     */
    var amm_l2BlurFn = function (l2anchor, focusCls) {
        return function () {
            _RemoveClass(l2anchor, focusCls);
        };
    };
    /**
     * Click event for Level 0 link
     *
     * @param l0anchor - An HTML Anchor element at Level 0 Navigation
     * @param l0panel - Adjecent Panel to the l0anchor
     * @param parent - Parent LI element
     * @param mainElem - Main Wrapper which contains the navigation elements
     * @param overflowHiddenCls - Class which disables scrollbars on mobile
     * @param activeCls - Class for active elements
     * @param eventtype - 'Click' or 'Mouseenter' for hoverable megamenues
     *
     */
    var amm_l0ClickFn = function (l0anchor, l0panel, parent, mainElem, offcanvas, overflowHiddenCls, activeCls, l1ActiveCls, l2ActiveCls, eventtype) {
        return function () {
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
        return function () {
            _AddClass(l0anchor, hoverCls);
            if (actOnHover) {
                var windowwidth = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;
                if (windowwidth >= actOnHoverAt) {
                    l0anchor.click();
                }
            }
        };
    };
    /**
     * Mouseleave event for Level 0 link
     *
     * @param l0anchor - An HTML Anchor element at Level 0 Navigation
     * @param hoverCls - Class for hovered elements
     *
     */
    var amm_l0MouseleaveFn = function (l0anchor, hoverCls) {
        return function () {
            _RemoveClass(l0anchor, hoverCls);
        };
    };
    /**
     * Click event for Level 1 link
     *
     * @param l1anchor - An HTML Anchor element at Level 1 Navigation
     * @param l1panel - Adjecent Panel to the l1anchor
     * @param l0navelement - Parent `nav` element of l1anchor
     * @param overflowHiddenCls - Class which disables scrollbars on mobile
     * @param activeCls - Class for active elements
     * @param eventtype - 'Click' or 'Mouseenter' for hoverable megamenues
     *
     */
    var amm_l1ClickFn = function (l1anchor, l1panel, offcanvas, l0navelement, overflowHiddenCls, activeCls, l1ActiveCls, l2ActiveCls, eventtype) {
        return function () {
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
        return function () {
            _AddClass(l1anchor, hoverCls);
            if (actOnHover) {
                var windowwidth = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;
                if (windowwidth >= actOnHoverAt) {
                    l1anchor.click();
                }
            }
        };
    };
    /**
     * Mouseleave event for Level 1 link
     *
     * @param l1anchor - An HTML Anchor element at Level 1 Navigation
     * @param hoverCls - Class for hovered elements
     *
     */
    var amm_l1MouseleaveFn = function (l1anchor, hoverCls) {
        return function () {
            _RemoveClass(l1anchor, hoverCls);
        };
    };
    /**
     * Function to navigate the megamenu to Level 0 from Level 1 and Level 1
     *
     * @param shouldCloseL0Panel - If `true`, loses Level 0 and Level 1 Panels. Otherwise closes Level 1 panels only
     * @param overflowHiddenCls - Class which disables scrollbars on mobile
     * @param activeCls - Class which activates the megamenu links and panels
     * @param eventtype - Is `click` or `mouseover`
     *
     */
    var amm_gotoMain = function (shouldCloseL0Panel, overflowHiddenCls, activeCls, l1ActiveCls, l2ActiveCls, eventtype) {
        return function () {
            if (event) {
                event.preventDefault();
            }
            amm_subnavclose(shouldCloseL0Panel, overflowHiddenCls, activeCls, l1ActiveCls, l2ActiveCls, eventtype);
        };
    };
    /**
     * Click event for closing megamenu on mobile
     *
     * @param togglenav - Button element to close Offcanvas on mobile
     * @param offcanvas - Offcanvas element containing megamenu
     * @param activeCls - Class which activates the megamenu links and panels
     *
     */
    var amm_closeMain = function (togglenav, offcanvas, shouldCloseL0Panel, overflowHiddenCls, activeCls, l1ActiveCls, l2ActiveCls, eventtype) {
        return function () {
            if (event) {
                event.preventDefault();
            }
            amm_subnavclose(shouldCloseL0Panel, overflowHiddenCls, activeCls, l1ActiveCls, l2ActiveCls, eventtype);
            _RemoveClass(togglenav, activeCls);
            _RemoveClass(offcanvas, activeCls);
        };
    };
    /**
     * Click event for opening/closing megamenu on mobile
     *
     * @param togglenav - Button element to close Offcanvas on mobile
     * @param offcanvas - Offcanvas element containing megamenu
     * @param activeCls - Class which activates the megamenu links and panels
     *
     */
    var amm_toggleMain = function (togglenav, offcanvas, shouldCloseL0Panel, overflowHiddenCls, activeCls, l1ActiveCls, l2ActiveCls, eventtype) {
        return function () {
            if (event) {
                event.preventDefault();
                if (_HasClass(togglenav, activeCls)) {
                    _RemoveClass(togglenav, activeCls);
                    _RemoveClass(offcanvas, activeCls);
                    amm_closeMain(togglenav, offcanvas, shouldCloseL0Panel, overflowHiddenCls, activeCls, l1ActiveCls, l2ActiveCls, eventtype);
                }
                else {
                    _AddClass(togglenav, activeCls);
                    _AddClass(offcanvas, activeCls);
                }
            }
        };
    };
    /**
     * Function to add/remove events related to megamenu elements
     *
     * @param shouldAdd - If `true`, adds the event to the element, otherwise removes it
     * @param element - The element to which event is added/removed
     * @param eventtype - Eventtype as a string, like 'click', 'mouseenter', 'mouseleave' etc.
     * @param fn - The Eventlistener function which is attached to the respective event
     *
     */
    var amm_eventScheduler = function (shouldAdd, element, eventtype, fn) {
        shouldAdd ? element.addEventListener(eventtype, fn, false) : element.removeEventListener(eventtype, fn, false);
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
            for (var i = landingElements.length - 1; i >= 0; i--) {
                var thislandingelem = landingElements[i];
                if (!thislandingelem.amm_landingMouseenterFn) {
                    thislandingelem.amm_landingMouseenterFn = amm_landingMouseenterFn(thislandingelem, hoverCls);
                }
                if (!thislandingelem.amm_landingMouseleaveFn) {
                    thislandingelem.amm_landingMouseleaveFn = amm_landingMouseleaveFn(thislandingelem, hoverCls);
                }
                if (!thislandingelem.amm_landingFocusFn) {
                    thislandingelem.amm_landingFocusFn = amm_landingFocusFn(thislandingelem, focusCls);
                }
                if (!thislandingelem.amm_landingBlurFn) {
                    thislandingelem.amm_landingBlurFn = amm_landingBlurFn(thislandingelem, focusCls);
                }
                amm_eventScheduler(true, thislandingelem, 'mouseenter', thislandingelem.amm_landingMouseenterFn);
                amm_eventScheduler(true, thislandingelem, 'mouseleave', thislandingelem.amm_landingMouseleaveFn);
                amm_eventScheduler(true, thislandingelem, 'focus', thislandingelem.amm_landingFocusFn);
                amm_eventScheduler(true, thislandingelem, 'blur', thislandingelem.amm_landingBlurFn);
            }
        }
        if (togglenav && offcanvas) {
            if (!togglenav.amm_toggleMainClickFn) {
                togglenav.amm_toggleMainClickFn = amm_toggleMain(togglenav, offcanvas, true, overflowHiddenCls, activeCls, l1ActiveCls, l2ActiveCls, 'click');
            }
            amm_eventScheduler(true, togglenav, 'click', togglenav.amm_toggleMainClickFn);
        }
        if (closenav && offcanvas) {
            if (!closenav.amm_closeMainClickFn) {
                closenav.amm_closeMainClickFn = amm_closeMain(togglenav, offcanvas, true, overflowHiddenCls, activeCls, l1ActiveCls, l2ActiveCls, 'click');
            }
            amm_eventScheduler(true, closenav, 'click', closenav.amm_closeMainClickFn);
        }
        if (tomain.length > 0) {
            for (var i = tomain.length - 1; i >= 0; i--) {
                var thismain = tomain[i];
                if (!thismain.amm_gotoMainClickFn) {
                    thismain.amm_gotoMainClickFn = amm_gotoMain(true, overflowHiddenCls, activeCls, l1ActiveCls, l2ActiveCls, 'click');
                }
                amm_eventScheduler(true, thismain, 'click', thismain.amm_gotoMainClickFn);
            }
        }
        if (toprevious.length > 0) {
            for (var i = toprevious.length - 1; i >= 0; i--) {
                var thisprevious = toprevious[i];
                if (!thisprevious.amm_gotoMainClickFn) {
                    thisprevious.amm_gotoMainClickFn = amm_gotoMain(false, overflowHiddenCls, activeCls, l1ActiveCls, l2ActiveCls, 'click');
                }
                amm_eventScheduler(true, thisprevious, 'click', thisprevious.amm_gotoMainClickFn);
            }
        }
        var l0nav = core.l0nav || [];
        for (var i = l0nav.length - 1; i >= 0; i--) {
            var thisl0nav = l0nav[i];
            var l0anchor = thisl0nav.l0anchor;
            var l0panel = thisl0nav.l0panel;
            var l0navelement = thisl0nav.navelement;
            var l1nav = thisl0nav.l1nav || [];
            if (!l0anchor.amm_l0ClickFn) {
                l0anchor.amm_l0ClickFn = amm_l0ClickFn(l0anchor, l0panel, core.rootElem, core.mainElem, offcanvas, overflowHiddenCls, activeCls, l1ActiveCls, l2ActiveCls, 'click');
            }
            if (!l0anchor.amm_l0MouseenterFn) {
                l0anchor.amm_l0MouseenterFn = amm_l0MouseenterFn(l0anchor, hoverCls, hoverprops.actOnHover, hoverprops.actOnHoverAt);
            }
            if (!l0anchor.amm_l0MouseleaveFn) {
                l0anchor.amm_l0MouseleaveFn = amm_l0MouseleaveFn(l0anchor, hoverCls);
            }
            if (!l0anchor.amm_l0FocusFn) {
                l0anchor.amm_l0FocusFn = amm_l0FocusFn(l0anchor, focusCls);
            }
            if (!l0anchor.amm_l0BlurFn) {
                l0anchor.amm_l0BlurFn = amm_l0BlurFn(l0anchor, focusCls);
            }
            amm_eventScheduler(true, l0anchor, 'click', l0anchor.amm_l0ClickFn);
            amm_eventScheduler(true, l0anchor, 'mouseenter', l0anchor.amm_l0MouseenterFn);
            amm_eventScheduler(true, l0anchor, 'mouseleave', l0anchor.amm_l0MouseleaveFn);
            amm_eventScheduler(true, l0anchor, 'focus', l0anchor.amm_l0FocusFn);
            amm_eventScheduler(true, l0anchor, 'blur', l0anchor.amm_l0BlurFn);
            if (l0panel) {
                if (!l0panel.amm_panelClickFn) {
                    l0panel.amm_panelClickFn = amm_subnav_out(overflowHiddenCls, activeCls, l1ActiveCls, l2ActiveCls, 'click');
                }
                amm_eventScheduler(true, l0panel, 'click', l0panel.amm_panelClickFn);
                if (hoverprops.actOnHover) {
                    if (!l0panel.amm_panelMouseoverFn) {
                        l0panel.amm_panelMouseoverFn = amm_subnav_out(overflowHiddenCls, activeCls, l1ActiveCls, l2ActiveCls, 'mouseover');
                    }
                    amm_eventScheduler(true, l0panel, 'mouseover', l0panel.amm_panelMouseoverFn);
                }
            }
            for (var j = l1nav.length - 1; j >= 0; j--) {
                var l1anchor = l1nav[j].l1anchor;
                var l1panel = l1nav[j].l1panel;
                var l2nav = l1nav[j].l2nav || [];
                if (l1anchor) {
                    if (!l1anchor.amm_l1ClickFn) {
                        l1anchor.amm_l1ClickFn = amm_l1ClickFn(l1anchor, l1panel, offcanvas, l0navelement, overflowHiddenCls, activeCls, l1ActiveCls, l2ActiveCls, 'click');
                    }
                    if (!l1anchor.amm_l1MouseenterFn) {
                        l1anchor.amm_l1MouseenterFn = amm_l1MouseenterFn(l1anchor, hoverCls, hoverprops.actOnHover, hoverprops.actOnHoverAt);
                    }
                    if (!l1anchor.amm_l1MouseleaveFn) {
                        l1anchor.amm_l1MouseleaveFn = amm_l1MouseleaveFn(l1anchor, hoverCls);
                    }
                    if (!l1anchor.amm_l1FocusFn) {
                        l1anchor.amm_l1FocusFn = amm_l1FocusFn(l1anchor, focusCls);
                    }
                    if (!l1anchor.amm_l1BlurFn) {
                        l1anchor.amm_l1BlurFn = amm_l1BlurFn(l1anchor, focusCls);
                    }
                    amm_eventScheduler(true, l1anchor, 'click', l1anchor.amm_l1ClickFn);
                    amm_eventScheduler(true, l1anchor, 'mouseenter', l1anchor.amm_l1MouseenterFn);
                    amm_eventScheduler(true, l1anchor, 'mouseleave', l1anchor.amm_l1MouseleaveFn);
                    amm_eventScheduler(true, l1anchor, 'focus', l1anchor.amm_l1FocusFn);
                    amm_eventScheduler(true, l1anchor, 'blur', l1anchor.amm_l1BlurFn);
                }
                for (var k = l2nav.length - 1; k >= 0; k--) {
                    var l2anchor = l2nav[k];
                    if (!l2anchor.amm_l2MouseenterFn) {
                        l2anchor.amm_l2MouseenterFn = amm_l2MouseenterFn(l2anchor, hoverCls);
                    }
                    if (!l2anchor.amm_l2MouseleaveFn) {
                        l2anchor.amm_l2MouseleaveFn = amm_l2MouseleaveFn(l2anchor, hoverCls);
                    }
                    if (!l2anchor.amm_l2FocusFn) {
                        l2anchor.amm_l2FocusFn = amm_l2FocusFn(l2anchor, focusCls);
                    }
                    if (!l2anchor.amm_l2BlurFn) {
                        l2anchor.amm_l2BlurFn = amm_l2BlurFn(l2anchor, focusCls);
                    }
                    amm_eventScheduler(true, l2anchor, 'mouseenter', l2anchor.amm_l2MouseenterFn);
                    amm_eventScheduler(true, l2anchor, 'mouseleave', l2anchor.amm_l2MouseleaveFn);
                    amm_eventScheduler(true, l2anchor, 'focus', l2anchor.amm_l2FocusFn);
                    amm_eventScheduler(true, l2anchor, 'blur', l2anchor.amm_l2BlurFn);
                }
            }
        }
        if (!document.amm_docClickFn) {
            document.amm_docClickFn = amm_document_out(overflowHiddenCls, activeCls, l1ActiveCls, l2ActiveCls, 'click');
        }
        amm_eventScheduler(true, document, 'click', document.amm_docClickFn);
        if (hoverprops.actOnHover) {
            if (!window.amm_docMouseoverFn) {
                window.amm_docMouseoverFn = amm_document_out(overflowHiddenCls, activeCls, l1ActiveCls, l2ActiveCls, 'mouseover');
            }
            amm_eventScheduler(true, window, 'mouseover', window.amm_docMouseoverFn);
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
        var allElems = _ArrayCall(rootElem.querySelectorAll('*'));
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
        _RemoveClass(rootElem, cls);
        for (var i = allElems.length - 1; i >= 0; i--) {
            var thiselem = allElems[i];
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
            for (var j = _EventList.length - 1; j >= 0; j--) {
                var thisevent = _EventList[j];
                if (thiselem[thisevent]) {
                    if (/focus/gi.test(thisevent)) {
                        amm_eventScheduler(false, thiselem, 'focus', thiselem[thisevent]);
                    }
                    if (/blur/gi.test(thisevent)) {
                        amm_eventScheduler(false, thiselem, 'blur', thiselem[thisevent]);
                    }
                    if (/click/gi.test(thisevent)) {
                        amm_eventScheduler(false, thiselem, 'click', thiselem[thisevent]);
                    }
                    if (/mouseenter/gi.test(thisevent)) {
                        amm_eventScheduler(false, thiselem, 'mouseenter', thiselem[thisevent]);
                    }
                    if (/mouseleave/gi.test(thisevent)) {
                        amm_eventScheduler(false, thiselem, 'mouseleave', thiselem[thisevent]);
                    }
                    if (/mouseover/gi.test(thisevent)) {
                        amm_eventScheduler(false, thiselem, 'mouseover', thiselem[thisevent]);
                    }
                    thiselem[thisevent] = null;
                }
            }
        }
        var keycount = 0;
        for (var i in AllAMegMenInstances) {
            if (AllAMegMenInstances.hasOwnProperty(i)) {
                keycount++;
            }
        }
        if (keycount === 1) {
            if (window.amm_docMouseoverFn) {
                amm_eventScheduler(false, window, 'mouseover', window.amm_docMouseoverFn);
                window.amm_docMouseoverFn = null;
            }
            if (document.amm_docClickFn) {
                amm_eventScheduler(false, document, 'mouseover', document.amm_docClickFn);
                document.amm_docClickFn = null;
            }
        }
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