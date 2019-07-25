import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { Room } from '../../shared/models/room.model';

@Component({
    selector: 'app-room-list',
    templateUrl: './room-list.component.html',
    styleUrls: ['./room-list.component.css'],
})
export class RoomListComponent implements OnInit, OnChanges {
    @Input() rooms: Room[];
    @Input() roomSelected: Room;
    // key = Room id, value = count of new messages
    @Input() newMessages: Map<number, number> = new Map<number, number>();
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

    getNewMessagesCountByRoom(room: Room): number {
        return this.newMessages.get(room.id);
    }
}
