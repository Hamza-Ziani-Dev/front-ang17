import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'environments/environment.development';

const FOLDER_URI = environment.apiUrl + '/sharefolder';
const API_URI = environment.apiUrl;
@Injectable({
  providedIn: 'root'
})
export class ShareFoldersService {

  header: HttpHeaders;
  constructor(private http: HttpClient) {
    this.header = new HttpHeaders
      ({
        'content-Type': 'application/json',
      });
  }


  shareWithUsers(id, entities, msg) {
    const formData: FormData = new FormData();
    formData.append("entities", entities)
    formData.append("message", msg)

    return this.http.post(FOLDER_URI + `/share/${id}`, formData, { headers: this.header })
  }


  getSharedFolders(p, s) {
    return this.http.get(`${FOLDER_URI}/get/all?page=${p}&size=${s}`)
  }
  DeleteSharedFolders(id) {
    return this.http.delete(`${FOLDER_URI}/delete/${id}`, { headers: this.header })
  }
  count() {
    return this.http.get(`${FOLDER_URI}/count`)
  }
}
