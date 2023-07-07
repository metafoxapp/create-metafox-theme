"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fs = require('fs');
const path = require('path');
const getFiles = (dirPath, arrayOfFiles) => {
    const files = fs.readdirSync(dirPath);
    arrayOfFiles = arrayOfFiles || [];
    files.forEach((file) => {
        const stats = fs.statSync(`${dirPath}/${file}`);
        if (file === '.git') {
            // skip
        }
        else if (stats.isDirectory()) {
            arrayOfFiles = getFiles(`${dirPath}/${file}`, arrayOfFiles);
        }
        else {
            arrayOfFiles.push(path.join(dirPath, '/', file));
        }
    });
    return arrayOfFiles;
};
exports.default = getFiles;
