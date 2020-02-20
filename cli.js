const cliMdLinks = require('./mdLinks.js');

const path = process.argv[2];

const options = {
  stats: false,
  validate: false,
};

process.argv.forEach((element) => {
  if (element === '--stats' || element === '--s' || element === 's') {
    options.stats = true;
  } else if (element === '--validate' || element === '--v' || element === 'v') {
    options.validate = true;
  }
});

cliMdLinks.cliMdLinks(path, options)
  .then((result) => {
    console.log(result);
  })
  .catch((err) => {
    console.log(err.message);
  });