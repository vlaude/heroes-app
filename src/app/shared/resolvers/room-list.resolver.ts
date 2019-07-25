import { Observable } from 'rxjs';
import { Resolve } from '@angular/router';
import { ChatService } from '../../services/chat.service';
import { Injectable } from '@angular/core';
import { Room } from '../../models/room.model';

@Injectable()
export class RoomListResolver implements Resolve<Observable<Room[]>> {
    constructor(private chatService: ChatService) {}

    resolve(): Observable<Room[]> {
        return this.chatService.getAllRooms();
    }
}
