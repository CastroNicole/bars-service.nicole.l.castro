const path = require('path');
const { readTxt, readCsv } = require('../src/services/fileReader');

// Path to BARS_TEST directory
const BARS_TEST_PATH = path.join(__dirname, 'BARS_TEST');

// =============================================================================
// S1 - File Type Validation
// =============================================================================
describe('S1 - File Type Validation', () => {
    // S1.1 - Catch Files that are not supported by the system
    test('S1.1 - should only accept .txt and .csv files', () => {
        // This is tested at the route level, but we can verify the readers exist
        expect(typeof readTxt).toBe('function');
        expect(typeof readCsv).toBe('function');
    });
});

// =============================================================================
// S2 - Processing Text Input File
// =============================================================================

// BARS.TS.003 - Test normal conditions for readTxt()
describe('S2 - Processing Text Input File (Normal Conditions)', () => {
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
describe('S2 - Processing Text Input File (Error Conditions)', () => {
    // S2.1 - Validate Start Date format
    // BARS.TC.008 - Read Invalid TXT Request With Invalid Start Date Format
    test('S2.1 / BARS.TC.008 - should throw error for invalid start date format', () => {
        const filePath = path.join(BARS_TEST_PATH, 'invalid-start-date-txt.txt');

        expect(() => {
            readTxt(filePath);
        }).toThrow('ERROR: Invalid Start Date format at row 3.');
    });

    // S2.2 - Validate End Date format
    // BARS.TC.009 - Read Invalid TXT Request With Invalid End Date Format
    test('S2.2 / BARS.TC.009 - should throw error for invalid end date format', () => {
        const filePath = path.join(BARS_TEST_PATH, 'invalid-end-date-txt.txt');

        expect(() => {
            readTxt(filePath);
        }).toThrow('ERROR: Invalid End Date format at row 1.');
    });

    // S2.3 - Validate Billing Cycle
    // BARS.TC.007 - Read Invalid TXT Request With Invalid Billing Cycle
    test('S2.3 / BARS.TC.007 - should throw error for billing cycle not on range', () => {
        const filePath = path.join(BARS_TEST_PATH, 'invalid-billing-cycle-txt.txt');

        expect(() => {
            readTxt(filePath);
        }).toThrow('ERROR: Billing Cycle not on range at row 3.');
    });

    // S2.4 - Validate number of Requests to read
    // BARS.TC.010 - Read an empty TXT file
    test('S2.4 / BARS.TC.010 - should throw error for empty file', () => {
        const filePath = path.join(BARS_TEST_PATH, 'empty-txt.txt');

        expect(() => {
            readTxt(filePath);
        }).toThrow('No request(s) to read from the input file.');
    });

    // S2.5 - Validate number of Records to write (No Record Found!)
    // This requires reading a file with dates that don't match any DB records
    test('S2.5 - should read no-records file successfully (DB query returns No Record Found!)', () => {
        const filePath = path.join(BARS_TEST_PATH, 'no-records-txt.txt');
        const result = readTxt(filePath);

        // File should parse successfully, the "No Record Found!" comes from DB query
        expect(result.length).toBe(1);
        expect(result[0].billing_cycle).toBe(1);
    });
});

// =============================================================================
// S3 - Processing CSV Input File
// =============================================================================

// BARS.TS.001 - Test normal conditions for readCsv()
describe('S3 - Processing CSV Input File (Normal Conditions)', () => {
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
describe('S3 - Processing CSV Input File (Error Conditions)', () => {
    // S3.1 - Validate Start Date format
    // BARS.TC.003 - Read Invalid CSV Request With Invalid Start Date Format
    test('S3.1 / BARS.TC.003 - should throw error for invalid start date format', () => {
        const filePath = path.join(BARS_TEST_PATH, 'invalid-start-date-csv.csv');

        expect(() => {
            readCsv(filePath);
        }).toThrow('ERROR: Invalid Start Date format at row 1.');
    });

    // S3.2 - Validate End Date format
    // BARS.TC.004 - Read Invalid CSV Request With Invalid End Date Format
    test('S3.2 / BARS.TC.004 - should throw error for invalid end date format', () => {
        const filePath = path.join(BARS_TEST_PATH, 'invalid-end-date-csv.csv');

        expect(() => {
            readCsv(filePath);
        }).toThrow('ERROR: Invalid End Date format at row 7.');
    });

    // S3.3 - Validate Billing Cycle
    // BARS.TC.002 - Read Invalid CSV Request With Invalid Billing Cycle
    test('S3.3 / BARS.TC.002 - should throw error for billing cycle not on range', () => {
        const filePath = path.join(BARS_TEST_PATH, 'invalid-billing-cycle-csv.csv');

        expect(() => {
            readCsv(filePath);
        }).toThrow('ERROR: Billing Cycle not on range at row 4.');
    });

    // S3.4 - Validate number of Requests to read
    // BARS.TC.005 - Read an empty CSV file
    test('S3.4 / BARS.TC.005 - should throw error for empty file', () => {
        const filePath = path.join(BARS_TEST_PATH, 'empty-csv.csv');

        expect(() => {
            readCsv(filePath);
        }).toThrow('No request(s) to read from the input file.');
    });

    // S3.5 - Validate number of Records to write (No Record Found!)
    // This requires reading a file with dates that don't match any DB records
    test('S3.5 - should read no-records file successfully (DB query returns No Record Found!)', () => {
        const filePath = path.join(BARS_TEST_PATH, 'no-records-csv.csv');
        const result = readCsv(filePath);

        // File should parse successfully, the "No Record Found!" comes from DB query
        expect(result.length).toBe(1);
        expect(result[0].billing_cycle).toBe(1);
    });
});