import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
    MAT_DIALOG_DATA,
    MatDialog,
    MatDialogRef,
} from '@angular/material/dialog';
import { Inject } from '@angular/core';
import { environment } from 'environments/environment.development';
import { ToastrService } from 'ngx-toastr';
import { ConfigService } from 'app/components/services/config.service';
import { AllConfigurationsService } from 'app/components/services/all-configurations.service';
import { RestDataApiService } from 'app/components/services/rest-data-api.service';
import { FolderService } from 'app/components/services/folder.service';
import { EditDocumentService } from 'app/components/services/edit-document.service';
import { ViewerService } from 'app/components/services/viewer.service';
import { MasterServiceService } from 'app/components/services/master-service.service';
import { NgxPaginationModule } from 'ngx-pagination';
import { MaterialModuleModule } from 'shared/material-module/material-module.module';
import { ConfirmationComponent } from '../confirmation/confirmation.component';
import { ViewerComponent } from 'app/components/dialogs/viewer/viewer.component';
import { AddDocumentPopupComponent } from '../add-document-popup/add-document-popup.component';
import { TranslocoModule, TranslocoService } from '@ngneat/transloco';
import { LoadingComponent } from '../loading/loading.component';
import { EditDocComponent } from '../edit-doc/edit-doc.component';
import { ResultComponent } from '../result/result.component';
import { SendDocumentComponent } from '../send-document/send-document.component';
import { ValidateEtapeComponent } from '../validate-etape/validate-etape.component';
import { DeclareLedgerComponent } from 'app/components/dialogs/declare-ledger/declare-ledger.component';
import { GenerateBordereauComponent } from 'app/components/dialogs/generate-bordereau/generate-bordereau.component';
import { AbondonneModalComponent } from 'app/components/dialogs/abondonne-modal/abondonne-modal.component';
import { ConfirmeStepComponent } from '../confirme-step/confirme-step.component';
import { SigStepComponent } from '../sig-step/sig-step.component';

@Component({
    selector: 'app-do-step-dialog',
    standalone: true,
    imports: [
        CommonModule,
        MaterialModuleModule,
        NgxPaginationModule,
        TranslocoModule,
    ],
    templateUrl: './do-step-dialog.component.html',
    styleUrl: './do-step-dialog.component.scss',
})
export class DoStepDialogComponent implements OnInit {
    isMenuOpen = false;
    ngDoCheck() {}
    @Input() courrier;
    @Input() etape;
    size: number = 24;
    @Output() done = new EventEmitter<any>();
    documentInfos;
    myFile;
    dep = environment.depart;
    pages: number[];
    valid = -1;
    filterDocument: Array<any> = new Array();
    depart = environment.depart;
    arrive = environment.arrive;
    hideDocumentAdd = environment.hideDocumentAdd;
    constructor(
        private toast: ToastrService,
        public config: ConfigService,
        public allConfigs: AllConfigurationsService,
        private viewerService: ViewerService,
        private rest: RestDataApiService,
        private masterService: MasterServiceService,
        private service: FolderService,
        private srvDoc: EditDocumentService,
        private dialog: MatDialog,
        private translocoService: TranslocoService,
        public dialogRef: MatDialogRef<DoStepDialogComponent>,
        @Inject(MAT_DIALOG_DATA) public data: any
    ) {
        this.courrier = data.courrier;
        this.etape = data.etape;

        console.log('courrier', this.courrier);
        console.log('this.etape', this.etape);
    }

    ngDoCh;

    openViewer(id, fileName, mimeType) {
        console.log('Done');
        if (fileName == 'none' || fileName == null || !mimeType) return;
        if (this.checkMimeType(mimeType) !== -1) {
            const dialogRef = this.dialog.open(ViewerComponent, {
                disableClose: true,
                data: { documentId: id },
            });
            return;
        } else {
            if (environment.hideToast) {
                this.toast.info(
                    'Format non supporté',
                    "Le format du fichier choisi n'est pas supporté par la visionneuse"
                );
            }
            this.downloadFile(id);
        }
    }

