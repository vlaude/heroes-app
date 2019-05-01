import { Component, OnInit } from '@angular/core';
import { environment } from '../../../environments/environment';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { User } from '../../models/user.model';

@Component({
    selector: 'app-header',
    templateUrl: './header.component.html',
    styleUrls: ['./header.component.css'],
})
export class HeaderComponent implements OnInit {
    public version: string = environment.VERSION;
    currentUser: User;

    constructor(private authService: AuthService, private router: Router) {
        this.authService.currentUser$.subscribe(currentUser => (this.currentUser = currentUser));
    }

    ngOnInit() {}

    logout() {
        this.authService.logout();
        this.router.navigate(['login']);
    }
}
