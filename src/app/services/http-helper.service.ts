import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { Observer } from 'rxjs/Observer';

interface Country {
  name: string;
  population: string;
}

@Injectable()
export class HttpHelperService {

  constructor(private http: HttpClient) { }

  getData = (url: string): void => {
    this.http.get(url).subscribe(
      (responseData) => {
        console.log(responseData);
      },
      (error: HttpErrorResponse) => {
        console.log(error);
      }
    );
  }

  postData = (url: string, data: any): void => {
    this.http.post(url, data).subscribe(
      (responseData) => {
        console.log(responseData);
      },
      (error: HttpErrorResponse) => {
        console.log(error);
      }
    );
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
}
