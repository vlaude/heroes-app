import { Injectable } from '@angular/core';
import * as io from 'socket.io-client';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Message } from '../models/message.model';

@Injectable({
    providedIn: 'root',
})
export class ChatService {
    private url = 'http://localhost:3000';
    private socket;

    constructor(private http: HttpClient) {
        this.socket = io(this.url);
    }

    public sendMessage(message) {
        this.socket.emit('new-message', message);
    }

    public getMessagesHistory = (): Observable<Message[]> => {
        return this.http.get<Message[]>(`${this.url}/api/v1/messages`);
    };

    public getMessages = () => {
        return Observable.create(observer => {
            this.socket.on('new-message', message => {
                observer.next(message);
            });
        });
    };
}
