import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslocoService,TranslocoModule } from '@ngneat/transloco';
import { MatDialog } from '@angular/material/dialog';
import { MaterialModuleModule } from 'shared/material-module/material-module.module';
import { FormsModule } from '@angular/forms';
import { AddAttributesDialogComponent } from 'app/components/dialogs/admin-dialogs/add-attributes-dialog/add-attributes-dialog.component';
import { UpdateAttributesDialogComponent } from 'app/components/dialogs/admin-dialogs/update-attributes-dialog/update-attributes-dialog.component';
import { DeleteAttributesDialogComponent } from 'app/components/dialogs/admin-dialogs/delete-attributes-dialog/delete-attributes-dialog.component';

@Component({
  selector: 'app-attributs',
  standalone: true,
  imports: [CommonModule,MaterialModuleModule,FormsModule,TranslocoModule],
  templateUrl: './attributs.component.html',
  styleUrl: './attributs.component.scss'
})
export class AttributsComponent {
    isChecked: boolean = false;
    constructor(
        private translocoService: TranslocoService,
        private dialog: MatDialog
    ) {
    }
    toggleSwitch() {
        this.isChecked = !this.isChecked;
    }



    // Ajouter Type Document :
    openAjouterAttributsDialog(): void {
        const dialogRef = this.dialog.open(AddAttributesDialogComponent);

        dialogRef.afterClosed().subscribe((result) => {
            if (result) {
            }
        });
    }

     // Supprimer Type Document :
     openSupprimerDialog(): void {
        const dialogRef = this.dialog.open(DeleteAttributesDialogComponent);

        dialogRef.afterClosed().subscribe((result) => {
            if (result) {
            }
        });
    }
    //   Modifier Type Courrier:
    openModifierDialog() {
        const dialogRef = this.dialog.open(UpdateAttributesDialogComponent);

        dialogRef.afterClosed().subscribe((result) => {
            if (result) {
            }
        });
    }
}
