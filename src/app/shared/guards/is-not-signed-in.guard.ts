import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Injectable({
    providedIn: 'root',
})
export class IsNotSignedInGuard implements CanActivate {
    constructor(private authService: AuthService, private router: Router) {}

    canActivate(next: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
        const isSignedIn = this.authService.isAuthenticated();

        if (isSignedIn) {
            this.router.navigate(['/home']);
        }

        return !isSignedIn;
    }
}
