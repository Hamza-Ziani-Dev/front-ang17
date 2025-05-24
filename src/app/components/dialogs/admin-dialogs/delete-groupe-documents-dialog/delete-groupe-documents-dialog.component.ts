import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-delete-groupe-documents-dialog',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './delete-groupe-documents-dialog.component.html',
  styleUrl: './delete-groupe-documents-dialog.component.scss'
})
export class DeleteGroupeDocumentsDialogComponent {
    constructor(public dialogRef: MatDialogRef<DeleteGroupeDocumentsDialogComponent>) {}

    closeDialog(){
        this.dialogRef.close(false);
    }
}
