import { Component,HostListener,OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialModuleModule } from 'shared/material-module/material-module.module';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TranslocoService, TranslocoModule } from '@ngneat/transloco';
import { environment } from 'environments/environment.development';
import { ConfigService } from 'app/components/services/config.service';
import { RestDataApiService } from 'app/components/services/rest-data-api.service';
import { Router } from '@angular/router';
import { DataSharingService } from 'app/components/services/data-sharing.service';
import { NgxPaginationModule } from 'ngx-pagination';
import { TruncatePipe } from 'app/truncate.pipe';
import { MatDialog } from '@angular/material/dialog';
import { StepEtatDialogComponent } from 'app/components/dialogs/step-etat-dialog/step-etat-dialog.component';
import { ChoiseDocComponent } from 'app/components/dialogs/choise-doc/choise-doc.component';
import { CookieService } from 'ngx-cookie-service';
import { FolderComponent } from '../folder/folder.component';
import { MatDrawer } from '@angular/material/sidenav';

@Component({
    selector: 'app-courriers-traites',
    standalone: true,
    imports: [
        CommonModule,
        TranslocoModule,
        MaterialModuleModule,
        FormsModule,
        ReactiveFormsModule,
        NgxPaginationModule,
        TruncatePipe,
        FolderComponent
    ],
    templateUrl: './courriers-traites.component.html',
    styleUrl: './courriers-traites.component.scss',
})
export class CourriersTraitesComponent implements OnInit{
    @ViewChild('matDrawer') matDrawer!: MatDrawer;
    dep = environment.depart;
    arr = environment.arrive;
    inter = environment.interne;
    hideAchivage = environment.hideAchivage;
    laisonHide = environment.liasonHide;
    hideStatus = environment.hideStatus;
    hideRefAuto = environment.hideRefAuto;

    connectedUser;
    size = 22;
    page = 0;
    totalCheck = -1;
    totalEl = 0;
    resultTotal = 0;
    pages;
    foldersResut = new Array<any>();
    currentOrder = false;
    currentParam = 'creation_date';
    isResult;
    isLoading = true;
    ArchiveForm: FormGroup;
    folderTypes: Array<any>;
    acc;
    selectedReceivers = new Array<any>();
    selectedReceiversId = new Array<any>();
    sorts = {};
    constructor(
        public config: ConfigService,
        private rest: RestDataApiService,
        private fb: FormBuilder,
        private route: Router,
        public share: DataSharingService,
        private translocoService: TranslocoService,
        public dialog :MatDialog,
        private cookies : CookieService
    ) {}

      viewMode = 0;
        isMobile = false;
        @HostListener('window:resize', [])
        onResize() {
          this.checkScreenSize();
        }
    
