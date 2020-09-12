namespace AMegMen {
  declare let isOpera: any;

  interface IAMegMenSettings {
    uuidPrefix?: string;
    menuClass?: string;
    topNavItemClass?: string;
    panelClass?: string;
    panelGroupClass?: string;
    hoverClass?: string;
    focusClass?: string;
    openClass?: string;
  }

  const CAMegMenConstants = {
    pluginName: "amegmen",
    defaults: {
      uuidPrefix: "amegmen", // unique ID's are required to indicate aria-owns, aria-controls and aria-labelledby
      menuClass: "amegmen", // default css class used to define the megamenu styling
      topNavItemClass: "amegmen-top-nav-item", // default css class for a top-level navigation item in the megamenu
      panelClass: "amegmen-panel", // default css class for a megamenu panel
      panelGroupClass: "amegmen-panel-group", // default css class for a group of items within a megamenu panel
      hoverClass: "hover", // default css class for the hover state
      focusClass: "focus", // default css class for the focus state
      openClass: "open", // default css class for the open state,
      toggleButtonClass: "amegmen-toggle", // default css class responsive toggle button
      openDelay: 0, // default open delay when opening menu via mouseover
      closeDelay: 250, // default open delay when opening menu via mouseover
      openOnMouseover: false, // default setting for whether menu should open on mouseover
    },
    Keyboard: {
      BACKSPACE: 8,
      COMMA: 188,
      DELETE: 46,
      DOWN: 40,
      END: 35,
      ENTER: 13,
      ESCAPE: 27,
      HOME: 36,
      LEFT: 37,
      PAGE_DOWN: 34,
      PAGE_UP: 33,
      PERIOD: 190,
      RIGHT: 39,
      SPACE: 32,
      TAB: 9,
      UP: 38,
      keyMap: {
        48: "0",
        49: "1",
        50: "2",
        51: "3",
        52: "4",
        53: "5",
        54: "6",
        55: "7",
        56: "8",
        57: "9",
        59: ";",
        65: "a",
        66: "b",
        67: "c",
        68: "d",
        69: "e",
        70: "f",
        71: "g",
        72: "h",
        73: "i",
        74: "j",
        75: "k",
        76: "l",
        77: "m",
        78: "n",
        79: "o",
        80: "p",
        81: "q",
        82: "r",
        83: "s",
        84: "t",
        85: "u",
        86: "v",
        87: "w",
        88: "x",
        89: "y",
        90: "z",
        96: "0",
        97: "1",
        98: "2",
        99: "3",
        100: "4",
        101: "5",
        102: "6",
        103: "7",
        104: "8",
        105: "9",
        190: ".",
      },
    },
    clearTimeout: window.clearTimeout,
    setTimeout: window.setTimeout,
    isOpera:
      (window as any).opera &&
      (window as any).opera.toString() === "[object Opera]",
    enableClosest: () => {
      if (!Element.prototype.matches) {
        Element.prototype.matches =
          (Element.prototype as any).msMatchesSelector ||
          Element.prototype.webkitMatchesSelector;
      }

      if (!Element.prototype.closest) {
        Element.prototype.closest = function (s) {
          var el = this;

          do {
            if (Element.prototype.matches.call(el, s)) return el;
            el = el.parentElement || el.parentNode;
          } while (el !== null && el.nodeType === 1);
          return null;
        };
      }
    },
  };

  export class init {
    private element: HTMLElement | null;
    private settings: IAMegMenSettings;
    private _name: String;

    constructor(menuid: string, options?: IAMegMenSettings) {
      CAMegMenConstants.enableClosest();
      this.element = document.getElementById(menuid);

      this.settings = { ...CAMegMenConstants.defaults, ...options };
      this._name = CAMegMenConstants.pluginName;
    }
  }
}

if (window && document) {
  window.AMegMen = AMegMen;
}
