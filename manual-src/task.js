module.exports = function() {

        // Force task into async mode and grab a handle to the "done" function.
        var done = this.async();

        var path = require('path');
        var dust = require('dustjs-linkedin');

        // disable whitespace removal
        dust.optimizers.format = function(ctx, node) { return node };

        var metalsmith = require('metalsmith');
        var markDown = require('metalsmith-markdown');
        var templates = require('metalsmith-templates');
        var less = require('metalsmith-less');
        var nav = require('metalsmith-navigation');
        var assets = require('metalsmith-assets');

        var navTask = nav({
            primary:{
                sortBy: 'nav_sort',
                filterProperty: 'nav_groups',
            }
        });

        var lessTask = less({
            pattern: 'assets/less/main.less',
            parse: {
                paths: [__dirname + '/assets/less']
            }
        });

        var assetsTask = assets({
            source: './assets', // relative to the working directory
            destination: './assets' // relative to the build directory
        });

        var markDownTask = markDown({

        });

        var templatesTask = templates({
            directory: './tpl',
            engine: 'dust'
        });

        var meta = {

        };

        // sets yui docs data to pages with "docs_class" set
        var yuiDataTask = function(files, metalsmith, done){
            var yuiDocsData = require('../docs/data.json');

            var makeUrl = function(docClass, method){
                var out = '/docs/classes/' + docClass + '.html';
                if(method){
                    out += '#method_' + method;
                }
                return out;
            };

            for(var key in files){
                var file = files[key];
                if(file.docs_class){
                    file.yui_class_data = yuiDocsData.classes[file.docs_class];
                    if(file.docs_method){
                        file.yui_method_url = makeUrl(file.docs_class) + '#method_' + file.docs_class;
                    }
                }
                var relatedDocs = file.related_methods;
                var relatedDocsFormatted = [];
                if(relatedDocs){
                    relatedDocs.forEach(function(doc){
                        if(doc.indexOf('.') !== -1){
                            var arr = doc.split('.');
                            relatedDocsFormatted.push({
                                name: arr[0] + '.prototype.' + arr[1] + '()',
                                class: arr[0],
                                method: arr[1],
                                url: makeUrl(arr[0], arr[1])
                            });
                        } else {
                            relatedDocsFormatted.push({
                                name: doc + '()',
                                class: doc,
                                url: makeUrl(doc)
                            });
                        }
                    });
                    file.related_docs = relatedDocsFormatted;
                }
            }
            done();
        };

        dust.helpers.relative_path = function (chunk, ctx, bodies, params) {
            // Get the values of all the parameters. The tap function takes care of resolving any variable references
            // used in parameters (e.g. param="{name}"
            var current = dust.helpers.tap(params.current, chunk, ctx),
                target = dust.helpers.tap(params.target, chunk, ctx);
            // normalize and remove starting slash
            current = path.normalize(current).slice(0);
            target = path.normalize(target).slice(0);

            current = path.dirname(current);
            var out = path.relative(current, target);
            return chunk.write(out);
        };

        metalsmith(__dirname)
            .clean(true)
            .destination('../manual')
            .metadata(meta)
            .use(markDownTask)
            .use(yuiDataTask)
            .use(navTask)
            .use(templatesTask)
            .use(assetsTask)
            .use(lessTask)
            .build(function(err) {
                if (err) {
                    throw err;
                }
                done();
            });
    };