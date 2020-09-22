"use strict";
var AMegMen;
(function (AMegMen) {
    var AllAMegMenInstances = {};
    var active_amegmen = {};
    var _EventList = ['amm_landingMouseenterFn', 'amm_landingMouseleaveFn', 'amm_landingFocusFn', 'amm_landingBlurFn', 'amm_toggleMainClickFn', 'amm_closeMainClickFn',
        'amm_gotoLevelClickFn', 'amm_l0ClickFn', 'amm_l0MouseenterFn', 'amm_l0MouseleaveFn', 'amm_l0FocusFn', 'amm_l0BlurFn', 'amm_panelMouseoverFn', 'amm_panelClickFn',
        'amm_l1ClickFn', 'amm_l1MouseenterFn', 'amm_l1MouseleaveFn', 'amm_l1FocusFn', 'amm_l1BlurFn', 'amm_l2MouseenterFn', 'amm_l2MouseleaveFn', 'amm_l2FocusFn',
        'amm_l2BlurFn', 'amm_docMouseoverFn', 'amm_docClickFn'];
    var _Defaults = {
        activeClass: 'active',
        actOnHoverAt: 1280,
        backButtonClass: '__amegmen--back-cta',
        closeButtonClass: '__amegmen--close-cta',
        colClass: '__amegmen--col',
        colShiftClass: '__amegmen-shift',
        colWidthClass: '__amegmen-width',
        focusClass: 'focus',
        hoverClass: 'hover',
        idPrefix: '__amegmen_id',
        isRightToLeft: false,
        l0AnchorClass: '__amegmen--anchor-l0',
        l0PanelClass: '__amegmen--panel-l0',
        l1AnchorClass: '__amegmen--anchor-l1',
        l1PanelClass: '__amegmen--panel-l1',
        l2AnchorClass: '__amegmen--anchor-l2',
        landingCtaClass: '__amegmen--landing',
        lastcolClass: '__amegmen--col-last',
        mainButtonClass: '__amegmen--main-cta',
        mainElementClass: '__amegmen--main',
        rootClass: '__amegmen',
        offcanvasclass: '__amegmen--canvas',
        overflowHiddenClass: '__amegmen--nooverflow',
        panelClass: '__amegmen--panel',
        rightToLeftClass: '__amegmen--r-to-l',
        shiftColumns: false,
        shouldActOnHover: false,
        supportedCols: 4,
        toggleButtonClass: '__amegmen--toggle-cta',
    };
    var _EnableAssign = function () {
        if (typeof Object.assign !== 'function') {
            Object.defineProperty(Object, 'assign', {
                value: function assign(target) {
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
                configurable: true,
            });
        }
    };
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
    var _StringTrim = function (str) {
        return str.replace(/^\s+|\s+$/g, '');
    };
    var _ArrayCall = function (arr) {
        try {
            return Array.prototype.slice.call(arr || []);
        }
        catch (e) {
            return [];
        }
    };
    var _HasClass = function (element, cls) {
        if (element) {
            var clsarr = element.className.split(' ');
            return clsarr.indexOf(cls) > -1 ? true : false;
        }
        return false;
    };
    var _AddClass = function (element, cls) {
        if (element) {
            var clsarr = cls.split(' ');
            for (var i = 0; i < clsarr.length; i++) {
                if (!_HasClass(element, clsarr[i])) {
                    element.className += ' ' + clsarr[i];
                }
            }
            element.className = _StringTrim(element.className);
        }
    };
    var _RemoveClass = function (element, cls) {
        if (element) {
            var clsarr = cls.split(' ');
            var curclass = element.className.split(' ');
            for (var i = 0; i < curclass.length; i++) {
                if (clsarr.indexOf(curclass[i]) > -1) {
                    curclass.splice(i, 1);
                    i--;
                }
            }
            element.className = _StringTrim(curclass.join(' '));
        }
    };
    var _ToggleUniqueId = function (element, settings, uuid, shouldAddId) {
        if (settings.idPrefix) {
            if (shouldAddId && !element.getAttribute('id')) {
                element.setAttribute('id', settings.idPrefix + '_' + new Date().getTime() + '_' + uuid);
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
    var amm_document_out = function (overflowHiddenClass, activeClass, eventtype) {
        return function () {
            if (event && _StringTrim(active_amegmen.closestl0li || '').length > 0) {
                var closest = event.target.closest('#' + active_amegmen.closestl0li);
                if (!closest) {
                    amm_subnavclose(true, overflowHiddenClass, activeClass, eventtype);
                }
            }
        };
    };
    var amm_subnav_out = function (overflowHiddenClass, activeClass, eventtype) {
        return function () {
            if (event) {
                var closest = event.target.closest('#' + active_amegmen.closestl1li);
                if (!closest) {
                    amm_subnavclose(false, overflowHiddenClass, activeClass, eventtype);
                }
            }
        };
    };
    var amm_subnavclose = function (closeOnlyTopLevel, overflowHiddenClass, activeClass, eventtype) {
        for (var i in AllAMegMenInstances) {
            var thiscore = AllAMegMenInstances[i];
            var rootElem = thiscore.rootElem;
            var shouldExecute = false;
            if (eventtype === 'mouseover' && (AllAMegMenInstances[i].settings || {}).shouldActOnHover === true) {
                shouldExecute = true;
            }
            if (eventtype === 'click') {
                shouldExecute = true;
            }
            if (shouldExecute && _HasClass(rootElem, activeClass)) {
                var mainElem = AllAMegMenInstances[i].mainElem;
                var l0nav = AllAMegMenInstances[i].l0nav || [];
                if (closeOnlyTopLevel) {
                    _RemoveClass(rootElem, activeClass);
                    _RemoveClass(mainElem, overflowHiddenClass);
                }
                for (var j = 0; j < l0nav.length; j++) {
                    if (closeOnlyTopLevel) {
                        _RemoveClass(l0nav[j].l0anchor, activeClass);
                        _RemoveClass(l0nav[j].l0panel, activeClass);
                    }
                    _RemoveClass(l0nav[j].navelement, overflowHiddenClass);
                    for (var k = 0; k < (l0nav[j].l1nav || []).length; k++) {
                        _RemoveClass((l0nav[j].l1nav || [])[k].l1anchor, activeClass);
                        _RemoveClass((l0nav[j].l1nav || [])[k].l1panel, activeClass);
                    }
                }
            }
        }
    };
    var amm_gotoLevel = function (closeOnlyTopLevel, overflowHiddenClass, activeClass, eventtype) {
        return function () {
            if (event) {
                event.preventDefault();
            }
            amm_subnavclose(closeOnlyTopLevel, overflowHiddenClass, activeClass, eventtype);
        };
    };
    var amm_landingMouseenterFn = function (landingElement, hoverClass) {
        return function () {
            _AddClass(landingElement, hoverClass);
        };
    };
    var amm_landingMouseleaveFn = function (landingElement, hoverClass) {
        return function () {
            _RemoveClass(landingElement, hoverClass);
        };
    };
    var amm_landingFocusFn = function (landingElement, focusClass) {
        return function () {
            _AddClass(landingElement, focusClass);
        };
    };
    var amm_landingBlurFn = function (landingElement, focusClass) {
        return function () {
            _AddClass(landingElement, focusClass);
        };
    };
    var amm_l0FocusFn = function (l0anchor, focusClass) {
        return function () {
            _AddClass(l0anchor, focusClass);
        };
    };
    var amm_l0BlurFn = function (l0anchor, focusClass) {
        return function () {
            _RemoveClass(l0anchor, focusClass);
        };
    };
    var amm_l1FocusFn = function (l1anchor, focusClass) {
        return function () {
            _AddClass(l1anchor, focusClass);
        };
    };
    var amm_l1BlurFn = function (l1anchor, focusClass) {
        return function () {
            _RemoveClass(l1anchor, focusClass);
        };
    };
    var amm_l2MouseenterFn = function (l2anchor, hoverClass) {
        return function () {
            _AddClass(l2anchor, hoverClass);
        };
    };
    var amm_l2MouseleaveFn = function (l2anchor, hoverClass) {
        return function () {
            _RemoveClass(l2anchor, hoverClass);
        };
    };
    var amm_l2FocusFn = function (l2anchor, focusClass) {
        return function () {
            _AddClass(l2anchor, focusClass);
        };
    };
    var amm_l2BlurFn = function (l2anchor, focusClass) {
        return function () {
            _RemoveClass(l2anchor, focusClass);
        };
    };
    var amm_l0ClickFn = function (l0anchor, l0panel, parent, mainElem, overflowHiddenClass, activeClass, eventtype) {
        return function () {
            if (event && l0panel) {
                event.preventDefault();
            }
            if (_HasClass(l0anchor, activeClass)) {
                active_amegmen.elem = null;
                active_amegmen.closestl0li = '';
                amm_subnavclose(true, overflowHiddenClass, activeClass, eventtype);
            }
            else {
                amm_subnavclose(true, overflowHiddenClass, activeClass, eventtype);
                active_amegmen.elem = parent;
                active_amegmen.closestl0li = l0anchor.closest('li').getAttribute('id');
                _AddClass(parent, activeClass);
                _AddClass(l0anchor, activeClass);
                _AddClass(l0panel, activeClass);
                _AddClass(mainElem, overflowHiddenClass);
            }
        };
    };
    var amm_l0MouseenterFn = function (l0anchor, hoverClass, shouldActOnHover, actOnHoverAt) {
        return function () {
            _AddClass(l0anchor, hoverClass);
            if (shouldActOnHover) {
                var windowwidth = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;
                if (windowwidth >= actOnHoverAt) {
                    l0anchor.click();
                }
            }
        };
    };
    var amm_l0MouseleaveFn = function (l0anchor, hoverClass) {
        return function () {
            _RemoveClass(l0anchor, hoverClass);
        };
    };
    var amm_l1ClickFn = function (l1anchor, l1panel, l0navelement, overflowHiddenClass, activeClass, eventtype) {
        return function () {
            if (event && l1panel) {
                event.preventDefault();
            }
            if (_HasClass(l1anchor, activeClass)) {
                active_amegmen.closestl1li = '';
                amm_subnavclose(false, overflowHiddenClass, activeClass, eventtype);
            }
            else {
                active_amegmen.closestl1li = l1anchor.closest('li').getAttribute('id');
                amm_subnavclose(false, overflowHiddenClass, activeClass, eventtype);
                _AddClass(l1anchor, activeClass);
                _AddClass(l1panel, activeClass);
                _AddClass(l0navelement, overflowHiddenClass);
            }
        };
    };
    var amm_l1MouseenterFn = function (l1anchor, hoverClass, shouldActOnHover, actOnHoverAt) {
        return function () {
            _AddClass(l1anchor, hoverClass);
            if (shouldActOnHover) {
                var windowwidth = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;
                if (windowwidth >= actOnHoverAt) {
                    l1anchor.click();
                }
            }
        };
    };
    var amm_l1MouseleaveFn = function (l1anchor, hoverClass) {
        return function () {
            _RemoveClass(l1anchor, hoverClass);
        };
    };
    var amm_closeMain = function (togglenav, offcanvas, activeClass) {
        return function () {
            if (event) {
                event.preventDefault();
            }
            _RemoveClass(togglenav, activeClass);
            _RemoveClass(offcanvas, activeClass);
        };
    };
    var amm_toggleMain = function (togglenav, offcanvas, activeClass) {
        return function () {
            if (event) {
                event.preventDefault();
                if (_HasClass(togglenav, activeClass)) {
                    _RemoveClass(togglenav, activeClass);
                    _RemoveClass(offcanvas, activeClass);
                }
                else {
                    _AddClass(togglenav, activeClass);
                    _AddClass(offcanvas, activeClass);
                }
            }
        };
    };
    var amm_eventScheduler = function (shouldAdd, element, eventtype, fn) {
        shouldAdd ? element.addEventListener(eventtype, fn, false) : element.removeEventListener(eventtype, fn, false);
    };
    var amm_toggleevents = function (core, settings) {
        var togglenav = core.togglenav;
        var closenav = core.closenav;
        var offcanvas = core.offcanvas;
        var tomain = _ArrayCall(core.tomain);
        var toprevious = _ArrayCall(core.toprevious);
        var overflowHiddenClass = settings.overflowHiddenClass ? settings.overflowHiddenClass : '';
        var activeClass = settings.activeClass ? settings.activeClass : '';
        var hoverClass = settings.hoverClass ? settings.hoverClass : '';
        var focusClass = settings.focusClass ? settings.focusClass : '';
        var hoverprops = {
            shouldActOnHover: settings.shouldActOnHover ? settings.shouldActOnHover : false,
            actOnHoverAt: settings.actOnHoverAt ? settings.actOnHoverAt : 1280
        };
        if (settings.landingCtaClass) {
            var landingElements = _ArrayCall(core.rootElem.querySelectorAll('.' + settings.landingCtaClass + ' > a'));
            for (var i = 0; i < landingElements.length; i++) {
                if (!landingElements[i].amm_landingMouseenterFn) {
                    landingElements[i].amm_landingMouseenterFn = amm_landingMouseenterFn(landingElements[i], hoverClass);
                }
                if (!landingElements[i].amm_landingMouseleaveFn) {
                    landingElements[i].amm_landingMouseleaveFn = amm_landingMouseleaveFn(landingElements[i], hoverClass);
                }
                if (!landingElements[i].amm_landingFocusFn) {
                    landingElements[i].amm_landingFocusFn = amm_landingFocusFn(landingElements[i], focusClass);
                }
                if (!landingElements[i].amm_landingBlurFn) {
                    landingElements[i].amm_landingBlurFn = amm_landingBlurFn(landingElements[i], focusClass);
                }
                amm_eventScheduler(true, landingElements[i], 'mouseenter', landingElements[i].amm_landingMouseenterFn);
                amm_eventScheduler(true, landingElements[i], 'mouseleave', landingElements[i].amm_landingMouseleaveFn);
                amm_eventScheduler(true, landingElements[i], 'focus', landingElements[i].amm_landingFocusFn);
                amm_eventScheduler(true, landingElements[i], 'blur', landingElements[i].amm_landingBlurFn);
            }
        }
        if (togglenav && offcanvas) {
            if (!togglenav.amm_toggleMainClickFn) {
                togglenav.amm_toggleMainClickFn = amm_toggleMain(togglenav, offcanvas, activeClass);
            }
            amm_eventScheduler(true, togglenav, 'click', togglenav.amm_toggleMainClickFn);
        }
        if (closenav && offcanvas) {
            if (!closenav.amm_closeMainClickFn) {
                closenav.amm_closeMainClickFn = amm_closeMain(togglenav, offcanvas, activeClass);
            }
            amm_eventScheduler(true, closenav, 'click', closenav.amm_closeMainClickFn);
        }
        if (tomain.length > 0) {
            for (var i = 0; i < tomain.length; i++) {
                if (!tomain[i].amm_gotoLevelClickFn) {
                    tomain[i].amm_gotoLevelClickFn = amm_gotoLevel(true, overflowHiddenClass, activeClass, 'click');
                }
                amm_eventScheduler(true, tomain[i], 'click', tomain[i].amm_gotoLevelClickFn);
            }
        }
        if (toprevious.length > 0) {
            for (var i = 0; i < toprevious.length; i++) {
                if (!toprevious[i].amm_gotoLevelClickFn) {
                    toprevious[i].amm_gotoLevelClickFn = amm_gotoLevel(false, overflowHiddenClass, activeClass, 'click');
                }
                amm_eventScheduler(true, toprevious[i], 'click', toprevious[i].amm_gotoLevelClickFn);
            }
        }
        var l0nav = core.l0nav || [];
        for (var i = 0; i < l0nav.length; i++) {
            var l0anchor = l0nav[i].l0anchor;
            var l0panel = l0nav[i].l0panel;
            var l0navelement = l0nav[i].navelement;
            var l1nav = l0nav[i].l1nav || [];
            if (!l0anchor.amm_l0ClickFn) {
                l0anchor.amm_l0ClickFn = amm_l0ClickFn(l0anchor, l0panel, core.rootElem, core.mainElem, overflowHiddenClass, activeClass, 'click');
            }
            if (!l0anchor.amm_l0MouseenterFn) {
                l0anchor.amm_l0MouseenterFn = amm_l0MouseenterFn(l0anchor, hoverClass, hoverprops.shouldActOnHover, hoverprops.actOnHoverAt);
            }
            if (!l0anchor.amm_l0MouseleaveFn) {
                l0anchor.amm_l0MouseleaveFn = amm_l0MouseleaveFn(l0anchor, hoverClass);
            }
            if (!l0anchor.amm_l0FocusFn) {
                l0anchor.amm_l0FocusFn = amm_l0FocusFn(l0anchor, focusClass);
            }
            if (!l0anchor.amm_l0BlurFn) {
                l0anchor.amm_l0BlurFn = amm_l0BlurFn(l0anchor, focusClass);
            }
            amm_eventScheduler(true, l0anchor, 'click', l0anchor.amm_l0ClickFn);
            amm_eventScheduler(true, l0anchor, 'mouseenter', l0anchor.amm_l0MouseenterFn);
            amm_eventScheduler(true, l0anchor, 'mouseleave', l0anchor.amm_l0MouseleaveFn);
            amm_eventScheduler(true, l0anchor, 'focus', l0anchor.amm_l0FocusFn);
            amm_eventScheduler(true, l0anchor, 'blur', l0anchor.amm_l0BlurFn);
            if (l0panel) {
                if (!l0panel.amm_panelClickFn) {
                    l0panel.amm_panelClickFn = amm_subnav_out(overflowHiddenClass, activeClass, 'click');
                }
                amm_eventScheduler(true, l0panel, 'click', l0panel.amm_panelClickFn);
                if (hoverprops.shouldActOnHover) {
                    if (!l0panel.amm_panelMouseoverFn) {
                        l0panel.amm_panelMouseoverFn = amm_subnav_out(overflowHiddenClass, activeClass, 'mouseover');
                    }
                    amm_eventScheduler(true, l0panel, 'mouseover', l0panel.amm_panelMouseoverFn);
                }
            }
            for (var j = 0; j < l1nav.length; j++) {
                var l1anchor = l1nav[j].l1anchor;
                var l1panel = l1nav[j].l1panel;
                var l2nav = l1nav[j].l2nav || [];
                if (!l1anchor.amm_l1ClickFn) {
                    l1anchor.amm_l1ClickFn = amm_l1ClickFn(l1anchor, l1panel, l0navelement, overflowHiddenClass, activeClass, 'click');
                }
                if (!l1anchor.amm_l1MouseenterFn) {
                    l1anchor.amm_l1MouseenterFn = amm_l1MouseenterFn(l1anchor, hoverClass, hoverprops.shouldActOnHover, hoverprops.actOnHoverAt);
                }
                if (!l1anchor.amm_l1MouseleaveFn) {
                    l1anchor.amm_l1MouseleaveFn = amm_l1MouseleaveFn(l1anchor, hoverClass);
                }
                if (!l1anchor.amm_l1FocusFn) {
                    l1anchor.amm_l1FocusFn = amm_l1FocusFn(l1anchor, focusClass);
                }
                if (!l1anchor.amm_l1BlurFn) {
                    l1anchor.amm_l1BlurFn = amm_l1BlurFn(l1anchor, focusClass);
                }
                amm_eventScheduler(true, l1anchor, 'click', l1anchor.amm_l1ClickFn);
                amm_eventScheduler(true, l1anchor, 'mouseenter', l1anchor.amm_l1MouseenterFn);
                amm_eventScheduler(true, l1anchor, 'mouseleave', l1anchor.amm_l1MouseleaveFn);
                amm_eventScheduler(true, l1anchor, 'focus', l1anchor.amm_l1FocusFn);
                amm_eventScheduler(true, l1anchor, 'blur', l1anchor.amm_l1BlurFn);
                for (var k = 0; k < l2nav.length; k++) {
                    var l2anchor = l2nav[k];
                    if (!l2anchor.amm_l2MouseenterFn) {
                        l2anchor.amm_l2MouseenterFn = amm_l2MouseenterFn(l2anchor, hoverClass);
                    }
                    if (!l2anchor.amm_l2MouseleaveFn) {
                        l2anchor.amm_l2MouseleaveFn = amm_l2MouseleaveFn(l2anchor, hoverClass);
                    }
                    if (!l2anchor.amm_l2FocusFn) {
                        l2anchor.amm_l2FocusFn = amm_l2FocusFn(l2anchor, focusClass);
                    }
                    if (!l2anchor.amm_l2BlurFn) {
                        l2anchor.amm_l2BlurFn = amm_l2BlurFn(l2anchor, focusClass);
                    }
                    amm_eventScheduler(true, l2anchor, 'mouseenter', l2anchor.amm_l2MouseenterFn);
                    amm_eventScheduler(true, l2anchor, 'mouseleave', l2anchor.amm_l2MouseleaveFn);
                    amm_eventScheduler(true, l2anchor, 'focus', l2anchor.amm_l2FocusFn);
                    amm_eventScheduler(true, l2anchor, 'blur', l2anchor.amm_l2BlurFn);
                }
            }
        }
        if (!document.amm_docClickFn) {
            document.amm_docClickFn = amm_document_out(overflowHiddenClass, activeClass, 'click');
        }
        amm_eventScheduler(true, document, 'click', document.amm_docClickFn);
        if (hoverprops.shouldActOnHover) {
            if (!window.amm_docMouseoverFn) {
                window.amm_docMouseoverFn = amm_document_out(overflowHiddenClass, activeClass, 'mouseover');
            }
            amm_eventScheduler(true, window, 'mouseover', window.amm_docMouseoverFn);
        }
    };
    var amm_init = function (core, rootElem, settings) {
        _AddClass(rootElem, settings.rootClass ? settings.rootClass : '');
        core.rootElem = rootElem;
        core.settings = settings;
        core.mainElem = core.rootElem.querySelector("." + settings.mainElementClass);
        core.togglenav = core.rootElem.querySelector("." + settings.toggleButtonClass);
        core.closenav = core.rootElem.querySelector("." + settings.closeButtonClass);
        core.offcanvas = core.rootElem.querySelector("." + settings.offcanvasclass);
        core.tomain = core.rootElem.querySelectorAll("." + settings.mainButtonClass);
        core.toprevious = core.rootElem.querySelectorAll("." + settings.backButtonClass);
        if (core.settings.isRightToLeft) {
            _AddClass(core.rootElem, settings.rightToLeftClass ? settings.rightToLeftClass : '');
        }
        if (core.mainElem) {
            core.l0nav = [];
            var l0li = _ArrayCall(core.mainElem.querySelectorAll(':scope > ul > li'));
            for (var i = 0; i < l0li.length; i++) {
                _ToggleUniqueId(l0li[i], settings, i, true);
                var nav0obj = {};
                nav0obj.l0li = l0li[i];
                nav0obj.l0anchor = l0li[i].querySelector(':scope > a');
                _AddClass(nav0obj.l0anchor, settings.l0AnchorClass ? settings.l0AnchorClass : '');
                var l0panel = l0li[i].querySelector(":scope > ." + settings.panelClass);
                if (l0panel) {
                    _AddClass(l0panel, settings.l0PanelClass ? settings.l0PanelClass : '');
                    nav0obj.l0panel = l0panel;
                    nav0obj.l0tomain = l0panel.querySelector("." + settings.mainButtonClass);
                    var l1navelement = l0panel.querySelector(':scope > nav');
                    if (l1navelement) {
                        nav0obj.navelement = l1navelement;
                        var l1cols = _ArrayCall(l1navelement.querySelectorAll(":scope > ." + settings.colClass));
                        nav0obj.l1cols = l1cols.length;
                        nav0obj.l1nav = [];
                        if (l1cols.length > 0) {
                            var shiftnum = (settings.supportedCols || 0) - l1cols.length;
                            var l1li = _ArrayCall(l1navelement.querySelectorAll(":scope > ." + settings.colClass + " > ul > li"));
                            var colnum = parseInt((settings.supportedCols || 0) + '');
                            for (var j = 0; j < l1cols.length; j++) {
                                _AddClass(l1cols[j], settings.colClass + "-" + (colnum > 0 ? colnum : 2));
                                if (j === colnum - 1 && j > 1) {
                                    _AddClass(l1cols[j], settings.lastcolClass ? settings.lastcolClass : '');
                                }
                            }
                            for (var j = 0; j < l1li.length; j++) {
                                _ToggleUniqueId(l1li[j], settings, j, true);
                                var nav1obj = {};
                                nav1obj.l1li = l1li[j];
                                nav1obj.l1anchor = l1li[j].querySelector(':scope > a');
                                _AddClass(nav1obj.l1anchor, settings.l1AnchorClass ? settings.l1AnchorClass : '');
                                var l1panel = l1li[j].querySelector(":scope > ." + settings.panelClass);
                                if (l1panel) {
                                    _AddClass(l1panel, settings.l1PanelClass ? settings.l1PanelClass : '');
                                    nav1obj.l1panel = l1panel;
                                    nav1obj.l1toback = l1panel.querySelector("." + settings.backButtonClass);
                                    var l2navelement = l1panel.querySelector(':scope > nav');
                                    if (l2navelement) {
                                        nav1obj.navelement = l2navelement;
                                        var l2cols = _ArrayCall(l2navelement.querySelectorAll(":scope > ." + settings.colClass));
                                        if (l2cols.length) {
                                            if (settings.shiftColumns) {
                                                _AddClass(l1navelement, (settings.colShiftClass ? settings.colShiftClass : '') + "-" + shiftnum);
                                            }
                                            _AddClass(l1panel, (settings.colWidthClass ? settings.colWidthClass : '') + "-" + shiftnum);
                                            var l2a = _ArrayCall(l2navelement.querySelectorAll(":scope > ." + settings.colClass + " > ul > li > a"));
                                            for (var k = 0; k < l2a.length; k++) {
                                                _AddClass(l2a[k], settings.l2AnchorClass ? settings.l2AnchorClass : '');
                                            }
                                            for (var k = 0; k < l2cols.length; k++) {
                                                _AddClass(l2cols[k], (settings.colClass ? settings.colClass : '') + "-1");
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
    var amm_destroy = function (thisid, core) {
        var rootElem = core.rootElem;
        var settings = core.settings;
        var allElems = _ArrayCall(rootElem.querySelectorAll('*'));
        var cls = settings.rootClass + ' '
            + settings.l0AnchorClass + ' '
            + settings.l0PanelClass + ' '
            + settings.l1AnchorClass + ' '
            + settings.l1PanelClass + ' '
            + settings.l2AnchorClass + ' '
            + settings.lastcolClass + ' '
            + settings.activeClass + ' '
            + settings.focusClass + ' '
            + settings.hoverClass + ' '
            + settings.rightToLeftClass + ' '
            + settings.overflowHiddenClass;
        _RemoveClass(rootElem, cls);
        for (var i = 0; i < allElems.length; i++) {
            _RemoveClass(allElems[i], cls);
            _ToggleUniqueId(allElems[i], settings, i, false);
            for (var j = 0; j < _EventList.length; j++) {
                if (allElems[i][_EventList[j]]) {
                    if (/focus/gi.test(_EventList[j])) {
                        amm_eventScheduler(false, allElems[i], 'focus', allElems[i][_EventList[j]]);
                    }
                    if (/blur/gi.test(_EventList[j])) {
                        amm_eventScheduler(false, allElems[i], 'blur', allElems[i][_EventList[j]]);
                    }
                    if (/click/gi.test(_EventList[j])) {
                        amm_eventScheduler(false, allElems[i], 'click', allElems[i][_EventList[j]]);
                    }
                    if (/mouseenter/gi.test(_EventList[j])) {
                        amm_eventScheduler(false, allElems[i], 'mouseenter', allElems[i][_EventList[j]]);
                    }
                    if (/mouseleave/gi.test(_EventList[j])) {
                        amm_eventScheduler(false, allElems[i], 'mouseleave', allElems[i][_EventList[j]]);
                    }
                    if (/mouseover/gi.test(_EventList[j])) {
                        amm_eventScheduler(false, allElems[i], 'mouseover', allElems[i][_EventList[j]]);
                    }
                    allElems[i][_EventList[j]] = null;
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
    var Core = (function () {
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
    var Root = (function () {
        function Root() {
            var _this = this;
            this.instances = {};
            this.init = function (query, options) {
                var roots = _ArrayCall(document.querySelectorAll(query));
                if (roots.length > 0) {
                    for (var i = 0; i < roots.length; i++) {
                        var id = roots[i].getAttribute('id');
                        var iselempresent = false;
                        if (id) {
                            for (var j = 0; j < _this.instances.length; j++) {
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
            this.destroy = function (query) {
                var roots = _ArrayCall(document.querySelectorAll(query));
                if (roots.length > 0) {
                    for (var i = 0; i < roots.length; i++) {
                        var id = roots[i].getAttribute('id');
                        if (id && _this.instances[id]) {
                            _this.instances[id].destroy(id);
                            delete _this.instances[id];
                        }
                    }
                }
            };
            _EnableQSQSAScope();
            _EnableClosest();
            _EnableAssign();
            if (window && document && !window.AMegMen) {
                window.AMegMen = AMegMen;
            }
        }
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
//# sourceMappingURL=amegmen.js.map