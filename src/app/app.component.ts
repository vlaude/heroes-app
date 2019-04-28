import { Component, OnInit } from '@angular/core';

import { Store } from '@ngxs/store';
import { InitCurrentUser } from './ngxs/app.action';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit {
    constructor(private store: Store) {}

    ngOnInit(): void {
        this.store.dispatch(new InitCurrentUser());
    }
}
