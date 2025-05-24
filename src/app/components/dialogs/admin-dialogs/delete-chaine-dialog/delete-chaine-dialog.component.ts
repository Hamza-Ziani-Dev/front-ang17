import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialogRef } from '@angular/material/dialog';
import { MaterialModuleModule } from 'shared/material-module/material-module.module';

@Component({
  selector: 'app-delete-chaine-dialog',
  standalone: true,
  imports: [CommonModule,MaterialModuleModule],
  templateUrl: './delete-chaine-dialog.component.html',
  styleUrl: './delete-chaine-dialog.component.scss'
})
export class DeleteChaineDialogComponent {
    constructor(
        public dialogRef: MatDialogRef<DeleteChaineDialogComponent>
    ) {}

    closeDialog() {
        this.dialogRef.close(false);
    }
}
