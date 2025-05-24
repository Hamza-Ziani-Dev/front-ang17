import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { User } from '../models/User';
import { RestApiService } from './rest-api.service';
import { environment } from 'environments/environment.development';

@Injectable({
  providedIn: 'root'
})


export class EditDocumentService {

  docToUp: Document
  user: User
  header: HttpHeaders
  constructor(private http: HttpClient, private service: RestApiService) {

    this.user = new User();
    this.user = this.service.tst(this.user, JSON.parse(sessionStorage.getItem("uslog")))
    this.header = new HttpHeaders
      ({
        'content-Type': 'application/json',

      })
  }
  getDoc(doc: Document) {

    this.docToUp = new Document();
    this.docToUp = doc;

  }
  edit(doc) {

    return this.http.post(environment.apiUrl+"/edit/document", doc, { headers: this.header });
  }
//EDIT DOC IN PROCESS (SAVE VERSION )
editDocProcess(doc)
{

  return this.http.post(environment.apiUrl+"/edit/document/process", doc, { headers: this.header });

  }
  getUserById(id) {
    return this.http.get(environment.apiUrl + `/getuser/${id}`, { headers: this.header });
}
  delete(id: string) {
    return this.http.delete(environment.apiUrl+"/edit/delete/" + id, { headers: this.header });
  }

  deleteDocs(docs) {
    //console.log("dssfdsdsfdf")
    return this.http.post(environment.apiUrl+"/edit/delete/docs",docs , { headers: this.header });
  }
  deleteDocClt(id) {

    return this.http.delete(environment.apiUrl+"/edit/deletedocclient/" + id, { headers: this.header });
  }


  getDocClass(id: string) {

    return this.http.get(environment.apiUrl+"/edit/docID/" + id, { headers: this.header });
  }

  //HAS ACCESS TO EDIT DOCUMENT
  hasAccessToEdit(id)
  {
    return this.http.get(environment.apiUrl+"/edit/access/document/edit/" + id, { headers: this.header });

  }
  //HAS ACCESS TO DELETE DOCUMENT
  hasAccessToDelete(id)
  {
    return this.http.get(environment.apiUrl+"/edit/access/document/delete/" + id, { headers: this.header });

  }
   //HAS ACCESS TO EDIT COURRIER
   hasAccessToEditN(id)
   {
     return this.http.get(environment.apiUrl+"/edit/access/courrier/edit/" + id, { headers: this.header });

   }
   //HAS ACCESS TO DELETE COURRIER
   hasAccessToDeleteN(id)
   {
     return this.http.get(environment.apiUrl+"/edit/access/courrier/delete/" + id, { headers: this.header });

   }
}
