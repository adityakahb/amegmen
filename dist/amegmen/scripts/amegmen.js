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
        activeCls: 'active',
        actOnHoverAt: 1280,
        backBtnCls: '__amegmen--back-cta',
        closeBtnCls: '__amegmen--close-cta',
        colCls: '__amegmen--col',
        colShiftCls: '__amegmen-shift',
        colWidthCls: '__amegmen-width',
        focusCls: 'focus',
        hoverCls: 'hover',
        idPrefix: '__amegmen_id',
        isRTL: false,
        l0AnchorCls: '__amegmen--anchor-l0',
        l0PanelCls: '__amegmen--panel-l0',
        l1AnchorCls: '__amegmen--anchor-l1',
        l1PanelCls: '__amegmen--panel-l1',
        l2AnchorCls: '__amegmen--anchor-l2',
        landingCtaCls: '__amegmen--landing',
        lastcolCls: '__amegmen--col-last',
        mainBtnCls: '__amegmen--main-cta',
        mainElementCls: '__amegmen--main',
        rootCls: '__amegmen',
        offcanvasCls: '__amegmen--canvas',
        overflowHiddenCls: '__amegmen--nooverflow',
        panelCls: '__amegmen--panel',
        rTL_Cls: '__amegmen--r-to-l',
        shiftColumns: false,
        actOnHover: false,
        supportedCols: 4,
        toggleBtnCls: '__amegmen--toggle-cta'
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
                configurable: true
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
            var clsarrLength = clsarr.length;
            for (var i = 0; i < clsarrLength; i++) {
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
            var curclassLength = curclass.length;
            for (var i = 0; i < curclassLength; i++) {
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
    var amm_document_out = function (overflowHiddenCls, activeCls, eventtype) {
        return function () {
            if (event && _StringTrim(active_amegmen.closestl0li || '').length > 0) {
                var closest = event.target.closest('#' + active_amegmen.closestl0li);
                if (!closest) {
                    amm_subnavclose(true, overflowHiddenCls, activeCls, eventtype);
                }
            }
        };
    };
    var amm_subnav_out = function (overflowHiddenCls, activeCls, eventtype) {
        return function () {
            if (event) {
                var closest = event.target.closest('#' + active_amegmen.closestl1li);
                if (!closest) {
                    amm_subnavclose(false, overflowHiddenCls, activeCls, eventtype);
                }
            }
        };
    };
    var amm_subnavclose = function (closeOnlyTopLevel, overflowHiddenCls, activeCls, eventtype) {
        for (var i in AllAMegMenInstances) {
            var thiscore = AllAMegMenInstances[i];
            var rootElem = thiscore.rootElem;
            var shouldExecute = false;
            if (eventtype === 'mouseover' && (AllAMegMenInstances[i].settings || {}).actOnHover === true) {
                shouldExecute = true;
            }
            if (eventtype === 'click') {
                shouldExecute = true;
            }
            if (shouldExecute && _HasClass(rootElem, activeCls)) {
                var mainElem = AllAMegMenInstances[i].mainElem;
                var l0nav = AllAMegMenInstances[i].l0nav || [];
                var l0navLength = l0nav.length;
                if (closeOnlyTopLevel) {
                    _RemoveClass(rootElem, activeCls);
                    _RemoveClass(mainElem, overflowHiddenCls);
                }
                for (var j = 0; j < l0navLength; j++) {
                    if (closeOnlyTopLevel) {
                        _RemoveClass(l0nav[j].l0anchor, activeCls);
                        _RemoveClass(l0nav[j].l0panel, activeCls);
                    }
                    _RemoveClass(l0nav[j].navelement, overflowHiddenCls);
                    var l1nav = l0nav[j].l1nav;
                    var l1navLength = l1nav.length;
                    for (var k = 0; k < l1navLength; k++) {
                        _RemoveClass(l1nav[k].l1anchor, activeCls);
                        _RemoveClass(l1nav[k].l1panel, activeCls);
                    }
                }
            }
        }
    };
    var amm_gotoLevel = function (closeOnlyTopLevel, overflowHiddenCls, activeCls, eventtype) {
        return function () {
            if (event) {
                event.preventDefault();
            }
            amm_subnavclose(closeOnlyTopLevel, overflowHiddenCls, activeCls, eventtype);
        };
    };
    var amm_landingMouseenterFn = function (landingElement, hoverCls) {
        return function () {
            _AddClass(landingElement, hoverCls);
        };
    };
    var amm_landingMouseleaveFn = function (landingElement, hoverCls) {
        return function () {
            _RemoveClass(landingElement, hoverCls);
        };
    };
    var amm_landingFocusFn = function (landingElement, focusCls) {
        return function () {
            _AddClass(landingElement, focusCls);
        };
    };
    var amm_landingBlurFn = function (landingElement, focusCls) {
        return function () {
            _AddClass(landingElement, focusCls);
        };
    };
    var amm_l0FocusFn = function (l0anchor, focusCls) {
        return function () {
            _AddClass(l0anchor, focusCls);
        };
    };
    var amm_l0BlurFn = function (l0anchor, focusCls) {
        return function () {
            _RemoveClass(l0anchor, focusCls);
        };
    };
    var amm_l1FocusFn = function (l1anchor, focusCls) {
        return function () {
            _AddClass(l1anchor, focusCls);
        };
    };
    var amm_l1BlurFn = function (l1anchor, focusCls) {
        return function () {
            _RemoveClass(l1anchor, focusCls);
        };
    };
    var amm_l2MouseenterFn = function (l2anchor, hoverCls) {
        return function () {
            _AddClass(l2anchor, hoverCls);
        };
    };
    var amm_l2MouseleaveFn = function (l2anchor, hoverCls) {
        return function () {
            _RemoveClass(l2anchor, hoverCls);
        };
    };
    var amm_l2FocusFn = function (l2anchor, focusCls) {
        return function () {
            _AddClass(l2anchor, focusCls);
        };
    };
    var amm_l2BlurFn = function (l2anchor, focusCls) {
        return function () {
            _RemoveClass(l2anchor, focusCls);
        };
    };
    var amm_l0ClickFn = function (l0anchor, l0panel, parent, mainElem, overflowHiddenCls, activeCls, eventtype) {
        return function () {
            if (event && l0panel) {
                event.preventDefault();
            }
            if (_HasClass(l0anchor, activeCls)) {
                active_amegmen.elem = null;
                active_amegmen.closestl0li = '';
                amm_subnavclose(true, overflowHiddenCls, activeCls, eventtype);
            }
            else {
                amm_subnavclose(true, overflowHiddenCls, activeCls, eventtype);
                active_amegmen.elem = parent;
                active_amegmen.closestl0li = l0anchor.closest('li').getAttribute('id');
                _AddClass(parent, activeCls);
                _AddClass(l0anchor, activeCls);
                _AddClass(l0panel, activeCls);
                _AddClass(mainElem, overflowHiddenCls);
            }
        };
    };
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
    var amm_l0MouseleaveFn = function (l0anchor, hoverCls) {
        return function () {
            _RemoveClass(l0anchor, hoverCls);
        };
    };
    var amm_l1ClickFn = function (l1anchor, l1panel, l0navelement, overflowHiddenCls, activeCls, eventtype) {
        return function () {
            if (event && l1panel) {
                event.preventDefault();
            }
            if (_HasClass(l1anchor, activeCls)) {
                active_amegmen.closestl1li = '';
                amm_subnavclose(false, overflowHiddenCls, activeCls, eventtype);
            }
            else {
                active_amegmen.closestl1li = l1anchor.closest('li').getAttribute('id');
                amm_subnavclose(false, overflowHiddenCls, activeCls, eventtype);
                _AddClass(l1anchor, activeCls);
                _AddClass(l1panel, activeCls);
                _AddClass(l0navelement, overflowHiddenCls);
            }
        };
    };
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
    var amm_l1MouseleaveFn = function (l1anchor, hoverCls) {
        return function () {
            _RemoveClass(l1anchor, hoverCls);
        };
    };
    var amm_closeMain = function (togglenav, offcanvas, activeCls) {
        return function () {
            if (event) {
                event.preventDefault();
            }
            _RemoveClass(togglenav, activeCls);
            _RemoveClass(offcanvas, activeCls);
        };
    };
    var amm_toggleMain = function (togglenav, offcanvas, activeCls) {
        return function () {
            if (event) {
                event.preventDefault();
                if (_HasClass(togglenav, activeCls)) {
                    _RemoveClass(togglenav, activeCls);
                    _RemoveClass(offcanvas, activeCls);
                }
                else {
                    _AddClass(togglenav, activeCls);
                    _AddClass(offcanvas, activeCls);
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
        var overflowHiddenCls = settings.overflowHiddenCls ? settings.overflowHiddenCls : '';
        var activeCls = settings.activeCls ? settings.activeCls : '';
        var hoverCls = settings.hoverCls ? settings.hoverCls : '';
        var focusCls = settings.focusCls ? settings.focusCls : '';
        var hoverprops = {
            actOnHover: settings.actOnHover ? settings.actOnHover : false,
            actOnHoverAt: settings.actOnHoverAt ? settings.actOnHoverAt : 1280
        };
        if (settings.landingCtaCls) {
            var landingElements = _ArrayCall(core.rootElem.querySelectorAll('.' + settings.landingCtaCls + ' > a'));
            var landingElementsLength = landingElements.length;
            for (var i = 0; i < landingElementsLength; i++) {
                if (!landingElements[i].amm_landingMouseenterFn) {
                    landingElements[i].amm_landingMouseenterFn = amm_landingMouseenterFn(landingElements[i], hoverCls);
                }
                if (!landingElements[i].amm_landingMouseleaveFn) {
                    landingElements[i].amm_landingMouseleaveFn = amm_landingMouseleaveFn(landingElements[i], hoverCls);
                }
                if (!landingElements[i].amm_landingFocusFn) {
                    landingElements[i].amm_landingFocusFn = amm_landingFocusFn(landingElements[i], focusCls);
                }
                if (!landingElements[i].amm_landingBlurFn) {
                    landingElements[i].amm_landingBlurFn = amm_landingBlurFn(landingElements[i], focusCls);
                }
                amm_eventScheduler(true, landingElements[i], 'mouseenter', landingElements[i].amm_landingMouseenterFn);
                amm_eventScheduler(true, landingElements[i], 'mouseleave', landingElements[i].amm_landingMouseleaveFn);
                amm_eventScheduler(true, landingElements[i], 'focus', landingElements[i].amm_landingFocusFn);
                amm_eventScheduler(true, landingElements[i], 'blur', landingElements[i].amm_landingBlurFn);
            }
        }
        if (togglenav && offcanvas) {
            if (!togglenav.amm_toggleMainClickFn) {
                togglenav.amm_toggleMainClickFn = amm_toggleMain(togglenav, offcanvas, activeCls);
            }
            amm_eventScheduler(true, togglenav, 'click', togglenav.amm_toggleMainClickFn);
        }
        if (closenav && offcanvas) {
            if (!closenav.amm_closeMainClickFn) {
                closenav.amm_closeMainClickFn = amm_closeMain(togglenav, offcanvas, activeCls);
            }
            amm_eventScheduler(true, closenav, 'click', closenav.amm_closeMainClickFn);
        }
        if (tomain.length > 0) {
            for (var i = 0; i < tomain.length; i++) {
                if (!tomain[i].amm_gotoLevelClickFn) {
                    tomain[i].amm_gotoLevelClickFn = amm_gotoLevel(true, overflowHiddenCls, activeCls, 'click');
                }
                amm_eventScheduler(true, tomain[i], 'click', tomain[i].amm_gotoLevelClickFn);
            }
        }
        if (toprevious.length > 0) {
            for (var i = 0; i < toprevious.length; i++) {
                if (!toprevious[i].amm_gotoLevelClickFn) {
                    toprevious[i].amm_gotoLevelClickFn = amm_gotoLevel(false, overflowHiddenCls, activeCls, 'click');
                }
                amm_eventScheduler(true, toprevious[i], 'click', toprevious[i].amm_gotoLevelClickFn);
            }
        }
        var l0nav = core.l0nav || [];
        var l0navLength = l0nav.length;
        for (var i = 0; i < l0navLength; i++) {
            var l0anchor = l0nav[i].l0anchor;
            var l0panel = l0nav[i].l0panel;
            var l0navelement = l0nav[i].navelement;
            var l1nav = l0nav[i].l1nav || [];
            var l1navLength = l1nav.length;
            if (!l0anchor.amm_l0ClickFn) {
                l0anchor.amm_l0ClickFn = amm_l0ClickFn(l0anchor, l0panel, core.rootElem, core.mainElem, overflowHiddenCls, activeCls, 'click');
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
                    l0panel.amm_panelClickFn = amm_subnav_out(overflowHiddenCls, activeCls, 'click');
                }
                amm_eventScheduler(true, l0panel, 'click', l0panel.amm_panelClickFn);
                if (hoverprops.actOnHover) {
                    if (!l0panel.amm_panelMouseoverFn) {
                        l0panel.amm_panelMouseoverFn = amm_subnav_out(overflowHiddenCls, activeCls, 'mouseover');
                    }
                    amm_eventScheduler(true, l0panel, 'mouseover', l0panel.amm_panelMouseoverFn);
                }
            }
            for (var j = 0; j < l1navLength; j++) {
                var l1anchor = l1nav[j].l1anchor;
                var l1panel = l1nav[j].l1panel;
                var l2nav = l1nav[j].l2nav || [];
                var l2navLength = l2nav.length;
                if (!l1anchor.amm_l1ClickFn) {
                    l1anchor.amm_l1ClickFn = amm_l1ClickFn(l1anchor, l1panel, l0navelement, overflowHiddenCls, activeCls, 'click');
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
                for (var k = 0; k < l2navLength; k++) {
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
            document.amm_docClickFn = amm_document_out(overflowHiddenCls, activeCls, 'click');
        }
        amm_eventScheduler(true, document, 'click', document.amm_docClickFn);
        if (hoverprops.actOnHover) {
            if (!window.amm_docMouseoverFn) {
                window.amm_docMouseoverFn = amm_document_out(overflowHiddenCls, activeCls, 'mouseover');
            }
            amm_eventScheduler(true, window, 'mouseover', window.amm_docMouseoverFn);
        }
    };
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
            _AddClass(core.rootElem, settings.rTL_Cls ? settings.rTL_Cls : '');
        }
        if (core.mainElem) {
            core.l0nav = [];
            var l0li = _ArrayCall(core.mainElem.querySelectorAll(':scope > ul > li'));
            var l0liLength = l0li.length;
            for (var i = 0; i < l0liLength; i++) {
                _ToggleUniqueId(l0li[i], settings, i, true);
                var nav0obj = {};
                nav0obj.l0li = l0li[i];
                nav0obj.l0anchor = l0li[i].querySelector(':scope > a');
                _AddClass(nav0obj.l0anchor, settings.l0AnchorCls ? settings.l0AnchorCls : '');
                var l0panel = l0li[i].querySelector(":scope > ." + settings.panelCls);
                if (l0panel) {
                    _AddClass(l0panel, settings.l0PanelCls ? settings.l0PanelCls : '');
                    nav0obj.l0panel = l0panel;
                    nav0obj.l0tomain = l0panel.querySelector("." + settings.mainBtnCls);
                    var l1navelement = l0panel.querySelector(':scope > nav');
                    if (l1navelement) {
                        nav0obj.navelement = l1navelement;
                        var l1cols = _ArrayCall(l1navelement.querySelectorAll(":scope > ." + settings.colCls));
                        nav0obj.l1cols = l1cols.length;
                        nav0obj.l1nav = [];
                        if (l1cols.length > 0) {
                            var shiftnum = (settings.supportedCols || 0) - l1cols.length;
                            var l1li = _ArrayCall(l1navelement.querySelectorAll(":scope > ." + settings.colCls + " > ul > li"));
                            var colnum = parseInt((settings.supportedCols || 0) + '');
                            var l1colsLength = l1cols.length;
                            var l1liLength = l1li.length;
                            for (var j = 0; j < l1colsLength; j++) {
                                _AddClass(l1cols[j], settings.colCls + "-" + (colnum > 0 ? colnum : 2));
                                if (j === colnum - 1 && j > 1) {
                                    _AddClass(l1cols[j], settings.lastcolCls ? settings.lastcolCls : '');
                                }
                            }
                            for (var j = 0; j < l1liLength; j++) {
                                _ToggleUniqueId(l1li[j], settings, j, true);
                                var nav1obj = {};
                                nav1obj.l1li = l1li[j];
                                nav1obj.l1anchor = l1li[j].querySelector(':scope > a');
                                _AddClass(nav1obj.l1anchor, settings.l1AnchorCls ? settings.l1AnchorCls : '');
                                var l1panel = l1li[j].querySelector(":scope > ." + settings.panelCls);
                                if (l1panel) {
                                    _AddClass(l1panel, settings.l1PanelCls ? settings.l1PanelCls : '');
                                    nav1obj.l1panel = l1panel;
                                    nav1obj.l1toback = l1panel.querySelector("." + settings.backBtnCls);
                                    var l2navelement = l1panel.querySelector(':scope > nav');
                                    if (l2navelement) {
                                        nav1obj.navelement = l2navelement;
                                        var l2cols = _ArrayCall(l2navelement.querySelectorAll(":scope > ." + settings.colCls));
                                        if (l2cols.length) {
                                            if (settings.shiftColumns) {
                                                _AddClass(l1navelement, (settings.colShiftCls ? settings.colShiftCls : '') + "-" + shiftnum);
                                            }
                                            _AddClass(l1panel, (settings.colWidthCls ? settings.colWidthCls : '') + "-" + shiftnum);
                                            var l2a = _ArrayCall(l2navelement.querySelectorAll(":scope > ." + settings.colCls + " > ul > li > a"));
                                            var l2aLength = l2a.length;
                                            var l2colsLength = l2cols.length;
                                            for (var k = 0; k < l2aLength; k++) {
                                                _AddClass(l2a[k], settings.l2AnchorCls ? settings.l2AnchorCls : '');
                                            }
                                            for (var k = 0; k < l2colsLength; k++) {
                                                _AddClass(l2cols[k], (settings.colCls ? settings.colCls : '') + "-1");
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
            + settings.rTL_Cls + ' '
            + settings.overflowHiddenCls;
        _RemoveClass(rootElem, cls);
        var allElemsLength = allElems.length;
        var _EventListLength = _EventList.length;
        for (var i = 0; i < allElemsLength; i++) {
            _RemoveClass(allElems[i], cls);
            _ToggleUniqueId(allElems[i], settings, i, false);
            for (var j = 0; j < _EventListLength; j++) {
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
                var rootsLen = roots.length;
                var instancelen = _this.instances.length;
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