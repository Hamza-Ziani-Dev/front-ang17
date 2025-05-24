import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialModuleModule } from 'shared/material-module/material-module.module';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-add-profile-absence-dialog',
  standalone: true,
  imports: [CommonModule,MaterialModuleModule],
  templateUrl: './add-profile-absence-dialog.component.html',
  styleUrl: './add-profile-absence-dialog.component.scss'
})
export class AddProfileAbsenceDialogComponent {
    constructor(public dialogRef: MatDialogRef<AddProfileAbsenceDialogComponent>) {}

    closeDialog() {
        this.dialogRef.close();
    }


}
