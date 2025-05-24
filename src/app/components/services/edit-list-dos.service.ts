import { Injectable } from '@angular/core';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import { RestApiService } from './rest-api.service';
import { User } from '../models/User';
import { environment } from 'environments/environment.development';
import { FolderType } from '../models/FolderType.model';

@Injectable({
  providedIn: 'root'
})
export class EditListDosService {
  user = new User();
  header: HttpHeaders;
  constructor(private http: HttpClient, servU: RestApiService) {

    this.user = servU.tst(this.user, JSON.parse(sessionStorage.getItem("uslog")));
    this.header = new HttpHeaders
      ({
        'content-Type': 'application/json'
      })
  }
  getlist() {
    return this.http.get(environment.apiUrl+"/foldersType", { headers: this.header });
  }
  getAll() {
    return this.http.get(environment.apiUrl+"/allfolderstype", { headers: this.header });
  }
  addFolderType(foldersType: FolderType) {
    return this.http.post(environment.apiUrl+"/folderType", JSON.parse(JSON.stringify(foldersType)), { headers: this.header });

  }
  deleteFoltype(id: number) {
    return this.http.delete(environment.apiUrl+"/delete/" + id, { headers: this.header });
  }

  addType(foldersType: FolderType) {
    return this.http.put(environment.apiUrl+"/addTypeF", foldersType, { headers: this.header })
  }
  getmylist(i) {
    return this.http.get(environment.apiUrl+"/getFol?page=" + i + "&size=12", { headers: this.header });
  }
  //delete folder type **MASTER**
  deleteType(id)
  {
    return this.http.delete(environment.apiUrl+"/deletefoldertype/"+id,{headers:this.header});
  }
  //EDIT DOCUMENT TYPE
  editfolderType(ft)
  {
    return this.http.put(environment.apiUrl+"/editfoldertype",ft,{headers:this.header})
  }
  //EDIT LEVEL OF FOLDER TYPE 1 OR 0
  editlevel(id,etat)
  {
    return this.http.put(environment.apiUrl+"/editlevel/"+id,etat,{headers:this.header})
  }


  //RECUP Les arbo d'un utilisateur
  getArbo(page,size)
  {
    return this.http.get(environment.apiUrl+"/arborescence/getall?page=" + page + "&size="+size,{headers:this.header})
  }
  // CREATE ARBO
  addArbo(name)
  {


    return this.http.post(environment.apiUrl+'/arborescence/',name,{headers:this.header});
  }
  // CREATE ARBO DETAILS (Folders and folders childs)
  addArboDetails(l)
  {
    return this.http.post(environment.apiUrl+'/arborescence/structure',l,{headers:this.header})
  }
  //LINK FOLDER TYPE WITH ARBO
  linkArboFolder(idArbo,idFolder)
  {
    return this.http.post(environment.apiUrl+'/arborescence/linkarboft/'+idArbo,idFolder,{headers:this.header})
    //
  }
  // EDIT STRUCT OF AUTO NUM
  editFolderNum(params,id)
  {
    return this.http.post(environment.apiUrl+'/type/autoref/'+id,params,{headers:this.header})
  }

  editStateSeq(id,state)
  {
    return this.http.get(environment.apiUrl+'/autoref/state/'+id+"/"+state,{headers:this.header})
  }

  initSeq(id)
  {
    return this.http.get(environment.apiUrl+'/autoref/init/'+id,{headers:this.header})
  }

}
