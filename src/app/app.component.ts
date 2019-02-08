import { Component, OnInit } from '@angular/core';
import { ChatService } from './services/chat.service';

import { distinctUntilChanged, filter, scan, throttleTime } from 'rxjs/operators';
import * as moment from 'moment';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  message: string;
  messages: string[] = [];

  constructor(private chatService: ChatService) {}

  sendMessage() {
    this.chatService.sendMessage(this.message);
    this.message = '';
  }

  ngOnInit(): void {
    this.chatService
      .getMessages().pipe(
      distinctUntilChanged(),
      // filter((message: string) => message.trim().length > 0),
      throttleTime(500),
    ).subscribe((message: string) => {
      const currentTime = moment().format('hh:mm:ss a');
      const messageWithTimestamp = `${currentTime}: ${message}`;
      this.messages.push(messageWithTimestamp);
    });
  }

}
