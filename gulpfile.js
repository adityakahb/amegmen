const browserSync = require("browser-sync").create();
const cleanCSS = require("gulp-clean-css");
const clean = require("gulp-clean");
const fileinclude = require("gulp-file-include");
const gulp = require("gulp");
const rename = require("gulp-rename");
const replace = require("gulp-replace");
const sass = require("gulp-sass")(require("sass"));
const sourcemaps = require("gulp-sourcemaps");
const ts = require("gulp-typescript");
const tsProject = ts.createProject("tsconfig.json");
const uglify = require("gulp-uglify");

const allPaths = {
  css: "./dist/styles/amegmen.css",
  html: "src/**/*.html",
  js: "./dist/scripts/amegmen.js",
  partials: "./partials",
  sass: "./src/sass/**/*.scss",
  sass_site: "./public/index.scss",
  ts: "./src/**/amegmen.ts",
};

gulp.task("minify-css", () => {
  return gulp
    .src([allPaths.css])
    .pipe(cleanCSS())
    .pipe(rename({ suffix: ".min" }))
    .pipe(gulp.dest("./dist/styles"));
});

gulp.task("uglifyjs", function () {
  return gulp
    .src(allPaths.js, { base: "./" })
    .pipe(uglify())
    .pipe(rename({ suffix: ".min" }))
    .pipe(gulp.dest("./"));
});

gulp.task("ts", function () {
  return tsProject
    .src()
    .pipe(sourcemaps.init())
    .pipe(tsProject())
    .pipe(
      sourcemaps.write(".", {
        includeContent: false,
        sourceRoot: "./dist/scripts",
      })
    )
    .pipe(gulp.dest("dist/scripts"));
});

gulp.task("sass_site", function () {
  return gulp
    .src(allPaths.sass_site)
    .pipe(sourcemaps.init())
    .pipe(sass.sync().on("error", sass.logError))
    .pipe(gulp.dest("./"));
});

gulp.task("sass", function () {
  return gulp
    .src(allPaths.sass)
    .pipe(sourcemaps.init())
    .pipe(sass.sync().on("error", sass.logError))
    .pipe(
      sourcemaps.write(".", {
        includeContent: false,
        sourceRoot: "./dist/styles",
      })
    )
    .pipe(gulp.dest("./dist/styles"));
});

gulp.task("generatehtml", function () {
  return gulp
    .src(allPaths.html)
    .pipe(
      fileinclude({
        prefix: "@@",
        basepath: "@file",
      })
    )
    .pipe(gulp.dest("./"));
});

gulp.task(
  "html",
  gulp.series("generatehtml", function () {
    return gulp.src(allPaths.partials, { read: false }).pipe(clean());
  })
);

gulp.task(
  "serve",
  gulp.series("html", "ts", "sass", "sass_site", function () {
    browserSync.init({
      server: {
        baseDir: "./",
      },
      port: 3001,
    });

    gulp
      .watch(allPaths.html, gulp.series("html"))
      .on("change", browserSync.reload);
    gulp.watch(allPaths.ts, gulp.series("ts")).on("change", browserSync.reload);
    gulp
      .watch(allPaths.sass, gulp.series("sass"))
      .on("change", browserSync.reload);
    gulp
      .watch(allPaths.sass_site, gulp.series("sass_site"))
      .on("change", browserSync.reload);
  })
);

gulp.task("default", gulp.series("serve"));
gulp.task(
  "build",
  gulp.series("html", "ts", "sass", "sass_site", "minify-css", "uglifyjs")
);
