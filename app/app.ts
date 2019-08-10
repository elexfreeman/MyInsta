import * as puppeteer from 'puppeteer';
import { ConfigI } from "./config";
import { ReadPost } from "./ReadPost";
import { UserInstaDB } from './DB/UserInstaDB';

export class App {

    config: ConfigI;

    userInstaDB: UserInstaDB;

    public scrollCount: number = 1000;

    constructor(config: ConfigI) {
        this.userInstaDB = new UserInstaDB();
        this.config = config;
    }

    async run() {
        // Запустим браузер
        const browser = await puppeteer.launch({
            //  args: ['--no-sandbox']
            headless: false,
            executablePath: this.config.chrome,
            args: [
                `--window-size=${this.config.width},${this.config.height}`
            ],
        }
        );
        // Откроем новую страницу
        const page = await browser.newPage();
        const pageURL = 'https://www.instagram.com/accounts/login/?source=auth_switcher';

        try {
            await page.setViewport({ width: this.config.width, height: this.config.height })

            // Попробуем перейти по URL
            await page.goto(pageURL, { waitUntil: 'networkidle2' });
            console.log(`Открываю страницу: ${pageURL}`);


            console.log('Заполняем логин и пароль');
            await page.type('input[name="username"]', this.config.login);
            await page.waitFor(100);
            await page.type('input[name="password"]', this.config.pass);
            await page.waitFor(100);
            await page.click('button[type="submit"]');

            await page.waitFor(100);
            await page.waitForNavigation();

            await page.waitFor(1000);
            /* закрываем модалку попапов */
            console.log('закрываем модалку попапов');
            await page.click('div[role="dialog"] div:nth-child(3) :nth-child(2)');
            await page.waitFor(1000);
            await page.type('input[placeholder="Поиск"]', 'search');
            await page.waitFor(500);
            await page.goto('https://www.instagram.com/explore/tags/%D1%81%D0%B0%D0%BC%D0%B0%D1%80%D0%B0/', { waitUntil: 'networkidle2' });
            await page.waitFor(2000);

            console.log('Находим имя класса дял постов');
            let post = await page.$('article> :nth-child(3)>div>div>div');
            let postClassHandler = await post.getProperty('className');
            let postClassName = await postClassHandler.jsonValue();
            console.log('postClassName', postClassName);

            //article> :nth-child(3)>div>div>div a

            console.log('Находим имя посты');
            let aPost = await page.$$('article> :nth-child(3)>div>div>div a');

            for (let i = 0; i < aPost.length; i++) {
                let postClassHandler = await aPost[i].getProperty('href');
                let postHref = await postClassHandler.jsonValue();
                console.log(postHref);
            }


            let scrollDelay = 1000;
            let previousHeight;


            let readPosts = new ReadPost(page, this.userInstaDB);
            for (let i = 0; i < this.scrollCount; i++) {
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

            console.log('New Page URL:', page.url());

        } catch (error) {
            console.log(`Не удалось открыть
        страницу: ${pageURL} из-за ошибки: ${error}`);
        }

        await page.waitFor(3000);
        // Всё сделано, закроем браузер
        await browser.close();

        process.exit()
    };
}