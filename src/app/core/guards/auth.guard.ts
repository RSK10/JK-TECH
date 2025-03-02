/**
 * guard to protect route for logged in user only
 */
import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { Observable } from 'rxjs';

import { AuthService } from '../../service/auth.service';


@Injectable({
    providedIn: 'root'
})

export class AuthGuard implements CanActivate {

    constructor(
        private router: Router,
        private authenticationService: AuthService
    ) { }

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
        const currentUser = this.authenticationService.getLoggedInUser();
        
        if (currentUser) {
            return true;
        }
        this.router.navigate(['/login']);

        return false;
    }
}