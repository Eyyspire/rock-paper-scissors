import * as fs from 'fs/promises';
import ResponseBuilder from './ResponseBuilder.js';

export default class PublicResponseBuilder extends ResponseBuilder {

    constructor(request, response, contentType){
        super(request, response);
        this.type = contentType;
    }

}