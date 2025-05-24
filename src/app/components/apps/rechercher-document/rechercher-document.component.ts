import {
    ChangeDetectorRef,
    Component,
    EventEmitter,
    Input,
    Output,
    OnInit,
    ViewChild,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialModuleModule } from 'shared/material-module/material-module.module';
import { TranslocoService, TranslocoModule } from '@ngneat/transloco';
import { FileModel } from 'app/components/models/file.model';
import {
    FormArray,
    FormBuilder,
    FormGroup,
    FormsModule,
    ReactiveFormsModule,
    Validators,
} from '@angular/forms';
import { Attributes } from 'app/components/models/attrributes.model';
import { Attribute } from 'app/components/models/attribute.model';
import { environment } from 'environments/environment.development';
import { RestDataApiService } from 'app/components/services/rest-data-api.service';
import { ToastrService } from 'ngx-toastr';
import { ConfigService } from 'app/components/services/config.service';
import { CookieService } from 'ngx-cookie-service';
import { Router } from '@angular/router';
import { RestSearchApiService } from 'app/components/services/rest-search-api.service';
import { WsService } from 'app/components/sockets/ws.service';
import { EditDocumentService } from 'app/components/services/edit-document.service';
import { EditListDocService } from 'app/components/services/edit-list-doc.service';
import { ViewerService } from 'app/components/services/viewer.service';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { ReloadService } from 'app/components/services/reload.service';
import { MatDialog } from '@angular/material/dialog';
import { SendDocInterneComponent } from 'app/components/dialogs/send-doc-interne/send-doc-interne.component';
import { Document } from 'app/components/models/document.model';
import { ViewerComponent } from '../../dialogs/viewer/viewer.component';
import { List } from 'gojs';
import { VersionDocListComponent } from 'app/components/dialogs/version-doc-list/version-doc-list.component';
import { EditDocComponent } from 'app/components/dialogs/edit-doc/edit-doc.component';
import { ResultComponent } from 'app/components/dialogs/result/result.component';
import { ConfirmationComponent } from 'app/components/dialogs/confirmation/confirmation.component';
import { SendDocumentComponent } from 'app/components/dialogs/send-document/send-document.component';
import { NonConnectionComponent } from 'app/components/dialogs/non-connection/non-connection.component';
import { DocComponent } from 'app/components/dialogs/doc/doc.component';
import { VoiceSearchComponent } from 'app/components/dialogs/voice-search/voice-search.component';
import { AllConfigurationsService } from 'app/components/services/all-configurations.service';
import { NgxPaginationModule } from 'ngx-pagination';
import { MatDrawer } from '@angular/material/sidenav';
import { FolderToFoldersComponent } from 'app/components/dialogs/folder-to-folders/folder-to-folders.component';
import { DownloadFileNameComponent } from 'app/components/dialogs/download-file-name/download-file-name.component';
import { OperationResultDialogComponent } from 'app/components/dialogs/operation-result-dialog/operation-result-dialog.component';

@Component({
    selector: 'app-rechercher-document',
    standalone: true,
    imports: [
        CommonModule,
        MaterialModuleModule,
        TranslocoModule,
        FormsModule,
        ReactiveFormsModule,
        NgxPaginationModule,
        DocComponent,
    ],
    templateUrl: './rechercher-document.component.html',
    styleUrl: './rechercher-document.component.scss',
})
export class RechercherDocumentComponent implements OnInit {
    @ViewChild('matDrawer') matDrawer!: MatDrawer;

    isDropdownOpen = false;
    toggleDropdown: boolean = false;

    fileModel = new FileModel();
    attributesForm = new FormArray([]);
    doctypes;
    self = document;
    attributes: Attributes[];
    documentInfos;
    voiceS = false;
    sorts = {};
    documentModel: Document = new Document();
    documentSearch: Array<any> = new Array<any>();
    docFormGroup: FormGroup;
    attr: Attribute[];
    base64file: string;
    isResult = false;
    row;
    @Output() documentSelected = new EventEmitter();
    @Output() next = new EventEmitter();
    @Input() tp;
    page: number = 0;
    pages: Array<number>;
    resultTotal;
    totalCheck;
    file;
    searchtype: boolean = true;
    dev;
    fileType: string;
    name: string;
    attrLib: Object;
    allIds: Array<String> = new Array();
    Validdoctypes: any[] = new Array();
    Checkdoctypes: any[] = new Array();
    groupDoc: any[] = new Array();
    selectedDoc = 'all';
    attrVals = {};
    depArrays: any = new Array<any>();
    filterDocument: any = new Array<any>();
    repAttr: any;
    documentIconShow = environment.documentIconShow;

    @Input() link: string;
    constructor(
        private ref: ChangeDetectorRef,
        private toast: ToastrService,
        private rest: RestDataApiService,
        public config: ConfigService,
        private cookies: CookieService,
        private fb: FormBuilder,
        private rt: Router,
        private srv: RestSearchApiService,
        private ws: WsService,
        private srvDoc: EditDocumentService,
        private dialog: MatDialog,
        private docserv: EditListDocService,
        private reload: ReloadService,
        private viewerService: ViewerService,
        private sanitizer: DomSanitizer,
        public allConfigs: AllConfigurationsService,
        private translocoService: TranslocoService,
    ) {}
    ngOnDestroy(): void {
        sessionStorage.removeItem('last_full_text');
    }

