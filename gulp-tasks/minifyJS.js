import gulp from 'gulp';
import rename from 'gulp-rename';
import replace from 'gulp-replace';
import terser from 'gulp-terser';
import ts from 'gulp-typescript';

const tsProject = ts.createProject('tsconfig.json');

const minifyJS = () =>
  tsProject
    .src()
    .pipe(tsProject())
    .js.pipe(
      replace(
        /(from\s+['"]|import\s+['"])(\.{1,2}\/[^'"]*)(?<!\.[cm]?js)(?<!\/)(['"])/g,
        '$1$2.js$3',
      ),
    )
    .pipe(replace(/(require\(|import\s+['"])(?!.*\.([cm]?js))(\.{1,2}\/[^'"]*)/g, '$1$3.js'))
    .pipe(terser())
    .pipe(rename({ suffix: '.min' }))
    .pipe(gulp.dest('./dist'));

export default minifyJS;
