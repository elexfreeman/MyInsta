import { BasePost } from "./BasePost";

export class PostUploader extends BasePost {

    public async upload(filename: string, comment: string) {
        await this.page.waitFor(400);


        try {
            console.log('закрываем модалку попапов');
            await this.page.click('div[role="dialog"] div:nth-child(3) :nth-child(2)');
        } catch (e) {

        }

        await this.page.waitFor(1000);
        await this.page.click('div[role="menuitem"]');
        await this.page.waitFor(1000);

        console.log('try attache file');
        const input = await this.page.$('form[role="presentation"] input');
        /* const input = await this.page.$('form[role="presentation"] input[accept="image/jpeg,image/png"]'); */
        await input.uploadFile(filename);
        await this.page.waitFor(1000);
        console.log('attache DONE');

        try {
            /* на превью жмем далее */
            await this.page.click("header>div :nth-child(3) button");
            await this.page.waitFor(1000);
            /* вводи подпись */
            await this.page.type('textarea[placeholder="Введите подпись..."]', comment);
            await this.page.waitFor(1000);
            /* публикуем */
            await this.page.click("header>div :nth-child(3) button");
        } catch (e) {

        }



        await this.page.waitFor(1000);

        //await this.page.waitForNavigation({ waitUntil: 'networkidle0' });
    }

}