import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Injectable({
    providedIn: 'root',
})
export class IsSignedInGuard implements CanActivate {
    constructor(private authService: AuthService, private router: Router) {}

    canActivate(next: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
        const isSignedIn = this.authService.isAuthenticated();

        if (isSignedIn) {
            return true;
        }

        this.router.navigate(['/login']);
        return false;
    }
}
