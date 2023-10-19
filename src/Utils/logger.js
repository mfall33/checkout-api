const fs = require('fs');
const path = require('path');

const INFO_LOG_FILE = path.join(__dirname, '..', '..', 'logs', 'app.log');
const ERROR_LOG_FILE = path.join(__dirname, '..', '..', 'logs', 'error.log');

// 'a' for append mode
const output = fs.createWriteStream(INFO_LOG_FILE, {
    flags: 'a'
});

const errorOutput = fs.createWriteStream(ERROR_LOG_FILE, {
    flags: 'a'
});

const Logger = new console.Console(output, errorOutput);

module.exports = Logger;