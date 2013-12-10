module.exports = function (grunt) {

    require('load-grunt-tasks')(grunt);

    // Project configuration.
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        clean: {
            pre: [
                'css/',
                'fonts/',
                'js/',
                'img/',
                '*.html',
                'out/css/styles.min.css',
                'out/js/scripts.js'
            ],
            mid: [
                'out/css/bootstrap.css',
                'out/css/code.css',
                'out/css/robocop.css',
                'out/css/main.css',
                'out/css/styles.css',
                'out/js/bootstrap.min.js',
                'out/js/jquery.min.js',
                'out/api/',
                'out/configuration/',
                'out/guide/',
                'out/index/',
                'out/installation/'
            ],
            post: ['out/']
        },
        cssmin: {
            combine: {
                files: {
                    'out/css/styles.css': [
                        'src/files/css/main.css'
                    ]
                }
            },
            minify: {
                expand: true,
                cwd: 'out/css/',
                src: ['styles.css'],
                dest: 'out/css/',
                ext: '.min.css'
            }
        },
        concat: {
            default: {
                files: {
                    'out/js/scripts.js': ['src/files/js/jquery.min.js', 'src/files/js/bootstrap.min.js']
                }
            }
        },
        copy: {
            default: {
                expand: true,
                cwd: 'out/',
                src: '**/*',
                dest: './'
            },
	        'js-ace': {
		        expand: true,
		        flatten: true,
		        cwd: 'src/files/js/bower_components/ace-builds/src-noconflict/',
		        src: ['*'],
		        dest: 'js/'
	        },
	        'js-robocop': {
		        src: ['src/files/js/bower_components/robocop.js/dist/robocop.min.js'],
		        dest: 'js/robocop.min.js'
	        }
        },
        shell: {
            default: {
                options: {
                    stdout: true,
                    stderr: true,
                    failOnError: true
                },
                command: 'node node_modules/docpad/bin/docpad-compile generate'
            }
        }
    });

    grunt.registerTask('default', ['clean:pre', 'cssmin', 'concat', 'clean:mid', 'copy', 'clean:post']);

    grunt.registerTask('build', ['shell', 'default']);
};
