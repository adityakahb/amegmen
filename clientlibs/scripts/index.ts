(function (window, document) {

  const AMegMen_Trim = (str: string) => {
    return str.replace(/^\s+|\s+$/g, '');
  };


  const AMegMen_QSQSAScope = () => {
    try {
      window.document.querySelector(':scope body');
    } catch (err) {
      const qsarr = ['querySelector', 'querySelectorAll'];
      for (let i = 0; i < qsarr.length; i++) {
        let nativ = (Element.prototype as any)[qsarr[i]];
        (Element.prototype as any)[qsarr[i]] = function (selectors: string) {
          if (/(^|,)\s*:scope/.test(selectors)) {
            let id = this.id;
            this.id = 'ID_' + Date.now();
            selectors = selectors.replace(/((^|,)\s*):scope/g, '$1#' + this.id);
            let result = (window.document as any)[qsarr[i]](selectors);
            this.id = id;
            return result;
          } else {
            return nativ.call(this, selectors);
          }
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
    const clsarr = element.className.split(' ');
    return clsarr.indexOf(cls) > -1 ? true : false;
  };
  const AMegMen_AddClass = (element: HTMLElement, cls: string) => {
    let clsarr = cls.split(' ');
    for (let i = 0; i < clsarr.length; i++) {
      if (!AMegMen_HasClass(element, clsarr[i])) {
        element.className += ' ' + clsarr[i];
      }
    }
    element.className = AMegMen_Trim(element.className);
  };
  const AMegMen_RemoveClass = (element: HTMLElement, cls: string) => {
    let clsarr = cls.split(' ');
    let curclass = element.className.split(' ');
    for (let i = 0; i < curclass.length; i++) {
      if (clsarr.indexOf(curclass[i]) > -1) {
        curclass.splice(i, 1);
        i--;
      }
    }
    element.className = AMegMen_Trim(curclass.join(' '));
  };

  const AMegMen = function (this: any, elemid: string, options?: any) {


    const anchorpreventclick = (event: MouseEvent) => {
      let anchor = event.target as HTMLElement;
      if (anchor && AMegMen_HasClass(anchor, 'has-subnav0')) {
        event.preventDefault();
      }
    };

    const ltopclick = (event: MouseEvent) => {
      const target = (event.target as HTMLElement);
      const closest = AMegMen_Closest(target, '.__amegmen--nav-li');
      if (!closest) {
        l0mouseleave();
        l1mouseleave();
        toggleL0Hover(false);
        toggleL1Hover(false);
        this.isl0open = false;
      }
    };

    const l0close = (event: MouseEvent) => {
      const target = (event.target as HTMLElement);
      const closest = AMegMen_Closest(target, '#' + this.elemid);
      if (!closest) {
        l0mouseleave();
        l1mouseleave();
        toggleL0Hover(false);
        toggleL1Hover(false);
        this.isl0open = false;
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

    const toggleL0Hover = (toggle: Boolean) => {
      if (toggle) {
        for (let i = 0; i < this.l0anchors.length; i++) {
          (this.l0anchors[i] as HTMLElement).addEventListener('mouseover', l0mouseover);
        }
      } else {
        for (let i = 0; i < this.l0anchors.length; i++) {
          (this.l0anchors[i] as HTMLElement).removeEventListener('mouseover', l0mouseover);
        }
      }
    };

    const openL0Subnav = (event: MouseEvent, eventtype: string, isl0open: Boolean) => {
      l0mouseleave();
      l1mouseleave();
      let l0anchor = event.target as HTMLElement;
      if (l0anchor) {
        AMegMen_AddClass(l0anchor, isl0open ? 'active' : '');
        let parentli0 = AMegMen_Closest(l0anchor, 'li');
        if (parentli0) {
          let subnav0 = parentli0.querySelector(':scope > section') as HTMLElement;
          if (subnav0) {
            AMegMen_AddClass(l0anchor, 'has-subnav0');
            AMegMen_AddClass(subnav0, isl0open ? 'active' : '');
            if (eventtype === 'click') {
              event.preventDefault();
            } else {
              if (l0anchor.getAttribute('data-amegmenevent') !== 'true') {
                l0anchor.addEventListener('click', anchorpreventclick);
                l0anchor.setAttribute('data-amegmenevent', 'true');
              }
            }
          }
        }
      }
    };

    const l0click = (event: MouseEvent) => {
      this.isl0open = !this.isl0open;
      openL0Subnav(event, 'click', this.isl0open);
      toggleL0Hover(this.isl0open);
    };

    const l0mouseover = (event: MouseEvent) => {
      openL0Subnav(event, 'mouseover', true);
    };

    const openL1Subnav = (event: MouseEvent, eventtype: string, isl1open: Boolean) => {
      l1mouseleave();
      let l1anchor = event.target as HTMLElement;
      if (l1anchor) {
        AMegMen_AddClass(l1anchor, isl1open ? 'active' : '');
        let parentli1 = AMegMen_Closest(l1anchor, 'li');
        if (parentli1) {
          let subnav1 = parentli1.querySelector(':scope > section') as HTMLElement;
          if (subnav1) {
            AMegMen_AddClass(l1anchor, 'has-subnav1');
            AMegMen_AddClass(subnav1, isl1open ? 'active' : '');
            if (eventtype === 'click') {
              event.preventDefault();
            } else {
              if (l1anchor.getAttribute('data-amegmenevent') !== 'true') {
                l1anchor.addEventListener('click', anchorpreventclick);
                l1anchor.setAttribute('data-amegmenevent', 'true');
              }
            }
          }
        }
      }
    }

    const l1mouseleave = (event?: MouseEvent) => {
      const anchorl1 = AMegMen_ArrayCall((this.elem as HTMLElement).querySelectorAll('.__amegmen--nav-l1'));
      for (let i = 0; i < anchorl1.length; i++) {
        AMegMen_RemoveClass(anchorl1[i], 'active');
      }
      const subnav2 = AMegMen_ArrayCall((this.elem as HTMLElement).querySelectorAll('.__amegmen--subnav-l1'));
      for (let i = 0; i < subnav2.length; i++) {
        AMegMen_RemoveClass(subnav2[i], 'active');
      }
    };

    const toggleL1Hover = (toggle: Boolean) => {
      if (toggle) {
        for (let i = 0; i < this.l1anchors.length; i++) {
          (this.l1anchors[i] as HTMLElement).addEventListener('mouseover', l1mouseover);
        }
      } else {
        for (let i = 0; i < this.l1anchors.length; i++) {
          (this.l1anchors[i] as HTMLElement).removeEventListener('mouseover', l1mouseover);
        }
      }
    };

    const l1click = (event: MouseEvent) => {
      this.isl1open = !this.isl1open;
      openL1Subnav(event, 'click', this.isl1open);
      toggleL1Hover(this.isl1open);
    };

    const l1mouseover = (event: MouseEvent) => {
      openL1Subnav(event, 'mouseover', true);
    };

    const initiateSubnav1 = (subnav1: HTMLElement) => {
      const subnav1cols = AMegMen_ArrayCall(subnav1.querySelectorAll(':scope > .__c--amegmen-col'));
      const subnav2 = AMegMen_ArrayCall(subnav1.querySelectorAll('section'));
      const l1anchors = AMegMen_ArrayCall(subnav1.querySelectorAll(':scope > .__c--amegmen-col > .__c--amegmen-col-spacer > ul > li > a'));
      for (let i = 0; i < subnav1cols.length; i++) {
        AMegMen_AddClass(subnav1cols[i], '__c--a-col-' + subnav1cols.length);
        (subnav1cols[i] as HTMLElement).addEventListener('mouseleave', l1mouseleave);
      }
      if (subnav2.length > 0) {
        AMegMen_AddClass(subnav1, '__c--a-shift-' + (5 - subnav1cols.length));
        for (let i = 0; i < subnav2.length; i++) {
          AMegMen_AddClass(subnav2[i], '__amegmen--subnav-l1 __c--a-width-' + (5 - subnav1cols.length));
        }
        for (let i = 0; i < l1anchors.length; i++) {
          AMegMen_AddClass(l1anchors[i], '__amegmen--nav-l1');
          this.l1anchors.push(l1anchors[i]);
          (l1anchors[i] as HTMLElement).addEventListener('click', l1click);
          // (l1anchors[i] as HTMLElement).addEventListener('mouseover', l1mouseover);

          const parentl1li = AMegMen_Closest(l1anchors[i], 'li');
          if (parentl1li) {
            const l2cols = AMegMen_ArrayCall(parentl1li.querySelectorAll(':scope > section .__c--amegmen-col'));
            const l2anchors = AMegMen_ArrayCall(parentl1li.querySelectorAll(':scope > section .__c--amegmen-col > .__c--amegmen-col-spacer > ul > li > a'));
            for (let j = 0; j < l2cols.length; j++) {
              AMegMen_AddClass(l2cols[j], '__c--a-col-' + l2cols.length);
            }
            for (let j = 0; j < l2anchors.length; j++) {
              AMegMen_AddClass(l2anchors[j], '__amegmen--nav-l2');
            }
          }
        }
      }
    }

    this.elemid = elemid;
    this.elem = document.getElementById(elemid);

    const init = () => {

      this.isl0open = false;
      this.isl1open = false;

      const l0sections = this.elem.querySelectorAll(':scope > ul > li > section');
      const l0Li = this.elem.querySelectorAll(':scope > ul > li');
      this.l0sections = AMegMen_ArrayCall(l0sections);

      const l0anchors = this.elem.querySelectorAll(':scope > ul > li > a');
      this.l0anchors = AMegMen_ArrayCall(l0anchors);
      this.l1anchors = [];

      (document as HTMLDocument).addEventListener('click', l0close);
      (this.elem as HTMLElement).addEventListener('click', ltopclick);
      // (this.elem as HTMLElement).addEventListener('mouseleave', l0mouseleave);

      for (let i = 0; i < this.l0sections.length; i++) {
        AMegMen_AddClass(this.l0sections[i], '__amegmen--subnav-l0');
        let subnav1 = (this.l0sections[i] as HTMLElement).querySelector(':scope > nav')
        if (subnav1) {
          initiateSubnav1(subnav1 as HTMLElement);
        }
      }

      for (let i = 0; i < l0Li.length; i++) {
        AMegMen_AddClass(l0Li[i], '__amegmen--nav-li');
      }

      for (let i = 0; i < this.l0anchors.length; i++) {
        AMegMen_AddClass(this.l0anchors[i], '__amegmen--nav-l0');
        // (this.l0anchors[i] as HTMLElement).addEventListener('mouseover', l0mouseover);
        (this.l0anchors[i] as HTMLElement).addEventListener('click', l0click);
      }
    };

    if (this.elem) {
      init();
    }

  };
  AMegMen_QSQSAScope();
  (window as any).AMegMen = AMegMen;

}(window, document));
