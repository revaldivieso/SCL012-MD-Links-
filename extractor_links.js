const fs = require('fs');
const path = require('path');
const markdownLink = require('markdown-link-extractor');
const directoryPath = path.resolve(process.argv[2]);

//passsing directoryPath and callback function
const directoryRead = () => {
  fs.readdir(directoryPath, function (err, files) {
    if (err) {
      return console.log('No es posible leer el directorio: ' + err);
    }
    files.forEach(function (file) {
      if (path.extname(file) === '.md') {
        console.log(file);
      }
    })
  })
}

directoryRead(directoryPath)
    .then(data => console.log(data))
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
  .catch(error => console.log(error));

// Lee los archivos y extrae links, el texto y ruta del archivo en un array
const searchLinks = (route) => {
    const arrayLinks = [];
    //const renderer = new marked.Renderer();
    const arrayFiles = directoryRead(route);
    arrayFiles.forEach((filePath) => { // forEach que recorrera el array de as rutas de archivos .md
      const files = readFile(filePath); // almacenar en una constante  la funcionde leer el archivo
      // buscar los link del archivo y solicitar los argumentos
      markdownLink.link = (hrefFile, titleFile, textFile) => {
        arrayLinks.push({
          href: hrefFile, // URL encontrada
          text: textFile, // Texto que aparece en el link
          file: filePath, // Ruta del archivo donde se encontró el link
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
