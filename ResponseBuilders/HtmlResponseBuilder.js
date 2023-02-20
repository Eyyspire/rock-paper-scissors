import ResponseBuilder from "./ResponseBuilder.js";
import * as fs from 'fs/promises';

export default class HtmlResponseBuilder extends ResponseBuilder{


    constructor(request, response) {
        super(request, response)
        this.prefix = `${this.prefix}/html`
        this.type = "text/html"
        this.extension = ".html"
    }

    async readFile(path){
        return await fs.readFile(path, 'utf8');
    }
}


