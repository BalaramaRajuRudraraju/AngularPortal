import { Component, OnInit, transition, ViewChild, ElementRef } from '@angular/core';
import { FormGroup, FormBuilder, FormControl, Validators, AbstractControl } from '@angular/forms';
import { ActivatedRoute, Params } from '@angular/router';

import { TooltipConfig } from 'ngx-bootstrap/tooltip';

import { CompanySocialMediaInfoModel, SocialMediaModel } from '../../../models/company-social-media-info.model';
import { Response } from '../../../models/response.model';
import { SellerInfoManagerService } from '../../../services/seller-info-manager.service';
import ValidationHelper from '../../../validations-helper';
import { ValidationService } from '../../../services/validation.service';
import { ModalHelperService } from '../../../services/modal-helper.service';
import { CookieService } from 'ngx-cookie-service';

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
  selector: 'app-company-social-media-info',
  templateUrl: './company-social-media-info.component.html',
  styleUrls: ['./company-social-media-info.component.css'],
  providers: [{ provide: TooltipConfig, useFactory: getTooltipConfig }]
})
export class CompanySocialMediaInfoComponent implements OnInit {

  socialMediaInfoForm: FormGroup;
  socialMediaInforModel: SocialMediaModel[];
  oldFormValue: any;
  formChanged: boolean;
  panelCollapsed = true;
  email = 'raju@i4g.com';
  companyID = 41;
  loading: boolean;

  // Get control references for tooltips
  @ViewChild('facebookRef') facebookref;
  @ViewChild('twitterRef') twitterRef;
  @ViewChild('youtubeRef') youtubeRef;
  @ViewChild('linkedInRef') linkedInRef;

  @ViewChild('panelHeader') panelHeader: ElementRef;

  constructor(private fb: FormBuilder, private sellerInfoManager: SellerInfoManagerService, private activatedRoute: ActivatedRoute,
    private modalHelperService: ModalHelperService, private cookies: CookieService) { }

  ngOnInit() {
    /* this.activatedRoute.queryParams.filter(params => params.email).subscribe((params: Params) => {
      this.email = params.email || this.email;
      this.companyID = params.companyId || this.companyID;
      console.log(this.email + ',' + this.companyID);
    }); */
    this.email = this.cookies.get('i4g_auth_email');
    this.socialMediaInfoForm = this.fb.group({
      'facebook': [null, Validators.compose([Validators.minLength(5), Validators.maxLength(100)])],
      'twitter': [null, Validators.compose([Validators.minLength(5), Validators.maxLength(100)])],
      'youtube': [null, Validators.compose([Validators.minLength(5), Validators.maxLength(100)])],
      'linkedIn': [null, Validators.compose([Validators.minLength(5), Validators.maxLength(100)])]
    });
    this.socialMediaInfoForm.valueChanges.subscribe(
      (newFormValue) => {
        if (this.oldFormValue && (JSON.stringify(newFormValue).toLowerCase() !== JSON.stringify(this.oldFormValue).toLowerCase())) {
          this.formChanged = true;
        } else {
          this.formChanged = false;
        }

        if (this.socialMediaInfoForm.invalid) {
          this.showHideErrorToolTips();
        }
      }
    );
  }

