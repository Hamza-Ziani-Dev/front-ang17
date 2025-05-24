import { CommonModule } from '@angular/common';
import {
    Component,
    EventEmitter,
    HostListener,
    Input,
    OnInit,
    Output,
    ViewChild,
    ViewEncapsulation,
} from '@angular/core';
import { TranslocoModule, TranslocoService } from '@ngneat/transloco';
import { ActivatedRoute, Router } from '@angular/router';
import { MaterialModuleModule } from 'shared/material-module/material-module.module';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { UpdateCourrierRecentComponent } from 'app/components/dialogs/update-courrier-recent/update-courrier-recent.component';
import { MatDrawer } from '@angular/material/sidenav';
import { ConfirmationDialogComponent } from 'app/components/dialogs/confirmation-dialog/confirmation-dialog.component';
import { ConfigService } from 'app/components/services/config.service';
import { HttpClientModule } from '@angular/common/http';
import { ToastrService } from 'ngx-toastr';
import { FolderService } from 'app/components/services/folder.service';
import { AuthService } from 'app/components/auth/services/auth.service';
import { RestDataApiService } from 'app/components/services/rest-data-api.service';
import { User } from 'app/components/models/User';
import { environment } from 'environments/environment.development';
import { CookieService } from 'ngx-cookie-service';
import { SessionStorageService } from 'app/components/services/session-storage.service';
import { PreviousRouteService } from 'app/components/services/previous-route.service';
import { SignService } from 'app/components/services/sign.service';
import { ConfigurationsService } from 'app/components/services/configurations.service';
import { IntegrationService } from 'app/components/services/integration.service';
import { DataSharingService } from 'app/components/services/data-sharing.service';
import { EditDocumentService } from 'app/components/services/edit-document.service';
import { Folder } from 'app/components/models/folder.model';
import { DeleteCourrierDialogComponent } from 'app/components/dialogs/delete-courrier-dialog/delete-courrier-dialog.component';
import { NotAccessOperationDialogComponent } from 'app/components/dialogs/not-access-operation-dialog/not-access-operation-dialog.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FolderComponent } from '../folder/folder.component';

@Component({
    selector: 'app-courriers-recents',
    templateUrl: './courriers-recents.component.html',
    styleUrls: ['./courriers-recents.component.scss'],
    encapsulation: ViewEncapsulation.None,
    standalone: true,
    imports: [
        CommonModule,
        MaterialModuleModule,
        TranslocoModule,
        HttpClientModule,
        FormsModule,
        ReactiveFormsModule,
        FolderComponent,
    ],
})
export class CourriersRecentsComponent implements OnInit {
    @ViewChild('matDrawer') matDrawer!: MatDrawer;
    ngOnChanges() {}
    @Input() mode;
    @Input() retour;
    @Input() folder;
    @Output() folderClick = new EventEmitter();
    @Output() folderClient = new EventEmitter();
    @Input() checked = false;
    public lastWeekFolders: Folder[];
    public lastMonthFolders: Folder[];
    public totalweekpage: number;
    public totalMonthpage: number;
    public totaloldpage: number;
    public OLDFolders: Folder[];
    weekPages: Array<number> = new Array<number>();
    mounthPages: Array<number> = new Array<number>();
    oldPages: Array<number> = new Array<number>();

