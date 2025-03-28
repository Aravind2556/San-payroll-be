// const puppeteer = require('puppeteer');

// async function generatePDF(htmlContent) {

//     const browser = await puppeteer.launch({ headless: true});
    
//     const page = await browser.newPage();
//     await page.setContent(htmlContent, { waitUntil: 'networkidle0' });
//     const pdfBuffer = await page.pdf({ format: 'A4', printBackground: true });
//     await browser.close();
//     return pdfBuffer;
// }

// module.exports = generatePDF;


const { chromium } = require('playwright-chromium');

async function generatePDF(htmlContent) {
    const browser = await chromium.launch({
        headless: true, 
        args: ['--no-sandbox', '--disable-setuid-sandbox']
    });

    const page = await browser.newPage();
    await page.setContent(htmlContent, { waitUntil: 'networkidle' });

    const pdfBuffer = await page.pdf({ format: 'A4', printBackground: true });

    await browser.close();
    return pdfBuffer;
}

module.exports = generatePDF;
