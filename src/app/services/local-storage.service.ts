import { Injectable } from '@angular/core';
import { User } from '../shared/models/user.model';

@Injectable({
    providedIn: 'root',
})
export class LocalStorageService {
    constructor() {}

    static setCurrentUser(user: User) {
        localStorage.setItem('currentUser', JSON.stringify(user));
    }

    static getCurrentUser(): User {
        return JSON.parse(localStorage.getItem('currentUser'));
    }

    static logout() {
        localStorage.removeItem('currentUser');
    }
}
