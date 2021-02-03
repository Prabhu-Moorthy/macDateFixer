const exec = require('child_process').exec;
const child = exec('touch -mt 201009232118.52 main.js',
    (error, stdout, stderr) => {
        if (error !== null) console.log(`exec error: ${error}`);
        else console.log('print this');
});