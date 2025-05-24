import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { RestApiService } from './rest-api.service';
import { environment } from 'environments/environment.development';
import { ResultComponent } from '../dialogs/result/result.component';
import { MatDialog } from '@angular/material/dialog';
import { Contact } from '../models/contact.model';
import { User } from '../models/User';
import { userContact } from '../models/userContact.model';


@Injectable({
  providedIn: 'root'
})
export class EditUserServiceService {
  contact = new Contact();
  user = new User();
  dataArray: Array<string> = new Array();
  header: HttpHeaders;

  constructor(
    private http: HttpClient,
    private serviceU: RestApiService,
    private dialog: MatDialog
  ) {
    this.getUs(); // Fetch user data on service initialization
    this.header = new HttpHeaders({
      'Accept': 'application/json' // Set default headers for API requests
    });
  }

  // Fetch contact information for a specific user
  public findContact(user: User) {
    return this.http.get(environment.apiUrl + "/update/contactUser/" + user._contact, { headers: this.header, responseType: "json" });
  }

  // Map response data to Contact model
  getCont(ct: Contact, rs: Response) {
    ct = new Contact();
    ct.city = rs["city"];
    ct.fax = rs["fax"];
    ct.gsm = rs["gsm"];
    ct.id = rs["id"];
    ct.state = rs["state"];
    ct.zip = rs["zip"];
    return ct;
  }

  // Update user information
  public updateUser(user: userContact) {
    const header = new HttpHeaders({
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    });

    this.http.put(environment.apiUrl + "/update/up", JSON.parse(JSON.stringify(user)), { headers: header })
      .subscribe(
        resp => {
          sessionStorage.setItem("uslog", JSON.stringify(resp)); // Store updated user data in session storage
        }, (err) => console.log(err)
      );
  }

  // Add a new user
  public addUser(userCont, s, mat) {
    this.getUs(); // Refresh user data
    const header = new HttpHeaders({
      'Accept': 'application/json'
    });

    return this.http.post(environment.apiUrl + "/add/user/" + s + "/" + mat, userCont, { headers: header });
  }

  // Fetch current user data from session storage
  getUs() {
    this.user = this.serviceU.tst(this.user, JSON.parse(sessionStorage.getItem("uslog")));
  }

  // Get the user's profile image
  getUserImage() {
    const header = new HttpHeaders({
      'Content-Type': 'text/plain;charset=UTF-8'
    });
    return this.http.get(environment.apiUrl + "/user/profile/img", { headers: header });
  }

  // Update the user's profile image
  updateUserImage(formData) {
    return this.http.post(environment.apiUrl + '/user/profile', formData, { headers: this.header });
  }

  // Edit the user's logo
  editlogo(fileBase64, name: string) {
    this.dataArray = new Array();
    this.dataArray.push(name);
    this.dataArray.push(fileBase64);

    this.http.post(environment.apiUrl + "/uplg", this.dataArray, { headers: this.header }).subscribe(resp => {
      sessionStorage.setItem("uslog", JSON.stringify(resp));
      localStorage.setItem("lg", fileBase64);

      // Open a dialog to show success message
      const dialogRef = this.dialog.open(ResultComponent, {
        disableClose: true,
        data: {
          title: 'Success',
          text: 'Modifier avec Success',
          etat: 1
        },
        width: '400px',
        autoFocus: false,
      });

      dialogRef.afterClosed().subscribe(result => {
        console.log('The dialog was closed'); // Log when the dialog is closed
      });
      window.location.reload(); // Reload the page to reflect changes
    });
  }

  // Get a paginated list of users
  getUsers(p) {
    return this.http.get(environment.apiUrl + "/users?page=" + p + "&size=3", { headers: this.header });
  }

  // Get all users
  getAllUsers() {
    return this.http.get(environment.apiUrl + "/users", { headers: this.header });
  }

  // Delete a user by ID
  deleteUser(id: number) {
    return this.http.delete(environment.apiUrl + "/delete/user/" + id, { headers: this.header });
  }

  // Send an email with a document
  sendmail(mail) {
    return this.http.post(environment.apiUrl + "/api/sendmail/document", mail, { headers: this.header });
  }

  // Check if a file exists by ID
  checkIfExist(id) {
    return this.http.get(environment.apiUrl + '/api/file/zip/' + id, { headers: this.header });
  }

  // Send an email with a zipped document
  sendmailZip(mail, id) {
    return this.http.post(environment.apiUrl + "/api/sendmail/documents/" + id, mail, { headers: this.header });
  }

  // Edit user access state
  editEtat(id, etat) {
    return this.http.post(environment.apiUrl + "/edit/access/user/" + id + "/" + etat, null, { headers: this.header });
  }

  // Edit user secondary access state
  editSec(id, etat) {
    return this.http.post(environment.apiUrl + "/edit/accessec/user/" + id + "/" + etat, null, { headers: this.header });
  }

  // Get all user groups
  getUsersGroups() {
    return this.http.get(environment.apiUrl + "/api/getusers", { headers: this.header });
  }

  // Share a document with a message
  shareDocument(id, message, list) {
    return this.http.post(environment.apiUrl + "/api/sharedoc/" + id + "/" + message, list, { headers: this.header });
  }

  // Get messages for the connected user with pagination
  getUserMessage(p, s) {
    return this.http.get(environment.apiUrl + "/api/getMessage/user?page=" + p + "&size=" + s, { headers: this.header });
  }

  // Get all documents shared with the connected user
  getAllDocumentsAndReceiversUsers(p, s, q) {
    return this.http.get(`${environment.apiUrl}/api/getAllDocumentsPartager/user?page=${p}&size=${s}&q=${q}`, { headers: this.header });
  }

  // Get the count of messages for the user
  getCountMessage() {
    return this.http.get(environment.apiUrl + "/api/getmessage/count", { headers: this.header });
  }

  // Mark a message as seen
  seenMessage(id) {
    return this.http.post(environment.apiUrl + "/api/seen/message", id, { headers: this.header });
  }

  // Get all users without secondary access
  getAllUsersWithoutSecondary() {
    return this.http.get<Array<User>>(environment.apiUrl + "/secondary/users", { headers: this.header });
  }

  // Get secondary user details
  getSecondaryUser() {
    return this.http.get<User>(environment.apiUrl + "/secondary/user", { headers: this.header });
  }
}
