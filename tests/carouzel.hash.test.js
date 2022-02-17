const GetProperty2 = async (element, property) => {
  return await (await element.getProperty(property)).jsonValue();
};

describe('Carouzel', () => {
  jest.setTimeout(1800000);
  beforeAll(async () => {
    const indexPath = `http://localhost:3001#__carouzel_14_id_3`;
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
  test('The hash Carouzel slider', async () => {
    await new Promise((r) => setTimeout(r, 1000));
    await page.evaluate(() => {
      let __carouzel_instance = Carouzel.Root.getInstance();
      __carouzel_instance.init('#__carouzel_14', {
        trackUrlHash: true,
        appendUrlHash: true,
      });
    });
    await new Promise((r) => setTimeout(r, 500));
    let index = -1;
    let __carouzelSlides = await page.$$(
      '#__carouzel_14 [data-carouzel-slide]'
    );
    for (let i = 0; i < __carouzelSlides.length; i++) {
      classList = (await GetProperty2(__carouzelSlides[i], 'className')) || '';
      if (classList.indexOf(`__carouzel-active`) !== -1) {
        index = i;
        break;
      }
    }
    expect(index).toBe(4);
    await page.evaluate(() => {
      document
        .querySelector('#__carouzel_14 [data-carouzel-nextarrow]')
        .click();
    });
    await new Promise((r) => setTimeout(r, 1000));
    let hashVal = await page.evaluate(() => {
      return window.location.hash;
    });
    expect(hashVal).toBe('#__carouzel_14_id_4');
  });
});
