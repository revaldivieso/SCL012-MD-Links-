const {resolve} = require('path'); // trabajando con rutas de archivos y directorios
const isValid = require('is-valid-path'); // devuelve verdadero si no contiene caracteres inválidos.
//const {readFile} = require('fs'); // modulo de sistema de archivos.
const path = require('path');
const pathAbsolute = process.argv[3];



const pathObj = path.parse(__filename);
console.log(pathObj);

const readingRoute = (fs) => {
  fs.readFile(process.cwd()+"\\text.txt", function(err,data)
            {
                if(err)
                    console.log(err)
                else
                    console.log(data.toString());
            });
};
readingRoute();



/* lectura de la ruta y convertir absoluta
const existPath = () => {
  return new Promise((resolveP, rejectP) => {
    readFile(
      path, {
        encoding: 'utf-8'
      },
      (error, data) => {
        if (error) return rejectP(error);
        resolveP(data);
      });
  });
}*/

/*const promesas = existPath()
  .then((data) => {
    console.log(data);
    return new Promise.resolve();
  })
  .catch((error) => {
    console.error(error);
  });
promesas.then(console.log)*/


/* Validando la ruta (Devuelve true si una ruta de archivo no contiene caracteres no válidos)*/
const validatePath = (path) => {
  if (isValid(path)) {
    return true;
  } else {
    return false;
  }
};
console.log(validatePath);

//Convirtiendo la ruta relativa a absoluta
const convertPathAbs = (path) => {
  if (!path.isAbsolute(path)) {
    return path.resolve(path);
  } else {
    return path;
  }
};
console.log(convertPathAbs);
