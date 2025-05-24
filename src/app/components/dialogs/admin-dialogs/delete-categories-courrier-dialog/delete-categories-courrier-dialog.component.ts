import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-delete-categories-courrier-dialog',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './delete-categories-courrier-dialog.component.html',
  styleUrl: './delete-categories-courrier-dialog.component.scss'
})
export class DeleteCategoriesCourrierDialogComponent {
    constructor(public dialogRef: MatDialogRef<DeleteCategoriesCourrierDialogComponent>) {}

    closeDialog(){
        this.dialogRef.close(false);
    }
}
