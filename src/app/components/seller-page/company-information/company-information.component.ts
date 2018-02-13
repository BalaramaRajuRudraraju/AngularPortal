import { Component, OnInit, ViewChild, ElementRef, QueryList, ViewContainerRef } from '@angular/core';
import { FormGroup, FormArray, FormBuilder, FormControl, Validators, AbstractControl } from '@angular/forms';
import { ActivatedRoute, Params } from '@angular/router';


import { TooltipConfig } from 'ngx-bootstrap/tooltip';

import { CompanyInfoResponse } from '../../../models/response-types.model';
import { Company } from '../../../models/company.model';
import { Response } from '../../../models/response.model';
import { SellerInfoManagerService } from '../../../services/seller-info-manager.service';
import ValidationHelper from '../../../validations-helper';
import { ValidationService } from '../../../services/validation.service';
import { ModalHelperService } from '../../../services/modal-helper.service';
import { Language } from '../../../models/language.model';
import { async } from '@angular/core/testing';
import { CookieService } from 'ngx-cookie-service';
import { SharedService } from '../../../services/shared.service';

const {
  expressions,
  messages
} = ValidationHelper;

export function getTooltipConfig(): TooltipConfig {
  return Object.assign(new TooltipConfig(), {
    placement: 'right',
    container: 'body',
    triggers: 'keydown'
  });
}

@Component({
  selector: 'app-company-information',
  templateUrl: './company-information.component.html',
  styleUrls: ['./company-information.component.css'],
  providers: [{ provide: TooltipConfig, useFactory: getTooltipConfig }]
})
export class CompanyInformationComponent implements OnInit {

  companyInfoForm: FormGroup;
  companyInfoModel: Company;
  oldFormValue: any;
  formChanged: boolean;
  panelCollapsed = true;
  languagesList: Language[];
  email = 'raju@i4g.com';
  companyID = 41;
  loading: boolean;
  fieldInFocus: string;

  // Get all elements for tooltips
  @ViewChild('nameRef') nameRef;
  @ViewChild('descriptionRef') descriptionRef;
  @ViewChild('contactPersonNameRef') contactPersonNameRef;
  @ViewChild('contactPersonSurnameRef') contactPersonSurnameRef;
  @ViewChild('locationRef') locationRef;
  @ViewChild('countryCodeRef') countryCodeRef;
  @ViewChild('landlindeCodeRef') landlindeCodeRef;
  @ViewChild('landlineNumberRef') landlineNumberRef;
  @ViewChild('languageRef') languageRef;
  @ViewChild('websiteRef') websiteRef;
  @ViewChild('currencyRef') currencyRef;

  @ViewChild('panelHeader') panelHeader: ElementRef;

  constructor(private sellerInfoManager: SellerInfoManagerService, private fb: FormBuilder,
    private modalHelperService: ModalHelperService, private activatedRoute: ActivatedRoute,
    private cookies: CookieService, private sharedService: SharedService) { }

