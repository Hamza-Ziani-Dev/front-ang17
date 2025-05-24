import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { RestApiService } from './rest-api.service';
import { environment } from 'environments/environment.development';
import { User } from '../models/User';
import { Folder } from '../models/folder.model';

/*const auth = 'Basic ' + btoa('bmce.achraf' + ':' + 'user');
const header = new HttpHeaders(
  {Authorization: auth});
header.append('content-type', 'application/json');*/

const SEARCH_URI = environment.apiUrl + '/search';
const API_URI = environment.apiUrl;
@Injectable({
  providedIn: 'root'
})
export class RestSearchApiService {


  id;
  user: User;
  header: HttpHeaders;

  constructor(private http: HttpClient,
    private serviceU: RestApiService) {

    this.user = new User();
    this.user = serviceU.tst(this.user, JSON.parse(sessionStorage.getItem("uslog")));
    this.header = new HttpHeaders
      ({
        'content-Type': 'application/json',
      });

  }

  searchFolder(folderModel, page = 1) {

    return this.http.post(SEARCH_URI + `/folders?page=${page}&size=18`, folderModel, { headers: this.header });
  }

  saveSearch(s) {

    return this.http.post(SEARCH_URI + '/save', s, { headers: this.header });

  }


  editSearch(s) {

    return this.http.put(SEARCH_URI + '/edit', s, { headers: this.header });

  }



  searchFolderToLink(folderModel: Folder, folderid, page: number) {
    return this.http.put(API_URI + `/link/folder/${folderid}?page=${page}&size=18`, folderModel, { headers: this.header });
  }
  getFrequencySearcheq(page) {
    return this.http.get(`${SEARCH_URI}/most?page=${page}&size=6`, { headers: this.header });
  }
  getFrequencySearcheqaAttrs(id) {
    return this.http.get(`${SEARCH_URI}/most/${id}`, { headers: this.header });
  }



  searchDo(doc, page: number, size) {
    return this.http.post<Array<any>>(SEARCH_URI + "/document/?page=" + page + "&size=" + size, doc, { headers: this.header, responseType: "json" })
  }
  searchFullText(doc, page: number) {
    return this.http.post<Document[]>(SEARCH_URI + "/document/fulltext?page=" + page + "&size=12", doc, { headers: this.header, responseType: "json" })
  }
  deleteSearch(id: number) {
    return this.http.delete(SEARCH_URI + "/most/" + id, { headers: this.header, responseType: "json" })
  }
  setFoldersBydoc(id) {
    this.id = id;
  }
  getFoldersBydoc(id, page) {

    return this.http.get(environment.apiUrl + "/search/folders/" + id + "?page=" + page + "&size=6", { headers: this.header });

  }
  deleteLinks(id, folders) {
    return this.http.post(environment.apiUrl + "/link/documentFolders/" + id, folders, { headers: this.header })
  }
  getTypeName(id: number) {

    return this.http.get(environment.apiUrl + "/getTypeName/" + id, { headers: this.header })
  }



  searchFoldersToLinkWithDocument(folder: Folder, DocumentId: any, page: number) {
    return this.http.put(API_URI + `/link/document/${DocumentId}?page=${page}&size=18`, folder, { headers: this.header });

  }

  searchFolderReplace(folderModel, page = 1, id) {

    return this.http.post(SEARCH_URI + `/foldersreplace/${id}?page=${page}&size=12`, folderModel, { headers: this.header });
  }
  // SEARCH DOCS CLIENT
  searchClientDocuments(page, size) {
    return this.http.get(environment.apiUrl + `/trash/docs?page=${page}&size=${size}`, { headers: this.header });
  }
  getDocVersion(id, page, size) {
    return this.http.get(SEARCH_URI + `/documentVersion/${id}?page=${page}&size=${size}`, { headers: this.header })
  }
  getTrackedEmails(id, page, size) {
    return this.http.get(SEARCH_URI + `/emailtracked/${id}?page=${page}&size=${size}`, { headers: this.header })
  }
  deleteDocVersion(id) {
    return this.http.delete(API_URI + '/edit/delete/version/' + id, { headers: this.header })
  }
  // FIND DOC BY ID
  docbyId(id) {
    return this.http.get(SEARCH_URI + "/doc/" + id, { headers: this.header });
  }
  // COURRIER SANS ACCUSE
  courrierAccus(page, size) {
    return this.http.get(SEARCH_URI + `/courrier/?page=${page}&size=${size}`, { headers: this.header })
  }
  // LINK COURRIER ACCUSATION
  linkCourrierAccuse(doc, fol) {
    return this.http.post(API_URI + '/link/accusation/' + doc + '/' + fol, null, { headers: this.header })
  }

  getAttrsByName(name) {
    return this.http.get(API_URI + '/attrs/' + name, { headers: this.header })
  }

  // HAS ACCESS TO NAT WITH ACTION
  hasAccessTo(id, action) {
    return this.http.get(`${API_URI}/access/nature/${id}/${action}`, { headers: this.header })

  }
}
