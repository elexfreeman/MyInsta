import { UserInstaDB } from "./DB/UserInstaDB";
import { BasePost } from "./BasePost";

export class PostReader extends BasePost {

    protected iReadThisPosts: string[] = [];
    public scrollCount: number = 1000;

    protected userInstaDB: UserInstaDB;

    constructor(page: any, userInstaDB: UserInstaDB) {
        super(page);
        this.userInstaDB = userInstaDB;
    }


    /**
     * Выдает атрибут элемента getAttribure() 
     * @param {*} element 
     * @param {String} attr 
     */
    async getAttr(element: any, attr: any): Promise<string> {
        let resp: string;
        try {
            let Handler = await element.getProperty(attr);
            resp = await Handler.jsonValue();
        } catch (e) {

        }
        return resp;
    }


    public async read() {
        let aPost = await this.page.$$('article> :nth-child(4)>div>div>div a');

        for (let i = 0; i < aPost.length; i++) {
            let href = await this.getAttr(aPost[i], 'href');

            if (!this.iReadThisPosts.includes(href)) {
                console.log(href);
                await this.readPostModal(aPost[i]);
                this.iReadThisPosts.push(href);
            }

            console.log();
        }
        return aPost.length;
    }


    /**
     * Клик по модалке поста
     * @param {*} page 
     * @param {*} post 
     */
    private async readPostModal(post: any) {
        /* кликаем по посту */
        await post.click();
        await this.page.waitFor(1000);

        /* ищем аватарку */
        let avatar = await this.page.$('div[role="dialog"] article img');
        let alt = await this.getAttr(avatar, 'alt');
        console.log('alt = ', alt);

        try {
            let user = {
                url: alt.split(' ')[2]
            }

            await this.userInstaDB.add(user);
        } catch (e) {
            console.log(e);
        }

        await this.page.waitFor(1000);

        /* закрываем модалку */
        let closeButton = await this.page.$('div[role="dialog"]> :nth-child(3)');
        await closeButton.click();
        await this.page.waitFor(1000);

    }


    public async startWorkAt(url: string) {
        await this.page.goto(url, { waitUntil: 'networkidle2' });

        let scrollDelay = 1000;
        let previousHeight = 0;

        /* считываем посты */
        for (let i = 0; i < this.scrollCount; i++) {
            previousHeight = await this.page.evaluate('document.body.scrollHeight');
            try {
                await this.read();
            } catch (e) {
                console.log(e);
            }
            await this.page.evaluate('window.scrollTo(0, document.body.scrollHeight)');
            await this.page.waitForFunction(`document.body.scrollHeight > ${previousHeight}`);
            await this.page.waitFor(scrollDelay);
        }
    }

}