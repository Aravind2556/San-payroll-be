const puppeteer = require('puppeteer');

// Generate a PDF from the HTML string using Puppeteer
async function generatePDF(htmlContent) {
    // const browser = await puppeteer.launch({ headless: true });
    const browser = await puppeteer.launch({
        executablePath: puppeteer.executablePath(), // use Puppeteer's bundled Chromium path
        // headless: true,
        // executablePath: process.env.CHROME_PATH || '/usr/bin/chromium-browser', // or the correct path on Render
        // executablePath: process.env.CHROME_PATH || '/usr/bin/chromium', // or the correct path on Render
        // executablePath: process.env.CHROME_PATH || '/usr/bin/google-chrome', // or the correct path on Render
        args: ['--no-sandbox', '--disable-setuid-sandbox']
    });      
    const page = await browser.newPage();
    await page.setContent(htmlContent, { waitUntil: 'networkidle0' });
    const pdfBuffer = await page.pdf({ format: 'A4', printBackground: true });
    await browser.close();
    return pdfBuffer;
}

module.exports = generatePDF;