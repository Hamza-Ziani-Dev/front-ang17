import { Component,OnInit,OnDestroy, Output, EventEmitter, ChangeDetectorRef, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FileModel } from 'app/components/models/file.model';
import { FormArray, FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Attributes } from 'app/components/models/attrributes.model';
import { Attribute } from 'app/components/models/attribute.model';
import { environment } from 'environments/environment.development';
import { ToastrService } from 'ngx-toastr';
import { RestDataApiService } from 'app/components/services/rest-data-api.service';
import { ConfigService } from 'app/components/services/config.service';
import { CookieService } from 'ngx-cookie-service';
import { Router } from '@angular/router';
import { RestSearchApiService } from 'app/components/services/rest-search-api.service';
import { WsService } from 'app/components/sockets/ws.service';
import { EditDocumentService } from 'app/components/services/edit-document.service';
import { MatDialog } from '@angular/material/dialog';
import { EditListDocService } from 'app/components/services/edit-list-doc.service';
import { ReloadService } from 'app/components/services/reload.service';
import { ViewerService } from 'app/components/services/viewer.service';
import { AllConfigurationsService } from 'app/components/services/all-configurations.service';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { List } from 'gojs';
import { Document } from 'app/components/models/document.model';
import { TranslocoService, TranslocoModule } from '@ngneat/transloco';
import { MaterialModuleModule } from 'shared/material-module/material-module.module';
import { NgxPaginationModule } from 'ngx-pagination';

@Component({
  selector: 'app-document-search',
  standalone: true,
  imports: [CommonModule,MaterialModuleModule,FormsModule,ReactiveFormsModule,TranslocoModule,NgxPaginationModule],
  templateUrl: './document-search.component.html',
  styleUrl: './document-search.component.scss'
})
export class DocumentSearchComponent implements OnInit, OnDestroy  {
    fileModel = new FileModel();
    attributesForm = new FormArray([]);
    doctypes;
    self = document
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
    page: number = 0;
    pages: Array<number>;
    resultTotal;
    totalCheck;
    file;
    searchtype: boolean = true;
    dev
    fileType: string;
    name: string;
    attrLib: Object
    allIds: Array<String> = new Array()
    Validdoctypes: any[] = new Array();
    Checkdoctypes: any[] = new Array();
    groupDoc: any[] = new Array();
    selectedDoc = "all"
    attrVals = {};
    depArrays: any = new Array<any>();
    filterDocument: any = new Array<any>();
    repAttr: any;
    documentIconShow = environment.documentIconShow

    @Input() link: string;
    constructor(private ref: ChangeDetectorRef,
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
      private translocoService: TranslocoService
    ) {

    }
    ngOnDestroy(): void {
      sessionStorage.removeItem("last_full_text")

    }

    currentDoc;
    base64;
    isPdf;
    uri: SafeResourceUrl = null;
    tpName: string;

    mapResultToObj(doc: any[]) {
      const o = doc.reduce((obj, current) => {
        obj[current.lib] = obj[current.lib] || ""
        obj[current.lib] = current.value
        return obj
      }, {})
      console.log(o)
      o["type"] = this.tpName
      return btoa(encodeURIComponent(JSON.stringify(o)))
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
      const archiveElements = [...[archiveElement]]
      this.openReserverPopup(archiveElements);
    }

    archiveElement(document) {
      const archiveElement = {
        id: this.getValue('id', document),
        name: this.getValue(this.getValue('rep', document), document),
        type: this.getValue('isFolder', document) == 't' ? 'folder' : 'file',
        details: this.mapResultToObj(document)
      }
      const archiveElements = [...[archiveElement]]
      this.openArchiverPopup(archiveElements);
    }

    archiveDocs() {
      let document: any[];
      const archiveElements = new Array();
      for (let i = 0; i < this.documentSearch.length; i++) {
        document = this.documentSearch[i];
        for (let j = 0; j < this.selectedDocs['j'].length; j++) {
          if (this.selectedDocs['j'][j] == this.getValue('id', document)) {
            archiveElements.push({
              id: this.getValue('id', document),
              name: this.getValue(this.getValue('rep', document), document),
              type: 'file',
              details: this.mapResultToObj(document)
            })
          }
        }
      }

      this.openArchiverPopup(archiveElements);
    }

