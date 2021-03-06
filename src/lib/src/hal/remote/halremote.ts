import { Http, Headers, RequestOptions, Response } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/first';
import 'rxjs/add/operator/mergeMap';
import 'rxjs/add/operator/map';

import { expand } from '../rfc6570-expand/expand';
import { AuthService } from '../../auth/auth.service';
import { HalCache } from './halcache';
import { HalLink, HalLinkError } from '../doc/hallink';

export class HalHttpError extends Error {
  name = 'HalHttpError';
  constructor(public status: number, msg: string) {
    super(msg);
  }
}

/**
 * Http layer for HAL requests
 */
export class HalRemote {

  cache: HalCache;
  rootTTL = 300;

  constructor(
    public host: string,
    private http: Http,
    private auth?: AuthService,
    private ttl?: number
  ) {
    this.cache = new HalCache(this.host.replace(/\./g, '-'), ttl);
    if (!host.match(/^http/)) {
      this.host = host.match(/\.org|\.tech/) ? `https://${host}` : `http://${host}`;
    }
  }

  switchHost(link?: HalLink): HalRemote {
    let absoluteLink = link && link.href && link.href.match(/^http(s)?:\/\//);
    if (absoluteLink && !link.href.startsWith(this.host)) {
      let newHost = link.href.match(/^http(s)?:\/\/[^\/]+/)[0];
      return new HalRemote(newHost, this.http, this.auth);
    } else {
      return this;
    }
  }

  expand(link: HalLink, params: {} = null): string {
    if (!link || !link.href) {
      return null;
    } else if (link.templated) {
      return expand(this.host + link.href, params || {});
    } else if (link.href.match(/^http(s)?:\/\//)) {
      return link.href;
    } else {
      return this.host + link.href;
    }
  }

  get(link: HalLink, params: {} = null): Observable<{}> {
    let href = this.expand(link, params);
    if (href && this.isRoot(href)) {
      return this.cache.cache(href, this.httpRequest('get', href), this.rootTTL);
    } else if (href) {
      return this.cache.cache(href, this.httpRequest('get', href));
    } else {
      return Observable.throw(new HalLinkError('No link object specified!'));
    }
  }

  put(link: HalLink, params: {} = null, data: {}): Observable<{}> {
    let href = this.expand(link, params);
    let body = data ? JSON.stringify(data) : null;
    this.cache.del(href);
    return this.httpRequest('put', href, body);
  }

  post(link: HalLink, params: {} = null, data: {}): Observable<{}> {
    let href = this.expand(link, params);
    let body = data ? JSON.stringify(data) : null;
    this.cache.del(href);
    return this.httpRequest('post', href, body);
  }

  delete(link: HalLink, params: {} = null): Observable<{}> {
    let href = this.expand(link, params);
    this.cache.del(href);
    return this.httpRequest('delete', href);
  }

  clear() {
    this.cache.clear();
  }

  private httpRequest(method: string, href: string, body?: string, allowRetry = true): Observable<Response> {
    return this.getResponse(method, href, body).mergeMap(res => {
      if ((method === 'get' || method === 'put') && res.status === 200) {
        return Observable.of(res.json());
      } else if (method === 'put' && res.status === 204) {
        return Observable.of(null);
      } else if (method === 'post' && res.status === 201) {
        return Observable.of(res.json());
      } else if (method === 'delete' && res.status === 204) {
        return Observable.of(null);
      } else if (res.status === 401 && allowRetry && this.auth) {
        return this.auth.refreshToken().mergeMap(() => this.httpRequest(method, href, body, false));
      } else if (res.status === 0) {
        return Observable.throw(new Error(`CORS preflight failed for ${method.toUpperCase()} ${href}`));
      } else {
        return Observable.throw(new HalHttpError(res.status, `Got ${res.status} from ${method.toUpperCase()} ${href}`));
      }
    });
  }

  private getResponse(method: string, href: string, body?: string): Observable<Response> {
    let headers = new Headers();
    headers.set('Accept', 'application/hal+json');
    if (body) {
      headers.set('Content-Type', 'application/hal+json');
    }

    // wait for auth token - but not for root api paths!
    let options: Observable<RequestOptions>;
    if (this.auth && !this.isRoot(href)) {
      options = this.auth.token.first().map(tokenString => {
        headers.set('Authorization', `Bearer ${tokenString}`);
        return new RequestOptions({headers: headers});
      });
    } else {
      options = Observable.of(new RequestOptions({headers: headers}));
    }

    // make request, and catch http errors
    return options.mergeMap(opts => {
      if (method === 'put') {
        return this.http.put(href, body, opts);
      } else if (method === 'post') {
        return this.http.post(href, body, opts);
      } else if (method === 'get') {
        return this.http.get(href, opts);
      } else if (method === 'delete') {
        return this.http.delete(href, opts);
      } else {
        throw new Error(`Unknown method ${method}`);
      }
    }).catch(err => {
      if (err instanceof Response) {
        return Observable.of(err);
      } else {
        throw err;
      }
    });
  }

  private isRoot(href: string): boolean {
    let path = href.replace(/^http(s)?:\/\/[^\/]+\/?/, '');
    return path === '' || path === 'api/v1' || path === 'api/v1/';
  }

}
