import { Component, Input, OnInit } from '@angular/core';

@Component({
    selector: 'app-conn-list',
    templateUrl: './conn-list.component.html',
    styleUrls: ['./conn-list.component.css'],
})
export class ConnListComponent implements OnInit {
    @Input() socketClients: any[];

    constructor() {}

    ngOnInit() {}
}
