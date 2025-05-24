import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialModuleModule } from 'shared/material-module/material-module.module';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-delete-type-courrier-dialog',
  standalone: true,
  imports: [CommonModule,MaterialModuleModule],
  templateUrl: './delete-type-courrier-dialog.component.html',
  styleUrl: './delete-type-courrier-dialog.component.scss'
})
export class DeleteTypeCourrierDialogComponent {
    constructor(public dialogRef: MatDialogRef<DeleteTypeCourrierDialogComponent>) {}

    closeDialog(){
        this.dialogRef.close(false);
    }
}
