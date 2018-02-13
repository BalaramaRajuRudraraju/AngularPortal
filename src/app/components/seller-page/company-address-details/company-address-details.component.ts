import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { FormGroup, FormControl, Validators, AbstractControl } from '@angular/forms';
import { ActivatedRoute, Params } from '@angular/router';

// import { Ng4LoadingSpinnerService } from 'ng4-loading-spinner';

import { HttpHelperService } from '../../../services/http-helper.service';
import { CompanyAddressResponse } from './../../../models/response-types.model';
import { CompanyAddress } from '../../../models/company-address.model';
import { SellerInfoManagerService } from '../../../services/seller-info-manager.service';
import { ModalHelperService } from './../../../services/modal-helper.service';
import ValidationHelper from '../../../validations-helper';
import { ValidationService } from '../../../services/validation.service';
import { TooltipConfig } from 'ngx-bootstrap/tooltip';
import { CookieService } from 'ngx-cookie-service';

const {
  expressions,
  messages
} = ValidationHelper;

export function getTooltipConfig(): TooltipConfig {
  return Object.assign(new TooltipConfig(), {
    placement: 'top',
    container: 'body',
    triggers: 'keydown'
  });
}

@Component({
  selector: 'app-company-address-details',
  templateUrl: './company-address-details.component.html',
  styleUrls: ['./company-address-details.component.css'],
  providers: [{ provide: TooltipConfig, useFactory: getTooltipConfig }]
})
export class CompanyAddressDetailsComponent implements OnInit {
  companyAddressesForm: FormGroup;
  oldFormValue: any;
  companyAddresses: CompanyAddressResponse;
  businessPhysicalAddress: CompanyAddress;
  postBoxAddress: CompanyAddress;
  formModified: boolean;
  previousPostBoxAddr: any;
  bothAddrsUpdated: boolean;
  panelCollapsed = true;
  email = 'raju@i4g.com';
  companyID = 41;
  loading: boolean;

  @ViewChild('businessLocnAddrLine1Ref') businessLocnAddrLine1Ref;
  @ViewChild('businessLocnAddrLine2Ref') businessLocnAddrLine2Ref;
  @ViewChild('businessLocnCityRef') businessLocnCityRef;
  @ViewChild('businessLocnStateRef') businessLocnStateRef;
  @ViewChild('businessLocnCountryRef') businessLocnCountryRef;
  @ViewChild('businessLocnPostalCodeRef') businessLocnPostalCodeRef;

  @ViewChild('postBoxAddrLine1Ref') postBoxAddrLine1Ref;
  @ViewChild('postBoxAddrLine2Ref') postBoxAddrLine2Ref;
  @ViewChild('postBoxCityRef') postBoxCityRef;
  @ViewChild('postBoxStateRef') postBoxStateRef;
  @ViewChild('postBoxCountryRef') postBoxCountryRef;
  @ViewChild('postBoxPostalCodeRef') postBoxPostalCodeRef;

  @ViewChild('panelHeader') panelHeader: ElementRef;

  constructor(private httpHelper: HttpHelperService, private sellerInfoMngr: SellerInfoManagerService,
    private modalHelperService: ModalHelperService, private activatedRoute: ActivatedRoute,
    private cookies: CookieService) { }

