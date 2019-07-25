import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { RegisterUser } from '../shared/models/register-user.model';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
    providedIn: 'root',
})
export class UserService {
    private url = `${environment.HEROES_API_URL}/api/v1/users`;

    constructor(private http: HttpClient) {}

    registerUser(user: RegisterUser): Observable<any> {
        return this.http.post(this.url, user);
    }
}
