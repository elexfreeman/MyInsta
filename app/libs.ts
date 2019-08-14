const fs = require('fs');

const md5 = require("md5");
const uniqid = require('uniqid');
import axios from 'axios';


//download function
export async function download(url: string, filename: string) {
    axios({
        method: "get",
        url: url,
        responseType: "stream"
    }).then(function (response: any) {
        response.data.pipe(fs.createWriteStream(filename));
    });

};


/**
 * Выдает md5
 * @param str 
 * @returns hash
 */
export function ToHash(str: string): string {
    return md5(str);
}


/**
 * Генерирует токен
 */
export function generateToken(): string {
    return ToHash(uniqid() + String(new Date()));
}