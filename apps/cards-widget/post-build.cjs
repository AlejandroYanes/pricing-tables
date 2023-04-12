const shell = require('shelljs');

shell.cp('-Rfu', 'dist/assets/*', 'scripts/');
shell.cp('-fu', 'dist/index.html', 'scripts/index.html');