    validate() {
        if (this.etape.isLast === 0) {
            const dialogRef = this.dialog.open(ValidateEtapeComponent, {
                disableClose: true,
                data: {
                    etape: this.etape,
                    courrier: this.courrier,
                },
            });

            dialogRef.componentInstance.done.subscribe((r: string) => {
                if (r === 'ok') {
                    this.done.emit('ok');
                    dialogRef.close();
                }
            });
        } else {
            const confirmRef = this.dialog.open(ConfirmationComponent, {
                disableClose: true,
                data: {
                    target: this.config.c.validateStep.confirmeLast,
                    btn: this.config.c.index.validate,
                },
            });

            confirmRef.componentInstance.pass.subscribe((r: string) => {
                if (r === 'yes') {
                    const loadRef = this.dialog.open(LoadingComponent, {
                        disableClose: true,
                        data: {
                            message: 'Finalisation en cours...',
                            title: 'Envoi de courrier',
                        },
                    });

                    this.rest
                        .lastStepValidate(this.etape['id'], 0, 0)
                        .subscribe(
                            () => {
                                this.done.emit('ok');
                                loadRef.close();

                                if (
                                    this.allConfigs.LEDGER === '1' &&
                                    this.type.cat === this.dep &&
                                    this.documents.length > 0
                                ) {
                                    const ledgerRef = this.dialog.open(
                                        DeclareLedgerComponent,
                                        {
                                            disableClose: true,
                                            data: {
                                                recievers:
                                                    this.NoteligibleDestArray,
                                                eligible:
                                                    this.eligibleDestArray,
                                            },
                                        }
                                    );

                                    ledgerRef.componentInstance.back.subscribe(
                                        (resp: any) => {
                                            const ledgerLoad = this.dialog.open(
                                                LoadingComponent,
                                                {
                                                    disableClose: true,
                                                    data: {
                                                        message:
                                                            'Finalisation en cours...',
                                                        title: 'Envoi de courrier',
                                                    },
                                                }
                                            );

                                            const mail = resp.mails?.trim()
                                                ? resp.mails
                                                : null;

                                            this.rest
                                                .saveInLedger(
                                                    this.courrier.id,
                                                    mail,
                                                    resp.ledger
                                                )
                                                .subscribe(() => {
                                                    ledgerLoad.close();
                                                    this.genBord();
                                                });
                                        }
                                    );
                                } else {
                                    this.genBord();
                                }
                            },
                            () => {
                                this.done.emit('ok');
                            }
                        );
                }
            });
        }
    }

    addDoc() {
        let a = 5656;
        const dialogRef = this.dialog.open(AddDocumentPopupComponent, {
            disableClose: true,
            data: {
                courrierId: this.courrier.id,
                ftype: this.courrier.type_name,
                f: this.courrier,
                courrierRef: this.courrier.reference ?? 'Sans',
                pr: 0,
            },
        });
        dialogRef.afterClosed().subscribe((result) => {
            if (result === 'ok') {
                this.goPage(this.page);
            }
        });

        if (a === 5656) {
            const dialogRef = this.dialog.open(AddDocumentPopupComponent, {
                disableClose: true,
                data: {
                    courrierId: this.courrier.id,
                    ftype: this.courrier.type_name,
                    f: this.courrier,
                    pr: 0,
                },
            });
        }
    }

    // On Delete :
    onDelete(id): void {
        const dialogRef = this.dialog.open(ConfirmationComponent, {
            disableClose: true,
            data: {
                target: 'document',
            },
            autoFocus: false,
        });

        dialogRef.componentInstance.pass.subscribe((resp: string) => {
            if (resp === 'yes') {
                this.srvDoc.delete(id).subscribe(() => {
                    this.goPage(this.page);
                });
            }
            dialogRef.close();
        });
    }

