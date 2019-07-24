import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';

import * as io from 'socket.io-client';
import { Observable } from 'rxjs';
import { Room } from '../models/room.model';
import { Message } from '../models/message.model';

@Injectable({
    providedIn: 'root',
})
export class SocketService {
    private url = environment.HEROES_API_URL;
    private socket;

    constructor() {}

    public joinRoom(room: Room) {
        this.socket.emit('join-room', room.name);
    }

    public leaveRoom(room: Room) {
        this.socket.emit('leave-room', room.name);
    }

    public connect(username: string) {
        this.socket = io(`${this.url}/chat?username=${username}`);
    }

    public disconnect() {
        this.socket.disconnect();
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

    public getClientsConnected = () => {
        return Observable.create(observer => {
            this.socket.on('clients', socketClients => {
                observer.next(socketClients);
            });
        });
    };
}
