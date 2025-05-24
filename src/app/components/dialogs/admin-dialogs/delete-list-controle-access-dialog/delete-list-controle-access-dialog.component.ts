import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-delete-list-controle-access-dialog',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './delete-list-controle-access-dialog.component.html',
  styleUrl: './delete-list-controle-access-dialog.component.scss'
})
export class DeleteListControleAccessDialogComponent {
    constructor(public dialogRef: MatDialogRef<DeleteListControleAccessDialogComponent>) {}

    closeDialog(){
        this.dialogRef.close(false);
    }

}
