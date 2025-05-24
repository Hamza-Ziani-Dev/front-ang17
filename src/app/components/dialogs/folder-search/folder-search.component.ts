import {
    ChangeDetectorRef,
    Component,
    EventEmitter,
    Input,
    Output,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { ShareFolderComponent } from '../share-folder/share-folder.component';
import { Observable } from 'rxjs';
import { ViewerComponent } from 'app/components/dialogs/viewer/viewer.component';
import { ResultComponent } from '../result/result.component';
import { FolderToFoldersComponent } from '../folder-to-folders/folder-to-folders.component';
import { ChoiseDocComponent } from '../choise-doc/choise-doc.component';
import { Search, SearchAttribute } from 'app/components/models/search.model';
import { SaveSearchComponent } from '../save-search/save-search.component';
import { FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ResultCourrierComponent } from '../result-courrier/result-courrier.component';
import { ConfirmationComponent } from '../confirmation/confirmation.component';
import { Folder } from 'app/components/models/folder.model';
import { environment } from 'environments/environment.development';
import { CookieService } from 'ngx-cookie-service';
import { RxFormBuilder } from '@rxweb/reactive-form-validators';
import { RestDataApiService } from 'app/components/services/rest-data-api.service';
import { RestSearchApiService } from 'app/components/services/rest-search-api.service';
import { RecordsServiceService } from 'app/components/services/records-service.service';
import { MatDialog } from '@angular/material/dialog';
import { DataSharingService } from 'app/components/services/data-sharing.service';
import { FolderService } from 'app/components/services/folder.service';
import { ActivatedRoute, Router } from '@angular/router';
import { PreviousRouteService } from 'app/components/services/previous-route.service';
import { EditUserServiceService } from 'app/components/services/edit-user-service.service';
import { ConfigService } from 'app/components/services/config.service';
import { EditDocumentService } from 'app/components/services/edit-document.service';
import { ExportService } from 'app/components/services/export.service';
import { MasterServiceService } from 'app/components/services/master-service.service';
import { FolderTypeA } from 'app/components/models/FolderType';
import { TranslocoService, TranslocoModule } from '@ngneat/transloco';
import { MaterialModuleModule } from 'shared/material-module/material-module.module';
import { MatStepperModule } from '@angular/material/stepper';
import { Location } from '@angular/common';
import { NgxPaginationModule } from 'ngx-pagination';
import { FolderComponent } from 'app/components/apps/folder/folder.component';
import { UpdateCourrierRecentComponent } from '../update-courrier-recent/update-courrier-recent.component';
import { StepEtatDialogComponent } from '../step-etat-dialog/step-etat-dialog.component';

@Component({
    selector: 'app-folder-search',
    standalone: true,
    imports: [
            CommonModule,
            TranslocoModule,
            MaterialModuleModule,
            MatStepperModule,
            FormsModule,
            ReactiveFormsModule,
            NgxPaginationModule,
                    FolderComponent
        ],
    templateUrl: './folder-search.component.html',
    styleUrl: './folder-search.component.scss',
})
export class FolderSearchComponent {
    isMobile: boolean = window.innerWidth <= 768;
    dep = environment.depart;
    arr = environment.arrive;
    inter = environment.interne;
    hideAchivage = environment.hideAchivage;
    laisonHide = environment.liasonHide;
    public favoriteFoldersIds: string[];
    public isLoading: boolean;
    search: Search;
    @Input() listOfSelectedFolders;
    selectedFolders;
    totalePages: number;
    page = 0;
    pages: number[] = new Array<number>();
    pageSize;
    folderSelectedId;
    @Input() selectedFolder;
    @Input() isSecondeLnikingTable = false;
    isLoaded;
    addFav;
    removeFav;

    resultTotal;
    @Input() operation;
    @Input() linkDoc;
    @Input() DocumentId;
    @Input() ShowResult;
    isReporting = false;

    foldersResut = new Array<Folder>();
    folder: Folder;
    folders: FolderTypeA[];
    clients;
    all = true;
    folderFormGroup: FormGroup;
    isResult;
    senders;
    receivers;
    dests;
    selectedReceivers = new Array<any>();
    selectedReceiversId = new Array<any>();
    sorts = {};
    hideStatus = environment.hideStatus;
    hideRefAuto = environment.hideRefAuto;
    @Output() folderSelected = new EventEmitter();
    @Output() validLink = new EventEmitter();
    @Output() next = new EventEmitter();
    @Output() Back = new EventEmitter();
    natures = new Array();
    totalEl;
    constructor(
        private ref: ChangeDetectorRef,
        private cookies: CookieService,
        private location: Location,
        private fb: RxFormBuilder,
        private rest: RestDataApiService,
        private searchserv: RestSearchApiService,
        private recServ: RecordsServiceService,
        private dialog: MatDialog,
        public share: DataSharingService,
        private folderService: FolderService,
        private route: Router,
        private prev: PreviousRouteService,
        private service: EditUserServiceService,
        public config: ConfigService,
        private srvDoc: EditDocumentService,
        private exportAs: ExportService,
        private activeRoute: ActivatedRoute,
        private masterService: MasterServiceService,
        private translocoService: TranslocoService,
    ) {}
    ngAfterContentChecked() {
        this.ref.detectChanges();
    }
    openDialogNoAcc(): void {
        this.dialog.open(ResultComponent, {
          data: {
            title: "Pas d'accès",
            etat: -1,
            text: "Vous n'êtes pas autorisé à effectuer cette opération."
          }
        });
      }

    // Check if responsive mobile :
    checkMobile() {
        this.isMobile = window.innerWidth <= 768;
        this.viewMode = this.isMobile ? 0 : 1;
    }
    resizeListener: any;
    ngOnDestroy(): void {
        window.addEventListener('resize', this.resizeListener);
    }
    func() {
        this.all = !this.all;
        var elmnt = document.getElementById('teeets');

        //   $(document).ready(function () {
        //     $('.up').click(function () {
        //       $('html, body').animate(
        //         {
        //           scrollTop: $('.up').offset().top,
        //         },
        //         1000
        //       );
        //     });
        //   });
    }
    param = null;
    isLinking = false;
    ngOnInit(): void {
        this.resizeListener = this.checkMobile.bind(this);
        this.checkMobile();
        window.addEventListener('resize', this.resizeListener);

        if (this.cookies.check('folders')) {
            this.viewMode = Number.parseInt(this.cookies.get('folders'));
        }

        this.activeRoute.queryParams.subscribe((params) => {
            this.param = params['filter'];
            if (this.param != undefined) {
                sessionStorage.setItem('WLS', 'f');
                console.log('start search');

                this.getResult(JSON.parse(this.param));
                this.isResult = true;
                this.ShowResult = true;
            }
        });
        this.u = JSON.parse(sessionStorage.getItem('uslog'));
        this.getReceivers();
        this.getSenders();
        this.isResult = this.ShowResult ?? false;
        this.isReporting =
            this.route.routerState.snapshot.url.lastIndexOf('reporting') > -1;
        this.isLinking =
            this.route.routerState.snapshot.url.lastIndexOf('linking') > -1;
        this.selectedFolders = new Array<any>();

        this.isLoading = true;
        if (sessionStorage.getItem('fs')) {
            this.folder = new Folder();
            this.getSearchAttrVal();
        } else {
            this.folder = new Folder();

            //this.folder.Date = new Date();
            this.folderFormGroup = this.fb.group({
                type: [''],
                finalise: [''],
                fini: [''],
                sender: [''],
                reference: [''],
                refAuto: [''],
                nature: [''],
                deDate: [''],
                toDate: [''],
                order: [''],
                objet: [''],
                motif: [''],
                instru: [''],
                accuse: [''],
            });
            this.folderFormGroup.controls['finalise'].disable();
        }
    }
    getNature() {
        this.rest.getNature('R').subscribe((r: any[]) => {
            this.natures = r;
        });
    }
    getUsers() {
        this.service.getUsersGroups().subscribe((r) => {
            this.clients = r;
        });
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

        this.folderFormGroup.controls['order'].setValue(q);

        this.goPage(this.page);
    }

    goPage(i) {
        this.page = i;
        if (this.operation === 'multi' && this.linkDoc === '1') {
            this.getFoldersToLinkWithDocument();
        } else if (this.operation !== 'multi' && this.linkDoc !== '1') {
            const p = this.param
                ? JSON.parse(this.param)
                : this.folderFormGroup.value;
            if (this.folderFormGroup.value['accuse'] == true) {
                p['accuse'] = 1;
            } else {
                p['accuse'] = 0;
            }

            if (p['accuse'] == 1) {
                if (this.folderFormGroup.value['finalise'] == true) {
                    p['finalise'] = 'fini';
                } else {
                    p['finalise'] = 'accusation';
                }
            } else {
                if (this.folderFormGroup.value['fini'] == true) {
                    p['finalise'] = 'fini';
                } else {
                    p['finalise'] = null;
                }
            }
            if (this.acc != null) {
                if (this.acc.cat == this.dep) {
                    p.mode = 1;
                    p.dest = this.selectedReceiversId;
                } else if (this.acc.cat == this.arr) {
                    p.mode = 2;
                } else {
                    p.mode = -1;
                }
            } else {
                p.mode = -1;
            }
            this.getResult(p);
        } else {
            this.getResultToLink();
        }
        this.isLoading = true;
    }

    DeleteFavoritefolder(folderId: number) {
        this.folderService.deletefavoritefolder(folderId).subscribe((res) => {
            const p = this.folderFormGroup.value;

            if (this.folderFormGroup.value['accuse'] == true) {
                p['accuse'] = 1;
            } else {
                p['accuse'] = 0;
            }

            if (p['accuse'] == 1) {
                if (this.folderFormGroup.value['finalise'] == true) {
                    p['finalise'] = 'fini';
                } else {
                    p['finalise'] = 'accusation';
                }
            } else {
                if (this.folderFormGroup.value['fini'] == true) {
                    p['finalise'] = 'fini';
                } else {
                    p['finalise'] = null;
                }
            }
            if (this.acc != null) {
                if (this.acc.cat == this.dep) {
                    p.mode = 1;
                    p.dest = this.selectedReceiversId;
                } else if (this.acc.cat == this.arr) {
                    p.mode = 2;
                } else {
                    p.mode = -1;
                }
            } else {
                p.mode = -1;
            }
            this.getResult(p);
        });
    }

    totalCheck = -1;
    isFavorite(folder: Folder) {
        return this.favoriteFoldersIds.indexOf(folder.id) >= 0;
    }

    getSearchAttrVal() {
        const attributes = new Array<SearchAttribute>();
        this.searchserv
            .getFrequencySearcheqaAttrs(sessionStorage.getItem('fs').toString())
            .subscribe((res) => {
                const folderMod = new Folder();
                (res as Array<any>).forEach((s) => {
                    const se = s.id;
                    attributes.push(
                        new SearchAttribute(se.attribute_id as number, s.value)
                    );
                });
                for (let i = 0; i < attributes.length; i++) {
                    const a = attributes[i];
                    if (a.id === 2) {
                        folderMod.destinataire = Number.parseInt(a.value);
                    }
                    if (a.id === 3) {
                        folderMod.reference = a.value;
                    }
                    if (a.id === 1) {
                        folderMod.type = Number.parseInt(a.value);
                    }
                    if (a.id === 5) {
                        folderMod.date = new Date(a.value);
                    }
                    if (a.id === 4) {
                        folderMod.nature = Number.parseInt(a.value);
                    }
                }
                this.folderFormGroup = this.fb.formGroup(folderMod);
                this.getNature();
                this.retriveClients();
                this.folder = folderMod;
                const p = this.folderFormGroup.value;

                if (this.folderFormGroup.value['accuse'] == true) {
                    p['accuse'] = 1;
                } else {
                    p['accuse'] = 0;
                }

                if (p['accuse'] == 1) {
                    if (this.folderFormGroup.value['finalise'] == true) {
                        p['finalise'] = 'fini';
                    } else {
                        p['finalise'] = 'accusation';
                    }
                } else {
                    if (this.folderFormGroup.value['fini'] == true) {
                        p['finalise'] = 'fini';
                    } else {
                        p['finalise'] = null;
                    }
                }
                if (this.acc != null) {
                    if (this.acc.cat == this.dep) {
                        p.mode = 1;
                        p.dest = this.selectedReceiversId;
                    } else if (this.acc.cat == this.arr) {
                        p.mode = 2;
                    } else {
                        p.mode = -1;
                    }
                } else {
                    p.mode = -1;
                }
                this.getResult(p);
                sessionStorage.removeItem('fs');
            });
    }
    editFolder(folder: any): void {
        this.srvDoc.hasAccessToEditN(folder.id).subscribe((r) => {
          if (r === 1) {
            const dialogRef = this.dialog.open(UpdateCourrierRecentComponent, {
              disableClose: true, 
              data: {
                folder: folder,
                acc: this.acc || this.folders.find((el) => el.id === folder.type)
              }
            });
      
            dialogRef.componentInstance.Back.subscribe((res: string) => {
              if (res === 'ok') {
                const p = this.folderFormGroup.value;
                p['accuse'] = p['accuse'] === true ? 1 : 0;
                if (p['accuse'] === 1) {
                  p['finalise'] = p['finalise'] === true ? 'fini' : 'accusation';
                } else {
                  p['finalise'] = p['fini'] === true ? 'fini' : null;
                }
                if (this.acc != null) {
                  if (this.acc.cat === this.dep) {
                    p.mode = 1;
                    p.dest = this.selectedReceiversId;
                  } else if (this.acc.cat === this.arr) {
                    p.mode = 2;
                  } else {
                    p.mode = -1;
                  }
                } else {
                  p.mode = -1;
                }
      
                this.getResult(p);
              }
            });
          } else {
            this.openDialogNoAcc(); 
          }
        });
      }
      


    dis = true;
    accus(e) {
        if (e.currentTarget.checked) {
            this.dis = false;
            this.folderFormGroup.controls['finalise'].enable();
        } else {
            this.dis = true;
            // $('#finalise').prop('checked', false);
            this.folderFormGroup.controls['finalise'].disable();
        }
    }
    delete(id: number): void {
        this.srvDoc.hasAccessToDeleteN(id).subscribe((r) => {
          if (r === 1) {
            const confirmRef = this.dialog.open(ConfirmationComponent, {
              disableClose: true, 
              data: {
                target: "Processus"
              }
            });
      
            confirmRef.componentInstance.pass.subscribe((resp: string) => {
              if (resp === 'yes') {
                this.rest.deleteFolder(id).subscribe(() => {
                  const resultRef = this.dialog.open(ResultCourrierComponent, {
                    disableClose: true
                  });
      
                  resultRef.componentInstance.title = "Supprimé avec succès";
      
                  const p = this.folderFormGroup.value;
      
                  p['accuse'] = p['accuse'] === true ? 1 : 0;
                  if (p['accuse'] === 1) {
                    p['finalise'] = p['finalise'] === true ? 'fini' : 'accusation';
                  } else {
                    p['finalise'] = p['fini'] === true ? 'fini' : null;
                  }
      
                  // Mode logic
                  if (this.acc != null) {
                    if (this.acc.cat === this.dep) {
                      p.mode = 1;
                      p.dest = this.selectedReceiversId;
                    } else if (this.acc.cat === this.arr) {
                      p.mode = 2;
                    } else {
                      p.mode = -1;
                    }
                  } else {
                    p.mode = -1;
                  }
      
                  this.getResult(p);
                });
              }
              confirmRef.close(); 
            });
          } else {
            this.openDialogNoAcc(); 
          }
        });
      }
      

    private retriveFoldersType() {
        this.rest.getFloderTypes().subscribe((res) => {
            this.folders = res;
            this.getNature();
        });
    }

    private retriveClients() {
        this.rest.getClients().subscribe((res) => {
            this.clients = res;
        });
    }
    currentProc = null;
    getProcess(e) {
        this.natures.forEach((element) => {
            if (element.id == e) {
                this.curentNat = element;
            }
        });
        this.rest.getStepsByNat(e).subscribe((r) => {
            this.currentProc = r;
        });
    }
    viewMode = 0;

    mode(a) {
        this.cookies.set('folders', a);
        this.viewMode = a;
    }

    getFoldersToLinkWithDocument() {
        this.ref.detectChanges();
        this.isResult = true;
        this.totalCheck = -1;
        const p = this.folderFormGroup.value;

        if (this.folderFormGroup.value['accuse'] == true) {
            p['accuse'] = 1;
        } else {
            p['accuse'] = 0;
        }

        if (p['accuse'] == 1) {
            if (this.folderFormGroup.value['finalise'] == true) {
                p['finalise'] = 'fini';
            } else {
                p['finalise'] = 'accusation';
            }
        } else {
            if (this.folderFormGroup.value['fini'] == true) {
                p['finalise'] = 'fini';
            } else {
                p['finalise'] = null;
            }
        }
        if (this.acc != null) {
            if (this.acc.cat == this.dep) {
                p.mode = 1;
                p.dest = this.selectedReceiversId;
            } else if (this.acc.cat == this.arr) {
                p.mode = 2;
            } else {
                p.mode = -1;
            }
        } else {
            p.mode = -1;
        }
        this.searchserv
            .searchFoldersToLinkWithDocument(p, this.DocumentId, this.page)
            .subscribe((res) => {
                this.totalEl = res['totalElements'];
                this.foldersResut = res['content'];
                const totalePages = res['totalPages'];
                this.resultTotal = res['totalElements'];
                this.pages = new Array<number>(totalePages);
                this.totalCheck = 1;
                for (let index = 0; index < this.pages.length; index++) {
                    this.pages[index] = index;
                }

                this.foldersResut.forEach((folder) => {
                    let onTime = false;
                    let step;

                    folder.etapes.forEach((res) => {
                        if (res.etat == 0 && onTime == false) {
                            onTime = true;
                            step = res;
                        }
                    });

                    if (step) {
                        let datenow = new Date();
                        let dateFin = new Date(step?.dateFin);

                        if (
                            dateFin > datenow &&
                            dateFin.getDay() - datenow.getDay() != 0
                        ) {
                            folder.inProgress = true;
                        } else if (dateFin < datenow) {
                            folder.isExpire = true;
                        } else if (
                            dateFin > datenow &&
                            dateFin.getDay() - datenow.getDay() == 0
                        ) {
                            folder.closeEnd = true;
                        }
                    }
                });
            });
    }
    getResultToLink() {
        this.totalCheck = -1;

        const p = this.folderFormGroup.value;
        if (this.folderFormGroup.value['accuse'] == true) {
            p['accuse'] = 1;
        } else {
            p['accuse'] = 0;
        }

        if (p['accuse'] == 1) {
            if (this.folderFormGroup.value['finalise'] == true) {
                p['finalise'] = 'fini';
            } else {
                p['finalise'] = 'accusation';
            }
        } else {
            if (this.folderFormGroup.value['fini'] == true) {
                p['finalise'] = 'fini';
            } else {
                p['finalise'] = null;
            }
        }
        if (this.acc != null) {
            if (this.acc.cat == this.dep) {
                p.mode = 1;
                p.dest = this.selectedReceiversId;
            } else if (this.acc.cat == this.arr) {
                p.mode = 2;
            } else {
                p.mode = -1;
            }
        } else {
            p.mode = -1;
        }
        this.searchserv
            .searchFolderToLink(p, this.selectedFolder, this.page)
            .subscribe((res) => {
                this.totalEl = res['totalElements'];
                this.foldersResut = res['content'];
                const totalePages = res['totalPages'];
                this.resultTotal = res['totalElements'];
                this.pages = new Array<number>(totalePages);
                this.totalCheck = 1;
                for (let index = 0; index < this.pages.length; index++) {
                    this.pages[index] = index;
                }

                this.foldersResut.forEach((folder) => {
                    let onTime = false;
                    let step;

                    folder.etapes.forEach((res) => {
                        if (res.etat == 0 && onTime == false) {
                            onTime = true;
                            step = res;
                        }
                    });

                    if (step) {
                        let datenow = new Date();
                        let dateFin = new Date(step?.dateFin);

                        if (
                            dateFin > datenow &&
                            dateFin.getDay() - datenow.getDay() != 0
                        ) {
                            folder.inProgress = true;
                        } else if (dateFin < datenow) {
                            folder.isExpire = true;
                        } else if (
                            dateFin > datenow &&
                            dateFin.getDay() - datenow.getDay() == 0
                        ) {
                            folder.closeEnd = true;
                        }
                    }
                });
            });
        this.isResult = true;
    }
    link(f) {
        this.folderSelected.emit(f);
    }

    addToList(e, f) {
        if (e.target.checked && f.field1 != 1) {
            this.selectedFolders.push(f['id']);
        } else {
            if (f.field1 != 1)
                this.selectedFolders.slice(
                    this.selectedFolders.indexOf(f['id']),
                    1
                );
        }
        this.folderSelected.emit(f);
    }
    getSenders() {
        this.rest.getSenders().subscribe((r) => {
            this.senders = r;
            this.retriveFoldersType();
        });
    }

    getReceivers() {
        this.rest.getReceivers().subscribe((r) => {
            this.receivers = r;
            this.retriveFoldersType();
        });
    }

    changeSender(e) {
        let data;
        this.receivers.forEach((element) => {
            if (element.id == e) {
                data = element;
            }
        });

        if (this.acc.cat == this.arr) {
            this.selectedReceivers = new Array(...[data.name]);
            return;
        }
        if (this.acc.cat == this.dep) {
            if (
                this.selectedReceivers.indexOf(data.name) == -1 &&
                this.checkExist(data.name) == 1
            ) {
                this.selectedReceivers.push(data.name);
                this.selectedReceiversId.push(data.id);
            }
            this.folderFormGroup.controls['sender'].setValue('');
        } else return;
    }
    b;
    checkExist(e) {
        this.b = 0;
        this.receivers.forEach((element) => {
            if (element.name == e) this.b = 1;
        });
        return this.b;
    }
    supp(da) {
        this.selectedReceivers.splice(this.selectedReceivers.indexOf(da), 1);
    }
    getResult(p) {
        console.log(p);

        this.isResult = true;
        this.totalCheck = -1;
        this.formData = p;
        if (
            (this.param == undefined || (this.param && this.param != p)) &&
            !this.isReporting &&
            !this.isLinking
        ) {
            p['order'] = this.folderFormGroup?.controls['order'].value
                ? this.folderFormGroup?.controls['order'].value
                : '';
            // this.route.navigateByUrl('dashboard/search?filter=' + JSON.stringify(p));
            sessionStorage.setItem('searchSave', JSON.stringify(p));
            // this.location.go('/app/dashboard/search?filter=' + JSON.stringify(p));
        }

        this.searchForm = JSON.stringify(p);

        this.searchserv.searchFolder(p, this.page).subscribe(
            (res) => {
                this.totalEl = res['totalElements'];
                console.log(res);
                this.foldersResut = res['content'];
                const totalePages = res['totalPages'];
                this.resultTotal = res['totalElements'];
                this.pages = new Array<number>(totalePages);
                this.totalCheck = 1;

                this.foldersResut.forEach((folder) => {
                    let onTime = false;
                    let step;

                    folder.etapes.forEach((res) => {
                        if (res.etat == 0 && onTime == false) {
                            onTime = true;
                            step = res;
                        }
                    });

                    if (step) {
                        let datenow = new Date();
                        let dateFin = new Date(step?.dateFin);

                        if (
                            dateFin > datenow &&
                            dateFin.getDay() - datenow.getDay() != 0
                        ) {
                            folder.inProgress = true;
                        } else if (dateFin < datenow) {
                            folder.isExpire = true;
                        } else if (
                            dateFin > datenow &&
                            dateFin.getDay() - datenow.getDay() == 0
                        ) {
                            folder.closeEnd = true;
                        }
                    }
                });
            },
            (err) => {
                this.totalCheck = 1;
            }
        );
    }
    searchForm;
    acc = null;
    dataArray: Array<any>;
    changeSuit(e) {
        this.dataArray = new Array<any>();

        this.folders.forEach((element) => {
            if (e == element.id) {
                this.acc = element;

                this.curentType = element;
            }

            if (this.curentType != null) {
                if (this.curentType.name != this.dep) {
                    this.folderFormGroup.controls['accuse'].setValue(0);
                }
            }
        });

        this.folderFormGroup.controls['sender'].setValue('');
        this.folderFormGroup.controls['nature'].setValue('');
        this.currentProc = null;

        if (this.acc.cat == this.dep) {
            this.folderFormGroup.controls.sender.setValidators(
                Validators.nullValidator
            );

            this.selectedReceivers = new Array<any>();

            this.dests = this.receivers;
        } else if (this.acc.cat == this.arr) {
            this.folderFormGroup.controls.sender.setValidators(
                Validators.required
            );

            this.selectedReceivers = new Array<any>();
            //console.log('1');

            this.dests = this.senders;
        }

        this.natures.forEach((nat) => {
            if (nat.folderType != null) {
                const list = nat.folderType.split('/');

                list.forEach((element) => {
                    if (element == this.curentType.id) {
                        this.dataArray.push(nat);
                    }
                });
            }
        });
    }
    changeDest(e) {
        this.clients.forEach((element) => {
            if (e.target.value == element.userId) {
                this.curentDest = element;
            }
        });
    }
    openDetailProc() {
        this.detail();
    }
    detail() {
        //   if ($(window).width() >= 902) {
        //     const confRef = this.modalService.open(DetailProcessComponent, {
        //       centered: true,
        //       size: 'xl',
        //     });
        //     confRef.componentInstance.process = this.currentProc;
        //   } else {
        //     const confRef = this.modalService.open(DetailProcessComponent, {
        //       centered: true,
        //     });
        //     confRef.componentInstance.process = this.currentProc;
        //   }
    }

    changeNat(e) {
        this.natures.forEach((element) => {
            if (e.target.value == element.id) {
                this.curentNat = element;
            }
        });
    }
    isfav = false;
    u;
    click(folder) {
        this.isfav = false;
        folder.favoriteBay.split('/').forEach((ui) => {
            if (this.u.userId.toString() == ui) {
                this.isfav = true;
            }
        });
    }
    end(e) {
        console.log(e.target.checked);
        if (e.target.checked) {
            this.folderFormGroup.controls['finalise'].setValue('fini');
        } else {
            this.folderFormGroup.controls['finalise'].setValue('');
        }
    }

    public onSubmit() {
        this.folderFormGroup.controls['order'].setValue('');
        this.addFav = this.config.c['folderSearch']['addFav'];
        this.removeFav = this.config.c['folderSearch']['removeFav'];
        this.next.emit('+');
        let date = new Date();

        //@ts-ignore
        var getYear = date.toLocaleString('default', { year: 'numeric' });
        var getMonth = date.toLocaleString('default', { month: '2-digit' });
        var getDay = date.toLocaleString('default', { day: '2-digit' });
        var dateFormat = getYear + '-' + getMonth + '-' + getDay;

        if (
            this.folderFormGroup.controls['toDate'].value == '' ||
            this.folderFormGroup.controls['toDate'].value == null
        ) {
            this.folderFormGroup.controls['toDate'].setValue(dateFormat);
        }
        if (this.operation === 'multi' && this.linkDoc === '1') {
            this.getFoldersToLinkWithDocument();
        } else if (this.operation !== 'multi' && this.linkDoc !== '1') {
            this.page = 0;
            const p = this.folderFormGroup.value;

            if (this.folderFormGroup.value['accuse'] == true) {
                p['accuse'] = 1;
            } else {
                p['accuse'] = 0;
            }

            if (p['accuse'] == 1) {
                if (this.folderFormGroup.value['finalise'] == true) {
                    p['finalise'] = 'fini';
                } else {
                    p['finalise'] = 'accusation';
                }
            } else {
                if (this.folderFormGroup.value['fini'] == true) {
                    p['finalise'] = 'fini';
                } else {
                    p['finalise'] = null;
                }
            }
            if (this.acc != null) {
                if (this.acc.cat == this.dep) {
                    p.mode = 1;
                    p.dest = this.selectedReceiversId;
                } else if (this.acc.cat == this.arr) {
                    p.mode = 2;
                } else {
                    p.mode = -1;
                }
            } else {
                p.mode = -1;
            }
            this.getResult(p);
        } else {
            this.getResultToLink();
        }

        this.isLoading = true;
    }

    openFolder(f) {
        if (!this.isReporting) {
            this.share.folderToOpen = f;

            // this.route.navigateByUrl('/app/dashboard/documents?search=?' + true);
        } else {
            this.share.folderToOpen = f;
            sessionStorage.setItem('reporting', 'true');
            // this.route.navigateByUrl('dashboards/documents?search=' + true);
        }
    }
    selectFolder(f) {
        console.log('hiii');

        this.folderSelected.emit(f);
        if (this.selectedFolders.indexOf(f['id']) == -1 && f.field1 != 1) {
            this.selectedFolders.push(f['id']);
        } else {
            // this.ad.
            if (f.field1 != 1)
                this.selectedFolders.slice(
                    this.selectedFolders.indexOf(f['id']),
                    1
                );
        }
        if (this.operation !== 'multi') {
            sessionStorage.setItem('FTL', f['id'] as string);
        }
    }

    clearchamp(e) {
        this.acc = null;
    }
    clearcat(e) {
        this.currentProc = null;
    }
    undo() {
        if (this.folderFormGroup.dirty) {
            this.folderFormGroup.reset();
            this.acc = null;
            this.selectedReceivers = new Array<any>();
        } else {
        }
    }

    back() {
        this.isResult = false;
        this.totalCheck = -1;
        this.folderFormGroup.reset();
        if (!this.isReporting && !this.isLinking)
            this.route.navigateByUrl('/app/dashboard/search');
        this.foldersResut = null;

        this.next.emit('-');
        sessionStorage.removeItem('dateDefault');
        this.selectedFolders = new Array<any>();
        this.selectedReceivers = new Array<any>();
        this.selectedReceiversId = new Array<any>();
        this.listOfSelectedFolders = new Array<any>();
    }
    openDialog(f: any): void {
        this.dialog.open(StepEtatDialogComponent, {
          disableClose: true,
          data: {
            courrier: f
          }
        });
      }
      
    curentDest = null;
    curentNat = null;

    curentType = null;

    addToFavorite(folder) {
        this.folderService.addToFavorite(folder.id).subscribe((res) => {
            const p = this.folderFormGroup.value;

            if (this.folderFormGroup.value['accuse'] == true) {
                p['accuse'] = 1;
            } else {
                p['accuse'] = 0;
            }

            if (p['accuse'] == 1) {
                if (this.folderFormGroup.value['finalise'] == true) {
                    p['finalise'] = 'fini';
                } else {
                    p['finalise'] = 'accusation';
                }
            } else {
                if (this.folderFormGroup.value['fini'] == true) {
                    p['finalise'] = 'fini';
                } else {
                    p['finalise'] = null;
                }
            }
            if (this.acc != null) {
                if (this.acc.cat == this.dep) {
                    p.mode = 1;
                    p.dest = this.selectedReceiversId;
                } else if (this.acc.cat == this.arr) {
                    p.mode = 2;
                } else {
                    p.mode = -1;
                }
            } else {
                p.mode = -1;
            }
            this.getResult(p);
        });
    }
    formData;
    dataDest;
    saveSearch() {
        this.savedSearch();
        this.openSaveSearchModal();
    }
    genReports() {
        const p = this.folderFormGroup.value;

        if (this.folderFormGroup.value['accuse'] == true) {
            p['accuse'] = 1;
        } else {
            p['accuse'] = 0;
        }

        if (p['accuse'] == 1) {
            if (this.folderFormGroup.value['finalise'] == true) {
                p['finalise'] = 'fini';
            } else {
                p['finalise'] = 'accusation';
            }
        } else {
            if (this.folderFormGroup.value['fini'] == true) {
                p['finalise'] = 'fini';
            } else {
                p['finalise'] = null;
            }
        }
        if (this.acc != null) {
            if (this.acc.cat == this.dep) {
                p.mode = 1;
                p.dest = this.selectedReceiversId;
            } else if (this.acc.cat == this.arr) {
                p.mode = 2;
            } else {
                p.mode = -1;
            }
        } else {
            p.mode = -1;
        }
        this.rest.genReport(p).subscribe((r) => {
            console.log(r);

            this.onDownload(r);
        });
    }

    genReportsXl() {
        const p = this.folderFormGroup.value;

        if (this.folderFormGroup.value['accuse'] == true) {
            p['accuse'] = 1;
        } else {
            p['accuse'] = 0;
        }

        if (p['accuse'] == 1) {
            if (this.folderFormGroup.value['finalise'] == true) {
                p['finalise'] = 'fini';
            } else {
                p['finalise'] = 'accusation';
            }
        } else {
            if (this.folderFormGroup.value['fini'] == true) {
                p['finalise'] = 'fini';
            } else {
                p['finalise'] = null;
            }
        }
        if (this.acc != null) {
            if (this.acc.cat == this.dep) {
                p.mode = 1;
                p.dest = this.selectedReceiversId;
            } else if (this.acc.cat == this.arr) {
                p.mode = 2;
            } else {
                p.mode = -1;
            }
        } else {
            p.mode = -1;
        }
        this.rest.genReportXl(p).subscribe((r) => {
            console.log(r);

            this.b64toBlob(r['file']).subscribe((res) => {
                this.exportAs.saveAsExcelFile(res, `documania_`);
            });
        });
    }
    openSaveSearchModal() {
        this.dialog.open(SaveSearchComponent, {
          disableClose: true,
          data: {
            search: { ...this.search, searchForm: this.searchForm }
          }
        });
      }

     
      
    savedSearch() {
        this.search = new Search();

        const attributes = new Array<SearchAttribute>();
        attributes[0] = new SearchAttribute(1, this.formData['reference']);
        attributes[1] = new SearchAttribute(2, this.formData['date']);
        if (this.curentNat != null) {
            attributes[2] = new SearchAttribute(
                3,
                this.formData['nature'] + '/__/' + this.curentNat['name']
            );
        } else {
            attributes[2] = new SearchAttribute(3, this.formData['nature']);
        }
        if (this.curentType != null) {
            attributes[3] = new SearchAttribute(
                4,
                this.formData['type'] + '/__/' + this.curentType['name']
            );
        } else {
            attributes[3] = new SearchAttribute(4, this.formData['type']);
        }

        if (this.formData.mode == 1) {
            this.dataDest = '';
            for (let index = 0; index < this.formData.dest.length; index++) {
                const element = this.formData.dest[index];
                this.dataDest +=
                    element +
                    (index != this.formData.dest.length - 1 ? ' /_/ ' : '');
            }
            attributes[4] = new SearchAttribute(5, this.dataDest);
        }
        if (this.formData.mode == 2) {
            attributes[4] = new SearchAttribute(5, this.formData.sender);
        }
        // else
        //   attributes[4] = new SearchAttribute(5, this.formData['destinataire']);

        attributes[5] = new SearchAttribute(6, this.formData['objet']);
        attributes[6] = new SearchAttribute(7, this.formData['instru']);

        attributes[7] = new SearchAttribute(8, this.formData['motif']);
        if (this.formData['accuse'] == true) {
            attributes[8] = new SearchAttribute(
                9,
                '1/__/Accusé de récéption : oui'
            );
        } else {
            attributes[8] = new SearchAttribute(9, '0');
        }
        this.search.attributes = attributes;
        console.log(this.search);
    }
    goBack() {
        if (this.operation !== 'multi') {
            this.route.navigateByUrl('/dashboards');
        } else {
            this.back();
        }
    }
    valid() {
        this.validLink.emit(this.listOfSelectedFolders);
    }

    checkIfChecked(f) {
        if (this.listOfSelectedFolders) {
            return this.listOfSelectedFolders.indexOf(f['id']) !== -1;
        }
        return false;
    }

    openDestDialog(f: any): void {
        this.dialog.open(ChoiseDocComponent, {
          disableClose: true,
          data: {
            mode: 1,
            dest: f.dest
          }
        });
      }
      

    searchButton(e) {}
    setFolderId(f: any): void {
        this.rest.setFolderId(f);
      
        this.rest.getFolderChilds(f, 0, 6).subscribe((r) => {
          if (r['totalElements'] > 0) {
            this.dialog.open(FolderToFoldersComponent, {
              disableClose: true,
              data: { id: f }
            });
          } else {
            this.dialog.open(ResultComponent, {
              disableClose: true,
              data: {
                title: "Aucun résultat",
                text: "Aucun processus lié avec ce processus.",
                etat: -1
              }
            });
          }
        });
      }
      

    exportAsXL() {
        this.rest
            .searchCourrierExport(this.folderFormGroup.value, 'xl')
            .subscribe((r) => {
                this.b64toBlob(r['file']).subscribe((res) => {
                    this.exportAs.saveAsExcelFile(res, `documania_`);
                });
            });
    }

    exportAsPDF(): void {
        this.rest
          .searchCourrierExport(this.folderFormGroup.value, 'pdf')
          .subscribe((r) => {
            this.b64toBlob(r['file']).subscribe(() => {
              this.dialog.open(ViewerComponent, {
                disableClose: true,
                data: {
                  mode: 'repports',
                  base64: r['file']
                }
              });
            });
          });
      }
      
      viewBO(fo: any): void {
        this.rest.getBo64(fo.pathBo).subscribe((resBO) => {
          this.dialog.open(ViewerComponent, {
            disableClose: true,
            data: {
              mode: 'bo',
              base64: resBO['base64'],
              name: fo.reference
            }
          });
        });
      }
      

    //job69
    archive(f) {
        //   this.searchserv.hasAccessTo(f.natureId, 'A').subscribe((r) => {
        //     if (r == 1) {
        //       const ref = this.modalService.open(RongerBoitePopupComponent, {
        //         size: 'xl',
        //       });
        //       ref.componentInstance.idCour = f['id'];
        //       ref.componentInstance.pass.subscribe((rrr) => {
        //         if (rrr == "ok") this.getResult(this.folderFormGroup.value)
        //       });
        //     } else {
        //       this.openModalNoAcc();
        //     }
        //   });
    }
    aa;
    getLocation(f) {
        this.recServ.getElmPathToRoot(f.id).subscribe((r) => {
            console.log(r);

            let strPath = '||==> ';
            let l = r.length;
            let i = 0;
            r.forEach((el) => {
                i++;
                if (i < l)
                    strPath +=
                        el.typeElement.intituleTypeElement +
                        '  :  ' +
                        el.nomElement +
                        ' ==> ';
                if (i == l)
                    strPath +=
                        el.typeElement.intituleTypeElement +
                        '  :  ' +
                        el.nomElement +
                        ' . ';
                // if (l == i)
                //   strPath += "</span>"
            });
            this.aa = strPath;

            this.putPopUp('Localisation du courrier', strPath, f, r);
        });
    }

    putPopUp(tit, msg, f = null, data = null) {
        //   const ref = this.modalService.open(MyIoComponent, {
        //     centered: true,
        //     backdrop: 'static',
        //   });
        //   ref.componentInstance.title = tit;
        //   ref.componentInstance.msg = msg;
        //   ref.componentInstance.mode = 'local';
        //   if (f != null) {
        //     ref.componentInstance.folder = f;
        //   }
        //   if (data != null) {
        //     ref.componentInstance.data = data;
        //   }
        //   ref.componentInstance.pass.subscribe((rrr) => {
        //     ref.dismiss();
        //   });
    }

    //job96

    // Download Reports

    onDownload(data, sliceSize = 512) {
        const b64Data = data.file as string;
        const contentType = 'application/pdf';
        const byteCharacters = atob(b64Data);
        const byteArrays = [];

        for (
            let offset = 0;
            offset < byteCharacters.length;
            offset += sliceSize
        ) {
            const slice = byteCharacters.slice(offset, offset + sliceSize);

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
        link.download = new Date().toLocaleDateString();
        link.dispatchEvent(
            new MouseEvent('click', {
                bubbles: true,
                cancelable: true,
                view: window,
            })
        );
    }
    b64toBlob(b64Data, contentType = '', sliceSize = 512) {
        return new Observable((sub) => {
            const byteCharacters = atob(b64Data);
            const byteArrays = [];

            for (
                let offset = 0;
                offset < byteCharacters.length;
                offset += sliceSize
            ) {
                const slice = byteCharacters.slice(offset, offset + sliceSize);

                const byteNumbers = new Array(slice.length);
                for (let i = 0; i < slice.length; i++) {
                    byteNumbers[i] = slice.charCodeAt(i);
                }

                const byteArray = new Uint8Array(byteNumbers);
                byteArrays.push(byteArray);
            }

            const blob = new Blob(byteArrays, { type: contentType });

            sub.next(blob);
        });
    }
    changeDate() {
        this.folderFormGroup
            .get('toDate')
            .setValue(this.folderFormGroup.value['deDate']);
    }

    shareFolder(f: any): void {
        this.dialog.open(ShareFolderComponent, {
          disableClose: true, 
          data: {
            folder: f
          }
        });
      }
      

      tracked(f: any): void {
        // this.dialog.open(EmailTrackListComponent, {
        //   disableClose: true,
        //   data: {
        //     folder: f
        //   }
        // });
      }
      
}
