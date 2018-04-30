const path = require('path');
const filehound = require('filehound');
const listr = require('listr');
const execa = require('execa');

const PAHT_DEFAULT_VUEX = '/static/src/js/vue/';

const isModuleOdoo = (path) => {
    // Check is odoo 8
    const existManifest = filehound.create()
        .paths(path)
        .ignoreHiddenDirectories()
        .ignoreHiddenFiles()
        .ext('py')
        .match('*__manifest__*')
        .find();

    // Check is odoo 10
    const existOpenerp = filehound.create()
        .paths(path)
        .ignoreHiddenDirectories()
        .ignoreHiddenFiles()
        .ext('py')
        .match('*__openerp__*')
        .find();

    return Promise.all([existManifest, existOpenerp]);
};

const existModuleVuex = (ppath) => {
    const path_vuex = path.join(ppath, PAHT_DEFAULT_VUEX);

    // check if exist package.json in module odoo
    return filehound.create()
        .paths(path_vuex)
        .ignoreHiddenDirectories()
        .ignoreHiddenFiles()
        .discard(/node_modules/)
        .ext('json')
        .match('*package*')
        .find();
};

const action_build = (path_module, options) => {
    const real_path = path.resolve(path_module);
    const cwd_vuex_default = path.join(real_path, PAHT_DEFAULT_VUEX);

    const tasks = new listr([
        {
            title: 'Checking app vudoo',
            task: () => {
                return new listr([
                    {
                        title: '[1/4] Checking module odoo',
                        task: (context) => isModuleOdoo(real_path).then(result => {
                            context.isModuleOdoo = true;
                            const pass = (result[0].length === 0) && (result[1].length === 0);
                            if (pass) {
                                context.isModuleOdoo = false;
                                throw new Error('Module odoo not found.');
                            }
                        })
                    },
                    {
                        title: '[2/4] Checking module vue',
                        enabled: context => context.isModuleOdoo,
                        task: () => existModuleVuex(real_path).then(result => {
                            if (result.length === 0) {
                                throw new Error('Module vuex not found.');
                            }
                        })
                    },
                ]);
            }
        },
        {
            title: 'Building module vuex',
            enabled: context => context.isModuleOdoo,
            task: () => {
                return new listr([
                    {
                        title: '[3/4] Install package dependencies with Yarn',
                        task: (ctx, task) => execa('yarn', [], { cwd: cwd_vuex_default })
                            .catch(() => {
                                ctx.yarn = false;
                                throw new Error('Yarn not available, install it via `npm install -g yarn`');
                            })
                    },
                    {
                        title: '[3/4] Install package dependencies with NPM',
                        enabled: context => context.yarn === false,
                        task: (ctx) => execa('npm', ['install'], { cwd: cwd_vuex_default })
                            .catch(err => {
                                throw new err;
                            })
                    },
                    {
                        title: '[4/4] Building module',
                        task: () => execa('npm', ['run', 'build'], { cwd: cwd_vuex_default })
                            .catch(err => {
                                throw new err;
                            })
                    }
                ])
            }
        }
    ]);


    tasks.run().catch(err => {
    });
};

module.exports = action_build;