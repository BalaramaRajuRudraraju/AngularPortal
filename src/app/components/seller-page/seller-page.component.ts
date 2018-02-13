import { Component, OnInit, Inject } from '@angular/core';
import { DOCUMENT } from '@angular/common';

import { AuthCookiesHandlerService } from '../../services/auth-cookies-handler.service';
import { environment } from '../../../environments/environment';
import { SellerInfoManagerService } from '../../services/seller-info-manager.service';
import { ModalHelperService } from '../../services/modal-helper.service';
import { HttpHelperService } from '../../services/http-helper.service';
import { SessionManagerService } from '../../services/session-manager.service';

@Component({
  selector: 'app-seller-page',
  templateUrl: './seller-page.component.html',
  styleUrls: ['./seller-page.component.css']
})
export class SellerPageComponent implements OnInit {

  email: string;
  companyName: string;
  loading: boolean;


  constructor(private cookieManager: AuthCookiesHandlerService, @Inject(DOCUMENT) private document,
    private sellerInfoManager: SellerInfoManagerService, private cookieService: AuthCookiesHandlerService,
    private modalHelper: ModalHelperService, private httpHelper: HttpHelperService, private sessionManager: SessionManagerService) { }

  ngOnInit() {

    this.cookieService.getCookie('i4g_auth_email') ? this.email = this.cookieService.getCookie('i4g_auth_email') :
      this.modalHelper.showFailure('Error', 'Couldn\'t identify the user, please try loggin in again');
    if (!this.sellerInfoManager.sellerInformation.companyInfo && this.email) {
      this.loadData();
    }
  }

  loadData = (): void => {
    const data = { Email: this.email };
    this.loading = true;
    this.sellerInfoManager.getCompanyInfo(data).subscribe(
      (companyInfoResponse) => {
        this.loading = false;
        this.sellerInfoManager.sellerInformation.companyInfo = companyInfoResponse.Company;
        this.companyName = companyInfoResponse.Company.CompanyName;
      },
      (errorResponse: Response) => {
        this.loading = false;
        this.modalHelper.showFailure('Error', 'Couldn\'t retrieve data due to technical issues, please try loggin in again');
        console.log(errorResponse);
      });
  }

  logout = (): void => {
    this.sessionManager.logout();
  }

}
