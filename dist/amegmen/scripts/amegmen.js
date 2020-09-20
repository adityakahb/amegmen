"use strict";
var AMegMen;
(function (AMegMen) {
    var AllAMegMenCores = [];
    var active_amegmen = {};
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
        menuClass: '__amegmen',
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
    var _AddUniqueId = function (element, settings, uuid) {
        if (!element.getAttribute('id')) {
            element.setAttribute('id', settings.idPrefix + '_' + new Date().getTime() + '_' + uuid);
        }
    };
    var amm_document_out = function (overflowHiddenClass, activeClass) {
        return function () {
            if (event && _StringTrim(active_amegmen.closestl0li || '').length > 0) {
                var closest = event.target.closest('#' + active_amegmen.closestl0li);
                if (!closest) {
                    amm_subnavclose(true, overflowHiddenClass, activeClass);
                }
            }
        };
    };
    var amm_subnav_out = function (overflowHiddenClass, activeClass) {
        return function () {
            if (event) {
                var closest = event.target.closest('#' + active_amegmen.closestl1li);
                if (!closest) {
                    amm_subnavclose(false, overflowHiddenClass, activeClass);
                }
            }
        };
    };
    var amm_subnavclose = function (closeOnlyTopLevel, overflowHiddenClass, activeClass) {
        for (var i = 0; i < AllAMegMenCores.length; i++) {
            var mainElem = AllAMegMenCores[i].mainElem;
            var l0nav = AllAMegMenCores[i].l0nav || [];
            if (closeOnlyTopLevel) {
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
    };
    var amm_gotoLevel = function (closeOnlyTopLevel, overflowHiddenClass, activeClass) {
        return function () {
            if (event) {
                event.preventDefault();
            }
            amm_subnavclose(closeOnlyTopLevel, overflowHiddenClass, activeClass);
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
    var amm_l0ClickFn = function (l0anchor, l0panel, parent, mainElem, overflowHiddenClass, activeClass) {
        return function () {
            if (event && l0panel) {
                event.preventDefault();
            }
            if (_HasClass(l0anchor, activeClass)) {
                active_amegmen.elem = null;
                active_amegmen.closestl0li = '';
                amm_subnavclose(true, overflowHiddenClass, activeClass);
            }
            else {
                amm_subnavclose(true, overflowHiddenClass, activeClass);
                active_amegmen.elem = parent;
                active_amegmen.closestl0li = l0anchor.closest('li').getAttribute('id');
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
    var amm_l1ClickFn = function (l1anchor, l1panel, l0navelement, overflowHiddenClass, activeClass) {
        return function () {
            if (event && l1panel) {
                event.preventDefault();
            }
            if (_HasClass(l1anchor, activeClass)) {
                active_amegmen.closestl1li = '';
                amm_subnavclose(false, overflowHiddenClass, activeClass);
            }
            else {
                active_amegmen.closestl1li = l1anchor.closest('li').getAttribute('id');
                amm_subnavclose(false, overflowHiddenClass, activeClass);
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
    var amm_toggleevents = function (core, settings, shouldAddEevents) {
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
            var landingElements = _ArrayCall(core.rootelem.querySelectorAll('.' + settings.landingCtaClass + ' > a'));
            for (var i = 0; i < landingElements.length; i++) {
                amm_eventScheduler(shouldAddEevents, landingElements[i], 'mouseenter', amm_landingMouseenterFn(landingElements[i], hoverClass));
                amm_eventScheduler(shouldAddEevents, landingElements[i], 'mouseleave', amm_landingMouseleaveFn(landingElements[i], hoverClass));
                amm_eventScheduler(shouldAddEevents, landingElements[i], 'focus', amm_landingFocusFn(landingElements[i], focusClass));
                amm_eventScheduler(shouldAddEevents, landingElements[i], 'blur', amm_landingBlurFn(landingElements[i], focusClass));
            }
        }
        if (togglenav && offcanvas) {
            amm_eventScheduler(shouldAddEevents, togglenav, 'click', amm_toggleMain(togglenav, offcanvas, activeClass));
        }
        if (closenav && offcanvas) {
            amm_eventScheduler(shouldAddEevents, closenav, 'click', amm_closeMain(togglenav, offcanvas, activeClass));
        }
        if (tomain.length > 0) {
            for (var i = 0; i < tomain.length; i++) {
                amm_eventScheduler(shouldAddEevents, tomain[i], 'click', amm_gotoLevel(true, overflowHiddenClass, activeClass));
            }
        }
        if (toprevious.length > 0) {
            for (var i = 0; i < toprevious.length; i++) {
                amm_eventScheduler(shouldAddEevents, toprevious[i], 'click', amm_gotoLevel(false, overflowHiddenClass, activeClass));
            }
        }
        var l0nav = core.l0nav || [];
        for (var i = 0; i < l0nav.length; i++) {
            var l0anchor = l0nav[i].l0anchor;
            var l0panel = l0nav[i].l0panel;
            var l0navelement = l0nav[i].navelement;
            var l1nav = l0nav[i].l1nav || [];
            amm_eventScheduler(shouldAddEevents, l0anchor, 'click', amm_l0ClickFn(l0anchor, l0panel, core.rootelem, core.mainElem, overflowHiddenClass, activeClass));
            amm_eventScheduler(shouldAddEevents, l0anchor, 'mouseenter', amm_l0MouseenterFn(l0anchor, hoverClass, hoverprops.shouldActOnHover, hoverprops.actOnHoverAt));
            amm_eventScheduler(shouldAddEevents, l0anchor, 'mouseleave', amm_l0MouseleaveFn(l0anchor, hoverClass));
            amm_eventScheduler(shouldAddEevents, l0anchor, 'focus', amm_l0FocusFn(l0anchor, focusClass));
            amm_eventScheduler(shouldAddEevents, l0anchor, 'blur', amm_l0BlurFn(l0anchor, focusClass));
            if (l0panel) {
                amm_eventScheduler(shouldAddEevents, l0panel, 'click', amm_subnav_out(overflowHiddenClass, activeClass));
                if (hoverprops.shouldActOnHover) {
                    amm_eventScheduler(shouldAddEevents, l0panel, 'mouseover', amm_subnav_out(overflowHiddenClass, activeClass));
                }
            }
            for (var j = 0; j < l1nav.length; j++) {
                var l1anchor = l1nav[j].l1anchor;
                var l1panel = l1nav[j].l1panel;
                var l2nav = l1nav[j].l2nav || [];
                amm_eventScheduler(shouldAddEevents, l1anchor, 'click', amm_l1ClickFn(l1anchor, l1panel, l0navelement, overflowHiddenClass, activeClass));
                amm_eventScheduler(shouldAddEevents, l1anchor, 'mouseenter', amm_l1MouseenterFn(l1anchor, hoverClass, hoverprops.shouldActOnHover, hoverprops.actOnHoverAt));
                amm_eventScheduler(shouldAddEevents, l1anchor, 'mouseleave', amm_l1MouseleaveFn(l1anchor, hoverClass));
                amm_eventScheduler(shouldAddEevents, l1anchor, 'focus', amm_l1FocusFn(l1anchor, focusClass));
                amm_eventScheduler(shouldAddEevents, l1anchor, 'blur', amm_l1BlurFn(l1anchor, focusClass));
                for (var k = 0; k < l2nav.length; k++) {
                    var l2anchor = l2nav[k];
                    amm_eventScheduler(shouldAddEevents, l2anchor, 'mouseenter', amm_l2MouseenterFn(l2anchor, hoverClass));
                    amm_eventScheduler(shouldAddEevents, l2anchor, 'mouseleave', amm_l2MouseleaveFn(l2anchor, hoverClass));
                    amm_eventScheduler(shouldAddEevents, l2anchor, 'focus', amm_l2FocusFn(l2anchor, focusClass));
                    amm_eventScheduler(shouldAddEevents, l2anchor, 'blur', amm_l2BlurFn(l2anchor, focusClass));
                }
            }
        }
        amm_eventScheduler(shouldAddEevents, document, 'click', amm_document_out(overflowHiddenClass, activeClass));
        if (hoverprops.shouldActOnHover) {
            amm_eventScheduler(shouldAddEevents, window, 'mouseover', amm_document_out(overflowHiddenClass, activeClass));
        }
    };
    var amm_init = function (core, rootelem, settings) {
        core.rootelem = rootelem;
        core.settings = settings;
        core.mainElem = core.rootelem.querySelector("." + settings.mainElementClass);
        core.togglenav = core.rootelem.querySelector("." + settings.toggleButtonClass);
        core.closenav = core.rootelem.querySelector("." + settings.closeButtonClass);
        core.offcanvas = core.rootelem.querySelector("." + settings.offcanvasclass);
        core.tomain = core.rootelem.querySelectorAll("." + settings.mainButtonClass);
        core.toprevious = core.rootelem.querySelectorAll("." + settings.backButtonClass);
        if (core.settings.isRightToLeft) {
            _AddClass(core.rootelem, settings.rightToLeftClass ? settings.rightToLeftClass : '');
        }
        if (core.mainElem) {
            core.l0nav = [];
            var l0li = _ArrayCall(core.mainElem.querySelectorAll(':scope > ul > li'));
            for (var i = 0; i < l0li.length; i++) {
                _AddUniqueId(l0li[i], settings, i);
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
                                _AddUniqueId(l1li[j], settings, j);
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
        amm_toggleevents(core, settings, true);
        return core;
    };
    var Core = (function () {
        function Core(rootelem, options) {
            this.core = {};
            this.core = amm_init(this.core, rootelem, Object.assign({}, _Defaults, options));
            AllAMegMenCores.push(this.core);
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
                                _this.instances[id] = new Core(roots[i], options);
                            }
                            else {
                                var thisid = id ? id : Object.assign({}, _Defaults, options).idPrefix + '_' + new Date().getTime() + '_root_' + (i + 1);
                                roots[i].setAttribute('id', thisid);
                                _this.instances[thisid] = new Core(roots[i], options);
                            }
                        }
                    }
                }
                else {
                    throw new Error('Element(s) with the provided query do(es) not exist');
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