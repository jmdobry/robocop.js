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
		// these folders will no longer be checked into development branches
		clean: {
			pre: ['dist/']
		},
		jshint: {
			options: {
				jshintrc: '.jshintrc'
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
						'* @copyright (c) 2013 Jason Dobry <http://jmdobry.github.io/robocop.js>\n' +
						'* @license MIT <https://github.com/jmdobry/robocop.js/blob/master/LICENSE>\n' +
						'*\n' +
						'* @overview Object inspector and schema validator for Node.js and the browser.\n' +
						'*/\n'
				},
				files: {
					'dist/robocop.min.js': ['dist/robocop.js']
				}
			}
		},

		shell: {
			unit: {
				options: {
					stdout: true,
					stderr: true,
					failOnError: true,
					execOptions: {
						env: {
							NODE_ENV: 'test'
						}
					}
				},
				command: 'node test/unit/runner.js'
			}
		},

		mochaTest: {
			unit: {
				options: {
					reporter: 'dot'
				},
				src: ['test/support/support.js', 'test/unit/**/*.js']
			}
		},

		browserify: {
			dist: {
				options: {
					standalone: 'robocop'
				},
				files: {
					'dist/robocop.js': ['lib/index.js']
				}
			}
		}
	});

	grunt.registerTask('test-unit', ['mochaTest:unit']);
	grunt.registerTask('test', ['test-unit']);
	grunt.registerTask('build', ['clean', 'jshint', 'test', 'browserify', 'uglify']);

	grunt.registerTask('default', ['build']);
};