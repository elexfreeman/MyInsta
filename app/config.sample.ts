
export interface ConfigI {
    login: string;
    pass: string;
    width: number;
    height: number;
    chrome: string;
    mysql: any;
}




export const config: ConfigI = {
    login: '',
    pass: '',
    width: 1600,
    height: 1200,
    chrome: 'C:/Program Files (x86)/Google/Chrome/Application/chrome.exe',
    mysql: {
        client: 'mysql',
        connection: {
            host: "127.0.0.1",
            user: '',
            pass: '',
            database: ''
        },
        pool: { min: 0, max: 7 },
        acquireConnectionTimeout: 60000,

        "migrations": {
            "tableName": "knex_migrations",
            "directory": "./migrations"
        },
    },

}
