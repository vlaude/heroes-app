import { Injectable } from '@angular/core';
import { User } from '../shared/models/user.model';

@Injectable({
    providedIn: 'root',
})
export class LocalStorageService {
    constructor() {}

    setCurrentUser(user: User) {
        localStorage.setItem('currentUser', JSON.stringify(user));
    }

    getCurrentUser(): User {
        return JSON.parse(localStorage.getItem('currentUser'));
    }

    logout() {
        localStorage.removeItem('currentUser');
    }
}
