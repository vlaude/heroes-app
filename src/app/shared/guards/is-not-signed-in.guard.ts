import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot } from '@angular/router';
import { LocalStorageService } from '../../services/local-storage.service';

@Injectable({
    providedIn: 'root',
})
export class IsNotSignedInGuard implements CanActivate {
    constructor(private localStorageService: LocalStorageService, private router: Router) {}

    canActivate(next: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
        const isSignedIn = this.localStorageService.isAuthenticated();

        if (isSignedIn) {
            this.router.navigate(['/home']);
        }

        return !isSignedIn;
    }
}
