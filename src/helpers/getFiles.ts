const fs = require('fs');
const path = require('path');

const getFiles = (dirPath: string, arrayOfFiles: string[]): string[] => {
  const files = fs.readdirSync(dirPath);

  arrayOfFiles = arrayOfFiles || [];

  files.forEach((file: string) => {
    const stats = fs.statSync(`${dirPath}/${file}`);
    if (file === '.git') {
      // skip
    } else if (stats.isDirectory()) {
      arrayOfFiles = getFiles(`${dirPath}/${file}`, arrayOfFiles);
    } else {
      arrayOfFiles.push(path.join(dirPath, '/', file));
    }
  });

  return arrayOfFiles;
};

export default getFiles;
