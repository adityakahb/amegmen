# Carouzel

Carouzel is a framework free light-weight carousel plugin, which is responsive, handles multiple configurations. It uses DOM hardware acceleration for animation effects.

## Homepage

[https://adityakahb.github.io/carouzel](https://adityakahb.github.io/carouzel/)

## Codesandbox Demoes

- [Simple](https://codesandbox.io/s/carouzel-simple-jt6g6?file=/index.html)
- [Multiple](https://codesandbox.io/s/carouzel-multiple-rm53q?file=/index.html)
- [Responsive](https://codesandbox.io/s/carouzel-responsive-4o4p9?file=/index.html)
- [Fade Animation](https://codesandbox.io/s/carouzel-fading-animaton-9p9jh?file=/index.html)
- [Through `data-attribute`](https://codesandbox.io/s/carouzel-using-data-attribute-wqked?file=/index.html)
- [Autoplay](https://codesandbox.io/s/carouzel-autoplay-k4tk4?file=/index.html)
- [Finite](https://codesandbox.io/s/carouzel-finite-3sy8r?file=/index.html)
- [Events & Methods](https://codesandbox.io/s/carouzel-events-and-methods-0s52x?file=/index.html)
- [Centered](https://codesandbox.io/s/carouzel-centered-jmbr4?file=/index.html)
- [Slide titles as navigation](https://codesandbox.io/s/carouzel-slide-titles-as-dots-tykcs?file=/index.html)
- [Gutter space between slides](https://codesandbox.io/s/carouzel-gutter-space-cltvd?file=/index.html)
- [Right to Left](https://codesandbox.io/s/carouzel-right-to-left-pop1y?file=/index.html)
- [Easing](https://codesandbox.io/s/carouzel-easing-vkuxo?file=/index.html)
- [Hash navigation](https://codesandbox.io/s/carouzel-hash-navigation-wppyo?file=/index.html)
- [Video](https://codesandbox.io/s/carouzel-video-z6j56?file=/index.html)

## Features

- Available in Vanilla Javascript and CommonJS module.
- Framework-free.
- Can be used as ES6 module import OR direct source.
- Mobile First and fully responsive.
- With bare minimum css (scss source included)
- Compiled through Typescript.
- Can have multiple instances with multiple configurations.
- Styled through SASS - Source included for customization.
- Has 16 easing options to go with scroll and fade effects.
- Can be navigated through keyboard arrows.
- Can be initiated manually or via `data-attribute`.
- Uses [requestAnimationFrame](https://developer.mozilla.org/en-US/docs/Web/API/window/requestAnimationFrame) for animation.
- Object.assign polyfill is added by Typescript! No other polyfills required.

## NPM

```bash
npm install carouzel
```

## Installation

### References

```html
<link href="../location/carouzel.min.css" rel="stylesheet" />
<script src="../location/carouzel.min.js" type="text/javascript"></script>
```

### Markup

```html
<section
  data-carouzel
  id="__carouzel_id"
  aria-roledescription="carousel"
  aria-label="Carouzel Implementation"
>
  <div data-carouzel-trackwrapper>
    <div data-carouzel-trackmask>
      <div data-carouzel-trackouter>
        <div data-carouzel-track aria-live="polite">
          <div
            data-carouzel-slide
            role="group"
            aria-roledescription="slide"
            aria-label="1 of 6"
          >
            01
          </div>
          <div
            data-carouzel-slide
            role="group"
            aria-roledescription="slide"
            aria-label="2 of 6"
          >
            02
          </div>
          <div
            data-carouzel-slide
            role="group"
            aria-roledescription="slide"
            aria-label="3 of 6"
          >
            03
          </div>
          <div
            data-carouzel-slide
            role="group"
            aria-roledescription="slide"
            aria-label="4 of 6"
          >
            04
          </div>
          <div
            data-carouzel-slide
            role="group"
            aria-roledescription="slide"
            aria-label="5 of 6"
          >
            05
          </div>
          <div
            data-carouzel-slide
            role="group"
            aria-roledescription="slide"
            aria-label="6 of 6"
          >
            06
          </div>
        </div>
      </div>
    </div>
    <div data-carouzel-controlswrapper>
      <button type="button" data-carouzel-previousarrow aria-label="Previous">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          height="24px"
          viewBox="0 0 24 24"
          width="24px"
          fill="#000000"
        >
          <path d="M0 0h24v24H0V0z" fill="none" />
          <path d="M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12l4.58-4.59z" />
        </svg>
      </button>
      <button type="button" data-carouzel-nextarrow aria-label="Next">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          height="24px"
          viewBox="0 0 24 24"
          width="24px"
          fill="#000000"
        >
          <path d="M0 0h24v24H0V0z" fill="none" />
          <path d="M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6-6-6z" />
        </svg>
      </button>
    </div>
  </div>
  <div data-carouzel-navigationwrapper>
    <ul data-carouzel-navigation></ul>
  </div>
</section>
```

### JavaScript

```javascript
var __carouzel_instance = Carouzel.Root.getInstance();
var __carouzel_options = {};
__carouzel_instance.init('#__carouzel_id', __carouzel_options);
```

## Options & Methods

Visit [home](https://adityakahb.github.io/carouzel/) to know more about options and methods.

### License

MIT
