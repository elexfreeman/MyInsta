import { BasePost } from "./BasePost";
import * as puppeteer from 'puppeteer';
import { ConfigI } from "./config";
import { download, generateToken } from "./libs";
const md5 = require("md5");

export class CatsReader extends BasePost {

    private readUrl: string;
    private config: ConfigI;


    constructor(page: any, readUrl: string, config: ConfigI) {
        super(page);
        this.config = config;
        this.readUrl = readUrl;
    }

    /**
     * Асинхронный конструктор
     * @param readUrl 
     * @param config 
     */
    static async Init(readUrl: string, config: ConfigI) {
        // Запустим браузер
        const browser = await puppeteer.launch({
            //  args: ['--no-sandbox']
            headless: false,
            executablePath: config.chrome,
            args: [
                `--window-size=${config.width},${config.height}`,
            ],
        }
        );

        // Откроем новую страницу
        let page = await browser.newPage();
        await page.setViewport({ width: config.width, height: config.height })
        return new CatsReader(page, readUrl, config);

    }

    public async run() {
        // Попробуем перейти по URL

        await this.page.goto('https://www.flickr.com/photos/andymiccone/20924906054/in/photolist-xT4Byj-eU9tAL-bqBJX-MAhaZi-qtWt9W-TZiCHX-2dffhWh-rxSAiw-6reBew-SvpF83-ALf7u-6rarfx-DDLQhJ-pBmJfF-nWyHZt-askbXy-d6FqJw-Mx2vdi-RTwauJ-8UkiEn-213CxX4-jEiEB-vLea-d6Fm4s-2e6GrHu-HiBYux-21XryFj-8oTEgR-RtJQCm-aCYBxr-6r5Box-6r5Asv-fBDNxm-8BvNi7-213BavT-CzCgRw-2e4NLJL-GJBpRo-z8Xskp-S1b663-GX1GeL-8Bwc23-6rezDN-6rezsy-6r5Dp6-29LUdHR-o3w41P-Dp9Zdt-qCw-21RJLYq', { waitUntil: 'networkidle2' });

/*         await this.page.waitFor(1000);


        await this.goToImgSlider();

        await this.page.waitFor(2000);
 */

        while (true) {
            this.readPhoto();
            await this.page.waitFor(1000);
            this.goToNext();
        }

    }

    private async goToNext() {
        let nextElem = await this.page.$('.navigate-target.navigate-next');
        let hrefNext = await this.getAttr(nextElem, 'href');
        console.log(`Открываю страницу: ${hrefNext}`);
        await this.page.goto(hrefNext, { waitUntil: 'networkidle2' });

        await this.page.waitFor(200);
    }

    private async goToImgSlider() {
        console.log('Открываю слайдер');
        await this.page.click('.view.photo-list-view a.overlay');
        await this.page.waitForNavigation({ waitUntil: 'networkidle0' });
        await this.page.waitFor(200);
    }

    private async readPhoto() {
        console.log('readPhoto');
        let photoElem = await this.page.$('.view.photo-well-media-scrappy-view .main-photo');
        let photo = await this.getAttr(photoElem, 'src');

        console.log(photo);

        await download(photo, this.config.catsPath + md5(photo) + '.jpg');
        //
    }

}