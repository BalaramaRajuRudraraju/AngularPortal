import { Component, OnInit, ViewChild, ElementRef, ChangeDetectorRef, transition } from '@angular/core';
import { FormGroup, FormArray, FormBuilder, FormControl, Validators, AbstractControl } from '@angular/forms';
import { ActivatedRoute, Params } from '@angular/router';

import { BsModalService } from 'ngx-bootstrap/modal';
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';
import { TooltipConfig } from 'ngx-bootstrap/tooltip';

import { SellerInfoManagerService } from '../../../services/seller-info-manager.service';
import { Company } from '../../../models/company.model';
import { SendVerifyValidateComponent } from '../../send-verify-validate/send-verify-validate.component';
import { ValidationService } from '../../../services/validation.service';
import { ModalHelperService } from '../../../services/modal-helper.service';
import { CookieService } from 'ngx-cookie-service';
import { SharedService } from '../../../services/shared.service';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/combineLatest';
import { Subscription } from 'rxjs/Subscription';

export function getTooltipConfig(): TooltipConfig {
  return Object.assign(new TooltipConfig(), {
    placement: 'right',
    container: 'body',
    triggers: 'keydown'
  });
}

@Component({
  selector: 'app-company-contact-info',
  templateUrl: './company-contact-info.component.html',
  styleUrls: ['./company-contact-info.component.css'],
  providers: [{ provide: TooltipConfig, useFactory: getTooltipConfig }]

})
export class CompanyContactInfoComponent implements OnInit {

  companyContactInfoForm: FormGroup;
  companyInfoModel: Company;
  oldFormValue: any;
  emailChanged: boolean;
  mobileNumberChanged: boolean;
  bsModalRef: BsModalRef;
  panelCollapsed = true;
  email = 'raju@i4g.com';
  companyID = 41;
  emailVerified: boolean;
  mobileVerified: boolean;
  loading: boolean;
  subscriptions: Subscription[] = [];

  @ViewChild('emailRef') emailRef;
  @ViewChild('mobilecodeRef') mobilecodeRef;
  @ViewChild('mobileNumberRef') mobileNumberRef;

  @ViewChild('panelHeader') panelHeader: ElementRef;

  constructor(private sellerInfoManager: SellerInfoManagerService, private fb: FormBuilder, private modalService: BsModalService,
    private modalHelperService: ModalHelperService, private activatedRoute: ActivatedRoute,
    private cookies: CookieService, private sharedService: SharedService, private changeDetection: ChangeDetectorRef) { }

  ngOnInit() {

    this.email = this.cookies.get('i4g_auth_email');
    /*  this.activatedRoute.queryParams.filter(params => params.email).subscribe((params: Params) => {
       this.email = params.email || this.email;
       this.companyID = params.companyId || this.companyID;
       console.log(this.email + ',' + this.companyID);
     }); */
    this.companyContactInfoForm = this.fb.group({
      'BusinessMobileCode': [null, Validators.required],
      'BusinessMobileNumber': [null, Validators.required],
      'CompanyEmail': [null, Validators.required],
    });
    this.companyContactInfoForm.valueChanges.subscribe(
      (newFormValue) => {
        this.emailChanged = this.oldFormValue && (newFormValue.CompanyEmail !== this.oldFormValue.CompanyEmail) ? true : false;
        this.mobileNumberChanged = this.oldFormValue && (newFormValue.BusinessMobileCode !== this.oldFormValue.BusinessMobileCode
          || newFormValue.BusinessMobileNumber !== this.oldFormValue.BusinessMobileNumber) ? true : false;
      }
    );

    this.sharedService.selectedSection$.subscribe((sectionName: string) => {
      console.log(this.panelCollapsed);
      if ((sectionName === 'contact-information' && this.panelCollapsed)
        || (sectionName !== 'contact-information' && sectionName !== 'default message' && !this.panelCollapsed)) {
        this.panelHeader.nativeElement.click();
      }
    });

    const _combine = Observable.combineLatest(
      this.modalService.onHidden
    ).subscribe(() => this.changeDetection.markForCheck());

    this.subscriptions.push(
      this.modalService.onHidden.subscribe((reason: string) => {
        this.mobileVerified = this.sellerInfoManager.sellerInformation.profileProgress ?
          this.sellerInfoManager.sellerInformation.profileProgress.VerifyMobile : this.mobileVerified;
        this.emailVerified = this.sellerInfoManager.sellerInformation.profileProgress ?
          this.sellerInfoManager.sellerInformation.profileProgress.VerifyEmail : this.emailVerified;
      })
    );

    this.subscriptions.push(_combine);
  }

