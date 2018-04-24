const path = require('path');
const fs = require('fs');

const findFile = (currentPath, name_search, excludes = [], ignoreHidden = true) => {
    const isValidFile = (file) => {
        return (ignoreHidden) ? (!excludes.includes(file) && !(/(^|\/)\.[^\/\.]/g).test(file)) : (!excludes.includes(file));
    };

    return new Promise((resolve) => {
        let files = fs.readdirSync(currentPath);

        for (let file of files) {
            let currentFile = path.join(currentPath, file);
            let stats = fs.statSync(currentFile);

            if (isValidFile(file)) {
                if (stats.isDirectory()) {
                    findFile(currentFile, name_search, excludes).then(resolve);
                } else {
                    if (stats.isFile()) {
                        if (file === name_search) {
                            resolve({
                                file: file,
                                path: currentPath
                            });
                            break;
                        }
                    }
                }
            }
        }
    });
};

const isModuleOdoo = (path) => {
    // Check is odoo 8
    findFile(path, '__openerp__.py', ['node_modules'])
        .then((existOpenERP) => {
        }).catch(console.log);

};

const action_build = (path_module, options) => {
    //traverseFileSystem(path.resolve(path_module));
    isModuleOdoo(path.resolve(path_module));
};

module.exports = action_build;
