import { Component, HostListener, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialModuleModule } from 'shared/material-module/material-module.module';
import { TranslocoModule, TranslocoService } from '@ngneat/transloco';
import { ConfigService } from 'app/components/services/config.service';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DataSharingService } from 'app/components/services/data-sharing.service';
import { Router } from '@angular/router';
import { RestDataApiService } from 'app/components/services/rest-data-api.service';
import { environment } from 'environments/environment.development';
import { MatSelectChange } from '@angular/material/select';
import { NgxPaginationModule } from 'ngx-pagination';
import { ChoiseDocComponent } from 'app/components/dialogs/choise-doc/choise-doc.component';
import { MatDialog } from '@angular/material/dialog';
import { TruncatePipe } from 'app/truncate.pipe';
import { CookieService } from 'ngx-cookie-service';
import { FolderComponent } from '../folder/folder.component';
import { MatDrawer } from '@angular/material/sidenav';

@Component({
  selector: 'app-courrier-mon-equipe',
  standalone: true,
  imports: [CommonModule,TruncatePipe,MaterialModuleModule,TranslocoModule,NgxPaginationModule,ReactiveFormsModule,FormsModule,FolderComponent],
  templateUrl: './courrier-mon-equipe.component.html',
  styleUrl: './courrier-mon-equipe.component.scss'
})
export class CourrierMonEquipeComponent implements OnInit {
    @ViewChild('matDrawer') matDrawer!: MatDrawer;
    
    dep = environment.depart;
    arr = environment.arrive;
    hideStatus = environment.hideStatus
    hideRefAuto = environment.hideRefAuto
    isResult;
    ArchiveForm: FormGroup
    isLoading = true;
    size = 22;
    page = 0;
    users: Array<any>;
    connectedUser
    constructor(
        private translocoService: TranslocoService,
        private configService: ConfigService,
        public config: ConfigService, private rest: RestDataApiService,
      private fb: FormBuilder,
      private route: Router,
      public share: DataSharingService,
      private dialog : MatDialog,
      private cookies: CookieService,
    ) { }
    viewMode = 0;
    isMobile = false;
    @HostListener('window:resize', [])
    onResize() {
      this.checkScreenSize();
    }

    checkScreenSize() {
        this.isMobile = window.innerWidth <= 767;
      }

    ngOnDestroy(): void {
    }
    ngOnInit(): void {
        this.checkScreenSize();

        if (this.cookies.check('folders')) {
            this.viewMode = Number.parseInt(this.cookies.get('folders'));
        }
      this.connectedUser = JSON.parse(sessionStorage.getItem("uslog"))

      this.rest.getUserByParent(this.connectedUser.userId).subscribe((users: any[]) => {
        this.users = users
        this.users.forEach(element => {
          this.selectedReceivers.push(element.fullName)
        });
        if (sessionStorage.getItem("ids")) {
          this.selectedReceiversId = JSON.parse(sessionStorage.getItem("ids"))
          this.users?.forEach(user => {
            this.selectedReceivers.forEach(id => {
              if (id == user.userId) {
                this.selectedReceivers.push(user.fullName)
              }
            })
          })
          this.goPage(this.page);
          sessionStorage.removeItem("ids")
        }
      });
      this.ArchiveForm = this.fb.group({
        user: [0],
        fini: ['']
      });


    }

    selectedReceivers = new Array<any>();
    selectedReceiversId = new Array<any>();

