import { watch, series } from 'gulp';
import buildJS from './gulp-tasks/buildJS.js';
import minifyJS from './gulp-tasks/minifyJS.js';
import cleanFiles from './gulp-tasks/cleanFiles.js';

import { devTSPath } from './gulp-tasks/__constants.js';

const cleanBuild = series(
  cleanFiles,
  //   injectRum,
  //   injectTempURL,
  //   injectCookieUsage,
  //   injectMarkups,
  //   lintTS,
  buildJS,
  minifyJS,
  //   buildBlockStyles,
  //   buildGlobalStyles,
);

const watchBuild = series(
  //   injectRum,
  //   injectTempURL,
  //   injectCookieUsage,
  //   injectMarkups,
  //   lintTS,
  buildJS,
  minifyJS,
  //   buildBlockStyles,
  //   buildGlobalStyles,
);

const watchFiles = () => {
  //   watch(markupHTMLs, series(injectMarkups));
  //   watch(devBlockScssPath, series(buildBlockStyles));
  //   watch(globalCSSPath, series(buildGlobalStyles));
  watch(devTSPath, series(buildJS));
};

// export const lintThis = lintTS;
export const build = cleanBuild;
export default series(watchBuild, watchFiles);
