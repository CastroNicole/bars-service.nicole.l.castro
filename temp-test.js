const { readTxt, readCsv } = require('./src/services/fileReader');

// console.log(readTxt('tests/BARS_TEST/valid-txt.txt'));
console.log(readCsv('tests/BARS_TEST/valid-csv.csv'));