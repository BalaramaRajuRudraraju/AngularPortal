import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { Observer } from 'rxjs/Observer';

import { AuthCookiesHandlerService } from './auth-cookies-handler.service';
import { CookieService } from 'ngx-cookie-service';
import { environment } from '../../environments/environment';
import { SessionManagerService } from './session-manager.service';
import { Response } from '../models/response.model';


@Injectable()
export class HttpHelperService {

  constructor(private http: HttpClient, private cookieService: AuthCookiesHandlerService, private cookies: CookieService,
    private sessionManger: SessionManagerService) { }

  getData = <T>(service: string): Observable<T> => {
    return Observable.create((observer: Observer<T>) => {
      const url = environment.sellerApiUrl + service;
      this.http.get<T>(url, { headers: this.getJWTokenAuth() }).subscribe(
        (reponseData) => {
          console.log(reponseData);
          observer.next(reponseData);
          observer.complete();
        },
        (error: any) => {
          console.log('Error: ' + error);
          if (error.status === 500 && error.message === 'Token Expired') {
            this.sessionManger.triggerSessionExpired();
          } else {
            observer.error(error);
          }
        }
      );
    });
  }

  postData = <T>(service: string, data: any): Observable<T> => {
    return Observable.create((observer: Observer<T>) => {
      const url = environment.sellerApiUrl + service;
      this.http.post<T>(url, data, { headers: this.getJWTokenAuth() }).subscribe(
        (responseData) => {
          console.log(responseData);
          observer.next(responseData);
          observer.complete();
        },
        (error: Response) => {
          console.log(error);
          if (error.  status === 500 && error.message === 'Token Expired') {
            this.sessionManger.triggerSessionExpired();
          } else {
            observer.error(error);
          }
        }
      );
    });
  }

  postImageData = <T>(service: string, data: any): Observable<T> => {
    return Observable.create((observer: Observer<T>) => {
      const url = environment.sellerApiUrl + service;
      this.http.post<T>(url, data, { headers: this.getImageJWTokenAuth() }).subscribe(
        (responseData) => {
          console.log(responseData);
          observer.next(responseData);
          observer.complete();
        },
        (error: Response) => {
          console.log(error);
          if (error.status === 500 && error.message === 'Token Expired') {
            this.sessionManger.triggerSessionExpired();
          } else {
            observer.error(error);
          }
        }
      );
    });
  }

  getBase64Authentication = (): string => {
    const userName = 'raju';
    const password = 'raju';
    return btoa(userName + ':' + password);
  }

  getJWToken = (): string => {
    return this.cookies.get('access_token');
  }

  getBasicAuth = (): any => {
    return new HttpHeaders().set('Content-Type', 'application/json')
      .set('Authorization', 'Basic ' + this.getBase64Authentication());
  }

  getJWTokenAuth = (): HttpHeaders => {
    return new HttpHeaders().set('Content-Type', 'application/json')
      .set('x-auth-token', this.cookies.get('i4g_auth_access_token'));
  }

  getImageJWTokenAuth = (): HttpHeaders => {
    return new HttpHeaders().set('x-auth-token', this.cookies.get('i4g_auth_access_token'));
  }

  getImageBasicAuth = (): any => {
    return new HttpHeaders()
      .set('Authorization', 'Basic ' + this.getBase64Authentication());
  }

  onFileUpload = (fileUploadEvent: Event, doc: Document) => {
    let base64Data: string;
    const fileList = (<HTMLInputElement>fileUploadEvent.target).files;
    if (fileList && fileList.length > 0) {
      if (fileList[0]) {
        const reader = new FileReader();
        reader.readAsDataURL(fileList[0]);
        reader.onload = function (e) {
          base64Data = reader.result;
        };
      }
    }
  }

  getBase64Image(img: HTMLImageElement) {
    const canvas = document.createElement('canvas');
    canvas.width = img.width;
    canvas.height = img.height;
    const ctx = canvas.getContext('2d');
    ctx.drawImage(img, 0, 0);
    const dataURL = canvas.toDataURL('image/jpg');
    return dataURL;
  }


  // Subscribe to the returned observer to get the base 64 data.
  getBase64ImageFromURL(url: string): Observable<string> {
    return Observable.create((observer: Observer<string>) => {
      const img = new Image();
      img.src = url;
      if (!img.complete) {
        img.onload = () => {
          observer.next(this.getBase64Image(img));
          observer.complete();
        };
        img.onerror = (err) => {
          observer.error(err);
        };
      } else {
        observer.next(this.getBase64Image(img));
        observer.complete();
      }
    });
  }

  /*   getDownload = () => {
      const contentType = 'image/png';
      const b64Data = 'iVBORw0KGgoAAAANSUhEUgAAAAUAAAAFCAYAAACNbyblAAAAHElEQVQI12P4//8/w38GIAXDIBKE0DHxgljNBAAO9TXL0Y4OHwAAAABJRU5ErkJggg==';
      const blob = this.b64toBlob(b64Data, contentType);
      const blobUrl = URL.createObjectURL(blob);
    } */

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


  getBlolFromByteArray = (byteArray): void => {
    const blob = new Blob([byteArray], { type: 'image/png' });
    const url = URL.createObjectURL(blob);
    window.open(url);
  }

  /*  saveByteArray = () => {
     let a = document.createElement('a');
     document.body.appendChild(a);
     return function (data, name) {
       const blob = new Blob(data, { type: 'image/png' }),
         url = window.URL.createObjectURL(blob);
       a.href = url;
       a.download = name;
       a.click();
       window.URL.revokeObjectURL(url);
     };
   }()); */

}
