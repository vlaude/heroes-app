import { AfterViewChecked, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Message } from '../../models/message.model';
import { ChatService } from '../../services/chat.service';
import { Store } from '@ngxs/store';
import { distinctUntilChanged, flatMap, throttleTime } from 'rxjs/operators';
import { User } from '../../models/user.model';
import { AuthService } from '../../services/auth.service';
import { SocketService } from '../../services/socket.service';

@Component({
    selector: 'app-chat',
    templateUrl: './chat.component.html',
    styleUrls: ['./chat.component.css'],
})
export class ChatComponent implements OnInit, AfterViewChecked {
    currentUser: User;
    newMessage: string;
    messages: Message[] = [];

    // Useful to autoscroll chat
    @ViewChild('scrollMe') private myScrollContainer: ElementRef;

    constructor(
        private store: Store,
        private authService: AuthService,
        private chatService: ChatService,
        private socketService: SocketService
    ) {
        this.authService.currentUser$.subscribe(currentUser => (this.currentUser = currentUser));
    }

    ngOnInit(): void {
        this.chatService
            .getMessagesHistory()
            .pipe(flatMap(message$ => message$))
            .subscribe(message => this.messages.push(message));

        this.socketService
            .getMessages()
            .pipe(
                distinctUntilChanged(),
                // filter((message: string) => message.trim().length > 0),
                throttleTime(500)
            )
            .subscribe((message: Message) => {
                this.messages.push(message);
            });
    }

    ngAfterViewChecked(): void {
        this.scrollToBottom();
    }

    sendMessage() {
        if (this.newMessage.trim().length === 0) {
            return;
        }
        const poster = this.currentUser;
        this.socketService.sendMessage({
            timeStamp: new Date(),
            message: this.newMessage,
            poster,
        });
        this.newMessage = '';
    }

    /**
     * Indique si on doit afficher le pseudonyme du posteur du message en fonction du message précédent
     * ou du temps écoulé entre deux messages.
     */
    shouldDisplayUsername(message: Message): boolean {
        const msgIndex = this.messages.indexOf(message);
        if (msgIndex === 0) {
            return true;
        }
        const t1 = new Date(this.messages[msgIndex].timeStamp).getTime();
        const t2 = new Date(this.messages[msgIndex - 1].timeStamp).getTime();
        const diff = Math.abs((t1 - t2) / 1000);
        // Si + de 5 minutes de différence
        if (diff > 60 * 5) {
            return true;
        }
        return this.messages[msgIndex].poster.username !== this.messages[msgIndex - 1].poster.username;
    }

    scrollToBottom(): void {
        this.myScrollContainer.nativeElement.scrollTop = this.myScrollContainer.nativeElement.scrollHeight;
    }
}
