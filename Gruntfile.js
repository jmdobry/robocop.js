'use strict';
module.exports = function (grunt) {

  require('load-grunt-tasks')(grunt);
  require('time-grunt')(grunt);

  var config = {
    lib: 'lib',
    test: 'test'
  };

  grunt.initConfig({
    config: config,
    pkg: grunt.file.readJSON('package.json'),
    clean: {
      pre: ['coverage', 'dist/']
    },
    watch: {
      files: [
        'lib/**/*.js',
        'test/**/*.js'
      ],
      tasks: ['build']
    },
    jshint: {
      options: {
        jshintrc: '.jshintrc',
        ignores: ['test/support/*.js']
      },
      all: [
        'Gruntfile.js',
        '<%= config.lib %>/{,*/}*.js',
        '<%= config.test %>/{,*/}*.js'
      ]
    },

    uglify: {
      second: {
        options: {
          banner: '/**\n' +
            '* @author Jason Dobry <jason.dobry@gmail.com>\n' +
            '* @file robocop.min.js\n' +
            '* @version <%= pkg.version %> - Homepage <http://jmdobry.github.io/robocop.js/>\n' +
            '* @copyright (c) 2013-2014 Jason Dobry <http://jmdobry.github.io/robocop.js>\n' +
            '* @license MIT <https://github.com/jmdobry/robocop.js/blob/master/LICENSE>\n' +
            '*\n' +
            '* @overview Define and validate rules, datatypes and schemata in Node and in the browser.\n' +
            '*/\n'
        },
        files: {
          'dist/robocop.min.js': ['dist/robocop.js']
        }
      }
    },

    mochaTest: {
      unit: {
        options: {
          reporter: 'spec'
        },
        src: ['test/support/support.js', 'test/unit/**/*.js']
      }
    },

    browserify: {
      dist: {
        options: {
          bundleOptions: {
            standalone: 'robocop'
          }
        },
        files: {
          'dist/robocop.js': ['lib/index.js']
        }
      }
    },

    karma: {
      options: {
        configFile: './karma.conf.js'
      },
      dist: {}
    },
    coveralls: {
      options: {
        coverage_dir: 'coverage'
      }
    }
  });

  grunt.registerTask('test', [
    'mochaTest:unit',
    'karma'
  ]);
  grunt.registerTask('build', ['clean', 'jshint', 'browserify', 'uglify', 'test']);
  grunt.registerTask('go', ['build', 'watch']);

  grunt.registerTask('default', ['build']);
};
