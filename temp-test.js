const { readTxt, readCsv } = require('./src/services/fileReader');

console.log(readTxt('tests/BARS_TEST/empty-txt.txt'));
// console.log(readCsv('tests/BARS_TEST/empty-csv.csv'));