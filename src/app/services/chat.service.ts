import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Message } from '../models/message.model';
import { environment } from '../../environments/environment';

@Injectable({
    providedIn: 'root',
})
export class ChatService {
    private url = `${environment.HEROES_API_URL}/api/v1/messages`;

    constructor(private http: HttpClient) {}

    public getMessagesHistory = (): Observable<Message[]> => {
        return this.http.get<Message[]>(this.url);
    };
}
