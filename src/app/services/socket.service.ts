import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';

import * as io from 'socket.io-client';
import { User } from '../models/user.model';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root',
})
export class SocketService {
    private url = environment.HEROES_API_URL;
    private socket;

    constructor() {
        this.socket = io(this.url);
    }

    public sendUserConnected(user: User) {
        this.socket.emit('user-connected', user);
    }

    public sendUserDisconnected(user: User) {
        this.socket.emit('user-disconnected', user);
    }

    public sendMessage(message) {
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
