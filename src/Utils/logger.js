const fs = require('fs');
const path = require('path');

const INFO_LOG_FILE = path.join(__dirname, '..', '..', 'logs', 'app.log');
const ERROR_LOG_FILE = path.join(__dirname, '..', '..', 'logs', 'error.log');

const output = fs.createWriteStream(INFO_LOG_FILE, {
    flags: 'w'
});

const errorOutput = fs.createWriteStream(ERROR_LOG_FILE, {
    flags: 'w'
});

const Logger = new console.Console(output, errorOutput);

module.exports = Logger;