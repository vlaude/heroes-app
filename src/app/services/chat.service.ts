import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Message } from '../models/message.model';
import { environment } from '../../environments/environment';
import { Room } from '../models/room.model';

@Injectable({
    providedIn: 'root',
})
export class ChatService {
    private messagesUrl = `${environment.HEROES_API_URL}/api/v1/messages`;
    private roomsUrl = `${environment.HEROES_API_URL}/api/v1/rooms`;

    constructor(private http: HttpClient) {}

    public getMessagesHistory = (): Observable<Message[]> => {
        return this.http.get<Message[]>(this.messagesUrl);
    };

    public getAllRooms = (): Observable<Room[]> => {
        return this.http.get<Room[]>(this.roomsUrl);
    };
}
