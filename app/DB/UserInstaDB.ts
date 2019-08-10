import { db } from './db';

export interface UserInstaI {
    id?: number;
    url?: string;
    nama?: string;
}

export class UserInstaDB {

    public async getUserByUrl(url: string): Promise<UserInstaI> {

        let resp: UserInstaI;

        let sql = `SELECT * from user_insta u where u.url = :url LIMIT 1`;
        try {
            let result = await db.raw(sql, {
                'url': url,
            });
            resp = result[0][0];
        } catch (e) {
            console.log(e);
        }

        return resp;

    }

    public async insert(data: UserInstaI): Promise<number> {

        let userId: number;

        let tmp = await db('user_insta')
            .insert(data);

        userId = <number>tmp[0]

        return userId;
    }

    /**
     * Добавляет полльзователя если такой не имеется
     * @param data 
     */
    public async add(data: UserInstaI): Promise<number> {
        let userId: number;

        try {

            if (!data.url) {
                throw 'empty url';
            }

            let user = await this.getUserByUrl(data.url);

            if (user) {
                userId = user.id;
            } else {
                userId = await this.insert(data);
            }


        } catch (e) {
            console.log('UserSQL.add', e);
        }

        return userId;
    }
}