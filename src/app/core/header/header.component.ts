import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { User } from '../../shared/models/user.model';

@Component({
    selector: 'app-header',
    templateUrl: './header.component.html',
    styleUrls: ['./header.component.css'],
})
export class HeaderComponent implements OnInit {
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
