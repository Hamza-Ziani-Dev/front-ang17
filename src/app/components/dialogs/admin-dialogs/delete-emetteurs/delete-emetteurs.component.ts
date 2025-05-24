import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-delete-emetteurs',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './delete-emetteurs.component.html',
  styleUrl: './delete-emetteurs.component.scss'
})
export class DeleteEmetteursComponent {
    constructor(public dialogRef: MatDialogRef<DeleteEmetteursComponent>) {}

    closeDialog(){
        this.dialogRef.close(false);
    }
}
