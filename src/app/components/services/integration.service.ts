import { BehaviorSubject, Observable } from 'rxjs';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'environments/environment.development';

@Injectable({
  providedIn: 'root'
})
export class IntegrationService {

  header: HttpHeaders;
  status = '';
  progress = 0
  state: BehaviorSubject<String>;
  stateProgress: BehaviorSubject<number>;
  constructor(private http: HttpClient) {
    this.header = new HttpHeaders({
      'content-Type': 'application/json',
    });
    this.state = new BehaviorSubject(this.status);
    this.stateProgress = new BehaviorSubject(this.progress);
  }


  switch() {
    this.state.next(this.status);
  }

  switchProgress() {
    this.stateProgress.next(this.progress);
  }

  checkOrder(name) {
    return this.http.get(environment.apiUrl + `/integration/order/${name}`, {
      headers: this.header,
    });
  }

  importChaine(cread) {
    return this.http.post(environment.apiUrl + `/integration/chaine`, cread, {
      headers: this.header,
      reportProgress: true,
      observe: 'events',
    });
  }
  importAttrs(cread) {
    return this.http.post(environment.apiUrl + `/integration/attribute`, cread, {
      headers: this.header,
      reportProgress: true,
      observe: 'events',
    });
  }
  importDocType(cread) {
    return this.http.post(environment.apiUrl + `/integration/docType`, cread, {
      headers: this.header,
      reportProgress: true,
      observe: 'events',
    });
  }
  tst(): Observable<any> {
    return this.http.get(environment.apiUrl + `/integration/tst`, {
      headers: this.header,
      reportProgress: true,
      observe: 'events',
    });
  }
}
