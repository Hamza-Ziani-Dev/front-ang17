// Importing necessary Angular modules, HTTP classes, and services for the service functionality
import { Attribute, Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { RestApiService } from './rest-api.service';
import { environment } from 'environments/environment.development';
import { Observable } from 'rxjs';
import { User } from '../models/User';
import { DocTypCat } from '../models/doc-typ-cat';
import { Attributes } from '../models/attrributes.model';

// Injectable decorator to allow dependency injection for the service
@Injectable({
  providedIn: 'root',
})
export class EditListDocService {
    user = new User();
    header: HttpHeaders;

    // Constructor with dependency injection
    constructor(private http: HttpClient, servU: RestApiService) {
      this.user = servU.tst(
        this.user,
        JSON.parse(sessionStorage.getItem('uslog'))
      );
      this.header = new HttpHeaders({
        'Content-Type': 'application/json',
      });
    }

  // Adds a new lot of documents
  PostNewLot(lot: any) {
    return this.http.post<any>(environment.apiUrl + '/bulkadd/new', lot);
  }

  // Enables automatic numbering for a group
  enableAutoNum(goupId: any) {
    return this.http.get<any>(
      environment.apiUrl + '/elementtypegroup/' + goupId + "/enableautonum", { headers: this.header }
    );
  }

  // Disables automatic numbering for a group
  disableAutoNum(goupId: any) {
    return this.http.get<any>(
      environment.apiUrl + '/elementtypegroup/' + goupId + "/disableautonum", { headers: this.header }
    );
  }

  // Resets the numbering for a group
  reset(goupId: any) {
    return this.http.get<any>(
      environment.apiUrl + '/elementtypegroup/' + goupId + "/init", { headers: this.header }
    );
  }

  // Fetches paginated list of all element groups
  getAllElementsGroups(page: any, size: any, q = "") {
    return this.http.get<any>(
      environment.apiUrl + '/elementtypegroup?page=' + page + "&size=" + size + "&q=" + q, { headers: this.header }
    );
  }

  // Fetches paginated list of all destinations
  getAllDest(page: any, size: any, q = "") {
    return this.http.get<any>(
      environment.apiUrl + '/destsearch?page=' + page + "&size=" + size + "&q=" + q, { headers: this.header }
    );
  }

  /**
   * Fetches all element groups without pagination.
   */
  getAllElementsGroupsWithoutPage(): Observable<any> {
    return this.http.get<any>(`${environment.apiUrl}/elementtypegroup/withoutpage`, { headers: this.header });
  }

  // Fetches common attributes for a specific element group
  getElementsGroupCommonAttrs(goupId: any) {
    return this.http.get<any>(
      environment.apiUrl + '/elementtypegroup/' + goupId + "/commonattrs", { headers: this.header }
    );
  }

  // Adds automatic numbering to a group
  addGroupAutoNum(g: { attrs: string; cattrs: string; order: string; text: any; sep: any; isCattrs: boolean; }, goupId: any) {
    return null;
  }

  // Fetches a list of document types with no group assigned
  getlistNoGroup() {
    return this.http.get(environment.apiUrl + '/docstypenogroup', { headers: this.header });
  }

  // Deletes a specific element group
  deleteElementGroup(goupId: any) {
    return this.http.delete<any>(
      environment.apiUrl + '/elementtypegroup/' + goupId, { headers: this.header }
    );
  }

  // Updates an existing element group
  updateElementGroup(g: any) {
    return this.http.post(
      environment.apiUrl + '/elementtypegroup/update', g, { headers: this.header }
    );
  }

  // Adds a new element group
  addElementsGroup(group: any) {
    return this.http.post(
      environment.apiUrl + '/elementtypegroup', group, { headers: this.header }
    );
  }



  // Fetches all document types
  getAll() {
    return this.http.get(environment.apiUrl + '/alldoctype', { headers: this.header });
  }

  // Adds a new document type
  addType(docT: DocTypCat) {
    return this.http.post(
      environment.apiUrl + '/adddoctype', JSON.parse(JSON.stringify(docT)), { headers: this.header }
    );
  }

  // Deletes a document type by its ID
  delete(id: number) {
    return this.http.delete(environment.apiUrl + '/deleteD/' + id, { headers: this.header });
  }

  // Fetches all document type attributes
  getType() {
    return this.http.get(environment.apiUrl + '/typeattr', { headers: this.header });
  }

  // Adds a new attribute to a document type
  addAttribute(attr: Attributes) {
    return this.http.put(environment.apiUrl + '/add/attribute', attr, { headers: this.header });
  }

  // Fetches all attributes
  getAttributes() {
    return this.http.get(environment.apiUrl + '/attributes', { headers: this.header });
  }

  // Adds a new document type with custom attributes
  newDocType(map: any, doctype: any) {
    var p = map;
    p[p.length] = {
      key: doctype.name,
      libelle: doctype.libelle,
      value: 0,
      visible: 0,
    };
    return this.http.put(environment.apiUrl + '/addTypeD', p, { headers: this.header });
  }

  // Fetches attributes for a specific document type by ID
  getAttrType(id: number) {
    return this.http.get(environment.apiUrl + '/getAttrsType/' + id, { headers: this.header });
  }

  // Fetches a list of document types with filtering action
  getlist(action: string = "all") {
    let params = new HttpParams().set("action", action);
    return this.http.get<any[]>(environment.apiUrl + '/docstype', { params: params, headers: this.header });
  }

  // Fetches paginated list of document types by search query
  getmylist(page: number, q: string) {
    return this.http.get(
      environment.apiUrl + '/docType?page=' + page + '&size=12' + "&q=" + q, { headers: this.header }
    );
  }

  // Deletes a document type by its ID
  deleteType(id: number) {
    return this.http.delete(environment.apiUrl + '/deletedocumenttype/' + id, { headers: this.header });
  }

  // Edits a document type by adding a new attribute
  editDocumentType(id: number, name: string, libelle: string, ar: any) {
    return this.http.put(
      environment.apiUrl + '/editDocumenttype/' + id + '/' + name + '/' + libelle, ar, { headers: this.header }
    );
  }

  // Sets the version of a document type
  editVersion(id: number, etat: any) {
    return this.http.post(
      environment.apiUrl + '/documenttype/setversion/' + id + '/' + etat, null, { headers: this.header }
    );
  }

  // Resets all document types
  resetDocsType() {
    return this.http.get(
      environment.apiUrl + '/doctypes/reset', { headers: this.header }
    );
  }
}
