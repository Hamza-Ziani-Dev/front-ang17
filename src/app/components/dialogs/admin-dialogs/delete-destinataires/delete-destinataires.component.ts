import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-delete-destinataires',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './delete-destinataires.component.html',
  styleUrl: './delete-destinataires.component.scss'
})
export class DeleteDestinatairesComponent {
    constructor(public dialogRef: MatDialogRef<DeleteDestinatairesComponent>) {}

    closeDialog(){
        this.dialogRef.close(false);
    }
}
