const path = require('path');
const download_repository = require('download-git-repo');
const shell = require('shelljs');
const inquirer = require('inquirer');
const ora = require('ora');
const fs = require('fs');
const rimraf = require('rimraf');
const generator = require('../lib/generator');
const local_path = require('../lib/local-path');

const rm = rimraf.sync;
const exists = fs.existsSync;

const action_init = (module_name, options) => {
    const template = options.template;
    const repository = generateNameRepository(template);
    const dest_generate = (options.destination === '.') ? path.resolve('.') : (options.destination);
    const full_path_project = path.join(dest_generate, module_name);

    inquirer.prompt([{
        type: 'confirm',
        message: dest_generate === '.'
            ? 'Generate project in current directory?'
            : 'Target directory exists. Continue?',
        name: 'ok'
    }]).then(answers => {
        if (answers.ok) {
            download_template(repository, template)
                .then(path_download => generate_template(module_name, path_download, dest_generate))
                .catch(err => console.log('Failed to download ' + repository + ': ' + err.message.trim()))
        }
    }).catch(console.log);
};

const generateNameRepository = (name) => {
    const main_repo = 'BMKeros/vudoo-templates';
    switch (name) {
        case 'simple':
            return `${main_repo}#simple`;
        case 'odoo8':
            return `${main_repo}#odoo8`;
        case 'odoo9':
            return `${main_repo}#odoo9`
        case 'odoo10':
            return `${main_repo}#odoo10`;
        case 'odoo11':
            return `${main_repo}#odoo11`;
        default:
            return `${main_repo}#simple`;
    }
};

const download_template = (repo, template) => {
    const dest_download = path.join(local_path.baseTemplates(), template);

    return new Promise((resolve, reject) => {
        const spinner = ora('Downloading template from vudoo-templates');
        spinner.start();

        if (exists(dest_download)) {
            rm(dest_download);
        }
        else {
            shell.mkdir('-p', dest_download);
        }

        download_repository(repo, dest_download, { clone: false }, err => {
            spinner.stop();
            if (err) {
                reject(err);
            }
            else {
                resolve(dest_download);
            }
        });
    });
};

const generate_template = (module_name, path_template, dest_generate) => {
    const dest_tmp = path.join(dest_generate, module_name);
    generator(path_template, dest_tmp);
};

module.exports = action_init;