    currentDoc;
    base64;
    isPdf;
    uri: SafeResourceUrl = null;
    tpName: string;

    mapResultToObj(doc: any[]) {
        const o = doc.reduce((obj, current) => {
            obj[current.lib] = obj[current.lib] || '';
            obj[current.lib] = current.value;
            return obj;
        }, {});
        console.log(o);
        o['type'] = this.tpName;
        return btoa(encodeURIComponent(JSON.stringify(o)));
    }

    openArchiverPopup(archiveElements) {
        //   const pushFormRef = this.modal.open(RMPushFormComponent, { backdrop: "static", centered: true, keyboard: true })
        //   pushFormRef.componentInstance.elements = archiveElements
    }

    openReserverPopup(archiveElements) {
        //   const pushFormRef = this.modal.open(ReservationRmComponent, { backdrop: "static", centered: true, keyboard: true })
        //   pushFormRef.componentInstance.elements = archiveElements
    }

    reserverElement(document) {
        const archiveElement = this.getValue('id', document);
        const archiveElements = [...[archiveElement]];
        this.openReserverPopup(archiveElements);
    }

    archiveElement(document) {
        const archiveElement = {
            id: this.getValue('id', document),
            name: this.getValue(this.getValue('rep', document), document),
            type:
                this.getValue('isFolder', document) == 't' ? 'folder' : 'file',
            details: this.mapResultToObj(document),
        };
        const archiveElements = [...[archiveElement]];
        this.openArchiverPopup(archiveElements);
    }

    archiveDocs() {
        let document: any[];
        const archiveElements = new Array();
        for (let i = 0; i < this.documentSearch.length; i++) {
            document = this.documentSearch[i];
            for (let j = 0; j < this.selectedDocs['h'].length; j++) {
                if (
                    this.selectedDocs['h'][j] == this.getValue('id', document)
                ) {
                    archiveElements.push({
                        id: this.getValue('id', document),
                        name: this.getValue(
                            this.getValue('rep', document),
                            document
                        ),
                        type: 'file',
                        details: this.mapResultToObj(document),
                    });
                }
            }
        }

        this.openArchiverPopup(archiveElements);
    }

    getDocImage(doc: any) {
        if (!doc || !Array.isArray(doc) || doc.length < 4) return;
      
        const id = doc[0]?.value;
        const mime = doc[3]?.value;
      
        if (this.currentDoc?.id !== id) {
          this.uri = null;
          this.base64 = null;
          this.currentDoc = doc;
      
          this.viewerService.getFileToView(id).subscribe(
            (res) => {
              const fileData = res['fileData'];
      
              if (mime === 'application/pdf') {
                this.uri = this.sanitizer.bypassSecurityTrustResourceUrl('assets/ViewerJS/index.html#' + encodeURIComponent(fileData));
                this.isPdf = true;
                // const safe = this.sanitizer.bypassSecurityTrustResourceUrl(`data:application/pdf;base64,${fileData}`);
                // this.base64 = safe;
              } else {
                this.isPdf = false;
                this.uri = this.sanitizer.bypassSecurityTrustResourceUrl(
                  `assets/ViewerJS/index.html#${fileData}`
                );
              }
            },
            () => {
              this.currentDoc = null;
              this.uri = null;
              this.base64 = null;
            }
          );
        }
      }
      
      
    isPreviewable(mime: string): boolean {
        return ['application/pdf', 'image/jpeg', 'image/tiff'].includes(mime);
      }

    ngOnInit(): void {
        if (this.cookies.check('docs')) {
            this.viewMode = Number.parseInt(this.cookies.get('docs'));
        }
        if (this.link == null) {
            this.state = 'search';
        } else {
            this.state = 'link';
        }
        this.dev = localStorage.getItem('device');
        this.setUpForm();
        this.getDocsTypes();
        this.getGroupDoc();
    }

    fonc() {}
    dt = "Date d'enregistrement";
    setUpForm() {
        this.docFormGroup = this.fb.group({
            type: ['', Validators.required],
            GroupDoc: [''],
            attrs: this.fb.array([]),
        });
    }

    mappedArray = [];
    changeValue(e: any, attr: any) {
        let idx = 0;
        this.attrVals['l' + attr.name] = this.mappedArray[
            'id' + attr.id
        ].filter((_e) => {
            return e === _e.key;
        })[0]?.value;
        this.attributes.forEach((element) => {
            if (element.type.name == 'ListDep' && element.listDep == attr.id) {
                // @ts-ignore
                let array = new Array<any>();

                // @ts-ignore
                this.mappedArray['id' + element.id].forEach((element1) => {
                    if (element1.fk == e) {
                        array.push(element1);
                    }
                });

                // @ts-ignore
                for (
                    let index = 0;
                    index < this.mappedArray['id' + element.id];
                    index++
                ) {}
                // @ts-ignore

                this.depArrays['id' + element.id] = array;

                console.log(array[0], idx);
                (this.attrsForms as FormArray)
                    .at(idx)
                    .patchValue({ val: array[0]?.key ?? '' });
                this.changeValue(array[0]?.key, element);
            }
            idx++;
        });
    }

