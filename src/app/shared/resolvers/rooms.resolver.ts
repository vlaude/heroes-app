import { Observable } from 'rxjs';
import { Resolve } from '@angular/router';
import { ChatService } from '../../chat/services/chat.service';
import { Injectable } from '@angular/core';
import { Room } from '../models/room.model';

@Injectable()
export class RoomsResolver implements Resolve<Observable<Room[]>> {
    constructor(private chatService: ChatService) {}

    resolve(): Observable<Room[]> {
        return this.chatService.getAllRooms();
    }
}
