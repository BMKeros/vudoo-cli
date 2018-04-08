const path = require('path');

const FOLDER_CACHE_TEMPLATE = '.cache-vudoo-templates';

function homeDir(){
    return (process.platform === 'win32')? (process.env.HOMEPATH) : (process.env.HOME);
}

function baseTemplates(){
    return path.join(homeDir(), FOLDER_CACHE_TEMPLATE)
}

module.exports = {
    FOLDER_CACHE_TEMPLATE: FOLDER_CACHE_TEMPLATE,
    homeDir : homeDir,
    baseTemplates: baseTemplates
};