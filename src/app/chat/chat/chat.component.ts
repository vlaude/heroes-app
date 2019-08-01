import { Component, OnDestroy, OnInit } from '@angular/core';
import { Room } from '../../shared/models/room.model';
import { SocketService } from '../../services/socket.service';
import { distinctUntilChanged, takeUntil, throttleTime } from 'rxjs/operators';
import { Message } from '../../shared/models/message.model';
import { AuthService } from '../../services/auth.service';
import { User } from '../../shared/models/user.model';
import { ActivatedRoute } from '@angular/router';
import { Title } from '@angular/platform-browser';
import { UserService } from '../../services/user.service';
import { isNullOrUndefined } from 'util';
import { Subject } from 'rxjs';

@Component({
    selector: 'app-chat',
    templateUrl: './chat.component.html',
    styleUrls: ['./chat.component.css'],
})
export class ChatComponent implements OnInit, OnDestroy {
    currentUser: User;
    rooms: Room[] = [];
    currentRoom: Room;
    socketClients: any[];

    private unsubscribe: Subject<void> = new Subject();

    constructor(
        private route: ActivatedRoute,
        private authService: AuthService,
        private userService: UserService,
        public socketService: SocketService,
        public titleService: Title
    ) {}

    ngOnInit() {
        // Get current user, his conversations, and other connected users.
        this.currentUser = this.authService.currentUserValue;
        // TODO Resolver for this
        this.userService
            .getUserConversations(this.currentUser.id)
            .pipe(takeUntil(this.unsubscribe))
            .subscribe(conversations => {
                this.currentUser.conversations = conversations;
            });
        this.socketService.connect(this.currentUser.username);
        this.socketService.getClientsConnected().subscribe(clients => (this.socketClients = clients));
        // Init the rooms.
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
                throttleTime(250)
            )
            .subscribe((message: Message) => {
                this.addMessageToRoom(message);
                this.markAsNoread(message.room);
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
        this.markAsRead(room);
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

    handleNewGif = gif => {
        const message: Message = {
            date: new Date(),
            content: '',
            poster: this.currentUser,
            room: {
                id: this.currentRoom.id,
                name: this.currentRoom.name,
                messages: [],
            },
            attachment: gif,
        };

        this.socketService.sendMessage(message);
        this.addMessageToRoom(message);
    };

    handleInputFocus() {
        this.markAsRead(this.currentRoom);
    }

    markAsNoread = (room: Room) => {
        this.currentUser.conversations.find(conv => conv.roomId === room.id).isRead = false;
        this.titleService.setTitle('( ❗ ) ' + this.titleService.getTitle());
    };

    markAsRead = (room: Room) => {
        const c = this.currentUser.conversations.find(conv => conv.roomId === room.id);
        if (!c.isRead) {
            c.isRead = true;
            this.socketService.sendRoomRead(this.currentUser, this.currentRoom);
        }

        if (isNullOrUndefined(this.currentUser.conversations.find(conv => conv.isRead === false))) {
            this.titleService.setTitle('Heroes');
        }
    };

    sortBy(array: any[], prop: string): any[] {
        return array.sort((a, b) => (a[prop] > b[prop] ? 1 : a[prop] === b[prop] ? 0 : -1));
    }

    ngOnDestroy(): void {
        this.unsubscribe.next();
        this.unsubscribe.complete();
    }
}
