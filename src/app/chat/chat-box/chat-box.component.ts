import { AfterViewChecked, Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { Message } from '../../shared/models/message.model';
import { Room } from '../../shared/models/room.model';
import { SocketService } from '../../services/socket.service';
import Giphy from 'giphy-api';
import { environment } from '../../../environments/environment.prod';

@Component({
    selector: 'app-chat-box',
    templateUrl: './chat-box.component.html',
    styleUrls: ['./chat-box.component.css'],
})
export class ChatBoxComponent implements OnInit, AfterViewChecked {
    currentMessage: string;

    giphy;
    displayGiphyBox = false;
    giphySearchTerm = '';
    giphyResults = [];
    giphyLoader = false;

    @Input() room: Room;
    @Output() newMessage: EventEmitter<string> = new EventEmitter<string>();
    @Output() newGif: EventEmitter<string> = new EventEmitter<string>();
    @Output() inputFocus: EventEmitter<any> = new EventEmitter<any>();

    // Useful to autoscroll chat
    @ViewChild('scrollMe') private myScrollContainer: ElementRef;

    constructor(private socketService: SocketService) {}

    ngOnInit(): void {
        this.socketService.getIsTyping().subscribe(console.log);
        this.giphy = Giphy({
            https: environment.production
        });
        this.loadDefaultGifs();
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

    sendGif(gif) {
        this.toggleGiphySearch();
        this.newGif.emit(gif.images.original.url);
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

    /**
     * Indique si on doit afficher le jour au dessus du message.
     * On l'affiche si c'est le premier message du jour.
     */
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

    // handleKeyDown(): void {
    //     if (!this.typing) {
    //         this.typing = true;
    //         this.socketService.sendIsTyping('machin', this.room);
    //         this.timeout = setTimeout(() => {
    //             this.typing = false;
    //             this.socketService.sendHasStopTyping('machin', this.room);
    //         }, 3000);
    //     } else {
    //         clearTimeout(this.timeout);
    //         this.timeout = setTimeout(() => {
    //             this.typing = false;
    //             this.socketService.sendHasStopTyping('machin', this.room);
    //         }, 3000);
    //     }
    // }

    emitInputFocus() {
        this.inputFocus.emit();
    }

    toggleGiphySearch() {
        this.displayGiphyBox = !this.displayGiphyBox;
        if (!this.displayGiphyBox) {
            this.loadDefaultGifs();
            this.giphySearchTerm = '';
        }
    }

    loadDefaultGifs() {
        this.giphy.trending().then(res => (this.giphyResults = res.data));
    }

    searchGif(searchTerm) {
        this.giphyLoader = true;
        this.giphyResults = [];
        this.giphy
            .search({
                limit: 25,
                q: searchTerm,
            })
            .then(res => {
                this.giphyLoader = false;
                this.giphyResults = res.data;
            })
            .catch(error => console.log(error));
    }
}
