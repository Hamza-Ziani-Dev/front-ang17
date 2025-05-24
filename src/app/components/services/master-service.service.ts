import { Injectable } from '@angular/core';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import { RestApiService } from './rest-api.service';
import { User } from '../models/User';
import { environment } from 'environments/environment.development';
const API_URI = environment.apiUrl + '/master/security/';
@Injectable({
  providedIn: 'root',
})
export class MasterServiceService {
  header: HttpHeaders;
  user: User;

  constructor(private http: HttpClient, private serviceU: RestApiService) {
    this.user = new User();
    this.user = serviceU.tst(
      this.user,
      JSON.parse(sessionStorage.getItem('uslog'))
    );
    this.header = new HttpHeaders({
      'content-Type': 'application/json',
    });
  }
  addPermission(perm) {
    return this.http.post(API_URI + `privilege/add`, perm, {
      headers: this.header,
    });
  }

  addPermissionNature(perm) {
    return this.http.post(API_URI + `privilege/nature/add`, perm, {
      headers: this.header,
    });
  }
  //get permission docs pagination
  getPermsDoc(p, s, q) {
    return this.http.get(
      environment.apiUrl + `/permision?page=${p}&size=${s}&q=${q}`,
      { headers: this.header }
    );
  }
  getPermsNat(p, s, q) {
    return this.http.get(
      environment.apiUrl + `/permision/nat?page=${p}&size=${s}&q=${q}`,
      { headers: this.header }
    );
  }
  getDocsTypePerm(id) {
    return this.http.get(
      environment.apiUrl + `/permission/documenttype/${id}`,
      { headers: this.header }
    );
  }
  getPermNat(id) {
    return this.http.get(environment.apiUrl + `/permission/nature/${id}`, {
      headers: this.header,
    });
  }
  editPermissionDoc(perm) {
    return this.http.post(API_URI + `privilege/doc/edit`, perm, {
      headers: this.header,
    });
  }
  deletePermissionDoc(id) {
    return this.http.delete(API_URI + `privilege/doc/delete/${id}`, {
      headers: this.header,
    });
  }
  editPermissionNat(perm) {
    return this.http.post(API_URI + `privilege/nat/edit`, perm, {
      headers: this.header,
    });
  }
  deletePermissionNat(id) {
    return this.http.delete(API_URI + `privilege/nat/delete/${id}`, {
      headers: this.header,
    });
  }

  getPermission() {
    return this.http.get(API_URI + 'getPermission', { headers: this.header });
  }
  getPermissionNature() {
    return this.http.get(API_URI + 'getPermission/nature', {
      headers: this.header,
    });
  }
  addGroup(group) {
    return this.http.post(API_URI + `group/add`, group, {
      headers: this.header,
    });
  }
  findStepsById(id) {
    return this.http.get(environment.apiUrl + '/process/steps/' + id, {
      headers: this.header,
    });
  }
  getStepsById(id) {
    return this.http.get<any[]>(environment.apiUrl + `/courrier/${id}/steps`, {
      headers: this.header,
    });
  }
  getGroups(p, s, q) {
    return this.http.get(API_URI + 'getGroups?page=' + p + '&size=' + s + '&q=' + q, {
      headers: this.header,
    });
  }
  getNat(p, s, q) {
    return this.http.get(
      environment.apiUrl + '/api/nat?page=' + p + '&size=' + s + "&q=" + q,
      { headers: this.header }
    );
  }
  editGroup(group) {
    return this.http.post(API_URI + 'group/edit', group, {
      headers: this.header,
    });
  }
  getAllProcess() {
    return this.http.get(environment.apiUrl + '/api/process', {
      headers: this.header,
    });
  }

