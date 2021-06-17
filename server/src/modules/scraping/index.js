import puppeteer from 'puppeteer';

let browser;

export async function getBrowser() {
    if (!browser) {
        browser = await puppeteer.launch({ args: ['--no-sandbox'] });
        async function exitHandler(options, exitCode) {
            console.log('Closing puppeteer browser . . .');
            await browser.close();
            if (exitCode || exitCode === 0) {
                console.log(`Exit code: ${exitCode}`);
            }
            if (options.exit) {
                process.exit();
            }
        }

        process.on('exit', exitHandler.bind(null, {}));
        process.on('SIGINT', exitHandler.bind(null, { exit: true }));
        process.on('SIGUSR1', exitHandler.bind(null, { exit: true }));
        process.on('SIGUSR2', exitHandler.bind(null, { exit: true }));
        process.on('uncaughtException', exitHandler.bind(null, { exit: true }));
    }
    return browser;
}

export async function $eval(page, selector, func) {
    await page.waitForSelector(selector);
    return await page.$eval(selector, func);
}
