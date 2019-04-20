import {
    AfterViewChecked,
    Component,
    ElementRef,
    OnInit,
    ViewChild,
} from '@angular/core';
import { ChatService } from './services/chat.service';

import { distinctUntilChanged, flatMap, throttleTime } from 'rxjs/operators';
import { Message } from './models/message.model';
import { Select, Store } from '@ngxs/store';
import { AppState } from './state/app.state';
import { Observable } from 'rxjs';
import { SetUsername } from './app.action';
import * as $ from 'jquery';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit, AfterViewChecked {
    @Select(AppState.getUsername) username$: Observable<string>;
    username: string;
    message: string;
    messages: Message[] = [];

    @ViewChild('scrollMe') private myScrollContainer: ElementRef;

    constructor(private store: Store, private chatService: ChatService) {}

    sendMessage() {
        if (this.message.trim().length === 0) {
            return;
        }
        let poster;
        this.username$.subscribe(username => {
            poster = username;
            this.chatService.sendMessage({
                timeStamp: new Date(),
                message: this.message,
                poster,
            });
            this.username = '';
            this.message = '';
        });
    }

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

    changeUsername() {
        this.store.dispatch(new SetUsername(this.username));
        this.username = '';
        $('.dropdown-toggle').click();
    }

    ngAfterViewChecked(): void {
        this.scrollToBottom();
    }

    scrollToBottom(): void {
        this.myScrollContainer.nativeElement.scrollTop = this.myScrollContainer.nativeElement.scrollHeight;
    }
}
