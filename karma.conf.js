// Karma configuration
// Generated on Sat Oct 06 2018 10:51:29 GMT-0500 (Central Daylight Time)

module.exports = function(config) {
  config.set({

    // base path that will be used to resolve all patterns (eg. files, exclude)
    basePath: '',


    // frameworks to use
    // available frameworks: https://npmjs.org/browse/keyword/karma-adapter
    frameworks: ['jasmine', 'viewport'],


    // list of files / patterns to load in the browser
    files: [
      'dist/amegmen/styles/amegmen.min.css',
      'dist/amegmen/scripts/amegmen.js',
      'spec/amegmen.spec.js'
    ],


    // list of files / patterns to exclude
    exclude: [
    ],


    // preprocess matching files before serving them to the browser
    // available preprocessors: https://npmjs.org/browse/keyword/karma-preprocessor
    preprocessors: {
      'dist/amegmen/scripts/amegmen.js': ['coverage']
    },

    plugins: [
        require('karma-jasmine'),
        require('karma-chrome-launcher'),
        require('karma-ie-launcher'),
        require('karma-spec-reporter'),
        require('karma-jasmine-html-reporter'),
        require('karma-coverage'),
        require('karma-viewport')
    ],

    // test results reporter to use
    // possible values: 'dots', 'progress'
    // available reporters: https://npmjs.org/browse/keyword/karma-reporter
    reporters: ['coverage', 'spec', 'kjhtml'],


    // web server port
    port: 9876,


    // enable / disable colors in the output (reporters and logs)
    colors: true,


    // level of logging
    // possible values: config.LOG_DISABLE || config.LOG_ERROR || config.LOG_WARN || config.LOG_INFO || config.LOG_DEBUG
    logLevel: config.LOG_DISABLE,


    // enable / disable watching file and executing tests whenever any file changes
    autoWatch: true,

    coverageReporter: {
      type: 'html',
      dir: 'coverage/'
      // Would output the results into: .'/coverage/'
    },

    // start these browsers
    // available browser launchers: https://npmjs.org/browse/keyword/karma-launcher
    browsers: ['Chrome'],

    client: {
      clearContext: false,
      jasmine: {
        random: false // disable the random running order
      }
    },


    // Continuous Integration mode
    // if true, Karma captures browsers, runs the tests and exits
    singleRun: false,

    // Concurrency level
    // how many browser should be started simultaneous
    concurrency: Infinity,
  })
}
