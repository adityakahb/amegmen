"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var AMegMen;
(function (AMegMen) {
    // interface IRoot {
    //   [key: string]: any;
    // }
    var _this = this;
    /*
     * Easing Functions - inspired from http://gizma.com/easing/
     * only considering the t value for the range [0, 1] => [0, 1]
     */
    var cEasingFunctions = {
        // no easing, no acceleration
        linear: function (t) { return t; },
        // accelerating from zero velocity
        easeInQuad: function (t) { return t * t; },
        // decelerating to zero velocity
        easeOutQuad: function (t) { return t * (2 - t); },
        // acceleration until halfway, then deceleration
        easeInOutQuad: function (t) { return (t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t); },
        // accelerating from zero velocity
        easeInCubic: function (t) { return t * t * t; },
        // decelerating to zero velocity
        easeOutCubic: function (t) { return --t * t * t + 1; },
        // acceleration until halfway, then deceleration
        easeInOutCubic: function (t) {
            return t < 0.5 ? 4 * t * t * t : (t - 1) * (2 * t - 2) * (2 * t - 2) + 1;
        },
        // accelerating from zero velocity
        easeInQuart: function (t) { return t * t * t * t; },
        // decelerating to zero velocity
        easeOutQuart: function (t) { return 1 - --t * t * t * t; },
        // acceleration until halfway, then deceleration
        easeInOutQuart: function (t) {
            return t < 0.5 ? 8 * t * t * t * t : 1 - 8 * --t * t * t * t;
        },
        // accelerating from zero velocity
        easeInQuint: function (t) { return t * t * t * t * t; },
        // decelerating to zero velocity
        easeOutQuint: function (t) { return 1 + --t * t * t * t * t; },
        // acceleration until halfway, then deceleration
        easeInOutQuint: function (t) {
            return t < 0.5 ? 16 * t * t * t * t * t : 1 + 16 * --t * t * t * t * t;
        }
    };
    // const cDevices: IDevice[] = [
    //   {
    //     bp: 0,
    //     ly: `xsmall`
    //   },
    //   {
    //     bp: 320,
    //     ly: `small`
    //   },
    //   {
    //     bp: 700,
    //     ly: `medium`
    //   },
    //   {
    //     bp: 1200,
    //     ly: `large`
    //   }
    // ];
    var cAnimationEffects = ["slide", "fade"];
    var cRootSelectorTypeError = "Element(s) with the provided query do(es) not exist";
    var cOptionsParseTypeError = "Unable to parse the options string";
    var cDuplicateBreakpointsTypeError = "Duplicate breakpoints found";
    var cBreakpointsParseTypeError = "Error parsing breakpoints";
    var cNoEffectFoundError = "Animation effect function not found in presets. Try using one from (".concat(cAnimationEffects.join(", "), "). Setting the animation effect to ").concat(cAnimationEffects[0], ".");
    var cNoEasingFoundError = "Easing function not found in presets. Try using one from [".concat(Object.keys(cEasingFunctions).join(", "), "]. Setting the easing function to ").concat(Object.keys(cEasingFunctions)[0], ".");
    var cUseCapture = false;
    var cSelectors = {
        main: "[data-amegmen-main]",
        mask: "[data-amegmen-mask]",
        nav: "[data-amegmen-nav]",
        root: "[data-amegmen]",
        rootAuto: "[data-amegmen-auto]",
        rtl: "[data-amegmen-rtl]",
        toggle: "[data-amegmen-toggle]"
    };
    var cDefaults = {
        activeClass: "__amegmen-active",
        actOnHover: false,
        animationEffect: cAnimationEffects[0],
        animationSpeed: 500,
        breakpoints: [],
        disabledClass: "__amegmen-disabled",
        easingFunction: "linear",
        editModeClass: "__amegmen-editmode",
        hiddenClass: "__amegmen-hidden",
        idPrefix: "__amegmen",
        isRtl: false,
        l1Cols: 3,
        layout: 'mobile',
        touchThreshold: 125
    };
    var allLocalInstances = {};
    var iloop = 0;
    var jloop = 0;
    var windowResizeAny;
    var isWindowEventAttached = false;
    var visible = function (element) {
        return ($.expr.filters.visible(element) &&
            !$(element)
                .parents()
                .addBack()
                .filter(function () {
                return $.css(_this, 'visibility') === 'hidden';
            }).length);
    };
    var focusable = function (element) {
        var map;
        var mapName;
        var img;
        var nodeName = element.nodeName.toLowerCase();
        if ('area' === nodeName) {
            map = element.parentNode;
            mapName = map.name;
            if (!element.href || !mapName || map.nodeName.toLowerCase() !== 'map') {
                return false;
            }
            img = $('img[usemap=#' + mapName + ']')[0];
            return !!img && visible(img);
        }
        return ((/input|select|textarea|button|object/.test(nodeName)
            ? !element.disabled
            : 'a' === nodeName
                ? element.href || isTabIndexNotNaN
                : isTabIndexNotNaN) &&
            // the element and all of its ancestors must be visible
            visible(element));
    };
    /**
     * Function to trim whitespaces from a string
     *
     * @param str - The string which needs to be trimmed
     *
     * @returns The trimmed string.
     *
     */
    var stringTrim = function (str) {
        return str.replace(/^\s+|\s+$|\s+(?=\s)/g, "");
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
    var hasClass = function (element, cls) {
        if (typeof (element === null || element === void 0 ? void 0 : element.className) === "string") {
            var clsarr = element.className.split(" ");
            return clsarr.indexOf(cls) > -1 ? true : false;
        }
        return false;
    };
    /**
     * Function to add a string to an element`s class attribute
     *
     * @param element - An HTML Element
     * @param cls - A string
     *
     */
    var addClass = function (element, cls) {
        if (typeof (element === null || element === void 0 ? void 0 : element.className) === "string") {
            var clsarr = cls.split(" ");
            var clsarrLength = clsarr.length;
            for (iloop = 0; iloop < clsarrLength; iloop++) {
                var thiscls = clsarr[iloop];
                if (!hasClass(element, thiscls)) {
                    element.className += " " + thiscls;
                }
            }
            element.className = stringTrim(element.className);
        }
    };
    /**
     * Function to remove a string from an element`s class attribute
     *
     * @param element - An HTML Element
     * @param cls - A string
     *
     */
    var removeClass = function (element, cls) {
        if (typeof (element === null || element === void 0 ? void 0 : element.className) === "string") {
            var clsarr = cls.split(" ");
            var curclass = element.className.split(" ");
            var curclassLen = curclass.length;
            for (iloop = 0; iloop < curclassLen; iloop++) {
                var thiscls = curclass[iloop];
                if (clsarr.indexOf(thiscls) > -1) {
                    curclass.splice(iloop, 1);
                    iloop--;
                }
            }
            element.className = stringTrim(curclass.join(" "));
        }
    };
    /**
     * Function to fix the decimal places to 4
     *
     * @param num - A number
     *
     * @returns A string converted by applying toFixed function with decimal places 4
     *
     */
    var toFixed4 = function (num) {
        return parseFloat(num.toFixed(4));
    };
    /**
     * Function to apply the settings to all the instances w.r.t. applicable breakpoint
     *
     */
    var winResizeFn = function () {
        if (typeof windowResizeAny !== "undefined") {
            clearTimeout(windowResizeAny);
        }
        windowResizeAny = setTimeout(function () {
            for (var e in allLocalInstances) {
                if (allLocalInstances.hasOwnProperty(e)) {
                    applyLayout(allLocalInstances[e]);
                }
            }
        }, 0);
    };
    /**
     * Function to return the number of Instances created
     *
     */
    var getCoreInstancesLength = function () {
        return Object.keys(allLocalInstances).length;
    };
    /**
     * Function to remove all local events assigned to the navigation elements.
     *
     * @param core - Carouzel instance core object
     * @param element - An HTML Element from which the events need to be removed
     *
     */
    var removeEventListeners = function (core, element) {
        var j = core.eH.length;
        while (j--) {
            if (core.eH[j].element.isEqualNode &&
                core.eH[j].element.isEqualNode(element)) {
                core.eH[j].remove();
                core.eH.splice(j, 1);
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
    var eventHandler = function (element, type, listener) {
        removeEventListeners;
        var eventHandlerObj = {
            element: element,
            remove: function () {
                element.removeEventListener(type, listener, cUseCapture);
            }
        };
        element.addEventListener(type, listener, cUseCapture);
        return eventHandlerObj;
    };
    /**
     * Function to find and apply the appropriate breakpoint settings based on the viewport
     *
     * @param core - Carouzel instance core object
     *
     */
    var applyLayout = function (core) {
        var _a;
        var viewportWidth = window === null || window === void 0 ? void 0 : window.innerWidth;
        var bpoptions = core.bpall[0];
        var len = 0;
        while (len < core.bpall.length) {
            if ((core.bpall[len + 1] && core.bpall[len + 1].bp > viewportWidth) ||
                typeof core.bpall[len + 1] === "undefined") {
                bpoptions = core.bpall[len];
                break;
            }
            len++;
        }
        if ((core.bpoOld || {}).bp !== bpoptions.bp) {
            core.bpo = bpoptions;
            core.bpoOld = bpoptions;
            (_a = core.root) === null || _a === void 0 ? void 0 : _a.setAttribute("data-amegmen-viewport", bpoptions.ly);
        }
    };
    /**
     * Function to validate all breakpoints to check duplicates
     *
     * @param breakpoints - Breakpoint settings array
     *
     */
    var validateBreakpoints = function (breakpoints) {
        try {
            var tempArr = [];
            var len = breakpoints.length;
            while (len--) {
                if (tempArr.indexOf(breakpoints[len].bp) === -1) {
                    tempArr.push(breakpoints[len].bp);
                }
            }
            if (tempArr.length === breakpoints.length) {
                return {
                    val: true,
                    bp: breakpoints.sort(function (a, b) { return parseFloat("".concat(a.bp)) - parseFloat("".concat(b.bp)); })
                };
            }
            else {
                // throw new TypeError(cDuplicateBreakpointsTypeError);
                console.error(cDuplicateBreakpointsTypeError);
                return {};
            }
        }
        catch (e) {
            // throw new TypeError(cBreakpointsParseTypeError);
            console.error(cBreakpointsParseTypeError);
            return {};
        }
    };
    /**
     * Function to update breakpoints to override missing settings from previous breakpoint
     *
     * @param settings - Core settings object containing merge of default and custom settings
     *
     */
    var updateBreakpoints = function (settings) {
        var defaultBreakpoint = {
            hov: settings.hov,
            ly: settings.ly,
            bp: 0
        };
        var tempArr = [];
        if (settings.res && settings.res.length > 0) {
            var settingsLen = settings.res.length;
            while (settingsLen--) {
                tempArr.push(settings.res[settingsLen]);
            }
        }
        tempArr.push(defaultBreakpoint);
        var updatedArr = validateBreakpoints(tempArr);
        if (updatedArr.val) {
            var bpArr = [updatedArr.bp[0]];
            var bpLen = 1;
            var bp1 = void 0;
            var bp2 = void 0;
            while (bpLen < updatedArr.bp.length) {
                bp1 = bpArr[bpLen - 1];
                bp2 = __assign(__assign({}, bp1), updatedArr.bp[bpLen]);
                if (typeof bp2.hov === "undefined") {
                    bp2.hov = bp1.hov;
                }
                if (typeof bp2.ly === "undefined") {
                    bp2.ly = bp1.ly;
                }
                bpArr.push(bp2);
                bpLen++;
            }
            return bpArr;
        }
        return [];
    };
    /**
     * Function to map default and custom settings to Core settings with shorter names
     *
     * @param settings - Settings object containing merge of default and custom settings
     *
     */
    var mapSettings = function (settings) {
        var settingsobj = {
            activeCls: settings.activeClass,
            aFn: settings.afterInitFn,
            bFn: settings.beforeInitFn,
            disableCls: settings.disabledClass,
            editCls: settings.editModeClass,
            hidCls: settings.hiddenClass,
            hov: settings.actOnHover,
            l1c: settings.l1Cols,
            ly: settings.layout,
            res: [],
            rtl: settings.isRtl,
            speed: settings.animationSpeed,
            threshold: settings.touchThreshold,
            effect: (function () {
                if (cAnimationEffects.indexOf(settings.animationEffect) > -1) {
                    return settings.animationEffect;
                }
                console.warn(cNoEffectFoundError);
                return cAnimationEffects[0];
            })(),
            easeFn: (function () {
                if (cEasingFunctions[settings.easingFunction]) {
                    return settings.easingFunction;
                }
                console.warn(cNoEasingFoundError);
                return Object.keys(cEasingFunctions)[0];
            })()
        };
        if (settings.breakpoints && settings.breakpoints.length > 0) {
            for (var i = 0; i < settings.breakpoints.length; i++) {
                var obj = {
                    bp: settings.breakpoints[i].minWidth,
                    hov: settings.breakpoints[i].actOnHover,
                    ly: settings.breakpoints[i].layout
                };
                if (settingsobj.res) {
                    settingsobj.res.push(obj);
                }
            }
        }
        return settingsobj;
    };
    var gatherElements = function (core) {
        var _a, _b, _c, _d;
        core.main = (_a = core.root) === null || _a === void 0 ? void 0 : _a.querySelector(cSelectors.main);
        core.mask = (_b = core.root) === null || _b === void 0 ? void 0 : _b.querySelector(cSelectors.mask);
        core.nav = (_c = core.root) === null || _c === void 0 ? void 0 : _c.querySelector(cSelectors.nav);
        core.toggle = (_d = core.root) === null || _d === void 0 ? void 0 : _d.querySelector(cSelectors.toggle);
    };
    var addEvents = function (core) {
        if (core.toggle) {
            core.eH.push(eventHandler(core.toggle, "click", function () {
                if (core.mask && core.main && core.toggle) {
                    hasClass(core.toggle, 'active')
                        ? removeClass(core.toggle, 'active')
                        : addClass(core.toggle, 'active');
                    hasClass(core.mask, 'active')
                        ? removeClass(core.mask, 'active')
                        : addClass(core.mask, 'active');
                    hasClass(core.main, 'active')
                        ? removeClass(core.main, 'active')
                        : addClass(core.main, 'active');
                }
            }));
        }
    };
    /**
     * Function to initialize the carouzel core object and assign respective events
     *
     * @param root - The root element which needs to be initialized as Carouzel slider
     * @param settings - The options applicable to the same Carouzel slider
     *
     */
    var init = function (root, settings) {
        if (typeof settings.beforeInitFn === "function") {
            settings.beforeInitFn();
        }
        var cCore = {};
        cCore.root = root;
        cCore.o = mapSettings(settings);
        cCore.bpall = updateBreakpoints(cCore.o);
        cCore.eH = [];
        if (cCore.bpall.length > 0) {
            gatherElements(cCore);
            addEvents(cCore);
            applyLayout(cCore);
        }
        return cCore;
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
        /**
         * Constructor
         * @constructor
         */
        function Core(thisid, root, options) {
            allLocalInstances[thisid] = init(root, __assign(__assign({}, cDefaults), options));
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
        function Root() {
            var _this = this;
            /**
             * Function to initialize the amegmen plugin for provided query strings.
             *
             * @param query - The CSS selector for which the amegmen needs to be initialized.
             * @param options - The optional object to customize every amegmen instance.
             *
             */
            this.init = function (query, options) {
                addClass;
                removeClass;
                toFixed4;
                var elements = document === null || document === void 0 ? void 0 : document.querySelectorAll(query);
                var elementsLength = elements.length;
                var instanceLength = getCoreInstancesLength();
                if (elementsLength > 0) {
                    for (iloop = 0; iloop < elementsLength; iloop++) {
                        var id = elements[iloop].getAttribute("id");
                        var isElementPresent = false;
                        if (id) {
                            for (jloop = 0; jloop < instanceLength; jloop++) {
                                if (allLocalInstances[id]) {
                                    isElementPresent = true;
                                    break;
                                }
                            }
                        }
                        if (!isElementPresent) {
                            var newOptions = void 0;
                            var autoDataAttr = elements[iloop].getAttribute(cSelectors.rootAuto.slice(1, -1)) || "";
                            if (autoDataAttr) {
                                try {
                                    newOptions = JSON.parse(stringTrim(autoDataAttr).replace(/'/g, "\""));
                                }
                                catch (e) {
                                    // throw new TypeError(cOptionsParseTypeError);
                                    console.error(cOptionsParseTypeError);
                                }
                            }
                            else {
                                newOptions = options;
                            }
                            if (id) {
                                new Core(id, elements[iloop], newOptions);
                            }
                            else {
                                var thisid = id
                                    ? id
                                    : __assign(__assign({}, cDefaults), newOptions).idPrefix +
                                        "_" +
                                        new Date().getTime() +
                                        "_root_" +
                                        (iloop + 1);
                                elements[iloop].setAttribute("id", thisid);
                                new Core(thisid, elements[iloop], newOptions);
                            }
                        }
                    }
                    if (window && getCoreInstancesLength() > 0 && !isWindowEventAttached) {
                        isWindowEventAttached = true;
                        window.addEventListener("resize", winResizeFn, false);
                    }
                }
                else {
                    if (query !== cSelectors.rootAuto) {
                        // throw new TypeError(cRootSelectorTypeError);
                        console.error("init() \"".concat(query, "\": ").concat(cRootSelectorTypeError));
                    }
                }
            };
            /**
             * Function to auto-initialize the amegmen plugin for specific amegmens
             */
            this.initGlobal = function () {
                _this.init(cSelectors.rootAuto, {});
            };
            this.destroy = function (query) {
                query;
            };
        }
        /**
         * Function to return single instance
         *
         * @returns Single amegmen Instance
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
AMegMen.Root.getInstance().initGlobal();
if (typeof exports === "object" && typeof module !== "undefined") {
    module.exports = AMegMen;
}

//# sourceMappingURL=amegmen.js.map
