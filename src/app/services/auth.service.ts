import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Credentials } from '../models/credentials.model';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root',
})
export class AuthService {
    url = `${environment.HEROES_API_URL}/api/v1/auth`;

    constructor(private http: HttpClient) {}

    login(credentials: Credentials): Observable<any> {
        return this.http.post(`${this.url}/login`, credentials);
    }
}
