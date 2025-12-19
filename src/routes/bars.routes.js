const express = require('express');
const multer = require('multer');
const path = require('node:path');
const fs = require('node:fs');
const { readTxtFromBuffer, readCsvFromBuffer } = require('../services/fileReader');
const Billing = require('../models/Billing');

const router = express.Router();

// Use memory storage to validate file content before saving to disk
const upload = multer({
    storage: multer.memoryStorage(),
    limits: {
        fileSize: 1 * 1024 * 1024 // 1MB limit
    }
});

const formatDate = (date) => {
    if (!date) return null;
    const d = new Date(date);
    const month = String(d.getUTCMonth() + 1).padStart(2, '0');
    const day = String(d.getUTCDate()).padStart(2, '0');
    const year = d.getUTCFullYear();
    return `${month}/${day}/${year}`;
};

router.post('/', upload.single('upload'), async (req, res) => {
    try {
        // 3.1.2 - Validate whether it is a single file
        if (!req.file) {
            return res.status(400).json({
                message: 'Please input an existing request file path.'
            });
        }

        const ext = path.extname(req.file.originalname).toLowerCase();
        let requests;
        const fileContent = req.file.buffer.toString('utf8');

        // 3.1.3 - Check if file is TXT or CSV format
        if (ext === '.txt') {
            requests = readTxtFromBuffer(fileContent);
        } else if (ext === '.csv') {
            requests = readCsvFromBuffer(fileContent);
        } else {
            console.log('File is not supported for processing.');
            return res.status(400).json({
                message: 'File is not supported for processing.'
            });
        }

        // 3.2.4 - Display success message in CLI
        console.log('Successfully processed Request File');

        // Query DB by billing_cycle, start_date, and end_date
        const queryConditions = requests.map(r => ({
            billing_cycle: r.billing_cycle,
            start_date: r.start_date,
            end_date: r.end_date
        }));

        const records = await Billing.find({
            $or: queryConditions
        });

        // 3.2.3 - If no resulting records, display message
        if (!records.length) {
            return res.json({
                message: 'No Record Found!'
            });
        }

        // Records found - save file to uploads folder
        const uploadPath = path.join('uploads', req.file.originalname);
        fs.writeFileSync(uploadPath, req.file.buffer);

        // Display records with required fields
        const result = records.map(record => ({
            billing_cycle: record.billing_cycle,
            start_date: formatDate(record.start_date),
            end_date: formatDate(record.end_date),
            amount: record.amount,
            account_name: record.account?.account_name,
            first_name: record.account?.customer?.first_name,
            last_name: record.account?.customer?.last_name
        }));

        return res.json(result);

    } catch (err) {
        // 3.2.2 - Handle errors properly
        console.error(err.message);
        return res.status(400).json({
            message: err.message
        });
    }
});

module.exports = router;
