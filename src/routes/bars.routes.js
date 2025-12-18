const express = require('express');
const multer = require('multer');
const path = require('node:path');
const fs = require('node:fs');
const { readTxtFromBuffer, readCsvFromBuffer } = require('../services/fileReader');
const Billing = require('../models/Billing');

const router = express.Router();

// Use memory storage to validate file content before saving to disk
// Limit file size to 1MB to prevent DoS attacks
const upload = multer({
    storage: multer.memoryStorage(),
    limits: {
        fileSize: 1 * 1024 * 1024 // 1MB limit
    }
});

// Helper function to format date as MM/DD/YYYY
const formatDate = (date) => {
    if (!date) return null;
    const d = new Date(date);
    const month = String(d.getUTCMonth() + 1).padStart(2, '0');
    const day = String(d.getUTCDate()).padStart(2, '0');
    const year = d.getUTCFullYear();
    return `${month}/${day}/${year}`;
};

// 3.1.1 - GET route to display file upload form for web browser access
router.get('/', (req, res) => {
    res.send(`
        <!DOCTYPE html>
        <html>
        <head>
            <title>BARS - Process File</title>
            <style>
                body { font-family: Arial, sans-serif; margin: 40px; background: #f5f5f5; }
                .container { max-width: 600px; margin: 0 auto; background: white; padding: 30px; border-radius: 8px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }
                h1 { color: #333; }
                .form-group { margin: 20px 0; }
                label { display: block; margin-bottom: 8px; font-weight: bold; }
                input[type="file"] { padding: 10px; border: 1px solid #ddd; border-radius: 4px; width: 100%; }
                button { background: #007bff; color: white; padding: 12px 24px; border: none; border-radius: 4px; cursor: pointer; font-size: 16px; }
                button:hover { background: #0056b3; }
                .info { background: #e7f3ff; padding: 15px; border-radius: 4px; margin-bottom: 20px; }
                .info p { margin: 5px 0; }
            </style>
        </head>
        <body>
            <div class="container">
                <h1>BARS - Process Request File</h1>
                <div class="info">
                    <p><strong>Supported formats:</strong></p>
                    <p>• TXT: 18 characters per line (2 for Billing Cycle + 8 for Start Date + 8 for End Date)</p>
                    <p>• CSV: 3 columns (Billing Cycle, Start Date MM/DD/YYYY, End Date MM/DD/YYYY)</p>
                </div>
                <form action="/upload" method="POST" enctype="multipart/form-data">
                    <div class="form-group">
                        <label for="file">Select a file to process:</label>
                        <input type="file" name="file" id="file" required>
                    </div>
                    <button type="submit">Process File</button>
                </form>
            </div>
        </body>
        </html>
    `);
});

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