  ngOnInit() {
    this.companyAddressesForm = new FormGroup({

      businessLocationAddressForm: new FormGroup({
        addrLine1: new FormControl(null, Validators.compose([Validators.required, Validators.minLength(10), Validators.maxLength(100),
        Validators.pattern(expressions.REGEXP_ADDRESS)])),
        addrLine2: new FormControl(null, Validators.compose([Validators.required, Validators.minLength(10), Validators.maxLength(100),
        Validators.pattern(expressions.REGEXP_ADDRESS)])),
        city: new FormControl(null, Validators.compose([Validators.required, Validators.minLength(3), Validators.maxLength(50),
        Validators.pattern(expressions.REGEXP_ALPHA_NUMERIC)])),
        state: new FormControl(null, Validators.compose([Validators.required, Validators.minLength(3), Validators.maxLength(50),
        Validators.pattern(expressions.REGEXP_ALPHA_NUMERIC_SPACE)])),
        country: new FormControl(null, Validators.compose([Validators.required, Validators.minLength(5), Validators.maxLength(20),
        Validators.pattern(expressions.REGEXP_ALPHA_NUMERIC_SPACE)])),
        postalCode: new FormControl(null, Validators.compose([Validators.required, Validators.minLength(2), Validators.maxLength(10),
        Validators.pattern(expressions.REGEXP_ALPHA_NUMERIC)]))
      }),

      postBoxAddressForm: new FormGroup({
        isPhysicalAddrSameAsBusinessLocn: new FormControl(null),
        addrLine1: new FormControl(null, Validators.compose([Validators.required, Validators.minLength(10), Validators.maxLength(100),
        Validators.pattern(expressions.REGEXP_ADDRESS)])),
        addrLine2: new FormControl(null, Validators.compose([Validators.required, Validators.minLength(10), Validators.maxLength(100),
        Validators.pattern(expressions.REGEXP_ADDRESS)])),
        city: new FormControl(null, Validators.compose([Validators.required, Validators.minLength(3), Validators.maxLength(50),
        Validators.pattern(expressions.REGEXP_ALPHA_NUMERIC)])),
        state: new FormControl(null, Validators.compose([Validators.required, Validators.minLength(3), Validators.maxLength(50),
        Validators.pattern(expressions.REGEXP_ALPHA_NUMERIC_SPACE)])),
        country: new FormControl(null, Validators.compose([Validators.required, Validators.minLength(5), Validators.maxLength(20),
        Validators.pattern(expressions.REGEXP_ALPHA_NUMERIC_SPACE)])),
        postalCode: new FormControl(null, Validators.compose([Validators.required, Validators.minLength(2), Validators.maxLength(10),
        Validators.pattern(expressions.REGEXP_ALPHA_NUMERIC)]))
      })
    });

    this.companyAddressesForm.valueChanges.subscribe(
      (newFormValue) => {
        if (this.oldFormValue && (JSON.stringify(newFormValue).toLowerCase() !== JSON.stringify(this.oldFormValue).toLowerCase())) {
          this.formModified = true;
        } else {
          this.formModified = false;
        }

        // if (this.companyAddressesForm.invalid) {
        // this.showHideErrorToolTips();
        // }
      }
    );

    this.companyAddressesForm.controls['businessLocationAddressForm'].valueChanges.subscribe(
      () => {
        if (this.companyAddressesForm.controls['postBoxAddressForm'].value.isPhysicalAddrSameAsBusinessLocn) {
          this.companyAddressesForm.controls['postBoxAddressForm'].patchValue(
            this.companyAddressesForm.controls['businessLocationAddressForm'].value
          );
        }
      }
    );
    this.email = this.cookies.get('i4g_auth_email');

    /*     const parameters = this.activatedRoute.queryParams.filter(params => params.email || params.companyId).subscribe((params) => {
          this.email = params.email || this.email;
          this.companyID = params.companyId || this.companyID;
        }); */
  }

  loadData = (): void => {
    if (!this.email) {
      this.modalHelperService.showFailure('Error', 'Couldn\'t identify the user, please try loggin in again');
      return;
    }
    this.panelCollapsed = !this.panelCollapsed;
    if (!this.sellerInfoMngr.sellerInformation.companyAddresses) {
      this.sellerInfoMngr.sellerInformation.companyAddresses = Array<CompanyAddress>(2);
      this.sellerInfoMngr.sellerInformation.companyAddresses[0] = new CompanyAddress();
      this.sellerInfoMngr.sellerInformation.companyAddresses[1] = new CompanyAddress();
    }

    const url = '/getCompanyAddress';
    const data = { Email: this.email };
    this.loading = true;
    this.httpHelper.postData<CompanyAddressResponse>(url, data).subscribe(
      companyAddress => {
        this.companyAddresses = companyAddress,
          this.mapResponseToView();
        this.loading = false;
      },
      (error) => {
        console.log('Error = ', error);
        this.loading = false;
      }
    );
  }

  getErrorMessage = (control: AbstractControl): string => {
    return ValidationService.getErrorMessage(control);
  }

