import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialModuleModule } from 'shared/material-module/material-module.module';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-update-type-courrier-dialog',
  standalone: true,
  imports: [CommonModule,MaterialModuleModule],
  templateUrl: './update-type-courrier-dialog.component.html',
  styleUrl: './update-type-courrier-dialog.component.scss'
})
export class UpdateTypeCourrierDialogComponent {
    constructor(public dialogRef: MatDialogRef<UpdateTypeCourrierDialogComponent>) {}

    closeDialog() {
        this.dialogRef.close();
    }
}
