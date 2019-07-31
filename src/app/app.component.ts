import { Component, OnInit } from '@angular/core';
import { Event, NavigationCancel, NavigationEnd, NavigationError, NavigationStart, Router } from '@angular/router';
import { AuthService } from './services/auth.service';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit {
    loading = true;

    constructor(private router: Router, private authService: AuthService) {
        router.events.subscribe((routerEvents: Event) => {
            this.checkRouterEvent(routerEvents);
        });
    }

    ngOnInit(): void {}

    checkRouterEvent(routerEvent: Event): void {
        if (routerEvent instanceof NavigationStart) {
            this.loading = true;
        }
        if (
            routerEvent instanceof NavigationEnd ||
            routerEvent instanceof NavigationCancel ||
            routerEvent instanceof NavigationError
        ) {
            this.loading = false;
        }
    }

    isAuthenticated(): boolean {
        return this.authService.isAuthenticated();
    }
}
