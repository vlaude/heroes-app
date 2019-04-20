import { Action, Selector, State, StateContext } from '@ngxs/store';
import { SetUsername } from '../app.action';

export class AppStateModel {
    username: string;
}

@State<AppStateModel>({
    name: 'app',
    defaults: {
        username: 'visitor',
    },
})
export class AppState {
    @Selector()
    static getUsername(state: AppStateModel) {
        return state.username;
    }

    @Action(SetUsername)
    setUsername(
        { patchState }: StateContext<AppStateModel>,
        { payload }: SetUsername
    ) {
        patchState({
            username: payload,
        });
    }
}
