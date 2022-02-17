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
/***
 *     ██████  █████  ██████   ██████  ██    ██ ███████ ███████ ██
 *    ██      ██   ██ ██   ██ ██    ██ ██    ██    ███  ██      ██
 *    ██      ███████ ██████  ██    ██ ██    ██   ███   █████   ██
 *    ██      ██   ██ ██   ██ ██    ██ ██    ██  ███    ██      ██
 *     ██████ ██   ██ ██   ██  ██████   ██████  ███████ ███████ ███████
 *
 *
 */
var Carouzel;
(function (Carouzel) {
    "use strict";
    var allLocalInstances = {};
    var isWindowEventAttached = false;
    var windowResizeAny;
    var hashSlide;
    var transformVal;
    var newCi;
    var newPi;
    /*
     * Easing Functions - inspired from http://gizma.com/easing/
     * only considering the t value for the range [0, 1] => [0, 1]
     */
    var _easingFunctions = {
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
    var _animationDirections = ["previous", "next"];
    var _animationEffects = ["scroll", "fade"];
    var _rootSelectorTypeError = "Element(s) with the provided query do(es) not exist";
    var _optionsParseTypeError = "Unable to parse the options string";
    var _duplicateBreakpointsTypeError = "Duplicate breakpoints found";
    var _breakpointsParseTypeError = "Error parsing breakpoints";
    var _noEffectFoundError = "Animation effect function not found in presets. Try using one from (".concat(_animationEffects.join(', '), "). Setting the animation effect to ").concat(_animationEffects[0], ".");
    var _noEasingFoundError = "Easing function not found in presets. Try using one from [".concat(Object.keys(_easingFunctions).join(', '), "]. Setting the easing function to ").concat(Object.keys(_easingFunctions)[0], ".");
    var _useCapture = false;
    var _Selectors = {
        arrowN: "[data-carouzel-nextarrow]",
        arrowP: "[data-carouzel-previousarrow]",
        cntr: "[data-carouzel-centered]",
        controlsW: "[data-carouzel-controlswrapper]",
        curp: "[data-carouzel-currentpage]",
        dot: "[data-carouzel-dot]",
        nav: "[data-carouzel-navigation]",
        navW: "[data-carouzel-navigationwrapper]",
        pauseBtn: "[data-carouzel-pause]",
        playBtn: "[data-carouzel-play]",
        root: "[data-carouzel]",
        rootAuto: "[data-carouzel-auto]",
        rtl: "[data-carouzel-rtl]",
        scbar: "[data-carouzel-hasscrollbar]",
        scbarB: "[data-carouzel-scrollbarthumb]",
        scbarT: "[data-carouzel-scrollbartrack]",
        scbarW: "[data-carouzel-scrollbarwrapper]",
        slide: "[data-carouzel-slide]",
        stitle: "[data-carouzel-title]",
        totp: "[data-carouzel-totalpages]",
        trk: "[data-carouzel-track]",
        trkM: "[data-carouzel-trackMask]",
        trkO: "[data-carouzel-trackOuter]",
        trkW: "[data-carouzel-trackWrapper]",
        ver: "[data-carouzel-vertical]"
    };
    var _Defaults = {
        activeClass: "__carouzel-active",
        animationEffect: _animationEffects[0],
        animationSpeed: 500,
        appendUrlHash: false,
        autoplay: false,
        autoplaySpeed: 5000,
        breakpoints: [],
        centerBetween: 0,
        disabledClass: "__carouzel-disabled",
        dotIndexClass: "__carouzel-pageindex",
        dotTitleClass: "__carouzel-pagetitle",
        duplicateClass: "__carouzel-duplicate",
        easingFunction: "linear",
        editModeClass: "__carouzel-editmode",
        enableKeyboard: true,
        enableScrollbar: false,
        enableTouchSwipe: true,
        hiddenClass: "__carouzel-hidden",
        idPrefix: "__carouzel",
        isInfinite: true,
        isRtl: false,
        isVertical: false,
        pauseOnHover: false,
        showArrows: true,
        showNavigation: true,
        slideGutter: 0,
        slidesToScroll: 1,
        slidesToShow: 1,
        startAtIndex: 1,
        touchThreshold: 125,
        trackUrlHash: false,
        useTitlesAsDots: false,
        verticalHeight: 500
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
        if (typeof (element === null || element === void 0 ? void 0 : element.className) === "string") {
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
    /**
     * Function to take care of active slides before and after animation
     *
     * @param core - Carouzel instance core object
     *
     */
    var manageActiveSlides = function (core) {
        var x = null;
        for (var i = 0; i < core._as.length; i++) {
            if (core._as[i]) {
                removeClass(core._as[i], core.opts.activeCls);
                core._as[i].setAttribute("aria-hidden", "true");
            }
        }
        for (var i = core.ci + core.bpo.pDups.length; i < core.ci + core.bpo.pDups.length + core.bpo._2Show; i++) {
            if (core.opts.rtl) {
                x = core.ci + core.bpo.pDups.length + core.bpo._2Show - i - 1;
                if (core._as[x]) {
                    addClass(core._as[x], core.opts.activeCls);
                    core._as[x].removeAttribute("aria-hidden");
                }
                x = null;
            }
            else {
                x = null;
                if (core._as[i]) {
                    addClass(core._as[i], core.opts.activeCls);
                    core._as[i].removeAttribute("aria-hidden");
                }
            }
        }
    };
    /**
     * Function to update CSS classes on all respective elements
     *
     * @param core - Carouzel instance core object
     *
     */
    var updateAttributes = function (core) {
        var x;
        if (core.arrowP) {
            if (!core.opts.inf && core.ci === 0) {
                addClass(core.arrowP, core.opts.disableCls || "");
                core.arrowP.setAttribute("disabled", "disabled");
            }
            else {
                removeClass(core.arrowP, core.opts.disableCls || "");
                core.arrowP.removeAttribute("disabled");
            }
        }
        if (core.arrowN) {
            if (!core.opts.inf && core.ci === core.sLen - core.bpo._2Show) {
                addClass(core.arrowN, core.opts.disableCls || "");
                core.arrowN.setAttribute("disabled", "disabled");
            }
            else {
                removeClass(core.arrowN, core.opts.disableCls || "");
                core.arrowN.removeAttribute("disabled");
            }
        }
        if (core.bpo.dots.length > 0) {
            for (var i = 0; i < core.bpo.dots.length; i++) {
                removeClass(core.bpo.dots[i], core.opts.activeCls);
            }
            x = Math.floor(core.ci / core.bpo._2Scroll);
            if (core.opts.rtl) {
                x = core.bpo.dots.length - x - 1;
            }
            if (x < 0) {
                x = core.bpo.dots.length - 1;
            }
            if (x >= core.bpo.dots.length) {
                x = 0;
            }
            if (core.curp) {
                core.curp.innerHTML = "".concat(x + 1);
            }
            if (core.bpo.dots[x]) {
                addClass(core.bpo.dots[x], core.opts.activeCls);
            }
        }
    };
    /**
     * Function to animate the track element based on the calculations
     *
     * @param core - Carouzel instance core object
     * @param touchedPixel - Amount of pixels travelled using touch/cursor drag
     * @param isFirstLoad - If this is the first load of the carouzel
     *
     */
    var animateTrack = function (core, touchedPixel) {
        if (typeof core.opts.bFn === "function" && !core.fLoad) {
            core.opts.bFn();
        }
        if (typeof core.pi === 'undefined') {
            core.pi = core.opts.inf ? -core.bpo._2Show : 0;
        }
        if (!core.opts.inf) {
            if (core.ci < 0) {
                core.ci = 0;
            }
            if (core.ci + core.bpo._2Show >= core.sLen) {
                core.ci = core.sLen - core.bpo._2Show;
            }
        }
        if (core.trk && core.fLoad) {
            core.trk.style.transform = core.opts.ver
                ? "translate3d(0, ".concat(-core.pts[core.ci], "px, 0)")
                : "translate3d(".concat(-core.pts[core.ci], "px, 0, 0)");
        }
        manageActiveSlides(core);
        updateAttributes(core);
        core._t.start = performance
            ? performance.now()
            : Date.now();
        core._t.prevX = core.pts[core.pi];
        core._t.nextX = core.pts[core.ci];
        if (core.opts.effect === _animationEffects[1] && core.ci < 0) {
            core._t.nextX = core.pts[core.sLen + core.ci];
        }
        /**
         * Local function to perform post operations after slide animation
         *
         */
        var postAnimation = function () {
            if (core.ci >= core.sLen) {
                core.ci = core.sLen - core.ci;
            }
            if (core.ci < 0) {
                core.ci = core.sLen + core.ci;
            }
            if (core.trk) {
                core.trk.style.transform = core.opts.ver
                    ? "translate3d(0, ".concat(-core.pts[core.ci], "px, 0)")
                    : "translate3d(".concat(-core.pts[core.ci], "px, 0, 0)");
            }
            core.ct = -core._t.nextX;
            // updateAttributes(core);
            manageActiveSlides(core);
            if (core.opts._urlH && core.root) {
                hashSlide = core.root.querySelector(".".concat(core.opts.activeCls));
                if (hashSlide && (window === null || window === void 0 ? void 0 : window.location)) {
                    window.location.hash = hashSlide.getAttribute("id") || "";
                }
                hashSlide = null;
            }
            if (typeof core.opts.aFn === "function") {
                core.opts.aFn();
            }
        };
        /**
         * Local function to perform scroll animation
         *
         */
        var scrollThisTrack = function (now) {
            core._t.elapsed = now - core._t.start;
            core._t.progress = _easingFunctions[core.opts.easeFn](core._t.elapsed / core._t.total);
            if (core.ci > core.pi) {
                core._t.position =
                    core._t.prevX +
                        (touchedPixel ? touchedPixel : 0) +
                        core._t.progress * (core._t.nextX - core._t.prevX);
                if (core._t.position > core._t.nextX) {
                    core._t.position = core._t.nextX;
                }
            }
            if (core.ci < core.pi) {
                core._t.position =
                    core._t.prevX +
                        (touchedPixel ? touchedPixel : 0) -
                        core._t.progress * (core._t.prevX - core._t.nextX);
                if (core._t.position < core.pts[core.ci]) {
                    core._t.position = core.pts[core.ci];
                }
            }
            if (core._t.position && core.trk) {
                core._t.position = Math.round(core._t.position);
                core.trk.style.transform = core.opts.ver
                    ? "translate3d(0, ".concat(-core._t.position, "px, 0)")
                    : "translate3d(".concat(-core._t.position, "px, 0, 0)");
            }
            if (core._t.progress < 1 && core._t.position !== core.pts[core.ci]) {
                core._t.id = requestAnimationFrame(scrollThisTrack);
            }
            else {
                postAnimation();
            }
        };
        if (core.opts.effect === _animationEffects[0] && core.trk && !core.fLoad) {
            if (core._t.start && core._t.total && core.ci !== core.pi) {
                core._t.id = requestAnimationFrame(scrollThisTrack);
            }
        }
        /**
         * Local function to perform fade animation
         *
         */
        var fadeThisTrack = function (now) {
            core._t.elapsed = now - core._t.start;
            core._t.progress = _easingFunctions[core.opts.easeFn](core._t.elapsed / core._t.total);
            core._t.progress = core._t.progress > 1 ? 1 : core._t.progress;
            for (var i = 0; i < core._as.length; i++) {
                if (newPi !== null && i >= newPi && i < newPi + core.bpo._2Show) {
                    core._as[i + core.bpo._2Show].style.opacity =
                        "" + (1 - core._t.progress);
                }
                if (newCi !== null && i >= newCi && i < newCi + core.bpo._2Show) {
                    core._as[i + core.bpo._2Show].style.opacity =
                        "" + core._t.progress;
                }
            }
            if (core._t.progress < 1) {
                core._t.id = requestAnimationFrame(fadeThisTrack);
            }
            else {
                postAnimation();
                for (var i = 0; i < core._as.length; i++) {
                    if (newPi !== null && i >= newPi && i < newPi + core.bpo._2Show) {
                        if (core._as[i + core.bpo._2Show]) {
                            core._as[i + core.bpo._2Show].style.transform = "translate3d(0, 0, 0)";
                            core._as[i + core.bpo._2Show].style.visibility = "hidden";
                        }
                    }
                }
            }
        };
        if (core.opts.effect === _animationEffects[1] && core.trk && !core.fLoad) {
            transformVal = newCi = newPi = null;
            for (var i = 0; i < core._as.length; i++) {
                core._as[i].style.visibility = "hidden";
                core._as[i].style.opacity = "0";
                core._as[i].style.transform = "translate3d(0, 0, 0)";
            }
            core.trk.style.transform = core.opts.ver
                ? "translate3d(0, ".concat(-core._t.nextX, "px, 0)")
                : "translate3d(".concat(-core._t.nextX, "px, 0, 0)");
            newCi = core.ci < 0 ? core.sLen + core.ci : core.ci;
            newPi = core.pi < 0 ? core.sLen + core.pi : core.pi;
            transformVal =
                newCi > newPi
                    ? Math.abs(newCi - newPi - core.bpo._2Show)
                    : Math.abs(newPi - newCi - core.bpo._2Show);
            transformVal =
                newCi > newPi ? core.pts[transformVal] : -core.pts[transformVal];
            for (var i = 0; i < core._as.length; i++) {
                if (i >= newPi && i < newPi + core.bpo._2Show) {
                    if (core._as[i + core.bpo._2Show]) {
                        core._as[i + core.bpo._2Show].style.transform =
                            core.opts.ver
                                ? "translate3d(0, ".concat(transformVal - core.bpo.gutr, "px, 0)")
                                : "translate3d(".concat(transformVal - core.bpo.gutr, "px, 0, 0)");
                        core._as[i + core.bpo._2Show].style.visibility = "visible";
                        core._as[i + core.bpo._2Show].style.opacity = "1";
                    }
                }
                if (i >= newCi && i < newCi + core.bpo._2Show) {
                    if (core._as[i + core.bpo._2Show]) {
                        core._as[i + core.bpo._2Show].style.visibility = "visible";
                    }
                }
            }
            if (core._t.start && core._t.total && core.ci !== core.pi) {
                core._t.id = requestAnimationFrame(fadeThisTrack);
            }
        }
    };
    /**
     * Function to prepend the duplicate or new elements in the track
     *
     * @param parent - Track element in which duplicates need to be prepended
     * @param child - The child element to be prepended
     *
     */
    var doInsertBefore = function (parent, child) {
        var first = parent.querySelectorAll(_Selectors.slide)[0];
        if (first) {
            parent.insertBefore(child, first);
        }
    };
    /**
     * Function to append the duplicate or new elements in the track
     *
     * @param parent - Track element in which duplicates need to be prepended
     * @param child - The child element to be prepended
     *
     */
    var doInsertAfter = function (parent, child) {
        parent.appendChild(child);
    };
    /**
     * Function to manage the duplicate slides in the track based on the breakpoint
     *
     * @param track - Track element in which duplicates need to be deleted and inserted
     * @param bpo - The appropriate breakpoint based on the device width
     * @param duplicateClass - the class name associated with duplicate elements
     *
     */
    var manageDuplicates = function (track, bpo, duplicateClass) {
        var duplicates = track.querySelectorAll("." + duplicateClass);
        for (var i = 0; i < duplicates.length; i++) {
            track.removeChild(duplicates[i]);
        }
        for (var i = bpo.pDups.length - 1; i >= 0; i--) {
            doInsertBefore(track, bpo.pDups[i]);
        }
        for (var i = 0; i < bpo.nDups.length; i++) {
            doInsertAfter(track, bpo.nDups[i]);
        }
    };
    /**
     * Function to find and apply the appropriate breakpoint settings based on the viewport
     *
     * @param core - Carouzel instance core object
     *
     */
    var applyLayout = function (core) {
        var viewportWidth = window === null || window === void 0 ? void 0 : window.innerWidth;
        var bpoptions = core.bpall[0];
        var len = 0;
        var slideWidth = 0;
        var trkWidth = 0;
        var temp = 0;
        while (len < core.bpall.length) {
            if ((core.bpall[len + 1] && core.bpall[len + 1].bp > viewportWidth) ||
                typeof core.bpall[len + 1] === "undefined") {
                bpoptions = core.bpall[len];
                break;
            }
            len++;
        }
        if (core.root &&
            !hasClass(core.root, core.opts.editCls) &&
            (core.bpo_old || {})._2Show !== bpoptions._2Show &&
            core.trk) {
            manageDuplicates(core.trk, bpoptions, core.opts.dupCls || "");
        }
        if ((core.bpo_old || {}).bp !== bpoptions.bp) {
            core.bpo = bpoptions;
            core.bpo_old = bpoptions;
        }
        if (core.nav) {
            var dots = core.nav.querySelectorAll(_Selectors.dot);
            for (var i = 0; i < dots.length; i++) {
                core.nav.removeChild(dots[i]);
            }
            for (var i = 0; i < bpoptions.dots.length; i++) {
                core.nav.appendChild(bpoptions.dots[i]);
            }
        }
        if (!bpoptions._arrows && core.controlsW) {
            addClass(core.controlsW, core.opts.hidCls);
        }
        else if (core.controlsW) {
            removeClass(core.controlsW, core.opts.hidCls);
        }
        if (!bpoptions._nav && core.navW) {
            addClass(core.navW, core.opts.hidCls);
        }
        else if (core.navW) {
            removeClass(core.navW, core.opts.hidCls);
        }
        if (core.fLoad && core.opts.rtl) {
            core.ci = core.opts.startAt = core.sLen - bpoptions._2Scroll;
        }
        if (core.root && core.trkW && core.trkO && core.trk) {
            core.pts = {};
            if (core.opts.ver) {
                slideWidth =
                    (bpoptions.verH - (-bpoptions._2Show - 1) * bpoptions.gutr) /
                        (bpoptions._2Show + bpoptions.cntr);
            }
            else {
                slideWidth =
                    (core.trkW.clientWidth - (bpoptions._2Show - 1) * bpoptions.gutr) /
                        (bpoptions._2Show + bpoptions.cntr);
            }
            core.sWid = slideWidth;
            temp =
                core.sLen >= bpoptions._2Show ? bpoptions.bpSLen : bpoptions._2Show;
            core._as = core.trkO.querySelectorAll(_Selectors.slide);
            trkWidth = slideWidth * temp + bpoptions.gutr * (temp + 1);
            if (core.opts.ver) {
                core.trk.style.height = toFixed4(trkWidth) + "px";
                core.trkO.style.height =
                    toFixed4(bpoptions._2Show * slideWidth +
                        bpoptions.gutr * (bpoptions._2Show - 1)) + "px";
            }
            else {
                core.trk.style.width = toFixed4(trkWidth) + "px";
                core.trkO.style.width =
                    toFixed4(bpoptions._2Show * slideWidth +
                        bpoptions.gutr * (bpoptions._2Show - 1)) + "px";
            }
            for (var i = 0; i < core._as.length; i++) {
                if (core.opts.ver) {
                    core._as[i].style.height =
                        toFixed4(slideWidth) + "px";
                    if (i === 0) {
                        core._as[i].style.marginTop =
                            toFixed4(bpoptions.gutr) + "px";
                        core._as[i].style.marginBottom =
                            toFixed4(bpoptions.gutr / 2) + "px";
                    }
                    else if (i === core._as.length - 1) {
                        core._as[i].style.marginTop =
                            toFixed4(bpoptions.gutr / 2) + "px";
                        core._as[i].style.marginBottom =
                            toFixed4(bpoptions.gutr) + "px";
                    }
                    else {
                        core._as[i].style.marginTop =
                            toFixed4(bpoptions.gutr / 2) + "px";
                        core._as[i].style.marginBottom =
                            toFixed4(bpoptions.gutr / 2) + "px";
                    }
                }
                else {
                    core._as[i].style.width =
                        toFixed4(slideWidth) + "px";
                    if (i === 0) {
                        core._as[i].style.marginLeft =
                            toFixed4(bpoptions.gutr) + "px";
                        core._as[i].style.marginRight =
                            toFixed4(bpoptions.gutr / 2) + "px";
                    }
                    else if (i === core._as.length - 1) {
                        core._as[i].style.marginLeft =
                            toFixed4(bpoptions.gutr / 2) + "px";
                        core._as[i].style.marginRight =
                            toFixed4(bpoptions.gutr) + "px";
                    }
                    else {
                        core._as[i].style.marginLeft =
                            toFixed4(bpoptions.gutr / 2) + "px";
                        core._as[i].style.marginRight =
                            toFixed4(bpoptions.gutr / 2) + "px";
                    }
                }
            }
            for (var i = bpoptions.pDups.length; i > 0; i--) {
                core.pts[-i] = toFixed4((-i + bpoptions.pDups.length) * (slideWidth + bpoptions.gutr) +
                    bpoptions.gutr);
            }
            for (var i = 0; i < core.sLen; i++) {
                core.pts[i] = toFixed4((i + bpoptions.pDups.length) * (slideWidth + bpoptions.gutr) +
                    bpoptions.gutr);
            }
            for (var i = core.sLen; i < core.sLen + bpoptions.nDups.length; i++) {
                core.pts[i] = toFixed4((i + bpoptions.pDups.length) * (slideWidth + bpoptions.gutr) +
                    bpoptions.gutr);
            }
            if (core.totp) {
                core.totp.innerHTML = "".concat(bpoptions.dots.length);
            }
        }
        if (core.opts.scbar && core.scbarB && core.scbarT && core.trkO) {
            core.scbarT.style.width =
                core.trkO.clientWidth -
                    toFixed4(core.trkO.clientWidth / core._as.length) +
                    "px";
            core.scbarT.style.marginRight =
                toFixed4(core.trkO.clientWidth / core._as.length) + "px";
            core.scbarB.style.width =
                toFixed4(core.trkO.clientWidth / core._as.length) + "px";
        }
        else {
            animateTrack(core, 0);
        }
    };
    /**
     * Function to go to the specific slide number
     *
     * @param core - Carouzel instance core object
     * @param slidenumber - Slide index to which the carouzel should be scrolled to
     *
     */
    var go2Slide = function (core, slidenumber) {
        if (core.ci !== slidenumber * core.bpo._2Scroll) {
            if (slidenumber >= core.sLen) {
                slidenumber = core.sLen - 1;
            }
            else if (slidenumber <= -1) {
                slidenumber = 0;
            }
            core.pi = core.ci;
            core.ci = slidenumber * core.bpo._2Scroll;
            if (core._t.id) {
                cancelAnimationFrame(core._t.id);
            }
            if (core.fLoad) {
                core.fLoad = false;
            }
            animateTrack(core, 0);
        }
    };
    /**
     * Function to go to the previous set of slides
     *
     * @param core - Carouzel instance core object
     * @param touchedPixel - The amount of pixels moved using touch/cursor drag
     *
     */
    var go2Prev = function (core, touchedPixel) {
        core.pi = core.ci;
        core.ci -= core.bpo._2Scroll;
        if (core._t.id) {
            cancelAnimationFrame(core._t.id);
        }
        if (core.opts.inf) {
            if (typeof core.pts[core.ci] === "undefined") {
                core.pi =
                    core.sLen -
                        (core.sLen % core.bpo._2Scroll > 0
                            ? core.sLen % core.bpo._2Scroll
                            : core.bpo._2Scroll);
                core.ci = core.pi - core.bpo._2Scroll;
            }
            else {
                core.pi = core.ci + core.bpo._2Scroll;
            }
        }
        if (core.fLoad) {
            core.fLoad = false;
        }
        animateTrack(core, touchedPixel);
    };
    /**
     * Function to go to the next set of slides
     *
     * @param core - Carouzel instance core object
     * @param touchedPixel - The amount of pixels moved using touch/cursor drag
     *
     */
    var go2Next = function (core, touchedPixel) {
        core.pi = core.ci;
        core.ci += core.bpo._2Scroll;
        if (core._t.id) {
            cancelAnimationFrame(core._t.id);
        }
        if (core.opts.inf) {
            if (typeof core.pts[core.ci + core.bpo._2Show] === "undefined") {
                core.pi = core.pi - core.sLen;
                core.ci = 0;
            }
            else {
                core.pi = core.ci - core.bpo._2Scroll;
            }
        }
        if (core.fLoad) {
            core.fLoad = false;
        }
        animateTrack(core, touchedPixel);
    };
    /**
     * Function to toggle keyboard navigation with left and right arrows
     *
     * @param core - Carouzel instance core object
     *
     */
    var toggleKeyboard = function (core) {
        if (core.root && core.opts.kb) {
            core.root.setAttribute("tabindex", "-1");
            var keyCode_1 = "";
            core.eHandlers.push(eventHandler(core.root, "keydown", function (event) {
                event = event || (window === null || window === void 0 ? void 0 : window.event);
                keyCode_1 = event.key.toLowerCase();
                switch (keyCode_1) {
                    case "arrowleft":
                        go2Prev(core, 0);
                        break;
                    case "arrowright":
                        go2Next(core, 0);
                        break;
                }
            }));
        }
    };
    /**
     * Function to toggle Play and Pause buttons when autoplaying carouzel is played or paused
     *
     * @param core - Carouzel instance core object
     * @param shouldPlay - A boolean value determining if the carouzel is being played or is paused
     *
     */
    var togglePlayPause = function (core, shouldPlay) {
        if (core && core.bPause && core.bPlay) {
            if (shouldPlay) {
                addClass(core.bPlay, core.opts.hidCls);
                removeClass(core.bPause, core.opts.hidCls);
            }
            else {
                addClass(core.bPause, core.opts.hidCls);
                removeClass(core.bPlay, core.opts.hidCls);
            }
        }
    };
    /**
     * Function to toggle Autoplay and pause on hover functionalities for the carouzel
     *
     * @param core - Carouzel instance core object
     *
     */
    var toggleAutoplay = function (core) {
        if (core.root && core.opts.pauseHov) {
            core.eHandlers.push(eventHandler(core.root, "mouseenter", function () {
                core.paused = true;
                togglePlayPause(core, false);
            }));
            core.eHandlers.push(eventHandler(core.root, "mouseleave", function () {
                core.paused = false;
                togglePlayPause(core, true);
            }));
        }
        if (!core.opts.pauseHov) {
            core.paused = false;
        }
        core.autoT = setInterval(function () {
            if (!core.paused && !core.pauseClk) {
                go2Next(core, 0);
            }
        }, core.opts.autoS);
    };
    /**
     * Function to add click events to the arrows
     *
     * @param core - Carouzel instance core object
     *
     */
    var toggleControlButtons = function (core) {
        if (core.arrowP) {
            core.eHandlers.push(eventHandler(core.arrowP, "click", function (event) {
                event.preventDefault();
                go2Prev(core, 0);
            }));
        }
        if (core.arrowN) {
            core.eHandlers.push(eventHandler(core.arrowN, "click", function (event) {
                event.preventDefault();
                go2Next(core, 0);
            }));
        }
        if (core.opts.inf && core.bPause) {
            core.eHandlers.push(eventHandler(core.bPause, "click", function (event) {
                event.preventDefault();
                core.pauseClk = true;
                togglePlayPause(core, false);
            }));
        }
        if (core.opts.inf && core.bPlay) {
            core.eHandlers.push(eventHandler(core.bPlay, "click", function (event) {
                event.preventDefault();
                core.pauseClk = false;
                togglePlayPause(core, true);
            }));
        }
    };
    /**
     * Function to add touch events to the track
     *
     * @param core - Carouzel instance core object
     *
     */
    var toggleTouchEvents = function (core) {
        var diffX = 0;
        var diffY = 0;
        var dragging = false;
        var endX = 0;
        var endY = 0;
        var posFinal = 0;
        var posX1 = 0;
        var posX2 = 0;
        var posY1 = 0;
        var posY2 = 0;
        var ratioX = 0;
        var ratioY = 0;
        var startX = 0;
        var startY = 0;
        var threshold = core.opts.threshold || 125;
        var canFiniteAnimate = false;
        /**
         * Function to be triggered when the carouzel is touched the cursor is down on it
         *
         */
        var touchStart = function (e) {
            dragging = true;
            if (e.type === "touchstart") {
                startX = e.changedTouches[0].screenX;
                startY = e.changedTouches[0].screenY;
                posX1 = e.changedTouches[0].screenX;
                posY1 = e.changedTouches[0].screenY;
            }
            else {
                startX = e.clientX;
                startY = e.clientY;
                posX1 = e.clientX;
                posY1 = e.clientY;
            }
        };
        /**
         * Function to be triggered when the carouzel is dragged through touch or cursor
         *
         */
        var touchMove = function (e) {
            if (dragging) {
                if (e.type === "touchmove") {
                    endX = e.changedTouches[0].screenX;
                    endY = e.changedTouches[0].screenY;
                    posX2 = posX1 - e.changedTouches[0].screenX;
                    posY2 = posY1 - e.changedTouches[0].screenY;
                }
                else {
                    endX = e.clientX;
                    endY = e.clientY;
                    posX2 = posX1 - e.clientX;
                    posY2 = posY1 - e.clientY;
                }
                diffX = endX - startX;
                diffY = endY - startY;
                ratioX = Math.abs(diffX / diffY);
                ratioY = Math.abs(diffY / diffX);
                if (!core.ct) {
                    core.ct = -core.pts[core.ci];
                }
                if (core.trk && core.opts.effect === _animationEffects[0]) {
                    if (ratioX > ratioY && !core.opts.ver) {
                        core.trk.style.transform = "translate3d(".concat(core.ct - posX2, "px, 0, 0)");
                    }
                    if (ratioX < ratioY && core.opts.ver) {
                        core.trk.style.transform = "translate3d(0, ".concat(core.ct - posY2, "px, 0)");
                    }
                }
                if (core.trk && core.opts.effect === _animationEffects[1]) {
                    for (var k = 0; k < core._as.length; k++) {
                        core._as[k].style.opacity = "1";
                    }
                }
                posFinal = core.opts.ver ? posY2 : posX2;
            }
        };
        /**
         * Function to be triggered when the touch is ended or cursor is released
         *
         */
        var touchEnd = function (e) {
            if (dragging && core.trk) {
                if (e.type === "touchend") {
                    endX = e.changedTouches[0].screenX;
                    endY = e.changedTouches[0].screenY;
                }
                else {
                    endX = e.clientX;
                    endY = e.clientY;
                }
                diffX = endX - startX;
                diffY = endY - startY;
                ratioX = Math.abs(diffX / diffY);
                ratioY = Math.abs(diffY / diffX);
                if (!isNaN(ratioX) &&
                    !isNaN(ratioY) &&
                    ratioY !== Infinity &&
                    ratioX !== Infinity &&
                    ratioX !== ratioY) {
                    canFiniteAnimate = false;
                    if (!core.opts.inf) {
                        if ((core.opts.ver ? diffY : diffX) > 0) {
                            if (Math.abs(core.ct) <= 0) {
                                core.trk.style.transform = core.opts.ver
                                    ? "translate3d(0, ".concat(core.ct, "px, 0)")
                                    : "translate3d(".concat(core.ct, "px, 0, 0)");
                            }
                            else {
                                canFiniteAnimate = true;
                            }
                        }
                        else if ((core.opts.ver ? diffY : diffX) < 0) {
                            if (Math.abs(core.ct) + core.sWid * core.bpo._2Show >=
                                core.sWid * core._as.length) {
                                core.trk.style.transform = core.opts.ver
                                    ? "translate3d(0, ".concat(core.ct, "px, 0)")
                                    : "translate3d(".concat(core.ct, "px, 0, 0)");
                            }
                            else {
                                canFiniteAnimate = true;
                            }
                        }
                    }
                    if (core.opts.effect === _animationEffects[1]) {
                        for (var k = 0; k < core._as.length; k++) {
                            core._as[k].style.opacity = "0";
                        }
                    }
                    if (posFinal < -threshold) {
                        if (core.opts.effect === _animationEffects[0] &&
                            (canFiniteAnimate || core.opts.inf)) {
                            go2Prev(core, posFinal);
                        }
                        if (core.opts.effect === _animationEffects[1] &&
                            (canFiniteAnimate || core.opts.inf)) {
                            go2Prev(core, 1);
                        }
                    }
                    else if (posFinal > threshold) {
                        if (core.opts.effect === _animationEffects[0] &&
                            (canFiniteAnimate || core.opts.inf)) {
                            go2Next(core, posFinal);
                        }
                        if (core.opts.effect === _animationEffects[1] &&
                            (canFiniteAnimate || core.opts.inf)) {
                            go2Next(core, 1);
                        }
                    }
                    else {
                        if (core.opts.effect === _animationEffects[0]) {
                            core.trk.style.transform = core.opts.ver
                                ? "translate3d(0, ".concat(core.ct, "px, 0)")
                                : "translate3d(".concat(core.ct, "px, 0, 0)");
                        }
                        if (core.opts.effect === _animationEffects[1]) {
                            for (var k = 0; k < core._as.length; k++) {
                                core._as[k].style.opacity = "1";
                            }
                        }
                    }
                }
                posX1 = posX2 = posY1 = posY2 = posFinal = 0;
                dragging = false;
            }
        };
        if (core.opts.swipe && !core.opts.scbar) {
            core.eHandlers.push(eventHandler(core.trk, "touchstart", function (event) {
                touchStart(event);
            }));
            core.eHandlers.push(eventHandler(core.trk, "touchmove", function (event) {
                touchMove(event);
            }));
            core.eHandlers.push(eventHandler(core.trk, "touchend", function (e) {
                touchEnd(e);
            }));
            core.eHandlers.push(eventHandler(core.trk, "mousedown", function (event) {
                touchStart(event);
            }));
            core.eHandlers.push(eventHandler(core.trk, "mouseup", function (e) {
                touchEnd(e);
            }));
            core.eHandlers.push(eventHandler(core.trk, "mouseleave", function (e) {
                touchEnd(e);
            }));
            core.eHandlers.push(eventHandler(core.trk, "mousemove", function (event) {
                touchMove(event);
            }));
        }
    };
    /**
     * Function to generate duplicate elements and dot navigation before hand for all breakpoints
     *
     * @param core - Carouzel instance core object
     *
     */
    var generateElements = function (core) {
        for (var i = 0; i < core.bpall.length; i++) {
            core.bpall[i].bpSLen = core.sLen;
            if (core.opts.inf) {
                for (var j = core.sLen -
                    core.bpall[i]._2Show -
                    Math.ceil(core.bpall[i].cntr / 2); j < core.sLen; j++) {
                    if (core._ds[j]) {
                        var elem = core._ds[j].cloneNode(true);
                        addClass(elem, core.opts.dupCls || "");
                        core.bpall[i].bpSLen++;
                        core.bpall[i].pDups.push(elem);
                    }
                }
                for (var j = 0; j < core.bpall[i]._2Show + Math.ceil(core.bpall[i].cntr / 2); j++) {
                    if (core._ds[j]) {
                        var elem = core._ds[j].cloneNode(true);
                        addClass(elem, core.opts.dupCls || "");
                        core.bpall[i].bpSLen++;
                        core.bpall[i].nDups.push(elem);
                    }
                }
            }
        }
        var _loop_1 = function (i) {
            var pageLength = Math.floor(core.sLen / core.bpall[i]._2Scroll);
            var navBtns = [];
            var var1 = core.sLen % core.bpall[i]._2Scroll;
            var var2 = core.bpall[i]._2Show - core.bpall[i]._2Scroll;
            if (var2 > var1) {
                pageLength--;
            }
            if (var2 < var1) {
                pageLength++;
            }
            core.bpall[i].dots = [];
            var btnStr = "";
            var _loop_2 = function (j) {
                var liElem = document === null || document === void 0 ? void 0 : document.createElement("li");
                var btnElem = document === null || document === void 0 ? void 0 : document.createElement("button");
                liElem.setAttribute(_Selectors.dot.slice(1, -1), "");
                btnElem.setAttribute("type", "button");
                btnStr = "<div class=\"".concat(core.opts.dotNcls, "\">").concat(j + 1, "</div>");
                if (core.opts.useTitle &&
                    core.bpall[i]._2Show === 1 &&
                    core._ds[j].getAttribute(_Selectors.stitle.slice(1, -1))) {
                    btnStr += core._ds[j].getAttribute(_Selectors.stitle.slice(1, -1));
                    addClass(liElem, core.opts.dotCls);
                }
                btnElem.innerHTML = btnStr;
                liElem.appendChild(btnElem);
                navBtns.push(liElem);
                core.eHandlers.push(eventHandler(btnElem, "click", function (event) {
                    event.preventDefault();
                    if (core.opts.rtl) {
                        go2Slide(core, pageLength - j - 1);
                    }
                    else {
                        go2Slide(core, j);
                    }
                }));
                core.bpall[i].dots.push(navBtns[j]);
            };
            for (var j = 0; j < pageLength; j++) {
                _loop_2(j);
            }
        };
        for (var i = 0; i < core.bpall.length; i++) {
            _loop_1(i);
        }
    };
    /**
     * Function to remove ghost dragging from images
     *
     * @param core - Carouzel instance core object
     *
     */
    // TODO: FUTURE SCROLLBAR IMPLEMENTATION
    var generateScrollbar = function (core) {
        if (core.opts.scbar && core.root) {
            core.scbarW = core.root.querySelector("".concat(_Selectors.scbarW));
            core.scbarT = core.root.querySelector("".concat(_Selectors.scbarT));
            core.scbarB = core.root.querySelector("".concat(_Selectors.scbarB));
            core.root.setAttribute(_Selectors.scbar.slice(1, -1), "true");
        }
        var logTrackScroll = function () {
            // if (core.trkO && core.scbarT && core.scbarB) {
            //   console.log(
            //     '==========core.trkO',
            //     (core.trkO.scrollLeft / core.scbarT.clientWidth) *
            //       core.scbarB.clientWidth
            //   );
            // }
        };
        if (core.opts.scbar) {
            core.eHandlers.push(eventHandler(core.trkO, "scroll", function () {
                logTrackScroll();
            }));
        }
    };
    /**
     * Function to remove ghost dragging from images
     *
     * @param core - Carouzel instance core object
     *
     */
    var makeStuffUndraggable = function (core) {
        if (core.root) {
            var images = core.root.querySelectorAll("img");
            for (var img = 0; img < images.length; img++) {
                core.eHandlers.push(eventHandler(images[img], "dragstart", function (event) {
                    event.preventDefault();
                }));
            }
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
                    bp: breakpoints.sort(function (a, b) { return parseFloat(a.bp) - parseFloat(b.bp); })
                };
            }
            else {
                // throw new TypeError(_duplicateBreakpointsTypeError);
                console.error(_duplicateBreakpointsTypeError);
                return {};
            }
        }
        catch (e) {
            // throw new TypeError(_breakpointsParseTypeError);
            console.error(_breakpointsParseTypeError);
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
            _2Scroll: settings._2Scroll,
            _2Show: settings._2Show,
            _arrows: settings._arrows,
            _nav: settings._nav,
            bp: 0,
            bpSLen: 0,
            cntr: settings.cntr,
            dots: [],
            gutr: settings.gutr,
            nav: null,
            nDups: [],
            pDups: [],
            swipe: settings.swipe,
            verH: settings.verH,
            verP: 1
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
                if (typeof bp2._arrows === "undefined") {
                    bp2._arrows = bp1._arrows;
                }
                if (typeof bp2._nav === "undefined") {
                    bp2._nav = bp1._nav;
                }
                if (typeof bp2._2Show === "undefined") {
                    bp2._2Show = bp1._2Show;
                }
                if (typeof bp2._2Scroll === "undefined") {
                    bp2._2Scroll = bp1._2Scroll;
                }
                if (typeof bp2.swipe === "undefined") {
                    bp2.swipe = bp1.swipe;
                }
                if (typeof bp2.cntr === "undefined") {
                    bp2.cntr = bp1.cntr;
                }
                if (typeof bp2.gutr === "undefined") {
                    bp2.gutr = bp1.gutr;
                }
                if (typeof bp2.verH === "undefined") {
                    bp2.verH = bp1.verH;
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
            _2Scroll: settings.enableScrollbar ? 1 : settings.slidesToScroll,
            _2Show: settings.slidesToShow,
            _arrows: settings.showArrows,
            _nav: settings.showNavigation,
            _urlH: settings.appendUrlHash,
            activeCls: settings.activeClass,
            aFn: settings.afterScrollFn,
            auto: settings.autoplay,
            autoS: settings.autoplaySpeed,
            bFn: settings.beforeScrollFn,
            cntr: settings.centerBetween,
            disableCls: settings.disabledClass,
            dotCls: settings.dotTitleClass,
            dotNcls: settings.dotIndexClass,
            dupCls: settings.duplicateClass,
            editCls: settings.editModeClass,
            effect: (function () {
                if (_animationEffects.indexOf(settings.animationEffect) > -1) {
                    return settings.animationEffect;
                }
                console.warn(_noEffectFoundError);
                return _animationEffects[0];
            })(),
            gutr: settings.slideGutter,
            hidCls: settings.hiddenClass,
            inf: settings.enableScrollbar ? false : settings.isInfinite,
            rtl: settings.isRtl,
            kb: settings.enableKeyboard,
            pauseHov: settings.pauseOnHover,
            res: [],
            scbar: settings.enableScrollbar,
            speed: settings.animationSpeed,
            startAt: settings.animationSpeed,
            swipe: settings.enableTouchSwipe,
            threshold: settings.touchThreshold,
            easeFn: (function () {
                if (_easingFunctions[settings.easingFunction]) {
                    return settings.easingFunction;
                }
                console.warn(_noEasingFoundError);
                return Object.keys(_easingFunctions)[0];
            })(),
            useTitle: settings.useTitlesAsDots,
            ver: settings.isVertical,
            verH: settings.verticalHeight,
            verP: 1
        };
        if (settings.breakpoints && settings.breakpoints.length > 0) {
            for (var i = 0; i < settings.breakpoints.length; i++) {
                var obj = {
                    _2Scroll: settings.enableScrollbar
                        ? 1
                        : settings.breakpoints[i].slidesToScroll,
                    _2Show: settings.breakpoints[i].slidesToShow,
                    _arrows: settings.breakpoints[i].showArrows,
                    _nav: settings.breakpoints[i].showNavigation,
                    bp: settings.breakpoints[i].minWidth,
                    bpSLen: 0,
                    cntr: settings.breakpoints[i].centerBetween,
                    dots: [],
                    gutr: settings.breakpoints[i].slideGutter,
                    nav: null,
                    nDups: [],
                    pDups: [],
                    swipe: settings.breakpoints[i].enableTouchSwipe,
                    verH: settings.breakpoints[i].verticalHeight,
                    verP: 1
                };
                if (settingsobj.res) {
                    settingsobj.res.push(obj);
                }
            }
        }
        return settingsobj;
    };
    /**
     * Function to initialize the carouzel core object and assign respective events
     *
     * @param core - Carouzel instance core object
     *
     */
    var init = function (root, settings) {
        var _a;
        if (typeof settings.beforeInitFn === "function") {
            settings.beforeInitFn();
        }
        var _core = {};
        _core.root = root;
        _core.opts = mapSettings(settings);
        _core._ds = root.querySelectorAll("".concat(_Selectors.slide));
        _core.arrowN = root.querySelector("".concat(_Selectors.arrowN));
        _core.arrowP = root.querySelector("".concat(_Selectors.arrowP));
        _core.bPause = root.querySelector("".concat(_Selectors.pauseBtn));
        _core.bPlay = root.querySelector("".concat(_Selectors.playBtn));
        _core.ci = settings.startAtIndex = (settings.startAtIndex || 0) - 1;
        _core.controlsW = root.querySelector("".concat(_Selectors.controlsW));
        _core.eHandlers = [];
        _core.nav = root.querySelector("".concat(_Selectors.nav));
        _core.navW = root.querySelector("".concat(_Selectors.navW));
        _core.pts = [];
        _core.sLen = _core._ds.length;
        _core.trk = root.querySelector("".concat(_Selectors.trk));
        _core.trkM = root.querySelector("".concat(_Selectors.trkM));
        _core.trkO = root.querySelector("".concat(_Selectors.trkO));
        _core.trkW = root.querySelector("".concat(_Selectors.trkW));
        _core.curp = root.querySelector("".concat(_Selectors.curp));
        _core.totp = root.querySelector("".concat(_Selectors.totp));
        _core.fLoad = true;
        if (_core.opts.rtl) {
            _core.root.setAttribute(_Selectors.rtl.slice(1, -1), "true");
        }
        _core._t = {};
        _core._t.total = _core.opts.speed;
        if (!_core._ds[_core.ci]) {
            _core.ci = settings.startAtIndex = 0;
        }
        if (_core.trk && _core.sLen > 0) {
            if (_core.opts.auto) {
                _core.opts.inf = true;
                toggleAutoplay(_core);
            }
            _core.bpall = updateBreakpoints(_core.opts);
            if (_core.bpall.length > 0) {
                makeStuffUndraggable(_core);
                toggleKeyboard(_core);
                generateElements(_core);
                generateScrollbar(_core);
                toggleControlButtons(_core);
                toggleTouchEvents(_core);
                applyLayout(_core);
            }
        }
        addClass(_core.root, _core.opts.activeCls);
        if (_core.opts.ver) {
            _core.root.setAttribute(_Selectors.ver.slice(1, -1), "true");
        }
        if (!isNaN(_core.opts.cntr) && _core.opts.cntr > 0) {
            _core.root.setAttribute(_Selectors.cntr.slice(1, -1), "true");
        }
        for (var r = 0; r < _core.opts.res.length; r++) {
            if (!isNaN(_core.opts.res[r].cntr) && _core.opts.res[r].cntr > 0) {
                _core.root.setAttribute(_Selectors.cntr.slice(1, -1), "true");
            }
        }
        if (typeof settings.afterInitFn === "function") {
            settings.afterInitFn();
        }
        if (settings.trackUrlHash && ((_a = window === null || window === void 0 ? void 0 : window.location) === null || _a === void 0 ? void 0 : _a.hash)) {
            var windowHash = window.location.hash || "";
            if (windowHash.charAt(0) === "#") {
                windowHash = windowHash.slice(1, windowHash.length);
            }
            if ((windowHash || "").length > 0) {
                var thisSlides = _core.root.querySelectorAll("".concat(_Selectors.slide));
                var foundSlideIndex = -1;
                for (var s = 0; s < thisSlides.length; s++) {
                    if (thisSlides[s].getAttribute("id") === windowHash) {
                        foundSlideIndex = s;
                        break;
                    }
                }
                if (foundSlideIndex !== -1) {
                    go2Slide(_core, foundSlideIndex);
                }
            }
        }
        return _core;
    };
    /**
     * Function to get the Carouzel based on the query string provided.
     *
     * @param query - The CSS selector for which the Carouzel needs to be initialized.
     *
     * @returns an array of all available core instances on page
     */
    var getCores = function (query) {
        var roots = document === null || document === void 0 ? void 0 : document.querySelectorAll(query);
        var rootsLen = roots.length;
        var tempArr = [];
        if (rootsLen > 0) {
            for (var i = 0; i < rootsLen; i++) {
                var id = roots[i].getAttribute("id");
                if (id && allLocalInstances[id]) {
                    tempArr.push(allLocalInstances[id]);
                }
            }
        }
        return tempArr;
    };
    /**
     * Function to destroy the carouzel core and delete it from the root instance
     *
     * @param core - The carouzel core which needs to be deleted
     *
     */
    var destroy = function (core) {
        var _a;
        var id = (_a = core.root) === null || _a === void 0 ? void 0 : _a.getAttribute("id");
        var allElems = core.root.querySelectorAll("*");
        for (var i = 0; i < allElems.length; i++) {
            removeEventListeners(core, allElems[i]);
            if (core.trk && hasClass(allElems[i], core.opts.dupCls)) {
                core.trk.removeChild(allElems[i]);
            }
            if (core.nav && allElems[i].hasAttribute(_Selectors.dot.slice(1, -1))) {
                core.nav.removeChild(allElems[i]);
            }
            allElems[i].removeAttribute("style");
            removeClass(allElems[i], "".concat(core.opts.activeCls, " ").concat(core.opts.editCls, " ").concat(core.opts.disableCls, " ").concat(core.opts.dupCls));
            if (allElems[i].hasAttribute("disabled")) {
                allElems[i].removeAttribute("disabled");
            }
        }
        removeClass(core.root, "".concat(core.opts.activeCls, " ").concat(core.opts.editCls, " ").concat(core.opts.disableCls, " ").concat(core.opts.dupCls));
        if (id) {
            delete allLocalInstances[id];
        }
    };
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
            this.getLength = function () { return getCoreInstancesLength(); };
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
            /**
             * Function to animate to a certain slide based on a provided direction or number
             *
             * @param query - The CSS selector for which the Carouzels need to be animated
             * @param target - Either the direction `previous` or `next`, or the slide index
             *
             */
            this.goToSlide = function (query, target) {
                var cores = getCores(query);
                if (cores.length > 0) {
                    for (var i = 0; i < cores.length; i++) {
                        if (_animationDirections.indexOf(target) !== -1) {
                            target === _animationDirections[0]
                                ? go2Prev(cores[i], 0)
                                : go2Next(cores[i], 0);
                        }
                        else if (!isNaN(parseInt(target))) {
                            go2Slide(cores[i], parseInt(target) - 1);
                        }
                    }
                }
                else {
                    // throw new TypeError(_rootSelectorTypeError);
                    console.error("goToSlide() \"".concat(query, "\": ").concat(_rootSelectorTypeError));
                }
            };
            /**
             * Function to destroy the Carouzel plugin for provided query strings.
             *
             * @param query - The CSS selector for which the Carouzel needs to be destroyed.
             *
             */
            this.destroy = function (query) {
                var cores = getCores(query);
                if (cores.length > 0) {
                    for (var i = 0; i < cores.length; i++) {
                        destroy(cores[i]);
                    }
                    if (getCoreInstancesLength() === 0) {
                        window === null || window === void 0 ? void 0 : window.removeEventListener("resize", winResizeFn, false);
                    }
                }
                else {
                    // throw new TypeError(_rootSelectorTypeError);
                    console.error("destroy() \"".concat(query, "\": ").concat(_rootSelectorTypeError));
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
    Carouzel.Root = Root;
})(Carouzel || (Carouzel = {}));
if (typeof exports === "object" && typeof module !== "undefined") {
    module.exports = Carouzel;
}

//# sourceMappingURL=carouzel.js.map