    listAttrsValues: any = [];

    parseJSON(str) {
        console.log('loaded');
        return JSON.parse(str);
    }

    getResult() {
        this.isResult = true;
        this.onSubmit();
    }

    get attrsForms(): FormArray {
        return this.docFormGroup.get('attrs') as FormArray;
    }

    getGroupDoc() {
        this.docserv.getAllElementsGroupsWithoutPage().subscribe((res) => {
            this.groupDoc = res;
        });
    }

    changeGroupDoc(e) {
        this.sel = null;
        if (e == 'all') {
            this.getDocsTypes();
        }
        this.groupDoc.forEach((res) => {
            if (res.goupId == e) {
                this.doctypes = [];
                this.Checkdoctypes = res.documentTypes;
            }
        });

        this.Validdoctypes.forEach((response) => {
            this.Checkdoctypes.forEach((resp) => {
                if (response?.id == resp?.id) {
                    this.doctypes.push(response);
                }
            });
        });

        this.docFormGroup.controls['type'].setValue('');
        this.attrsForms.clear();
    }
    getDocsTypes() {
        this.docserv.getlist('R').subscribe((res) => {
            this.doctypes = res;

            this.Validdoctypes = res;
        });
    }

    clear(e) {
        this.attrsForms.clear();
        this.changeType(this.tp);
    }
    cleartxt() {
        document.getElementById('fulltxt')['value'] = '';
    }
    t;
    sendIt(dc: any) {
        if (!this.checkDoc(dc)) return;

        this.dialog.open(SendDocInterneComponent, {
            disableClose: true,
            data: {
                id: this.getId(dc),
            },
        });
    }

    sendItF(dc: any) {
        this.dialog.open(SendDocInterneComponent, {
            disableClose: true,
            data: {
                id: dc,
            },
        });
    }

    pageC(e) {
        this.goPage(e - 1);
    }
    sel = null;
    selectedType: any = null;
    changeType(e, mode = 0) {
        this.attrsForms.clear();
        if (mode == 1) {
            this.tp = e.id;

            this.sel = this.tp;
        } else {
            this.tp = e.id;
            this.sel = this.tp;
        }
        let aa: Attributes[];
        this.srv.getTypeName(this.tp).subscribe((r) => {
            this.name = r['libelle'];
            this.tpName = r['name'];
        });
        this.t = this.tp;

        this.rest.getDocTypesAttributes(this.tp).subscribe(
            (res: Attributes[]) => {
                aa = res as Attributes[];
                this.attributes = aa;
                let i = 0;
                const tempAttrs = new Array<Attributes>();

                for (const a in this.attributes) {
                    if (this.attributes[i].type.name === 'fichier') {
                        tempAttrs.push(this.attributes[i]);
                        this.attributes.splice(i, 1);
                    }
                    if (this.attributes[i])
                        if (
                            this.attributes[i].type.name === 'List' ||
                            this.attributes[i].type.name === 'ListDep' ||
                            this.attributes[i].type.name === 'listDb'
                        ) {
                            this.listAttrsValues[i] = this.parseJSON(
                                this.attributes[i].defaultValue
                            );
                            this.depArrays['id' + this.attributes[i].id] =
                                JSON.parse(this.attributes[i].defaultValue);
                            this.mappedArray['id' + this.attributes[i].id] =
                                JSON.parse(this.attributes[i].defaultValue);
                        }
                    i++;
                }
                tempAttrs.forEach((element) => {
                    this.attributes.push(element);
                });
                this.attrLib = new Object({
                    ref: '',
                    dt: '',
                    titre: {
                        fr: '',
                        ar: '',
                        eng: '',
                    },
                });
                for (const item of Object.keys(aa)) {
                    const eventItem = this.attributes[item];

                    this.addAttr(
                        eventItem.id,
                        eventItem.type.name,
                        eventItem.name
                    );
                    if (eventItem.name == 'Réference') {
                        this.attrLib['ref'] = eventItem.libelle;
                    }
                    if (eventItem.name == 'Titre') {
                        this.attrLib['titre'] = {
                            fr: eventItem.labelfr,
                            ar: eventItem.labelar,
                            eng: eventItem.labeleng,
                        };
                    }
                    if (eventItem.name == 'Date') {
                        this.attrLib['dt'] = eventItem.libelle;
                    }
                }
            },
            (err) => {
                console.warn(err.data);
            }
        );
    }

    changeSort(attr) {
        let q = '';
        if (!this.sorts[attr]) {
            this.sorts = {};
            this.sorts[attr] = 'asc';
        } else if (this.sorts[attr] == 'asc') {
            this.sorts = {};

            this.sorts[attr] = 'desc';
        } else {
            this.sorts = {};

            this.sorts[attr] = 'asc';
        }
        Object.keys(this.sorts).forEach((element) => {
            q += element + ' ' + this.sorts[element] + ',';
        });

        this.documentModel.order = q;
        this.goPage(this.page);
    }

