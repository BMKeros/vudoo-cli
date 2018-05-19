const async = require('async');
const inquirer = require('inquirer');

const prompts = [
//    'module_name',
    { key: 'description', message: 'Description', default: 'none' },
    { key: 'author', message: 'Author', default: 'none' },
    { key: 'license', message: 'License', default: 'MIT' },
    { key: 'git_repository', message: 'Git Repository', default: '' },
    { key: 'end_point', message: 'End Point use in odoo', default: 'default' }
];

const ask = (data_default) => {
    return (files, metalsmith, done) => {
        let metadata = metalsmith.metadata();

        //Set data default
        for (let item of data_default) {
            metadata[item.key] = item.value;
        }

        async.eachSeries(prompts, (item, next) => {
            inquirer.prompt([{
                type: 'input',
                name: `${item.key}`,
                message: `${item.message}? => `,
                default: item.default
            }]).then((answers) => {
                metadata[item.key] = answers[item.key];
                next();
            });
        }, done);
    };
};

module.exports = ask;