  loadData = (): void => {
    if (!this.email) {
      this.modalHelperService.showFailure('Error', 'Couldn\'t identify the user, please try loggin in again');
      return;
    }
    this.panelCollapsed = !this.panelCollapsed;
    this.socialMediaInforModel = this.sellerInfoManager.sellerInformation.SocialMediaInfo;
    if (!this.socialMediaInforModel) {
      const data = { CompanyId: this.companyID };
      this.loading = true;
      this.sellerInfoManager.getSocialMediaLinks(data).subscribe(
        (socialMediaInfoResponse) => {
          this.sellerInfoManager.sellerInformation.SocialMediaInfo = this.socialMediaInforModel
            = JSON.parse(socialMediaInfoResponse.message);
          console.log(socialMediaInfoResponse.message);
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
    const socialMediaInfoUpdated = {
      CompanyId: this.companyID,
      SocialMediaLinks: this.socialMediaInforModel
    };
    let modelUpdated: boolean;
    for (const key in this.socialMediaInfoForm.value) {
      if (socialMediaInfoUpdated.SocialMediaLinks && socialMediaInfoUpdated.SocialMediaLinks.length > 0) {
        const socialMediaIndex = socialMediaInfoUpdated.SocialMediaLinks.findIndex(link => {
          return link.Code === key;
        });
        if ((socialMediaIndex >= 0 && socialMediaInfoUpdated.SocialMediaLinks[socialMediaIndex].Name
          !== this.socialMediaInfoForm.value[key]) || socialMediaIndex < 0) {
          if (socialMediaIndex >= 0) {
            socialMediaInfoUpdated.SocialMediaLinks.splice(socialMediaIndex, 1);
          }
          socialMediaInfoUpdated.SocialMediaLinks.push({ Code: key, Name: this.socialMediaInfoForm.value[key] });
          modelUpdated = true;
        }
      }
    }
    /*  for (const key in this.socialMediaInfoForm.value) {
       if (this.socialMediaInforModel && this.socialMediaInforModel.length > 0) {
         const socialMedia = this.socialMediaInforModel.find(link => {
           return link.Code === key;
         });
         if ((socialMedia && socialMedia.Name !== this.socialMediaInfoForm.value[key]) || !socialMedia) {
           if (!socialMediaInfoUpdated.SocialMediaLinks) {
             socialMediaInfoUpdated.SocialMediaLinks = new Array<SocialMediaModel>();
           }
           socialMediaInfoUpdated.SocialMediaLinks.push({ Code: key, Name: this.socialMediaInfoForm.value[key] });
         }
       } else {
         if (!socialMediaInfoUpdated.SocialMediaLinks) {
           socialMediaInfoUpdated.SocialMediaLinks = new Array<SocialMediaModel>();
         }
         socialMediaInfoUpdated.SocialMediaLinks.push({ Code: key, Name: this.socialMediaInfoForm.value[key] });
         modelUpdated = true;
       }
     } */
    if (modelUpdated) {
      socialMediaInfoUpdated.CompanyId = this.companyID;
      this.loading = true;
      this.sellerInfoManager.saveSocialMediaLinks(socialMediaInfoUpdated).subscribe(
        (responseData: Response) => {
          // this.socialMediaInforModel = socialMediaInfoUpdated;
          this.socialMediaInfoForm.reset(this.socialMediaInfoForm.value);
          this.oldFormValue = this.socialMediaInfoForm.value;
          this.formChanged = false;
          this.sellerInfoManager.sellerInformation.SocialMediaInfo = this.socialMediaInforModel = socialMediaInfoUpdated.SocialMediaLinks;
          this.loading = false;
          this.modalHelperService.showSuccess('Information', 'Social Media Information updated successfully!');
          this.panelHeader.nativeElement.click();
          this.panelCollapsed = !this.panelCollapsed;
        },
        (errorResponse: Response) => {
          console.log(errorResponse);
          this.loading = false;
          this.modalHelperService.showFailure('Error', 'Social Media Information couldn\'t be updated. Please try again after some time');
          if (errorResponse.status === 400) {
            for (const validationError of errorResponse.error.errors) {
              // const fieldName = validationError.field.split('.');
              document.getElementById(validationError.field).innerText = validationError.defaultMessage;
              console.log(validationError.field + ':' + validationError.defaultMessage);
            }
          }
        }
      );
    }
  }

  mapModelDataToView = (): void => {
    if (this.socialMediaInforModel && this.socialMediaInforModel.length > 0) {
      this.socialMediaInfoForm.controls['facebook'].setValue(this.findName('facebook'));
      this.socialMediaInfoForm.controls['twitter'].setValue(this.findName('twitter'));
      this.socialMediaInfoForm.controls['youtube'].setValue(this.findName('youtube'));
      this.socialMediaInfoForm.controls['linkedIn'].setValue(this.findName('linkedIn'));
    }
    this.oldFormValue = this.socialMediaInfoForm.value;
  }

  findName = (name: string): string => {
    const socialMediaFound = this.socialMediaInforModel.find(item => {
      return item.Code === name;
    });
    return socialMediaFound ? socialMediaFound.Name : null;
  }

  getErrorMessage = (control: AbstractControl): string => {
    return ValidationService.getErrorMessage(control);
  }

  showHideErrorToolTips = (): void => {
    this.panelCollapsed ? this.facebookref.hide() : this.facebookref.show();
    this.panelCollapsed ? this.twitterRef.hide() : this.twitterRef.show();
    this.panelCollapsed ? this.youtubeRef.hide() : this.youtubeRef.show();
    this.panelCollapsed ? this.linkedInRef.hide() : this.linkedInRef.show();
  }

  cancel = (): void => {
    this.socialMediaInfoForm.reset(this.oldFormValue);
    this.panelHeader.nativeElement.click();
    this.showHideErrorToolTips();
  }

}
