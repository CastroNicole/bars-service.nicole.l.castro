const path = require('path');
const { readTxt, readCsv } = require('../src/services/fileReader');

describe('TXT File Reader', () => {
    test('should read valid txt file', () => {
        const filePath = path.join(__dirname, 'sample-valid.txt');
        const result = readTxt(filePath);

        expect(result.length).toBe(1);
        expect(result[0].billing_cycle).toBe(1);
        expect(result[0].start_date).toBeInstanceOf(Date);
        expect(result[0].end_date).toBeInstanceOf(Date);
    });

    test('should throw error for invalid billing cycle', () => {
        const filePath = path.join(__dirname, 'sample-invalid.txt');

        expect(() => {
            readTxt(filePath);
        }).toThrow('ERROR: Billing Cycle not on range at row 1.');
    });
});

describe('CSV File Reader', () => {
    test('should read valid csv file', () => {
        const filePath = path.join(__dirname, 'sample-valid.csv');
        const result = readCsv(filePath);

        expect(result.length).toBe(2);
        expect(result[0].billing_cycle).toBe(1);
    });

    test('should throw error for invalid csv date', () => {
        const filePath = path.join(__dirname, 'sample-invalid.csv');

        expect(() => {
            readCsv(filePath);
        }).toThrow('ERROR: Invalid Start Date format at row 1.');
    });
});