    getDocImage(doc) {

      if (doc) {
        if (this.currentDoc?.id != doc[0]["value"]) {
          this.uri = null;
          this.currentDoc = doc;
          this.viewerService.getFileToView(doc[0]["value"]).subscribe(
            (res) => {
              this.base64 = res['fileData'];
              if (doc[3]["value"] == 'application/pdf') {
                this.isPdf = true;
              } else {
                this.isPdf = false;
                this.uri = this.sanitizer.bypassSecurityTrustResourceUrl(
                  'assets/ViewerJS/index.html#' + res['fileData']
                );
              }
            },
            (err) => {
              this.currentDoc = null;
              this.base64 = null;
            }
          );
        }
      } else {
        this.currentDoc = null;
        this.base64 = null;
      }
    }

    ngOnInit(): void {

      if (this.cookies.check("docs")) {
        this.viewMode = Number.parseInt(this.cookies.get("docs"));
      }
      if (this.link == null) {
        this.state = "search"
      }
      else {
        this.state = "link"
      }
      this.dev = localStorage.getItem('device')
      this.setUpForm();
      this.getDocsTypes();
      this.getGroupDoc();

    }
    tp;
    fonc() { }
    dt = "Date d'enregistrement"
    setUpForm() {
      this.docFormGroup = this.fb.group({
        type: ['', Validators.required],
        GroupDoc: [''],
        attrs: this.fb.array([])
      });
    }

    mappedArray = []
    changeValue(e: any, attr: any) {
      let idx = 0
      this.attrVals["l" + attr.name] = this.mappedArray['id' + attr.id].filter((_e) => {


        return e === _e.key

      })[0]?.value;
      this.attributes.forEach((element) => {

        if (element.type.name == 'ListDep' && element.listDep == attr.id) {
          // @ts-ignore
          let array = new Array<any>()

          // @ts-ignore
          this.mappedArray['id' + element.id].forEach(element1 => {

            if (element1.fk == e) {
              array.push(element1)
            }
          });

          // @ts-ignore
          for (let index = 0; index < this.mappedArray['id' + element.id]; index++) {

          }
          // @ts-ignore

          this.depArrays['id' + element.id] = array

          console.log(array[0], idx);
          (this.attrsForms as FormArray).at(idx).patchValue({ val: array[0]?.key ?? "" });
          this.changeValue(array[0]?.key, element)
        }
        idx++;
      });

    }

    listAttrsValues: any = []

    parseJSON(str) {
      console.log("loaded");
      return JSON.parse(str);
    }


    getResult() {
      this.isResult = true;
      this.onSubmit();
    }

    get attrsForms() {
      return (this.docFormGroup.get('attrs') as FormArray);
    }

    getGroupDoc() {
      this.docserv.getAllElementsGroupsWithoutPage().subscribe((res) => {
        this.groupDoc = res;

      });
    }



    changeGroupDoc(e) {
      this.sel = null
      if (e == "all") {
        this.getDocsTypes();
      }
      this.groupDoc.forEach(res => {
        if (res.goupId == e) {
          this.doctypes = [];
          this.Checkdoctypes = res.documentTypes
        }
      })

      this.Validdoctypes.forEach((response) => {
        this.Checkdoctypes.forEach(resp => {
          if (response?.id == resp?.id) {
            this.doctypes.push(response)
          }
        })

      })

      this.docFormGroup.controls["type"].setValue("")
      this.attrsForms.clear();

    }
    getDocsTypes() {

      this.docserv.getlist("R").subscribe(
        res => {
          this.doctypes = res;

          this.Validdoctypes = res;
        }
      );

    }