    addAttr(id: number, type: string, name: string) {
        let attr: FormGroup;

        if (type === 'date') {
            attr = this.fb.group({
                id,
                type,
                name,
                from: ['', Validators.required],
                to: ['', Validators.required],
            });
        } else {
            attr = this.fb.group({
                id,
                type,
                name,
                val: ['', Validators.required],
            });
        }

        this.attrsForms.push(attr);
    }

    openFile(e: Document) {
        this.dialog.open(ViewerComponent, {
            disableClose: true,
            data: {
                documentId: e.id,
            },
        });
    }

    goBack() {
        this.pages = new Array();
        this.selectedDocs = new List();
        this.page = undefined;
        this.resultTotal = 0;
        this.totalCheck = 0;
        this.btnPlusInfos(null);
        this.isResult = false;
        this.next.emit('-');
    }
    version(dc: any) {
        this.dialog.open(VersionDocListComponent, {
            disableClose: true,
            data: {
                document: dc,
                mode: 'search',
                attrs: this.attrLib,
                type: this.name,
            },
        });
    }

    getId(doc) {
        var id;
        doc.forEach((element) => {
            if (element.key == 'id') {
                id = element.value;
            }
        });
        return id;
    }
    mode(a) {
        this.cookies.set('docs', a);
        this.viewMode = a;
    }
    checkMimeType(doc) {
        const supportedMimes = environment.supportedMimeTypes.split(' ');
        return supportedMimes.indexOf(doc);
    }
    openViewer(doc: any) {
        const fileName = this.getValue('fileName', doc);

        if (fileName === 'none' || fileName == null) return;

        if (this.checkMimeType(this.getValue('content', doc)) !== -1) {
            const id = this.getValue('id', doc);

            this.dialog.open(ViewerComponent, {
                disableClose: true,
                data: {
                    documentId: id,
                },
            });

            return;
        } else {
            this.toast.error(
                "Le format du fichier choisi n'est pas supporté par la visionneuse",
                'Format non supporté'
            );
            this.downloadFile(doc);
        }
    }

    documentSr: Array<any> = new Array<any>();
    size = 18;
    varDocs = new Array<any>();
    dataDoc: Object;
    libs;
    onSubmit() {
        this.totalCheck = -1;
        this.documentModel = this.docFormGroup.value;
        this.documentModel.type = this.tp;
        this.srv
            .searchDo(this.documentModel, 0, this.size)
            .subscribe((resp) => {
                if (resp != null) {
                    this.varDocs = new Array<any>();

                    this.documentSearch = resp;

                    this.documentSearch.forEach((document: Array<any>) => {
                        document.forEach((attribute) => {
                            if (attribute.rep == 1) {
                                this.repAttr = attribute;
                            }
                        });
                    });

                    const p = resp;
                    const totalePages = resp['totalPages'];
                    console.log(resp);

                    p.forEach((element) => {
                        this.dataDoc = new Object({
                            ref: '',
                            dt: '',
                            titre: '',
                        });
                        element.forEach((el) => {
                            if (el.key == this.dt) {
                                this.dataDoc['dateS'] = el.value;
                            }
                            if (el.rep == 1) {
                                let data = new Array();

                                if (
                                    el.key == 'ListDep' ||
                                    el.key == 'listDb' ||
                                    el.key == 'List'
                                ) {
                                    data = JSON.parse(el.defaultValue);
                                    data?.forEach((res) => {
                                        if (res.key == el.value) {
                                            this.dataDoc['titre'] = res.value;
                                        }
                                    });
                                } else {
                                    this.dataDoc['titre'] = el.value;
                                }
                            }
                        });
                        this.varDocs.push(this.dataDoc);
                    });
                    this.totalCheck = resp.length - 1;
                    this.resultTotal = resp.length - 1;
                    this.pages = new Array<number>();

                    this.documentSearch.forEach((element) => {
                        element.forEach((element1) => {
                            if (element1['key'] == 'ids') {
                                if (element1['value']) {
                                    this.allIds = new Array<string>();

                                    this.allIds = JSON.parse(element1['value']);
                                }
                            } else if (element1['key'] == 'count') {
                                if (element1['value']) {
                                    this.resultTotal = element1.value;
                                    var a = Math.abs(element1.value / 12);
                                    for (let index = 0; index <= a; index++) {
                                        this.pages[index] = index;
                                    }
                                }
                                this.documentSearch.splice(
                                    this.documentSearch.indexOf(element),
                                    1
                                );
                            }
                        });
                    });

                    this.documentSelected.emit();
                    this.reload.event.subscribe((res) => {
                        this.isResult = false;
                    });
                } else this.totalCheck = -2;
            });
    }

    containsAny(source, target) {
        var result = source.filter((item) => {
            return target.indexOf(item) > -1;
        });
        return result.length == target.length;
    }

    get isPageSeleced() {
        const result = [];
        this.documentSearch.forEach((el) => {
            const id = this.getValue('id', el);

            result.push(id);
        });

        return this.containsAny(this.selectedDocs, result);
    }

