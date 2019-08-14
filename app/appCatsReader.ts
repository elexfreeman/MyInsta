import { CatsReader } from "./CatsReader";
import { ConfigI } from "./config";

const startUrl = 'https://www.flickr.com/search/?text=cats&license=7%2C9%2C10&view_all=1';

const config: ConfigI = {
    login: 'mrkitystory',
    pass: 'asjdhyetr873874',
    width: 1600,
    height: 1200,
    chrome: 'C:/Program Files (x86)/Google/Chrome/Application/chrome.exe',
    mysql: {
        client: 'mysql',
        connection: {
            host: "127.0.0.1",
            user: 'root',
            pass: '',
            database: 'my_insta'
        },
        pool: { min: 0, max: 7 },
        acquireConnectionTimeout: 60000,

        "migrations": {
            "tableName": "knex_migrations",
            "directory": "./migrations"
        },
    },
    catsPath: 'i:/instagramm/cats/'

}


async function main() {
    let cr = await CatsReader.Init(startUrl, config);
    await cr.run();
}


main();