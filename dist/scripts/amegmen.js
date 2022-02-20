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
        // elastic bounce effect at the beginning
        // easeInElastic: (t: number) => (0.04 - 0.04 / t) * Math.sin(25 * t) + 1,
        // elastic bounce effect at the end
        // easeOutElastic: (t: number) => ((0.04 * t) / --t) * Math.sin(25 * t),
        // elastic bounce effect at the beginning and end
        // easeInOutElastic: (t: number) =>
        //   (t -= 0.5) < 0
        //     ? (0.02 + 0.01 / t) * Math.sin(50 * t)
        //     : (0.02 - 0.01 / t) * Math.sin(50 * t) + 1,
    };
    var cAnimationEffects = ["slide", "fade"];
    var cRootSelectorTypeError = "Element(s) with the provided query do(es) not exist";
    var cOptionsParseTypeError = "Unable to parse the options string";
    var cDuplicateBreakpointsTypeError = "Duplicate breakpoints found";
    var cBreakpointsParseTypeError = "Error parsing breakpoints";
    var cNoEffectFoundError = "Animation effect function not found in presets. Try using one from (".concat(cAnimationEffects.join(", "), "). Setting the animation effect to ").concat(cAnimationEffects[0], ".");
    var cNoEasingFoundError = "Easing function not found in presets. Try using one from [".concat(Object.keys(cEasingFunctions).join(", "), "]. Setting the easing function to ").concat(Object.keys(cEasingFunctions)[0], ".");
    var cUseCapture = false;
    var cSelectors = {
        arrowN: "[data-amegmen-nextarrow]",
        arrowP: "[data-amegmen-previousarrow]",
        cntr: "[data-amegmen-centered]",
        ctrlW: "[data-amegmen-ctrlWrapper]",
        curp: "[data-amegmen-currentpage]",
        dot: "[data-amegmen-dot]",
        nav: "[data-amegmen-navigation]",
        navW: "[data-amegmen-navigationwrapper]",
        pauseBtn: "[data-amegmen-pause]",
        playBtn: "[data-amegmen-play]",
        root: "[data-amegmen]",
        rootAuto: "[data-amegmen-auto]",
        rtl: "[data-amegmen-rtl]",
        scbar: "[data-amegmen-hasscrollbar]",
        scbarB: "[data-amegmen-scrollbarthumb]",
        scbarT: "[data-amegmen-scrollbartrack]",
        scbarW: "[data-amegmen-scrollbarwrapper]",
        slide: "[data-amegmen-slide]",
        stitle: "[data-amegmen-title]",
        totp: "[data-amegmen-totalpages]",
        trk: "[data-amegmen-track]",
        trkM: "[data-amegmen-trackMask]",
        trkO: "[data-amegmen-trackOuter]",
        trkW: "[data-amegmen-trackWrapper]",
        ver: "[data-amegmen-vertical]"
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
                    // applyLayout(allLocalInstances[e]);
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
            // allLocalInstances[thisid] = init(root, { ...cDefaults, ...options });
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
                query;
                options;
                cEasingFunctions;
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
