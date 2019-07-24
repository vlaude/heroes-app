import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';

import * as io from 'socket.io-client';
import { User } from '../models/user.model';
import { Observable } from 'rxjs';
import { Room } from '../models/room.model';
import { Message } from '../models/message.model';

@Injectable({
    providedIn: 'root',
})
export class SocketService {
    private url = environment.HEROES_API_URL;
    private socket;

    constructor() {
        this.socket = io(`${this.url}/chat`);
    }

    public sendUserConnected(user: User) {
        this.socket.emit('user-connected', user);
    }

    public sendUserDisconnected(user: User) {
        this.socket.emit('user-disconnected', user);
    }

    public joinRoom(room: Room) {
        this.socket.emit('join-room', room.name);
    }

    public leaveRoom(room: Room) {
        this.socket.emit('leave-room', room.name);
    }

    public sendMessage(message: Message) {
        this.socket.emit('new-message', message);
    }

    public getMessages = () => {
        return Observable.create(observer => {
            this.socket.on('new-message', message => {
                observer.next(message);
            });
        });
    };
}
