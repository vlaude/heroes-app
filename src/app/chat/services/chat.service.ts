import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { Room } from '../../shared/models/room.model';

@Injectable({
    providedIn: 'root',
})
export class ChatService {
    private roomsUrl = `${environment.HEROES_API_URL}/api/v1/rooms`;

    constructor(private http: HttpClient) {}

    public getAllRooms = (): Observable<Room[]> => {
        return this.http.get<Room[]>(this.roomsUrl);
    };
}
