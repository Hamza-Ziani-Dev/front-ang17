import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'environments/environment.development';
const apiURL = environment.apiUrl+"/document-head-foot"
const HEADES = new HttpHeaders({
  "content-type" : "application/json"
})
@Injectable({
  providedIn: 'root'
})


export class DocHeaderFooterService {

  constructor(private http: HttpClient) { }


  getDocumentHeaderAndFooter()
  {
   return this.http.get(apiURL,{headers : HEADES});
  }


  getDocumentHeader()
  {
   return this.http.get<any>(apiURL+"/header",{headers : HEADES});
  }

  getDocumentFooter()
  {
   return this.http.get<any>(apiURL+"/footer",{headers : HEADES});
  }

  putDocumentheader(newHtml)
  {
   return this.http.put(apiURL+"/header",newHtml,{headers : HEADES});
  }

  putDocumentFooter(newHtml)
  {
   return this.http.put(apiURL+"/footer",newHtml,{headers : HEADES});

  }
}