  loadData = () => {
    if (!this.email) {
      this.modalHelperService.showFailure('Error', 'Couldn\'t identify the user, please try loggin in again');
      return;
    }
    this.panelCollapsed = !this.panelCollapsed;
    this.companyInfoModel = this.sellerInfoManager.sellerInformation.companyInfo;
    if (!this.companyInfoModel) {
      const data = { Email: this.email };
      this.loading = true;
      this.sellerInfoManager.getCompanyInfo(data).subscribe(
        (companyInfoResponse) => {
          console.log(companyInfoResponse);
          this.sellerInfoManager.sellerInformation.companyInfo = this.companyInfoModel = companyInfoResponse.Company;
          this.mapModelDataToView();
          this.loading = false;
        },
        (error) => {
          console.log(error);
          this.loading = false;
        }
      );
    } else {
      this.mapModelDataToView();
    }
    if (!this.sellerInfoManager.sellerInformation.profileProgress) {
      this.loading = true;
      this.sellerInfoManager.getCompanyProfileProgress({ Email: this.email }).subscribe((response) => {
        this.loading = false;
        this.sellerInfoManager.sellerInformation.profileProgress = response;
        this.emailVerified = response.VerifyEmail;
        this.mobileVerified = response.VerifyMobile;
        console.log(this.sellerInfoManager.sellerInformation.profileProgress);
      }, (error) => {
        this.loading = false;
        this.sellerInfoManager.sellerInformation.profileProgress = null;
      });
    }
  }

  saveEmail = (): void => {
    const key = 'CompanyEmail';
    if (key in this.companyInfoModel && (this.companyInfoModel[key] !== this.companyContactInfoForm.value[key])) {
      const requestData = {
        CompanyId: this.companyInfoModel.CompanyID,
        Email: this.companyContactInfoForm.value[key]
      };
      this.loading = true;
      this.sellerInfoManager.updateCompanyEmail(requestData).subscribe((responseData) => {
        if (responseData.status === 200) {
          // this.sellerInfoManager.sellerInformation.profileProgressPercentage = parseInt(responseData.message, 10);
          this.companyInfoModel[key] = this.companyContactInfoForm.value[key];
          this.sellerInfoManager.sellerInformation.companyInfo = this.companyInfoModel;
          this.companyContactInfoForm.controls[key].reset(this.companyContactInfoForm.value[key]);
          this.oldFormValue[key] = this.companyContactInfoForm.value[key];
          this.emailChanged = false;
          this.sellerInfoManager.sellerInformation.profileProgress.VerifyEmail = this.emailVerified = false;
          const data = {
            Company: {
              CompanyID: this.companyInfoModel.CompanyID
            }
          };
          this.sellerInfoManager.sendVerifyEmail(data).subscribe((response) => {
            if (response.message === 'Success') {
              this.bsModalRef = this.modalService.show(SendVerifyValidateComponent, Object.assign({}, {}, { class: 'modal-sm' }));
              this.bsModalRef.content.verifyContact = 'Email';
              this.bsModalRef.content.companyId = this.companyInfoModel.CompanyID;
              this.bsModalRef.content.email = this.companyInfoModel.CompanyEmail;
              this.loading = false;
            }
          }, (error) => {
            this.modalHelperService.showFailure('Error', 'Company contact information could not be updated, please try after some time!');
            console.log(error);
            this.loading = false;
          });
        }
      }, this.handleError);
    }
  }

  verify = (contanctName: string): void => {
    const data = {
      Company: {
        CompanyID: this.companyInfoModel.CompanyID
      }
    };
    if (contanctName === 'Email') {
      this.sellerInfoManager.sendVerifyEmail(data).subscribe((response) => {
        if (response.message === 'Success') {
          this.bsModalRef = this.modalService.show(SendVerifyValidateComponent, Object.assign({}, {}, { class: 'modal-sm' }));
          this.bsModalRef.content.verifyContact = 'Email';
          this.bsModalRef.content.companyId = this.companyInfoModel.CompanyID;
          this.bsModalRef.content.email = this.companyInfoModel.CompanyEmail;
        }
      }, this.handleVerificationError);
    } else if (contanctName === 'Mobile') {
      this.sellerInfoManager.sendVerifyMobile(data).subscribe((response) => {
        if (response.message === 'Success') {
          this.bsModalRef = this.modalService.show(SendVerifyValidateComponent, Object.assign({}, {}, { class: 'modal-sm' }));
          this.bsModalRef.content.verifyContact = 'Mobile';
          this.bsModalRef.content.companyId = this.companyInfoModel.CompanyID;
          this.bsModalRef.content.mobile = this.companyInfoModel.BusinessMobileNumber;
        }
      }, this.handleVerificationError);
    }
  }

