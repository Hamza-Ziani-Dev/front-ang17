import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-delete-privilege-courrier-dialog',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './delete-privilege-courrier-dialog.component.html',
  styleUrl: './delete-privilege-courrier-dialog.component.scss'
})
export class DeletePrivilegeCourrierDialogComponent {
    constructor(public dialogRef: MatDialogRef<DeletePrivilegeCourrierDialogComponent>) {}

    closeDialog(){
        this.dialogRef.close(false);
    }
}
