# AMegMen

AMegMen (Accessible MegaMenu) is an Keyboard accessible, jQuery-free and Framework-free MegaMenu plugin which is fully responsive, and supports multiple levels.

## Demo

[https://adityakahb.github.io/amegmen](https://adityakahb.github.io/amegmen/)

## Features

- Written in Vanilla Javascript
- Framework-free
- Can be navigated through Tab Key
- Supports 3 levels
- Supports Click and Hover behaviors
- Supports Right to Left UI
- Fully responsive
- With bare minimum css (with no icons, reset, normalize, custom fonts or images)
- Can have multiple instances with multiple configurations
- Compiled through Typescript
- Styled through SASS (Mobile first and with one breakpoint)

## Development Points

Since AMegMen supports 3 levels, following points are considered during the development:

- Levels start from 0, just like and array.
  - Root -> Level 0 UL/LI -> Level 0 Anchor and Level 0 Subnav Panel
  - Level 0 Subnav Panel -> Level 0 Landing link and Level 1 Panel Columns
  - Level 1 Panel Columns -> Level 1 UL/LI -> Level 1 Anchor and Level 2 Subnav Panel
  - Level 2 Subnav Panel -> Level 1 Landing link and Level 2 a Single Panel Column
  - Level 2 Panel Column -> Level 2 UL/LI -> Level 2 Anchor
- All Subnav panels must have columns in them, to position the 3rd level accurately.
- Mobile devices don't support Hover, so it is separated from the default behavior. If required, it can be enabled through an option.
- Right to Left is based on just a CSS property `direction: rtl`, and it may not be supported on old browsers.
- Actual code resides in Typescript, which is compiled to Javascript (ES3 and NO Module code generation) and is compressed through Uglify-JS.
- NO Normalize or Reset CSS included.
- Styles reside in SASS files with minimum configurations and changes mobile to desktop view at 768px. The styles are compressed through UglifyCSS.

## Installation

### NPM

```bash
npm install amegmen
```

### HTML

```html
<!-- Root Element -->
<nav id="__amegmen_root">
  <!-- Button (on mobile) to toggle Megamenu on mobile device -->
  <button class="__amegmen--toggle-cta">
    Menu
  </button>
  <!-- Off-Canvas which slides on mobile device -->
  <div class="__amegmen--canvas">
	<!-- Nav Header containing a Button to close the Megamenu -->
    <header>
	  <!-- Button (on mobile) to close the Megamenu -->
      <button class="__amegmen--close-cta">
        Close
      </button>
    </header>
	<!-- Main section containing Megamenu navigation -->
    <section class="__amegmen--main">
	  <!-- Level 0 UL/LI -->
      <ul>
        <li>
		  <!-- Level 0 anchor -->
          <a href="#">Risus</a>
		  <!-- Level 0 Megamenu panel -->
          <section class="__amegmen--panel">
			<!-- Container for Level 0 anchor's landing page url -->
            <div class="__amegmen--landing">
			  <!-- Button (on mobile) to go main menu (level 0)  -->
              <button class="__amegmen--main-cta">Main</button>
			  <!-- Level 0 anchor's landing page url -->
              <a href="#Tempor sit maecenas">Landing page: Tempor sit maecenas</a>
            </div>
			<!-- Level 1 navigation -->
            <nav>
			  <!-- Level 1 navigation column 0 -->
              <div class="__amegmen--col">
                <!-- Level 1 UL/LI -->
				<ul>
                  <li>
					<!-- Level 1 anchor -->
                    <a href="#">Amet nunc dis Sem</a>
					<!-- Level 1 Megamenu panel -->
                    <section class="__amegmen--panel">
					  <!-- Container for Level 1 anchor's landing page url -->
                      <div class="__amegmen--landing">
						<!-- Button (on mobile) to go previous menu (level 1)  -->
                        <button class="__amegmen--back-cta">Back</button>
						<!-- Level 1 anchor's landing page url -->
                        <a href="#">Landing page: Tempor consectetur gravida Malesuada penatibus Purus</a>
                      </div>
					  <!-- Level 2 navigation -->
                      <nav>
						<!-- Level 2 navigation column -->
                        <div class="__amegmen--col">
						  <!-- Level 2 UL/LI/A -->
                          <ul>
                            <li><a href="#">Vivamus maecenas ex</a></li>
                            <li><a href="#">Amet vulputate malesuada</a></li>
                            <li><a href="#">Nulla maximus malesuada Magnis metus Etiam</a></li>
                            <li><a href="#">Eget velit elit</a></li>
                            <li><a href="#">Nullam molestie vestibulum In amet In</a></li>
                            <li><a href="#">Neque congue elit Ut</a></li>
                            <li><a href="#">Nisl et lorem Nullam</a></li>
                            <li><a href="#">Nullam fermentum malesuada Ut ac Quam</a></li>
                            <li><a href="#">Erat quam a In mattis</a></li>
                          </ul>
                        </div>
                      </nav>
                    </section>
                  </li>
                  . . .
                </ul>
              </div>
			  <!-- Level 1 navigation column 1 -->
              <div class="__amegmen--col">
				<!-- Level 1 UL/LI -->
                <ul>
                  <li>
                    <!-- Level 1 anchor -->
                    <a href="#">Et elementum gravida Porttitor</a>
                    <!-- Level 1 Megamenu panel -->
                    <section class="__amegmen--panel">
                      <!-- Container for Level 1 anchor's landing page url -->
                      <div class="__amegmen--landing">
                        <!-- Button (on mobile) to go previous menu (level 1)  -->
                        <button class="__amegmen--back-cta">Back</button>
                        <!-- Level 1 anchor's landing page url -->
                        <a href="#">Landing page: Magnis congue vehicula Aliquam turpis</a>
                      </div>
                      <!-- Level 2 navigation -->
                      <nav>
                        <!-- Level 2 navigation column -->
                        <div class="__amegmen--col">
                          <!-- Level 2 UL/LI/A -->
                          <ul>
                            <li><a href="#">Pulvinar consectetur elementum Phasellus dolor</a></li>
                            <li><a href="#">Nullam vivamus turpis Ut</a></li>
                            <li><a href="#">Tempus et proin</a></li>
                            <li><a href="#">Maximus non nunc Porta in</a></li>
                            . . .
                          </ul>
                        </div>
                      </nav>
                    </section>
                  </li>
                </ul>
              </div>
              <!-- Repeat Level 1 navigation columns -->
            </nav>
          </section>
        </li>
        <!-- Repeat Repeat Level 0 LI -->
      </ul>
    </section>
  </div>
</nav>
```

### JavaScript

```html
<script src="path/to/amegmen.min.js"></script>
```

```javascript
var amegmen_instance = AMegMen.Root.getInstance();
var amegmen_options = {};
amegmen_instance.init("#__amegmen_root", amegmen_options);
/* You can destroy it as well */
amegmen_instance.destroy("#__amegmen_root");
```

### CSS

```html
<link href="path/to/amegmen.min.css" rel="stylesheet" />
```

### Options

**activeCls** - CSS Class
Default: `active`
Associated with the root element and its children which get a subnav panel opened or activated

**actOnHover** - Boolean
Default: `false`
Toggles Hover behavior on or after the breakpoint specified by `actOnHoverAt`

**actOnHoverAt** - Number
Default: `1280`
If `actOnHover` is enabled, Hover behaviour will be activated on or after this breakpoint.

**backBtnCls** - CSS Class
Default: `__amegmen--back-cta`
Associated with the Level 2 Buttons on mobile, which navigates to the Level 1 Menu.

**closeBtnCls** - CSS Class
Default: `__amegmen--close-cta`
Associated with the Button on mobile, which closes the Megamenu.

**colCls** - CSS Class
Default: `__amegmen--col`
Associated with the Columns on Panels at Level 1 and level 2.

**focusCls** - CSS Class
Default: `focus`
Triggered when focus event is fired on related elements.

**hoverCls** - CSS Class
Default: `hover`
Triggered when hover event is fired on related elements.

**idPrefix** - String
Default: `__amegmen_id`
Some elements need an id associated with them for behavior calculation. This is a prefix string for those IDs.

**isRTL** - Boolean
Default: `false`
Changes the direction of the Megamenu to Right to Left. Caution: It uses CSS property `direction: rtl`

**l0AnchorCls** - CSS Class
Default: `__amegmen--anchor-l0`
Associated with the links at Level 0

**l0PanelCls** - CSS Class
Default: `__amegmen--panel-l0`
Associated with the Subnav Panel at Level 0

**l1AnchorCls** - CSS Class
Default: `__amegmen--anchor-l1`
Associated with the links at Level 1

**l1PanelCls** - CSS Class
Default: `__amegmen--panel-l1`
Associated with the Subnav Panel at Level 1

**l2AnchorCls** - CSS Class
Default: `__amegmen--anchor-l2`
Associated with the links at Level 2

**landingCtaCls** - CSS Class
Default: `__amegmen--landing`
Associated with the containers at Level 1 and 2 which contain links to parent links at Level 0 and Level 1 respectively

**lastcolCls** - CSS Class
Default: `__amegmen--col-last`
Associated with the last column at Level 1

**mainBtnCls** - CSS Class
Default: `__amegmen--main-cta`
Associated with the Level 1 Buttons on mobile, which navigates to the Level 0 Menu.

**mainElementCls** - CSS Class
Default: `__amegmen--main`
Associated with the Level 0 main section which contains Level 0 anchors

**offcanvasCls** - CSS Class
Default: `__amegmen--canvas`
Associated with scrollable elements which the scrolling needs to be disabled

**overflowHiddenCls** - CSS Class
Default: `__amegmen--nooverflow`
Associated with scrollable elements which the scrolling needs to be disabled

**panelCls** - CSS Class
Default: `__amegmen--panel`
Associated with the Subnav Panels at Level 1 and Level 2

**rootCls** - CSS Class
Default: `__amegmen`
Associated with the Root Element

**rtl_Cls** - CSS Class
Default: `__amegmen--r-to-l`
Associated with the Root Element, if `isRTL` is enabled

**supportedCols** - Number 
Default: `4`
Maximum number of columns associated with Level 1 Subnav Panel

**toggleBtnCls** - CSS Class
Default: `__amegmen--toggle-cta`
Associated with the Button on mobile, which toggles the Megamenu specified by `offcanvasCls`


### Methods

**init**
Parameters: CSS Selector
The Root element id or class to be passed to initialize the Megamenu. Example `#root`, `.root`

**destroy**
Parameters: CSS Selector
The Root element id or class to be passed to destroy the Megamenu. Example `#root`, `.root`
