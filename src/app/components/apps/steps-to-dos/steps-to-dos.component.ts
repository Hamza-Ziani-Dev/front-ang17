import { AfterViewInit, Component, HostListener, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslocoModule, TranslocoService } from '@ngneat/transloco';
import { MatDialog } from '@angular/material/dialog';
import { MaterialModuleModule } from 'shared/material-module/material-module.module';
import { MatDrawer } from '@angular/material/sidenav';
import { RestDataApiService } from 'app/components/services/rest-data-api.service';
import { environment } from 'environments/environment.development';
import { CookieService } from 'ngx-cookie-service';
import { ConfigService } from 'app/components/services/config.service';
import { Router } from '@angular/router';
import { FolderService } from 'app/components/services/folder.service';
import { DataSharingService } from 'app/components/services/data-sharing.service';
import { Folder } from 'app/components/models/folder.model';
import { EditDocumentService } from 'app/components/services/edit-document.service';
import { NgxPaginationModule } from 'ngx-pagination';
import { FolderComponent } from '../folder/folder.component';
import { DoStepDialogComponent } from 'app/components/dialogs/do-step-dialog/do-step-dialog.component';
import { ChoiseDocComponent } from 'app/components/dialogs/choise-doc/choise-doc.component';
import { ShareFolderComponent } from 'app/components/dialogs/share-folder/share-folder.component';
import { UpdateCourrierRecentComponent } from 'app/components/dialogs/update-courrier-recent/update-courrier-recent.component';
import { ResultComponent } from 'app/components/dialogs/result/result.component';
import { ConfirmationComponent } from 'app/components/dialogs/confirmation/confirmation.component';
import { ResultCourrierComponent } from 'app/components/dialogs/result-courrier/result-courrier.component';
import { StepEtatDialogComponent } from 'app/components/dialogs/step-etat-dialog/step-etat-dialog.component';

@Component({
    selector: 'app-steps-to-dos',
    standalone: true,
    imports: [
        CommonModule,
        MaterialModuleModule,
        TranslocoModule,
        NgxPaginationModule,
        FolderComponent,
    ],
    templateUrl: './steps-to-dos.component.html',
    styleUrl: './steps-to-dos.component.scss',
})
export class StepsToDosComponent   implements OnInit, AfterViewInit{
  @ViewChild('matDrawer') matDrawer!: MatDrawer;
  public lastWeekFolders: Folder[];
  public lastMonthFolders: Folder[];
  public totalweekpage: number;
  public totalMonthpage: number;
  public totaloldpage: number;
  public OLDFolders: Folder[];
  public pageNumber: number = 0;
  public pageSize: number = 18;
  public pageNumberMonth: number = 0;
  public pageSizeMonth: number = 6;
  public pageNumberOld: number = 0;
  public pageSizeOld: number = 6;
  public favoriteFoldersIds: string[];
  public isLoading: boolean;
  public countOfLastMonth;
  public countOfLastWeek;
  totalEl
  totalCheck
  filter
  type
  folders: any;
  user
  isBo = false
  onlyMe;
  viewMode = 1
  hideStatus = environment.hideStatus
  hideRefAuto = environment.hideRefAuto
  constructor(private cookies: CookieService,
    public config: ConfigService,
    private rest: RestDataApiService,
    private dialog: MatDialog,
    private router: Router,
    private folderService: FolderService,
    public share: DataSharingService,
    // public dash: DashboardComponent,
    private srvDoc: EditDocumentService,
  ) { }
    ngAfterViewInit(): void {
    }

  ngOnInit(): void {
    this.detectMobile();
    this.user = JSON.parse(sessionStorage.getItem('uslog'))
    this.rest.getQualityNpPage().subscribe((qualities: any[]) => {
      qualities.forEach(quality => {
        if (quality.ref_bo) {
          if (quality.code == this.user.title) {
            this.isBo = true
          }
        }
      })
    })

    if (this.cookies.check('folders')) {
      this.viewMode = Number.parseInt(this.cookies.get('folders'));
    }
    this.isLoading = true;
    this.retriveFoldersType();
    this.getAllFolders();
  }



