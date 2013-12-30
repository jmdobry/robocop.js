module.exports = function (config) {
    config.set({
        basePath: './',
        frameworks: ['mocha', 'chai', 'sinon'],
        browsers: ['Firefox', 'PhantomJS'],
        files: [
            'dist/robocop.js',
            'test/support/karma.start.js',
            'test/karma/**/*.js'
        ],
        captureTimeout: 60000,
        colors: true,
        exclude: ['dist/'],
        logLevel: config.LOG_INFO,
        port: 9876,
        plugins: [
            'karma-chrome-launcher',
            'karma-firefox-launcher',
            'karma-phantomjs-launcher',
            'karma-mocha',
            'karma-chai',
            'karma-sinon',
            'karma-coverage'
        ],
        runnerPort: 9100,
        singleRun: true,
        autoWatch: false,
        coverageReporter: {
            type: 'lcov',
            dir: 'coverage/'
        },
        preprocessors: {
            'dist/robocop.js': ['coverage']
        },
        reporters: ['progress', 'coverage']
    });
};
