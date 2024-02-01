const fs = require('fs-extra');

fs.copy('dist', '../backend/public', function(err) {
    if (err) {
        throw err;
    }

    console.log('Copied to backend');
})