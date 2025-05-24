import { Component, EventEmitter, HostListener, Input, Output, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialModuleModule } from 'shared/material-module/material-module.module';
import { MatDialog } from '@angular/material/dialog';
import { UpdateCourrierRecentComponent } from 'app/components/dialogs/update-courrier-recent/update-courrier-recent.component';
import { MatDrawer } from '@angular/material/sidenav';
import { environment } from 'environments/environment.development';
import { ConfigService } from 'app/components/services/config.service';
import { DataSharingService } from 'app/components/services/data-sharing.service';
import { RestSearchApiService } from 'app/components/services/rest-search-api.service';
import { RestDataApiService } from 'app/components/services/rest-data-api.service';
import { FolderService } from 'app/components/services/folder.service';
import { EditDocumentService } from 'app/components/services/edit-document.service';
import { CookieService } from 'ngx-cookie-service';
import { Router } from '@angular/router';
import { RxFormBuilder } from '@rxweb/reactive-form-validators';
import { RecordsServiceService } from 'app/components/services/records-service.service';
import { FolderTypeA } from 'app/components/models/FolderType';
import { FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ConfirmationComponent } from 'app/components/dialogs/confirmation/confirmation.component';
import { SearchAttribute } from 'app/components/models/search.model';
import { FolderComponent } from '../folder/folder.component';
import { NgxPaginationModule } from 'ngx-pagination';
import { ChoiseDocComponent } from 'app/components/dialogs/choise-doc/choise-doc.component';
import { ViewerComponent } from '../../dialogs/viewer/viewer.component';
import { StepEtatDialogComponent } from 'app/components/dialogs/step-etat-dialog/step-etat-dialog.component';
import { ResultComponent } from 'app/components/dialogs/result/result.component';
import { TranslocoModule, TranslocoService } from '@ngneat/transloco';
import { FolderToFoldersComponent } from 'app/components/dialogs/folder-to-folders/folder-to-folders.component';
import { ShareFolderComponent } from 'app/components/dialogs/share-folder/share-folder.component';
import { NoResultFoundedComponent } from 'app/components/dialogs/no-result-founded/no-result-founded.component';

@Component({
    selector: 'app-search-result',
    standalone: true,
    imports: [
        CommonModule,
        MaterialModuleModule,
        TranslocoModule,
        FormsModule,
        NgxPaginationModule,
        ReactiveFormsModule,
        FolderComponent,
        NoResultFoundedComponent
    ],
    templateUrl: './search-result.component.html',
    styleUrl: './search-result.component.scss',
})
export class SearchResultComponent   {
    @ViewChild('matDrawer') matDrawer!: MatDrawer;
    @Input() searchId;
    @Input() searchName;
    @Input() search;
    @Output() back = new EventEmitter();
    foldersResult;
    pages;
    folderFormGroup: FormGroup;
    folder;
    page = 0;
    resultTotal;
    dep = environment.depart;
    arr = environment.arrive;
    inter = environment.interne;
    totalCheck = 1;
    sorts = {};
    hideStatus = environment.hideStatus;
    hideRefAuto = environment.hideRefAuto;
    hideAchivage = environment.hideAchivage;
    laisonHide = environment.liasonHide;
    constructor(
        public config: ConfigService,
        public share: DataSharingService,
        private searchserv: RestSearchApiService,
        private rest: RestDataApiService,
        private folderService: FolderService,
        private srvDoc: EditDocumentService,
        private cookies: CookieService,
        private route: Router,
        private recServ: RecordsServiceService,
        private fb: RxFormBuilder,
        private dialog : MatDialog,
        private translocoService: TranslocoService,

    ) {}
    isfav = false;
    u;
    click(folder) {
        console.log(folder);
        this.isfav = false;
        folder.favoriteBay.split('/').forEach((ui) => {
            if (this.u.userId.toString() == ui) {
                this.isfav = true;
            }
        });
    }

