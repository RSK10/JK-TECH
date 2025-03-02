/**
 * prevent login page when authenticated
 */
import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';

import { AuthService } from '../../service/auth.service';


@Injectable({ providedIn: 'root' })
export class LoginGuard implements CanActivate {
    constructor(
        private router: Router,
        private authenticationService: AuthService
    ) { }

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
        const currentUser = this.authenticationService.getLoggedInUser();
        console.log("loginguard current user", currentUser);

        if (!currentUser) {
            return true;
        }
        this.router.navigate(['']);
        return false;
    }
}