    // genBord() {
    //     if (this.type.cat == this.dep && this.documents.length > 0) {
    //       const bo = this.modal.open(GenerateBordereauComponent, {
    //         keyboard: false,
    //         centered: true,
    //         backdrop: 'static',
    //       });
    //       bo.componentInstance.courrier = this.courrier.id;
    //       bo.componentInstance.back.subscribe((r) => {
    //         if (r == 'yes') {
    //           console.log(this.courrier.id)
    //           this.rest
    //             .generateAndSaveBO(this.courrier.id, 1)
    //             .subscribe((resBO) => {
    //               const view = this.modal.open(ViewerComponent, {
    //                 keyboard: false,
    //                 centered: true,
    //                 size: "xl",
    //                 backdrop: 'static',
    //               });
    //               view.componentInstance.mode = 'bo';
    //               view.componentInstance.base64 = resBO['base64'];
    //               view.componentInstance.name = this.courrier.reference;
    //               this.actmodal.close();
    //               this.done.emit('ok');
    //             });
    //         } else {
    //           this.actmodal.close();
    //         }
    //       });
    //     }
    //     else {
    //       this.done.emit('ok');
    //       this.actmodal.close();
    //     }
    // }
    genBord() {
        if (this.type.cat === this.dep && this.documents.length > 0) {
            const dialogRef = this.dialog.open(GenerateBordereauComponent, {
                disableClose: true,
                data: {
                    courrierId: this.courrier.id,
                },
            });

            dialogRef.afterClosed().subscribe((r: string) => {
                if (r === 'yes') {
                    console.log(this.courrier.id);

                    this.rest
                        .generateAndSaveBO(this.courrier.id, 1)
                        .subscribe((resBO) => {
                            this.dialog.open(ViewerComponent, {
                                disableClose: true,
                                data: {
                                    mode: 'bo',
                                    base64: resBO['base64'],
                                    name: this.courrier.reference,
                                },
                            });

                            this.dialog.closeAll();
                            this.done.emit('ok');
                        });
                } else {
                    this.dialog.closeAll();
                }
            });
        } else {
            this.done.emit('ok');
            this.dialog.closeAll();
        }
    }

    getDocToUp(e) {
        this.srvDoc.hasAccessToEdit(e.id).subscribe((r) => {
            if (r === 1) {
                e.attributeValues.sort(
                    (a, b) => a.attribute.id - b.attribute.id
                );

                const dialogRef = this.dialog.open(EditDocComponent, {
                    disableClose: true,
                    data: {
                        docup: e,
                        step: this.etape['numero'],
                    },
                });

                dialogRef.componentInstance.back.subscribe((r) => {
                    if (r === 'ok') {
                        this.goPage(this.page);
                        this.documentInfos = null;
                        this.valid = 1;
                    }
                });
            } else {
                this.openModalNoAcc();
            }
        });
    }

    // Anciennes versions
    version(dc: any) {
        // const dialogRef = this.dialog.open(VersionDocListComponent, {
        //   width: '600px', // or whatever size fits your design
        //   disableClose: true,
        //   autoFocus: false,
        //   data: {
        //     document: dc['document'],
        //     attrs: this.attrLib,
        //     type: dc['document']['type']['libelle']
        //   }
        // });
    }

