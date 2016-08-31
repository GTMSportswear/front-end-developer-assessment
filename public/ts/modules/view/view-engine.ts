import { ajax }  from '../services/ajax';
import * as Handlebars from 'handlebars';
import * as HandlebarsIntl from 'handlebars-intl';

export interface View extends Element { }
interface LocalStorageView {
  currentVersion: number;
  html: string;
}

export interface IViewEngine {
  get(url: string, vars: any): Promise<View>;
}

interface CacheRequest {
  url: string;
  vars: {};
  success: Function;
}

/**
 * Handles the loading and processing of view templates.
 */
export class ViewEngine implements IViewEngine {
  private ajax: Function;
  private handlebars: any;
  private cacheRequestQueue: CacheRequest[] = [];

  /**
   * Creates a new instance for the View Engine.
   * @param ajaxLoader
   */
  constructor(ajaxLoader?: Function) {
    this.ajax = ajaxLoader !== undefined ? ajaxLoader : ajax;
    this.setupHandlebars();
  }

  /**
   * Get a view template.
   * @param url
   * @param vars
   */
  public get(url: string, vars: any): Promise<View> {
    const baseUrl = window.baseUrl ? window.baseUrl : '';

    return new Promise<View>((success, error) => {
      if (typeof url !== 'string') error('Not a valid URL.');

      const cachedView = this.getCachedView(url);

      if (null !== cachedView)
        success(this.createView(cachedView, vars));
      else {
        const req = {
          url: url,
          vars: vars,
          success: success,
          error: error
        };

        if (!this.addToRequestQueue(req))
          this.ajax({
            url: `${baseUrl}${url}`,
            type: 'get'
          }).then((html: string) => {
            this.activateFromRequestQueue(url, html);
          }).catch(error);
      }
    });
  }

  private getRequestQueueForUrl(url): CacheRequest[] {
    const r: CacheRequest[] = [];
    this.cacheRequestQueue.forEach(el => {
      if (el.url === url)
        r.push(el);
    });
    return r;
  }

  private addToRequestQueue(req: CacheRequest): boolean {
    const urlExists = this.getRequestQueueForUrl(req.url).length > 0;

    this.cacheRequestQueue.push(req);

    return urlExists;
  }

  private activateFromRequestQueue(url, content): void {
    this.getRequestQueueForUrl(url).forEach(req => {
      this.cacheView(req.url, content);
      req.success(this.createView(content, req.vars));
    });
  }

  private setupHandlebars(): void {
    if (!Handlebars.hasOwnProperty('create'))
      throw new Error('Handlebars not initialized.');

    this.handlebars = Handlebars.create();
    HandlebarsIntl.registerWith(this.handlebars);

    this.handlebars.registerHelper('count', (count, options) => {
      let returnString = '';

      count = parseInt(count, 10);

      if (isNaN(count)) return options.fn(this);

      for (let i = 0; i < count; i++) {
        const data = this.handlebars.createFrame(options.data || {});
        data.index = i;

        returnString += new this.handlebars.SafeString(options.fn(this, { data: data }));
      }

      return returnString;
    });
  }

  private getCachedView(url: string): string {
    if (!this.hasLocalStorage()) return null;

    const itemString = localStorage.getItem(url);
    if (null === itemString) return null;

    try {  
      const item = <LocalStorageView>JSON.parse(itemString);
      if (item.currentVersion !== window.currentVersion) return null;
      return item.html;
    }
    catch (e) {
      return null;
    }
  }

  private cacheView(url: string, html: string): void {
    if (!this.hasLocalStorage() || null !== this.getCachedView(url)) return;

    const item: LocalStorageView = {
      currentVersion: window.currentVersion,
      html: html
    };

    localStorage.setItem(url, JSON.stringify(item));
  }

  private hasLocalStorage(): boolean {
    if (window.debug) return false;
    return typeof Storage !== 'undefined';
  }

  private createView(content: string, vars: any): View {
    const container = document.createElement('div'),
          template = this.handlebars.compile(content);

    container.innerHTML = template(vars);

    return container.hasChildNodes ? <Element>container.firstChild : container;
  }
}