    getDocToUp(doc: any[]) {
        let id;

        doc.forEach((element) => {
            if (element.key === 'id') {
                id = element.value;
            }
        });

        this.srvDoc.hasAccessToEdit(id).subscribe((r) => {
            if (r === 1) {
                this.srv.docbyId(id).subscribe((resp) => {
                    resp['attributeValues'].sort(
                        (a, b) => a.attribute.id - b.attribute.id
                    );
                    console.log(resp);

                    const dialogRef = this.dialog.open(EditDocComponent, {
                        disableClose: true,
                        data: {
                            mode: 'edit',
                            docup: resp,
                        },
                    });

                    dialogRef.afterClosed().subscribe((result) => {
                        if (result === 'ok') {
                            this.goPage(this.page);
                        }
                    });
                });
            } else {
                this.openModalNoAcc();
            }
        });
    }

    openModalNoAcc() {
        this.dialog.open(ResultComponent, {
            disableClose: true,
            data: {
                title: "Pas d'accès",
                etat: -1,
                text: "Vous n'êtes pas autorisé à effectuer cette opération.",
            },
        });
    }

    totalePages: number;
    arrayOfpages = new Array<number>();

    goPage(i) {
        this.documentSearch = [];
        this.btnPlusInfos(null);
        this.totalCheck = -1;
        this.page = i;
        this.varDocs = new Array<any>();

        this.srv
            .searchDo(this.documentModel, i, this.size)
            .subscribe((resp) => {
                console.log(resp);
                if (resp.length == 0 || resp[0].length == 0) {
                    this.totalCheck = 0;
                    this.resultTotal = 0;
                } else {
                    this.totalCheck = 1;
                    this.documentSearch = resp;
                    this.documentSearch.forEach((document: Array<any>) => {
                        document.forEach((attribute) => {
                            if (attribute.rep == 1) {
                                this.repAttr = attribute;
                                console.log(this.repAttr);
                            }
                        });
                    });
                    this.totalCheck = 1;
                    // this.resultTotal = resp.length - 1;
                    console.log(resp);
                    const p = resp;
                    p.forEach((element) => {
                        this.dataDoc = new Object({
                            ref: '',
                            dt: '',
                            titre: '',
                        });

                        element.forEach((el) => {
                            if (el.key == this.dt) {
                                this.dataDoc['dateS'] = el.value;
                            }
                            if (el.rep == 1) {
                                let data = new Array();

                                if (
                                    el.key == 'ListDep' ||
                                    el.key == 'listDb' ||
                                    el.key == 'List'
                                ) {
                                    data = JSON.parse(el.defaultValue);
                                    data?.forEach((res) => {
                                        if (res.key == el.value) {
                                            this.dataDoc['titre'] = res.value;
                                        }
                                    });
                                } else {
                                    this.dataDoc['titre'] = el.value;
                                }
                            }
                        });
                        this.varDocs.push(this.dataDoc);
                    });
                    this.page;
                    this.documentSearch.forEach((element) => {
                        element.forEach((element1) => {
                            if (element1['key'] == 'count') {
                                this.documentSearch.splice(
                                    this.documentSearch.indexOf(element),
                                    1
                                );
                            }
                        });
                    });
                }
            });
    }
    supp(id: string) {
        this.srvDoc.delete(id).subscribe((res) => {
            if (res) {
                alert('supprimé');
            }
        });
    }
    hide = false;
    linkClick(dc) {
        this.documentSelected.emit(dc);
        this.hide = true;
    }

    docList;

    openModale(state?: number, target?: string, message?: string) {
        this.dialog.open(OperationResultDialogComponent, {
            disableClose: true,
            data: {
                object: 'la document',
                operation: target ?? 'Modification',
                result: state === 1 ? 'succès' : 'echoue',
                name: '',
                message: message,
            },
        });
    }

    // mode:string
    state;
    select = false;
    selectMode;
    selectType(e) {
        this.select = e.target.checked;
    }
    getValue(index, doc) {
        var id;
        doc.forEach((element) => {
            if (element.key == index) {
                id = element.value;
            }
        });

        return id;
    }
    selectedDocs: List<any> = new List<any>();
    addToList(e, d) {
        if (e.target.checked) {
            this.selectedDocs.add(this.getValue('id', d));
            // $('#actions').show(500);
        } else {
            this.selectedDocs.remove(this.getValue('id', d));
        }
        if (this.selectedDocs['h'].length == 0) {
            // $('#actions').toggle(500);
        }
    }
    viewMode = 0;

    onDelete(dc: any[]) {
        let id;

        dc.forEach((element) => {
            if (element.key === 'id') {
                id = element.value;
            }
        });

        this.srvDoc.hasAccessToDelete(id).subscribe((r) => {
            if (r === 1) {
                const dialogRef = this.dialog.open(ConfirmationComponent, {
                    disableClose: true,
                    data: {
                        target: ' ' + 'Document',
                    },
                });

                dialogRef.afterClosed().subscribe((resp) => {
                    if (resp === 'yes') {
                        this.srvDoc.delete(id).subscribe((res) => {
                            this.openModale(1, 'Suppression');
                            this.goPage(this.page);
                        });
                    }
                });
            } else {
                this.openModalNoAcc();
            }
        });
    }

