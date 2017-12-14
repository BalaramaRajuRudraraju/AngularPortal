import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { HttpErrorResponse } from '@angular/common/http/src/response';

interface UserResponse {
  login: string;
  location: string;
  name: string;
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

  // POST
  title: string;
  body: string;
  userId = 1;

  postResonse: number;
  postError: string;

  constructor(private http: HttpClient) { }

  ngOnInit() {
  }

  getGitProfile = (): void => {
    this.user = null;
    this.errorText = '';
    this.http.get<UserResponse>('https://api.github.com/users/' + this.profileName).subscribe(
      (data) => {
        this.user = data;
        console.log(data);
      },
      (error: HttpErrorResponse) => {
        this.errorText = error.statusText;
      }
    );
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

// second changes