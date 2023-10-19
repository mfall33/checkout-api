const fs = require('fs');

const { INFO_LOG_FILE, ERROR_LOG_FILE } = process.env;

console.log("INFO_LOG_FILE: " + INFO_LOG_FILE);
console.log("ERROR_LOG_FILE: " + ERROR_LOG_FILE);

fs.chmod(INFO_LOG_FILE, 0o777, () => {
    console.log("done")
})

const output = fs.createWriteStream(INFO_LOG_FILE, {
    flags: 'w'
});

const errorOutput = fs.createWriteStream(ERROR_LOG_FILE, {
    flags: 'w'
});

const Logger = new console.Console(output, errorOutput);

module.exports = Logger;