import { BasePost } from "./BasePost";

export class Login extends BasePost {

    public async doLogin(login: string, pass: string) {

        let loginUrl = 'https://www.instagram.com/accounts/login/?source=auth_switcher';
        // Попробуем перейти по URL
        await this.page.goto(loginUrl, { waitUntil: 'networkidle2' });
        console.log(`Открываю страницу: ${loginUrl}`);
        await this.page.waitFor(1000);
        console.log('Заполняем логин и пароль');
        await this.page.type('input[name="username"]', login);
        await this.page.waitFor(100);
        await this.page.type('input[name="password"]', pass);
        await this.page.waitFor(100);
        await this.page.click('button[type="submit"]');

        await this.page.waitFor(100);
        await this.page.waitForNavigation();
        await this.page.waitFor(3000);
        console.log('закрываем модалку попапов');
        await this.page.click('div[role="dialog"] div:nth-child(3) :nth-child(2)');
        console.log('Модалка закрыта');

        await this.page.waitFor(3000);
        console.log('закрываем модалку попапов');
       // await this.page.click('div[role="dialog"] div:nth-child(3) :nth-child(2)');
        console.log('Модалка закрыта');
    }

}