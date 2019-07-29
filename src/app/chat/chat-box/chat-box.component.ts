import { AfterViewChecked, Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { Message } from '../../shared/models/message.model';
import { Room } from '../../shared/models/room.model';
import { SocketService } from '../../services/socket.service';

@Component({
    selector: 'app-chat-box',
    templateUrl: './chat-box.component.html',
    styleUrls: ['./chat-box.component.css'],
})
export class ChatBoxComponent implements OnInit, AfterViewChecked {
    currentMessage: string;
    typer = 'henri';
    typing = false;
    timeout;
    @Input() room: Room;
    @Output() newMessage: EventEmitter<string> = new EventEmitter<string>();

    // Useful to autoscroll chat
    @ViewChild('scrollMe') private myScrollContainer: ElementRef;

    constructor(private socketService: SocketService) {}

    ngOnInit(): void {
        this.socketService.getIsTyping().subscribe(console.log);
    }

    ngAfterViewChecked(): void {
        this.scrollToBottom();
    }

    sendMessage() {
        if (this.currentMessage.trim().length === 0) {
            return;
        }
        this.newMessage.emit(this.currentMessage);
        this.currentMessage = '';
    }

    /**
     * Indique si on doit afficher le pseudonyme du posteur du message en fonction du message précédent
     * ou du temps écoulé entre deux messages.
     */
    shouldDisplayUsername(message: Message): boolean {
        const msgIndex = this.room.messages.indexOf(message);
        if (msgIndex === 0) {
            return true;
        }
        const t1 = new Date(this.room.messages[msgIndex].date).getTime();
        const t2 = new Date(this.room.messages[msgIndex - 1].date).getTime();
        const diff = Math.abs((t1 - t2) / 1000);
        // Si + de 5 minutes de différence
        if (diff > 60 * 5) {
            return true;
        }
        return this.room.messages[msgIndex].poster.username !== this.room.messages[msgIndex - 1].poster.username;
    }

    shouldDisplayDay(message: Message): boolean {
        const msgIndex = this.room.messages.indexOf(message);
        if (msgIndex === 0) {
            return true;
        }
        const start = new Date(this.room.messages[msgIndex - 1].date);
        const end = new Date(this.room.messages[msgIndex].date);
        return start.getDay() !== end.getDay();
    }

    scrollToBottom(): void {
        this.myScrollContainer.nativeElement.scrollTop = this.myScrollContainer.nativeElement.scrollHeight;
    }

    handleKeyDown(): void {
        if (!this.typing) {
            this.typing = true;
            this.socketService.sendIsTyping('machin', this.room);
            this.timeout = setTimeout(() => {
                this.typing = false;
                this.socketService.sendHasStopTyping('machin', this.room);
            }, 3000);
        } else {
            clearTimeout(this.timeout);
            this.timeout = setTimeout(() => {
                this.typing = false;
                this.socketService.sendHasStopTyping('machin', this.room);
            }, 3000);
        }
    }
}
