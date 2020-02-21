const fs = require('fs');
const path = require('path');
const markdownLink = require('markdown-link-extractor');
const directoryPath = path.resolve(process.argv[2]);

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

// Lee los archivos y extrae links, el texto y ruta del archivo en un array
const searchLinks = (route) => {
  const arrayLinks = [];
  const arrayFiles = directoryRead(route);
  arrayFiles.forEach((filePath) => { 
    const files = readFile(filePath); 
    markdownLink.link = (hrefFile, titleFile, textFile) => {
      arrayLinks.push({
        href: hrefFile, 
        text: textFile, 
        file: filePath, 
      });
    };
  });
  return arrayLinks;
};

const linksValidate = (route) => {
  const links = searchLinks(route);
  const urlFileMd = links.map((link) => new Promise((resolve) => {
    const linkobj = link;
    fetch(link.href)
      .then((result) => {
        if (result.status > 399) {
          linkobj.status = result.status;
          linkobj.statusText = 'FAIL';
        } else {
          linkobj.status = result.status;
          linkobj.statusText = 'OK';
        }
        resolve(linkobj);
      });
  }));
  return Promise.all(urlFileMd);
};


// Función que rertorna una promesa de array de objetos
const mdLinks = (path, options) => new Promise((resolve, reject) => {
  if (readFile(path)) {
    if (options && options.validate) {
      resolve(linksValidate(path));
    } else {
      resolve(searchLinks(path));
    }
  } else {
    reject(new Error(chalk.red('La ruta no existe. Ingrese una ruta válida')));
  }
});

module.exports = {
  directoryRead,
  readFile,
  searchLinks,
  linksValidate,
  mdLinks,
}
