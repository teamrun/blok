'use strict';

const fs = require('fs');
const path = require('path');

const promisify = require('es6-promisify');
const log = require('../lib/logger');

const readDir = fs.readdirSync;

// load controller files re
function getAllFiles(targetPath, includeCond){
    let files = [];
    let underPath = readDir(targetPath);
    underPath.forEach((p) => {
        let fullPath = path.join(targetPath, p);
        let s = fs.statSync(fullPath);
        if(!includeCond(fullPath)){
            return;
        }
        if(s.isFile()){
            files.push(fullPath);
        }
        else if(s.isDirectory()){
            files = files.concat(getAllFiles(fullPath, includeCond));
        }
    });
    return files;
}
function collectCtrl(){
    let allFiles = getAllFiles(__dirname, (p) => {
        return p.indexOf(__dirname + '/page') < 0 && p !== __filename;
    });
    // log.debug(allFiles);
    return allFiles.reduce((prev, item) => {
        return prev.concat(require(item));
    }, []);
}


module.exports = collectCtrl();
