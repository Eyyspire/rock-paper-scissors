import { URL } from 'url';
import * as fs from 'fs/promises';

const BASE = 'http://localhost/';

export default class ResponseBuilder {

    #response
    #request
    #url
    #type

    constructor(request, response) {
        this.#request = request;
        this.#response = response;
        this.prefix = "dist";
        this.#url = "";
        this.extension = "";
        // redirige des requêtes vers des urls qui correspondent aux noms de fichiers
        this.rout = new Map().set("/favicon.ico", "/images/favicon.ico")
                            .set("/", "/home")
        this.request.url = this.url_adapter(this.request.url)
    }

    initURL(){
        this.url = new URL(`${this.prefix}${this.request.url}${this.extension}`, `http://${this.request.headers.host}`).pathname;
    }

    url_adapter(url){
        if (this.rout.has(url)){
          return this.rout.get(url);
        }
        return url
      }

    get response() {
        return this.#response;
    }

    get url() {
        return this.#url;
    }

    set url(url) {
        this.#url = url;
    }

    get type() {
        return this.#type;
    }

    get request() {
        return this.#request;
    }

    set type(type) {
        this.#type = type;
    }

    async handleResponse(){
        this.#response.setHeader("Content-Type" , this.type);
        this.initURL();
        await this.buildResponse();
        this.response.end()
    }

    async buildResponse()  {
        const path = `.${this.url}`
        // check if resource is available
        try{
            await fs.access(path)
            const data = await this.readFile(path)
            // send resource content
            this.#response.statusCode = 200;
            this.#response.write(data);
        }
        catch(err){
            this.response.statusCode = 404;
            this.response.write(err.message);
        }
      }

    async readFile(path){
        return await fs.readFile(path);
    }

      
}