    openDest(f: any): void {
        console.log('clicked');
        const dialogRef = this.dialog.open(ChoiseDocComponent, {
          disableClose: true,
          data: {
            mode: 1,
            dest: f.dest
          }
        });

        dialogRef.afterClosed().subscribe(result => {
        });
      }
    archive(f) {
        // this.searchserv.hasAccessTo(f.natureId, 'A').subscribe((r) => {
        //     if (r == 1) {
        //         const ref = this.modalService.open(RongerBoitePopupComponent, {
        //             size: 'xl',
        //         });
        //         ref.componentInstance.idCour = f['id'];
        //         ref.componentInstance.pass.subscribe((rrr) => {
        //             if (rrr == 'ok') this.getResult();
        //         });
        //     } else {
        //         this.openModalNoAcc();
        //     }
        // });
    }

    tracked(f) {
        // const mdl = this.modalService.open(EmailTrackListComponent, {
        //     keyboard: false,
        //     centered: true,
        //     backdrop: 'static',
        // });
        // mdl.componentInstance.folder = f;
    }

    shareFolder(f: any): void {
        const dialogRef = this.dialog.open(ShareFolderComponent, {
          disableClose: true,
          autoFocus: true,
          data: { folder: f },
        });

        dialogRef.afterClosed().subscribe(result => {
        });
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
                    strPath += el.typeElement.intituleTypeElement +
                        '  :  ' +
                        el.nomElement +
                        ' ==> ';
                if (i == l)
                    strPath +=
                        el.typeElement.intituleTypeElement +
                        '  :  ' +
                        el.nomElement +
                        ' . ';
            });
            this.aa = strPath;

            this.putPopUp('Localisation du courrier', strPath, f, r);
        });
    }

    putPopUp(tit, msg, f = null, data = null) {
        // const ref = this.modalService.open(MyIoComponent, {
        //     centered: true,
        //     backdrop: 'static',
        // });
        // ref.componentInstance.title = tit;
        // ref.componentInstance.msg = msg;
        // ref.componentInstance.mode = 'local';
        // if (f != null) {
        //     ref.componentInstance.folder = f;
        // }
        // if (data != null) {
        //     ref.componentInstance.data = data;
        // }
        // ref.componentInstance.pass.subscribe((rrr) => {
        //     ref.dismiss();
        // });
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

        let form = JSON.parse(this.search.searchForm);
        form.order = q;
        this.search.searchForm = JSON.stringify(form);

        this.goPage(this.page);
    }

    viewMode = 0;

    mode(a) {
        this.cookies.set('folders', a);
        this.viewMode = a;

    }

    DeleteFavoritefolder(folderId: number) {
        this.folderService.deletefavoritefolder(folderId).subscribe((res) => {
            this.getResult();
        });
    }
    addToFavorite(folder) {
        console.log(folder.id)
        this.folderService.addToFavorite(folder.id).subscribe(res => {
            this.getResult()
          })
      }
    openModal(f: any): void {
        this.dialog.open(StepEtatDialogComponent, {
          disableClose: true,
          data: {
            courrier: f
          }
        });
      }


      setFolderId(f: number) {
        this.rest.setFolderId(f);
        this.rest.getFolderChilds(f, 0, 6).subscribe((r) => {
          if (r['totalElements'] > 0) {
            const dialogRef = this.dialog.open(FolderToFoldersComponent, {
              disableClose: true,
              data: { id: f }
            });
          } else {
            const dialogRef = this.dialog.open(ResultComponent, {
              disableClose: true,
              data: {
                title: "Aucun résultat",
                text: "Aucun courriers lié avec ce courriers",
                etat: -1
              }
            });
          }
        });
      }
    folders: FolderTypeA[];

    private retriveFoldersType() {
        this.rest.getFloderTypes().subscribe((res) => {
            this.folders = res;
        });
    }
    @HostListener('window:resize', [])
    onResize() {
      this.checkResponsive();
    }

    checkResponsive() {
      if (window.innerWidth < 768 && this.viewMode === 1) {
        this.viewMode = 0;
      }
    }
    ngOnInit(): void {

        this.checkResponsive();

        this.retriveFoldersType();
        if (this.cookies.check('folders')) {
            this.viewMode = Number.parseInt(this.cookies.get('folders'));
        }

        this.folderFormGroup = this.fb.group({
            type: ['', Validators.required],
            reference: ['', Validators.required],
            nature: [''],
            date: ['', Validators.required],
            objet: ['', Validators.required],
            accuse: [''],
            sender: [''],
            order: [''],
            finalise: null,
            instru: '',
            motif: '',
        });
        this.getSearchAttrVal();
        this.u = JSON.parse(sessionStorage.getItem('uslog'));
    }

    delete(id: number): void {
        this.srvDoc.hasAccessToDeleteN(id).subscribe((res) => {
          if (res === 1) {
            const dialogRef = this.dialog.open(ConfirmationComponent, {
              disableClose: true,
              data: {
                target: "courrier"
              }
            });

            dialogRef.afterClosed().subscribe((resp) => {
              if (resp === 'yes') {
                this.srvDoc.hasAccessToDeleteN(id).subscribe((res) => {
                  this.rest.deleteFolder(id).subscribe(() => {
                    this.ngOnInit();
                  });
                });
              }
            });
          } else {
            this.openModalNoAcc();
          }
        });
      }


      editFolder(folder: any): void {
        this.srvDoc.hasAccessToEditN(folder.id).subscribe((res) => {
          if (res === 1) {
            const dialogRef = this.dialog.open(UpdateCourrierRecentComponent, {
              disableClose: true,
              data: {
                folder: folder
              }
            });

            dialogRef.afterClosed().subscribe((r) => {
              if (r === 'ok') {
                this.goPage(this.page);
              }
            });
          } else {
            this.openModalNoAcc();
          }
        });
      }

    goPage(page) {
        this.totalCheck = -1;
        this.page = page;
        this.getResult();
    }

    getSearchAttrVal() {
        this.totalCheck = -1;
        const attributes = new Array<SearchAttribute>();
        const data = { dest: new Array<any>(), type: '' };
        this.searchserv
            .getFrequencySearcheqaAttrs(this.searchId)
            .subscribe((res) => {
                const folderMod = this.folderFormGroup.value;
                (res as Array<any>).forEach((s) => {
                    const se = s.id;
                    attributes.push(
                        new SearchAttribute(se.attribute_id as number, s.value)
                    );
                });
                for (let i = 0; i < attributes.length; i++) {
                    const a = attributes[i];
                    if (a.id === 5) {
                        data.dest = a.value.split('/_/');
                    }
                    if (a.id === 1) {
                        folderMod.reference = a.value;
                    }
                    if (a.id === 4) {
                        data.type = a.value.split('/__/')[1];
                        folderMod.type = Number.parseInt(
                            a.value.split('/__/')[0]
                        );
                    }
                    if (a.id === 2) {
                        folderMod.date = a.value;
                    }
                    if (a.id === 6) {
                        folderMod.objet = a.value;
                    }
                    if (a.id === 3) {
                        folderMod.nature = Number.parseInt(
                            a.value.split('/__/')[0]
                        );
                    }
                    if (a.id === 8) {
                        folderMod.motif = a.value;
                    }
                    if (a.id === 7) {
                        folderMod.instru = a.value;
                    }
                    if (a.id === 9) {
                        folderMod.accuse = a.value.split('/__/')[0];
                    }
                }
                if (data.type == this.dep) {
                    folderMod.mode = 1;
                    folderMod.dest = data.dest;
                } else if (data.type == this.arr) {
                    folderMod.mode = 2;
                    folderMod.sender = data.dest[0];
                } else {
                    folderMod.mode = -1;
                }
                if (folderMod.accuse == '') {
                    folderMod.accuse = 0;
                }
                this.folder = folderMod;
                this.getResult();
                sessionStorage.removeItem('fs');
            });
    }
    totalEl: number;
    getResult() {
        this.searchserv
            .searchFolder(JSON.parse(this.search.searchForm), this.page)
            .subscribe((res) => {
                this.foldersResult = res['content'];
                const totalePages = res['totalPages'];
                this.resultTotal = res['totalElements'];
                this.totalEl = res['totalElements'];
                this.pages = new Array<number>(totalePages);
                this.totalCheck = 1;
            });
    }

    openFolder(f) {
        this.share.folderToOpen = f;
        sessionStorage.setItem('reporting', 'true');
        this.route.navigateByUrl('/apps/documents-list?search=' + true);
    }

    goBack() {
        this.back.emit();
    }
    openModalNoAcc(): void {
        const dialogRef = this.dialog.open(ResultComponent, {
          disableClose: true,
          data: {
            title:"Pas d'accès",
            etat: -1,
            text: "Vous n'êtes pas autorisé à effectuer cette opération."
          }
        });
      }

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
}
