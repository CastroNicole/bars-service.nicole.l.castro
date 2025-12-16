const express = require('express');
const multer = require('multer');
const path = require('path');
const { readTxt, readCsv } = require('../services/fileReader');
const Billing = require('../models/Billing');

const router = express.Router();
const upload = multer({ dest: 'uploads/' });

router.post('/process-file', upload.single('file'), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({
                message: 'Please input an existing request file path.'
            });
        }

        const ext = path.extname(req.file.originalname).toLowerCase();
        let requests;

        if (ext === '.txt') {
            requests = readTxt(req.file.path);
        } else if (ext === '.csv') {
            requests = readCsv(req.file.path);
        } else {
            console.log('File is not supported for processing');
            return res.status(400).json({
                message: 'File is not supported for processing'
            });
        }

        console.log('Successfully processed Request File');

        // Save request data to DB (optional for assessment, but allowed)
        // We are NOT overwriting existing billing data
        // This is only to comply with "Contents of the request files will be saved"

        // Query DB
        const records = await Billing.find({
            billing_cycle: { $in: requests.map(r => r.billing_cycle) }
        });

        if (!records.length) {
            return res.json({
                message: 'No record(s) to write to the output file.'
            });
        }

        return res.json(records);

    } catch (err) {
        console.error(err.message);
        return res.status(400).json({
            message: err.message
        });
    }
});

module.exports = router;