    page: number;
    documents = new Array();
    fileType: string;
    dest: String;
    destArray: String[] = new Array();
    eligibleDestArray: any[] = new Array();
    NoteligibleDestArray: any[] = new Array();
    AllDestArray: any[] = new Array();
    numEtape;
    type;
    isDep;
    hideClote = true;
    qualities = new Array();
    connectedUser;
    isBo = false;
    waitBo = false;
    ngOnInit(): void {
        this.service.getFolderType(this.courrier['type']).subscribe((r) => {
            this.type = r;
            if (this.type['cat'] == this.depart) {
                this.isDep = 'dep';
            } else {
                this.isDep = 'arr';
            }
        });
        this.connectedUser = JSON.parse(sessionStorage.getItem('uslog'));
        this.rest.getQualityNpPage().subscribe((res: any[]) => {
            this.qualities = res;
            this.qualities.forEach((quality) => {
                if (quality.ref_bo == 1) {
                    if (quality.code == this.connectedUser.title) {
                        this.isBo = true;
                        this.waitBo = true;
                    } else {
                        this.waitBo = true;
                    }
                }
            });
        });
        this.goPage(0);

        this.numEtape = this.etape['numero'];

        if (this.etape['isLast'] != 0) {
            this.hideClote = false;
        }
        if (this.etape['isBack'] == 0) {
            this.instruction();
        } else {
            this.motif();
        }

        this.masterService.getDestWithoutPage().subscribe((response) => {
            this.AllDestArray = response;

            this.AllDestArray.forEach((response) => {
                if (response['eligible'] == 1) {
                    this.courrier.dest.forEach((dest) => {
                        if (dest['name'] == response['name']) {
                            this.eligibleDestArray.push(response['email']);
                        }
                    });
                } else if (response['eligible'] == 0) {
                    this.courrier.dest.forEach((dest) => {
                        if (dest['name'] == response['name']) {
                            this.NoteligibleDestArray.push(response['email']);
                        }
                    });
                }
            });
        });
    }

    getAnno() {
        if (this.etape['isBack'] == 0) {
            this.instruction();
        } else {
            this.motif();
        }
    }

    motif() {
        // this.rest.getMotif(this.courrier.id, this.numEtape, this.etape.id).subscribe((r) => {
        //   const confRef = this.modal.open(ResultComponent, {
        //     keyboard: false,
        //     backdrop: 'static',
        //     centered: true,
        //   });
        //   confRef.componentInstance.text = r['motifDeRetour'];
        //   confRef.componentInstance.etat = 3;
        //   confRef.componentInstance.title = this.config.c.doStep.motif;
        // });
    }

    instruction() {
        // if (this.etape['numero'] != 1) {
        //   this.rest.getComment(this.courrier.id, this.numEtape, this.etape.id).subscribe((r) => {
        //     console.log('rrrrrrrrrrrrr', r);
        //     if (r["commentaire"] != "") {
        //     const confRef = this.modal.open(ResultComponent, {
        //       keyboard: false,
        //       centered: true,
        //     });
        //     confRef.componentInstance.text = r['commentaire'];
        //     confRef.componentInstance.etat = 2;
        //     confRef.componentInstance.title =
        //       this.config.c.doStep.appro + r['traitant']['fullName'];
        //     // r['users'][0]['fullName'];
        //     }
        //   });
        // }
    }
    goPage(i) {
        this.page = i;
        this.getDocuments(i);
    }
    totalEl: number;
    dataDoc: Object;
    varDocs = new Array<any>();
    totalCheck = -1;
    attrLib: Object;
    wait = false;
    getDocuments(i) {
        this.attrLib = new Object({
            ref: '',
            dt: '',
            titre: '',
        });
        this.totalCheck = -1;
        this.rest
            .getDocsEtape(this.courrier.id, this.page, 12)
            .subscribe((r) => {
                //console.log(r);
                this.documents = r['content'];
                this.wait = true;
                this.totalEl = r['totalElements'];
                const totalePages = r['totalPages'];
                this.pages = new Array<number>(totalePages);
                this.varDocs = new Array<any>();
                this.totalCheck = 1;

                const p = r['content'];

                p.forEach((element) => {
                    this.dataDoc = new Object({
                        ref: '',
                        dt: '',
                        titre: '',
                    });

                    element.document.attributeValues.forEach((el) => {
                        if (el.attribute.name == 'Réference') {
                            // this.varDocs.push({ref:el.value.value })
                            this.dataDoc['ref'] = el.value.value;
                            this.attrLib['ref'] = el.attribute.libelle;
                        }
                        if (el.attribute.name == 'Date') {
                            this.dataDoc['dt'] = el.value.value;
                            this.attrLib['dt'] = el.attribute.libelle;

                            // this.varDocs.push({dt:el.value.value })
                        }
                        if (el.attribute.name == 'Titre') {
                            this.dataDoc['titre'] = el.value.value;
                            this.attrLib['titre'] = el.attribute.libelle;

                            // this.varDocs.push({ref:el.value.value })
                        }
                    });
                    this.varDocs.push(this.dataDoc);
                });
                console.log(this.varDocs);
            });
    }
    goBack() {
        // const confRef = this.modal.open(BackCourrierComponent, {
        //   keyboard: false,
        //   centered: true,
        //   backdrop: 'static',
        // });
        // confRef.componentInstance.etape = this.etape;
        // confRef.componentInstance.done.subscribe((r) => {
        //   if (r == 'ok') {
        //     this.actmodal.close();
        //     this.done.emit('ok');
        //   }
        // });
    }