    deleteDocs() {
        const id = this.selectedDocs['h'][0];

        this.srvDoc.hasAccessToDelete(id).subscribe((r) => {
            if (r === 1) {
                const dialogRef = this.dialog.open(ConfirmationComponent, {
                    disableClose: true,
                    data: {
                        target:
                            this.selectedDocs['h'].length === 1
                                ? 'document'
                                : 's documents',
                    },
                });

                dialogRef.afterClosed().subscribe((resp) => {
                    if (resp === 'yes') {
                        this.srvDoc
                            .deleteDocs(this.selectedDocs['h'])
                            .subscribe((res) => {
                                this.openModale(1, 'Suppression');
                                this.goPage(this.page);
                                this.selectedDocs = new List<any>();
                            });
                    }
                });
            } else {
                this.openModalNoAcc();
            }
        });
    }

    btnPlusInfos(infos) {
        this.filterDocument = infos;

        this.filterDocument?.forEach((element) => {
            let data = new Array();
            if (element.type != null) {
                if (
                    element.type.name == 'ListDep' ||
                    element.type.name == 'listDb' ||
                    element.type.name == 'List'
                ) {
                    data = JSON.parse(element.defaultValue);
                    data?.forEach((res) => {
                        if (res.key == element.value) {
                            element.value = res.value;
                        }
                    });
                }
            }
        });

        if (this.documentInfos == infos) {
            // $('#plusInfos').toggle(500);
        } else {
            this.documentInfos = infos;
        }
    }
    searchButton(e) {
        if (e.keyCode == 13) {
            this.getResult();
        }
    }
    setDocId(dc: any) {
        const id = this.getId(dc);
        this.srv.setFoldersBydoc(id);

        this.srv.getFoldersBydoc(id, 0).subscribe((r) => {
            if (r['totalElements'] > 0) {
                this.dialog.open(FolderToFoldersComponent, {
                    disableClose: true,
                });
            } else {
                this.dialog.open(ResultComponent, {
                    disableClose: true,
                    data: {
                        title: 'Aucun résultat',
                        text: 'Aucun courrier lié avec ce document.',
                        etat: -1,
                    },
                });
            }
        });
    }

    back() {
        this.rt.navigateByUrl('/apps/courrier-recents');
    }

    downloadFile(d) {
        if (!this.checkDoc(d)) return;
        this.viewerService.downloadFile(this.getId(d)).subscribe((res) => {
            this.file = res; //console.log(this.file);
            this.fileType = this.file.contentType.split('/')[0];
            const b64Data = this.file.fileData as string;
            const contentType = this.file.contentType;
            const byteCharacters = atob(b64Data.split(',')[1]);
            const byteArrays = [];

            for (
                let offset = 0;
                offset < byteCharacters.length;
                offset += 512
            ) {
                const slice = byteCharacters.slice(offset, offset + 512);

                const byteNumbers = new Array(slice.length);
                for (let i = 0; i < slice.length; i++) {
                    byteNumbers[i] = slice.charCodeAt(i);
                }

                const byteArray = new Uint8Array(byteNumbers);
                byteArrays.push(byteArray);
            }

            const blob = new Blob(byteArrays, { type: contentType });
            const blobUrl = URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = blobUrl;
            link.download = this.file.fileName;
            //console.log(link)
            link.dispatchEvent(
                new MouseEvent('click', {
                    bubbles: true,
                    cancelable: true,
                    view: window,
                })
            );
        });
    }

    sendDocs() {
        // this.dialog.open(MailSecurityComponent, {
        //   disableClose: true,
        //   data: {
        //     docs: this.selectedDocs['h']
        //   }
        // });
    }

    //ZIP
    downloadzip() {
        console.log("this.selectedDocs['h']", this.selectedDocs['h']);
        const dialogRef = this.dialog.open(DownloadFileNameComponent, {
            disableClose: true,
            data: {
                docs: this.selectedDocs['h'],
            },
        });

        dialogRef.afterClosed().subscribe((r) => {
            if (r === 'done') {
                this.selectedDocs = new List<any>();
            }
        });
    }

    //SEND EMAIL POPUP
    send(d: any) {
        if (!this.checkDoc(d)) return;
        this.dialog.open(SendDocumentComponent, {
            disableClose: true,
            data: {
                id: this.getId(d),
            },
        });
    }

    // FULL TEXT PART
    documents;
    showDocuments;
    myFile;
    txt;
    change() {
        this.searchtype = !this.searchtype;
        // this.cleartxt();
    }

    getRes(e) {
        document.getElementById('fulltxt')['value'] =
            (e as string)[(e as string).length - 1] === '.'
                ? (e as string).substring(0, (e as string).length - 2)
                : (e as string);
    }

