import * as fs from 'fs/promises';

import { getContentTypeFrom }  from './contentTypeUtil.js';
import HtmlResponseBuilder from '../ResponseBuilders/HtmlResponseBuilder.js';
import PublicResponseBuilder from '../ResponseBuilders/PublicResponseBuilder.js';

import * as util from './contentTypeUtil.js';

const BASE = 'http://localhost/';
/**
*  define a controller to retrieve static resources
*/
export default class RequestController {

  #request;
  #response;
  #url;

  constructor(request, response) {
    this.#request = request,
    this.#response = response;

    this.paths = ["/", "/about", "/pfc"]
    this.#url = new URL(this.request.url,BASE).pathname;   // on ne considère que le "pathname" de l'URL de la requête
  }

  get response() {
    return this.#response;
  }
  get request() {
    return this.#request;
  }
  get url() {
    return this.#url;
  }

  async handleRequest() {
    if (this.paths.includes(this.#url))
      this.responseBuilder = new HtmlResponseBuilder(this.request, this.response)
    // if (this.scripts.includes(this.#url))
    else{
      const contentType = util.getContentTypeFrom(this.#url);
      if (contentType == ''){
      this.request.url = "/error404";
      this.responseBuilder = new HtmlResponseBuilder(this.request, this.response);
      }
      else{
        this.responseBuilder = new PublicResponseBuilder(this.request, this.response, contentType)
      }
    }
    await this.responseBuilder.handleResponse();
  }
}
