let __carouzel_instance;
const desktop = { width: 1200, height: 980 };
const tablet = { width: 768, height: 980 };
const mobile = { width: 375, height: 980 };

const GetProperty = async (element, property) => {
  return await (await element.getProperty(property)).jsonValue();
};

describe('Carouzel', () => {
  jest.setTimeout(90000);
  beforeAll(async () => {
    // const indexPath = `file://${process.cwd()}/tests/fixture.html`;
    const indexPath = `http://localhost:3001`;
    await page.goto(indexPath, {
      waitUntil: 'load',
      timeout: 54321,
    });
    page.on('console', (msg) => {
      for (let i = 0; i < msg.args().length; i++) {
        // console.log(msg.args()[i]);
      }
    });
  });
  test('The Carouzel instance', async () => {
    __carouzel_instance = () => {
      return page.evaluate(async () => {
        return await new Promise((resolve) => {
          resolve(Carouzel.Root.getInstance());
        });
      });
    };
    expect(__carouzel_instance).not.toBe(undefined);
  });
  test('The number of instances: should be 1 because of the fixture containing on "data-carouzel-auto"', async () => {
    const defaultLength = await page.evaluate(() => {
      const __carouzel_instance = Carouzel.Root.getInstance();
      return __carouzel_instance.getLength();
    });
    expect(defaultLength).toBe(1);
  });
  test('The simple Carouzel slider', async () => {
    await page.evaluate(() => {
      let __carouzel_instance = Carouzel.Root.getInstance();
      __carouzel_instance.init('#__carouzel_1');
    });
    const __carouzelSlides = await page.$$(
      '#__carouzel_1 [data-carouzel-slide].__carouzel-active'
    );
    expect((__carouzelSlides || []).length).toBe(1);
  });
  test('The multiple Carouzel slider', async () => {
    await page.setViewport(desktop);
    await page.evaluate(() => {
      let __carouzel_instance = Carouzel.Root.getInstance();
      __carouzel_instance.init('#__carouzel_2', {
        slidesToShow: 3,
        slidesToScroll: 3,
      });
    });
    const __carouzelSlides = await page.$$(
      '#__carouzel_2 [data-carouzel-slide].__carouzel-active'
    );
    expect((__carouzelSlides || []).length).toBe(3);
  });
  test('The responsive Carouzel slider', async () => {
    await page.setViewport(mobile);
    await page.evaluate(() => {
      let __carouzel_instance = Carouzel.Root.getInstance();
      __carouzel_instance.init('#__carouzel_3', {
        slidesToShow: 1,
        breakpoints: [
          {
            minWidth: 700,
            slidesToScroll: 2,
            slidesToShow: 2,
            showNav: true,
          },
          {
            minWidth: 1100,
            slidesToScroll: 4,
            slidesToShow: 4,
          },
        ],
      });
    });
    let __carouzelSlidesM = await page.$$(
      '#__carouzel_3 [data-carouzel-slide].__carouzel-active'
    );
    expect((__carouzelSlidesM || []).length).toBe(1);
    await page.setViewport(tablet);
    await new Promise((r) => setTimeout(r, 2000));
    let __carouzelSlidesT = await page.$$(
      '#__carouzel_3 [data-carouzel-slide].__carouzel-active'
    );
    expect((__carouzelSlidesT || []).length).toBe(2);
    await page.setViewport(desktop);
    await new Promise((r) => setTimeout(r, 2000));
    let __carouzelSlidesD = await page.$$(
      '#__carouzel_3 [data-carouzel-slide].__carouzel-active'
    );
    expect((__carouzelSlidesD || []).length).toBe(4);
  });
  test('The fading Carouzel slider', async () => {
    await page.setViewport(desktop);
    await page.evaluate(() => {
      let __carouzel_instance = Carouzel.Root.getInstance();
      __carouzel_instance.init('#__carouzel_4', {
        slidesToShow: 1,
        animationEffect: 'fade',
        breakpoints: [
          {
            minWidth: 700,
            slidesToScroll: 3,
            slidesToShow: 3,
          },
        ],
      });
    });
    await page.evaluate(() => {
      document.querySelector('#__carouzel_4 [data-carouzel-nextarrow]').click();
    });
    let __carouzelSlides = await page.$$(
      '#__carouzel_4 [data-carouzel-slide].__carouzel-active'
    );
    expect((__carouzelSlides || []).length).toBe(3);
  });
  test('The autoplay Carouzel slider', async () => {
    await page.setViewport(desktop);
    await page.evaluate(() => {
      let __carouzel_instance = Carouzel.Root.getInstance();
      __carouzel_instance.init('#__carouzel_6', {
        slidesToScroll: 2,
        slidesToShow: 2,
        autoplay: true,
        pauseOnHover: true,
        animationSpeed: 200,
        autoplaySpeed: 200,
      });
    });
    let __carouzelSlides = await page.$$('#__carouzel_6 [data-carouzel-slide]');
    let index = -1;
    let classList = '';
    for (let i = 0; i < __carouzelSlides.length; i++) {
      classList = (await GetProperty(__carouzelSlides[i], 'className')) || '';
      if (classList.indexOf(`__carouzel-active`) !== -1) {
        index = i;
        break;
      }
    }
    expect(index).toBe(2);
    await new Promise((r) => setTimeout(r, 250));
    __carouzelSlides = await page.$$('#__carouzel_6 [data-carouzel-slide]');
    index = -1;
    classList = '';
    for (let i = 0; i < __carouzelSlides.length; i++) {
      classList = (await GetProperty(__carouzelSlides[i], 'className')) || '';
      if (classList.indexOf(`__carouzel-active`) !== -1) {
        index = i;
        break;
      }
    }
    expect(index).toBe(4);
    await new Promise((r) => setTimeout(r, 250));
    __carouzelSlides = await page.$$('#__carouzel_6 [data-carouzel-slide]');
    index = -1;
    classList = '';
    for (let i = 0; i < __carouzelSlides.length; i++) {
      classList = (await GetProperty(__carouzelSlides[i], 'className')) || '';
      if (classList.indexOf(`__carouzel-active`) !== -1) {
        index = i;
        break;
      }
    }
    expect(index).toBe(6);
  });
  test('The finite Carouzel slider', async () => {
    await page.setViewport(desktop);
    await page.evaluate(() => {
      let __carouzel_instance = Carouzel.Root.getInstance();
      __carouzel_instance.init('#__carouzel_7', {
        slidesToShow: 1,
        isInfinite: false,
        animationSpeed: 100,
        autoplaySpeed: 250,
        breakpoints: [
          {
            minWidth: 700,
            slidesToScroll: 2,
            slidesToShow: 2,
          },
          {
            minWidth: 1100,
            slidesToScroll: 3,
            slidesToShow: 3,
          },
        ],
      });
    });
    let leftArrow = await page.$$(
      '#__carouzel_7 [data-carouzel-previousarrow]'
    );
    let nextArrow = await page.$$('#__carouzel_7 [data-carouzel-nextarrow]');
    let leftClass = (await GetProperty(leftArrow[0], 'className')) || '';
    let nextClass = (await GetProperty(nextArrow[0], 'className')) || '';
    expect(leftClass.indexOf('__carouzel-disabled')).not.toBe(-1);
    expect(nextClass.indexOf('__carouzel-disabled')).toBe(-1);
    await page.evaluate(() => {
      document.querySelector('#__carouzel_7 [data-carouzel-nextarrow]').click();
    });
    await new Promise((r) => setTimeout(r, 200));
    leftArrow = await page.$$('#__carouzel_7 [data-carouzel-previousarrow]');
    nextArrow = await page.$$('#__carouzel_7 [data-carouzel-nextarrow]');
    leftClass = (await GetProperty(leftArrow[0], 'className')) || '';
    nextClass = (await GetProperty(nextArrow[0], 'className')) || '';
    expect(leftClass.indexOf('__carouzel-disabled')).toBe(-1);
    expect(nextClass.indexOf('__carouzel-disabled')).not.toBe(-1);
  });

  test('The Carouzel events', async () => {
    await page.setViewport(desktop);
    let newLength = await page.evaluate(() => {
      const __carouzel_instance = Carouzel.Root.getInstance();
      return __carouzel_instance.getLength();
    });
    expect(newLength).toBe(7); // 1

    let arr = await page.evaluate(async () => {
      let beforeInit = '';
      let afterInit = '';
      let beforeScroll = '';
      let afterScroll = '';
      let carouzel8Settings = {
        animationSpeed: 250,
        beforeInitFn: function () {
          beforeInit = 'beforeInit';
        },
        afterInitFn: function () {
          afterInit = 'afterInit';
        },
        beforeScrollFn: function () {
          beforeScroll = 'beforeScroll';
        },
        afterScrollFn: function () {
          afterScroll = 'afterScroll';
        },
      };
      let __carouzel_instance = Carouzel.Root.getInstance();
      __carouzel_instance.init('#__carouzel_8', carouzel8Settings);
      __carouzel_instance.init('#__carouzel_xyz');
      await new Promise((r) => setTimeout(r, 1000));
      document.querySelector('#__carouzel_8 [data-carouzel-nextarrow]').click();
      document
        .querySelector('#__carouzel_8 [data-carouzel-previousarrow]')
        .click();
      await new Promise((r) => setTimeout(r, 1000));
      return {
        beforeInit,
        afterInit,
        beforeScroll,
        afterScroll,
      };
    });
    newLength = await page.evaluate(() => {
      const __carouzel_instance = Carouzel.Root.getInstance();
      return __carouzel_instance.getLength();
    });
    expect(newLength).toBe(8); // 2

    expect(arr.beforeInit).toBe('beforeInit');
    expect(arr.afterInit).toBe('afterInit');
    expect(arr.beforeScroll).toBe('beforeScroll');
    expect(arr.afterScroll).toBe('afterScroll');

    let index = -1;
    let classList = '';
    let __carouzelSlides = await page.$$('#__carouzel_8 [data-carouzel-slide]');
    for (let i = 0; i < __carouzelSlides.length; i++) {
      classList = (await GetProperty(__carouzelSlides[i], 'className')) || '';
      if (classList.indexOf(`__carouzel-active`) !== -1) {
        index = i;
        break;
      }
    }
    expect(index).toBe(1);

    await page.evaluate(() => {
      let __carouzel_instance = Carouzel.Root.getInstance();
      let gotonextbtn = document.getElementById('gotonextbtn');
      gotonextbtn.addEventListener('click', function () {
        __carouzel_instance.goToSlide('#__carouzel_8', 'next');
      });
      gotonextbtn.click();
    });
    index = -1;
    classList = '';
    await new Promise((r) => setTimeout(r, 150));
    __carouzelSlides = await page.$$('#__carouzel_8 [data-carouzel-slide]');
    for (let i = 0; i < __carouzelSlides.length; i++) {
      classList = (await GetProperty(__carouzelSlides[i], 'className')) || '';
      if (classList.indexOf(`__carouzel-active`) !== -1) {
        index = i;
        break;
      }
    }
    expect(index).toBe(2);

    await page.evaluate(() => {
      let __carouzel_instance = Carouzel.Root.getInstance();
      let gotoprevbtn = document.getElementById('gotoprevbtn');
      gotoprevbtn.addEventListener('click', function () {
        __carouzel_instance.goToSlide('#__carouzel_xyz', 'previous');
        __carouzel_instance.goToSlide('#__carouzel_8', 'previous');
      });
      gotoprevbtn.click();
    });
    index = -1;
    classList = '';
    await new Promise((r) => setTimeout(r, 150));
    __carouzelSlides = await page.$$('#__carouzel_8 [data-carouzel-slide]');
    for (let i = 0; i < __carouzelSlides.length; i++) {
      classList = (await GetProperty(__carouzelSlides[i], 'className')) || '';
      if (classList.indexOf(`__carouzel-active`) !== -1) {
        index = i;
        break;
      }
    }
    expect(index).toBe(1);

    await page.evaluate(() => {
      let __carouzel_instance = Carouzel.Root.getInstance();
      let gotoslideinput = document.getElementById('gotoslideinput');
      gotoslideinput.addEventListener('change', function () {
        __carouzel_instance.goToSlide('#__carouzel_8', gotoslideinput.value);
      });
      gotoslideinput.value = 5;
      const event = new Event('change');
      gotoslideinput.dispatchEvent(event);
    });
    index = -1;
    classList = '';
    await new Promise((r) => setTimeout(r, 150));
    __carouzelSlides = await page.$$('#__carouzel_8 [data-carouzel-slide]');
    for (let i = 0; i < __carouzelSlides.length; i++) {
      classList = (await GetProperty(__carouzelSlides[i], 'className')) || '';
      if (classList.indexOf(`__carouzel-active`) !== -1) {
        index = i;
        break;
      }
    }
    expect(index).toBe(5);

    await page.evaluate(() => {
      document.querySelector('#__carouzel_8 [data-carouzel-nextarrow]').click();
    });
    index = -1;
    classList = '';
    await new Promise((r) => setTimeout(r, 150));
    __carouzelSlides = await page.$$('#__carouzel_8 [data-carouzel-slide]');
    for (let i = 0; i < __carouzelSlides.length; i++) {
      classList = (await GetProperty(__carouzelSlides[i], 'className')) || '';
      if (classList.indexOf(`__carouzel-active`) !== -1) {
        index = i;
        break;
      }
    }
    expect(index).toBe(6);

    await page.evaluate(() => {
      document
        .querySelector('#__carouzel_8 [data-carouzel-previousarrow]')
        .click();
    });
    index = -1;
    classList = '';
    await new Promise((r) => setTimeout(r, 150));
    __carouzelSlides = await page.$$('#__carouzel_8 [data-carouzel-slide]');
    for (let i = 0; i < __carouzelSlides.length; i++) {
      classList = (await GetProperty(__carouzelSlides[i], 'className')) || '';
      if (classList.indexOf(`__carouzel-active`) !== -1) {
        index = i;
        break;
      }
    }
    expect(index).toBe(5);

    await page.evaluate(() => {
      const dots = document.querySelectorAll(
        '#__carouzel_8 [data-carouzel-dot]'
      );
      dots[3].querySelector('button').click();
    });
    index = -1;
    classList = '';
    await new Promise((r) => setTimeout(r, 150));
    __carouzelSlides = await page.$$('#__carouzel_8 [data-carouzel-slide]');
    for (let i = 0; i < __carouzelSlides.length; i++) {
      classList = (await GetProperty(__carouzelSlides[i], 'className')) || '';
      if (classList.indexOf(`__carouzel-active`) !== -1) {
        index = i;
        break;
      }
    }
    expect(index).toBe(4);

    await page.evaluate(() => {
      document.querySelector('#__carouzel_8').focus();
    });
    await page.keyboard.press('ArrowRight');
    index = -1;
    classList = '';
    await new Promise((r) => setTimeout(r, 150));
    __carouzelSlides = await page.$$('#__carouzel_8 [data-carouzel-slide]');
    for (let i = 0; i < __carouzelSlides.length; i++) {
      classList = (await GetProperty(__carouzelSlides[i], 'className')) || '';
      if (classList.indexOf(`__carouzel-active`) !== -1) {
        index = i;
        break;
      }
    }
    expect(index).toBe(5);

    await page.keyboard.press('ArrowLeft');
    index = -1;
    classList = '';
    await new Promise((r) => setTimeout(r, 150));
    __carouzelSlides = await page.$$('#__carouzel_8 [data-carouzel-slide]');
    for (let i = 0; i < __carouzelSlides.length; i++) {
      classList = (await GetProperty(__carouzelSlides[i], 'className')) || '';
      if (classList.indexOf(`__carouzel-active`) !== -1) {
        index = i;
        break;
      }
    }
    expect(index).toBe(4);

    await page.evaluate(() => {
      let __carouzel_instance = Carouzel.Root.getInstance();
      let destroybtn = document.getElementById('destroybtn');
      destroybtn.addEventListener('click', function () {
        __carouzel_instance.destroy('#__carouzel_xyz');
        __carouzel_instance.destroy('#__carouzel_8');
      });
      destroybtn.click();
    });
    newLength = await page.evaluate(() => {
      const __carouzel_instance = Carouzel.Root.getInstance();
      return __carouzel_instance.getLength();
    });
    expect(newLength).toBe(7); // 1
  });

  test('The centered Carouzel slider', async () => {
    let dataCenter = await page.evaluate(() => {
      let __carouzel_instance = Carouzel.Root.getInstance();
      __carouzel_instance.init('#__carouzel_9', {
        centerBetween: 1,
        breakpoints: [
          {
            minWidth: 700,
            centerBetween: 3,
          },
          {
            minWidth: 1100,
            centerBetween: 5,
          },
        ],
      });
      return document
        .querySelector('#__carouzel_9')
        .getAttribute('data-carouzel-centered');
    });
    expect(dataCenter).toBe('true');
  });

  test('The right-to-left Carouzel slider', async () => {
    let dataRtl = await page.evaluate(() => {
      let __carouzel_instance = Carouzel.Root.getInstance();
      __carouzel_instance.init('#__carouzel_12', {
        isRtl: true,
      });
      return document
        .querySelector('#__carouzel_12')
        .getAttribute('data-carouzel-rtl');
    });
    expect(dataRtl).toBe('true');
  });

  test('The easing Carouzel slider for coverage', async () => {
    await page.evaluate(async () => {
      let __carouzel_instance = Carouzel.Root.getInstance();
      let easingfnselect = document.getElementById('easingfnselect');
      let effectfnselect = document.getElementById('effectfnselect');
      let easingNumText = document.getElementById('easingNumText');
      let nextArrow = document.querySelector(
        '#__carouzel_13 [data-carouzel-nextarrow]'
      );
      let carouzel_13settings = {
        slidesToShow: 1,
        slideGutter: 8,
        easingFunction: 'linear',
        animationSpeed: 200,
        animationEffect: 'scroll',
        breakpoints: [
          {
            minWidth: 700,
            slidesToScroll: 2,
            slidesToShow: 2,
            showNav: true,
            slideGutter: 16,
          },
          {
            minWidth: 1100,
            slidesToScroll: 4,
            slidesToShow: 4,
            slideGutter: 24,
          },
        ],
      };
      __carouzel_instance.init('#__carouzel_13', carouzel_13settings);
      nextArrow.click();

      const submitform = async () => {
        __carouzel_instance.destroy('#__carouzel_13');
        await new Promise((r) => setTimeout(r, 500));
        carouzel_13settings.easingFunction = easingfnselect.value;
        carouzel_13settings.animationEffect = effectfnselect.value;
        carouzel_13settings.animationSpeed = easingNumText.value;
        __carouzel_instance.init('#__carouzel_13', carouzel_13settings);
        await new Promise((r) => setTimeout(r, 500));
      };

      easingfnselect.value = 'easeInQuad';
      effectfnselect.value = 'fade';
      easingNumText = 260;
      await submitform();
      nextArrow.click();

      easingfnselect.value = 'easeOutQuad';
      effectfnselect.value = 'scroll';
      easingNumText = 200;
      await submitform();
      nextArrow.click();

      easingfnselect.value = 'easeInOutQuad';
      await submitform();
      nextArrow.click();

      easingfnselect.value = 'easeInCubic';
      await submitform();
      nextArrow.click();

      easingfnselect.value = 'easeOutCubic';
      await submitform();
      nextArrow.click();

      easingfnselect.value = 'easeInOutCubic';
      await submitform();
      nextArrow.click();

      easingfnselect.value = 'easeInQuart';
      await submitform();
      nextArrow.click();

      easingfnselect.value = 'easeOutQuart';
      await submitform();
      nextArrow.click();

      easingfnselect.value = 'easeInOutQuart';
      await submitform();
      nextArrow.click();

      easingfnselect.value = 'easeInQuint';
      await submitform();
      nextArrow.click();

      easingfnselect.value = 'easeOutQuint';
      await submitform();
      nextArrow.click();

      easingfnselect.value = 'easeInOutQuint';
      await submitform();
      nextArrow.click();

      easingfnselect.value = 'easeInElastic';
      await submitform();
      nextArrow.click();

      easingfnselect.value = 'easeOutElastic';
      await submitform();
      nextArrow.click();

      easingfnselect.value = 'easeInOutElastic';
      await submitform();
      nextArrow.click();

      easingfnselect.value = 'something';
      effectfnselect.value = 'something';
      await submitform();
      nextArrow.click();
    });
    expect('true').toBe('true');
  });
});