    getState(e) {
        if (e == 'end') {
            setTimeout(() => {
                this.voiceS = false;
                setTimeout(() => {
                    let btn = document.getElementById('ftxt_search_btn');
                    btn.dispatchEvent(new MouseEvent('click'));
                }, 100);
            }, 500);
        }
    }
    textResult(p) {
        this.documents = [];
        this.isResult = true;
        this.page = p;
        this.txt = document.getElementById('fulltxt')['value'];
        if (this.txt == ' ') {
            this.txt = '';
        }
        this.srv.searchFullText(this.txt, p).subscribe(
            (r) => {
                this.documents = r['content'];
                const totalePages = r['totalPages'];
                this.pages = new Array<number>(totalePages);
                this.resultTotal = r['totalElements'];

                this.attrLib = new Object({
                    ref: '',
                    dt: '',
                    titre: '',
                });
                r['content'].forEach((element) => {
                    this.dataDoc = new Object({
                        ref: '',
                        dt: '',
                        titre: '',
                    });
                    element.attributeValues.forEach((el) => {
                        if (el.attribute.name == 'Titre') {
                            this.dataDoc['titre'] = el.value.value;
                            this.attrLib['titre'] = el.attribute.libelle;
                        }
                    });
                    this.varDocs.push(this.dataDoc);
                });
                for (let index = 0; index < totalePages; index++) {
                    this.pages[index] = index;
                }
                //console.log(this.pages.length)
                if (r['numberOfElements'] == 0) {
                    this.showDocuments = false;
                } else {
                    this.showDocuments = true;
                }
            },
            (err) => {
                this.resultTotal = 0;
            }
        );
    }

    goPageT(p) {
        sessionStorage.setItem('last_full_text', this.txt);
        this.isResult = true;
        this.page = p - 1;

        this.srv.searchFullText(this.txt, this.page).subscribe((r) => {
            this.documents = r['content'];
            const totalePages = r['totalPages'];
            this.pages = new Array<number>(totalePages);
            this.resultTotal = r['totalElements'];
            for (let index = 0; index < totalePages; index++) {
                this.pages[index] = index;
            }
            if (r['numberOfElements'] == 0) {
                this.showDocuments = false;
            } else {
                this.showDocuments = true;
            }
        });
    }
    openViewerF(id: any, fileName: string) {
        sessionStorage.setItem('last_full_text', this.txt);
        this.dialog.open(ViewerComponent, {
            disableClose: true,
            data: {
                documentId: id,
            },
        });

        this.file.fileId = id;
        this.file.fileName = fileName;
        this.ws.openFile(this.file);
    }

    sendF(d: any) {
        this.dialog.open(SendDocumentComponent, {
            disableClose: true,
            data: {
                id: d.id,
            },
        });
    }

    selectAlll(e) {
        this.allIds.forEach((el) => {
            const id = el;
            if (this.selectedDocs.indexOf(id) == -1) this.selectedDocs.add(id);
        });
    }
    unSelectAll() {
        this.selectedDocs = new List<any>();
    }

    selectAll(e) {
        this.documentSearch.forEach((el) => {
            const id = this.getValue('id', el);
            if (this.selectedDocs.indexOf(id) == -1) this.selectedDocs.add(id);
        });
    }

    downloadFileF(id) {
        this.viewerService.downloadFile(id).subscribe((res) => {
            this.myFile = res;
            this.fileType = this.myFile.contentType.split('/')[0];
            const b64Data = this.myFile.fileData as string;
            const contentType = this.myFile.contentType;
            const byteCharacters = atob(b64Data.split(',')[1]);
            const byteArrays = [];

            for (
                let offset = 0;
                offset < byteCharacters.length;
                offset += 512
            ) {
                const slice = byteCharacters.slice(offset, offset + 512);

                const byteNumbers = new Array(slice.length);
                for (let i = 0; i < slice.length; i++) {
                    byteNumbers[i] = slice.charCodeAt(i);
                }

                const byteArray = new Uint8Array(byteNumbers);
                byteArrays.push(byteArray);
            }

            const blob = new Blob(byteArrays, { type: contentType });
            const blobUrl = URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = blobUrl;
            link.download = this.myFile.fileName;

            link.dispatchEvent(
                new MouseEvent('click', {
                    bubbles: true,
                    cancelable: true,
                    view: window,
                })
            );
        });
    }

    getDocToUpF(e: Document) {
        this.srvDoc.hasAccessToEdit(e.id).subscribe((r) => {
            if (r === 1) {
                this.srv.docbyId(e.id).subscribe((resp) => {
                    const dialogRef = this.dialog.open(EditDocComponent, {
                        disableClose: true,
                        data: {
                            mode: 'edit',
                            docup: e,
                        },
                    });

                    dialogRef.afterClosed().subscribe((result) => {
                        if (result === 'ok') {
                            this.goPage(this.page);
                        }
                    });
                });
            } else {
                this.openModalNoAcc();
            }
        });
    }

    versionF(dc: any, type: string) {
        this.dialog.open(VersionDocListComponent, {
            disableClose: true,
            data: {
                document: dc,
                type: type,
            },
        });
    }

    onDeleteF(id: string) {
        this.srvDoc.hasAccessToDelete(id).subscribe((r) => {
            if (r === 1) {
                const dialogRef = this.dialog.open(ConfirmationComponent, {
                    disableClose: true,
                    data: {
                        target: 'document',
                    },
                });

                dialogRef.afterClosed().subscribe((resp) => {
                    if (resp === 'yes') {
                        this.srvDoc.delete(id).subscribe((res) => {
                            this.openModale(1, 'Suppression');
                            this.goPage(this.page);
                        });
                    }
                });
            } else {
                this.openModalNoAcc();
            }
        });
    }

    speechToggle(any: any) {
        if (!window.navigator.onLine) {
            this.dialog.open(NonConnectionComponent, {
                disableClose: true,
                data: {
                    title: "Erreur d'internet",
                    message:
                        'La reconnaissance vocale requiert une connexion internet',
                },
            });
        } else {
            this.voiceS = !this.voiceS;

            if (this.voiceS) {
                any.speechReco.start();
            } else {
                any.speechReco.stop();
            }
        }
    }

