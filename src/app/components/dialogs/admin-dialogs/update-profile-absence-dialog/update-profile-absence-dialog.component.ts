import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialModuleModule } from 'shared/material-module/material-module.module';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-update-profile-absence-dialog',
  standalone: true,
  imports: [CommonModule,MaterialModuleModule],
  templateUrl: './update-profile-absence-dialog.component.html',
  styleUrl: './update-profile-absence-dialog.component.scss'
})
export class UpdateProfileAbsenceDialogComponent {
    constructor(public dialogRef: MatDialogRef<UpdateProfileAbsenceDialogComponent>) {}

    closeDialog() {
        this.dialogRef.close();
    }

}
