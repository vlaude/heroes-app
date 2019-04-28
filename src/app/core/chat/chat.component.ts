import { AfterViewChecked, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Message } from '../../models/message.model';
import { ChatService } from '../../services/chat.service';
import { Select, Store } from '@ngxs/store';
import { distinctUntilChanged, flatMap, throttleTime } from 'rxjs/operators';
import { AppState } from '../../ngxs/app.state';
import { Observable } from 'rxjs';
import { User } from '../../models/user.model';
import { isNullOrUndefined } from 'util';

@Component({
    selector: 'app-chat',
    templateUrl: './chat.component.html',
    styleUrls: ['./chat.component.css'],
})
export class ChatComponent implements OnInit, AfterViewChecked {
    @Select(AppState.getCurrentUser) user$: Observable<User>;
    newMessage: string;
    messages: Message[] = [];

    // Useful to autoscroll chat
    @ViewChild('scrollMe') private myScrollContainer: ElementRef;

    constructor(private store: Store, private chatService: ChatService) {}

    ngOnInit(): void {
        this.chatService
            .getMessagesHistory()
            .pipe(flatMap(message => message))
            .subscribe(messages => this.messages.push(messages));

        this.chatService
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
        let poster;
        this.user$.subscribe(user => {
            if (isNullOrUndefined(user)) {
                return;
            }
            poster = user.username;
            this.chatService.sendMessage({
                timeStamp: new Date(),
                message: this.newMessage,
                poster,
            });
            this.newMessage = '';
        });
    }

    scrollToBottom(): void {
        this.myScrollContainer.nativeElement.scrollTop = this.myScrollContainer.nativeElement.scrollHeight;
    }
}
