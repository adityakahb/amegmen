"use strict";
(function (window, document) {
    var AMegMen_Trim = function (str) {
        return str.replace(/^\s+|\s+$/g, '');
    };
    var AMegMen_QSQSAScope = function () {
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
        var clsarr = element.className.split(' ');
        return clsarr.indexOf(cls) > -1 ? true : false;
    };
    var AMegMen_AddClass = function (element, cls) {
        var clsarr = cls.split(' ');
        for (var i = 0; i < clsarr.length; i++) {
            if (!AMegMen_HasClass(element, clsarr[i])) {
                element.className += ' ' + clsarr[i];
            }
        }
        element.className = AMegMen_Trim(element.className);
    };
    var AMegMen_RemoveClass = function (element, cls) {
        var clsarr = cls.split(' ');
        var curclass = element.className.split(' ');
        for (var i = 0; i < curclass.length; i++) {
            if (clsarr.indexOf(curclass[i]) > -1) {
                curclass.splice(i, 1);
                i--;
            }
        }
        element.className = AMegMen_Trim(curclass.join(' '));
    };
    var AMegMen = function (elemid, options) {
        var _this = this;
        var anchorpreventclick = function (event) {
            var anchor = event.target;
            if (anchor && AMegMen_HasClass(anchor, 'has-subnav0')) {
                event.preventDefault();
            }
        };
        var ltopclick = function (event) {
            var target = event.target;
            var closest = AMegMen_Closest(target, '.__amegmen--nav-li');
            if (!closest) {
                l0mouseleave();
                l1mouseleave();
                toggleL0Hover(false);
                toggleL1Hover(false);
                _this.isl0open = false;
            }
        };
        var l0close = function (event) {
            var target = event.target;
            var closest = AMegMen_Closest(target, '#' + _this.elemid);
            if (!closest) {
                l0mouseleave();
                l1mouseleave();
                toggleL0Hover(false);
                toggleL1Hover(false);
                _this.isl0open = false;
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
        var toggleL0Hover = function (toggle) {
            if (toggle) {
                for (var i = 0; i < _this.l0anchors.length; i++) {
                    _this.l0anchors[i].addEventListener('mouseover', l0mouseover);
                }
            }
            else {
                for (var i = 0; i < _this.l0anchors.length; i++) {
                    _this.l0anchors[i].removeEventListener('mouseover', l0mouseover);
                }
            }
        };
        var openL0Subnav = function (event, eventtype, isl0open) {
            l0mouseleave();
            l1mouseleave();
            var l0anchor = event.target;
            if (l0anchor) {
                AMegMen_AddClass(l0anchor, isl0open ? 'active' : '');
                var parentli0 = AMegMen_Closest(l0anchor, 'li');
                if (parentli0) {
                    var subnav0 = parentli0.querySelector(':scope > section');
                    if (subnav0) {
                        AMegMen_AddClass(l0anchor, 'has-subnav0');
                        AMegMen_AddClass(subnav0, isl0open ? 'active' : '');
                        if (eventtype === 'click') {
                            event.preventDefault();
                        }
                        else {
                            if (l0anchor.getAttribute('data-amegmenevent') !== 'true') {
                                l0anchor.addEventListener('click', anchorpreventclick);
                                l0anchor.setAttribute('data-amegmenevent', 'true');
                            }
                        }
                    }
                }
            }
        };
        var l0click = function (event) {
            _this.isl0open = !_this.isl0open;
            openL0Subnav(event, 'click', _this.isl0open);
            toggleL0Hover(_this.isl0open);
        };
        var l0mouseover = function (event) {
            openL0Subnav(event, 'mouseover', true);
        };
        var openL1Subnav = function (event, eventtype, isl1open) {
            l1mouseleave();
            var l1anchor = event.target;
            if (l1anchor) {
                AMegMen_AddClass(l1anchor, isl1open ? 'active' : '');
                var parentli1 = AMegMen_Closest(l1anchor, 'li');
                if (parentli1) {
                    var subnav1 = parentli1.querySelector(':scope > section');
                    if (subnav1) {
                        AMegMen_AddClass(l1anchor, 'has-subnav1');
                        AMegMen_AddClass(subnav1, isl1open ? 'active' : '');
                        if (eventtype === 'click') {
                            event.preventDefault();
                        }
                        else {
                            if (l1anchor.getAttribute('data-amegmenevent') !== 'true') {
                                l1anchor.addEventListener('click', anchorpreventclick);
                                l1anchor.setAttribute('data-amegmenevent', 'true');
                            }
                        }
                    }
                }
            }
        };
        var l1mouseleave = function (event) {
            var anchorl1 = AMegMen_ArrayCall(_this.elem.querySelectorAll('.__amegmen--nav-l1'));
            for (var i = 0; i < anchorl1.length; i++) {
                AMegMen_RemoveClass(anchorl1[i], 'active');
            }
            var subnav2 = AMegMen_ArrayCall(_this.elem.querySelectorAll('.__amegmen--subnav-l1'));
            for (var i = 0; i < subnav2.length; i++) {
                AMegMen_RemoveClass(subnav2[i], 'active');
            }
        };
        var toggleL1Hover = function (toggle) {
            if (toggle) {
                for (var i = 0; i < _this.l1anchors.length; i++) {
                    _this.l1anchors[i].addEventListener('mouseover', l1mouseover);
                }
            }
            else {
                for (var i = 0; i < _this.l1anchors.length; i++) {
                    _this.l1anchors[i].removeEventListener('mouseover', l1mouseover);
                }
            }
        };
        var l1click = function (event) {
            _this.isl1open = !_this.isl1open;
            openL1Subnav(event, 'click', _this.isl1open);
            toggleL1Hover(_this.isl1open);
        };
        var l1mouseover = function (event) {
            openL1Subnav(event, 'mouseover', true);
        };
        var initiateSubnav1 = function (subnav1) {
            var subnav1cols = AMegMen_ArrayCall(subnav1.querySelectorAll(':scope > .__c--amegmen-col'));
            var subnav2 = AMegMen_ArrayCall(subnav1.querySelectorAll('section'));
            var l1anchors = AMegMen_ArrayCall(subnav1.querySelectorAll(':scope > .__c--amegmen-col > .__c--amegmen-col-spacer > ul > li > a'));
            for (var i = 0; i < subnav1cols.length; i++) {
                AMegMen_AddClass(subnav1cols[i], '__c--a-col-' + subnav1cols.length);
                subnav1cols[i].addEventListener('mouseleave', l1mouseleave);
            }
            if (subnav2.length > 0) {
                AMegMen_AddClass(subnav1, '__c--a-shift-' + (5 - subnav1cols.length));
                for (var i = 0; i < subnav2.length; i++) {
                    AMegMen_AddClass(subnav2[i], '__amegmen--subnav-l1 __c--a-width-' + (5 - subnav1cols.length));
                }
                for (var i = 0; i < l1anchors.length; i++) {
                    AMegMen_AddClass(l1anchors[i], '__amegmen--nav-l1');
                    _this.l1anchors.push(l1anchors[i]);
                    l1anchors[i].addEventListener('click', l1click);
                    // (l1anchors[i] as HTMLElement).addEventListener('mouseover', l1mouseover);
                    var parentl1li = AMegMen_Closest(l1anchors[i], 'li');
                    if (parentl1li) {
                        var l2cols = AMegMen_ArrayCall(parentl1li.querySelectorAll(':scope > section .__c--amegmen-col'));
                        var l2anchors = AMegMen_ArrayCall(parentl1li.querySelectorAll(':scope > section .__c--amegmen-col > .__c--amegmen-col-spacer > ul > li > a'));
                        for (var j = 0; j < l2cols.length; j++) {
                            AMegMen_AddClass(l2cols[j], '__c--a-col-' + l2cols.length);
                        }
                        for (var j = 0; j < l2anchors.length; j++) {
                            AMegMen_AddClass(l2anchors[j], '__amegmen--nav-l2');
                        }
                    }
                }
            }
        };
        this.elemid = elemid;
        this.elem = document.getElementById(elemid);
        var init = function () {
            _this.isl0open = false;
            _this.isl1open = false;
            var l0sections = _this.elem.querySelectorAll(':scope > ul > li > section');
            var l0Li = _this.elem.querySelectorAll(':scope > ul > li');
            _this.l0sections = AMegMen_ArrayCall(l0sections);
            var l0anchors = _this.elem.querySelectorAll(':scope > ul > li > a');
            _this.l0anchors = AMegMen_ArrayCall(l0anchors);
            _this.l1anchors = [];
            document.addEventListener('click', l0close);
            _this.elem.addEventListener('click', ltopclick);
            // (this.elem as HTMLElement).addEventListener('mouseleave', l0mouseleave);
            for (var i = 0; i < _this.l0sections.length; i++) {
                AMegMen_AddClass(_this.l0sections[i], '__amegmen--subnav-l0');
                var subnav1 = _this.l0sections[i].querySelector(':scope > nav');
                if (subnav1) {
                    initiateSubnav1(subnav1);
                }
            }
            for (var i = 0; i < l0Li.length; i++) {
                AMegMen_AddClass(l0Li[i], '__amegmen--nav-li');
            }
            for (var i = 0; i < _this.l0anchors.length; i++) {
                AMegMen_AddClass(_this.l0anchors[i], '__amegmen--nav-l0');
                // (this.l0anchors[i] as HTMLElement).addEventListener('mouseover', l0mouseover);
                _this.l0anchors[i].addEventListener('click', l0click);
            }
        };
        if (this.elem) {
            init();
        }
    };
    AMegMen_QSQSAScope();
    window.AMegMen = AMegMen;
}(window, document));
