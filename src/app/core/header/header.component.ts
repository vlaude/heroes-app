import { Component, OnInit } from '@angular/core';
import { environment } from '../../../environments/environment';
import { AppState } from '../../ngxs/app.state';
import { Observable } from 'rxjs';
import { User } from '../../models/user.model';
import { Select, Store } from '@ngxs/store';
import { SignOut } from '../../ngxs/app.action';
import { LocalStorageService } from '../../services/local-storage.service';

@Component({
    selector: 'app-header',
    templateUrl: './header.component.html',
    styleUrls: ['./header.component.css'],
})
export class HeaderComponent implements OnInit {
    @Select(AppState.getCurrentUser) currentUser$: Observable<User>;
    public version: string = environment.VERSION;

    constructor(private store: Store, private localStorageService: LocalStorageService) {}

    ngOnInit() {}

    signOut() {
        this.store.dispatch(new SignOut());
    }

    isAuthenticated(): boolean {
        return this.localStorageService.isAuthenticated();
    }
}
