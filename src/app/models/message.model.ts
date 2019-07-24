import { User } from './user.model';
import { Room } from './room.model';

export interface Message {
    date?: Date;
    content: string;
    poster: User;
    room: Room;
}
