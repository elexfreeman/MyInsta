const puppeteer = require('puppeteer');

import { config } from "./config";
import { ReadPost } from "./ReadPost";

function wait(t: number) {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            resolve(true);
        }, t)
    })
}

const width = 1600;
const height = 1200;


let search = '#canada';

async function run() {
    // Запустим браузер
    const browser = await puppeteer.launch({
        //  args: ['--no-sandbox']
        headless: false,
        executablePath: 'C:/Program Files (x86)/Google/Chrome/Application/chrome.exe',
        args: [
            `--window-size=${width},${height}`
        ],
    }
    );
    // Откроем новую страницу
    const page = await browser.newPage();
    const pageURL = 'https://www.instagram.com/accounts/login/?source=auth_switcher';

    try {
        await page.setViewport({ width: width, height: height })

        // Попробуем перейти по URL
        await page.goto(pageURL, { waitUntil: 'networkidle2' });
        console.log(`Открываю страницу: ${pageURL}`);



        await page.type('input[name="username"]', config.login);
        await wait(100);
        await page.type('input[name="password"]', config.pass);
        await wait(100);
        await page.click('button[type="submit"]');

        await wait(100);
        await page.waitForNavigation();

        await wait(1000);
        await page.click('div[role="dialog"] div:nth-child(3) :nth-child(2)');
        await wait(1000);
        await page.type('input[placeholder="Поиск"]', search);
        await wait(500);
        await page.goto('https://www.instagram.com/explore/tags/%D1%81%D0%B0%D0%BC%D0%B0%D1%80%D0%B0/', { waitUntil: 'networkidle2' });
        await wait(2000);

        let post = await page.$('article> :nth-child(3)>div>div>div');
        let postClassHandler = await post.getProperty('className');
        let postClassName = await postClassHandler.jsonValue();
        console.log(postClassName);

        //article> :nth-child(3)>div>div>div a

        let aPost = await page.$$('article> :nth-child(3)>div>div>div a');

        for (let i = 0; i < aPost.length; i++) {
            let postClassHandler = await aPost[i].getProperty('href');
            let postHref = await postClassHandler.jsonValue();
            console.log(postHref);
        }


        let scrollDelay = 1000;
        let scrollCount = 100;

        let previousHeight;


        let readPosts = new ReadPost(page);
        for (let i = 0; i < scrollCount; i++) {
            previousHeight = await page.evaluate('document.body.scrollHeight');
            try {
                await readPosts.read();
            } catch (e) {
                console.log(e);
            }
            await page.evaluate('window.scrollTo(0, document.body.scrollHeight)');
            await page.waitForFunction(`document.body.scrollHeight > ${previousHeight}`);
            await page.waitFor(scrollDelay);
        }




        /* let postClassHandler = await post.getProperty('className');
        let postClassName = await postClassHandler.jsonValue();
        console.log(postClassName); */

        //article> :nth-child(3)>div
        //article> :nth-child(3)>div>div>div - class


        console.log('New Page URL:', page.url());

    } catch (error) {
        console.log(`Не удалось открыть
        страницу: ${pageURL} из-за ошибки: ${error}`);
    }

    await wait(3000);
    // Всё сделано, закроем браузер
    await browser.close();

    process.exit()
};

run();