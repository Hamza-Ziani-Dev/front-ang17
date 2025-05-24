import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialogRef } from '@angular/material/dialog';
import { MaterialModuleModule } from 'shared/material-module/material-module.module';

@Component({
  selector: 'app-delete-qualite-dialog',
  standalone: true,
  imports: [CommonModule,MaterialModuleModule],
  templateUrl: './delete-qualite-dialog.component.html',
  styleUrl: './delete-qualite-dialog.component.scss'
})
export class DeleteQualiteDialogComponent {
    constructor(
        public dialogRef: MatDialogRef<DeleteQualiteDialogComponent>
    ) {}

    closeDialog() {
        this.dialogRef.close(false);
    }
}
