export class ReadPost {

    protected iReadThisPosts: string[] = [];

    protected page: any;

    constructor(page: any) {
        this.page = page;
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
        let aPost = await this.page.$$('article> :nth-child(3)>div>div>div a');

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
        console.log('alt = ', await this.getAttr(avatar, 'alt'));
        await this.page.waitFor(1000);

        /* закрываем модалку */
        let closeButton = await this.page.$('div[role="dialog"]> :nth-child(3)');
        await closeButton.click();
        await this.page.waitFor(1000);

    }

}