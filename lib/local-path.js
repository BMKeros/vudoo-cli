const path = require('path');

const FOLDER_CACHE_TEMPLATE = '.cache-vudoo-templates';

module.exports = {
    homeDir(){
        return (process.platform === 'win32')? (process.env.HOMEPATH) : (process.env.HOME);
    },
    baseTemplates(){
        return path.join(this.homeDir(), FOLDER_CACHE_TEMPLATE)
    },
    FOLDER_CACHE_TEMPLATE: FOLDER_CACHE_TEMPLATE
};