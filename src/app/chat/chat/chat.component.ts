import { Component, OnInit } from '@angular/core';
import { Room } from '../../shared/models/room.model';
import { SocketService } from '../../services/socket.service';
import { isNullOrUndefined } from 'util';
import { distinctUntilChanged, throttleTime } from 'rxjs/operators';
import { Message } from '../../shared/models/message.model';
import { AuthService } from '../../services/auth.service';
import { User } from '../../shared/models/user.model';
import { ActivatedRoute } from '@angular/router';

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
    // key = Room id
    cache: Map<number, Message[]> = new Map<number, Message[]>();
    socketClients: any[];
    // key = Room id, value = count of new messages
    newMessagesOnOthersRooms: Map<number, number> = new Map<number, number>();

    constructor(private route: ActivatedRoute, private authService: AuthService, public socketService: SocketService) {}

    ngOnInit() {
        this.authService.currentUser$.subscribe(currentUser => {
            this.currentUser = currentUser;
            this.socketService.connect(this.currentUser.username);
            this.socketService.getClientsConnected().subscribe(clients => (this.socketClients = clients));
        });

        // Init rooms
        this.rooms = this.route.snapshot.data['rooms'];
        this.currentRoom = this.rooms.find(r => r.name.toLowerCase() === 'general');
        this.rooms.forEach(room => this.socketService.joinRoom(room));

        // Init messages
        const allMessages = this.route.snapshot.data['messages'];
        const sortedMessages = this.sortBy(allMessages, 'date');
        sortedMessages.forEach(m => this.addMessageToCache(m));
        this.messages = this.filterByRoom(sortedMessages, this.currentRoom);

        this.socketService
            .getMessages()
            .pipe(
                distinctUntilChanged(),
                throttleTime(500)
            )
            .subscribe((message: Message) => {
                if (message.room.id === this.currentRoom.id) {
                    this.messages.push(message);
                } else {
                    this.handleNewMessagesOnOthersRooms(message.room.id);
                }
                this.addMessageToCache(message);
            });
    }

    addMessageToCache(message: Message) {
        let messages = this.cache.get(message.room.id);
        if (!isNullOrUndefined(messages)) {
            messages.push(message);
        } else {
            messages = [message];
        }
        this.cache.set(message.room.id, messages);
    }

    handleRoomSelected = room => {
        this.currentRoom = room;
        const messagesCache = this.cache.get(this.currentRoom.id);
        // TODO Object.assign
        this.messages = isNullOrUndefined(messagesCache) ? [] : JSON.parse(JSON.stringify(messagesCache));
        this.newMessagesOnOthersRooms.set(this.currentRoom.id, null);
    };

    handleNewMessage = newMessage => {
        const message: Message = {
            date: new Date(),
            content: newMessage,
            poster: this.currentUser,
            room: this.currentRoom,
        };

        this.socketService.sendMessage(message);
        this.messages.push(message);
        this.addMessageToCache(message);
    };

    handleNewMessagesOnOthersRooms = roomId => {
        if (isNullOrUndefined(this.newMessagesOnOthersRooms.get(roomId))) {
            this.newMessagesOnOthersRooms.set(roomId, 1);
        } else {
            const previousCount = this.newMessagesOnOthersRooms.get(roomId);
            this.newMessagesOnOthersRooms.set(roomId, previousCount + 1);
        }
    };

    sortBy(array: any[], prop: string): any[] {
        return array.sort((a, b) => (a[prop] > b[prop] ? 1 : a[prop] === b[prop] ? 0 : -1));
    }

    filterByRoom(message: Message[], room: Room) {
        return message.filter(m => m.room.id === room.id);
    }
}
