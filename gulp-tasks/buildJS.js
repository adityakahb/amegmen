import gulp from 'gulp';
import replace from 'gulp-replace';
import sourcemaps from 'gulp-sourcemaps';
import ts from 'gulp-typescript';

const tsProject = ts.createProject('tsconfig.json');

const buildJS = () =>
  tsProject
    .src()
    .pipe(sourcemaps.init())
    .pipe(tsProject())
    .js.pipe(
      replace(
        /(from\s+['"]|import\s+['"])(\.{1,2}\/[^'"]*)(?<!\.[cm]?js)(?<!\/)(['"])/g,
        '$1$2.js$3',
      ),
    )
    .pipe(replace(/(require\(|import\s+['"])(?!.*\.([cm]?js))(\.{1,2}\/[^'"]*)/g, '$1$3.js'))
    .pipe(sourcemaps.write('./'))
    .pipe(gulp.dest('./dist'));

export default buildJS;
