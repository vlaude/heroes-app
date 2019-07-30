import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';

import * as io from 'socket.io-client';
import { Observable } from 'rxjs';
import { Room } from '../shared/models/room.model';
import { Message } from '../shared/models/message.model';
import { User } from '../shared/models/user.model';

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

    public isConnected() {
        return this.socket && this.socket.connected;
    }

    public sendMessage(message: Message) {
        this.socket.emit('new-message', message);
    }

    public sendRoomRead(user: User, room: Room) {
        this.socket.emit('room-read', { userId: user.id, roomId: room.id });
    }

    public sendIsTyping(username: string, room: Room) {
        this.socket.emit('is-typing', { username, room });
    }

    public sendHasStopTyping(username: string, room: Room) {
        this.socket.emit('stop-typing', { username, room });
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

    public getIsTyping = () => {
        return Observable.create(observer => {
            this.socket.on('is-typing', username => {
                observer.next(username);
            });
        });
    };
}
