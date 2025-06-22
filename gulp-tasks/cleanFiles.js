import { deletePaths } from './__constants.js';
import clean from 'gulp-clean';
import gulp from 'gulp';

const cleanFiles = () => gulp.src(deletePaths, { read: false, allowEmpty: true }).pipe(clean());

export default cleanFiles;
