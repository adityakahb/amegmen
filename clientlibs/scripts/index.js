"use strict";
(function (window, document) {
    var AMegMen_Trim = function (str) {
        return str.replace(/^\s+|\s+$/g, '');
    };
    var AMegMen_Scope = function () {
        try { // check if browser supports :scope natively
            window.document.querySelector(':scope body');
        }
        catch (err) { // polyfill native methods if it doesn't
            var nativ_1 = Element.prototype.querySelector;
            Element.prototype.querySelector = function (selectors) {
                if (/(^|,)\s*:scope/.test(selectors)) { // only if selectors contains :scope
                    var id = this.id; // remember current element id
                    this.id = 'ID_' + Date.now(); // assign new unique id
                    selectors = selectors.replace(/((^|,)\s*):scope/g, '$1#' + this.id); // replace :scope with #ID
                    var result = window.document.querySelector(selectors);
                    this.id = id; // restore previous id
                    return result;
                }
                else {
                    return nativ_1.call(this, selectors); // use native code for other selectors
                }
            };
            nativ_1 = Element.prototype.querySelectorAll;
            Element.prototype.querySelector = function (selectors) {
                if (/(^|,)\s*:scope/.test(selectors)) { // only if selectors contains :scope
                    var id = this.id; // remember current element id
                    this.id = 'ID_' + Date.now(); // assign new unique id
                    selectors = selectors.replace(/((^|,)\s*):scope/g, '$1#' + this.id); // replace :scope with #ID
                    var result = window.document.querySelectorAll(selectors);
                    this.id = id; // restore previous id
                    return result;
                }
                else {
                    return nativ_1.call(this, selectors); // use native code for other selectors
                }
            };
        }
    };
    var AMegMen_Closest = function (element, selector) {
        if (!Element.prototype.matches) {
            Element.prototype.matches =
                Element.prototype.msMatchesSelector ||
                    Element.prototype.webkitMatchesSelector;
        }
        if (!Element.prototype.closest) {
            do {
                if (Element.prototype.matches.call(element, selector))
                    return element;
                var parent_1 = element.parentElement || element.parentNode;
                if (parent_1) {
                    element = parent_1;
                }
            } while (element !== null && element.nodeType === 1);
            return null;
        }
        else {
            return element.closest(selector);
        }
    };
    var AMegMen_ArrayCall = function (arr) {
        try {
            return Array.prototype.slice.call(arr || []);
        }
        catch (e) {
            return [];
        }
    };
    var AMegMen_HasClass = function (element, cls) {
        var classname = element.className;
        var patt = new RegExp((cls || '').toLowerCase(), 'gi');
        return patt.test(classname);
    };
    var AMegMen_AddClass = function (element, cls) {
        if (!AMegMen_HasClass(element, cls)) {
            element.className += ' ' + cls;
            element.className = AMegMen_Trim(element.className);
        }
    };
    var AMegMen_RemoveClass = function (element, cls) {
        if (AMegMen_HasClass(element, cls)) {
            var curclass = element.className;
            curclass = curclass.replace(cls, '');
            element.className = AMegMen_Trim(curclass);
        }
    };
    var AMegMen = function (elemid, options) {
        var _this = this;
        var l0mouseenter = function (event) {
            l0mouseleave();
            var l0anchor = event.target;
            if (l0anchor) {
                var parentli0 = AMegMen_Closest(l0anchor, 'li');
                if (parentli0) {
                    var subnav0 = parentli0.querySelector('section');
                    if (subnav0) {
                        AMegMen_AddClass(l0anchor, 'active');
                        AMegMen_AddClass(subnav0, 'active');
                    }
                }
            }
        };
        var l0mouseleave = function (event) {
            for (var l0 = 0; l0 < _this.l0sections.length; l0++) {
                AMegMen_RemoveClass(_this.l0sections[l0], 'active');
            }
            for (var l0 = 0; l0 < _this.l0anchors.length; l0++) {
                AMegMen_RemoveClass(_this.l0anchors[l0], 'active');
            }
        };
        this.elem = document.getElementById(elemid);
        var init = function () {
            var l0sections = _this.elem.querySelectorAll(':scope > ul > li > section');
            _this.l0sections = AMegMen_ArrayCall(l0sections);
            var l0anchors = _this.elem.querySelectorAll(':scope > ul > li > a'); // document.querySelectorAll('#' + elemid + ' > ul > li > a');
            _this.l0anchors = AMegMen_ArrayCall(l0anchors);
            _this.elem.addEventListener('mouseleave', l0mouseleave);
            for (var l0 = 0; l0 < _this.l0sections.length; l0++) {
                AMegMen_AddClass(_this.l0sections[l0], 'amegmen-l0-subnav');
            }
            for (var l0 = 0; l0 < _this.l0anchors.length; l0++) {
                AMegMen_AddClass(_this.l0anchors[l0], 'amegmen-l0-nav');
                _this.l0anchors[l0].addEventListener('mouseover', l0mouseenter);
            }
        };
        if (this.elem) {
            init();
        }
    };
    AMegMen_Scope();
    window.AMegMen = AMegMen;
}(window, document));
