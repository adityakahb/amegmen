const browserSync = require(`browser-sync`).create();
const cleanCSS = require(`gulp-clean-css`);
const closureCompiler = require('google-closure-compiler').gulp();
const fileinclude = require(`gulp-file-include`);
const gulp = require(`gulp`);
const gulpCopy = require('gulp-copy');
const jest = require('gulp-jest').default;
const jestconfig = require(`./jest.config`);
const rename = require(`gulp-rename`);
const sass = require(`gulp-sass`)(require(`sass`));
const sourcemaps = require(`gulp-sourcemaps`);
const ts = require(`gulp-typescript`);
const tsProject = ts.createProject(`tsconfig.json`);

gulp.task(`sass-amegmen`, function () {
  return gulp
    .src(`./src/sass/amegmen/amegmen.scss`)
    .pipe(sourcemaps.init())
    .pipe(sass.sync().on(`error`, sass.logError))
    .pipe(
      sourcemaps.write(`.`, {
        includeContent: false,
        sourceRoot: `./dist/styles`,
      })
    )
    .pipe(gulp.dest(`./dist/styles`));
});

gulp.task(`sass-site`, function () {
  return gulp
    .src(`./src/sass/sass-site/site.scss`)
    .pipe(sass.sync().on(`error`, sass.logError))
    .pipe(gulp.dest(`./dist/styles`));
});

gulp.task(`minify-css`, () => {
  return gulp
    .src([`./dist/styles/amegmen.css`, `./dist/styles/site.css`])
    .pipe(cleanCSS())
    .pipe(rename({ suffix: `.min` }))
    .pipe(gulp.dest(`./dist/styles`));
});

gulp.task(`uglifyjs`, function () {
  return gulp
    .src('./dist/scripts/amegmen.js', { base: './' })
    .pipe(
      closureCompiler(
        {
          compilation_level: 'SIMPLE',
          warning_level: 'VERBOSE',
          language_in: 'ECMASCRIPT3',
          language_out: 'ECMASCRIPT3',
          js_output_file: 'amegmen.min.js',
        },
        {
          platform: ['native', 'java', 'javascript'],
        }
      )
    )
    .pipe(gulp.dest('./dist/scripts'));
});

gulp.task(`typescript`, function () {
  return tsProject
    .src()
    .pipe(sourcemaps.init())
    .pipe(tsProject())
    .pipe(
      sourcemaps.write(`.`, {
        includeContent: false,
        sourceRoot: `./dist/scripts`,
      })
    )
    .pipe(gulp.dest(`dist/scripts`));
});

gulp.task(`browserSync`, function (done) {
  browserSync.init({
    files: `./index.html`,
    server: `./`,
  });
  done();
});

gulp.task(`fileinclude`, function () {
  return gulp
    .src([`./src/*.html`])
    .pipe(
      fileinclude({
        prefix: `@@`,
        basepath: `@file`,
      })
    )
    .pipe(gulp.dest(`./`));
});

gulp.task(
  `watch`,
  gulp.series(
    `typescript`,
    `sass-amegmen`,
    `sass-site`,
    `uglifyjs`,
    `minify-css`,
    `fileinclude`,
    `browserSync`,
    function () {
      gulp.watch(
        `./src/**/*.{html,ts,scss}`,
        gulp.series(
          `typescript`,
          `sass-amegmen`,
          `sass-site`,
          `uglifyjs`,
          `minify-css`,
          `fileinclude`
        )
      );
      browserSync.reload(`./index.html`);
    }
  )
);

gulp.task(`default`, gulp.series([`fileinclude`]));

gulp.task(`browserSync-for-test`, function (done) {
  browserSync.init({
    server: './tests',
    port: 3001,
  });
  done();
});

gulp.task(`copy-for-test`, function () {
  return gulp
    .src([
      './dist/scripts/amegmen.js',
      './dist/styles/amegmen.min.css',
      './dist/styles/site.min.css',
    ])
    .pipe(gulp.dest('./tests/resources'));
});

gulp.task(
  `test`,
  gulp.series('copy-for-test', 'browserSync-for-test', function () {
    return gulp.src('tests').pipe(jest({ ...jestconfig }));
  })
);