  getJournal(p, s, dd, df) {
    return this.http.get(
      environment.apiUrl +
        '/api/journal/getall/' +
        dd +
        '/' +
        df +
        '?page=' +
        p +
        '&size=' +
        s,
      { headers: this.header }
    );
    // return this.http.get(environment.apiUrl+"/api/process",{headers:this.header})
  }
  deleteGroup(id) {
    return this.http.delete(API_URI + 'group/delete/' + id, {
      headers: this.header,
    });
  }
  addNature(n) {
    return this.http.post(environment.apiUrl + '/api/nature/add', n, {
      headers: this.header,
    });
  }
  editNature(n) {
    return this.http.post(environment.apiUrl + '/api/nature/edit', n, {
      headers: this.header,
    });
  }
  deleteNature(n) {
    return this.http.delete(environment.apiUrl + '/api/nature/delete/' + n, {
      headers: this.header,
    });
  }
  getAllUsers() {
    return this.http.get(environment.apiUrl + '/api/getusersmaster', {
      headers: this.header,
    });
  }
  addProfilsAbs(p) {
    return this.http.post(environment.apiUrl + '/api/profilsabsence/add', p, {
      headers: this.header,
    });
  }
  editProfilsAbs(p) {
    return this.http.post(environment.apiUrl + '/api/profilabs/edit', p, {
      headers: this.header,
    });
  }
  deleteProfilsAbs(p) {
    return this.http.delete(environment.apiUrl + '/api/profilabs/delete/' + p, {
      headers: this.header,
    });
  }
  getprofilsAbs(p, s) {
    return this.http.get(
      environment.apiUrl + '/api/profilsabsence?page=' + p + '&size=' + s,
      { headers: this.header }
    );
  }
  addNotifMail(s) {
    return this.http.post(environment.apiUrl + '/api/notifmail/add', s, {
      headers: this.header,
    });
  }
  // /api/delaymail/add
  addDelayMail(s) {
    return this.http.post(environment.apiUrl + '/api/delaymail/add', s, {
      headers: this.header,
    });
  }
  getDelayMail() {
    return this.http.get(environment.apiUrl + '/api/settings/delaymail', {
      headers: this.header,
    });
  }
  getMailConfig() {
    return this.http.get(environment.apiUrl + '/api/settings/notifmail', {
      headers: this.header,
    });
  }
  editJournal(i) {
    return this.http.get(environment.apiUrl + '/api/journal/edit/' + i, {
      headers: this.header,
    });
  }

  //  Rubrique destinataire
  getDest(p) {
    // return this.http.get(environment.apiUrl+"/api/journal/edit/"+i,{headers:this.header})
    return this.http.get(
      environment.apiUrl + '/api/receivers' + '?page=' + p + '&size=12',
      { headers: this.header }
    );
  }

  getDestWithoutPage() {
    // return this.http.get(environment.apiUrl+"/api/journal/edit/"+i,{headers:this.header})
    return this.http.get<any[]>(
      environment.apiUrl + '/api/allreceivers',
      { headers: this.header }
    );
  }

  addDest(form) {
    return this.http.post(environment.apiUrl + '/api/receiver/add', form, {
      headers: this.header,
    });
  }
  editDest(id, form) {
    return this.http.post(
      environment.apiUrl + '/api/receiver/edit/' + id, form,
      { headers: this.header }
    );
  }
  deleteDest(id) {
    return this.http.get(environment.apiUrl + '/api/receiver/delete/' + id, {
      headers: this.header,
    });
  }
  // rubrique emetteur
  getSenders(p, q) {
    // return this.http.get(environment.apiUrl+"/api/journal/edit/"+i,{headers:this.header})
    return this.http.get(
      environment.apiUrl + '/api/senders' + '?page=' + p + '&size=12' + '&q=' + q,
      { headers: this.header }
    );
  }
  addSender(form) {
    return this.http.post(environment.apiUrl + '/api/sender/add', form, {
      headers: this.header,
    });
  }
  editSender(id, form) {
    return this.http.post(
      environment.apiUrl + '/api/sender/edit/' + id, form,
      { headers: this.header }
    );
  }
  deleteSender(id) {
    return this.http.get(environment.apiUrl + '/api/sender/delete/' + id, {
      headers: this.header,
    });
  }

  // RUBRIQUE LDAP

  // check if config exist
  checkConfigLdap() {
    return this.http.get(environment.apiUrl + `/api/ldap/check`);
  }
  // add or edit config
  configLdap(p) {
    return this.http.post(environment.apiUrl + `/api/ldap/setup/`, p);
  }
  // get users
  getUsersFromLdap(f) {
    return this.http.get(environment.apiUrl + `/api/ldap/getusers/${f}`);
  }
  // GET USER BY ID
  getUserById(id) {
    return this.http.get(environment.apiUrl + `/getuser/${id}`);
  }
  getUserContact(id) {
    return this.http.get(environment.apiUrl + `/user/contact/${id}`);
  }
  getUsersWithoutUserToEdit(id) {
    return this.http.get(environment.apiUrl + `/users/${id}`);
  }
  // EDIT USER BY MASTER
  editUser(u) {
    return this.http.post(environment.apiUrl + `/edituser`, u);
  }
  // SEARCH USER
  searchUsers(u) {
    return this.http.post(environment.apiUrl + '/search/users', u);
  }
  searchUsersFilter(u, pg, size) {
    return this.http.post(
      environment.apiUrl + `/search/filter/users?page=${pg}&size=${size}`,
      u
    );
  }
  // import users from LDAP to database
  importUsers(u) {
    return this.http.post(environment.apiUrl + '/api/ldap/importusers', u, {
      headers: this.header,
    });
  }
  // TEST ACCESS TO STORAGE
  testAccessToDisk(path) {
    return this.http.post(environment.apiUrl + '/api/storage/test', path, {
      headers: this.header,
    });
  }
  getAvailableDisks() {
    return this.http.get(environment.apiUrl + '/api/storage/get', {
      headers: this.header,
    });
  }
  getDirectories(path) {
    return this.http.post(
      environment.apiUrl + '/api/storage/get/folder',
      path,
      { headers: this.header }
    );
  }
  createDirectory(path) {
    return this.http.post(
      environment.apiUrl + '/api/storage/add/folder',
      path,
      { headers: this.header }
    );
  }

