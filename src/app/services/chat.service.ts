import { Injectable } from '@angular/core';
import * as io from 'socket.io-client';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Message } from '../models/message.model';
import { environment } from '../../environments/environment';

@Injectable({
    providedIn: 'root',
})
export class ChatService {
    private url = `${environment.HEROES_API_URL}/api/v1/messages`;
    private socket;

    constructor(private http: HttpClient) {
        // TODO Adapter url
        this.socket = io(environment.HEROES_API_URL);
    }

    public sendMessage(message) {
        this.socket.emit('new-message', message);
    }

    public getMessagesHistory = (): Observable<Message[]> => {
        return this.http.get<Message[]>(this.url);
    };

    public getMessages = () => {
        return Observable.create(observer => {
            this.socket.on('new-message', message => {
                observer.next(message);
            });
        });
    };
}
