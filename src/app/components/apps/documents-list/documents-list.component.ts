import {
    Component,
    ElementRef,
    Inject,
    OnDestroy,
    OnInit,
    ViewChild,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslocoModule, TranslocoService } from '@ngneat/transloco';
import { MaterialModuleModule } from 'shared/material-module/material-module.module';
import { FileModel } from 'app/components/models/file.model';
import { environment } from 'environments/environment.development';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { ToastrService } from 'ngx-toastr';
import { ConfigService } from 'app/components/services/config.service';
import { DataSharingService } from 'app/components/services/data-sharing.service';
import { FolderService } from 'app/components/services/folder.service';
import { RestDataApiService } from 'app/components/services/rest-data-api.service';
import { WsService } from 'app/components/sockets/ws.service';
import { EditDocumentService } from 'app/components/services/edit-document.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ViewerService } from 'app/components/services/viewer.service';
import { Folder } from 'app/components/models/folder.model';
import { List } from 'gojs';
import { MatDrawer } from '@angular/material/sidenav';
import { FolderComponent } from '../folder/folder.component';
import { NgxPaginationModule } from 'ngx-pagination';
import { PreviousRouteService } from 'app/components/services/previous-route.service';
import { Location } from '@angular/common';
import { MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { EditDocComponent } from 'app/components/dialogs/edit-doc/edit-doc.component';
import { DownloadFileNameComponent } from 'app/components/dialogs/download-file-name/download-file-name.component';
import { AddDocumentPopupComponent } from 'app/components/dialogs/add-document-popup/add-document-popup.component';
import { ConfirmationComponent } from 'app/components/dialogs/confirmation/confirmation.component';
import { VersionDocListComponent } from 'app/components/dialogs/version-doc-list/version-doc-list.component';
import { ResultCourrierComponent } from 'app/components/dialogs/result-courrier/result-courrier.component';
import { ResultComponent } from 'app/components/dialogs/result/result.component';
import { SendDocumentComponent } from 'app/components/dialogs/send-document/send-document.component';
import { OperationResultDialogComponent } from 'app/components/dialogs/operation-result-dialog/operation-result-dialog.component';
import { ViewerComponent } from '../../dialogs/viewer/viewer.component';
import { MoveDocumentFromFolderComponent } from 'app/components/dialogs/move-document-from-folder/move-document-from-folder.component';
import { UpdateCourrierRecentComponent } from 'app/components/dialogs/update-courrier-recent/update-courrier-recent.component';
@Component({
    selector: 'app-documents-list',
    standalone: true,
    imports: [
        CommonModule,
        TranslocoModule,
        MaterialModuleModule,
        FolderComponent,
        NgxPaginationModule,
    ],
    templateUrl: './documents-list.component.html',
    styleUrl: './documents-list.component.scss',
})
export class DocumentsListComponent implements OnInit, OnDestroy {
    isDropdownOpen : boolean = false;
    @ViewChild('actions', { static: false }) actionsRef!: ElementRef;
    showActionsState = false;
    @ViewChild('matDrawer') matDrawer!: MatDrawer;
    doc: Document;
    folder;
    showFolders = false;
    noData = false;
    file = new FileModel();
    documents = new Array<any>();
    documentInfos;
    folderChilds: Folder[];
    totalePages: number;
    page = 0;
    pages: number[];
    pageSize;
    foldersPath: Folder[];
    totalFolderPages: number;
    folderPage = 0;
    currentDisplay = 1;
    hideExportation = environment.hideExportation;
    docToSend: Document = new Document();
    public favoriteFoldersIds: string[];
    public isLoading: boolean;
    varDocs = new Array<any>();
    row;
    showDocuments: boolean = false;
    myFile;
    fileType: string;
    isloading = false;
    allIds: Array<String> = new Array();
    filterDocument: Array<any> = new Array();
    documentIconShow = environment.documentIconShow;
    tpName: string;
    u: any;
    changeDisplay(e) {
        this.currentDisplay = e;
    }
    constructor(
        private sanitizer: DomSanitizer,
        private toastr: ToastrService,
        public config: ConfigService,
        public share: DataSharingService,
        private folderService: FolderService,
        private rest: RestDataApiService,
        public ws: WsService,
        private srvDoc: EditDocumentService,
        private rt: Router,
        private dialog: MatDialog,
        private prevouis: PreviousRouteService,
        private viewerService: ViewerService,
        private activeRoute: ActivatedRoute,
        private loc: Location,
         private translocoService: TranslocoService
    ) {
        this.foldersPath = new Array<Folder>();

    }
    ngOnDestroy(): void {
        localStorage.removeItem('list');
        localStorage.removeItem('curent');
    }
    fromSearch = false;
    showActions() {
        if (!this.actionsRef) return;
        const el = this.actionsRef.nativeElement;
        el.style.display = 'flex';
        setTimeout(() => {
            el.style.opacity = '1';
        }, 0);
    }

    hideActions() {
        if (!this.actionsRef) return;
        const el = this.actionsRef.nativeElement;
        el.style.opacity = '0';
        setTimeout(() => {
            el.style.display = 'none';
        }, 500);
    }
    ngOnInit(): void {
        this.isLoading = true;
        // this.u = JSON.parse(sessionStorage.getItem('uslog'));
        this.u = JSON.parse(localStorage.getItem('uslog') || '{}');

        if (localStorage.getItem('list')) {
            this.foldersPath = new Array<Folder>();
            this.foldersPath = JSON.parse(localStorage.getItem('list'));
        }
        console.log(this.foldersPath);
        if (this.share.folderToOpen) {
            localStorage.setItem(
                'current',
                JSON.stringify(this.share.folderToOpen)
            );
            this.foldersPath.push(this.share.folderToOpen);
        }
        if (localStorage.getItem('current')) {
            this.share.folderToOpen = JSON.parse(
                localStorage.getItem('current')
            );
            this.folder = this.share.folderToOpen;
        }
        console.log(this.folder);
        // this.foldersPath.forEach(e=>{
        //   if(e.id==this.share.folderToOpen.id)

        // })

        this.activeRoute.queryParams.subscribe((params) => {
            if (params['search'] != undefined) {
                this.fromSearch = true;
            }
        });
        console.log(this.fromSearch);

        localStorage.setItem('list', JSON.stringify(this.foldersPath));
        // this.retrieveFolderDocuments(this.folder.id, this.folderPage);
        // this.retrieveFolderChilds(this.folder.id, this.folderPage);
        this.init(this.folder.id, this.folderPage);
    }

    init(folderId, page) {
        this.totalCheck = -1;

        this.rest.getFolderChilds(folderId, page, 6).subscribe((res) => {
            this.folderChilds = res['content'];
            //console.log(res)
            this.totalFolders = res['totalElements'];
            this.totalFolderPages = res['totalPages'];

            if (res['numberOfElements'] == 0) {
                this.showFolders = false;
            } else {
                this.showFolders = true;
            }

            this.rest
                .getFolderDocuments(folderId, page, this.showFolders ? 8 : 12)
                .subscribe((res) => {
                    this.varDocs = new Array<any>();
                    const p = res['content'];
                    this.attrLib = new Object({
                        ref: '',
                        dt: '',
                        titre: {
                            fr: '',
                            ar: '',
                            eng: '',
                        },
                    });

                    this.rest
                        .getFolderDocuments(folderId, this.page, this.totalDocs)
                        .subscribe((res) => {
                            res['content'].forEach((element) => {
                                this.allIds.push(element['document']['id']);
                            });
                        });

                    p.forEach((element) => {
                        this.dataDoc = new Object({
                            ref: '',
                            dt: '',
                            titre: {
                                fr: '',
                                ar: '',
                                eng: '',
                            },
                        });
                        element.document.attributeValues.forEach((el) => {
                            if (el.attribute.rep == 1) {
                                let data = new Array();

                                if (
                                    el.attribute.name == 'ListDep' ||
                                    el.attribute.name == 'listDb' ||
                                    el.attribute.name == 'List'
                                ) {
                                    data = JSON.parse(
                                        el.attribute.defaultValue
                                    );
                                    data?.forEach((res) => {
                                        if (res.key == el.value.value) {
                                            this.dataDoc['titre'] = res.value;
                                        }
                                    });
                                } else {
                                    this.dataDoc['titre'] = el.value.value;
                                }

                                this.attrLib['titre'] = {
                                    fr: el.attribute.labelfr,
                                    ar: el.attribute.labelar,
                                    eng: el.attribute.labeleng,
                                };

                                this.varDocs.push(this.dataDoc);
                            }
                        });
                    });
                    this.documents = res['content'];
                    this.totalEl = res['totalElements'];
                    this.totalDocs = res['totalElements'];
                    const totalePages = res['totalPages'];
                    this.pages = new Array<number>(totalePages);
                    if (res['numberOfElements'] == 0) {
                        this.showDocuments = false;
                        this.noData = true;
                    } else {
                        this.showDocuments = true;
                    }

                    console.log(this.documents);

                    this.isloading = false;
                    this.totalCheck = 1;
                });
        });
    }
    totalCheck = -1;
    sendIt(dc) {
        // if (dc.contentType) {
        //   const confRef = this.modal.open(SendDocInterneComponent, {
        //     keyboard: false,
        //     centered: true,
        //     backdrop: 'static',
        //   });
        //   confRef.componentInstance.id = dc.id;
        // }
    }
    isfav = false;

    click(folder) {
        this.isfav = false;
        folder.favoriteBay.split('/').forEach((ui) => {
            if (this.u?.userId?.toString() === ui) {
                this.isfav = true;
            }
        });
    }


    dataDoc: Object;
    attrLib: Object = new Object({
        ref: '',
        dt: '',
        titre: {
            fr: '',
            ar: '',
            eng: '',
        },
    });

    // exportDocument(document, folderId) {
    //     console.log("DONE")
    //     this.rest.ExportDocCm(document.id, folderId).subscribe((res) => {
    //         if (res == true) {
    //             this.openModaleMsg(
    //                 "Succès",
    //                 "le document a été exporté avec succès en Cm",
    //                 1
    //             );

    //             this.init(folderId, this.page);
    //         } else {
    //             this.openModaleMsg(
    //                 "Erreur",
    //                 "Il y a une erreur dans l'exportation",
    //                 -1
    //             );
    //         }
    //     });
    // }
    exportDocument(document, folderId) {
    this.rest.ExportDocCm(document.id, folderId).subscribe(res => {
      if (res == true) {
        this.openModaleMsg(
        "Succès",
        "le document a été exporté avec succès en Cm",
                    1
        )

        this.init(folderId, this.page)
      } else {
        this.openModaleMsg(
        "Erreur",
        "Il y a une erreur dans l'exportation",
        -1
        )
      }
    });
  }

    // openModaleMsg(title?, txt?, et?) {
    //     const modalRef = this.modal.open(ResultComponent, {
    //       keyboard: false,
    //       centered: true,
    //     });
    //     modalRef.componentInstance.title = title;
    //     modalRef.componentInstance.text = txt;
    //     modalRef.componentInstance.etat = et;
    // }
    openModaleMsg(title?: string, txt?: string, et?: any): void {
    this.dialog.open(ResultComponent, {
    disableClose: true,
    autoFocus: false,
    data: {
      title,
      text: txt,
      etat: et,
    },
    });
}

    retrieveFolderDocuments(folderId, page) {
        //this.selectedDocs = new List<any>();
        this.totalCheck = -1;
        this.rest
            .getFolderDocuments(folderId, page, this.showFolders ? 8 : 12)
            .subscribe((res) => {
                this.varDocs = new Array<any>();
                const p = res['content'];
                this.attrLib = new Object({
                    ref: '',
                    dt: '',
                    titre: {
                        fr: '',
                        ar: '',
                        eng: '',
                    },
                });
                p.forEach((element) => {
                    this.dataDoc = new Object({
                        ref: '',
                        dt: '',
                        titre: '',
                    });
                    element.document.attributeValues.forEach((el) => {
                        if (el.attribute.rep == 1) {
                            this.dataDoc['titre'] = el.value.value;
                            this.attrLib['titre'] = {
                                fr: el.attribute.labelfr,
                                ar: el.attribute.labelar,
                                eng: el.attribute.labeleng,
                            };

                            this.varDocs.push(this.dataDoc);
                        }
                    });
                });

                this.documents = res['content'];
                this.totalEl = res['totalElements'];
                this.totalDocs = res['totalElements'];
                const totalePages = res['totalPages'];
                this.pages = new Array<number>(totalePages);
                if (res['numberOfElements'] == 0) {
                    this.showDocuments = false;
                } else {
                    this.showDocuments = true;
                }
                this.totalCheck = 1;
                console.log(this.documents);
            });
    }
    totalFolders;
    totalDocs;
    totalCheckF = -1;
    retrieveFolderChilds(folderParentId, page) {
        this.totalCheck = -1;

        this.rest
            .getFolderChilds(folderParentId, page, 6)
            .subscribe((res) => {
                this.folderChilds = res['content'];
                this.totalFolders = res['totalElements'];
                this.totalFolderPages = res['totalPages'];
                this.totalCheckF = 1;

                if (res['numberOfElements'] == 0) {
                    this.showFolders = false;
                } else {
                    this.showFolders = true;
                }
                this.isloading = false;
            })
            .add(() => {
                this.totalCheck = 1;
            });
    }



    // openViewer(id: any, fileName: string, mimeType: string): void {
    //     if (!fileName || fileName === 'none' || !mimeType) return;

    //     if (this.checkMimeType(mimeType) !== -1) {
    //       this.dialog.open(ViewerComponent, {
    //         disableClose: true,
    //         autoFocus: false,
    //         data: {
    //           documentId: id,
    //           fileName: fileName,
    //           mimeType: mimeType,
    //         },
    //       });
    //       return;
    //     } else {
    //       if (environment.hideToast) {
    //         this.toastr.info(
    //               "Le format du fichier choisi n'est pas supporté par la visionneuse",
    //               "Format non supporté"
    //         );
    //       }
    //       this.downloadFile(id);
    //     }
    //   }

    openViewer(id: number, fileName: string, mimeType: string): void {
  if (fileName === 'none' || !fileName || !mimeType) return;

  if (this.checkMimeType(mimeType) !== -1) {
    const dialogRef = this.dialog.open(ViewerComponent, {
      disableClose: true,
      data: { documentId: id }
    });

    return;
  }

  if (environment.hideToast) {
            this.toastr.info(
                  "Le format du fichier choisi n'est pas supporté par la visionneuse",
                  "Format non supporté"
            );
  }

  this.downloadFile(id);
}



    totalEl;

    goPage(i) {
        this.page = i;
        this.retrieveFolderDocuments(this.folder.id, this.page);
    }

    btnPlusInfos(infos) {
        this.filterDocument = infos;

        if (this.filterDocument) {
            this.filterDocument['attributeValues']?.forEach((attribute) => {
                let data = new Array();
                if (attribute.attribute.type != null) {
                    if (
                        attribute.attribute.type.name == 'ListDep' ||
                        attribute.attribute.type.name == 'listDb' ||
                        attribute.attribute.type.name == 'List'
                    ) {
                        data = JSON.parse(attribute.attribute.defaultValue);
                        data?.forEach((res) => {
                            if (res.key == attribute.value.value) {
                                attribute.value.value = res.value;
                            }
                        });
                    }
                }
            });
        }

        if (this.documentInfos == infos) {
            //   $('#plusInfos').hide(1000);
            this.documentInfos = null;
        } else {
            this.documentInfos = infos;
            //   $('#plusInfos').show(1000);
        }

        // }
    }
    pageF;
    delete(id: number): void {
        this.srvDoc.hasAccessToDeleteN(id).subscribe((r) => {
          if (r === 1) {
            const confRef = this.dialog.open(ConfirmationComponent, {
              disableClose: true,
              data: {
                target: "Processus"
              }
            });

            confRef.componentInstance.pass.subscribe((resp: string) => {
              if (resp === 'yes') {
                this.rest.deleteFolder(id).subscribe((res) => {
                  this.dialog.open(ResultCourrierComponent, {
                    disableClose: true,
                    data: {
                      title: 'Supprimé avec succès'
                    }
                  });

                  this.retrieveFolderDocuments(this.folder.id, this.page);
                  this.retrieveFolderChilds(this.folder.id, this.folderPage);
                });
              }
              confRef.close();
            });
          } else {
            this.openModalNoAcc();
          }
        });
      }
    editFolder(folder) {
        this.srvDoc.hasAccessToEditN(folder.id).subscribe((r) => {
            if (r === 1) {
                const dialogRef = this.dialog.open(UpdateCourrierRecentComponent, {
                  disableClose: true,
                  data: { folder: folder }
                });

                dialogRef.componentInstance.Back.subscribe((result: string) => {
                  if (result === 'ok') {
                    this.retrieveFolderDocuments(this.folder.id, this.page);
                    this.retrieveFolderChilds(this.folder.id, this.folderPage);
                  }
                });
              }else {
                this.openModalNoAcc();
            }
        });
    }

    openModalNoAcc(): void {
        const dialogRef = this.dialog.open(ResultComponent, {
          disableClose: true,
          data: {
            title: 'Pas d\'accès',
            etat: -1,
            text: 'Vous n\'êtes pas autorisé à effectuer cette opération.'
          }
        });
      }

    unlinkDocument(id: number): void {
        const dialogRef = this.dialog.open(ConfirmationComponent, {
            disableClose: true,
            data: {
                target: 'tte liaison',
            },
        });
        dialogRef.componentInstance.pass.subscribe((resp: string) => {
            if (resp === 'yes') {
                this.rest
                    .unlinkDocument(id, this.folder['id'])
                    .subscribe(() => {
                        this.retrieveFolderDocuments(this.folder.id, this.page);
                    });
            }
            dialogRef.close();
        });
    }

    getDocToUp(e: any) {
        console.log("DDD")
        this.srvDoc.hasAccessToEdit(e.id).subscribe((r) => {
          if (r === 1) {
            e.attributeValues.sort((a, b) => a.attribute.id - b.attribute.id);
            const dialogRef = this.dialog.open(EditDocComponent, {
              disableClose: true,
              data: {
                docup: e,
                mode: 'edit'
              }
            });
            dialogRef.afterClosed().subscribe((result) => {
              if (result === 'ok') {
                this.goPage(this.page);
                this.documentInfos = '';
              }
            });

          } else {
            this.openModalNoAcc();
          }
        });
      }


    previousFolders() {
        if (this.folderPage > 0) {
            this.folderPage--;
            this.retrieveFolderChilds(this.folder.id, this.folderPage);
        }
    }
    nextFolders() {
        if (this.folderPage < this.totalFolderPages) {
            this.folderPage++;
            this.retrieveFolderChilds(this.folder.id, this.folderPage);
        }
    }


    openModale(state?: number, target?: string, message?: string): void {
        const dialogRef = this.dialog.open(OperationResultDialogComponent, {
          disableClose: true,
          data: {
            object: 'la document',
            operation: target ?? "Modification",
            result: state === 1 ? 'succès' : 'echoue',
            name: '',
            message: message
          }
        });

        dialogRef.afterClosed().subscribe(result => {
          console.log('Dialog closed', result);
        });
      }

    //SUPPRESSION DOCUMENT
    onDelete(id): void {
        const dialogRef = this.dialog.open(ConfirmationComponent, {
          disableClose: true,
          data: {
            target: "Document"
          }
        });

        dialogRef.componentInstance.pass.subscribe((resp: string) => {
          if (resp === 'yes') {
            this.srvDoc.delete(id).subscribe(
              (res) => {
                this.retrieveFolderDocuments(this.folder.id, this.page);
                this.retrieveFolderChilds(this.folder.id, this.folderPage);
              }
            );
          }
          dialogRef.close();
        });
      }
    //FOLDER CLICK
    goToChild(folder) {
        this.share.folderToOpen = folder;

        if (this.share.folderToOpen && !this.isloading) {
            this.isloading = true;
            this.folder = this.share.folderToOpen;
            this.foldersPath.push(this.share.folderToOpen);
            localStorage.setItem(
                'current',
                JSON.stringify(this.share.folderToOpen)
            );
            localStorage.setItem('list', JSON.stringify(this.foldersPath));
            this.init(this.folder.id, 0);
        }
    }
    // PATH CLICK
    goFolderPath(f, i) {
        if (i == 0) {
            this.foldersPath = new Array<Folder>();
        } else {
            const pathSize = this.foldersPath.length - 1;

            for (let j = 0; j < pathSize; j++) {
                if (j >= i - 1) this.foldersPath.pop();
            }
        }

        this.goToChild(f);
    }

    //RETOUR
    goBack() {
        console.log(this.foldersPath);
        if (this.foldersPath.length - 1 >= 1) {
            this.foldersPath.pop();
            const f = this.foldersPath[this.foldersPath.length - 1];
            this.foldersPath.pop();
            this.goToChild(f);
        } else {
            if (sessionStorage.getItem('retour') == 'fav') {
                this.rt.navigateByUrl('apps/courriers-favoris');
                sessionStorage.removeItem('retour');
            } else if (sessionStorage.getItem('reporting')) {
                this.rt.navigateByUrl('apps/reporting');
                sessionStorage.removeItem('reporting');
            } else if (sessionStorage.getItem('subordonne')) {
                this.rt.navigateByUrl('apps/courrier-equipe');
                sessionStorage.removeItem('subordonne');
            } else if (sessionStorage.getItem('retour') == 'recent') {
                this.rt.navigateByUrl('dashboards');
                sessionStorage.removeItem('retour');
            } else if (sessionStorage.getItem('fromShare') == 'true') {
                this.rt.navigateByUrl('apps/courriers-partages');
                sessionStorage.removeItem('fromShare');
            } else if (sessionStorage.getItem('courriers-a-traites') == 'true') {
                this.rt.navigateByUrl('apps/courriers-a-traites');
                sessionStorage.removeItem('courriers-a-traites');
            } else {
                if (!this.fromSearch) this.rt.navigateByUrl('dashboard');
                else {
                    if (sessionStorage.getItem('searchSave')) {
                        this.rt.navigateByUrl('/dashboards/search?filter=' +sessionStorage.getItem('searchSave')
                        );
                    } else
                        this.rt.navigateByUrl('/dashboards/search?filter={"type":"","sender":"","reference":"","refAuto":"","nature":"","deDate":"","toDate":"","order":"","objet":"","motif":"","instru":"","accuse":0,"finalise":null,"mode":-1}');
                }
            }
        }
    }
    //AJOUTER DOSSIER FAVORIS
    addToFavorite(folderId: number) {
        this.folderService.addToFavorite(folderId).subscribe((res) => {
            this.retrieveFolderChilds(this.folder.id, this.page);
        });
    }
    isFavorite(folder: Folder) {
        return this.favoriteFoldersIds.indexOf(folder.id) >= 0;
    }



    DeleteFavoritefolder(folderId: number) {
    this.folderService.deletefavoritefolder(folderId).subscribe((res) => {
      this.retrieveFolderChilds(this.folder.id, this.page);
    });
  }

    //Send doc by mail
    send(d: any): void {
        const dialogRef = this.dialog.open(SendDocumentComponent, {
          disableClose: true,
          data: { id: d.id },
        });

        dialogRef.afterClosed().subscribe(result => {
          console.log('The dialog was closed', result);
        });
      }


    //DONWLOAD
    downloadFile(id) {
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
    //AJOUTER DOCUMENT A PARTIR DE DOSSIER RECENT
    addDoc() {
        const dialogRef = this.dialog.open(AddDocumentPopupComponent, {
            data: {
                courrierId: this.folder.id,
                f: this.folder,
                courrierRef: this.folder.reference,
            },
        });

        dialogRef.componentInstance.resp.subscribe((arg) => {
            if (arg === 'ok') {
                this.retrieveFolderDocuments(this.folder.id, this.page);
            }
        });
    }

    //deplacer un document vers un autre dossier
    moveTo(d: any) {
        const dialogRef = this.dialog.open(MoveDocumentFromFolderComponent, {
          disableClose: true,
          data: {
            documentId: d.id,
            folderToRep: this.folder,
            folderParentId: this.folder.id,
            titre: this.getDocumentTitle(d)
          }
        });

        dialogRef.afterClosed().subscribe(result => {
          if (result === 'done') {
            this.retrieveFolderDocuments(this.folder.id, this.page);
          }
        });
      }

      private getDocumentTitle(d: any): string {
        const titreAttr = d.attributeValues.find((el: any) => el.attribute.name === 'Titre');
        return titreAttr
          ? `"Document à déplacer :" ${titreAttr.value.value}`
          : '';
      }
    //OPEN POPUP FOLDER ADD
    addFolder() {
        // const mdlRef = this.modal.open(AddFolderPopupComponent, {
        //   keyboard: false,
        //   centered: true,
        //   backdrop: 'static',
        // });
        // mdlRef.componentInstance.parentFolder = this.folder.id;
        // mdlRef.componentInstance.mode = 'addFolderToFolder';
        // mdlRef.componentInstance.Back.subscribe((r) => {
        //   if (r == 'ok') {
        //     this.retrieveFolderChilds(this.folder.id, this.page);
        //   }
        // });
    }
    //VERSION DOCUMENT
    version(dc: any, type: any): void {
    const dialogRef = this.dialog.open(VersionDocListComponent, {
        disableClose: true,
        data: {
        document: dc,
        type: type
        }
    });

    dialogRef.afterClosed().subscribe(result => {
    });
    }


    //PAGINATION FOLDERS
    goPageF(f) {
        this.folderPage = f;
        this.retrieveFolderChilds(this.folder.id, this.folderPage);
    }

    getValueByAttribute(docInd, nom) {
        docInd.attributeValues.forEach((element) => {
            if (element.attribute.name == nom) return element.value.value;
        });
        return '';
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


    currentDoc;
    base64;
    isPdf;
    uri: SafeResourceUrl = null;

    getDocImage(doc) {
        if (doc) {
            if (this.currentDoc?.id != doc.id) {
                this.uri = null;
                this.currentDoc = doc;
                this.viewerService.getFileToView(doc.id).subscribe(
                    (res) => {
                        this.base64 = res['fileData'];
                        if (doc['contentType'] == 'application/pdf') {
                            this.isPdf = true;
                        } else {
                            this.isPdf = false;
                            this.uri =
                                this.sanitizer.bypassSecurityTrustResourceUrl(
                                    'assets/ViewerJS/index.html#' +
                                        res['fileData']
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

    containsAny(source, target) {
        var result = source.filter((item) => {
            return target.indexOf(item) > -1;
        });
        return result.length == target.length;
    }

    get isPageSeleced() {
        const result = [];
        this.documents.forEach((el) => {
            const id = el['document'].id;

            result.push(id);
        });

        return this.containsAny(this.selectedDocs, result);
    }

    selectAlll(e) {
        console.log(this.allIds);

        this.allIds.forEach((el) => {
            const id = el;
            if (this.selectedDocs.indexOf(id) == -1) this.selectedDocs.add(id);
        });
    }

    unSelectAll() {
        this.selectedDocs = new List<any>();
    }

    selectAll(e) {
        this.documents.forEach((el) => {
            const id = el['document'].id;
            if (this.selectedDocs.indexOf(id) == -1) this.selectedDocs.add(id);
        });
    }
    selectedDocs: List<any> = new List<any>();
    addToList(e, d) {
        if (e.target.checked) {
            this.selectedDocs.add(d['id']);
            this.showActions();
        } else {
            this.selectedDocs.remove(d['id']);
        }
        if (this.selectedDocs.length == 0) {
            this.hideActions();
        }
    }

    isImageOrPdf(document: any): boolean {
        const contentType = document?.document?.contentType;
        return (
            contentType === 'application/pdf' ||
            contentType === 'image/jpeg' ||
            contentType === 'image/tiff'
        );
    }


    downloadzip() {
        console.log("this.selectedDocs['h']", this.selectedDocs['h']);
        console.log(' this.selectedDocs', this.selectedDocs);
        const dialogRef = this.dialog.open(DownloadFileNameComponent, {
            data: { docs: this.selectedDocs['h'] },
        });

        dialogRef.componentInstance.saved.subscribe((r) => {
            if (r === 'done') {
                this.selectedDocs = new List<any>();
            }
        });
    }

    dropdownOpen: number | null = null;

    toggleDropdown(row: number) {
        this.dropdownOpen = this.dropdownOpen === row ? null : row;
    }
    checkMimeType(doc) {
        const supportedMimes = environment.supportedMimeTypes.split(' ');
        return supportedMimes.indexOf(doc);
    }
    checkDoc(fileName) {
        if (fileName == 'none' || fileName == null || fileName == 'null')
            return false;
        return true;
    }

    filename: String;
    filenameArray = new Array();
    exportWordPdf(documentF) {
        this.rest
            .convertWordToPdf(documentF['document']['id'])
            .subscribe((res) => {
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

    drawerDetails: { label: string; value: any }[] = [];

    openDetailsDrawer(folder: any) {
        this.drawerDetails = [
            { label: this.translocoService.translate('courrierList.reference'), value: folder.reference },
            { label: this.translocoService.translate('courrierList.date'), value: folder.date },
            { label: this.translocoService.translate('courrierList.type'), value: folder.type },
            { label: this.translocoService.translate('courrierList.categorie'), value: folder.natureName || 'N/A' },
            { label: this.translocoService.translate('courrierList.emetteur'), value: folder.emet__ || 'N/A' },
            { label: this.translocoService.translate('courrierList.proprietaire'), value: folder.owner?.fullName || 'N/A' },
            { label: this.translocoService.translate('courrierList.objet'), value: folder.objet || 'N/A' },
        ];
        this.matDrawer.toggle();
        }


    closeDrawer() {
        this.matDrawer.toggle();
    }
}
