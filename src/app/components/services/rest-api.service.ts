import { CookieService } from 'ngx-cookie-service';
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';
import { User } from '../models/User';
import { environment } from 'environments/environment.development';


const headers  = new HttpHeaders();
headers.append("Content-Type","text/plain")

@Injectable({
    providedIn: 'root',
})
export class RestApiService {
    apiUrl = environment.apiUrl; // Base URL for API requests
    authenticated: boolean = false; // Authentication status
    us: User = new User(); // Current user object
    formG
    constructor(
        private http: HttpClient,
        private rt: Router,
        private _cookieService: CookieService
    ) {}

    // Login method to authenticate users
    public login(username: string, password: string,) {
        const header = new HttpHeaders({ Authorization: 'Basic ' + btoa(username + ':' + password), 'X-Requested-With': 'XMLHttpRequest' });
        header.append('content-type', 'application/json');
        return this.http.get(environment.apiUrl + '/uslog'
          , { headers: header, responseType: "json" });

      }

    // Check if user exists with provided credentials
    checkuser(credaintiol) {
        const header = new HttpHeaders({ 'X-Requested-With': 'XMLHttpRequest' });
        header.append('content-type', 'application/json');
        return this.http.get(environment.basicUrl + '/api/checkuser', {
          params: { code: window.btoa(credaintiol.username + ":" + credaintiol.password) },
          headers: header,
          responseType: "json"
        });
      }

    // Get secondary user details
    public getSecondaryUser(username: String, password: string) {
        const header = new HttpHeaders({ 'X-Requested-With': 'XMLHttpRequest' });
        header.append('content-type', 'application/json');
        const pass = window.btoa(password)
        return this.http.get(environment.basicUrl + `/secondary/userlogin/${username}/${pass}`
          , {
            params: { secondary: "true", code: window.btoa(username + ":" + password) },
            headers: header,
            responseType: "json"
          }
        )

      }

    // Logout method to terminate user session
    public logout() {
        return this.http.get(environment.basicUrl + "/logout", { responseType: "text" })
      }

    // Get the user's IP address
    public getIPAddress() {
        return this.http.get('http://api.ipify.org/?format=json'); // Fetch IP address
    }

    // Map response data to User object
    public tst(u: User, rs: Response) {
        try {
            // Assign response data to user object
            u.isClient = rs['isClient'];
            u._category = rs['category'];
            u._contact = rs['contact'];
            u._email = rs['email'];
            u._fullName = rs['fullName'];
            u._isValid = rs['isValid'];
            u._lastLogin = rs['lastLogin'];
            u._master = rs['master'];
            u._nomClient = rs['nomClient'];
            u._pw = rs['pw'];
            u._registrationDate = rs['registrationDate'];
            u._userId = rs['userId'];
            u._username = rs['username'];
            u.hasAccessClient = rs['hasAccessClient'];
            u.title = rs['title'];
            u.logo = rs['logo'] as string;
        } catch (error) {
            // Handle error (e.g., navigate to login if there's an issue)
            // this.rt.navigateByUrl('login');
        }
        return u; // Return updated user object
    }

    // Log client user details
    public logClient(u: User, rs: Response) {
        try {
            // Assign response data to user object
            u.isClient = rs['isClient'];
            u._category = rs['category'];
            u._contact = rs['contact'];
            u._email = rs['email'];
            u._fullName = rs['fullName'];
            u._isValid = rs['isValid'];
            u._lastLogin = rs['lastLogin'];
            u._master = rs['master'];
            u._nomClient = rs['nomClient'];
            u._pw = rs['pw'];
            u._registrationDate = rs['registrationDate'];
            u._userId = rs['userId'];
            u._username = rs['username'];
            u.logo = rs['logo'] as string;
        } catch (error) {
            // Handle error (e.g., navigate to log client page)
            // console.log(error);
            this.rt.navigate(['/logclient']);
        }
        return u; // Return updated user object
    }

    // Reset password for a given email
    resetPw(email) {
        return this.http.post(environment.apiUrl + "/resetpw", email, {
          headers: { 'Content-Type': 'application/raw' }
        })
      }

    public getFile(fid : string,canal,sid)
   {
    return this.http.get<any>((this.formG.ssl? "https"  : "http" ) +"://"+  this.formG.adresseRest +`/rest/v1/file/${fid}?c=${canal}&s=${sid}`,{headers : headers});
   }
}