  editActivePath(path) {
    return this.http.post(environment.apiUrl + '/api/storage/editpath', path, {
      headers: this.header,
    });
  }
  getAllGroups() {
    return this.http.get(environment.apiUrl + '/groups/all', {
      headers: this.header,
    });
  }
  getAllAttrs(p, s, q) {
    return this.http.get(
      environment.apiUrl + `/attrs/all?page=${p}&size=${s}&q=${q}`,
      { headers: this.header }
    );
  }
  editAttribute(a) {
    return this.http.post(environment.apiUrl + `/attrs/edit`, a, {
      headers: this.header,
    });
  }
  deleteAttribute(id) {
    return this.http.get(environment.apiUrl + `/attrs/delete/${id}`, {
      headers: this.header,
    });
  }
  getConnectedUsers() {
    return this.http.get<Array<any>>(environment.apiUrl + `/users/connected`, {
      headers: this.header,
    });
  }
  getReportAttributesConfig() {
    return this.http.get(environment.apiUrl + `/config/report/attrs`, {
      headers: this.header,
    });
  }
  editReportAttribute(rac) {
    return this.http.post(
      environment.apiUrl + `/config/report/attr/edit`,
      rac,
      { headers: this.header }
    );
  }

  // ENTITYYY
  addEntity(p) {
    return this.http.post(environment.apiUrl + '/entity/add', p, {
      headers: this.header,
    });
  }
  getEntities(p, s) {
    return this.http.get(
      environment.apiUrl + `/entity/find?page=${p}&size=${s}`,
      { headers: this.header }
    );
  }
  editEntity(p) {
    return this.http.post(environment.apiUrl + '/entity/edit', p, {
      headers: this.header,
    });
  }
  deleteEntity(id) {
    return this.http.delete(environment.apiUrl + `/entity/delete/${id}`, {
      headers: this.header,
    });
  }
  getUsersEntity(id) {
    return this.http.get(environment.apiUrl + `/entity/users/${id}`, {
      headers: this.header,
    });
  }
  getUsersWithoutEntity() {
    return this.http.get(environment.apiUrl + `/users/entity`, {
      headers: this.header,
    });
  }
  // LOGOUT USER
  logoutUser(id) {
    return this.http.get(environment.apiUrl + `/logout/user/${id}`, {
      headers: this.header,
    });
  }

  addConfig(config: any) {
    return this.http.post(environment.apiUrl + `/configurations`, config, {
      headers: this.header,
    });
  }

  getConfigByName(name: String) {
    return this.http.get(environment.apiUrl + `/configurations/flux/${name}`, {
      headers: this.header,
    });
  }

  getConfigIntegrationByName(name: String) {
    return this.http.get(environment.apiUrl + `/configurations/cm/${name}`, {
      headers: this.header,
    });
  }
  storageRemoveVerify(id, path) {
    return this.http.post(
      environment.apiUrl + '/config/path/remove/verify/' + id,
      path,
      { headers: this.header }
    );
  }
  removePathRequest(path) {
    return this.http.post(
      environment.apiUrl + '/config/path/remove/request',
      path,
      { headers: this.header }
    );
  }



  findLockedAccounts(p, s) {
    return this.http.get(`${environment.apiUrl}/accounts/locked?page=${p}&size=${s}`)
  }
  activeAccount(id) {
    return this.http.get(`${environment.apiUrl}/accounts/active/${id}`)
  }
  desactiveAccount(id) {
    return this.http.get(`${environment.apiUrl}/accounts/desactive/${id}`)
  }
  getProcessVersion(id,page,size){
return this.http.get(`${environment.apiUrl}/process/version/${id}?page=${page}&size=${size}`);
  }
}
