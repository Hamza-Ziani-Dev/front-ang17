import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslocoService,TranslocoModule } from '@ngneat/transloco';
import { MatDialog } from '@angular/material/dialog';
import { MaterialModuleModule } from 'shared/material-module/material-module.module';
import { FormsModule } from '@angular/forms';
import { AddProfileAbsenceDialogComponent } from 'app/components/dialogs/admin-dialogs/add-profile-absence-dialog/add-profile-absence-dialog.component';
import { DeleteProfileAbsenceDialogComponent } from 'app/components/dialogs/admin-dialogs/delete-profile-absence-dialog/delete-profile-absence-dialog.component';
import { UpdateProfileAbsenceDialogComponent } from 'app/components/dialogs/admin-dialogs/update-profile-absence-dialog/update-profile-absence-dialog.component';


@Component({
  selector: 'app-profile-absence',
  standalone: true,
  imports: [CommonModule,MaterialModuleModule,FormsModule,TranslocoModule],
  templateUrl: './profile-absence.component.html',
  styleUrl: './profile-absence.component.scss'
})
export class ProfileAbsenceComponent {
    isChecked: boolean = false;
    constructor(
        private translocoService: TranslocoService,
        private dialog: MatDialog
    ) {}
    toggleSwitch() {
        this.isChecked = !this.isChecked;
    }



    // Ajouter Profile Absence :
    openAjouterProfileAbsenceDialog(): void {
        const dialogRef = this.dialog.open(AddProfileAbsenceDialogComponent);

        dialogRef.afterClosed().subscribe((result) => {
            if (result) {
            }
        });
    }

     // Supprimer Profile Absence  :
     openSupprimerDialog(): void {
        const dialogRef = this.dialog.open(DeleteProfileAbsenceDialogComponent);

        dialogRef.afterClosed().subscribe((result) => {
            if (result) {
            }
        });
    }
    //   Modifier Profile Absence :
    openModifierDialog() {
        const dialogRef = this.dialog.open(UpdateProfileAbsenceDialogComponent);

        dialogRef.afterClosed().subscribe((result) => {
            if (result) {
            }
        });
    }
}
