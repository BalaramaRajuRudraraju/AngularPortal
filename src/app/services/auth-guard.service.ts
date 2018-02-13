import { Injectable, Inject } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { DOCUMENT } from '@angular/common';

import { CookieService } from 'ngx-cookie-service';
import { environment } from '../../environments/environment';

@Injectable()
export class AuthGuardService implements CanActivate {
  constructor(public router: Router, private cookies: CookieService,
    @Inject(DOCUMENT) private document: any) { }
  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    if (!this.cookies.get('i4g_auth_access_token')) {
      this.document.location.replace(environment.accountsHost + '?returnUrl=' + this.document.location.href);
      return false;
    }
    return true;
  }
}
