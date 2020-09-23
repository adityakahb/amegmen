# AMegMen

AMegMen is a Megamenu plugin written entirely in JavaScript.

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
  -- Root -> Level 0 UL/LI -> Level 0 Anchor and Level 0 Subnav Panel
  -- Level 0 Subnav Panel -> Level 0 Landing link and Level 1 Panel Columns
  -- Level 1 Panel Columns -> Level 1 UL/LI -> Level 1 Anchor and Level 2 Subnav Panel
  -- Level 2 Subnav Panel -> Level 1 Landing link and Level 2 a Single Panel Column
  -- Level 2 Panel Column -> Level 2 UL/LI -> Level 2 Anchor
  - All Subnav panels must have columns in them, to position the 3rd level accurately.
  - Mobile devices don't support Hover, so it is separated from the default behavior. If required, it can be enabled through an option.
  - Right to Left is based on just a CSS property `direction: rtl`, and it may not be supported on old browsers.
  - Actual code resides in Typescript, which is compiled to Javascript (ES3 and NO Module code generation) and is compressed through Uglify-JS.
  - NO Normalize or Reset CSS included.
  - Styles reside in SASS files with minimum configurations and changes mobile to desktop view at 768px. The styles are compressed through UglifyCSS.

## Installation

### HTML
```html
<nav id="__amegmen_root">
	<!-- Root Element -->
	<button class="__amegmen--toggle-cta">
		<!-- Button (on mobile) to toggle Megamenu on mobile device -->
		Menu
	</button>
	<div class="__amegmen--canvas">
		<!-- Off-Canvas which slides on mobile device -->
		<header>
			<!-- Nav Header containing a Button to close the Megamenu -->
			<button class="__amegmen--close-cta">
				<!-- Button (on mobile) to close the Megamenu -->
				Close
			</button>
		</header>
		<section class="__amegmen--main">
			<!-- Main section containing Megamenu navigation -->
			<ul>
				<!-- Level 0 UL/LI -->
				<li>
					<a href="#">Risus</a> <!-- Level 0 anchor -->
					<section class="__amegmen--panel">
						<!-- Level 0 Megamenu panel -->
						<div class="__amegmen--landing">
							<!-- Container for Level 0 anchor's landing page url -->
							<button class="__amegmen--main-cta">Main</button> <!-- Button (on mobile) to go main menu (level 0)  -->
							<a href="#Tempor sit maecenas">Landing page: Tempor sit maecenas</a>
							<!-- Level 0 anchor's landing page url -->
						</div>
						<nav>
							<!-- Level 1 navigation -->
							<div class="__amegmen--col">
								<!-- Level 1 navigation column 0 -->
								<ul>
									<!-- Level 1 UL/LI -->
									<li>
										<a href="#">Amet nunc dis Sem</a> <!-- Level 1 anchor -->
										<section class="__amegmen--panel">
											<!-- Level 1 Megamenu panel -->
											<div class="__amegmen--landing">
												<!-- Container for Level 1 anchor's landing page url -->
												<button class="__amegmen--back-cta">Back</button>
												<!-- Button (on mobile) to go previous menu (level 1)  -->
												<a href="#">Landing page: Tempor consectetur gravida Malesuada penatibus Purus</a>
												<!-- Level 1 anchor's landing page url -->
											</div>
											<nav>
												<!-- Level 2 navigation -->
												<div class="__amegmen--col">
													<!-- Level 2 navigation column -->
													<ul>
														<!-- Level 2 UL/LI -->
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
									.
									.
									.
								</ul>
							</div>
							<div class="__amegmen--col">
								<!-- Level 1 navigation column 1 -->
								<ul>
									<!-- Level 1 UL/LI -->
									<li>
										<a href="#">Et elementum gravida Porttitor</a>
										<section class="__amegmen--panel">
											<div class="__amegmen--landing"><button class="__amegmen--back-cta">Back</button>
												<a href="#">Landing page: Magnis congue vehicula Aliquam turpis</a>
											</div>
											<nav>
												<div class="__amegmen--col">
													<ul>
														<li><a href="#">Pulvinar consectetur elementum Phasellus dolor</a></li>
														<li><a href="#">Nullam vivamus turpis Ut</a></li>
														<li><a href="#">Tempus et proin</a></li>
														<li><a href="#">Maximus non nunc Porta in</a></li>
														.
														.
														.
													</ul>
												</div>
											</nav>
										</section>
									</li>
								</ul>
							</div>
						</nav>
					</section>
				</li>
			</ul>
		</section>
	</div>
</nav>
```

