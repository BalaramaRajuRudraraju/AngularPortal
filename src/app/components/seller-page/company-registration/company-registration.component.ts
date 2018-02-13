import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { FormGroup, FormBuilder, Validators, AbstractControl } from '@angular/forms';
import { ActivatedRoute, Params } from '@angular/router';

import { Company } from '../../../models/company.model';
import { SellerInfoManagerService } from '../../../services/seller-info-manager.service';
import { ValidationService } from '../../../services/validation.service';
import { ModalHelperService } from '../../../services/modal-helper.service';
import { Response } from '../../../models/response.model';
import { CookieService } from 'ngx-cookie-service';
import { SharedService } from '../../../services/shared.service';

@Component({
  selector: 'app-company-registration',
  templateUrl: './company-registration.component.html',
  styleUrls: ['./company-registration.component.css']
})
export class CompanyRegistrationComponent implements OnInit {

  companyRegistrationForm: FormGroup;
  registrationNumberChanged: boolean;
  companyInfoModel: Company;
  oldFormValue: any;
  panelCollapsed = true;
  companyDocs: string[];
  email = 'raju@i4g.com';
  companyID = 41;
  loading: boolean;

  @ViewChild('regNumberRef') regNumberRef;
  @ViewChild('panelHeader') panelHeader: ElementRef;
  @ViewChild('fileUploadInput') fileUploadInput;

  constructor(private fb: FormBuilder, private sellerInfoManager: SellerInfoManagerService,
    private modalHelperService: ModalHelperService, private elRef: ElementRef, private activatedRoute: ActivatedRoute,
    private cookies: CookieService, private sharedService: SharedService) { }

  ngOnInit() {
    /*   this.activatedRoute.queryParams.filter(params => params.email).subscribe((params: Params) => {
        this.email = params.email || this.email;
        this.companyID = params.companyId || this.companyID;
        console.log(this.email + ',' + this.companyID);
      }); */
    this.email = this.cookies.get('i4g_auth_email');
    this.companyRegistrationForm = this.fb.group({
      'CompanyRegistrationNumber': [null, Validators.required],
      'fileUpload': [null, null]
    });

    this.companyRegistrationForm.controls['CompanyRegistrationNumber'].valueChanges.subscribe(
      (newFormValue) => {
        this.registrationNumberChanged = this.oldFormValue && (newFormValue !== this.oldFormValue.CompanyRegistrationNumber)
          ? true : false;
      }
    );

    this.sharedService.selectedSection$.subscribe((sectionName: string) => {
      if ((sectionName === 'registration-documents' && this.panelCollapsed)
        || (sectionName !== 'registration-documents' && !this.panelCollapsed)) {
        this.panelHeader.nativeElement.click();
        this.showHideErrorToolTips();
      }
    });
  }

  /*   ngAfterViewChecked() {
      console.log(this.elRef.nativeElement.querySelector('.fileinput-upload-button'));
      (<HTMLButtonElement>this.elRef.nativeElement.querySelector('.input-group-btn .fileinput-upload-button'))
        .addEventListener('click', function () {
          console.log('upload');
        });
    } */

  upload = () => {
    console.log('upload');
  }