    public pageNumber: number = 0;
    public pageSize: number = 6;
    public pageNumberMonth: number = 0;
    public pageSizeMonth: number = 6;
    public pageNumberOld: number = 0;
    public pageSizeOld: number = 6;
    public favoriteFoldersIds: string[];
    public isLoading: boolean;
    public countOfLastMonth;
    public countOfLastWeek = -1;
    totalCheckweek = -1;
    totalCheckMonth = -1;
    totalCheckOld = -1;
    countOld: number;
    currentDisplay = 1;
    all = -1;
    u;
    logo: string = undefined;
    user: User;
    countDoc = 0;
    messageNumber = 0;
    sharedFoldersNumber = 0;
    courrierNumber = 0;
    etat = 0;
    etatSrch = 0;
    dataMessage;
    courrierMessage;
    us;
    end: String;
    photo: string;
    showLang: Boolean;
    hasAccessSubo: Boolean = false;
    year = new Date().getFullYear();
    name = environment.footer;
    state = false;
    constructor(
        public config: ConfigService,
        public cookies: CookieService,
        public routSnap: ActivatedRoute,
        private dialog: MatDialog,
        public storage: SessionStorageService,
        public prevouis: PreviousRouteService,
        public signService: SignService,
        private configs: ConfigurationsService,
        public integrationService: IntegrationService,
        private folderService: FolderService,
        public share: DataSharingService,
        private rest: RestDataApiService,
        private srvDoc: EditDocumentService,
        private toast: ToastrService,
        private translocoService: TranslocoService
    ) {
        this.u = JSON.parse(sessionStorage.getItem('uslog'));
    }
    ngOnInit(): void {
        this.countOfLastMonth = -1;
        this.countOfLastWeek = -1;
        this.countOld = -1;
        this.all = -1;
        this.getAll();
        this.isLoading = true;
        this.showLang = environment.showLang;
        this.timeout();
        this.reload();

    }

    // Favorite :
    fav(folder) {
        const u = JSON.parse(sessionStorage.getItem('uslog'));
        if (folder.favoriteBay.indexOf('/') != -1) {
            folder.favoriteBay.split('/').forEach((ui) => {
                if (u.userId == (ui as number)) {
                    return true;
                }
            });
        } else if (folder.favoriteBay.indexOf('/') == -1) {
            if (u.userId == (folder.favoriteBay as number)) {
                return true;
            }
        }
        return false;
    }
    // Dialog Not Access:
    openDialogNoAcc(): void {
        const dialogRef = this.dialog.open(NotAccessOperationDialogComponent, {
            data: {
                title: this.translocoService.translate('courrierList.pasDaccestitre'),
                etat: -1,
                text: this.translocoService.translate('courrierList.pasDaccestxt'),
            },
        });

        dialogRef.afterClosed().subscribe((result) => {
        });
    }


    week: number = 0;
      next() {
        if (this.pageNumber < this.weekPages.length - 1) {
          this.pageNumber += 1;
          this.week = this.pageNumber;
        }
      }

      Previous() {
        if (this.pageNumber > 0) {
          this.pageNumber -= 1;
          this.week = this.pageNumber;
        }
      }

    nextMonth() {
        if (this.pageNumberMonth < this.mounthPages.length - 1) {
          this.pageNumberMonth += 1;
          this.month = this.pageNumberMonth;
        }
      }

      PreviousMonth() {
        if (this.pageNumberMonth > 0) {
          this.pageNumberMonth -= 1;
          this.month = this.pageNumberMonth;
        }
      }

      old: number = 0;



      nextOLD() {
        if (this.pageNumberOld < this.oldPages.length - 1) {
          this.pageNumberOld += 1;
          this.old = this.pageNumberOld;
        }
      }

      PreviousOLD() {
        if (this.pageNumberOld > 0) {
          this.pageNumberOld -= 1;
          this.old = this.pageNumberOld;
        }
      }

    // Delete Folder :
    deleteFolder(id: string, from: number) {
        this.srvDoc.hasAccessToDeleteN(id).subscribe((r) => {
            if (r === 1) {
                const confRef = this.dialog.open(ConfirmationDialogComponent, {
                    disableClose: true,
                    data: { target: 'courrier' },
                });
                confRef.componentInstance.pass.subscribe((resp) => {
                    if (resp === 'yes') {
                        this.rest.deleteFolder(id).subscribe(() => {
                            const resultRef = this.dialog.open(
                                DeleteCourrierDialogComponent,
                                {
                                    disableClose: true,
                                    data: { title: 'Supprimé avec succés' },
                                }
                            );
                            // Refresh data based on 'from' value
                            if (from === 1) {
                                this.getAllFolders();
                                this.getAllFoldersMonth();
                            } else if (from === 3) {
                                this.getAllFoldersOLD();
                            }
                        });
                    }
                });
            } else {
                this.openDialogNoAcc();
            }
        });
    }

