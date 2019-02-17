import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { RegisterUser } from '../models/register-user.model';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private url = 'http://localhost:3000';

  constructor(private http: HttpClient) { }

  registerUser(user: RegisterUser): Observable<any> {
    return this.http.post(`${this.url}/api/v1/users`, user);
  }
}
