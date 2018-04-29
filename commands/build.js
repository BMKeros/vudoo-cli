const path = require('path');
const FileHound = require('filehound');
const listr = require('listr');
const execa = require('execa');

const PAHT_DEFAULT_VUEX = '/static/src/js/vue/';

const isModuleOdoo = (path) => {
    // Check is odoo 8
    const existManifest = FileHound.create()
        .paths(path)
        .ignoreHiddenDirectories()
        .ignoreHiddenFiles()
        .ext('py')
        .match('*__manifest__*')
        .find();

    // Check is odoo 10
    const existOpenerp = FileHound.create()
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
    // Check node_modules
    return FileHound.create()
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

    const tasks = new listr([
        {
            title: 'Checking app vudoo',
            task: () => {
                return new listr([
                    {
                        title: '[1/2] Checking module odoo',
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
                        title: '[2/2] Checking module vue',
                        enabled: context => context.isModuleOdoo,
                        task: () => existModuleVuex(real_path).then(result => {
                            if (result.length === 0) {
                                throw new Error('Module vuex not found.');
                            }
                        })
                    },
                ], { concurrent: false });
            }
        },
        {
            title: 'Building module vuex',
            task: () => {
                return new listr([
                    {
                        title: 'Install package dependencies with Yarn',
                        task: (ctx, task) => execa('yarn', [], { cwd: path.join(real_path, PAHT_DEFAULT_VUEX) })
//                            .then(console.log)
                            .catch(() => {
                                ctx.yarn = false;
                                throw new Error('Yarn not available, install it via `npm install -g yarn`');
                            })
                    },
                    {
                        title: 'Building module',
                        task: (ctx, task) => execa('yarn', ['build'], { cwd: path.join(real_path, PAHT_DEFAULT_VUEX) })
                            .catch(() => {})
                    },
                ])
            }
        }
    ]);

    tasks.run().catch(err => {
        // console.error(err);
    });
};

module.exports = action_build;