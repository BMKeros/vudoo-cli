const Metalsmith = require('metalsmith');
const render = require('consolidate').handlebars.render;
const async = require('async');
const ask = require('../lib/ask');

let ask_default = [];

const generator = (module_name, path_templates, dest) => {
    ask_default.push({ key: 'module_name', value: module_name });

    Metalsmith(path_templates)
        .source('.')
        .use(ask(ask_default))
        .use(render_template)
        .destination(dest)
        .clean(false)
        .build((err) => {
            if (err) throw err;
        });
};

const render_template = (files, metalsmith, done) => {
    const keys = Object.keys(files);
    const metadata = metalsmith.metadata();

    async.each(keys, (file, done) => {
        const buffer = files[file].contents.toString();
        render(buffer, metadata, (err, res) => {
            if (err) return done(err);
            files[file].contents = new Buffer(res);
            done();
        });
    }, done);
};

module.exports = generator;