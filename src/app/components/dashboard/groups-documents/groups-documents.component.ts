import { Component, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialModuleModule } from 'shared/material-module/material-module.module';
import { TranslocoService,TranslocoModule } from '@ngneat/transloco';
import { MatDialog } from '@angular/material/dialog';
import { MatDrawer } from '@angular/material/sidenav';
import { AddGroupeDocumentsDialogComponent } from 'app/components/dialogs/admin-dialogs/add-groupe-documents-dialog/add-groupe-documents-dialog.component';
import { DeleteGroupeDocumentsDialogComponent } from 'app/components/dialogs/admin-dialogs/delete-groupe-documents-dialog/delete-groupe-documents-dialog.component';
import { UpdateGroupeDocumentsDialogComponent } from 'app/components/dialogs/admin-dialogs/update-groupe-documents-dialog/update-groupe-documents-dialog.component';

@Component({
    selector: 'app-groups-documents',
    standalone: true,
    imports: [CommonModule, MaterialModuleModule,TranslocoModule],
    templateUrl: './groups-documents.component.html',
    styleUrl: './groups-documents.component.scss',
})
export class GroupsDocumentsComponent {
    @ViewChild('matDrawer') matDrawer!: MatDrawer;
    drawerMode: 'side' | 'over';
    isChecked: boolean = false;
    constructor(
        private translocoService: TranslocoService,
        private dialog: MatDialog
    ) {
    }
    toggleSwitch() {
        this.isChecked = !this.isChecked;
    }

    openDetailsDocuments() {
        this.matDrawer.toggle();
    }
    // Method to close the drawer
    closeDrawer() {
        this.matDrawer.close();
    }

    // Ajouter Type Document :
    openAjouterGroupsDocumentDialog(): void {
        const dialogRef = this.dialog.open(AddGroupeDocumentsDialogComponent);

        dialogRef.afterClosed().subscribe((result) => {
            if (result) {
            }
        });
    }

    // Supprimer Type Document :
    openSupprimerDialog(): void {
        const dialogRef = this.dialog.open(
            DeleteGroupeDocumentsDialogComponent
        );

        dialogRef.afterClosed().subscribe((result) => {
            if (result) {
            }
        });
    }
    //   Modifier Type Courrier:
    openModifierDialog() {
        const dialogRef = this.dialog.open(
            UpdateGroupeDocumentsDialogComponent
        );

        dialogRef.afterClosed().subscribe((result) => {
            if (result) {
            }
        });
    }
}
