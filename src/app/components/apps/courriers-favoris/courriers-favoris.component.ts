import {
    Component,
    ElementRef,
    ViewChild,
    ViewEncapsulation,
    OnInit
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialModuleModule } from 'shared/material-module/material-module.module';
import { MatDrawer } from '@angular/material/sidenav';
import { UpdateCourrierRecentComponent } from 'app/components/dialogs/update-courrier-recent/update-courrier-recent.component';
import { ConfirmationDialogComponent } from 'app/components/dialogs/confirmation-dialog/confirmation-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { TranslocoModule, TranslocoService } from '@ngneat/transloco';
import { ConfigService } from 'app/components/services/config.service';
import { FavoriteFolder } from 'app/components/models/favorite-folder';
import { FolderService } from 'app/components/services/folder.service';
import { DataSharingService } from 'app/components/services/data-sharing.service';
import { RestDataApiService } from 'app/components/services/rest-data-api.service';
import { PreviousRouteService } from 'app/components/services/previous-route.service';
import { EditDocumentService } from 'app/components/services/edit-document.service';
import { Router } from '@angular/router';
import { FolderComponent } from '../folder/folder.component';
import { OperationResultDialogComponent } from 'app/components/dialogs/operation-result-dialog/operation-result-dialog.component';
import { DeleteConfirmationDialogComponent } from 'app/components/dialogs/delete-confirmation-dialog/delete-confirmation-dialog.component';
import { ResultComponent } from 'app/components/dialogs/result/result.component';
import { ConfirmationComponent } from 'app/components/dialogs/confirmation/confirmation.component';
import { ResultCourrierComponent } from 'app/components/dialogs/result-courrier/result-courrier.component';
import { NgxPaginationModule } from 'ngx-pagination';

@Component({
    selector: 'app-courriers-favoris',
    standalone: true,
    imports: [
        CommonModule,
        MaterialModuleModule,
        TranslocoModule,
        FolderComponent,
        NgxPaginationModule,
    ],
    templateUrl: './courriers-favoris.component.html',
    styleUrl: './courriers-favoris.component.scss',
    encapsulation: ViewEncapsulation.None, // Disable encapsulation
})
export class CourriersFavorisComponent implements OnInit {
    public getfavoritefolder: any;
    public favoriteFolders: FavoriteFolder[];
    page = 0;
    pages;
    totalCheck;
    public totalfolderFav: number;
    public totalFav: number;
    totalEl;

    @ViewChild('slider') slider: ElementRef;
    @ViewChild('matDrawer') matDrawer!: MatDrawer;
    isDrawerOpened: boolean = false;
    drawerMode: 'side' | 'over';
    isFirstItemVisible = true;
    isLastItemVisible = false;
    currentPage = 0;
    itemsPerPage = 12;
    totalPages = 0;
    constructor(
        private dialog: MatDialog,
        private translocoService: TranslocoService,
        private configService: ConfigService,
        public config: ConfigService,
        private folderService: FolderService,
        public share: DataSharingService,
        private rest: RestDataApiService,
        private previous: PreviousRouteService,
        private srvDoc: EditDocumentService,
        private route: Router
    ) {}

    ngOnInit() {
        this.getfavoritefolders();
    }

    openModale(
        state?: number,
        target?: string,
        message?: string,
        ref?: string
    ) {
        this.dialog.open(OperationResultDialogComponent, {
            disableClose: true,
            data: {
                object: 'le dossier',
                operation:
                    target ?? this.config.c['favoriteFolder']['modification'],
                result: state === 1 ? 'succès' : 'échoué',
                name: ref,
                message: message,
            },
        });
    }


    getfavoritefolders() {
        this.totalCheck = -1;
        this.folderService.getfavoritefolder(this.page).subscribe((folders) => {
            this.totalEl = folders['totalElements'];
            this.favoriteFolders = folders['content'];
            this.totalPages = folders['totalPages'];
            this.totalFav = folders['totalPages '];
            this.totalfolderFav = this.totalEl;
            this.pages = Array.from({ length: this.totalPages }, (_, i) => i);
            this.totalCheck = 1;
        });
    }

    goToPage(pageNumber: number) {
        if (pageNumber >= 0 && pageNumber < this.totalPages) {
            this.page = pageNumber;
            this.getfavoritefolders();
        }
    }

    previousPage() {
        if (this.page > 0) {
            this.page--;
            this.getfavoritefolders();
        }
    }

    nextPage() {
        if (this.page < this.totalPages - 1) {
            this.page++;
            this.getfavoritefolders();
        }
    }

    getPaginationArray(): number[] {
        if (!this.totalPages) return [];
        let pages: number[] = [];

        if (this.totalPages <= 5) {
            return Array.from({ length: this.totalPages }, (_, i) => i);
        }

        if (this.page > 1) pages.push(0);
        if (this.page > 2) pages.push(-1);

        for (
            let i = Math.max(0, this.page - 1);
            i <= Math.min(this.totalPages - 1, this.page + 1);
            i++
        ) {
            pages.push(i);
        }

        if (this.page < this.totalPages - 2) pages.push(-1);
        if (this.page < this.totalPages - 1) pages.push(this.totalPages - 1);

        return pages;
    }

    // Delete Favorite Folder
    DeleteFavoritefolder(folderId: number) {
        console.log("folderId",folderId);
        this.folderService.deletefavoritefolder(folderId).subscribe((res) => {
            this.getfavoritefolders();
        });
    }

    goBack() {
        this.route.navigateByUrl(this.previous.getPreviousUrl());
    }

    // Dialog Modifier
    openModifierDialog(folder: any) {
        this.srvDoc.hasAccessToEditN(folder.id).subscribe((r) => {
            if (r === 1) {
                const dialogRef = this.dialog.open(UpdateCourrierRecentComponent,
                    {
                        disableClose: true,
                        data: { folder },
                    }
                );

                dialogRef.afterClosed().subscribe((result) => {
                    if (result === 'ok') {
                        this.getfavoritefolders();
                    }
                });
            } else {
                this.openModalNoAcc();
            }
        });
    }

    // Dialog Supprimer
    delete(id: number) {
        this.srvDoc.hasAccessToDeleteN(id).subscribe((r) => {
            if (r === 1) {
                const dialogRef = this.dialog.open(ConfirmationComponent, {
                    disableClose: true,
                    data: {
                        target: 'instance',
                    },
                });

                dialogRef.componentInstance.pass.subscribe((resp: string) => {
                    if (resp === 'yes') {
                        this.rest.deleteFolder(id).subscribe(() => {
                            const resultDialogRef = this.dialog.open(ResultCourrierComponent,{
                                    disableClose: true,
                                    data: {
                                        title: this.translocoService.translate('courrierList.deleteSucc'),
                                    },
                                }
                            );
                            this.getfavoritefolders();
                        });
                    }
                    dialogRef.close();
                });
            } else {
                this.openModalNoAcc();
            }
        });
    }

    openModalNoAcc() {
        this.dialog.open(ResultComponent, {
            disableClose: true,
            data: {
                title: this.translocoService.translate('courrierList.pasDaccestitre'),
                etat: -1,
                text: this.translocoService.translate('common.documaniacourrier'),
            },
        });
    }

    // Open the drawer
    closeDrawer() {
        this.matDrawer.close();
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
}
