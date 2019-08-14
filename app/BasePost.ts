export class BasePost {
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

}