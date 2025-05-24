import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialModuleModule } from 'shared/material-module/material-module.module';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-add-type-courrier-dialog',
  standalone: true,
  imports: [CommonModule,MaterialModuleModule],
  templateUrl: './add-type-courrier-dialog.component.html',
  styleUrl: './add-type-courrier-dialog.component.scss'
})
export class AddTypeCourrierDialogComponent {
    constructor(
        public dialogRef: MatDialogRef<AddTypeCourrierDialogComponent>,
        private dialog: MatDialog
    ) {}

    onClose(){
        this.dialogRef.close(false);
    }



}
