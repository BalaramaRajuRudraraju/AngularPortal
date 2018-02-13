import { Injectable } from '@angular/core';
import { Observer } from 'rxjs/Observer';
import { Observable } from 'rxjs/Observable';

import { SellerInformation } from '../models/seller-information.model';
import { CompanyInfoResponse } from '../models/response-types.model';
import { HttpHelperService } from './http-helper.service';
import { Response } from '../models/response.model';
import { CompanySocialMediaInfoModel, SocialMediaModel } from '../models/company-social-media-info.model';
import { ProfileProgressModel } from '../models/profile-progress.model';
import { GetLanguagesResponse } from '../models/language.model';
import { CompanyDocsModel } from '../models/company-docs.model';
import { DocumentDownload } from '../models/document-download.model';

@Injectable()
export class SellerInfoManagerService {

  sellerInformation: SellerInformation;


  constructor(private httpHelper: HttpHelperService) {
    this.sellerInformation = new SellerInformation();
  }

  getCompanyInfo = (request: any): Observable<CompanyInfoResponse> => {
    return this.httpHelper.postData<CompanyInfoResponse>('getCompanyInfo', request);
  }

  updateCompanyInfo = (request: any): Observable<Response> => {
    return this.httpHelper.postData<Response>('updateCompanyInfo', request);
  }

  updateCompanyMobile = (request: any): Observable<Response> => {
    return this.httpHelper.postData<Response>('updateCompanyMobile', request);
  }

  updateRegistrationNo = (request: any): Observable<Response> => {
    return this.httpHelper.postData<Response>('updateRegistrationNo', request);
  }

  updateCompanyEmail = (request: any): Observable<Response> => {
    return this.httpHelper.postData<Response>('updateCompanyEmail', request);
  }

  saveSocialMediaLinks = (request: any): Observable<Response> => {
    return this.httpHelper.postData<Response>('saveSocialMediaLinks', request);
  }

  getSocialMediaLinks = (request: any): Observable<Response> => {
    return this.httpHelper.postData<Response>('getSocialMediaLinks', request);
  }

  sendVerifyEmail = (request: any): Observable<Response> => {
    return this.httpHelper.postData<Response>('sendVerifyEmail', request);
  }

  sendVerifyMobile = (request: any): Observable<Response> => {
    return this.httpHelper.postData<Response>('sendVerifyMobile', request);
  }

  validateEmailVerificationCode = (request: any): Observable<Response> => {
    return this.httpHelper.postData<Response>('validateEmailVerificationCode', request);
  }

  validateMobileVerificationCode = (request: any): Observable<Response> => {
    return this.httpHelper.postData<Response>('validateMobileVerificationCode', request);
  }

  getCompanyVerificationProgress = (request: any): Observable<Response> => {
    return this.httpHelper.postData<Response>('getCompanyVerificationProgress', request);
  }

  getCompanyProfileProgress = (request: any): Observable<ProfileProgressModel> => {
    return this.httpHelper.postData<ProfileProgressModel>('getCompanyProfileProgress', request);
  }

  getLanguagesList = (): Observable<GetLanguagesResponse> => {
    return this.httpHelper.getData<GetLanguagesResponse>('getLanguagesList');
  }

  getCompanyDocs = (request: any): Observable<CompanyDocsModel> => {
    return this.httpHelper.postData<CompanyDocsModel>('getCompanyDocs', request);
  }

  uploadCompanyDocs = (request: any): Observable<CompanyDocsModel> => {
    return this.httpHelper.postImageData<CompanyDocsModel>('uploadCompanyDocs', request);
  }

  downloadCompanyDocs = (request: any): Observable<DocumentDownload> => {
    return this.httpHelper.postData<DocumentDownload>('downloadCompanyDocs', request);
  }

  deleteCompanyDocs = (request: any): Observable<CompanyDocsModel> => {
    return this.httpHelper.postData<CompanyDocsModel>('deleteCompanyDoc', request);
  }

  uploadCompanyLogo = (request: any): Observable<Response> => {
    return this.httpHelper.postImageData<Response>('uploadCompanyLogo', request);
  }
}
