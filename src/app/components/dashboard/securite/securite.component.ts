import { Component, Input, OnChanges, SimpleChanges, ChangeDetectorRef, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDrawer } from '@angular/material/sidenav';
import { TranslocoModule, TranslocoService } from '@ngneat/transloco';
import { MatDialog } from '@angular/material/dialog';
import { MaterialModuleModule } from 'shared/material-module/material-module.module';
import { AddListControleAccessDialogComponent } from 'app/components/dialogs/admin-dialogs/add-list-controle-access-dialog/add-list-controle-access-dialog.component';
import { DeleteListControleAccessDialogComponent } from 'app/components/dialogs/admin-dialogs/delete-list-controle-access-dialog/delete-list-controle-access-dialog.component';
import { UpdateListControleAccessDialogComponent } from 'app/components/dialogs/admin-dialogs/update-list-controle-access-dialog/update-list-controle-access-dialog.component';
import { FormsModule } from '@angular/forms';
import { AddPrivilegeDocumentDialogComponent } from 'app/components/dialogs/admin-dialogs/add-privilege-document-dialog/add-privilege-document-dialog.component';
import { DeletePrivilegeDocumentDialogComponent } from 'app/components/dialogs/admin-dialogs/delete-privilege-document-dialog/delete-privilege-document-dialog.component';
import { UpdatePrivilegeDocumentDialogComponent } from 'app/components/dialogs/admin-dialogs/update-privilege-document-dialog/update-privilege-document-dialog.component';
import { UpdatePrivilegeCourrierDialogComponent } from 'app/components/dialogs/admin-dialogs/update-privilege-courrier-dialog/update-privilege-courrier-dialog.component';
import { AddPrivilegeCourrierDialogComponent } from 'app/components/dialogs/admin-dialogs/add-privilege-courrier-dialog/add-privilege-courrier-dialog.component';
import { DeletePrivilegeCourrierDialogComponent } from 'app/components/dialogs/admin-dialogs/delete-privilege-courrier-dialog/delete-privilege-courrier-dialog.component';

@Component({
  selector: 'app-securite',
  standalone: true,
  imports: [CommonModule,MaterialModuleModule,FormsModule,TranslocoModule],
  templateUrl: './securite.component.html',
  styleUrl: './securite.component.scss'
})
export class SecuriteComponent implements OnChanges {
    @Input() selectedContent: string = '';
    content: string | null = null; // Default to null
    ngOnChanges(changes: SimpleChanges) {
      if (changes['selectedContent']) {
        console.log('Selected Content changed:', this.selectedContent);
      }
    }
    // List Control Access :
    @ViewChild('matDrawer') matDrawer!: MatDrawer;
    drawerMode: 'side' | 'over';
    isChecked: boolean = false;
    constructor(
        private translocoService: TranslocoService,
        private dialog: MatDialog
    ) {
        // this.checkIfMobile(window.innerWidth);
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

    // Ajouter List Access :
    openAjouterlistAccessDialog(): void {
        const dialogRef = this.dialog.open(AddListControleAccessDialogComponent);

        dialogRef.afterClosed().subscribe((result) => {
            if (result) {
            }
        });
    }

    // Supprimer List Aceess :
    openSupprimerListAccessDialog(): void {
        const dialogRef = this.dialog.open(DeleteListControleAccessDialogComponent);

        dialogRef.afterClosed().subscribe((result) => {
            if (result) {
            }
        });
    }
    //   Modifier List Aceess :
    openModifierListAccessDialog() {
        const dialogRef = this.dialog.open(UpdateListControleAccessDialogComponent);

        dialogRef.afterClosed().subscribe((result) => {
            if (result) {
            }
        });
    }
    // End List Control Access:

    // Privilage :
      // Ajouter Type Courrier :
      openAjouterCourrierDialog(): void {
        const dialogRef = this.dialog.open(AddPrivilegeCourrierDialogComponent);

        dialogRef.afterClosed().subscribe((result) => {
            if (result) {
            }
        });
    }

    // Supprimer Courrier :
    openSupprimerCourrierDialog(): void {
        const dialogRef = this.dialog.open(DeletePrivilegeCourrierDialogComponent);

        dialogRef.afterClosed().subscribe((result) => {
            if (result) {
            }
        });
    }

      // Modifier Courrier :
      openModifierCourrierDialog(): void {
        const dialogRef = this.dialog.open(UpdatePrivilegeCourrierDialogComponent);

        dialogRef.afterClosed().subscribe((result) => {
            if (result) {
            }
        });
    }

     // Ajouter Type Document :
     openAjouterDocumentDialog(): void {
        const dialogRef = this.dialog.open(AddPrivilegeDocumentDialogComponent);

        dialogRef.afterClosed().subscribe((result) => {
            if (result) {
            }
        });
    }

    // Supprimer Document :
    openSupprimerDocumentDialog(): void {
        const dialogRef = this.dialog.open(DeletePrivilegeDocumentDialogComponent);

        dialogRef.afterClosed().subscribe((result) => {
            if (result) {
            }
        });
    }

      // Modifier Document :
      openModifierDocumentDialog(): void {
        const dialogRef = this.dialog.open(UpdatePrivilegeDocumentDialogComponent);

        dialogRef.afterClosed().subscribe((result) => {
            if (result) {
            }
        });
    }
  }


