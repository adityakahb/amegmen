import gulp from 'gulp';
import gulpESLintNew from 'gulp-eslint-new';
import { lintingScriptsPath } from './__constants.js';

const lintTS = () =>
  gulp
    .src(lintingScriptsPath)
    .pipe(gulpESLintNew({ fix: true })) // Lint files, create fixes.
    .pipe(gulpESLintNew.fix()) // Fix files if necessary.
    .pipe(gulpESLintNew.format()) // Output lint results to the console.
    .pipe(gulpESLintNew.failAfterError()); // Exit with an error if problems are found.

export default lintTS;
