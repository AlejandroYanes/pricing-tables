const shell = require('shelljs');

// Move the files from the build output folder to the desired folder
shell.mv('dist/assets/*', 'scripts/');
shell.mv('dist/index.html', 'scripts/index.html');
