const async = require('async');
const inquirer = require('inquirer');

const prompts = [
    'module_name',
    'description',
    'author',
    'license',
    'git_repository'
];

const ask = (files, metalsmith, done) => {
    let metadata = metalsmith.metadata();
    
    async.eachSeries(prompts, (key, next) => {
        inquirer.prompt([{
            type: 'input',
            name: `${key}`,
            message: `${key}? => `,
            default: 'none'
        }]).then((answers) => {
            metadata[key] = answers[key];
            next();
        });
    }, done);
};

module.exports = ask;