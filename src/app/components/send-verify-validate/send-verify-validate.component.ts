import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

import { BsModalService } from 'ngx-bootstrap/modal';
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';
import { SellerInfoManagerService } from '../../services/seller-info-manager.service';
import { ModalHelperService } from '../../services/modal-helper.service';


@Component({
  selector: 'app-send-verify-validate',
  templateUrl: './send-verify-validate.component.html',
  styleUrls: ['./send-verify-validate.component.css']
})
export class SendVerifyValidateComponent implements OnInit {

  verifyContact: string;
  companyId: string;
  email: string;
  mobile: string;
  sendVerify = true;
  verificationCodeForm: FormGroup;
  failureMessage: boolean;
  successMessage: boolean;
  popupContent: string;
  verificationCode: string;

  @ViewChild('digit1') digit1Element: ElementRef;
  @ViewChild('digit2') digit2Element: ElementRef;
  @ViewChild('digit3') digit3Element: ElementRef;
  @ViewChild('digit4') digit4Element: ElementRef;
  @ViewChild('digit5') digit5Element: ElementRef;
  @ViewChild('digit6') digit6Element: ElementRef;

  constructor(public bsModalRef: BsModalRef, private sellerInfoManager: SellerInfoManagerService, private fb: FormBuilder,
    private modalHelperService: ModalHelperService) { }

  ngOnInit() {
    this.verificationCodeForm = this.fb.group({
      // 'verificationCode': [null, null],
      'digit1': [null, Validators.required],
      'digit2': [null, Validators.required],
      'digit3': [null, Validators.required],
      'digit4': [null, Validators.required],
      'digit5': [null, Validators.required],
      'digit6': [null, Validators.required],
    });

    this.verificationCodeForm.valueChanges.subscribe((newValue) => {
      if (newValue) {
        this.successMessage = this.failureMessage = false;
      }
      if (this.verificationCodeForm.valid) {
        this.verificationCode = this.verificationCodeForm.controls['digit1'].value +
          this.verificationCodeForm.controls['digit2'].value +
          this.verificationCodeForm.controls['digit3'].value +
          this.verificationCodeForm.controls['digit4'].value +
          this.verificationCodeForm.controls['digit5'].value +
          this.verificationCodeForm.controls['digit6'].value;
      }
    });

    this.verificationCodeForm.get('digit1').valueChanges
      .filter((value: string) => value && value.length === 1)
      .subscribe(() => this.digit2Element.nativeElement.focus());

    this.verificationCodeForm.get('digit2').valueChanges
      .filter((value: string) => value && value.length === 1)
      .subscribe(() => this.digit3Element.nativeElement.focus());

    this.verificationCodeForm.get('digit3').valueChanges
      .filter((value: string) => value && value.length === 1)
      .subscribe(() => this.digit4Element.nativeElement.focus());

    this.verificationCodeForm.get('digit4').valueChanges
      .filter((value: string) => value && value.length === 1)
      .subscribe(() => this.digit5Element.nativeElement.focus());

    this.verificationCodeForm.get('digit5').valueChanges
      .filter((value: string) => value && value.length === 1)
      .subscribe(() => this.digit6Element.nativeElement.focus());
  }

  validateCode = () => {
    const data = {
      Company: {
        CompanyID: this.companyId,
        Code: this.verificationCode
      }
    };

    if (this.verifyContact === 'Email') {
      this.sellerInfoManager.validateEmailVerificationCode(data).subscribe((responseData) => {
        if (responseData.message === 'true' && responseData.status === 200) {
          this.bsModalRef.hide();
          this.sellerInfoManager.sellerInformation.profileProgress.VerifyEmail = true;
          this.modalHelperService.showSuccess('Information', 'Great! Your Email address has been successfully verified');
        } else {
          this.bsModalRef.hide();
          this.modalHelperService.showFailure('Error', 'Your Email address is not verified, please try agin with a new OTP!');
        }
      },
        (error) => {
          this.failureMessage = true;
        }
      );
    } else if (this.verifyContact === 'Mobile') {
      this.sellerInfoManager.validateMobileVerificationCode(data).subscribe((responseData) => {
        if (responseData.message === 'true' && responseData.status === 200) {
          this.bsModalRef.hide();
          this.sellerInfoManager.sellerInformation.profileProgress.VerifyMobile = true;
          this.modalHelperService.showSuccess('Information', 'Great! Your Mobile number has been successfully verified');
        } else if (responseData.message === 'false' && responseData.status === 200) {
          this.bsModalRef.hide();
          this.modalHelperService.showFailure('Error', 'Your Mobile number is not verified, please try agin with a new OTP!');
        } else {
          this.failureMessage = true;
        }
      },
        (error) => {
          // this.modalHelperService.showFailure('Error', 'Company contact information could not be updated, please try after some time!');
          this.failureMessage = true;

        }
      );
    }
  }

  sendVerifyCode = (event: Event) => {
    event.preventDefault();
    const data = {
      Company: {
        CompanyID: this.companyId
      }
    };
    if (this.verifyContact === 'Email') {
      this.sellerInfoManager.sendVerifyEmail(data).subscribe((response) => {
        if (response.message === 'Success') {
          this.successMessage = true;
        }
      }, (error) => {
        this.modalHelperService.showFailure('Error', 'Could not be send the OTP, please try after some time!');
        console.log(error);
      });
    } else if (this.verifyContact === 'Mobile') {
      this.sellerInfoManager.sendVerifyMobile(data).subscribe((response) => {
        if (response.message === 'Success') {
          this.successMessage = true;
        }
      }, (error) => {
        this.modalHelperService.showFailure('Error', 'Could not be send the OTP, please try after some time!');
        console.log(error);
      });
    }
  }
}

