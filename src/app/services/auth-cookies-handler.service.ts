import { Injectable } from '@angular/core';

import { CookieService } from 'ngx-cookie-service';

@Injectable()
export class AuthCookiesHandlerService {

  constructor(private cookieService: CookieService) { }

  addCookies = (key: string, value: string): void => {
    if (this.cookieService.get(key)) {
      this.cookieService.delete(key, '/');
    }
    this.cookieService.set(key, value, null, '/');
  }

  deleteCookie = (key: string): void => {
    if (this.cookieService.get(key)) {
      this.cookieService.delete(key, '/');
    }
  }

  getCookie = (key: string): string => {
    return this.cookieService.get(key);
  }
}
