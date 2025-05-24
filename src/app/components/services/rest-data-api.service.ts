import { distinct, map, tap } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import {
    HttpClientModule,
    HttpClient,
    HttpHeaders,
    HttpParams,
} from '@angular/common/http';

import { Observable } from 'rxjs';
import { environment } from 'environments/environment.development';
import { RestApiService } from './rest-api.service';
import { User } from '../models/User';
import { FolderTypeA } from '../models/FolderType';
import { Folder } from '../models/folder.model';
import { Attributes } from '../models/attrributes.model';
/*
const auth = 'Basic ' + btoa('bmce.achraf' + ':' + 'user');
const header = new HttpHeaders(
  { Authorization: auth });
header.append('content-type', 'application/json');

*/

const URL = environment.apiUrl + '/';
const EDIT_URL = environment.apiUrl + '/edit/';
const LINK_URL = environment.apiUrl + '/link/';

@Injectable({
    providedIn: 'root',
})
export class RestDataApiService {
    user: User;
    header: HttpHeaders;

    id;
    setFolderId(f) {
        this.id = f;
    }

    constructor(
        private httpClient: HttpClient,
        private serviceU: RestApiService
    ) {
        this.user = new User();
        this.user = serviceU.tst(
            this.user,
            JSON.parse(sessionStorage.getItem('uslog'))
        );
        this.header = new HttpHeaders({
            'Content-Type': 'application/json',
        });
    }

    ///get users
    getUsers() {
        return this.httpClient.get(
            'http://localhost:8089/api/v1/api/getusersmaster',
            {
                headers: this.header,
            }
        );
    }

    // Get Clients :
    getClients() {
        return this.httpClient.get(URL + 'clients', { headers: this.header });
    }

    //getprocess
    getProcess(page, size) {
        return this.httpClient.get(
            'http://localhost:8089/api/v1/api/process/getall?page=' +
                page +
                '&size=' +
                size +
                '&sort=name,asc',
            { headers: this.header }
        );
    }
    // GET NATURE
    getNature(action: string = 'all'): Observable<any> {
        const params = new HttpParams().set('action', action);
        return this.httpClient.get<any>(
            'http://localhost:8089/api/v1/nature/getall',
            {
                params,
                headers: this.header,
            }
        );
    }

    // GET STEPS OF COURRIER
    courrierSteps(id) {
        return this.httpClient.get(URL + 'courrier/' + id + '/steps', {
            headers: this.header,
        });
    }

    // GET FOLDER TYPES
    getFolderTypes(): Observable<FolderTypeA[]> {
        const headers = this.header.set('Content-Type', 'application/json'); // Use `set` instead of `append` to avoid side effects
        return this.httpClient.get<FolderTypeA[]>(`${URL}foldertypes`, {
            headers,
        });
    }

    // GET QUALITY NP PAGE
    getQualityNpPage(): Observable<any> {
        return this.httpClient.get<any>(`${URL}quality/all`, {
            headers: this.header,
        });
    }

    // Get steps by nature ID
    getStepsByNat(id: string | number): Observable<any> {
        return this.httpClient.get<any>(`${environment.apiUrl}/nature/${id}`, {
            headers: this.header,
        });
    }

    // GET RECEIVERS
    getReceivers(): Observable<any[]> {
        return this.httpClient.get<any[]>(
            'http://localhost:8089/api/v1/receivers',
            { headers: this.header }
        );
    }
    // Method to get senders
    getSenders(): Observable<any[]> {
        return this.httpClient.get<any[]>(
            `http://localhost:8089/api/v1/senders`,
            { headers: this.header }
        );
    }

    // Add Folder
    addFolder(f: Folder): Observable<Folder> {
        return this.httpClient.post<Folder>(URL + 'foders', f, {
            headers: this.header,
        });
    }

    // Edit Folder :
    editFolder(f, id) {
        return this.httpClient.put(EDIT_URL + `folder/${id}`, f, {
            headers: this.header,
        });
    }
    // Delete Folder :
    deleteFolder(id) {
        return this.httpClient.delete(EDIT_URL + `folder/${id}`, {
            headers: this.header,
        });
    }

    //   Delete Folder Without Access :
    deleteFolderWithoutAccess(id) {
        return this.httpClient.delete(
            EDIT_URL + `folder/without-access/${id}`,
            { headers: this.header }
        );
    }

    //   Link Folder
    linkFolder(id: number, foldersId: any): Observable<any> {
        return this.httpClient.post<any>(
            `http://localhost:8089/api/v1/link/folder/${id}`,
            foldersId,
            { headers: this.header }
        );
    }

    // Get Count Steps :
    getCountSteps(): Observable<any> {
        return this.httpClient.get<any>(
            `${environment.apiUrl}/api/count/steps`,
            { headers: this.header }
        );
    }

    getAbs(id: number) {
        return this.httpClient.get<any>(URL + `profilabs/getAbs/${id}`, {
            headers: this.header,
        });
    }

    // Get Doc Types Attributes :
    getDocTypesAttributes(type: number) {
        return this.httpClient.get<Attributes[]>(
            URL + `documentstypes/${type}/attr`,
            { headers: this.header }
        );
    }

    //   Add Document :
    addDocument(d: Document): Observable<Document> {
        return this.httpClient.post<Document>(URL + 'documents', d, {
            headers: this.header,
        });
    }

    //   Link Doc Folder :
    linkdocfolder(idDoc, IdFolder) {
        return this.httpClient.post(
            URL + `linking/${idDoc}/${IdFolder}`,
            null,
            { headers: this.header }
        );
    }

    // Get Document Types :
    getDocTypes(): Observable<any[]> {
        return this.httpClient.get<any[]>(URL + 'documentstypes', {
            headers: this.header,
        });
    }