  ngOnInit() {

    this.companyInfoForm = this.fb.group({
      'CompanyName': [null, Validators.compose([Validators.required, Validators.minLength(5), Validators.maxLength(100),
      Validators.pattern(expressions.REGEXP_ALPHA_NUMERIC_SPACE_AMPERSAND)])],
      'CompanyDescription': [null, Validators.compose([Validators.required, Validators.minLength(5), Validators.maxLength(100),
      Validators.pattern(expressions.REGEXP_ALPHA_NUMERIC_SPACE_AMPERSAND)])],
      'CompanyContactPersonFirstName': [null, Validators.compose([Validators.required, Validators.minLength(5), Validators.maxLength(100),
      Validators.pattern(expressions.REGEXP_ALPHA_NUMERIC_SPACE_AMPERSAND)])],
      'CompanyContactPersonSurname': [null, Validators.compose([Validators.required, Validators.minLength(5), Validators.maxLength(100),
      Validators.pattern(expressions.REGEXP_ALPHA_NUMERIC_SPACE_AMPERSAND)])],
      'BusinessLocation': [null, Validators.compose([Validators.required, Validators.minLength(4), Validators.maxLength(100),
      Validators.pattern(expressions.REGEXP_ALPHA_NUMERIC_SPACE)])],
      'BusinessLandlineCode': [null, Validators.compose([Validators.minLength(3), Validators.maxLength(5),
      Validators.pattern(expressions.REGEXP_NUMERIC_PLUS_MINUS)])],
      'BusinessLandlineNumber': [null, Validators.compose([Validators.minLength(3), Validators.maxLength(20),
      Validators.pattern(expressions.REGEXP_NUMERIC)])],
      'CompanyDefaultLanguage': [null, Validators.compose([Validators.pattern(expressions.REGEXP_NUMERIC)])],
      'CompanyWebsite': [null, Validators.compose([Validators.minLength(10), Validators.maxLength(50),
      Validators.pattern(expressions.REGEXP_ALPHA_NUMERIC_DOT)])],
      'CompanyCurrency': [null, Validators.compose([Validators.minLength(2), Validators.maxLength(20),
      Validators.pattern(expressions.REGEXP_ALPHA)])]
    });

    this.email = this.cookies.get('i4g_auth_email');
    this.email ? this.loadData() : this.modalHelperService.showFailure('Error', 'Couldn\'t identify the user, please try loggin in again');

    /*     const parameters = this.activatedRoute.queryParams.filter(params => params.email || params.companyId).subscribe((params) => {
          this.email = params.email || this.email;
          this.companyID = params.companyId || this.companyID;
        });
        setTimeout(() => {
          this.loadData();
        }, 50); */

    this.companyInfoForm.valueChanges.subscribe(
      (newFormValue) => {
        if (this.oldFormValue && (JSON.stringify(newFormValue).toLowerCase() !== JSON.stringify(this.oldFormValue).toLowerCase())) {
          this.formChanged = true;
        } else {
          this.formChanged = false;
        }
        console.log('form Changed' + this.formChanged);
        /* if (this.companyInfoForm.invalid) {
          this.showHideErrorToolTips();
        } */
      }
    );

    this.sharedService.selectedSection$.subscribe((sectionName: string) => {
      if ((sectionName === 'company-information' && this.panelCollapsed)
        || (sectionName !== 'company-information' && sectionName !== 'default message' && !this.panelCollapsed)) {
        this.panelHeader.nativeElement.click();
        this.showHideErrorToolTips();
      }
    });
  }

  loadData = (): void => {
    this.panelCollapsed = !this.panelCollapsed;
    this.companyInfoModel = this.sellerInfoManager.sellerInformation.companyInfo;
    if (!this.languagesList) {
      this.sellerInfoManager.getLanguagesList().subscribe((response) => {
        this.languagesList = response.Languages.Language;
      }, (error) => {
        console.log(error);
      });
    }
    if (!this.companyInfoModel) {
      const data = { Email: this.email };
      this.loading = true;
      this.sellerInfoManager.getCompanyInfo(data).subscribe(
        (companyInfoResponse) => {
          this.sellerInfoManager.sellerInformation.companyInfo = this.companyInfoModel = companyInfoResponse.Company;
          this.mapModelDataToView();
          this.loading = false;
        },
        (errorResponse: Response) => {
          console.log(errorResponse);
          this.loading = false;
        });
    } else {
      this.mapModelDataToView();
    }
  }

  save = (): void => {
    const companyUpdated = new Company();
    let modelUpdated: boolean;
    for (const key in this.companyInfoForm.value) {
      if ((this.companyInfoModel[key] !== this.companyInfoForm.value[key])) {
        companyUpdated[key] = this.companyInfoForm.value[key];
        modelUpdated = true;
      }
    }
    if (modelUpdated) {
      // hack as these 2 fields are mandatory on the service request
      companyUpdated.CompanyID = this.companyInfoModel.CompanyID;
      companyUpdated.BusinessFaxNumber = companyUpdated.BusinessFaxNumber ? companyUpdated.BusinessFaxNumber
        : this.companyInfoModel.BusinessFaxNumber;

      const updateData = {
        Company: companyUpdated
      };
      this.loading = true;
      this.sellerInfoManager.updateCompanyInfo(updateData).subscribe(
        (responseData: Response) => {
          // this.companyInfoModel = companyUpdated;
          this.copyObjectProperties(companyUpdated, this.companyInfoModel);
          this.companyInfoForm.reset(this.companyInfoForm.value);
          this.oldFormValue = this.companyInfoForm.value;
          this.formChanged = false;
          this.loading = false;
          this.modalHelperService.showSuccess('Information', 'Company Information updated successfully!');
        },
        (errorResponse: Response) => {
          console.log(errorResponse);
          this.loading = false;
          if (errorResponse.status === 400) {
            for (const validationError of errorResponse.error.errors) {
              // const fieldName = validationError.field.split('.');
              document.getElementById(validationError.field).innerText = validationError.defaultMessage;
              console.log(validationError.field + ':' + validationError.defaultMessage);
            }
          }
          if (errorResponse.status === 500) {
            this.modalHelperService.showSuccess('Error', 'Company Information could not be updated, please try after some time!');
          }
        }
      );
      this.sellerInfoManager.sellerInformation.companyInfo = this.companyInfoModel;
    }
  }

