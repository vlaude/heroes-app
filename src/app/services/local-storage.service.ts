import { Injectable } from '@angular/core';
import { User } from '../models/user.model';
import { isNullOrUndefined } from 'util';

@Injectable({
    providedIn: 'root',
})
export class LocalStorageService {
    constructor() {}

    setCurrentUser(user: User) {
        localStorage.setItem('user', JSON.stringify(user));
    }

    getCurrentUser(): User {
        return JSON.parse(localStorage.getItem('user'));
    }

    setToken(token: string) {
        localStorage.setItem('token', token);
    }

    isAuthenticated(): boolean {
        return !isNullOrUndefined(this.getCurrentUser());
    }

    signOut() {
        localStorage.clear();
    }
}