  mapResponseToView() {
    for (const address of this.companyAddresses.CompanyAddress) {
      switch (address.AddressType) {
        case 1: {
          this.businessPhysicalAddress = address;

          this.companyAddressesForm.controls['businessLocationAddressForm'].setValue(
            {
              addrLine1: address.AddressLine1,
              addrLine2: address.AddressLine2,
              city: address.City,
              state: address.State,
              country: address.Country,
              postalCode: address.PostalCode
            });
          break;
        }
        case 2: {
          this.postBoxAddress = address;
          this.companyAddressesForm.controls['postBoxAddressForm'].patchValue(
            {
              addrLine1: address.AddressLine1,
              addrLine2: address.AddressLine2,
              city: address.City,
              state: address.State,
              country: address.Country,
              postalCode: address.PostalCode
            });
          break;
        }
        default: break;
      }
    }
    this.oldFormValue = this.companyAddressesForm.value;
  }

  updatePostBoxAddress() {

    if (this.companyAddressesForm.controls['postBoxAddressForm'].value.isPhysicalAddrSameAsBusinessLocn) {
      this.companyAddressesForm.controls['postBoxAddressForm'].patchValue(
        this.companyAddressesForm.controls['businessLocationAddressForm'].value
      );
      this.companyAddressesForm.controls['postBoxAddressForm'].disable();
      this.companyAddressesForm.controls['postBoxAddressForm'].get('isPhysicalAddrSameAsBusinessLocn').enable();
    } else {
      this.companyAddressesForm.controls['postBoxAddressForm'].enable();
    }
  }

  saveAddress() {
    let businessPhysicalAddrToUpdate;
    let postBoxAddrToUpdate;
    this.bothAddrsUpdated = this.companyAddressesForm.controls['businessLocationAddressForm'].dirty &&
      this.companyAddressesForm.controls['postBoxAddressForm'].dirty;
    console.log('bothAddrsUpdated', this.bothAddrsUpdated);

    if (this.companyAddressesForm.controls['businessLocationAddressForm'].dirty) {
      businessPhysicalAddrToUpdate = new CompanyAddress();

      // tslint:disable-next-line:max-line-length
      businessPhysicalAddrToUpdate.AddressLine1 = this.companyAddressesForm.controls['businessLocationAddressForm'].get('addrLine1').value;
      businessPhysicalAddrToUpdate.AddressLine2 = this.companyAddressesForm.controls['businessLocationAddressForm'].get('addrLine2').value;
      businessPhysicalAddrToUpdate.CompanyId = this.companyID;
      businessPhysicalAddrToUpdate.AddressType = 1;
      businessPhysicalAddrToUpdate.City = this.companyAddressesForm.controls['businessLocationAddressForm'].get('city').value;
      // tslint:disable-next-line:max-line-length
      businessPhysicalAddrToUpdate.Country = this.companyAddressesForm.controls['businessLocationAddressForm'].get('country').value;
      businessPhysicalAddrToUpdate.State = this.companyAddressesForm.controls['businessLocationAddressForm'].get('state').value;
      // tslint:disable-next-line:max-line-length
      businessPhysicalAddrToUpdate.PostalCode = this.companyAddressesForm.controls['businessLocationAddressForm'].get('postalCode').value;
      this.sellerInfoMngr.sellerInformation.companyAddresses[0] = businessPhysicalAddrToUpdate;
      this.updateAddress(businessPhysicalAddrToUpdate);
    }

    if (this.companyAddressesForm.controls['postBoxAddressForm'].dirty) {
      postBoxAddrToUpdate = new CompanyAddress();

      postBoxAddrToUpdate.AddressLine1 = this.companyAddressesForm.controls['postBoxAddressForm'].get('addrLine1').value;
      postBoxAddrToUpdate.AddressLine2 = this.companyAddressesForm.controls['postBoxAddressForm'].get('addrLine2').value;
      postBoxAddrToUpdate.CompanyId = this.companyID;
      postBoxAddrToUpdate.AddressType = 2;
      postBoxAddrToUpdate.City = this.companyAddressesForm.controls['postBoxAddressForm'].get('city').value;
      postBoxAddrToUpdate.Country = this.companyAddressesForm.controls['postBoxAddressForm'].get('country').value;
      postBoxAddrToUpdate.State = this.companyAddressesForm.controls['postBoxAddressForm'].get('state').value;
      postBoxAddrToUpdate.PostalCode = this.companyAddressesForm.controls['postBoxAddressForm'].get('postalCode').value;
      this.sellerInfoMngr.sellerInformation.companyAddresses[1] = postBoxAddrToUpdate;
      this.updateAddress(postBoxAddrToUpdate);
    }
  }

