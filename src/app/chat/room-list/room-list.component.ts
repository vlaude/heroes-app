import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { Room } from '../../shared/models/room.model';
import { Conversation } from '../../shared/models/conversation.model';

@Component({
    selector: 'app-room-list',
    templateUrl: './room-list.component.html',
    styleUrls: ['./room-list.component.css'],
})
export class RoomListComponent implements OnInit, OnChanges {
    @Input() rooms: Room[];
    @Input() roomSelected: Room;
    @Input() conversations: Conversation[];
    @Output() newRoomSelected = new EventEmitter<Room>();

    constructor() {}

    ngOnInit() {}

    ngOnChanges(changes: SimpleChanges): void {}

    onRoomSelect = room => {
        this.newRoomSelected.emit(room);
    };

    sortRoomsBy(prop: string) {
        return this.rooms.sort((a, b) => (a[prop] > b[prop] ? 1 : a[prop] === b[prop] ? 0 : -1));
    }

    isRoomReaded = (room: Room) => {
        return this.conversations.find(conv => conv.roomId === room.id).isRead;
    };
}
