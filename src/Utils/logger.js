const fs = require('fs');

const output = fs.createWriteStream('./logs/app.log');
const errorOutput = fs.createWriteStream('./logs/error.log');

const Logger = new console.Console(output, errorOutput);

module.exports = Logger;