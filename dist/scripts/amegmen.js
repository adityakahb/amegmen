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
    var _rootSelectorTypeError = "Element(s) with the provided query do(es) not exist";
    var _optionsParseTypeError = "Unable to parse the options string";
    var _useCapture = false;
    var _Selectors = {
        canvas: "[data-amegmen-canvas]",
        cCta: "[data-amegmen-closecta]",
        l0ul: "[data-amegmen-navl0]",
        l1H: "[data-amegmen-navllheader]",
        l1ul: "[data-amegmen-navl1]",
        l1W: "[data-amegmen-navl1wrap]",
        l2H: "[data-amegmen-navl2header]",
        l2ul: "[data-amegmen-navl2]",
        l2W: "[data-amegmen-navl2wrap]",
        l3H: "[data-amegmen-navl3header]",
        l3ul: "[data-amegmen-navl3]",
        l3W: "[data-amegmen-navl3wrap]",
        l4H: "[data-amegmen-navl4header]",
        l4W: "[data-amegmen-navl4wrap]",
        oCta: "[data-amegmen-opencta]",
        root: "[data-amegmen]",
        rootAuto: "[data-amegmen-auto]",
        rtl: "[data-amegmen-rtl]"
    };
    var _Defaults = {
        activeClass: "__amegmen-active",
        actOnHover: false,
        animationSpeed: 500,
        appendUrlHash: false,
        disabledClass: "__amegmen-disabled",
        editModeClass: "__amegmen-editmode",
        hiddenClass: "__amegmen-hidden",
        idPrefix: "__amegmen",
        isRtl: false
    };
    var allLocalInstances = {};
    var isWindowEventAttached = false;
    var windowResizeAny;
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
        if (element && typeof element.className === "string") {
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
        if (element && typeof element.className === "string") {
            var clsarr = cls.split(" ");
            var clsarrLength = clsarr.length;
            for (var i = 0; i < clsarrLength; i++) {
                var thiscls = clsarr[i];
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
        if (element && typeof element.className === "string") {
            var clsarr = cls.split(" ");
            var curclass = element.className.split(" ");
            var curclassLen = curclass.length;
            for (var i = 0; i < curclassLen; i++) {
                var thiscls = curclass[i];
                if (clsarr.indexOf(thiscls) > -1) {
                    curclass.splice(i, 1);
                    i--;
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
        return num.toFixed(4);
    };
    /**
     * Function to apply the settings to all the instances w.r.t. applicable breakpoint
     *
     */
    var winResizeFn = function () {
        if (typeof windowResizeAny !== "undefined") {
            clearTimeout(windowResizeAny);
        }
        windowResizeAny = setTimeout(function () { }, 0);
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
        var j = core.eHandlers.length;
        while (j--) {
            if (core.eHandlers[j].element.isEqualNode &&
                core.eHandlers[j].element.isEqualNode(element)) {
                core.eHandlers[j].remove();
                core.eHandlers.splice(j, 1);
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
        var eventHandler = {
            element: element,
            remove: function () {
                element.removeEventListener(type, listener, _useCapture);
            }
        };
        element.addEventListener(type, listener, _useCapture);
        return eventHandler;
    };
    var openL1 = function (core) {
        core;
    };
    var toggleEvents = function (core) {
        if (core.oCta && core.canvas && core.root) {
            core.eHandlers.push(eventHandler(core.oCta, "click", function (event) {
                event.preventDefault();
                if (hasClass(core.oCta, core.opts.activeCls)) {
                    removeClass(core.root, core.opts.activeCls);
                    removeClass(core.canvas, core.opts.activeCls);
                    removeClass(core.oCta, core.opts.activeCls);
                }
                else {
                    addClass(core.root, core.opts.activeCls);
                    addClass(core.canvas, core.opts.activeCls);
                    addClass(core.oCta, core.opts.activeCls);
                }
            }));
        }
        if (core.cCta && core.canvas && core.root) {
            core.eHandlers.push(eventHandler(core.cCta, "click", function (event) {
                event.preventDefault();
                removeClass(core.root, core.opts.activeCls);
                removeClass(core.canvas, core.opts.activeCls);
                removeClass(core.oCta, core.opts.activeCls);
            }));
        }
        for (var i = 0; i < core.l0a.length; i++) {
            var parent_1 = core.l0a[i].closest('li');
            if (parent_1 && parent_1.querySelector(_Selectors.l1W)) {
                core.eHandlers.push(eventHandler(core.l0a[i], "click", function (event) {
                    event.preventDefault();
                    openL1(core);
                }));
            }
        }
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
            disableCls: settings.disabledClass,
            editCls: settings.editModeClass,
            hidCls: settings.hiddenClass
        };
        return settingsobj;
    };
    /**
     * Function to initialize the carouzel core object and assign respective events
     *
     * @param core - Carouzel instance core object
     *
     */
    var init = function (root, settings) {
        if (typeof settings.beforeInitFn === "function") {
            settings.beforeInitFn();
        }
        var _core = {};
        _core.root = root;
        _core.eHandlers = [];
        _core.opts = mapSettings(settings);
        _core.canvas = root.querySelector("".concat(_Selectors.canvas));
        _core.cCta = root.querySelector("".concat(_Selectors.cCta));
        _core.oCta = root.querySelector("".concat(_Selectors.oCta));
        _core.l0ul = root.querySelectorAll("".concat(_Selectors.l0ul));
        _core.l0li = root.querySelectorAll("".concat(_Selectors.l0ul, " > li"));
        _core.l0a = root.querySelectorAll("".concat(_Selectors.l0ul, " > li > a"));
        _core.l1W = root.querySelectorAll("".concat(_Selectors.l0ul, " > li > ").concat(_Selectors.l1W));
        console.log(_core);
        toggleEvents(_core);
        return _core;
    };
    removeEventListeners;
    eventHandler;
    addClass;
    removeClass;
    toFixed4;
    /**
     *  ██████  ██████  ██████  ███████
     * ██      ██    ██ ██   ██ ██
     * ██      ██    ██ ██████  █████
     * ██      ██    ██ ██   ██ ██
     *  ██████  ██████  ██   ██ ███████
     *
     * Class for every Carouzel instance.
     *
     */
    var Core = /** @class */ (function () {
        function Core(thisid, root, options) {
            allLocalInstances[thisid] = init(root, __assign(__assign({}, _Defaults), options));
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
            /**
             * Function to return count of all available carouzel objects
             *
             * @returns count of all available carouzel objects
             *
             */
            this.getLength = function () {
                getCoreInstancesLength();
            };
            /**
             * Function to initialize the Carouzel plugin for provided query strings.
             *
             * @param query - The CSS selector for which the Carouzel needs to be initialized.
             * @param options - The optional object to customize every Carouzel instance.
             *
             */
            this.init = function (query, options) {
                var elements = document === null || document === void 0 ? void 0 : document.querySelectorAll(query);
                var elementsLength = elements.length;
                var instanceLength = getCoreInstancesLength();
                if (elementsLength > 0) {
                    for (var i = 0; i < elementsLength; i++) {
                        var id = elements[i].getAttribute("id");
                        var isElementPresent = false;
                        if (id) {
                            for (var j = 0; j < instanceLength; j++) {
                                if (allLocalInstances[id]) {
                                    isElementPresent = true;
                                    break;
                                }
                            }
                        }
                        if (!isElementPresent) {
                            var newOptions = void 0;
                            var autoDataAttr = elements[i].getAttribute(_Selectors.rootAuto.slice(1, -1)) || "";
                            if (autoDataAttr) {
                                try {
                                    newOptions = JSON.parse(stringTrim(autoDataAttr).replace(/'/g, "\""));
                                }
                                catch (e) {
                                    // throw new TypeError(_optionsParseTypeError);
                                    console.error(_optionsParseTypeError);
                                }
                            }
                            else {
                                newOptions = options;
                            }
                            if (id) {
                                new Core(id, elements[i], newOptions);
                            }
                            else {
                                var thisid = id
                                    ? id
                                    : __assign(__assign({}, _Defaults), newOptions).idPrefix +
                                        "_" +
                                        new Date().getTime() +
                                        "_root_" +
                                        (i + 1);
                                elements[i].setAttribute("id", thisid);
                                new Core(thisid, elements[i], newOptions);
                            }
                        }
                    }
                    if (getCoreInstancesLength() > 0 && !isWindowEventAttached) {
                        isWindowEventAttached = true;
                        window === null || window === void 0 ? void 0 : window.addEventListener("resize", winResizeFn, false);
                    }
                }
                else {
                    if (query !== _Selectors.rootAuto) {
                        // throw new TypeError(_rootSelectorTypeError);
                        console.error("init() \"".concat(query, "\": ").concat(_rootSelectorTypeError));
                    }
                }
            };
            this.init(_Selectors.rootAuto);
        }
        /**
         * Function to return single instance
         *
         * @returns Single Carouzel Instance
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
if (typeof exports === "object" && typeof module !== "undefined") {
    module.exports = AMegMen;
}
//# sourceMappingURL=amegmen.js.map