    clear(e) {
      //this.docFormGroup.controls["type"].setValue("")
      this.attrsForms.clear();
      this.changeType(this.tp)
    }
    cleartxt() {
      document.getElementById('fulltxt')['value'] = ""
    }
    t;
    sendIt(dc) {
    //   if (!this.checkDoc(dc)) return
    //   const confRef = this.modal.open(SendDocInterneComponent, { keyboard: false, centered: true, backdrop: 'static' })
    //   confRef.componentInstance.id = this.getId(dc);
    }
    sendItF(dc) {
    //   const confRef = this.modal.open(SendDocInterneComponent, { keyboard: false, centered: true, backdrop: 'static' })
    //   confRef.componentInstance.id = dc
    }
    pageC(e) {
      this.goPage(e - 1)
    }
    sel = null
    changeType(e, mode = 0) {
        this.attrsForms.clear();
      if (mode == 1) {
        this.tp = e.id;

        this.sel = this.tp

      }
      else {
        this.tp = e.id
        this.sel = this.tp

      }
      let aa: Attributes[];
      this.srv.getTypeName(this.tp).subscribe(r => {
        this.name = r["libelle"]
        this.tpName = r['name']
      })
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
              if (this.attributes[i].type.name === 'List' || this.attributes[i].type.name === 'ListDep' || this.attributes[i].type.name === 'listDb') {
                this.listAttrsValues[i] = this.parseJSON(this.attributes[i].defaultValue)
                this.depArrays['id' + this.attributes[i].id] = JSON.parse(this.attributes[i].defaultValue);
                this.mappedArray['id' + this.attributes[i].id] = JSON.parse(this.attributes[i].defaultValue);


              }
            i++;
          }
          //console.log(this.attributes);
          tempAttrs.forEach((element) => {
            this.attributes.push(element);
          });
          this.attrLib = new Object({
            ref: "",
            dt: "",
            titre: {
              fr: '',
              ar: '',
              eng: '',
            }
          })
          for (const item of Object.keys(aa)) {
            const eventItem = this.attributes[item];
            console.log(eventItem);

            this.addAttr(eventItem.id, eventItem.type.name, eventItem.name);
            if (eventItem.name == "Réference") {
              this.attrLib['ref'] = eventItem.libelle
            }
            if (eventItem.name == "Titre") {
              this.attrLib['titre'] = {
                fr: eventItem.labelfr,
                ar: eventItem.labelar,
                eng: eventItem.labeleng
              }
            }
            if (eventItem.name == "Date") {
              this.attrLib['dt'] = eventItem.libelle
            }
          }

        },
        err => { console.warn(err.data); }
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
      const attr = this.fb.group({
        id,
        type,
        name,
        val: ['', Validators.required],

      });

      this.attrsForms.push(attr);

    }
    openFile(e: Document) {
    //   const viewRef = this.modal.open(ViewerComponent, { keyboard: false, size: 'xl', centered: true })
    //   viewRef.componentInstance.documentId = e.id;
    }
    goBack() {
      this.pages = new Array();
      this.selectedDocs = new List();
      this.page = undefined
      this.resultTotal = 0
      this.totalCheck = 0
      this.btnPlusInfos(null)
      this.isResult = false;
      this.next.emit('-');


    }
    version(dc) {
    //   const modalRef = this.modal.open(VersionDocListComponent, { keyboard: false, centered: true, size: 'xl', backdrop: 'static' });
    //   modalRef.componentInstance.document = dc;
    //   modalRef.componentInstance.mode = "search";
    //   modalRef.componentInstance.attrs = this.attrLib
    //   modalRef.componentInstance.type = this.name
    }
    getId(doc) {
      var id
      doc.forEach(element => {
        if (element.key == "id") {
          id = element.value;
        }

      });
      return id;
    }
    mode(a) {

      this.cookies.set("docs", a);
      this.viewMode = a
    }
    checkMimeType(doc) {
      const supportedMimes = environment.supportedMimeTypes.split(' ');
      return supportedMimes.indexOf(doc)
    }
    openViewer(doc) {
    //   console.log(doc);

    //   var id, fileName = this.getValue('fileName', doc);
    //   if (fileName == 'none' || fileName == null)
    //     return

    //   if (this.checkMimeType(this.getValue('content', doc)) !== -1) {
    //     id = this.getValue('id', doc);
    //     const viewRef = this.modal.open(ViewerComponent, { keyboard: false, size: 'xl', centered: true, backdrop: 'static' })
    //     viewRef.componentInstance.documentId = id;
    //     return
    //   }
    //   else {
    //     this.toast.error(this.config.c.documentAdd.fileFormatNotSupported.message, this.config.c.documentAdd.fileFormatNotSupported.title)
    //     this.downloadFile(doc)

    //   }

    }
    documentSr: Array<any> = new Array<any>();
    size = 18
    varDocs = new Array<any>();
    dataDoc: Object
    libs
    onSubmit() {
      this.totalCheck = -1
      this.documentModel = this.docFormGroup.value;
      this.documentModel.type = this.tp
      this.srv.searchDo(this.documentModel, 0, this.size).subscribe((resp) => {
        if (resp != null) {
            this.varDocs = new Array<any>();

          this.documentSearch = resp;

          this.documentSearch.forEach((document: Array<any>) => {
            document.forEach(attribute => {
              if (attribute.rep == 1) {
                this.repAttr = attribute

              }
            })
          })

          const p = resp
          const totalePages = resp['totalPages'];
          console.log(resp);

          p.forEach(element => {
            this.dataDoc = new Object({
              ref: "",
              dt: "",
              titre: ""
            })
            element.forEach(el => {
              if (el.key == this.dt) {
                this.dataDoc['dateS'] = el.value
              }
              if (el.rep == 1) {

                let data = new Array();

                if (el.key == "ListDep" || el.key == "listDb" || el.key == "List") {
                  data = JSON.parse(el.defaultValue)
                  data?.forEach(res => {
                    if (res.key == el.value) {
                      this.dataDoc['titre'] = res.value
                    }
                  })

                } else {

                  this.dataDoc['titre'] = el.value

                }

              }

            });
            this.varDocs.push(this.dataDoc);
          });
          this.totalCheck = resp.length - 1;
          this.resultTotal = resp.length - 1;
          this.pages = new Array<number>();

          this.documentSearch.forEach(element => {
            element.forEach(element1 => {
              if (element1['key'] == 'ids') {

                if (element1['value']) {
                  this.allIds = new Array<string>();

                  this.allIds = JSON.parse(element1['value'])

                }

              } else if (element1["key"] == "count") {
                if (element1['value']) {
                  this.resultTotal = element1.value
                  var a = Math.abs(element1.value / 12)
                  for (let index = 0; index <= a; index++) {
                    this.pages[index] = index;
                  }
                }
                this.documentSearch.splice(this.documentSearch.indexOf(element), 1)


              }
            });

          });

          this.documentSelected.emit();
          this.reload.event.subscribe(res => {

            this.isResult = false;
          })
        }
        else
          this.totalCheck = -2
      })

    }

    containsAny(source, target) {

      var result = source.filter((item) => { return target.indexOf(item) > -1 });
      return (result.length == target.length);
    }


    get isPageSeleced() {

      const result = [];
      this.documentSearch.forEach((el) => {
        const id = this.getValue('id', el)

        result.push(id)

      })


      return this.containsAny(this.selectedDocs, result)

    }

    getDocToUp(doc) {

    //   var id
    //   doc.forEach(element => {
    //     if (element.key == "id") {
    //       id = element.value;
    //     }

    //   });
    //   this.srvDoc.hasAccessToEdit(id).subscribe(r => {
    //     if (r == 1) {
    //       this.srv.docbyId(id).subscribe(resp => {
    //         const confRef = this.modal.open(EditDocComponent, { keyboard: false, centered: true, backdrop: 'static' })
    //         confRef.componentInstance.mode = "edit"
    //         const e = resp
    //         e['attributeValues'].sort(function (a, b) {
    //           return (a.attribute.id - b.attribute.id);
    //         });
    //         console.log(e)
    //         confRef.componentInstance.docup = resp;
    //         confRef.componentInstance.back.subscribe(r => {
    //           if (r == "ok") {
    //             this.goPage(this.page);

    //           }
    //         })
    //       })
    //     }
    //     else {
    //       this.openModalNoAcc();
    //     }
    //   })

    }
    openModalNoAcc() {
    //   const confRef = this.modal.open(ResultComponent, { keyboard: false, centered: true })
    //   confRef.componentInstance.title = this.config.c['documentSearch']["pasDaccestitre"]
    //   confRef.componentInstance.etat = -1
    //   confRef.componentInstance.text = this.config.c['documentSearch']["pasDaccestxt"]
    }
    totalePages: number;
    arrayOfpages = new Array<number>();

    goPage(i) {
      this.documentSearch = []
      this.btnPlusInfos(null)
      this.totalCheck = -1
      this.page = i;
      this.varDocs = new Array<any>();

      this.srv.searchDo(this.documentModel, i, this.size).subscribe((resp) => {

        console.log(resp)
        if (resp.length == 0 || resp[0].length == 0) {
          this.totalCheck = 0
          this.resultTotal = 0
        } else {
          this.totalCheck = 1
          this.documentSearch = resp;
          this.documentSearch.forEach((document: Array<any>) => {
            document.forEach(attribute => {
              if (attribute.rep == 1) {
                this.repAttr = attribute
                console.log(this.repAttr)
              }
            })
          })
          this.totalCheck = 1
          // this.resultTotal = resp.length - 1;
          console.log(resp)
          const p = resp
          p.forEach(element => {
            this.dataDoc = new Object({
              ref: "",
              dt: "",
              titre: ""
            })

            element.forEach(el => {
              if (el.key == this.dt) {
                this.dataDoc['dateS'] = el.value
              }
              // if(el.key=="Date")
              // {
              //   this.dataDoc['dt']=el.value
              // }
              if (el.rep == 1) {
                let data = new Array();

                if (el.key == "ListDep" || el.key == "listDb" || el.key == "List") {
                  data = JSON.parse(el.defaultValue)
                  data?.forEach(res => {
                    if (res.key == el.value) {
                      this.dataDoc['titre'] = res.value
                    }
                  })

                } else {
                  this.dataDoc['titre'] = el.value
                }
              }
            });
            this.varDocs.push(this.dataDoc);
          });
          this.page
          this.documentSearch.forEach(element => {
            element.forEach(element1 => {
              if (element1["key"] == "count") {

                this.documentSearch.splice(this.documentSearch.indexOf(element), 1)


              }
            });

          });

        }

      }
      )
    }
    supp(id: string) {
      this.srvDoc.delete(id).subscribe(res => { if (res) { alert("supprimé") } })
    }
    hide = false
    linkClick(dc) {

      this.documentSelected.emit(dc);
      this.hide = true


      //console.log(dc)
    }

    docList
    openModale(state?, target?, message?) {
    //   const modalRef = this.modal.open(OperationResultModalComponent, { keyboard: false, centered: true });
    //   modalRef.componentInstance.object = 'la document';
    //   modalRef.componentInstance.operation = target ?? this.config.c['documentSearch']["mod"];
    //   modalRef.componentInstance.result = state == 1 ? 'succès' : 'echoue';
    //   modalRef.componentInstance.name = '';
    //   modalRef.componentInstance.message = message;
    }
    // mode:string
    state
    select = false
    selectMode
    selectType(e) {
      this.select = e.target.checked
    }
    getValue(index, doc) {
      var id
      doc.forEach(element => {
        if (element.key == index) {
          id = element.value;
        }

      });


      return id;
    }
    selectedDocs: List<any> = new List<any>();
    addToList(e, d) {

      if (e.target.checked) {
        this.selectedDocs.add(this.getValue('id', d))
        // $('#actions').show(500);
      }
      else {
        this.selectedDocs.remove(this.getValue('id', d))

      }
      if (this.selectedDocs['j'].length == 0) {
        // $('#actions').toggle(500);
      }
    }
    viewMode = 0
    onDelete(dc) {
      var id

    //   dc.forEach(element => {
    //     if (element.key == "id") {
    //       id = element.value;
    //     }

    //   });
    //   this.srvDoc.hasAccessToDelete(id).subscribe(r => {
    //     if (r == 1) {
    //       const confRef = this.modal.open(ConfirmationComponent, { keyboard: false, centered: true });
    //       confRef.componentInstance.target = " " + this.config.c['documentSearch']["doc"];
    //       confRef.componentInstance.pass.subscribe(resp => {
    //         if (resp === 'yes') {


    //           this.srvDoc.delete(id).subscribe(res => {

    //             this.openModale(1, this.config.c['documentSearch']["supp"]);
    //             this.goPage(this.page)

    //           },
    //             err => {
    //               //this.openModale(0, 'Suppression', 'Le dossier est containe des documents veuillez vider premièrement')
    //             });

    //         }
    //         confRef.dismiss();
    //       });
    //     }
    //     else {
    //       this.openModalNoAcc();
    //     }
    //   })

    }
    deleteDocs() {
    //   var id = this.selectedDocs['j'][0]
    //   this.srvDoc.hasAccessToDelete(id).subscribe(r => {
    //     if (r == 1) {
    //       const confRef = this.modal.open(ConfirmationComponent, { keyboard: false, centered: true });
    //       confRef.componentInstance.target =
    //         this.selectedDocs['j'].length == 1 ? +this.config.c['documentSearch']["doc"] : this.config.c['documentSearch']["suppDocs"]
    //       confRef.componentInstance.pass.subscribe(resp => {
    //         if (resp === 'yes') {


    //           this.srvDoc.deleteDocs(this.selectedDocs['j']).subscribe(res => {

    //             this.openModale(1, this.config.c['documentSearch']["supp"]);
    //             this.goPage(this.page)
    //             this.selectedDocs = new List<any>()
    //           },
    //             err => {
    //               //this.openModale(0, 'Suppression', 'Le dossier est containe des documents veuillez vider premièrement')
    //             });

    //         }
    //         confRef.dismiss();
    //       });
    //     }
    //     else {
    //       this.openModalNoAcc();
    //     }
    //   })

    }
    btnPlusInfos(infos) {


      this.filterDocument = infos

      this.filterDocument?.forEach(element => {
        let data = new Array();
        if (element.type != null) {
          if (element.type.name == "ListDep" || element.type.name == "listDb" || element.type.name == "List") {
            data = JSON.parse(element.defaultValue)
            data?.forEach(res => {
              if (res.key == element.value) {
                element.value = res.value
              }
            })
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
    setDocId(dc) {
    //   var id = this.getId(dc)

    //   this.srv.setFoldersBydoc(id);

    //   this.srv.getFoldersBydoc(id, 0).subscribe(r => {
    //     if (r["totalElements"] > 0) {

    //       const confRef = this.modal.open(FoldersLinkComponent, { keyboard: false, centered: true, size: 'xl' });
    //     }
    //     else {
    //       const confRef = this.modal.open(ResultComponent, { keyboard: false, centered: true })
    //       confRef.componentInstance.title = this.config.c['documentSearch']["linkTitle"];
    //       confRef.componentInstance.text = this.config.c['documentSearch']["linkText"]
    //       confRef.componentInstance.etat = -1;
    //     }
    //   })

    }
    back() {

      this.rt.navigateByUrl('/apps/courrier-recents');
    }

    downloadFile(d) {

      if (!this.checkDoc(d)) return
      this.viewerService.downloadFile(this.getId(d)).subscribe(res => {
        this.file = res; //console.log(this.file);
        this.fileType = this.file.contentType.split('/')[0];
        const b64Data = this.file.fileData as string;
        const contentType = this.file.contentType;
        const byteCharacters = atob(b64Data.split(',')[1]);
        const byteArrays = [];

        for (let offset = 0; offset < byteCharacters.length; offset += 512) {
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
        link.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true, view: window }));


      })

    }

    sendDocs() {
    //   //console.log("sedsssssssssssssssssssssss")
    //   const down = this.modal.open(MailSecurityComponent, { keyboard: false, centered: true, backdrop: 'static' })
    //   down.componentInstance.docs = this.selectedDocs['j']

    }
    //ZIP
    downloadzip() {

    //   const down = this.modal.open(DownloadFileNameComponent, { keyboard: false, centered: true, backdrop: 'static' })
    //   down.componentInstance.docs = this.selectedDocs['j']
    //   down.componentInstance.saved.subscribe(r => {
    //     if (r == 'done') {
    //       this.selectedDocs = new List<any>();
    //     }
    //   })
    }
    //SEND EMAIL POPUP


    send(d) {
    //   if (!this.checkDoc(d)) return
    //   const confRef = this.modal.open(SendDocumentComponent, { keyboard: false, centered: true, backdrop: 'static' })
    //   confRef.componentInstance.id = this.getId(d);

    }

    // FULL TEXT PART
    documents
    showDocuments
    myFile;
    txt;
    change() {
      this.searchtype = !this.searchtype
      // this.cleartxt();

    }

    getRes(e) {


      console.log(e);

      document.getElementById('fulltxt')['value'] = (e as string)[(e as string).length - 1] === '.' ? (e as string).substring(0, (e as string).length - 2) : (e as string);
      //console.log(e)
    }
    getState(e) {
      if (e == "end") {

        setTimeout(() => {
          this.voiceS = false;
          setTimeout(() => {
            let btn = document.getElementById("ftxt_search_btn")
            btn.dispatchEvent(new MouseEvent("click"));
          }, 100);
        }, 500);
      }
    }
    textResult(p) {
      this.documents = []
      this.isResult = true;
      this.page = p
      this.txt = document.getElementById('fulltxt')['value']
      if (this.txt == " ") {
        this.txt = ""
      }
      this.srv.searchFullText(this.txt, p).subscribe(r => {

        console.log(r)
        this.documents = r['content']
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
        }
        else {
          this.showDocuments = true;

        }

      }, err => {
        this.resultTotal = 0
      })
    }

    goPageT(p) {
      sessionStorage.setItem("last_full_text", this.txt)
      this.isResult = true;
      this.page = p - 1

      this.srv.searchFullText(this.txt, this.page).subscribe(r => {


        this.documents = r['content']
        const totalePages = r['totalPages'];
        this.pages = new Array<number>(totalePages);
        this.resultTotal = r['totalElements'];
        for (let index = 0; index < totalePages; index++) {
          this.pages[index] = index;

        }
        //console.log(this.pages.length)
        if (r['numberOfElements'] == 0) {
          this.showDocuments = false;
        }
        else {
          this.showDocuments = true;

        }

      })
    }
    openViewerF(id, fileName) {
    //   sessionStorage.setItem("last_full_text", this.txt)

    //   const viewRef = this.modal.open(ViewerComponent, { keyboard: false, size: 'xl', centered: true, backdrop: 'static' })
    //   viewRef.componentInstance.documentId = id;
    //   return
    //   this.file.fileId = id;
    //   this.file.fileName = fileName;
    //   this.ws.openFile(this.file);
    }
    sendF(d) {
    //   const confRef = this.modal.open(SendDocumentComponent, { keyboard: false, centered: true, backdrop: 'static' })
    //   confRef.componentInstance.id = d.id;


    }

    selectAlll(e) {
      this.allIds.forEach((el) => {
        const id = el
        if (this.selectedDocs.indexOf(id) == -1)
          this.selectedDocs.add(id);

      });

    }
    unSelectAll() {
      this.selectedDocs = new List<any>();

    }

    selectAll(e) {

      this.documentSearch.forEach((el) => {
        const id = this.getValue('id', el)
        if (this.selectedDocs.indexOf(id) == -1)
          this.selectedDocs.add(id);
      });

      // console
      //console.log(this.selectedDocs)
    }

    downloadFileF(id) {

      // GET DOCUMENT

      this.viewerService.downloadFile(id).subscribe(res => {
        this.myFile = res;
        this.fileType = this.myFile.contentType.split('/')[0];
        const b64Data = this.myFile.fileData as string;
        const contentType = this.myFile.contentType;
        const byteCharacters = atob(b64Data.split(',')[1]);
        const byteArrays = [];

        for (let offset = 0; offset < byteCharacters.length; offset += 512) {
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

        link.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true, view: window }));


      })

    }

    getDocToUpF(e: Document) {
    //   this.srvDoc.hasAccessToEdit(e.id).subscribe(r => {
    //     if (r == 1) {
    //       this.srv.docbyId(e.id).subscribe(resp => {
    //         const confRef = this.modal.open(EditDocComponent, { keyboard: false, centered: true, backdrop: 'static' })
    //         confRef.componentInstance.mode = "edit"
    //         confRef.componentInstance.docup = e;
    //         confRef.componentInstance.back.subscribe(r => {
    //           if (r == "ok") {
    //             this.goPage(this.page);

    //           }
    //         })
    //       })
    //     }
    //     else {
    //       this.openModalNoAcc();
    //     }
    //   })


    }
    versionF(dc, type) {
    //   const modalRef = this.modal.open(VersionDocListComponent, { keyboard: false, centered: true, size: 'xl', backdrop: 'static' });
    //   modalRef.componentInstance.document = dc;
    //   modalRef.componentInstance.type = type;

    }
    onDeleteF(id) {
    //   this.srvDoc.hasAccessToDelete(id).subscribe(r => {
    //     if (r == 1) {
    //       const confRef = this.modal.open(ConfirmationComponent, { keyboard: false, centered: true });
    //       confRef.componentInstance.target = this.config.c['documentSearch']["doc"];
    //       confRef.componentInstance.pass.subscribe(resp => {
    //         if (resp === 'yes') {


    //           this.srvDoc.delete(id).subscribe(res => {

    //             this.openModale(1, this.config.c['documentSearch']["supp"]);
    //             this.goPage(this.page)

    //           },
    //             err => {
    //               //this.openModale(0, 'Suppression', 'Le dossier est containe des documents veuillez vider premièrement')
    //             });

    //         }
    //         confRef.dismiss();
    //       });
    //     }
    //     else {
    //       this.openModalNoAcc();
    //     }
    //   })

    }
    speechToggle(any) {
    //   if (!window.navigator.onLine) {

    //     const noConRef = this.modal.open(NonConnectionComponent, { keyboard: false, centered: true, backdrop: 'static' })
    //     noConRef.componentInstance.title = "Erreur d'internet"
    //     noConRef.componentInstance.message = "La reconnaissance vocale requiert une connexion internet"


    //   }
    //   else {
    //     this.voiceS = !this.voiceS;

    //     if (this.voiceS) {
    //       any.speechReco.start();
    //     }
    //     else
    //       any.speechReco.stop();
    //   }

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
      this.attributes.forEach(r => {
        if (r.name == name) {
          name = r.libelle
          console.log(r.libelle);

          return r.libelle
        }
      })
    }

    //icons Mapping
    getFontAwesomeIconFromMIME(mimeType) {
      let icon_classes = {
        // Media
        image: 'fas fa-file-image-o',
        audio: 'fas fa-file-audio-o',
        video: 'fas fa-file-video-o',
        // Documents
        'application/pdf': 'fas fa-file-pdf-o text-danger',
        'application/msword': 'fas fa-file-word-o text-primary',
        'application/vnd.ms-word': 'fas fa-file-word-o text-primary',
        'application/vnd.oasis.opendocument.text':
          'fas fa-file-word-o text-primary',
        'application/vnd.openxmlformats-officedocument.wordprocessingml':
          'fas fa-file-word-o text-primary',
        'application/vnd.ms-excel': 'fas fa-file-excel-o text-success',
        'application/vnd.openxmlformats-officedocument.spreadsheetml':
          'fas fa-file-excel-o text-success',
        'application/vnd.oasis.opendocument.spreadsheet':
          'fas fa-file-excel-o text-success',
        'application/vnd.ms-powerpoint': 'fas fa-file-powerpoint-o text-warning',
        'application/vnd.openxmlformats-officedocument.presentationml':
          'fas fa-file-powerpoint-o text-warning',
        'application/vnd.oasis.opendocument.presentation':
          'fas fa-file-powerpoint-o text-warning',
        'text/plain': 'fas fa-file-text-o',
        'text/html': 'fas fa-file-code-o',
        'application/json': 'fas fa-file-code-o',
        // Archives
        'application/gzip': 'fas fa-file-archive-o',
        'application/zip': 'fas fa-file-archive-o',
      };


      if (!mimeType || mimeType == 'null') {
        return 'far fa-times-circle  text-primary';
      }
      for (var key in icon_classes) {
        if (icon_classes.hasOwnProperty(key)) {
          if (mimeType.search(key) === 0) {
            // Found it
            return icon_classes[key];
          }
        } else {


        }
      }
      return 'fas fa-file-alt text-primary';
    }
    checkDoc(doc) {


      var fileName = this.getValue('fileName', doc);
      if (fileName == 'none' || fileName == null || fileName == 'null')
        return false

      return true;
    }

    filename: String;
    filenameArray = new Array();
    exportWordPdf(documentF) {

      this.rest.convertWordToPdf(documentF["0"]["value"]).subscribe(res => {
        this.myFile = res;
        //this.fileType = this.myFile.contentType.split('/')[0];
        const b64Data = this.myFile["pdf"];
        //const contentType = this.myFile.contentType;
        const byteCharacters = atob(b64Data);
        const byteArrays = [];

        for (let offset = 0; offset < byteCharacters.length; offset += 512) {
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
        this.filename = this.myFile["filename"]
        this.filenameArray = this.filename.split(".")
        link.download = this.filenameArray[0] + ".pdf";

        link.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true, view: window }));
      });

    }
}
