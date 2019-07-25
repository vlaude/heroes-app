import { Observable } from 'rxjs';
import { Resolve } from '@angular/router';
import { Message } from '../../models/message.model';
import { ChatService } from '../../services/chat.service';
import { Injectable } from '@angular/core';

@Injectable()
export class ChatBoxResolver implements Resolve<Observable<Message[]>> {
    constructor(private chatService: ChatService) {}

    resolve(): Observable<Message[]> {
        return this.chatService.getMessagesHistory();
    }
}
