
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Subject } from 'rxjs/Subject';

import { User } from './user.model';
import { AuthData } from './auth-data.model';

@Injectable()
export class AuthService {
    authChange = new Subject<boolean>();
    private user: User;

    constructor(private router: Router) {

    }

    // This method should be called when the user signs up
    registerUser(authData: AuthData) {
        this.user = {
            email: authData.email,
            userId: Math.round(Math.random() * 100000).toString()
        }       

        // Notify user logged in and redirect it
        this.authSuccessfully();
    }

    login(authData: AuthData) {
        this.user = {
            email: authData.email,
            userId: Math.round(Math.random() * 100000).toString()
        }

        // Notify user logged in and redirect it        
        this.authSuccessfully();
    }

    logout() {
        this.user = null;
        this.authChange.next(false);
        this.router.navigate(['/login']);
    }

    getUser() {
        // return this.user; this would return a reference and then the user could be modified directly.
        // we don't want that!
        return { ...this.user }; // we spread the properties of the user object store in the services 
                                // into this new object. This will break the reference and return a 
                                // brand new user that has the same properties but it is a different 
                                // object
    }

    isAuth() {
        return this.user != null;
    }

    // To factor in repetitive code 
    private authSuccessfully() {        
        this.authChange.next(true);
        this.router.navigate(['/training']);
    }

}