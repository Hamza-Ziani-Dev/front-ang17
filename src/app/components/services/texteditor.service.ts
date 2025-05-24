import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'environments/environment.development';

const BASE_URL =environment.apiUrl
const __header = new HttpHeaders();

@Injectable({
  providedIn: 'root'
})
export class TexteditorService {

  updateTemplates(templateId: any, arg1: { hasHeader: any; hasFooter: any; content: any; name: any; desc: any; }) {
    return this.http.put<any>(BASE_URL+"/user-template/"+templateId,arg1, {headers : __header})
  }



  getTemplates(page: number, size: number, filterIndex: string) {
   return this.http.get<any>(BASE_URL+"/user-template?page="+page+"&size="+size+"&q="+filterIndex, {headers : __header,withCredentials: true})
  }

  openTemplate(id: any) {
    return this.http.get<any>(BASE_URL+"/user-template/"+id, {headers : __header})
  }


  deleteTemplates(templateId: any) {
    return this.http.delete<any>(BASE_URL+"/user-template/"+templateId, {headers : __header})
  }



  constructor(private http:HttpClient) { }

  generatePDF (html)
  {
   return this.http.post(BASE_URL+"/print/pdf",html,{headers : __header})
  }
  generatePDFandEditSource (html,id,source)
  {
   return this.http.post(BASE_URL+"/edit/document/editor/"+id,{ html : html, source : source},{headers : __header})
  }
  getDocumentEditSource (id)
  {
   return this.http.get<any>(BASE_URL+"/edit/document/editor/"+id,{headers : __header})
  }

  saveTemplate(template)
  {
   return this.http.post(BASE_URL+"/user-template",template, {headers : __header})
  }
}
