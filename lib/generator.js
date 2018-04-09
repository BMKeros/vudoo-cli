const path = require('path');
const Metalsmith  = require('metalsmith');
const render = require('consolidate').handlebars.render;
const async = require('async');
const local_path = require('../lib/local-path');
const ask = require('../lib/ask');


const generator = (path_templates, dest) => {
    Metalsmith(path_templates)
        .source('.')
        .use(ask)
        .use(render_template)
        .destination(dest)
        .clean(false)
        .build(function(err) {
            if (err) throw err;
        });
}

const render_template = (files, metalsmith, done) => {
    var keys = Object.keys(files);
    var metadata = metalsmith.metadata();
  
    async.each(keys, (file, done) => {
        var str = files[file].contents.toString();

        render(str, metadata, function(err, res){
            if (err) return done(err);
            files[file].contents = new Buffer(res);
            done();
        });
    }, done);
}

module.exports = generator;