    btnPlusInfosF(infos) {
        if (this.documentInfos == infos) {
            // $('#plusInfos').toggle(500);
        } else {
            this.documentInfos = infos;
        }
        // }
    }
    getLibByName(name) {
        this.attributes.forEach((r) => {
            if (r.name == name) {
                name = r.libelle;
                console.log(r.libelle);

                return r.libelle;
            }
        });
    }

    getFontAwesomeIconFromMIME(mimeType: string): string {
        const icon_classes: { [key: string]: string } = {
          // Media
          image: 'fa fa-file-image-o text-blue-500',
          audio: 'fa fa-file-audio-o text-purple-500',
          video: 'fa fa-file-video-o text-indigo-500',
      
          // Documents
          'application/pdf': 'fa fa-file-pdf-o text-red-600',
          'application/msword': 'fa fa-file-word-o text-blue-600',
          'application/vnd.ms-word': 'fa fa-file-word-o text-blue-600',
          'application/vnd.oasis.opendocument.text': 'fa fa-file-word-o text-blue-600',
          'application/vnd.openxmlformats-officedocument.wordprocessingml':
            'fa fa-file-word-o text-blue-600',
      
          'application/vnd.ms-excel': 'fa fa-file-excel-o text-green-600',
          'application/vnd.openxmlformats-officedocument.spreadsheetml':
            'fa fa-file-excel-o text-green-600',
          'application/vnd.oasis.opendocument.spreadsheet': 'fa fa-file-excel-o text-green-600',
      
          'application/vnd.ms-powerpoint': 'fa fa-file-powerpoint-o text-orange-500',
          'application/vnd.openxmlformats-officedocument.presentationml':
            'fa fa-file-powerpoint-o text-orange-500',
          'application/vnd.oasis.opendocument.presentation':
            'fa fa-file-powerpoint-o text-orange-500',
      
          'text/plain': 'fa fa-file-text-o text-gray-600',
          'text/html': 'fa fa-file-code-o text-teal-500',
          'application/json': 'fa fa-file-code-o text-teal-500',
      
          // Archives
          'application/gzip': 'fa fa-file-archive-o text-yellow-500',
          'application/zip': 'fa fa-file-archive-o text-yellow-500',
        };
      
        if (!mimeType || mimeType === 'null') {
          return 'fa fa-file text-gray-400';
        }
      
        for (const key in icon_classes) {
          if (icon_classes.hasOwnProperty(key) && mimeType.startsWith(key)) {
            return icon_classes[key];
          }
        }
      
        return 'fa fa-file-alt text-gray-400';
      }
      
      
    checkDoc(doc) {
        var fileName = this.getValue('fileName', doc);
        if (fileName == 'none' || fileName == null || fileName == 'null')
            return false;

        return true;
    }

    filename: String;
    filenameArray = new Array();
    exportWordPdf(documentF) {
        this.rest.convertWordToPdf(documentF['0']['value']).subscribe((res) => {
            this.myFile = res;
            const b64Data = this.myFile['pdf'];
            const byteCharacters = atob(b64Data);
            const byteArrays = [];

            for (
                let offset = 0;
                offset < byteCharacters.length;
                offset += 512
            ) {
                const slice = byteCharacters.slice(offset, offset + 512);

                const byteNumbers = new Array(slice.length);
                for (let i = 0; i < slice.length; i++) {
                    byteNumbers[i] = slice.charCodeAt(i);
                }

                const byteArray = new Uint8Array(byteNumbers);
                byteArrays.push(byteArray);
            }

            const blob = new Blob(byteArrays, { type: 'application/pdf' });
            const blobUrl = URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = blobUrl;
            this.filename = this.myFile['filename'];
            this.filenameArray = this.filename.split('.');
            link.download = this.filenameArray[0] + '.pdf';

            link.dispatchEvent(
                new MouseEvent('click', {
                    bubbles: true,
                    cancelable: true,
                    view: window,
                })
            );
        });
    }

    isDrawerOpen = false;
    drawerDetails: { label: string; value: any }[] = [];

    triggerDetailsDrawer(folder: any) {
        console.log('folder ====>', folder);

        const labelLang = 'labelfr';

        this.drawerDetails = (folder.attributeValues || folder).map(
            (item: any) => {
                const label = item[labelLang] || item.key;
                let value = item.value;

                if (item.type?.name === 'List' && item.defaultValue) {
                    try {
                        const listOptions = JSON.parse(item.defaultValue);
                        const match = listOptions.find(
                            (opt: any) => opt.key === value
                        );
                        value = match?.value || value;
                    } catch (err) {
                        console.warn(
                            `Error parsing list defaultValue for ${item.key}`,
                            err
                        );
                    }
                }
                if (!value) {
                    value = 'N/A';
                }

                return { label, value };
            }
        );

        this.matDrawer.toggle();
    }

    closeDrawer() {
        this.matDrawer.toggle();
    }

    onDrawerClosed() {
        this.drawerDetails = [];
    }
}