  mapModelDataToView = (): void => {
    if (this.companyInfoModel) {
      this.companyInfoForm.controls['CompanyName'].setValue(this.companyInfoModel.CompanyName || '');
      this.companyInfoForm.controls['CompanyDescription'].setValue(this.companyInfoModel.CompanyDescription || '');
      this.companyInfoForm.controls['CompanyContactPersonFirstName'].setValue(this.companyInfoModel.CompanyContactPersonFirstName || '');
      this.companyInfoForm.controls['CompanyContactPersonSurname'].setValue(this.companyInfoModel.CompanyContactPersonSurname || '');
      this.companyInfoForm.controls['BusinessLocation'].setValue(this.companyInfoModel.BusinessLocation);
      this.companyInfoForm.controls['BusinessLandlineCode'].setValue(this.companyInfoModel.BusinessLandlineCode);
      this.companyInfoForm.controls['BusinessLandlineNumber'].setValue(this.companyInfoModel.BusinessLandlineNumber);
      this.companyInfoForm.controls['CompanyDefaultLanguage'].setValue(this.companyInfoModel.CompanyDefaultLanguage);
      this.companyInfoForm.controls['CompanyWebsite'].setValue(this.companyInfoModel.CompanyWebsite);
      this.companyInfoForm.controls['CompanyCurrency'].setValue(this.companyInfoModel.CompanyCurrency);
    }
    this.oldFormValue = this.companyInfoForm.value;
    console.log(this.oldFormValue);
  }

  getErrorMessage = (control: AbstractControl, controlName: string): string => {
    let message: string;
    if (this.fieldInFocus === controlName) {
      message = ValidationService.getErrorMessage(control);
    } else {
      message = '';
    }
    return message;
  }

  showHideErrorToolTips = (): void => {
    for (const key in this.companyInfoForm.controls) {
      if (this.companyInfoForm.controls[key]) {
        switch (key) {
          case 'CompanyName': {
            this.companyInfoForm.controls[key].invalid && !this.panelCollapsed ? this.nameRef.show() : this.nameRef.hide();
            break;
          }
          case 'CompanyDescription': {
            this.companyInfoForm.controls[key].invalid && !this.panelCollapsed ? this.descriptionRef.show() : this.descriptionRef.hide();
            break;
          }
          case 'CompanyContactPersonFirstName': {
            this.companyInfoForm.controls[key].invalid && !this.panelCollapsed ? this.contactPersonNameRef.show()
              : this.contactPersonNameRef.hide();
            break;
          }
          case 'CompanyContactPersonSurname': {
            this.companyInfoForm.controls[key].invalid && !this.panelCollapsed ? this.contactPersonSurnameRef.show()
              : this.contactPersonSurnameRef.hide();
            break;
          }
          case 'BusinessLocation': {
            this.companyInfoForm.controls[key].invalid && !this.panelCollapsed ? this.locationRef.show() : this.locationRef.hide();
            break;
          }
          case 'BusinessLandlineCode': {
            this.companyInfoForm.controls[key].invalid && !this.panelCollapsed ? this.landlindeCodeRef.show()
              : this.landlindeCodeRef.hide();
            break;
          }
          case 'BusinessLandlineNumber': {
            this.companyInfoForm.controls[key].invalid && !this.panelCollapsed ? this.landlineNumberRef.show()
              : this.landlineNumberRef.hide();
            break;
          }
          case 'CompanyDefaultLanguage': {
            this.companyInfoForm.controls[key].invalid && !this.panelCollapsed ? this.languageRef.show() : this.languageRef.hide();
            break;
          }
          case 'CompanyWebsite': {
            this.companyInfoForm.controls[key].invalid && !this.panelCollapsed ? this.websiteRef.show() : this.websiteRef.hide();
            break;
          }
          case 'CompanyCurrency': {
            this.companyInfoForm.controls[key].invalid && !this.panelCollapsed ? this.currencyRef.show() : this.currencyRef.hide();
            break;
          }
        }
      }
    }
  }

  copyObjectProperties = (from: any, to: any): void => {
    for (const prop in from) {
      if (from.hasOwnProperty(prop)) {
        to[prop] = from[prop];
      }
    }
  }

  cancel = (): void => {
    this.companyInfoForm.reset(this.oldFormValue);
    this.panelHeader.nativeElement.click();
    this.showHideErrorToolTips();
  }
}


