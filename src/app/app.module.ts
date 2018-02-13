import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';
import { BsModalService } from 'ngx-bootstrap/modal';
import { RouterModule, ActivatedRoute } from '@angular/router';


import { TooltipModule } from 'ngx-bootstrap';
import { ModalModule } from 'ngx-bootstrap';
import { CookieService } from 'ngx-cookie-service';
// import { NgIdleModule, Idle, IdleExpiry } from '@ng-idle/core';
import { LoadingModule, ANIMATION_TYPES } from 'ngx-loading';

// import { Ng4LoadingSpinnerModule } from 'ng4-loading-spinner';

import { AppComponent } from './app.component';
import { HttpHelperService } from './services/http-helper.service';
import { SellerPageComponent } from './components/seller-page/seller-page.component';
import { CompanyInformationComponent } from './components/seller-page/company-information/company-information.component';
import { CompanyAddressDetailsComponent } from './components/seller-page/company-address-details/company-address-details.component';
import { CompanyContactInfoComponent } from './components/seller-page/company-contact-info/company-contact-info.component';
import { CompanySocialMediaInfoComponent } from './components/seller-page/company-social-media-info/company-social-media-info.component';
import { CompanyLogoComponent } from './components/seller-page/company-logo/company-logo.component';
import { BusinessTypesComponent } from './components/seller-page/business-types/business-types.component';
import { SellerInfoManagerService } from './services/seller-info-manager.service';
import { ValidationService } from './services/validation.service';
import { TooltipDirective } from './shared/tooltip.directive';
import { CompanyRegistrationComponent } from './components/seller-page/company-registration/company-registration.component';
import { ProfileProgressComponent } from './components/seller-page/profile-progress/profile-progress.component';
import { SuccessFailureModalComponent } from './components/seller-page/success-failure-modal/success-failure-modal.component';
import { ModalHelperService } from './services/modal-helper.service';
import { SendVerifyValidateComponent } from './components/send-verify-validate/send-verify-validate.component';
import { AuthCookiesHandlerService } from './services/auth-cookies-handler.service';
import { AuthGuardService } from './services/auth-guard.service';
import { SessionManagerService } from './services/session-manager.service';
import { IdleTimeOutModalComponent } from './components/idle-time-out-modal/idle-time-out-modal.component';
import { SharedService } from './services/shared.service';
import { MyProfileComponent } from './components/seller-page/my-profile/my-profile.component';
import { MyPackageComponent } from './components/seller-page/my-package/my-package.component';

const routes = [
  {
    path: '', component: SellerPageComponent, canActivate: [AuthGuardService],
    children: [
      { path: '', redirectTo: 'my-profile', pathMatch: 'full' },
      { path: 'my-profile', component: MyProfileComponent },
      { path: 'my-package', component: MyPackageComponent }
    ]
  },
];

@NgModule({
  declarations: [
    AppComponent,
    SellerPageComponent,
    CompanyInformationComponent,
    CompanyAddressDetailsComponent,
    CompanyContactInfoComponent,
    CompanySocialMediaInfoComponent,
    CompanyLogoComponent,
    BusinessTypesComponent,
    TooltipDirective,
    CompanyRegistrationComponent,
    ProfileProgressComponent,
    SuccessFailureModalComponent,
    SendVerifyValidateComponent,
    IdleTimeOutModalComponent,
    MyProfileComponent,
    MyPackageComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    TooltipModule.forRoot(),
    ModalModule.forRoot(),
    RouterModule.forRoot(routes),
    // NgIdleModule.forRoot(),
    LoadingModule.forRoot({
      animationType: ANIMATION_TYPES.chasingDots
    })
  ],
  providers: [HttpHelperService,
    SellerInfoManagerService,
    ValidationService,
    ModalHelperService,
    CookieService,
    AuthCookiesHandlerService,
    AuthGuardService,
    SessionManagerService,
    SharedService
  ],
  bootstrap: [AppComponent],
  entryComponents: [SuccessFailureModalComponent, SendVerifyValidateComponent, IdleTimeOutModalComponent]
})
export class AppModule { }
