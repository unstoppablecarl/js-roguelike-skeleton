module.exports = function(grunt) {
'use strict';
    grunt.initConfig({
        watch: {
            examples_less: {
                files: ['examples/assets/less/**/*.less'],
                tasks: ['less:examples'],
            },
            manual: {
                files: [
                    'manual-src/assets/*',
                    'manual-src/src/**/*.md',
                    'manual-src/src/**/*.js',
                    'manual-src/tpl/**/*.dust'
                ],
            }
        },
        yuidoc: {
            examples: {
                options: {
                    paths: 'src',
                    outdir: 'docs'
                }
            }
        },
        metalsmith: {

        }
    });

    grunt.loadNpmTasks('grunt-contrib-yuidoc');
    grunt.loadNpmTasks('grunt-contrib-watch');

    var metalsmithTask = require('./manual-src/task.js');
    grunt.registerTask('metalsmith', 'metalsmith build task', metalsmithTask);

    grunt.registerTask('build', [
        'yuidoc:examples',
        'metalsmith'
    ]);
};