    totalCheck = -1
    totalEl = 0;
    resultTotal = 0
    pages
    foldersResut = new Array<any>();
    currentOrder = false;
    currentParam = "creation_date";
    submit() {

      if (this.selectedReceivers.length > 0) {
        this.totalCheck = -1;
        this.isResult = true;

        this.users?.forEach(user => {
          this.selectedReceivers.forEach(name => {
            if (name == user.fullName) {
              this.selectedReceiversId.push(user.userId)
            }
          })
        })

        let data = {
          ids: this.selectedReceiversId,
          status: this.ArchiveForm.controls["fini"].value
        }

        this.rest.getFolderSub(data, this.page, - 1, this.currentParam, this.currentOrder).subscribe((res: any) => {

          this.totalEl = res['totalElements'];
          this.foldersResut = res['content'];
          const totalePages = res['totalPages'];
          this.resultTotal = res['totalElements'];
          this.pages = new Array<number>(totalePages);

          this.foldersResut.forEach(folder => {


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

          this.totalCheck = 1;
        })
      } else {
        this.openModale("Information",
          "Veuillez choisir un utilisateur",
          0
        )
      }


    }

    openModale(title, txt, et) {
    //   const modalRef = this.modalService.open(Confirmation2Component, { keyboard: false, centered: true });
    //   modalRef.componentInstance.title = title;
    //   modalRef.componentInstance.text = txt;
    //   modalRef.componentInstance.etat = et

    }

    sortBy(param) {
      if (this.currentParam == param) {
        this.currentOrder = !this.currentOrder;
      } else {
        this.currentParam = param;
        this.currentOrder = false;
      }
      this.submit();
    }

    clear() {
      this.selectedReceiversId = new Array<any>();
      this.ArchiveForm.controls['user'].setValue(0)
      this.users.forEach(element => {
        if (
          this.selectedReceivers.indexOf(element.fullName) == -1
        ) {
          this.selectedReceivers.push(element.fullName);
        }
      });
    }


    supp(da) {
      this.selectedReceivers.splice(this.selectedReceivers.indexOf(da), 1);
      if (this.selectedReceivers.length == 1) {
        this.users.forEach(user => {
          this.selectedReceivers.forEach(name => {
            if (name == user.fullName) {
              this.ArchiveForm.controls["user"].setValue(user.userId)
            }
          })
        })
      } else if (this.selectedReceivers.length == 0) {
        this.ArchiveForm.controls["user"].setValue("")
      } else {
        this.ArchiveForm.controls["user"].setValue(0)
      }
    }


    changeSender(e: MatSelectChange) {
        const selectedUserId = e.value;

        if (selectedUserId === 0) {
          this.selectedReceiversId = [];
          this.selectedReceivers = [];
          this.users.forEach(element => {
            this.selectedReceivers.push(element.fullName);
            console.log('Selected User:', element.fullName);
          });
        } else {
          const selectedUser = this.users.find(u => u.userId === selectedUserId);

          if (selectedUser && !this.selectedReceivers.includes(selectedUser.fullName)) {
            this.selectedReceivers.push(selectedUser.fullName);
          }
        }

        if (this.selectedReceivers.length > 0) {
          this.ArchiveForm.controls["user"].setValue(0);
        }
      }


    openFolder(f) {
        console.log("f",f)
      this.share.folderToOpen = f;
      sessionStorage.setItem('subordonne', "true")
      sessionStorage.setItem('ids', JSON.stringify(this.selectedReceiversId))
      this.route.navigateByUrl('/apps/documents-list?search=' + true);
    }

    goPage(i) {
      this.page = i;

      this.submit()
      this.isLoading = true;
    }

    goBack() {
      this.isResult = false;
      this.route.navigateByUrl('apps/courrier-recents');
    }


    mode(a) {
        this.cookies.set('folders', a);
        this.viewMode = a;
    }

    back() {
      this.isResult = false;
      this.page = 0
      this.selectedReceiversId = new Array<any>();
    }

    openDest(f: any) {
        const dialogRef = this.dialog.open(ChoiseDocComponent, {
          disableClose: true,
          data: {
            mode: 1,
            dest: f.dest,
          }
        });

        dialogRef.afterClosed().subscribe(result => {
        });
      }


    result : boolean = false;





  selectedItems: string[] = [];

  // Method to handle adding selected items
  addSelectedItem(selectedValue: string) {
    if (selectedValue && !this.selectedItems.includes(selectedValue)) {
      this.selectedItems.push(selectedValue);
    }
  }

  // Method to remove selected items
  removeSelectedItem(item: string) {
    this.selectedItems = this.selectedItems.filter(selected => selected !== item);
  }


  isDrawerOpen = false;
  drawerDetails: { label: string; value: any }[] = [];

   // Open the drawer
    closeDrawer() {
    this.matDrawer.close();
    }
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


}
