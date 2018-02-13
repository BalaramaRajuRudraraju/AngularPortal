import { Component, OnInit } from '@angular/core';
import { Headers, RequestOptions } from '@angular/http';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { FormGroup, FormControl } from '@angular/forms';
import { ActivatedRoute, Params } from '@angular/router';

// import { Ng4LoadingSpinnerService } from 'ng4-loading-spinner';

import { Response } from '../../../models/response.model';
import { ModalHelperService } from './../../../services/modal-helper.service';
import { HttpHelperService } from '../../../services/http-helper.service';
import { CookieService } from 'ngx-cookie-service';

@Component({
  selector: 'app-company-logo',
  templateUrl: './company-logo.component.html',
  styleUrls: ['./company-logo.component.css']
})
export class CompanyLogoComponent implements OnInit {

  baseURL = 'http://34.241.175.223:8080/i4gorigin.seller';
  imagePath: string;
  companyLogoUpdateSelected = false;
  email = 'raju@i4g.com';
  loading: boolean;
  defaultLogo = 'https://s3-eu-west-1.amazonaws.com/sprkrpvvak/1ds/prajagatham/images/default_logo.png';

  constructor(private httpHelper: HttpHelperService, private http: HttpClient, private modalHelperService: ModalHelperService,
    private activatedRoute: ActivatedRoute, private cookies: CookieService) { }

  ngOnInit() {

    this.email = this.cookies.get('i4g_auth_email');
    this.loadData();

    /*  const parameters = this.activatedRoute.queryParams.filter(params => params.email || params.companyId).subscribe((params) => {
       this.email = params.email || this.email;
       this.companyID = params.companyId || this.companyID;
     });
     setTimeout(() => {
       this.loadData();
     }, 50); */
  }

  loadData = (): void => {
    const url = '/getCompanyLogo';
    const data = { Email: this.email };
    this.loading = true;
    this.httpHelper.postData<Response>(url, data).subscribe(
      (response) => {
        this.imagePath = response.message && response.message !== 'S3CODE' ? response.message : this.defaultLogo;
        console.log('response = ', this.imagePath);
        this.loading = false;
      },
      (error: Response) => {
        console.log('Error = ', error);
        /* const errorMessage = <any>error.error;
        if (errorMessage && errorMessage.error === 'No Company Logo Found') { */
        this.imagePath = this.defaultLogo;
        /*  } */
        this.loading = false;
      }
    );
  }

  editCompanyLogo() {
    const x = document.getElementById('divLogo');
    x ? x.style.display = 'block' : null;
  }

  fileChange(event) {
    const fileList: FileList = event.target.files;
    if (fileList.length > 0) {
      // this.spinnerService.show();
      const file: File = fileList[0];
      if (file && ((file.type === 'image/jpeg') || (file.type === 'image/png'))) {
        const formData: FormData = new FormData();
        formData.append('file', file);
        formData.append('email', this.email);
        console.log('form Data = ', formData);
        this.loading = true;
        this.http.post('http://localhost:8080/i4gorigin.seller/uploadCompanyLogo',
          formData, { headers: this.getBasicAuth() })
          .subscribe(
          (data: Response) => {
            console.log('success', data.message);
            this.imagePath = data.message || this.defaultLogo;
            console.log(this.imagePath);
            const x = document.getElementById('divLogo');
            x ? x.style.display = 'none' : '';
            this.loading = false;
            // this.spinnerService.hide();
          },
          (error) => {
            console.log('error = ', error);
            if (error.error && error.error.toString() === 'No Company Logo Found') {
              this.imagePath = this.defaultLogo;
            }
            this.loading = false;
          }
          );
      } else {
        this.modalHelperService.showFailure('Failure', 'Uploaded file type is not allowed. Please select .jpg or .jpeg or .png');
      }
    }
  }

  getBasicAuth = (): any => {
    return new HttpHeaders()
      .set('Authorization', 'Basic ' + this.getBase64Authentication());
  }

  getBase64Authentication = (): string => {
    const userName = 'raju';
    const password = 'raju';
    return btoa(userName + ':' + password);
  }

}
