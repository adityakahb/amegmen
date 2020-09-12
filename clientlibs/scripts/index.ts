(function (window, document) {

  const AMegMen_Trim = (str: string) => {
    return str.replace(/^\s+|\s+$/g, '');
  };


  const AMegMen_Scope = () => {
    try { // check if browser supports :scope natively
      window.document.querySelector(':scope body');
    } catch (err) { // polyfill native methods if it doesn't
      let nativ = Element.prototype.querySelector;
      Element.prototype.querySelector = function (selectors: string) {
        if (/(^|,)\s*:scope/.test(selectors)) { // only if selectors contains :scope
          let id = this.id; // remember current element id
          this.id = 'ID_' + Date.now(); // assign new unique id
          selectors = selectors.replace(/((^|,)\s*):scope/g, '$1#' + this.id); // replace :scope with #ID
          let result = window.document.querySelector(selectors);
          this.id = id; // restore previous id
          return result;
        } else {
          return nativ.call(this, selectors); // use native code for other selectors
        }
      }
      nativ = Element.prototype.querySelectorAll;
      Element.prototype.querySelector = function (selectors: string) {
        if (/(^|,)\s*:scope/.test(selectors)) { // only if selectors contains :scope
          let id = this.id; // remember current element id
          this.id = 'ID_' + Date.now(); // assign new unique id
          selectors = selectors.replace(/((^|,)\s*):scope/g, '$1#' + this.id); // replace :scope with #ID
          let result = window.document.querySelectorAll(selectors);
          this.id = id; // restore previous id
          return result;
        } else {
          return nativ.call(this, selectors); // use native code for other selectors
        }
      }
    }
  };

  const AMegMen_Closest = (element: HTMLElement, selector: string) => {
    if (!Element.prototype.matches) {
      Element.prototype.matches =
        (Element.prototype as any).msMatchesSelector ||
        Element.prototype.webkitMatchesSelector;
    }

    if (!Element.prototype.closest) {
      do {
        if (Element.prototype.matches.call(element, selector)) return element;
        let parent = element.parentElement || element.parentNode;
        if (parent) {
          element = parent as HTMLElement;
        }
      } while (element !== null && element.nodeType === 1);
      return null;
    } else {
      return element.closest(selector);
    }
  };
  const AMegMen_ArrayCall = (arr: any[] | NodeListOf<Element>) => {
    try {
      return Array.prototype.slice.call(arr || []);
    } catch (e) {
      return [];
    }
  }
  const AMegMen_HasClass = (element: HTMLElement, cls: string) => {
    const classname = element.className;
    const patt = new RegExp((cls || '').toLowerCase(), 'gi');
    return patt.test(classname);
  };
  const AMegMen_AddClass = (element: HTMLElement, cls: string) => {
    if (!AMegMen_HasClass(element, cls)) {
      element.className += ' ' + cls;
      element.className = AMegMen_Trim(element.className);
    }
  };
  const AMegMen_RemoveClass = (element: HTMLElement, cls: string) => {
    if (AMegMen_HasClass(element, cls)) {
      let curclass = element.className;
      curclass = curclass.replace(cls, '');
      element.className = AMegMen_Trim(curclass);
    }
  };

  const AMegMen = function (this: any, elemid: string, options?: any) {

    const l0mouseenter = (event: MouseEvent) => {
      l0mouseleave();
      let l0anchor = event.target as HTMLElement;
      if (l0anchor) {
        let parentli0 = AMegMen_Closest(l0anchor, 'li');
        if (parentli0) {
          let subnav0 = parentli0.querySelector('section');
          if (subnav0) {
            AMegMen_AddClass(l0anchor, 'active');
            AMegMen_AddClass(subnav0, 'active');
          }
        }
      }
    };

    const l0mouseleave = (event?: MouseEvent) => {
      for (let l0 = 0; l0 < this.l0sections.length; l0++) {
        AMegMen_RemoveClass(this.l0sections[l0], 'active');
      }
      for (let l0 = 0; l0 < this.l0anchors.length; l0++) {
        AMegMen_RemoveClass(this.l0anchors[l0], 'active');
      }
    };

    this.elem = document.getElementById(elemid);

    const init = () => {

      let l0sections = this.elem.querySelectorAll(':scope > ul > li > section')
      this.l0sections = AMegMen_ArrayCall(l0sections);

      let l0anchors = this.elem.querySelectorAll(':scope > ul > li > a'); // document.querySelectorAll('#' + elemid + ' > ul > li > a');
      this.l0anchors = AMegMen_ArrayCall(l0anchors);

      (this.elem as HTMLElement).addEventListener('mouseleave', l0mouseleave);

      for (let l0 = 0; l0 < this.l0sections.length; l0++) {
        AMegMen_AddClass(this.l0sections[l0], 'amegmen-l0-subnav');
      }

      for (let l0 = 0; l0 < this.l0anchors.length; l0++) {
        AMegMen_AddClass(this.l0anchors[l0], 'amegmen-l0-nav');
        (this.l0anchors[l0] as HTMLElement).addEventListener('mouseover', l0mouseenter);
      }
    };

    if (this.elem) {
      init();
    }

  };
  AMegMen_Scope();
  (window as any).AMegMen = AMegMen;

}(window, document));
