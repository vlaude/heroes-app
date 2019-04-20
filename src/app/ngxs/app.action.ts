import { User } from '../models/user.model';

export class SetCurrentUser {
    static readonly type = '[CURRENT_USER] Set';
    constructor(public payload: User) {}
}
