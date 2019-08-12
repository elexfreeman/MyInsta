import * as puppeteer from 'puppeteer';
import { ConfigI } from "./config";
import { PostReader } from "./PostReader";
import { UserInstaDB } from './DB/UserInstaDB';
import { Login } from './Login';
import { PostUploader } from './PostUploader';

const devices = require('puppeteer/DeviceDescriptors');
const iPhone = {
    'name': 'iPhone 6 Plus',
    'userAgent': 'Mozilla/5.0 (iPhone; CPU iPhone OS 11_0 like Mac OS X) AppleWebKit/604.1.38 (KHTML, like Gecko) Version/11.0 Mobile/15A372 Safari/604.1',
    'viewport': {
        'width': 414,
        'height': 736,
        'deviceScaleFactor': 3,
        'isMobile': true,
        'hasTouch': true,
        'isLandscape': false
    }
};
export class App {

    config: ConfigI;

    userInstaDB: UserInstaDB;



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
                `--window-size=${this.config.width},${this.config.height}`,
            ],
        }
        );

        // Откроем новую страницу
        const page = await browser.newPage();
        await page.emulate(iPhone);

        const pageURL = 'https://www.instagram.com/accounts/login/?source=auth_switcher';

        try {
            await page.setViewport({ width: this.config.width, height: this.config.height })

            /* логинимся */
            let login = new Login(page);
            await login.doLogin(this.config.login, this.config.pass);

            let postReader = new PostReader(page, this.userInstaDB);

            //await postReader.startWorkAt('https://www.instagram.com/explore/tags/kity/');

            let postUploader = new PostUploader(page);
            await postUploader.upload('i:/instagramm/europe.jpg', 'Где-то на Европе...');

            console.log('New Page URL:', page.url());

        } catch (error) {
            console.log(`Не удалось открыть страницу: ${pageURL} из-за ошибки: ${error}`);
        }

        await page.waitFor(3000);
        // Всё сделано, закроем браузер
        await browser.close();

        process.exit()
    };
}