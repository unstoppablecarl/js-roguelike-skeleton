module.exports = function(grunt) {

    grunt.initConfig({
        less: {
            examples: {
                src: 'examples/assets/less/main.less',
                dest: 'examples/assets/css/style.css',
            },
            options: {
                sourceMap: true,
                sourceMapFilename: 'examples/assets/css/style.css.map',
                // Override the default url that points to the sourcemap from the compiled css file.
                sourceMapURL: 'style.css.map',
                // Sets the base path for the less file paths in the source map.
                // sourceMapRootpath: '/packages/app/assets'
            }
        },
        watch: {
            examples_less: {
                files: ['examples/assets/less/**/*.less'],
                tasks: ['less:examples'],
            },
        },
        yuidoc: {
            examples: {
                // name: '<%= pkg.name %>',
                // description: '<%= pkg.description %>',
                // version: '<%= pkg.version %>',
                // url: '<%= pkg.homepage %>',
                options: {
                    paths: 'src',
                    outdir: 'docs'
                }
            }
        }
    });

    grunt.loadNpmTasks('grunt-contrib-yuidoc');
    grunt.loadNpmTasks('grunt-contrib-less');
    grunt.loadNpmTasks('grunt-contrib-watch');

    grunt.registerTask('build', [
        'less:examples',
        'yuidoc:examples',
    ]);
};