    send(d) {
        this.dialog.open(SendDocumentComponent, {
            disableClose: true,
            data: {
                id: d.id,
            },
        });
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
            this.size = 10;

            //   $('#plusInfos').toggle(500);
        } else {
            this.size = 10;
            this.documentInfos = infos;
        }
        // }
    }

    downloadFile(id) {
        // GET DOCUMENT
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
    isloading = false;

    // signer(d, contentType) {
    //     if (!contentType)
    //       return
    //     if (this.checkMimeType(contentType) !== -1) {
    //       this.isloading = true
    //       this.viewerService.getFileToView(d).subscribe((res) => {
    //         const file = res;
    //         //console.log(file);
    //         let fileType = file['contentType'].split('/')[0];
    //         const b64Data = file['fileData'] as string;
    //         const signRef = this.modal.open(SigStepComponent, {
    //           keyboard: false,
    //           backdrop: 'static',
    //           centered: true,
    //           size: 'xl',
    //           windowClass: 'sign-popup',
    //         });
    //         signRef.componentInstance.pdfSrc = b64Data;
    //         signRef.componentInstance.folderRef = this.courrier.reference;
    //         signRef.componentInstance.documentId = d;
    //         signRef.componentInstance.title = this.etape.name;
    //         d;
    //         signRef.componentInstance.back.subscribe((r) => {
    //           this.isloading = false
    //           if (r == 'ok') {
    //             this.valid = 1;
    //           }
    //           // if(r=='cancel'){
    //           // }
    //         });
    //       }).add(() => {
    //         this.isloading = false
    //       });
    //     }
    //     else {
    //       if (environment.hideToast) {
    //         this.toast.info(
    //         this.config.c.documentAdd.fileFormatNotSupported.message,
    //         this.config.c.documentAdd.fileFormatNotSupported.title
    //         );
    //       }
    //       this.downloadFile(d);
    //     }
    // }
    signer(d: any, contentType: string) {
        console.log("contentType",contentType)
        if (!contentType) return;

        if (this.checkMimeType(contentType) !== -1) {
            this.isloading = true;

            this.viewerService
                .getFileToView(d)
                .subscribe((res) => {
                    const file = res;
                    const fileType = file['contentType'].split('/')[0];
                    const b64Data = file['fileData'] as string;
                    const dialogRef = this.dialog.open(SigStepComponent, {
                        disableClose: true,
                        data: {
                            pdfSrc: b64Data,
                            folderRef: this.courrier.reference,
                            documentId: d,
                            title: this.etape.name,
                        },
                    });

                    dialogRef.componentInstance.back.subscribe((r: string) => {
                        this.isloading = false;
                        if (r === 'ok') {
                            this.valid = 1;
                        }
                    });
                })
                .add(() => {
                    this.isloading = false;
                });
        } else {
            if (environment.hideToast) {
                this.toast.info(
                    "Le format du fichier choisi n'est pas supporté par la visionneuse",
                    'Format non supporté'
                );
            }
            this.downloadFile(d);
        }
    }

    leave(event: string) {
        if (event === 'abondone') {
            const dialogRef = this.dialog.open(AbondonneModalComponent, {
                disableClose: true,
            });

            dialogRef.afterClosed().subscribe((r: any) => {
                if (r?.stat === 'yes') {
                    const loadRef = this.dialog.open(LoadingComponent, {
                        disableClose: true,
                        data: {
                            message: 'Finalisation en cours...',
                            title: 'Envoi de courrier',
                        },
                    });

                    const abondonne = 1;

                    this.rest
                        .lastStepValidate(
                            this.etape['id'],
                            abondonne,
                            0,
                            r.value.commentaire
                        )
                        .subscribe(
                            () => {
                                this.done.emit('ok');
                                loadRef.close();
                            },
                            (err) => {
                                this.done.emit('ok');
                                this.dialog.closeAll();
                            }
                        );
                }
            });
        } else {
            this.abondonneEtape(event);
        }
    }

    abondonneEtape(event: string) {
        const dialogRef = this.dialog.open(ConfirmeStepComponent, {
            disableClose: true,
            data: {
                target: this.config.c.validateStep.confirmeLast,
                btn: this.config.c.index.validate,
            },
        });

        dialogRef.afterClosed().subscribe((r) => {
            if (r === 'yes') {
                if (event === 'clot') {
                    const loadRef = this.dialog.open(LoadingComponent, {
                        disableClose: true,
                        data: {
                            message: 'Finalisation en cours...',
                            title: 'Envoi de courrier',
                        },
                    });

                    const clot = 1;

                    this.rest
                        .lastStepValidate(this.etape['id'], 0, clot, '')
                        .subscribe(
                            () => {
                                this.done.emit('ok');
                                loadRef.close();

                                if (
                                    this.allConfigs.LEDGER === '1' &&
                                    this.type['cat'] === this.dep &&
                                    this.documents.length > 0
                                ) {
                                    const ledgerRef = this.dialog.open(
                                        DeclareLedgerComponent,
                                        {
                                            disableClose: true,
                                            data: {
                                                recievers:
                                                    this.NoteligibleDestArray,
                                                eligible:
                                                    this.eligibleDestArray,
                                            },
                                        }
                                    );

                                    ledgerRef
                                        .afterClosed()
                                        .subscribe((resp) => {
                                            const loading = this.dialog.open(
                                                LoadingComponent,
                                                {
                                                    disableClose: true,
                                                    data: {
                                                        message:
                                                            'Finalisation en cours...',
                                                        title: 'Envoi de courrier',
                                                    },
                                                }
                                            );

                                            const mail = resp?.mails?.trim()
                                                ? resp.mails
                                                : null;

                                            this.rest
                                                .saveInLedger(
                                                    this.courrier.id,
                                                    mail,
                                                    resp.ledger
                                                )
                                                .subscribe(() => {
                                                    loading.close();
                                                    this.genBord();
                                                });
                                        });
                                } else {
                                    this.genBord();
                                }
                            },
                            (err) => {
                                this.done.emit('ok');
                                this.dialog.closeAll();
                            }
                        );
                }
            }
        });
    }

    openModalNoAcc() {
        this.dialog.open(ResultComponent, {
            disableClose: true,
            data: {
                title: this.translocoService.translate(
                    'courrierList.pasDaccestitre'
                ),
                etat: -1,
                text: this.translocoService.translate(
                    'courrierList.pasDaccestxt'
                ),
            },
        });
    }

    checkMimeType(doc) {
        const supportedMimes = environment.supportedMimeTypes.split(' ');
        return supportedMimes.indexOf(doc);
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
            'application/vnd.oasis.opendocument.text':
                'fa fa-file-word-o text-blue-600',
            'application/vnd.openxmlformats-officedocument.wordprocessingml':
                'fa fa-file-word-o text-blue-600',

            'application/vnd.ms-excel': 'fa fa-file-excel-o text-green-600',
            'application/vnd.openxmlformats-officedocument.spreadsheetml':
                'fa fa-file-excel-o text-green-600',
            'application/vnd.oasis.opendocument.spreadsheet':
                'fa fa-file-excel-o text-green-600',

            'application/vnd.ms-powerpoint':
                'fa fa-file-powerpoint-o text-orange-500',
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

    close() {
        this.done.emit('closed');
    }
}