  @HostListener('window:resize', ['$event'])
  onResize() {
    this.detectMobile();
  }

  detectMobile() {
    if (window.innerWidth < 768) {
      this.viewMode = 0;
    } else {
      this.viewMode = 1;
    }
  }
  next() {
    this.pageNumber += 1;
    this.getAllFolders();
  }
  weekPages: Array<number>
  changeWeek(e) {
    this.pageNumber = Number.parseInt(e.target.value)


    this.getAllFolders();

  }

  mode(a) {
    this.cookies.set('folders', a);
    this.viewMode = a;
  }

  private retriveFoldersType() {
    this.rest.getFloderTypes().subscribe((res) => {
      this.folders = res;
    });
  }

  openModal(f): void {
    this.dialog.open(StepEtatDialogComponent, {
     disableClose: true,
     data: { courrier: f },
     autoFocus: false
   });
 }

  filterChange(e) {
    if (this.type !== e.target.value) {
      this.pageNumber = 0;
    }
    this.type = e.target.value;
    this.getAllFolders(null, this.onlyMe);
  }



  sortBy(param) {
    if (this.currentParam == param) {
      this.currentOrder = !this.currentOrder;
    } else {
      this.currentParam = param;
      this.currentOrder = false;
    }
    this.getAllFolders(null, this.onlyMe);
  }

  currentOrder = false;
  currentParam = "creation_date";
  getAllFolders(e?, myOnly: any = -1) {
    this.totalCheck = -1;
    this.folderService
      .getStepsToDo(
        this.pageNumber,
        this.pageSize,
        this.type,
        this.currentParam,
        this.currentOrder,
        myOnly
      )
      .subscribe((r) => {
        this.lastWeekFolders = r['content'];
        this.lastWeekFolders.forEach(folder => {
          let onTime = false
          let step;
          folder.etapes.forEach(res => {
            if (res.etat == 0 && onTime == false) {
              onTime = true
              step = res
            }
          })
          if (step) {
            let datenow = new Date();
            let dateFin = new Date(step?.dateFin);

            if (dateFin > datenow && (dateFin.getDay() - datenow.getDay() != 0)) {
              folder.inProgress = true

            } else if (dateFin < datenow) {
              folder.isExpire = true

            } else if ((dateFin > datenow) && (dateFin.getDay() - datenow.getDay() == 0)) {
              folder.closeEnd = true
            }
          }
        })

        if (e != null) {
          this.lastWeekFolders?.forEach((res, index) => {
            if (e.id == res.id) {
              this.lastWeekFolders.splice(index, 1)
            }
          })
        }
        // this.dash.countSteps()
        this.countOfLastWeek = r['totalElements'];
        this.totalEl = r['totalElements'];
        this.totalweekpage = r['totalPages'] as number;
        this.totalCheck = 1;
        this.weekPages = new Array<number>(this.totalweekpage);
        for (let index = 0; index < this.totalweekpage; index++) {
          this.weekPages[index] = index;
        }
        if (r['totalElements'] > 1 && r['numberOfElements'] == 0) {
          this.pageNumber -= 1;
          this.folderService
            .getStepsToDo(
              this.pageNumber,
              this.pageSize,
              this.type,
              this.currentParam,
              this.currentOrder,
              myOnly
            )
            .subscribe((f) => {
              this.lastWeekFolders = r['content'];
              this.countOfLastWeek = r['totalElements'];
              this.totalweekpage = r['totalPages'] as number;
            });
        }

      });
  }
  Previous() {
    this.pageNumber -= 1;
    this.getAllFolders();
  }

  openDest(f: any): void {
    this.dialog.open(ChoiseDocComponent, {
       disableClose: true,
       autoFocus: false,
       data: {
         mode: 1,
         dest: f.dest
       }
     });
   }

  goPage(e) {
    this.pageNumber = e
    this.getAllFolders(null, this.onlyMe);
  }


