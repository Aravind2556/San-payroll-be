// routes/EmailRouter.js

const Express = require('express');
const multer = require('multer');
const path = require('path');
const xlsx = require('xlsx');
const numberToWords = require('number-to-words'); // Added to convert numbers to words

const generateHtml = require('../functions/generateHtml');
const generatePDF = require('../functions/generatePDF');
const sendEmail = require('../functions/sendEmail');

const EmailRouter = Express.Router();

// Configure multer to store the uploaded file in a temporary 'uploads/' folder
const upload = multer({ dest: 'uploads/' });

// Define required columns
const REQUIRED_COLUMNS = [
  'month', 'year', 'empName', 'empMail', 'id', 'doj', 'department',
  'designation', 'paymentMode', 'bankName', 'bankIfsc', 'accountNumber',
  'UAN', 'ESICNumber', 'PANNumber', 'AadhaarNumber', 'actualPayableDays',
  'totalWorkingDays', 'LOP', 'payableDays', 'basic', 'HRA', 'conveyance',
  'totalEarningA', 'EPF', 'ESI', 'totalContributionB', 'salaryAdvance',
  'TDS', 'otherDeductions', 'totalDeductionsC', 'netSalaryPayable',
  // Removed salaryInWords from REQUIRED_COLUMNS since it will be auto generated
];

/** 
 * Converts a scientific-notation string to a plain string if possible.
 */
function fixScientificNotation(value) {
  if (typeof value === 'string' && /e\+/i.test(value)) {
    const num = Number(value);
    if (!isNaN(num)) {
      return num.toFixed(0); // e.g. "5.24856E+11" -> "524856000000"
    }
  }
  return value;
}

/**
 * POST /upload-excel-and-send
 * Uploads an Excel file, validates columns, generates PDFs for each row, and sends emails.
 */
EmailRouter.post('/upload-excel-and-send', upload.single('excelFile'), async (req, res) => {
  try {
    // 1. Check if file is present
    if (!req.file) {
      return res.status(400).send({ success: false, message: 'No Excel file uploaded.' });
    }

    // SSE HEADERS
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');

    // Helper function to send an SSE message
    function sendSSE(eventName, data) {
      res.write(`event: ${eventName}\n`);
      res.write(`data: ${JSON.stringify(data)}\n\n`);
    }

    // 2. Read the Excel file
    const workbook = xlsx.readFile(req.file.path);
    const sheetName = workbook.SheetNames[0]; // Use the first sheet
    const worksheet = workbook.Sheets[sheetName];

    // 3. Convert sheet to JSON
    const jsonData = xlsx.utils.sheet_to_json(worksheet, {
      defval: '',
      raw: false,
      dateNF: 'dd-mmm-yy'
    });

    // 4. Validate that we have at least one row
    if (!jsonData.length) {
      sendSSE('error', { success: false, message: 'Excel file is empty (no rows found).' });
      return res.end();
    }

    // 5. Validate columns: check if the first row has all REQUIRED_COLUMNS
    const fileColumns = Object.keys(jsonData[0]);
    const missingColumns = REQUIRED_COLUMNS.filter(col => !fileColumns.includes(col));
    if (missingColumns.length > 0) {
      sendSSE('error', { 
        success: false, 
        message: `Missing required columns: ${missingColumns.join(', ')}`
      });
      return res.end();
    }

    // Inform the client that we’re starting
    sendSSE('progress', {
      success: true,
      message: `Initializing payroll processing for ${jsonData.length} employee(s)... (0/${jsonData.length} completed)`
    });

    // 6. Process each row: generate PDF & send email
    for (let i = 0; i < jsonData.length; i++) {
      const row = jsonData[i];

      // (Optional) Additional validations: ensure no required field is empty
      for (const col of REQUIRED_COLUMNS) {
        if (!row[col] && row[col] !== 0) {
          sendSSE('error', {
            success: false,
            message: `Row ${i + 2} is missing data in column '${col}'.`
          });
          return res.end();
        }
      }

      // Fix AadhaarNumber if it has scientific notation
      row.AadhaarNumber = fixScientificNotation(row.AadhaarNumber);

      // Auto generate salary in words from netSalaryPayable
      // Convert netSalaryPayable to a number (if it's not already) before conversion
      const netSalaryString = row.netSalaryPayable.replace(/,/g, '');
      const netSalary = Number(netSalaryString);
      console.log('Net Salary:', row.netSalaryPayable);
      console.log('Net Salary after conversion:', netSalary);
      const salaryInWords = isNaN(netSalary)
        ? 'Invalid Amount'
        : numberToWords.toWords(netSalary);
      

      // Helper function to capitalize the first letter and lowercase the rest
      function capitalizeFirstLetter(str) {
        if (!str || typeof str !== 'string') return '';
        return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
      }

      // Construct a PdfContent-like object from the row
      const PdfContent = {
        month: row.month,
        year: row.year,
        empName: row.empName,
        id: row.id,
        doj: row.doj,
        department: row.department,
        designation: row.designation,
        paymentMode: capitalizeFirstLetter(row.paymentMode),
        bankName: row.bankName,
        bankIfsc: row.bankIfsc,
        accountNumber: row.accountNumber,
        UAN: row.UAN,
        ESICNumber: row.ESICNumber,
        PANNumber: row.PANNumber,
        AadhaarNumber: row.AadhaarNumber,
        actualPayableDays: row.actualPayableDays,
        totalWorkingDays: row.totalWorkingDays,
        LOP: row.LOP,
        payableDays: row.payableDays,
        basic: row.basic,
        HRA: row.HRA,
        conveyance: row.conveyance,
        totalEarningA: row.totalEarningA,
        EPF: row.EPF,
        ESI: row.ESI,
        totalContributionB: row.totalContributionB,
        salaryAdvance: row.salaryAdvance,
        TDS: row.TDS,
        otherDeductions: row.otherDeductions,
        totalDeductionsC: row.totalDeductionsC,
        netSalaryPayable: row.netSalaryPayable,
        salaryInWords: capitalizeFirstLetter(salaryInWords)  // Auto-generated from netSalaryPayable
      };

      // Generate HTML from the row data
      const htmlContent = generateHtml(PdfContent);

      // Generate PDF
      const pdfBuffer = await generatePDF(htmlContent);

      // Send email to the 'empMail' column
      const recipientEmail = row.empMail;
      const emailTitle = `${row.month} ${row.year}`;
      await sendEmail(pdfBuffer, recipientEmail, emailTitle, row.empName);

      // Send a progress update after each row
      sendSSE('progress', {
        success: true,
        message: `Successfully sent email to ${recipientEmail}. (${i + 1}/${jsonData.length} completed)`
      });
    }

    // 7. All rows processed successfully
    sendSSE('complete', {
      success: true,
      message: 'All PDFs have been generated and emails have been dispatched successfully.'
    });
    return res.end();

  } catch (error) {
    console.error('Error processing Excel file:', error);
    res.write(`event: error\n`);
    res.write(`data: ${JSON.stringify({ success: false, message: 'An error occurred while processing the Excel file.' })}\n\n`);
    return res.end();
  }
});

module.exports = EmailRouter;