  loadData = (): void => {
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
          this.companyRegistrationForm.controls['CompanyRegistrationNumber'].setValue(this.companyInfoModel.CompanyRegistrationNumber);
          this.oldFormValue = this.companyRegistrationForm.value;
          this.loading = false;
        },
        (error) => {
          console.log(error);
          this.loading = false;
        }
      );
    } else {
      this.companyRegistrationForm.controls['CompanyRegistrationNumber'].setValue(this.companyInfoModel.CompanyRegistrationNumber);
      this.oldFormValue = this.companyRegistrationForm.value;
    }

    if (!(this.sellerInfoManager.sellerInformation && this.sellerInfoManager.sellerInformation.companyDocs)) {
      const data = { Email: this.email };
      this.loading = true;
      this.sellerInfoManager.getCompanyDocs(data).subscribe(
        (companyDocs) => {
          console.log(companyDocs);
          this.sellerInfoManager.sellerInformation.companyDocs = this.companyDocs = companyDocs.CompanyDocs;
          this.loading = false;
        },
        (error) => {
          console.log(error);
          this.loading = false;
        }
      );
    }
  }

  saveRegistrationNumber = (): void => {
    const key = 'CompanyRegistrationNumber';
    if (this.registrationNumberChanged) {
      const requestData = {
        CompanyId: this.companyInfoModel.CompanyID,
        RegistrationNo: this.companyRegistrationForm.controls[key].value
      };
      this.loading = true;
      this.sellerInfoManager.updateRegistrationNo(requestData).subscribe((responseData) => {
        if (responseData.status === 200) {
          this.companyInfoModel[key] = this.companyRegistrationForm.value[key];
          this.sellerInfoManager.sellerInformation.companyInfo = this.companyInfoModel;
          this.companyRegistrationForm.controls[key].reset(this.companyRegistrationForm.value[key]);
          this.oldFormValue[key] = this.companyRegistrationForm.value[key];
          this.registrationNumberChanged = false;
          this.loading = false;
          this.modalHelperService.showSuccess('Information', 'Great! Registration Number has been updated');
        }
      }, (error) => {
        console.log(error);
        this.loading = false;
        this.modalHelperService.showFailure('Error', 'Registration Number couldn\'t be updated. Please try again after some time');
      });
    }
  }

  fileUpload = (event): void => {
    const fileList: FileList = event.target.files;
    if (fileList.length > 0) {
      const file: File = fileList[0];
      if (file.type === 'application/pdf' || file.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
        || file.type === 'application/msword') {
        const formData: FormData = new FormData();
        formData.append('file', file);
        console.log(file);
        formData.append('email', this.companyInfoModel.CompanyEmail);
        console.log('form Data = ', formData);
        this.loading = true;
        this.sellerInfoManager.uploadCompanyDocs(formData).subscribe(
          (response) => {
            console.log('success', response);
            this.companyDocs = response.CompanyDocs;
            console.log(($('#input-company-docs') as any).fileinput('clear'));
            this.loading = false;
          },
          (error) => {
            console.log(error);
            this.loading = false;
            this.modalHelperService.showFailure('Error', 'Document upload failed. Please try again after some time');
          }
        );
      } else {
        this.modalHelperService.showFailure('Error', 'Uploaded file type is not allowed. Please select .PDF or .DOC or .DOCX');
      }
    }
  }

  getErrorMessage = (control: AbstractControl): string => {
    return ValidationService.getErrorMessage(control);
  }

  cancel = (): void => {
    this.companyRegistrationForm.reset(this.oldFormValue);
    this.panelHeader.nativeElement.click();
    this.showHideErrorToolTips();
  }

  showHideErrorToolTips = (): void => {
    this.panelCollapsed ? this.regNumberRef.hide() : this.regNumberRef.show();
  }

  downloadCompanyDoc = (docName: string, event: Event): void => {
    event.preventDefault();
    const data = {
      Email: this.companyInfoModel.CompanyEmail,
      FileName: docName
    };
    this.loading = true;
    this.sellerInfoManager.downloadCompanyDocs(data).subscribe((response) => {
      console.log(response);
      this.loading = false;
      this.getBlobFromByteArray(response.document, docName);
    }, (error) => {
      console.log(error);
      this.loading = false;
    });
  }

  deleteDoc = (docName: string, event: Event): void => {
    event.preventDefault();
    const data = {
      Email: this.companyInfoModel.CompanyEmail,
      CompanyDocs: [docName]
    };
    this.loading = true;
    this.sellerInfoManager.deleteCompanyDocs(data).subscribe((companyDocs) => {
      console.log(companyDocs);
      this.loading = false;
      this.sellerInfoManager.sellerInformation.companyDocs = this.companyDocs = companyDocs.CompanyDocs;
    },
      (error) => {
        this.loading = false;
        this.modalHelperService.showFailure('Error', 'Delete Company document failed. Please try again after some time');
        console.log(error);
      }
    );
  }

  getBlobFromByteArray = (byteArray, docName): void => {
    // const blob = new Blob([byteArray], { type: 'image/png' });
    const blob = this.byteArraytoBlob(byteArray, 'image/png');
    const url = URL.createObjectURL(blob);
    this.download(docName, url);
    /*     window.location.href = url;
        window.open(url); */
  }

  byteArraytoBlob = (b64Data, contentType = '', sliceSize = 512) => {
    const byteCharacters = atob(b64Data);
    const byteArrays = [];

    for (let offset = 0; offset < byteCharacters.length; offset += sliceSize) {
      const slice = byteCharacters.slice(offset, offset + sliceSize);

      const byteNumbers = new Array(slice.length);
      for (let i = 0; i < slice.length; i++) {
        byteNumbers[i] = slice.charCodeAt(i);
      }

      const byteArray = new Uint8Array(byteNumbers);

      byteArrays.push(byteArray);
    }

    const blob = new Blob(byteArrays, { type: contentType });
    return blob;
  }


  download = (filename, url) => {
    const element = document.createElement('a');
    element.setAttribute('href', url);
    element.setAttribute('download', filename);

    element.style.display = 'none';
    document.body.appendChild(element);

    element.click();

    document.body.removeChild(element);
  }


}
