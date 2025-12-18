const fs = require('node:fs');
const path = require('node:path');

function isValidBillingCycle(value) {
    const num = Number(value);
    return Number.isInteger(num) && num >= 1 && num <= 12;
}

function isValidTxtDate(value) {
    if (!/^\d{8}$/.test(value)) return false;
    const mm = Number(value.substring(0, 2));
    const dd = Number(value.substring(2, 4));
    const yyyy = Number(value.substring(4, 8));

    const date = new Date(Date.UTC(yyyy, mm - 1, dd));
    return (
        date.getUTCFullYear() === yyyy &&
        date.getUTCMonth() === mm - 1 &&
        date.getUTCDate() === dd
    );
}

function readTxt(filename) {
    if (!fs.existsSync(filename)) {
        throw new Error('Please input an existing request file path.');
    }

    const content = fs.readFileSync(filename, 'utf8').trim();
    if (!content) {
        throw new Error('No request(s) to read from the input file.');
    }

    const lines = content.split(/\r?\n/);
    const requests = [];

    for (let i = 0; i < lines.length; i++) {
        const row = i + 1;
        const line = lines[i].trim();

        if (line.length !== 18) {
            throw new Error(`ERROR: Invalid Start Date format at row ${row}.`);
        }

        const billingCycle = line.substring(0, 2);
        const startDateRaw = line.substring(2, 10);
        const endDateRaw = line.substring(10, 18);

        if (!isValidBillingCycle(billingCycle)) {
            throw new Error(`ERROR: Billing Cycle not on range at row ${row}.`);
        }

        if (!isValidTxtDate(startDateRaw)) {
            throw new Error(`ERROR: Invalid Start Date format at row ${row}.`);
        }

        if (!isValidTxtDate(endDateRaw)) {
            throw new Error(`ERROR: Invalid End Date format at row ${row}.`);
        }

        requests.push({
            billing_cycle: Number(billingCycle),
            start_date: new Date(Date.UTC(
                startDateRaw.substring(4, 8),
                startDateRaw.substring(0, 2) - 1,
                startDateRaw.substring(2, 4)
            )),
            end_date: new Date(Date.UTC(
                endDateRaw.substring(4, 8),
                endDateRaw.substring(0, 2) - 1,
                endDateRaw.substring(2, 4)
            ))
        });
    }

    return requests;
}

function isValidCsvDate(value) {
    if (!/^\d{1,2}\/\d{1,2}\/\d{4}$/.test(value)) return false;
    const [mm, dd, yyyy] = value.split('/').map(Number);
    const date = new Date(Date.UTC(yyyy, mm - 1, dd));
    return (
        date.getUTCFullYear() === yyyy &&
        date.getUTCMonth() === mm - 1 &&
        date.getUTCDate() === dd
    );
}

function readCsv(filename) {
    if (!fs.existsSync(filename)) {
        throw new Error('Please input an existing request file path.');
    }

    const content = fs.readFileSync(filename, 'utf8').trim();
    if (!content) {
        throw new Error('No request(s) to read from the input file.');
    }

    const lines = content.split(/\r?\n/);
    const requests = [];

    for (let i = 0; i < lines.length; i++) {
        const row = i + 1;
        const parts = lines[i].split(',');

        if (parts.length !== 3) {
            throw new Error(`ERROR: Invalid Start Date format at row ${row}.`);
        }

        const billingCycle = parts[0].trim();
        const startDateRaw = parts[1].trim();
        const endDateRaw = parts[2].trim();

        if (!isValidBillingCycle(billingCycle)) {
            throw new Error(`ERROR: Billing Cycle not on range at row ${row}.`);
        }

        if (!isValidCsvDate(startDateRaw)) {
            throw new Error(`ERROR: Invalid Start Date format at row ${row}.`);
        }

        if (!isValidCsvDate(endDateRaw)) {
            throw new Error(`ERROR: Invalid End Date format at row ${row}.`);
        }

        const [sm, sd, sy] = startDateRaw.split('/').map(Number);
        const [em, ed, ey] = endDateRaw.split('/').map(Number);

        requests.push({
            billing_cycle: Number(billingCycle),
            start_date: new Date(Date.UTC(sy, sm - 1, sd)),
            end_date: new Date(Date.UTC(ey, em - 1, ed))
        });
    }

    return requests;
}


module.exports = {
    readTxt,
    readCsv
};

