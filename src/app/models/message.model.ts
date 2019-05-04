import { User } from './user.model';

export interface Message {
    timeStamp?: Date;
    message: string;
    poster: User;
}
