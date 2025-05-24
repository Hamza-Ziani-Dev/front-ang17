import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { User } from '../models/User';
import { RestApiService } from './rest-api.service';
import { environment } from 'environments/environment.development';


const header = new HttpHeaders();

@Injectable({
  providedIn: 'root'
})


export class ViewerService {


  user:User;
  headers:HttpHeaders
  constructor(private http: HttpClient, private serviceU: RestApiService) {
    this.user = new User();
    this.user = serviceU.tst(this.user, JSON.parse(sessionStorage.getItem("uslog")));

    this.headers = new HttpHeaders
      ({
        'content-Type': 'application/json',
      });




  }


  getFile(DocumentId): Observable<Blob> {
    let uri = environment.apiUrl+ environment.apiUrl+'//files/';

    return this.http.get(uri+DocumentId, { responseType: 'blob', headers: this.headers });

  }

  getFileToView(DocumentId: string) {
    let uri = environment.apiUrl+'/files/view/';
    return this.http.get(uri + DocumentId, { headers: this.headers });
  }

  downloadFile(DocumentId: string) {
    let uri = environment.apiUrl + '/files/download/';
    return this.http.get(uri + DocumentId, { headers: this.headers });
  }

  downloadFileArchive(document: any): Observable<any> {
    let uri = environment.apiUrl + '/archive/files/download';
    return this.http.post(uri, document, { responseType: 'blob' }).pipe(map((response) => {
      return {
        filename: document.name,
        contentType: document.contentType,
        data: response
      };
    }));
  }
  downloadFileArchiveArrive(document: any): Observable<any> {
    let uri = environment.apiUrl + '/archive/files/download/arrive';
    return this.http.post(uri, document)
  }
  zipfiles(docs)
  {
   return this.http.post(environment.apiUrl+"/add/down", docs,{ headers: this.headers, responseType: 'blob', observe: 'response' })
  }
  getFileVersion(DocumentId)
  {
    return this.http.get(environment.apiUrl+"/documentVersion/" + DocumentId, { headers:this.headers });
  }
  zipAndSave(docs,sec,pw)
  {
    return this.http.post(environment.apiUrl+`/save/zip/${sec}/${pw}`,docs,{ headers:this.headers })
  }
  public getPDF(): Observable<Blob> {
    //const options = { responseType: 'blob' }; there is no use of this
    let uri = '/my/uri';
    // this.http refers to HttpClient. Note here that you cannot use the generic get<Blob> as it does not compile: instead you "choose" the appropriate API in this way.
    return this.http.get(uri, { responseType: 'blob' });
  }
}
