import { Action, Selector, State, StateContext } from '@ngxs/store';
import { User } from '../models/user.model';
import { SetCurrentUser } from './app.action';

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
    @Selector()
    static getCurrentUser(state: AppStateModel) {
        return state.currentUser;
    }

    @Action(SetCurrentUser)
    setUsername(
        { patchState }: StateContext<AppStateModel>,
        { payload }: SetCurrentUser
    ) {
        patchState({
            currentUser: payload,
        });
    }
}
