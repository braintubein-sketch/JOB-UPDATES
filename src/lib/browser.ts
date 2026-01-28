import puppeteer from 'puppeteer-core';
import chromium from '@sparticuz/chromium-min';

export async function getBrowser() {
    const isProduction = process.env.NODE_ENV === 'production';

    if (isProduction) {
        return await puppeteer.launch({
            args: [
                ...chromium.args,
                '--no-sandbox',
                '--disable-setuid-sandbox',
                '--disable-dev-shm-usage', // Critical for Render/Docker
                '--disable-accelerated-2d-canvas',
                '--no-first-run',
                '--no-zygote',
                '--disable-gpu'
            ],
            defaultViewport: { width: 1920, height: 1080 },
            executablePath: await chromium.executablePath('https://github.com/Sparticuz/chromium/releases/download/v121.0.0/chromium-v121.0.0-pack.tar'),
            headless: true,
        });
    } else {
        // Local development: use local chrome installation
        // You might need to adjust the executablePath for your local OS
        return await puppeteer.launch({
            headless: true,
            channel: 'chrome',
        });
    }
}
