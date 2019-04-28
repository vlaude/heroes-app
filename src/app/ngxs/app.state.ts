import { Action, Selector, State, StateContext } from '@ngxs/store';
import { User } from '../models/user.model';
import { InitCurrentUser, SetCurrentUser, SignOut } from './app.action';
import { LocalStorageService } from '../services/local-storage.service';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

export class AppStateModel {
    currentUser: User;
}

@State<AppStateModel>({
    name: 'app',
    defaults: {
        currentUser: null,
    },
})
export class AppState {
    constructor(
        private localStorageService: LocalStorageService,
        private router: Router,
        private toastr: ToastrService
    ) {}

    @Selector()
    static getCurrentUser(state: AppStateModel) {
        return state.currentUser;
    }

    @Action(InitCurrentUser)
    initCurrentUser({ setState }: StateContext<AppStateModel>) {
        if (!this.localStorageService.isAuthenticated()) {
            console.log('not authenticated');
            return;
        }
        setState({
            currentUser: this.localStorageService.getCurrentUser(),
        });
    }

    @Action(SetCurrentUser)
    setCurrentUser({ patchState }: StateContext<AppStateModel>, { payload }: SetCurrentUser) {
        patchState({
            currentUser: payload,
        });
        this.localStorageService.setCurrentUser(payload);
    }

    @Action(SignOut)
    signOut({ patchState }: StateContext<AppStateModel>) {
        this.localStorageService.signOut();
        this.router.navigate(['login']);
        this.toastr.info('You are logged out');
        patchState({
            currentUser: null,
        });
    }
}
