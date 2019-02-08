import { Component, OnInit } from '@angular/core';
import { ChatService } from './services/chat.service';

import { distinctUntilChanged, flatMap, throttleTime } from 'rxjs/operators';
import { Message } from './models/message';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  message: string;
  messages: Message[] = [];

  constructor(private chatService: ChatService) {}

  sendMessage() {
    this.chatService.sendMessage({ timeStamp: new Date(), message: this.message });
    this.message = '';
  }

  ngOnInit(): void {
    this.chatService.getMessagesHistory().pipe(
      flatMap((message) => message)
    ).subscribe(messages => this.messages.push(messages));

    this.chatService
      .getMessages().pipe(
      distinctUntilChanged(),
      // filter((message: string) => message.trim().length > 0),
      throttleTime(500),
    ).subscribe((message: Message) => {
      this.messages.push(message);
    });
  }

}
