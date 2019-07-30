import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Credentials } from '../shared/models/credentials.model';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { LocalStorageService } from './local-storage.service';
import { User } from '../shared/models/user.model';
import { isNullOrUndefined } from 'util';
import { SocketService } from './socket.service';

@Injectable({
    providedIn: 'root',
})
export class AuthService {
    url = `${environment.HEROES_API_URL}/api/v1`;

    private currentUserSubject: BehaviorSubject<User>;
    public currentUser$: Observable<User>;

    constructor(
        private http: HttpClient,
        private localStorageService: LocalStorageService,
        private socketService: SocketService
    ) {
        this.currentUserSubject = new BehaviorSubject<User>(this.localStorageService.getCurrentUser());
        this.currentUser$ = this.currentUserSubject.asObservable();
    }

    public get currentUserValue(): User {
        return this.currentUserSubject.value;
    }

    login(credentials: Credentials): Observable<User> {
        return this.http.post<any>(`${this.url}/login`, credentials).pipe(
            map(response => {
                let user: User;
                if (response.token && response.profile) {
                    user = response.profile;
                    user.token = response.token;
                    this.localStorageService.setCurrentUser(user);
                    this.currentUserSubject.next(user);
                }
                return user;
            })
        );
    }

    logout() {
        if (this.socketService.isConnected()) {
            this.socketService.disconnect();
        }
        this.localStorageService.logout();
        this.currentUserSubject.next(null);
    }

    getToken(): string {
        return isNullOrUndefined(this.currentUserValue) ? '' : this.currentUserValue.token;
    }

    isAuthenticated(): boolean {
        return !isNullOrUndefined(this.currentUserValue);
    }
}