    //   Edit Folder :
    editFolder(folder) {
        this.srvDoc.hasAccessToEditN(folder.id).subscribe((r) => {
            if (r === 1) {
                const dialogRef = this.dialog.open(
                    UpdateCourrierRecentComponent,
                    {
                        disableClose: true,
                        data: { folder: folder },
                    }
                );

                dialogRef.afterClosed().subscribe((result) => {
                    if (result === 'ok') {
                        this.ngOnInit();
                    }
                });
            } else {
                this.openDialogNoAcc();
            }
        });
    }

    isfav = false;
    click(folder) {
        this.isfav = false;
        folder.favoriteBay.split('/').forEach((ui) => {
            if (this.u.userId.toString() == ui) {
                this.isfav = true;
            }

        });
    }
    // Get All :
    getAll() {
        this.folderService.getAll(this.pageNumber, this.pageSize).subscribe((r) => {
                const p = r[0];
                this.lastWeekFolders = p['content'];
                this.countOfLastWeek = p['totalElements'];
                this.totalCheckweek = p['totalElements'];
                this.totalweekpage = p['totalPages'] as number;
                this.weekPages = new Array<number>(this.totalweekpage);
                for (let index = 0; index < this.totalweekpage; index++) {
                    this.weekPages[index] = index;
                }
                const w = r[1];
                this.lastMonthFolders = r[1]['content'];
                this.countOfLastMonth = r[1]['totalElements'];

                this.totalMonthpage = r[1]['totalPages'] as number;
                this.mounthPages = new Array<number>(this.totalMonthpage);
                for (let index = 0; index < this.totalMonthpage; index++) {
                    this.mounthPages[index] = index;
                }
                this.OLDFolders = r[2]['content'];
                this.countOld = r[2]['totalElements'];
                this.totaloldpage = r[2]['totalPages'] as number;
                this.oldPages = new Array<number>(this.totaloldpage);
                for (let index = 0; index < this.totaloldpage; index++) {
                    this.oldPages[index] = index;
                }
                this.all = 1;
                this.totalCheckweek = 1;
                this.totalCheckMonth = 1;
                this.totalCheckOld = 1;
            });
    }

    onScroll() {}

    // Get One By One :
    getOneByOne() {
        this.folderService
            .getAllFolders(this.pageNumber, this.pageSize)
            .subscribe((folders) => {
                this.lastWeekFolders = folders.content;
                this.countOfLastWeek = folders.totalElements;
                this.totalweekpage = folders['totalPages'] as number;
                this.weekPages = new Array<number>(this.totalweekpage);
                this.totalCheckweek = 1;
                this.folderService
                    .getAllFoldersMonth(
                        this.pageNumberMonth,
                        this.pageSizeMonth
                    )
                    .subscribe((foldersM) => {
                        this.lastMonthFolders = foldersM.content;
                        this.countOfLastMonth = foldersM.totalElements;

                        this.totalMonthpage = foldersM['totalPages'] as number;
                        this.mounthPages = new Array<number>(
                            this.totalMonthpage
                        );

                        this.totalCheckMonth = 1;
                        this.folderService
                            .getAllFoldersOLD(
                                this.pageNumberOld,
                                this.pageSizeOld
                            )
                            .subscribe((foldersO) => {
                                this.OLDFolders = foldersO.content;
                                this.countOld = foldersO.totalElements;

                                this.totaloldpage = foldersO[
                                    'totalPages'
                                ] as number;
                                this.oldPages = new Array<number>(
                                    this.totaloldpage
                                );

                                this.totalCheckOld = 1;
                            });
                    });
            });
    }

    // get All Folders :
    getAllFolders() {
        this.totalCheckweek = -1;
        this.folderService.getAllFolders(this.pageNumber, this.pageSize)
            .subscribe((folders) => {
                this.lastWeekFolders = folders.content;
                this.countOfLastWeek = folders.totalElements;
                this.totalCheckweek = folders.totalElements;
                this.totalweekpage = folders['totalPages'] as number;
                this.weekPages = new Array<number>(this.totalweekpage);

                if (
                    folders.totalElements > 1 &&
                    folders['numberOfElements'] == 0
                ) {
                    this.pageNumber -= 1;
                    // $('#old').val(this.pageNumber).change();
                    this.folderService
                        .getAllFolders(this.pageNumber, this.pageSize)
                        .subscribe((f) => {
                            this.lastWeekFolders = f.content;
                            this.totalCheckweek = f.totalElements;
                            this.countOfLastWeek = f.totalElements;
                            this.totalweekpage = f['totalPages'] as number;
                        });
                }
            });
    }

