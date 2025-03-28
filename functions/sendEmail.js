const nodemailer = require('nodemailer');
const path = require('path');

// Send an email with the PDF attached using Nodemailer
/**
 * @param {Buffer} pdfBuffer - The PDF file buffer
 * @param {string} recipientEmail - The recipient's email address
 * @param {string} emailTitle - e.g. "Feb 2025" (used in subject & body)
 * @param {string} employeeName - e.g. "Subhin Krishna S" (used in body)
 */
async function sendEmail(pdfBuffer, recipientEmail, emailTitle, employeeName) {
  let transporter = nodemailer.createTransport({
    service: 'gmail',
    host: process.env.SMTP_HOST || 'smtp.gmail.com',
    port: process.env.SMTP_PORT || 587,
    secure: false,
    auth: {
      user: process.env.SMTP_EMAIL || 'your_gmail@example.com',
      pass: process.env.SMTP_PASSWORD || 'your_gmail_app_password'
    }
  });

  // HTML email template
  const htmlTemplate = `
  <!DOCTYPE html>
  <html lang="en">
    <head>
      <meta charset="UTF-8" />
      <meta name="viewport" content="width=device-width,initial-scale=1.0" />
      <title>Payslip for ${emailTitle}</title>
      <style>
        body {
          margin: 0;
          padding: 0;
          font-family: Arial, sans-serif;
          background-color: #ffffff;
          color: #333333;
        }
        .header {
          padding: 20px;
          text-align: center;
          color: #1B4D99;
        }
        .header img {
          height: 60px;
          margin-bottom: 10px;
        }
        .header h1 {
          margin: 0;
          font-size: 24px;
        }
        .content {
          padding: 20px;
        }
        .content p {
          line-height: 1.6;
        }
        .content ul {
          margin: 10px 0;
          padding-left: 20px;
        }
        .footer {
          background-color: #0081C6;
          padding: 10px;
          text-align: center;
          color: #ffffff;
          font-size: 14px;
        }
        .footer p {
          margin: 5px 0;
        }
        .note {
          font-size: 0.85em;
          color: #555555;
          margin-top: 30px;
        }
      </style>
    </head>
    <body>
      <div class="header">
        <!-- Reference embedded image by its CID -->
        <img src="cid:san-logo" alt="SAN Engineering Solutions" />
        <h1>Payslip for ${emailTitle}</h1>
      </div>
      <div class="content">
        <p>Dear ${employeeName},</p>
        <p>
          Please find enclosed your payslip for the month of <strong>${emailTitle}</strong>.
          We suggest that you save it in your personal records for any future reference.
        </p>
        <p><strong>Important:</strong></p>
        <ul>
          <li>Please ensure that you check the entries in your payslip.</li>
          <li>
            For any queries or concerns, you may approach your HR Manager
            or Payroll Admin.
          </li>
        </ul>
        <p>Regards,<br/>SAN Engineering Solutions</p>
        <p class="note">
          This email was generated from the SAN Payroll Portal.
        </p>
      </div>
      <div class="footer">
        <p>&copy; SAN Engineering Solutions</p>
      </div>
    </body>
  </html>
  `;

  let mailOptions = {
    from: '"SAN Engineering Solutions" <bot@sk.com>',
    to: recipientEmail,
    subject: `Payslip for ${emailTitle}`,
    // The plain-text body is still required for email clients that don't render HTML
    text: `Payslip for ${emailTitle}\n\nDear ${employeeName},\n\nPlease find enclosed your payslip for the month of ${emailTitle}. We suggest that you save it for future reference.\n\nImportant:\n- Check entries in your payslip.\n- For queries, approach HR or Payroll Admin.\n\nRegards,\nSAN Engineering Solutions\n\n(This email was generated from the SAN Payroll Portal.)`,
    // The HTML version
    html: htmlTemplate,
    attachments: [
      {
        filename: 'payslip.pdf',
        content: pdfBuffer,
        contentType: 'application/pdf'
      },
      {
        // Embedding the logo as an inline attachment with a Content ID
        filename: 'logo.png',
        path: path.join(__dirname, '..', 'public', 'logo.png'),
        cid: 'san-logo' // same as in <img src="cid:san-logo" />
      }
    ]
  };

  let info = await transporter.sendMail(mailOptions);
  console.log('Message sent: %s', info.messageId);
  console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
}

module.exports = sendEmail;