    getDocTypesAccesAndGroup(acc, gr) {
        return this.httpClient.get(
            environment.apiUrl + '/doc-types-byGrAccess/' + acc + '/' + gr,
            {
                headers: this.header,
            }
        );
    }

    getDocTypesAttributes2(type: number) {
        return this.httpClient.get<any>(URL + `documentstypes/${type}/attr2`, {
            headers: this.header,
        });
    }

    linkDocuments(id, docsId) {
        return this.httpClient.post(LINK_URL + `documents/${id}`, docsId, {
            headers: this.header,
        });
    }

    getFloderTypes() {
        this.header.append('content-type', 'application/json');
        return this.httpClient.get<FolderTypeA[]>(URL + 'foldertypes', {
            headers: this.header,
        });
    }

    //   Get Logo :
    getLogo() {
        return this.httpClient.get(URL + `logo`, { headers: this.header });
    }

    //  Get Document Etape :
    getDocsEtape(id, page, size) {
        return this.httpClient.get(
            URL + `folder/${id}/etape?page=${page}&size=${size}`,
            { headers: this.header }
        );
    }

    //   Get Folders Childs :
    getFolderChilds(id, page, size) {
        return this.httpClient.get(
            URL + `folder/${id}/childs?page=${page}&size=${size}`,
            { headers: this.header }
        );
    }

    //   Get Folders Documents :
    getFolderDocuments(id, page, size) {
        return this.httpClient.get(
            URL + `folder/${id}/documents?page=${page}&size=${size}`,
            { headers: this.header }
        );
    }

    //   Export Document CM:
    ExportDocCm(id, folderId) {
        return this.httpClient.get(
            environment.apiUrl + `/integration/export-doc/${id}/${folderId}`,
            { headers: this.header }
        );
    }

    getUserByParent(id) {
        return this.httpClient.get(URL + `user/parent/${id}`, {
            headers: this.header,
        });
    }

    getFolderSub(data, pageNumber, type, sort, order) {
        const tri = sort ? sort + ',' + (order ? 'asc' : 'desc') : '';
        this.header.append('content-type', 'application/json');
        return this.httpClient.post(
            URL +
                'findFolderSub/' +
                tri +
                '?type=' +
                (type ? type : -1) +
                '&filter=-1' +
                '&page=' +
                pageNumber +
                '&size=18',
            data,
            {
                headers: this.header,
            }
        );
    }

    convertWordToPdf(id) {
        return this.httpClient.get(environment.apiUrl + '/convert/word/' + id, {
            headers: this.header,
        });
    }

    unlinkDocument(id, folderId) {
        return this.httpClient.delete(
            LINK_URL + `document/${id}/f/${folderId}`,
            { headers: this.header }
        );
    }

    saveInLedgerDocuments(ids, save) {
        const p = save ? '/1' : '/0';
        return this.httpClient.post(
            environment.apiUrl + '/ledger/save/document' + p,
            ids,
            { headers: this.header }
        );
    }

    linkDocument(id, foldersId) {
        return this.httpClient.post(LINK_URL + `document/${id}`, foldersId, {
            headers: this.header,
        });
    }

    getMyFolder(FolderModel, page) {
        this.header.append('content-type', 'application/json');
        return this.httpClient.post(
            URL + `findMyFolder?page=${page}&size=18`,
            FolderModel,
            {
                headers: this.header,
            }
        );
    }

    getBo64(path) {
        return this.httpClient.post(environment.apiUrl + "/print/bo", path, { headers: this.header });

      }

      genReport(p) {
        return this.httpClient.post<any[]>(environment.apiUrl + "/print/reports/bordereau", p, { headers: this.header })
      }

      genReportXl(p) {
        return this.httpClient.post<any[]>(environment.apiUrl + "/print/reports/bordereau/xl", p, { headers: this.header })
      }

      searchCourrierExport(p, format) {
        return this.httpClient.post<any[]>(environment.apiUrl + "/search/courrier/export/" + format, p, { headers: this.header })
      }

      loadAudio(id, stepId) {
        return this.httpClient.get(environment.apiUrl + "/step/audio/" + id + "/" + stepId, { headers: this.header })
      }

        lastStepValidate(id, abondonne?, clot?, comment?) {
    return this.httpClient.get(environment.apiUrl + "/laststep/" + id + "?abondonne=" + abondonne + "&clot=" + clot + "&comment=" + comment, { headers: this.header });
  }

   saveInLedger(id, mail, save) {
    const p = save ? "/1" : "/0"
    console.log(mail);
    console.log("ùaiiiiiiiiiiiiiii");

    return this.httpClient.post(environment.apiUrl + "/ledger/save/" + id + p, mail, { headers: this.header });
  }

  generateAndSaveBO(id, save) {
    return this.httpClient.get(environment.apiUrl + "/print/" + id + "/" + save, { headers: this.header });
  }

    getGroupNpPage() {
    return this.httpClient.get(URL + `group/all`, { headers: this.header });
  }
   nextEtape(etape) {
    return this.httpClient.post(URL + `nextEtape`, etape, { headers: this.header });
  }

   getUserByTitle(title) {
    return this.httpClient.get(URL + `user/title/${title}`, { headers: this.header });
  }

   getUserByChild(id) {
    return this.httpClient.get(URL + `user/child/${id}`, { headers: this.header });
  }


    editStep(id, editEtape, accessBo?, normal?, arriveSkip?) {
    return this.httpClient.post(environment.apiUrl + "/editstep/" + id + "?directbo=" + accessBo + "&normal=" + normal + "&arrskip=" + arriveSkip, editEtape, { headers: this.header });
  }
}
