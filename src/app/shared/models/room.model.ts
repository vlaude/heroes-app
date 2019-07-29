import { Message } from './message.model';

export interface Room {
    id: number;
    name: string;
    iconPath?: string;
    messages: Message[];
}