    // Get All Folders Month :
    getAllFoldersMonth() {
        this.totalCheckMonth = -1;
        this.folderService
            .getAllFoldersMonth(this.pageNumberMonth, this.pageSizeMonth)
            .subscribe((folders) => {
                this.lastMonthFolders = folders.content;
                this.countOfLastMonth = folders.totalElements;
                this.totalMonthpage = folders['totalPages'] as number;
                this.mounthPages = new Array<number>(this.totalMonthpage);
                if (
                    folders.totalElements > 1 &&
                    folders['numberOfElements'] == 0
                ) {
                    this.pageNumberMonth -= 1;
                    this.folderService
                        .getAllFoldersMonth(
                            this.pageNumberMonth,
                            this.pageSizeMonth
                        )
                        .subscribe((f) => {
                            this.lastMonthFolders = f.content;
                            this.countOfLastMonth = f.totalElements;
                            this.totalMonthpage = f['totalPages'] as number;
                        });
                }
                this.totalCheckMonth = 1;
            });
    }
     // Get All Folders OLD :
     getAllFoldersOLD() {
        this.totalCheckOld = -1;
        this.folderService.getAllFoldersOLD(this.pageNumberOld, this.pageSizeOld)
            .subscribe((folders) => {
                this.OLDFolders = folders.content;
                this.countOld = folders.totalElements;
                this.totaloldpage = folders['totalPages'] as number;
                this.oldPages = new Array<number>(this.totaloldpage);

                if (
                    folders.totalElements > 1 &&
                    folders['numberOfElements'] == 0
                ) {
                    this.pageNumberOld -= 1;
                    this.folderService
                        .getAllFoldersOLD(
                            this.pageNumberOld,
                            this.pageSizeMonth
                        )
                        .subscribe((f) => {
                            this.OLDFolders = f.content;
                            this.countOld = f.totalElements;
                            this.totaloldpage = f['totalPages'] as number;
                        });
                }
                this.totalCheckOld = 1;
            });
    }

    // Open :
    open() {
        if (this.mode == undefined) {
            if (this.retour == 'recent') {
                this.share.openFolder(this.folder, true);
                sessionStorage.setItem('retour', 'recent');
            } else if (this.retour == 'fav') {
                this.share.openFolder(this.folder, true, true);
                sessionStorage.setItem('retour', 'fav');
            } else {
                this.share.openFolder(this.folder, true);
            }
            this.folderClick.emit();
        }
        if (this.mode == 'steps') {
            this.folderClick.emit(this.folder.id);
        }
        if (this.mode == 'links') {
            if (this.checked == true) {
                this.checked = false;
            } else {
                this.checked = true;
            }
            this.folderClick.emit(this.folder.id);
        }
        if (this.mode == 'linkFolders') {
            if (this.checked == true) {
                this.checked = false;
            } else {
                this.checked = true;
            }
            this.folderClick.emit(this.folder.id);
        }
        if (this.mode == 'client') {
            this.folderClick.emit();
        }
    }

    @Input() fromLst;

    // Click Favorite :
    clickFav() {
        if (this.mode == 'steps' || this.fromLst == true) return null;
    }


    // Add To Favorite :
    addToFavorite(folderId: number, p) {
        this.folderService.addToFavorite(folderId).subscribe((res) => {
            if (p == 1) {
                this.getAllFolders();
            }
            if (p == 2) {
                this.getAllFoldersMonth();
            }
            if (p == 3) {
                this.getAllFoldersOLD();
            }
            this.isLoading = true;
            this.toast.warning(
                this.translocoService.translate('courrierList.addToFav'),
                this.translocoService.translate('common.documaniacourrier')
            );
        });
    }

    // Is Favorite :
    isFavorite(folder) {
        folder.favoriteBay.split('/').forEach((ui) => {
            if (this.u.userId.toString() == ui) {
                return true;
            }
        });
        return false;
    }

