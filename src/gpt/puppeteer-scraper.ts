// import puppeteer, { Browser, Page } from 'puppeteer';

// const TIMEOUT = 60000; // Increase timeout to 60 seconds
// const MAX_RETRIES = 3;

// export async function scrapeWebsite(url: string): Promise<string> {
//   let browser: Browser | null = null;
//   let page: Page | null = null;

//   for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
//     try {
//       console.log(`Attempt ${attempt}: Launching browser`);
//       browser = await puppeteer.launch({
//         headless: true,
//         args: ['--no-sandbox', '--disable-setuid-sandbox'],
//       });

//       console.log(`Attempt ${attempt}: Opening new page`);
//       page = await browser.newPage();

//       console.log(`Attempt ${attempt}: Setting navigation timeout`);
//       await page.setDefaultNavigationTimeout(TIMEOUT);

//       console.log(`Attempt ${attempt}: Navigating to URL: ${url}`);
//       const response = await page.goto(url, { waitUntil: 'networkidle2' });

//       if (!response || !response.ok()) {
//         throw new Error(`Failed to load page, status: ${response?.status()}`);
//       }

//       console.log(`Attempt ${attempt}: Waiting for network to be idle`);
//       await new Promise(resolve => setTimeout(resolve, 5000)); // Use setTimeout as a workaround

//       console.log(`Attempt ${attempt}: Evaluating page content`);
//       const content = await page.evaluate(() => document.body.innerText);

//       console.log(`Attempt ${attempt}: Closing browser`);
//       await browser.close();

//       if (!content) {
//         throw new Error('Failed to fetch content from the website');
//       }

//       console.log('Fetched website content:', content);
//       return content;
//     } catch (error: any) {
//       console.error(`Attempt ${attempt} failed:`, error);
//       if (browser) {
//         await browser.close();
//       }
//       if (attempt === MAX_RETRIES) {
//         throw new Error(`Failed to fetch product page after ${MAX_RETRIES} attempts: ${error.message}`);
//       }
//     }
//   }

//   throw new Error('Unexpected error in scrapeWebsite');
// }


import puppeteer, { Browser, Page } from 'puppeteer-core';
import chromium from 'chrome-aws-lambda';

const TIMEOUT = 60000; // Increase timeout to 60 seconds
const MAX_RETRIES = 3;

export async function scrapeWebsite(url: string): Promise<string> {
  let browser: Browser | null = null;
  let page: Page | null = null;

  for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
    try {
      console.log(`Attempt ${attempt}: Launching browser`);
      browser = await puppeteer.launch({
        headless: chromium.headless,
        args: chromium.args,
        executablePath: await chromium.executablePath,
      });

      console.log(`Attempt ${attempt}: Opening new page`);
      page = await browser.newPage();

      console.log(`Attempt ${attempt}: Setting navigation timeout`);
      await page.setDefaultNavigationTimeout(TIMEOUT);

      console.log(`Attempt ${attempt}: Navigating to URL: ${url}`);
      const response = await page.goto(url, { waitUntil: 'networkidle2' });

      if (!response || !response.ok()) {
        throw new Error(`Failed to load page, status: ${response?.status()}`);
      }

      console.log(`Attempt ${attempt}: Waiting for network to be idle`);
      await new Promise(resolve => setTimeout(resolve, 5000)); // Use setTimeout as a workaround

      console.log(`Attempt ${attempt}: Evaluating page content`);
      const content = await page.evaluate(() => document.body.innerText);

      console.log(`Attempt ${attempt}: Closing browser`);
      await browser.close();

      if (!content) {
        throw new Error('Failed to fetch content from the website');
      }

      console.log('Fetched website content:', content);
      return content;
    } catch (error: any) {
      console.error(`Attempt ${attempt} failed:`, error);
      if (browser) {
        await browser.close();
      }
      if (attempt === MAX_RETRIES) {
        throw new Error(`Failed to fetch product page after ${MAX_RETRIES} attempts: ${error.message}`);
      }
    }
  }

  throw new Error('Unexpected error in scrapeWebsite');
}
