import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { HttpErrorResponse } from '@angular/common/http/src/response';
import { HttpHelperService } from '../../services/http-helper.service';

interface UserResponse {
  login: string;
  location: string;
  name: string;
}

class Country {
  name: string;
  population: string;
}

interface Post {
  title: string;
  body: string;
  userId: number;
  id: number;
}

@Component({
  selector: 'app-test',
  templateUrl: './test.component.html',
  styleUrls: ['./test.component.css']
})
export class TestComponent implements OnInit {

  // GET
  user: UserResponse;
  profileName: string;
  errorText: string;
  country: Country;

  // POST
  title: string;
  body: string;
  userId = 1;

  postResonse: number;
  postError: string;

  baseURL = 'http://34.241.175.223:8080/i4gorigin.seller';

  constructor(private httpHelper: HttpHelperService, private http: HttpClient) { }

  ngOnInit() {
  }

  /*  getGitProfile = (): void => {
     this.user = null;
     this.errorText = '';
     const that = this;

     this.http.get<Country>('https://restcountries.eu/rest/v2/name/india?fullText=true').subscribe(
       (data) => {
         that.country = data[0];
         console.log(data);
         console.log(that.country.population);
       },
       (error: HttpErrorResponse) => {
         this.errorText = error.statusText;
       }
     );
   } */

  getLanguagesList = (): void => {
    const url = this.baseURL + '/getLanguagesList';
    this.httpHelper.getData(url);
  }

  postDetails = (): void => {
    this.postResonse = null;
    this.postError = '';

    const postData = {
      title: this.title,
      body: this.body,
      userId: this.userId
    };

    this.http.post<Post>('https://jsonplaceholder.typicode.com/posts', postData).subscribe(
      (data) => {
        this.postResonse = data.id;
      },
      (error: HttpErrorResponse) => {
        this.postError = error.message;
      }

    );
  }

}