    // Delete Favorite Folder :
    DeleteFavoritefolder(folderId: number, p) {
        this.folderService.deletefavoritefolder(folderId).subscribe((res) => {
            this.toast.warning(
                this.translocoService.translate('courrierList.removeFromFav'),
                this.translocoService.translate('common.documaniacourrier')
            );
            if (p == 1) {
                this.getAllFolders();
            }
            if (p == 2) {
                this.getAllFoldersMonth();
            }
            if (p == 3) {
                this.getAllFoldersOLD();
            }
        });
    }

    // Count Folder Recent :
    CountFolderRecent() {
        this.folderService.CountFolderrecent().subscribe((res) => {});
    }

    // Change Month :
    month: number = 0;

    changeMonth(value: number) {
      this.pageNumberMonth = value;
      this.getAllFoldersMonth();
    }

    // Change Week :
    changeWeek(value: number) {
        this.pageNumber = value;
        this.getAllFolders();
      }

    // Change Old :
    changeOld(value: number) {
        this.pageNumberOld = value;
        this.getAllFoldersOLD();
      }

    changeDisplay(e) {
        this.currentDisplay = e;
    }

    ngAfterViewInit(): void {
        this.signService.getCert();
        this.configs.getUserConfigs();
    }

    fs() {
        sessionStorage.setItem('WLS', 'f');
    }
    ds() {
        sessionStorage.setItem('WLS', 'd');
    }

    // Close :
    close() {
        this.etat = 0;
        this.etatSrch = 0;

    }


    show() {
        if (this.etat == 0) this.etat = 1;
        else this.etat = 0;

        this.etatSrch = 0;
        return false;
    }

    showEtat() {
        if (this.etatSrch == 0) this.etatSrch = 1;
        else this.etatSrch = 0;
        this.etat = 0;
        return false;
    }

    timeout() {
        this.timeOutIDs.push(
            setTimeout(() => {
                this.timeout();
            }, 660000) //30
        );
    }

    timeOutIDs: any[] = [];

    // Relaod :
    reload() {
        setTimeout(() => {}, 3000000);
    }
    showMenu(e) {
        if (e.target.checked == true) {
        } else {
        }
    }

    changeLang(lang) {
        //  if(event.target.checked)
        //  {
        //   this.config.getConfigLang('ar')
        //  }
        //  else{
        //   this.config.getConfigLang('fr')
        //  }
        //   this.config.getConfigLang(lang)
    }

    shrinkSideBar(e) {
        if (e == 'true') {
            sessionStorage.setItem('shrink', 'true');
            this.state = true;

            let textArray = document.querySelectorAll('#act-1');

            textArray.forEach((element) => {
                element.classList.add('display-none');
            });
            let aArray = document.querySelectorAll('#center');

            aArray.forEach((element) => {
                element.classList.add('center');
            });

            document.getElementById('open').style.display = 'none';
            document.getElementById('close').style.display = 'flex';
        } else if (e == 'false') {
            sessionStorage.setItem('shrink', 'false');
            this.state = false;

            let textArray = document.querySelectorAll('#act-1');

            textArray.forEach((element) => {
                element.classList.remove('display-none');
            });
            let aArray = document.querySelectorAll('#center');

            aArray.forEach((element) => {
                element.classList.remove('center');
            });

            document.getElementById('open').style.display = 'flex';
            document.getElementById('close').style.display = 'none';
        }
    }

    i = 1;
    @HostListener('window:resize', ['$event'])
    onResize(event) {
        if (event.target.innerWidth < 900) {
            if (this.i == 1 && this.state == true) {
                let textArray = document.querySelectorAll('#act-1');

                textArray.forEach((element) => {
                    element.classList.remove('display-none');
                });
                let aArray = document.querySelectorAll('#center');

                aArray.forEach((element) => {
                    element.classList.remove('center');
                });
                this.i = 2;
            }
        } else {
            this.i = 1;
            if (this.i == 1 && this.state == true) {
                //   $('#image').addClass("image")

                let textArray = document.querySelectorAll('#act-1');

                textArray.forEach((element) => {
                    element.classList.add('display-none');
                });
                let aArray = document.querySelectorAll('#center');

                aArray.forEach((element) => {
                    element.classList.add('center');
                });
            }
        }
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

    onDrawerClosed() {
        this.drawerDetails = [];
    }

    theCheckbox = false;
    toggleVisibility() {
        this.theCheckbox = !this.theCheckbox;
    }
}
