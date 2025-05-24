import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, map } from 'rxjs';
import { User } from '../../models/User';
import { environment } from 'environments/environment.development';

@Injectable({
    providedIn: 'root',
})
export class AuthService {
    apiUrl = environment.apiUrl;
    USER_NAME_SESSION_ATTRIBUTE_NAME = 'authenticatedUser';
    private currentUserSubject: BehaviorSubject<any> = new BehaviorSubject<any>(null);
    public currentUser = this.currentUserSubject.asObservable();  // To expose as an observable


    public username: String;
    public password: String;
    public role = 'zssss';

    constructor(private http: HttpClient) {
        // Check if the user is already logged in from sessionStorage
        const user = JSON.parse(sessionStorage.getItem('uslog') || 'null');
        this.currentUserSubject.next(user);  // Initialize with the current session user (if any)
    }



  authenticationService(username: string, password: string) {
    return this.http.get(`${this.apiUrl}/uslog`, {
        headers: {
            authorization: this.createBasicAuthToken(username, password),
            'X-Requested-With': 'XMLHttpRequest',
        },
    })
    .pipe(
        map((res: any) => {
            // Store user information in a user object
            const user = {
                username: username,
                password: password,
                role: res['master'], // Assuming 'master' is the role returned from the API
            };


            // Register successful login (you might want to move this to a separate method)
            this.registerSuccessfulLogin(username, password, res['master']);

            // Save user data in sessionStorage
            sessionStorage.setItem('uslog', JSON.stringify(user)); // Save user to session
            this.currentUserSubject.next(user);  // Emit new user in BehaviorSubject


        })
    );
}


    createBasicAuthToken(username: String, password?: String) {
        return 'Basic ' + window.btoa(username + ':' + password);
    }

    registerSuccessfulLogin(username, password, r) {
        this.role = r;
        if (r == null) {
            sessionStorage.setItem('ms', '_852');
        } else {
            sessionStorage.setItem('ms', '_741');
        }
        //console.log(r)
        sessionStorage.setItem(this.USER_NAME_SESSION_ATTRIBUTE_NAME, username);
        sessionStorage.setItem('auth',this.createBasicAuthToken(username, password)
        );
        // sessionStorage.setItem("uslog", JSON.stringify(user));
    }

    logout() {
        sessionStorage.removeItem('uslog'); // Clear sessionStorage
        this.currentUserSubject.next(null);  // Emit null for logged-out state
        localStorage.clear();
        sessionStorage.clear();
        sessionStorage.removeItem(this.USER_NAME_SESSION_ATTRIBUTE_NAME);
        this.username = null;
        this.password = null;
    }

    isUserLoggedIn() {
        let user = sessionStorage.getItem(
            this.USER_NAME_SESSION_ATTRIBUTE_NAME
        );
        if (user === null) return false;
        return true;
    }

    getLoggedInUserName() {
        let user = sessionStorage.getItem(
            this.USER_NAME_SESSION_ATTRIBUTE_NAME
        );
        if (user === null) return '';
        return user;
    }
    isValid(uname) {
        return this.http.get(`${this.apiUrl}/public/validity/check/` + uname);
    }
    getuser() {
        return this.http.get<User>(`${this.apiUrl}/api/getuser`);
    }

}
