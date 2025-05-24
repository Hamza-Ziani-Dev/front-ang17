import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-delete-attributes-dialog',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './delete-attributes-dialog.component.html',
  styleUrl: './delete-attributes-dialog.component.scss'
})
export class DeleteAttributesDialogComponent {
    constructor(public dialogRef: MatDialogRef<DeleteAttributesDialogComponent>) {}

    closeDialog(){
        this.dialogRef.close(false);
    }
}
