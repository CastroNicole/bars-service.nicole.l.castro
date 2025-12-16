const { readTxt, readCsv } = require('./src/services/fileReader');

console.log(readTxt('tests/sample-valid.txt'));
console.log(readCsv('tests/sample-valid.csv'));