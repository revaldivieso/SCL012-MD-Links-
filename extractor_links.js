const fs = require('fs');
const path = require('path');
const markdownLink = require('markdown-link-extractor');
const directoryPath = path.resolve(process.argv[2]);
const docExtension = path.extname(directoryPath);

//passsing directoryPath and callback function
const directoryRead = (directoryPath) => {
  return new Promise((resolve, reject) => {
    fs.readdir(directoryPath, function (err, files) {
      if (err) {
        return reject('No es posible leer el directorio: ' + err);
      } else {
        return resolve(files);
      }
    })
  })
}

directoryRead(directoryPath)
  .then(files => {
    files.forEach(function (file) {
      if (path.extname(file) === '.md') {
        readFile(file);
        console.log(file);
      }
    })
  })
  .catch(error => console.log(error));

const readFile = (directoryPath) => {
  return new Promise((resolve, reject) => {
    fs.readFile(directoryPath, 'utf8', (error, data) => {
      if (error) return reject(error);
      return resolve(data);
    })
  })
}

readFile(directoryPath)
  .then(data => console.log(markdownLink(data)))
  .catch(error => console.log(error + 'aca hay un error'));

module.exports = {
  directoryRead,
  readFile,
}
