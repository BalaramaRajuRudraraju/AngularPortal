import { Injectable, Inject } from '@angular/core';
import { DOCUMENT } from '@angular/common';

import { ModalHelperService } from '../services/modal-helper.service';
import { SuccessFailureModalComponent } from '../components/seller-page/success-failure-modal/success-failure-modal.component';
import { AuthCookiesHandlerService } from './auth-cookies-handler.service';
import { environment } from '../../environments/environment';


@Injectable()
export class SessionManagerService {

  constructor( @Inject(DOCUMENT) private document: any, private modalService: ModalHelperService,
    private cookieManager: AuthCookiesHandlerService) { }

  triggerSessionExpired = (): void => {
    this.modalService.showSuccess('Warn', 'Session expired');
    this.document.location.href = 'http://34.241.175.223:8080/seller/';
  }

  logout = (): void => {
    this.cookieManager.deleteCookie('i4g_auth_access_token');
    this.cookieManager.deleteCookie('i4g_auth_email');
    this.cookieManager.deleteCookie('i4g_auth_clientType');
    this.document.location.href = environment.accountsHost;
    // TODO: call the service to invalidate the token on server side
  }

  extendSession = (): void => {
    // TODO: call the service(yet to be implemented) to get a new session token
  }

}