        checkScreenSize() {
            this.isMobile = window.innerWidth <= 767;
          }
    ngOnInit(): void {
        if (this.cookies.check('folders')) {
            this.viewMode = Number.parseInt(this.cookies.get('folders'));
        }

        this.connectedUser = JSON.parse(sessionStorage.getItem('uslog'));
        this.retriveFoldersType();
        this.getReceivers();
        this.getSenders();
        this.ArchiveForm = this.fb.group({
            fini: [''],
            type: [''],
            sender: [''],
            reference: [''],
            order: [''],
            objet: [''],
            dest: [],
            deDate: [''],
            toDate: [''],
            mode: [''],
        });
        if (sessionStorage.getItem('form')) {
            this.ArchiveForm.setValue(
                JSON.parse(sessionStorage.getItem('form'))
            );
            this.isResult = true;
            this.totalCheck = -1;

            this.rest.getMyFolder(this.ArchiveForm.value, this.page).subscribe(
                (res) => {
                    this.totalEl = res['totalElements'];

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
            sessionStorage.removeItem('form');
        }
    }

    goBack() {
        this.isResult = false;
        this.route.navigateByUrl('apps/courrier-recents');
      }
  
  
      mode(a) {
          this.cookies.set('folders', a);
          this.viewMode = a;
      }

    changeDate() {
        this.ArchiveForm.get('toDate').setValue(
            this.ArchiveForm.value['deDate']
        );
    }

    openModal(f: any): void {
        this.dialog.open(StepEtatDialogComponent, {
          data: { courrier: f }
        });
      }


    receivers: Array<any>;
    getReceivers() {
        this.rest.getReceivers().subscribe((r: any) => {
            this.receivers = r;
        });
    }
    senders: Array<any>;
    getSenders() {
        this.rest.getSenders().subscribe((r: any) => {
            this.senders = r;
        });
    }
    private retriveFoldersType() {
        this.rest.getFloderTypes().subscribe((res) => {
            this.folderTypes = res;
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

        this.ArchiveForm.controls['order'].setValue(q);

        this.goPage(this.page);
    }

    openDest(f: any): void {
        const dialogRef = this.dialog.open(ChoiseDocComponent, {
          disableClose: true,
          data: {
            mode: 1,
            dest: f.dest
          }
        });
      }


    changeSuit(e) {
        this.folderTypes.forEach((element) => {
            if (e == element.id) {
                this.acc = element;
            }
        });
        this.ArchiveForm.controls['sender'].setValue('');
    }

   

    back() {
        this.ArchiveForm.reset();
        this.isResult = false;
        this.page = 0;
        this.acc = null;
        this.selectedReceiversId = new Array<any>();
        this.selectedReceivers = new Array<any>();
    }

    clear() {
        if (this.ArchiveForm.dirty) {
            this.ArchiveForm.reset();
            this.acc = null;
            this.selectedReceivers = new Array<any>();
            this.selectedReceiversId = new Array<any>();
        } else {
        }
    }

    openFolder(f) {
        this.share.folderToOpen = f;
        sessionStorage.setItem('mycourrier', 'true');
        sessionStorage.setItem('form', JSON.stringify(this.ArchiveForm.value));
        this.route.navigateByUrl('/apps/documents-list?search=' + true);
    }

    goPage(i = 0) {
        let date = new Date();
        //@ts-ignore
        var getYear = date.toLocaleString('default', { year: 'numeric' });
        var getMonth = date.toLocaleString('default', { month: '2-digit' });
        var getDay = date.toLocaleString('default', { day: '2-digit' });
        var dateFormat = getYear + '-' + getMonth + '-' + getDay;

        if (
            this.ArchiveForm.controls['deDate'].value == '' ||
            this.ArchiveForm.controls['deDate'].value == null
        ) {
            this.ArchiveForm.controls['deDate'].setValue('2015-01-01');
        }
        if (
            this.ArchiveForm.controls['toDate'].value == '' ||
            this.ArchiveForm.controls['toDate'].value == null
        ) {
            this.ArchiveForm.controls['toDate'].setValue(dateFormat);
        }

        this.page = i;
        const p = this.ArchiveForm.value;
        if (this.acc != null) {
            if (this.acc.cat == this.dep) {
                p.mode = 1;
                this.receivers?.forEach((rec) => {
                    this.selectedReceivers.forEach((name) => {
                        if (name == rec.name) {
                            this.selectedReceiversId.push(rec.id);
                        }
                    });
                });
                p.dest = this.selectedReceiversId;
            } else if (this.acc.cat == this.arr) {
                p.mode = 2;
            } else {
                p.mode = -1;
            }
        } else {
            p.mode = -1;
        }
        if (p.order == null) {
            p.order = '';
        }
        this.getResult(p);

        this.isLoading = true;
    }

    supp(da) {
        this.selectedReceivers.splice(this.selectedReceivers.indexOf(da), 1);
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
            if (this.selectedReceivers.indexOf(data.name) == -1) {
                this.selectedReceivers.push(data.name);
            }
            this.ArchiveForm.controls['sender'].setValue('');
        } else return;
    }

    clearchamp(e) {
        this.acc = null;
    }

    getResult(p) {
        this.isResult = true;
        this.totalCheck = -1;

        this.rest.getMyFolder(p, this.page).subscribe(
            (res) => {
                this.totalEl = res['totalElements'];

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
    submit() {
        const p = this.ArchiveForm.value;
        if (this.acc != null) {
            if (this.acc.cat == this.dep) {
                p.mode = 1;
                this.receivers?.forEach((rec) => {
                    this.selectedReceivers.forEach((name) => {
                        if (name == rec.name) {
                            this.selectedReceiversId.push(rec.id);
                        }
                    });
                });
                p.dest = this.selectedReceiversId;
            } else if (this.acc.cat == this.arr) {
                p.mode = 2;
            } else {
                p.mode = -1;
            }
        } else {
            p.mode = -1;
        }

    }

    closeDialog(){

    }
     // Open  Drawer :
     isDrawerOpen = false;
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
