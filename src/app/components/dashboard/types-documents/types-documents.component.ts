import { Component, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialModuleModule } from 'shared/material-module/material-module.module';
import { TranslocoService,TranslocoModule } from '@ngneat/transloco';
import { MatDialog } from '@angular/material/dialog';
import { MatDrawer } from '@angular/material/sidenav';
import { AddTypeDocumentDialogComponent } from 'app/components/dialogs/admin-dialogs/add-type-document-dialog/add-type-document-dialog.component';
import { DeleteTypeDocumentDialogComponent } from 'app/components/dialogs/admin-dialogs/delete-type-document-dialog/delete-type-document-dialog.component';
import { UpdateTypeDocumentDialogComponent } from 'app/components/dialogs/admin-dialogs/update-type-document-dialog/update-type-document-dialog.component';

@Component({
  selector: 'app-types-documents',
  standalone: true,
  imports: [CommonModule,MaterialModuleModule,TranslocoModule],
  templateUrl: './types-documents.component.html',
  styleUrl: './types-documents.component.scss'
})
export class TypesDocumentsComponent {
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
    openAjouterTypeDocumentDialog(): void {
        const dialogRef = this.dialog.open(AddTypeDocumentDialogComponent);

        dialogRef.afterClosed().subscribe((result) => {
            if (result) {
            }
        });
    }

     // Supprimer Type Document :
     openSupprimerDialog(): void {
        const dialogRef = this.dialog.open(DeleteTypeDocumentDialogComponent);

        dialogRef.afterClosed().subscribe((result) => {
            if (result) {
            }
        });
    }
    //   Modifier Type Courrier:
    openModifierDialog() {
        const dialogRef = this.dialog.open(UpdateTypeDocumentDialogComponent);

        dialogRef.afterClosed().subscribe((result) => {
            if (result) {
            }
        });
    }


}