  updateAddress(addressToUpdate: CompanyAddress) {
    const url = '/updateCompanyAddress';
    // this.spinnerService.show();


    const addrUpdateData = {
      CompanyAddress: addressToUpdate
    };
    this.loading = true;
    this.httpHelper.postData(url, addrUpdateData).subscribe(
      (responseData: Response) => {
        if (this.bothAddrsUpdated && addressToUpdate.AddressType === 2) {
          this.modalHelperService.showSuccess('Information', 'Address details updated successfully!');
          this.panelHeader.nativeElement.click();
          this.panelCollapsed = !this.panelCollapsed;
        }
        console.log(responseData);
        this.loading = false;
        // this.spinnerService.hide();
      },
      (error) => {
        this.modalHelperService.showFailure('Error', 'Address details could not be updated, please try after some time');
        console.log('Error = ', error);
        this.loading = false;
      }
    );
  }

  cancel() {
    this.companyAddressesForm.reset(this.oldFormValue);
    this.panelHeader.nativeElement.click();
    this.showHideErrorToolTips();
  }

  showHideErrorToolTips = (): void => {
    // tslint:disable-next-line:forin
    for (const key in this.companyAddressesForm.controls) {
      // tslint:disable-next-line:forin
      for (const childKey in this.companyAddressesForm.controls[key].value) {
        if (key === 'businessLocationAddressForm') {
          switch (childKey) {
            case 'addrLine1': {
              console.log('is Invalid ? ', this.companyAddressesForm.controls[key].get(childKey).invalid);
              this.companyAddressesForm.controls[key].get(childKey).invalid && !this.panelCollapsed ?
                this.businessLocnAddrLine1Ref.show() : this.businessLocnAddrLine1Ref.hide();
              break;
            }
            case 'addrLine2': {
              this.companyAddressesForm.controls[key].get(childKey).invalid && !this.panelCollapsed ?
                this.businessLocnAddrLine2Ref.show() : this.businessLocnAddrLine2Ref.hide();
              break;
            }
            case 'city': {
              this.companyAddressesForm.controls[key].get(childKey).invalid && !this.panelCollapsed ?
                this.businessLocnCityRef.show() : this.businessLocnCityRef.hide();
              break;
            }
            case 'state': {
              this.companyAddressesForm.controls[key].get(childKey).invalid && !this.panelCollapsed ?
                this.businessLocnStateRef.show() : this.businessLocnStateRef.hide();
              break;
            }
            case 'country': {
              this.companyAddressesForm.controls[key].get(childKey).invalid && !this.panelCollapsed ?
                this.businessLocnCountryRef.show() : this.businessLocnCountryRef.hide();
              break;
            }
            case 'postalCode': {
              this.companyAddressesForm.controls[key].get(childKey).invalid && !this.panelCollapsed ?
                this.businessLocnPostalCodeRef.show() : this.businessLocnPostalCodeRef.hide();
              break;
            }
          }
        } else if (key === 'postBoxAddressForm') {
          switch (childKey) {
            case 'addrLine1': {
              this.companyAddressesForm.controls[key].get(childKey).invalid && !this.panelCollapsed ?
                this.postBoxAddrLine1Ref.show() : this.postBoxAddrLine1Ref.hide();
              break;
            }
            case 'addrLine2': {
              this.companyAddressesForm.controls[key].get(childKey).invalid && !this.panelCollapsed ?
                this.postBoxAddrLine2Ref.show() : this.postBoxAddrLine2Ref.hide();
              break;
            }
            case 'city': {
              this.companyAddressesForm.controls[key].get(childKey).invalid && !this.panelCollapsed ?
                this.postBoxCityRef.show() : this.postBoxCityRef.hide();
              break;
            }
            case 'state': {
              this.companyAddressesForm.controls[key].get(childKey).invalid && !this.panelCollapsed ?
                this.postBoxStateRef.show() : this.postBoxStateRef.hide();
              break;
            }
            case 'country': {
              this.companyAddressesForm.controls[key].get(childKey).invalid && !this.panelCollapsed ?
                this.postBoxCountryRef.show() : this.postBoxCountryRef.hide();
              break;
            }
            case 'postalCode': {
              this.companyAddressesForm.controls[key].get(childKey).invalid && !this.panelCollapsed ?
                this.postBoxPostalCodeRef.show() : this.postBoxPostalCodeRef.hide();
              break;
            }
          }
        }
      }
    }
  }
}
