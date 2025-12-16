const path = require('path');
const { readTxt, readCsv } = require('../src/services/fileReader');

// Path to BARS_TEST directory
const BARS_TEST_PATH = path.join(__dirname, 'BARS_TEST');

// BARS.TS.001 - Test normal conditions for readCsv()
describe('BARS.TS.001 - Test normal conditions for readCsv()', () => {
    // BARS.TC.001 - Read CSV Valid Request Parameter
    test('BARS.TC.001 - should read valid csv file and return correct data', () => {
        const filePath = path.join(BARS_TEST_PATH, 'valid-csv.csv');
        const result = readCsv(filePath);

        expect(result.length).toBe(2);

        // First record
        expect(result[0].billing_cycle).toBe(1);
        expect(result[0].start_date).toBeInstanceOf(Date);
        expect(result[0].end_date).toBeInstanceOf(Date);
        expect(result[0].start_date).toEqual(new Date(Date.UTC(2013, 0, 16, 0)));
        expect(result[0].end_date).toEqual(new Date(Date.UTC(2013, 1, 15, 0)));

        // Second record
        expect(result[1].billing_cycle).toBe(1);
        expect(result[1].start_date).toEqual(new Date(Date.UTC(2016, 0, 16, 0)));
        expect(result[1].end_date).toEqual(new Date(Date.UTC(2016, 1, 15, 0)));
    });
});

// BARS.TS.002 - Test error conditions for readCsv()
describe('BARS.TS.002 - Test error conditions for readCsv()', () => {
    // BARS.TC.002 - Read Invalid CSV Request With Invalid Billing Cycle
    test('BARS.TC.002 - should throw error for billing cycle not on range', () => {
        const filePath = path.join(BARS_TEST_PATH, 'invalid-billing-cycle-csv.csv');

        expect(() => {
            readCsv(filePath);
        }).toThrow('ERROR: Billing Cycle not on range at row 4.');
    });

    // BARS.TC.003 - Read Invalid CSV Request With Invalid Start Date Format
    test('BARS.TC.003 - should throw error for invalid start date format', () => {
        const filePath = path.join(BARS_TEST_PATH, 'invalid-start-date-csv.csv');

        expect(() => {
            readCsv(filePath);
        }).toThrow('ERROR: Invalid Start Date format at row 1.');
    });

    // BARS.TC.004 - Read Invalid CSV Request With Invalid End Date Format
    test('BARS.TC.004 - should throw error for invalid end date format', () => {
        const filePath = path.join(BARS_TEST_PATH, 'invalid-end-date-csv.csv');

        expect(() => {
            readCsv(filePath);
        }).toThrow('ERROR: Invalid End Date format at row 7.');
    });

    // BARS.TC.005 - Read an empty CSV file
    test('BARS.TC.005 - should throw error for empty file', () => {
        const filePath = path.join(BARS_TEST_PATH, 'empty-csv.csv');

        expect(() => {
            readCsv(filePath);
        }).toThrow('No request(s) to read from the input file.');
    });
});

// BARS.TS.003 - Test normal conditions for readTxt()
describe('BARS.TS.003 - Test normal conditions for readTxt()', () => {
    // BARS.TC.006 - Read TXT Valid Request Parameter
    test('BARS.TC.006 - should read valid txt file and return correct data', () => {
        const filePath = path.join(BARS_TEST_PATH, 'valid-txt.txt');
        const result = readTxt(filePath);

        expect(result.length).toBe(2);

        // First record
        expect(result[0].billing_cycle).toBe(1);
        expect(result[0].start_date).toBeInstanceOf(Date);
        expect(result[0].end_date).toBeInstanceOf(Date);
        expect(result[0].start_date).toEqual(new Date(Date.UTC(2013, 0, 16, 0)));
        expect(result[0].end_date).toEqual(new Date(Date.UTC(2013, 1, 15, 0)));

        // Second record
        expect(result[1].billing_cycle).toBe(1);
        expect(result[1].start_date).toEqual(new Date(Date.UTC(2016, 0, 16, 0)));
        expect(result[1].end_date).toEqual(new Date(Date.UTC(2016, 1, 15, 0)));
    });
});

// BARS.TS.004 - Test error conditions for readTxt()
describe('BARS.TS.004 - Test error conditions for readTxt()', () => {
    // BARS.TC.007 - Read Invalid TXT Request With Invalid Billing Cycle
    test('BARS.TC.007 - should throw error for billing cycle not on range', () => {
        const filePath = path.join(BARS_TEST_PATH, 'invalid-billing-cycle-txt.txt');

        expect(() => {
            readTxt(filePath);
        }).toThrow('ERROR: Billing Cycle not on range at row 3.');
    });

    // BARS.TC.008 - Read Invalid TXT Request With Invalid Start Date Format
    test('BARS.TC.008 - should throw error for invalid start date format', () => {
        const filePath = path.join(BARS_TEST_PATH, 'invalid-start-date-txt.txt');

        expect(() => {
            readTxt(filePath);
        }).toThrow('ERROR: Invalid Start Date format at row 3.');
    });

    // BARS.TC.009 - Read Invalid TXT Request With Invalid End Date Format
    test('BARS.TC.009 - should throw error for invalid end date format', () => {
        const filePath = path.join(BARS_TEST_PATH, 'invalid-end-date-txt.txt');

        expect(() => {
            readTxt(filePath);
        }).toThrow('ERROR: Invalid End Date format at row 1.');
    });

    // BARS.TC.010 - Read an empty TXT file
    test('BARS.TC.010 - should throw error for empty file', () => {
        const filePath = path.join(BARS_TEST_PATH, 'empty-txt.txt');

        expect(() => {
            readTxt(filePath);
        }).toThrow('No request(s) to read from the input file.');
    });
});
