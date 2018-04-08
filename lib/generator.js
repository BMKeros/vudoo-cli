const path = require('path');
const Metalsmith  = require('metalsmith');

function generator(path_templates, dest){
    Metalsmith(path_templates)
        .source('.')
        .destination(dest)
        .clean(false)
        .build(function(err) {
            if (err) throw err;
        });
}

module.exports = generator;