  onClick = false
  goToChilds(e: any): void {
    if (!this.onClick) {
      this.onClick = true;
      this.folderService.findCurrentStepByFolder(e.id).subscribe((r) => {
        const dialogRef = this.dialog.open(DoStepDialogComponent, {
          disableClose: true,
          autoFocus: false,
          data: {
            courrier: e,
            etape: r
          }
        });

        dialogRef.componentInstance.done.subscribe((res: any) => {
          this.onClick = false;
          if (res === 'ok') {
            setTimeout(() => {
              this.lastWeekFolders = [];
              this.getAllFolders(e, this.onlyMe);
            }, 2000);
          }
          dialogRef.close();
        });
      });
    }
  }
  isFavorite(folder: Folder) {
    return this.favoriteFoldersIds.indexOf(folder.id) >= 0;
  }

  shareFolder(f: any): void {
    this.dialog.open(ShareFolderComponent, {
      disableClose: true,
      autoFocus: false,
      data: {
        folder: f
      }
    });
  }
  acc
  editFolder(folder: any): void {
    this.srvDoc.hasAccessToEditN(folder.id).subscribe((r) => {
      if (r === 1) {
        const dialogRef = this.dialog.open(UpdateCourrierRecentComponent, {
          disableClose: true,
          autoFocus: false,
          data: {
            folder: folder,
            acc: this.acc ?? this.folders.find(el => el.id === folder.type)
          }
        });

        dialogRef.componentInstance.Back.subscribe((res: any) => {
          if (res === 'ok') {
            this.getAllFolders(null, this.onlyMe);
          }
        });
      } else {
        this.openModalNoAcc();
      }
    });
  }



  openModalNoAcc(): void {
    this.dialog.open(ResultComponent, {
      autoFocus: false,
      disableClose: false,
      data: {
        title: "Pas d'accès",
        etat: -1,
        text: "Vous n'êtes pas autorisé à effectuer cette opération."
      }
    });
  }

  getOnlyMycourrier(event) {
    if (event.target.checked == 1) {
      this.onlyMe = 1
      this.getAllFolders(null, this.onlyMe)
    } else {
      this.getAllFolders()
      this.onlyMe = -1
    }
  }

  back() {
    this.router.navigateByUrl('/dashboard')
  }


  keyword = 'name';

  selectEvent(e) {
    this.filterChange({ target: { value: e.id } })
  }
  onChangeSearch(e) {

  }
  onFocused(e) {
  }

  onCleared() {
    if (this.type) {
      this.pageNumber = 0
      this.type = undefined
      this.getAllFolders(null, this.onlyMe);
    }
  }


  changeFilter(e) {
    this.filterChange(e);
  }


  deleteFolder(id: number): void {
    const confirmDialog = this.dialog.open(ConfirmationComponent, {
      disableClose: true,
      autoFocus: false,
      data: {
        target: this.config.c['folderSearch']['courrier']
      }
    });

    confirmDialog.componentInstance.pass.subscribe((resp: string) => {
      if (resp === 'yes') {
        this.rest.deleteFolderWithoutAccess(id).subscribe(() => {
          this.dialog.open(ResultCourrierComponent, {
            disableClose: true,
            autoFocus: false,
            data: {
              title: "Supprimé avec succès"
            }
          });
          this.getAllFolders();
        });
      }
      confirmDialog.close();
    });
  }


    // Open  Drawer :
    isDrawerOpen = false;
    drawerDetails: { label: string; value: any }[] = [];
    openDetailsDrawer(folder: any) {
        this.drawerDetails = [
            { label: 'Numérotation', value: folder.autoRef },
            { label: 'Reference', value: folder.reference },
            { label: 'Date', value: folder.date },
            { label: 'Type', value: folder.type },
            { label: 'Catégorie', value: folder.natureName || 'N/A' },
            { label: 'Émetteur', value: folder.emet__ || 'N/A' },
            { label: 'Propriétaire', value: folder.owner?.fullName || 'N/A' },
            { label: 'Objet', value: folder.objet || 'N/A' },
        ];
        this.matDrawer.toggle();
    }

    closeDrawer() {
        this.matDrawer.toggle();
    }

    onDrawerClosed() {
        this.drawerDetails = [];
    }


}
