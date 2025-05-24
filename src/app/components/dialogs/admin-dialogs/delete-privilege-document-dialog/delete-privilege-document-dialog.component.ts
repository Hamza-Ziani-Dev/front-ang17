import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-delete-privilege-document-dialog',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './delete-privilege-document-dialog.component.html',
  styleUrl: './delete-privilege-document-dialog.component.scss'
})
export class DeletePrivilegeDocumentDialogComponent {
    constructor(public dialogRef: MatDialogRef<DeletePrivilegeDocumentDialogComponent>) {}

    closeDialog(){
        this.dialogRef.close(false);
    }
}
