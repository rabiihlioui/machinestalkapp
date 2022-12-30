import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiResponse } from '../interface/api-response';
import { Page } from '../interface/page';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private readonly serverUrl: string = 'http://localhost:8080';

  constructor(private http: HttpClient) { }

  // Make call to the backend API to retrieve page of users
  users$ = (gender: string = '', status: string= '', page: number = 0):Observable<ApiResponse<Page>>  =>
    this.http.get<any>(`${this.serverUrl}/users?gender=${gender}&status=${status}&page=${page}`);
}
