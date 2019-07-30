import { Conversation } from './conversation.model';

export interface User {
    id: number;
    username: string;
    email?: string;
    token?: string;
    conversations?: Conversation[];
}