### JavaScript
```html
<script src="path/to/amegmen.min.js"></script>
````
```javascript
var amegmen_instance = AMegMen.Root.getInstance();
var amegmen_options = {};
amegmen_instance.init('#__amegmen_root', amegmen_options);
```

### CSS
```html
<link href="path/to/amegmen.min.css" rel="stylesheet" />
```

### Options

| Option | Default | Type | Description |
| ------ | ------ | ------ | ------ |
| activeCls | `active` | CSS class | Associated with the root element and its children which get a subnav panel opened or activated |
| actOnHoverAt | `1280` | Breakpoint in Pixels | If `actOnHover` is enabled, Hover behaviour will be activated on or after this breakpoint. |
| backBtnCls | `__amegmen--back-cta` | CSS class | Associated with the Level 2 Buttons on mobile, which navigates to the Level 1 Menu. |
| closeBtnCls | `__amegmen--close-cta` | CSS class | Associated with the Button on mobile, which closes the Megamenu. |
| colCls | `__amegmen--col` | CSS class | Associated with the Columns on Panels at Level 1 and level 2. |
| focusCls | `focus` | CSS class | Triggered when anchors get a focus event on them. |
| hoverCls | `hover` | CSS class | Triggered when anchors get a hover event on them. |
| idPrefix | `__amegmen_id` | ID Prefix | Some elements need an id associated with them for behavior calculation. This is a prefix string for those IDs. |
| isRTL | `false` | Boolean | Changes the direction of the Megamenu to Right to Left. Caution: It uses CSS property `direction: rtl` |
| l0AnchorCls | `__amegmen--anchor-l0` | CSS class | Associated with the links at Level 0 |
| l0PanelCls | `__amegmen--panel-l0` | CSS class | Associated with the Subnav Panel at Level 0 |
| l1AnchorCls | `__amegmen--anchor-l1` | CSS class | Associated with the links at Level 1 |
| l1PanelCls | `__amegmen--panel-l1` | CSS class | Associated with the Subnav Panel at Level 1 |
| l2AnchorCls | `__amegmen--anchor-l2` | CSS class | Associated with the links at Level 2 |
| landingCtaCls | `__amegmen--landing` | CSS class | Associated with the containers at Level 1 and 2 which contain links to parent links at Level 0 and Level 1 respectively |
| lastcolCls | `__amegmen--col-last` | CSS class | Associated with the last column at Level 1 |
| mainBtnCls | `__amegmen--main-cta` | CSS class | Associated with the Level 1 Buttons on mobile, which navigates to the Level 0 Menu.  |
| lastcolCls | `__amegmen--col-last` | CSS class | Associated with the last column at Level 1 |
| mainElementCls | `__amegmen--main` | CSS class | Associated with the Level 0 main section which contains Level 0 anchors |
| rootCls | `__amegmen` | CSS class | Associated with the Root Element |
| offcanvasCls | `__amegmen--canvas` | CSS class | Associated with the Level 0 Element which acts as a sliding canvas on mobile |
| overflowHiddenCls | `__amegmen--nooverflow` | CSS class | Associated with scrollable elements which the scrolling needs to be disabled |
| panelCls | `__amegmen--panel` | CSS class | Associated with the Subnav Panels at Level 1 and Level 2 |
| rtl_Cls | `__amegmen--r-to-l` | CSS class | If `isRTL` is enabled, this class is attached to the root element.  |
| actOnHover | `false` | Boolean | Toggles Hover behavior on or after the breakpoint specified by `actOnHoverAt` |
| supportedCols | `4` | Number | Maximum number of columns associated with Level 1 Subnav Panel |
| toggleBtnCls | `__amegmen--toggle-cta` | CSS class | Associated with the Button on mobile, which toggles the Megamenu specified by `offcanvasCls` |

### Methods

| Methods | Parameters | Description |
| ------ | ------ | ------ |
| init | CSS Selector | The Root element id or class to be passed to initialize the Megamenu. Example `#root`, `.root` |
| destroy | CSS Selector | The Root element id or class to be passed to destroy the Megamenu. Example `#root`, `.root` |
