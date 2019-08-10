const puppeteer = require('puppeteer');

import { config } from "./config";

function wait(t: number) {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            resolve(true);
        }, t)
    })
}

/**
 * Выдает атрибут элемента getAttribure() 
 * @param {*} element 
 * @param {String} attr 
 */
async function getAttr(element: any, attr: any) {
    let resp;
    try {
        let Handler = await element.getProperty(attr);
        resp = await Handler.jsonValue();
    } catch (e) {

    }
    return resp;
}

async function readPosts(page: any) {
    let aPost = await page.$$('article> :nth-child(3)>div>div>div a');

    for (let i = 0; i < aPost.length; i++) {
        console.log(await getAttr(aPost[i], 'href'));
        await readPostModal(page, aPost[i]);
        console.log();
    }
    return aPost.length;
}

/**
 * Клик по модалке поста
 * @param {*} page 
 * @param {*} post 
 */
async function readPostModal(page: any, post: any) {
    /* кликаем по посту */
    await post.click();
    await page.waitFor(1000);

    /* ищем аватарку */
    let avatar = await page.$('div[role="dialog"] article img');
    console.log('alt = ', await getAttr(avatar, 'alt'));
    await page.waitFor(1000);

    /* закрываем модалку */
    let closeButton = await page.$('div[role="dialog"]> :nth-child(3)');
    await closeButton.click();
    await page.waitFor(1000);

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


        for (let i = 0; i < scrollCount; i++) {
            previousHeight = await page.evaluate('document.body.scrollHeight');
            try {
                await readPosts(page);
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