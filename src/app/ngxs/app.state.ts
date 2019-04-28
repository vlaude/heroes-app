import { Action, Selector, State, StateContext } from '@ngxs/store';
import { User } from '../models/user.model';
import { InitCurrentUser, SetCurrentUser } from './app.action';
import { LocalStorageService } from '../services/local-storage.service';

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
    constructor(private localStorageService: LocalStorageService) {}

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
    setCurrentUser(
        { patchState }: StateContext<AppStateModel>,
        { payload }: SetCurrentUser
    ) {
        patchState({
            currentUser: payload,
        });
        this.localStorageService.setCurrentUser(payload);
    }
}