  handleVerificationError = (error: any) => {
    this.modalHelperService.showFailure('Error', 'Verification code couldn\'t be sent, please try after some time!');
    console.log(error);
  }

  saveMobileNumber = (): void => {
    const key1 = 'BusinessMobileCode';
    const key2 = 'BusinessMobileNumber';

    if ((key1 in this.companyInfoModel && key2 in this.companyInfoModel) && (this.companyInfoModel[key1]
      !== this.companyContactInfoForm.value[key1] || this.companyInfoModel[key2] !== this.companyContactInfoForm.value[key2])) {
      const requestData = {
        CompanyId: this.companyInfoModel.CompanyID,
        BusinessMobileCode: this.companyContactInfoForm.value[key1],
        BusinessMobileNumber: this.companyContactInfoForm.value[key2]
      };
      this.loading = true;
      this.sellerInfoManager.updateCompanyMobile(requestData).subscribe((responseData) => {
        if (responseData.status === 200) {
          [key1, key2].forEach(key => {
            this.companyInfoModel[key] = this.companyContactInfoForm.value[key];
            this.companyContactInfoForm.controls[key].reset(this.companyContactInfoForm.value[key]);
            this.oldFormValue[key] = this.companyContactInfoForm.value[key];
          });
          this.sellerInfoManager.sellerInformation.companyInfo = this.companyInfoModel;
          this.mobileNumberChanged = false;
          this.sellerInfoManager.sellerInformation.profileProgress.VerifyMobile = this.mobileVerified = false;
          const data = {
            Company: {
              CompanyID: this.companyInfoModel.CompanyID
            }
          };
          this.sellerInfoManager.sendVerifyMobile(data).subscribe((response) => {
            if (response.message === 'Success') {
              this.bsModalRef = this.modalService.show(SendVerifyValidateComponent, Object.assign({}, {}, { class: 'modal-sm' }));
              this.bsModalRef.content.verifyContact = 'Mobile';
              this.bsModalRef.content.companyId = this.companyInfoModel.CompanyID;
              this.bsModalRef.content.mobile = this.companyInfoModel.BusinessMobileNumber;
              this.loading = false;
            }
          }, (error) => {
            this.modalHelperService.showFailure('Error', 'Company contact information could not be updated, please try after some time!');
            console.log(error);
            this.loading = false;
          });
        }
      }, this.handleError);
    }
  }

  handleResponse = (responseDate) => {
    console.log(responseDate);
  }

  handleError = (error) => {
    this.loading = false;
    this.modalHelperService.showFailure('Error', 'Company contact information could not be updated, please try after some time!');
    console.log(error);
  }

  mapModelDataToView = (): void => {
    if (this.companyInfoModel) {
      this.companyContactInfoForm.controls['BusinessMobileCode'].setValue(this.companyInfoModel.BusinessMobileCode);
      this.companyContactInfoForm.controls['BusinessMobileNumber'].setValue(this.companyInfoModel.BusinessMobileNumber);
      this.companyContactInfoForm.controls['CompanyEmail'].setValue(this.companyInfoModel.CompanyEmail);
    }
    this.oldFormValue = this.companyContactInfoForm.value;
  }

  getErrorMessage = (control: AbstractControl): string => {
    return ValidationService.getErrorMessage(control);
  }

  showHideErrorToolTips = (): void => {
    this.panelCollapsed ? this.emailRef.hide() : this.emailRef.show();
    this.panelCollapsed ? this.mobilecodeRef.hide() : this.mobilecodeRef.show();
    this.panelCollapsed ? this.mobileNumberRef.hide() : this.mobileNumberRef.show();
  }

  cancel = (): void => {
    this.companyContactInfoForm.reset(this.oldFormValue);
    this.panelHeader.nativeElement.click();
    this.showHideErrorToolTips();
  }

  /* determineButtonText = (): string => {
    let buttonText = 'save';
    if (this.companyInfoModel && this.companyInfoModel.BusinessMobileCode && this.companyInfoModel.BusinessMobileNumber) {
      if (!this.mobileNumberChanged && !this.mobileVerified) {
        buttonText = 'verify';
      }
    } else {
      buttonText = 'save';
    }
    return buttonText;
  } */

}
