import { Component, HostListener, ViewChild, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialog } from '@angular/material/dialog';
import { MaterialModuleModule } from 'shared/material-module/material-module.module';
import { AddDocumentPopupComponent } from 'app/components/dialogs/add-document-popup/add-document-popup.component';
import { environment } from 'environments/environment.development';
import { DataSharingService } from 'app/components/services/data-sharing.service';
import { ConfigService } from 'app/components/services/config.service';
import { ShareFoldersService } from 'app/components/services/share-folders.service';
import { Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { NgxPaginationModule } from 'ngx-pagination';
import { FolderComponent } from '../folder/folder.component';
import { MatDrawer } from '@angular/material/sidenav';
import { TranslocoModule, TranslocoService } from '@ngneat/transloco';
import { StepEtatDialogComponent } from 'app/components/dialogs/step-etat-dialog/step-etat-dialog.component';
import { Confirmation2Component } from 'app/components/dialogs/confirmation2/confirmation2.component';

@Component({
    selector: 'app-courries-partages',
    standalone: true,
    imports: [
        CommonModule,
        TranslocoModule,
        MaterialModuleModule,
        NgxPaginationModule,
        FolderComponent,
    ],
    templateUrl: './courries-partages.component.html',
    styleUrl: './courries-partages.component.scss',
})
export class CourriesPartagesComponent implements OnInit {
    @ViewChild('matDrawer') matDrawer!: MatDrawer;

    constructor(
        public share: DataSharingService,
        private route: Router,
        public config: ConfigService,
        private service: ShareFoldersService,
        private cookies: CookieService,
        private translocoService: TranslocoService,
        private dialog : MatDialog
    ) {}
    page = 0;
    size = 18;
    totalCheck;
    resultTotal = 1;
    totalePages = 0;
    user;
    sharedFolders;
    totalEl;
    pages: Array<number> = new Array<number>();
    hideRefAuto = environment.hideRefAuto;
    HideSuppPartage = environment.HideSuppPartage;

    ngOnInit(): void {
        this.checkScreenSize();

        if (this.cookies.check('folders')) {
            this.viewMode = Number.parseInt(this.cookies.get('folders'));
        }
        this.goPage(0);
    }

    mode(a) {
        this.cookies.set('folders', a);
        this.viewMode = a;
    }
    back() {
        this.route.navigateByUrl('/app/dashboard');
    }

    viewMode = 0;
    isMobile = false;
    @HostListener('window:resize', [])
    onResize() {
        this.checkScreenSize();
    }

    checkScreenSize() {
        this.isMobile = window.innerWidth <= 767;
    }


    goBack() {
        this.route.navigateByUrl('apps/courrier-recents');
      }

    goPage(p) {
        this.page = p;
        this.getFolders();
    }
    getFolders() {
        this.totalCheck = -1;
        this.service
            .getSharedFolders(this.page, this.size)
            .subscribe((resp) => {
                this.sharedFolders = resp['content'];
                console.log('sharedFolders', this.sharedFolders);
                this.totalePages = resp['totalPages'];
                this.resultTotal = resp['totalElements'];
                this.totalEl = resp['totalElements'];
                this.pages = new Array<number>(this.totalePages);
                this.totalCheck = 1;
            });
    }
    openModal(f: any): void {
         this.dialog.open(StepEtatDialogComponent, {
          disableClose: true,
          data: { courrier: f }
        });
      }
      
    openFolder(f) {
        this.share.folderToOpen = f;
        this.route.navigateByUrl('/apps/documents-list?search=' + true);
        sessionStorage.setItem('fromShare', 'true');
    }

    DeleteShareFolder(sharedFolder) {
        this.service.DeleteSharedFolders(sharedFolder.id).subscribe(res => {
          this.openModalres("Supprimé avec succès", "Supprimé avec succès", 1);
          this.goPage(this.page);
        }, err => {
          this.openModalres("Erreur","Impossible de supprimer ce type.", -1);
        })
    }

    openModalres(title: string, txt: string, et: any): void {
        this.dialog.open(Confirmation2Component, {
          disableClose: true,
          data: {
            title,
            text: txt,
            etat: et
          }
        });
      }

    isDrawerOpen = false;
    drawerDetails: { label: string; value: any }[] = [];

    // Open the drawer
    closeDrawer() {
        this.matDrawer.close();
    }
    openDetailsDrawer(folder: any) {
        this.drawerDetails = [
            {
                label: this.translocoService.translate(
                    'courrierList.reference'
                ),
                value: folder.reference,
            },
            {
                label: this.translocoService.translate('courrierList.date'),
                value: folder.date,
            },
            {
                label: this.translocoService.translate('courrierList.type'),
                value: folder.type,
            },
            {
                label: this.translocoService.translate(
                    'courrierList.categorie'
                ),
                value: folder.natureName || 'N/A',
            },
            {
                label: this.translocoService.translate('courrierList.emetteur'),
                value: folder.emet__ || 'N/A',
            },
            {
                label: this.translocoService.translate(
                    'courrierList.proprietaire'
                ),
                value: folder.owner?.fullName || 'N/A',
            },
            {
                label: this.translocoService.translate('courrierList.objet'),
                value: folder.objet || 'N/A',
            },
        ];
        this.matDrawer.toggle();
    }
}
