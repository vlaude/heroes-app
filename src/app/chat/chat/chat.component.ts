import { Component, OnInit } from '@angular/core';
import { Room } from '../../shared/models/room.model';
import { SocketService } from '../../services/socket.service';
import { distinctUntilChanged, throttleTime } from 'rxjs/operators';
import { Message } from '../../shared/models/message.model';
import { AuthService } from '../../services/auth.service';
import { User } from '../../shared/models/user.model';
import { ActivatedRoute } from '@angular/router';
import { Title } from '@angular/platform-browser';

@Component({
    selector: 'app-chat',
    templateUrl: './chat.component.html',
    styleUrls: ['./chat.component.css'],
})
export class ChatComponent implements OnInit {
    currentUser: User;
    rooms: Room[] = [];
    currentRoom: Room;
    messages: Message[] = [];
    socketClients: any[];

    constructor(
        private route: ActivatedRoute,
        private authService: AuthService,
        public socketService: SocketService,
        public titleService: Title
    ) {}

    ngOnInit() {
        this.authService.currentUser$.subscribe(currentUser => {
            this.currentUser = currentUser;
            this.socketService.connect(this.currentUser.username);
            this.socketService.getClientsConnected().subscribe(clients => (this.socketClients = clients));
        });

        this.rooms = this.route.snapshot.data.rooms;
        this.currentRoom = this.rooms.find(r => r.name.toLowerCase() === 'general');
        this.rooms.forEach(room => {
            this.socketService.joinRoom(room);
            room.messages = this.sortBy(room.messages, 'date');
        });

        this.socketService
            .getMessages()
            .pipe(
                distinctUntilChanged(),
                throttleTime(500)
            )
            .subscribe((message: Message) => {
                this.addMessageToRoom(message);
                // this.titleService.setTitle('(¤) ' + this.titleService.getTitle());
            });
    }

    addMessageToRoom(message: Message) {
        this.rooms.forEach(room => {
            if (room.id === message.room.id) {
                room.messages.push(message);
            }
        });
    }

    handleRoomSelected = room => {
        this.currentRoom = room;
    };

    handleNewMessage = newMessage => {
        const message: Message = {
            date: new Date(),
            content: newMessage,
            poster: this.currentUser,
            room: {
                id: this.currentRoom.id,
                name: this.currentRoom.name,
                messages: [],
            },
        };

        this.socketService.sendMessage(message);
        this.addMessageToRoom(message);
    };

    sortBy(array: any[], prop: string): any[] {
        return array.sort((a, b) => (a[prop] > b[prop] ? 1 : a[prop] === b[prop] ? 0 : -1));
    }
}
