import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'environments/environment.development';
const URL=environment.apiUrl+"/profilabs"
@Injectable({
  providedIn: 'root'
})
export class ProfilAbsenceService {
  constructor(private http: HttpClient) {

  }
  getprofilsAbs(p, s) {
    return this.http.get( URL + '?page=' + p + '&size=' + s   );
  }
  getAllUsers() {
    return this.http.get(URL + '/users');
  }
  addProfilsAbs(p) {
    return this.http.post(URL + '/add', p);
  }
  editProfilsAbs(p) {
    return this.http.post(URL + '/edit', p );
  }
}
