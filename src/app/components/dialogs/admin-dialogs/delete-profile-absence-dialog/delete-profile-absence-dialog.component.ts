import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialogRef } from '@angular/material/dialog';
import { MaterialModuleModule } from 'shared/material-module/material-module.module';

@Component({
  selector: 'app-delete-profile-absence-dialog',
  standalone: true,
  imports: [CommonModule,MaterialModuleModule],
  templateUrl: './delete-profile-absence-dialog.component.html',
  styleUrl: './delete-profile-absence-dialog.component.scss'
})
export class DeleteProfileAbsenceDialogComponent {
    constructor(public dialogRef: MatDialogRef<DeleteProfileAbsenceDialogComponent>) {}

    closeDialog() {
        this.dialogRef.close();
    }
}
