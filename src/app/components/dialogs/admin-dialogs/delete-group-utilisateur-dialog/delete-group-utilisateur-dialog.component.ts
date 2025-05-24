import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-delete-group-utilisateur-dialog',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './delete-group-utilisateur-dialog.component.html',
  styleUrl: './delete-group-utilisateur-dialog.component.scss'
})
export class DeleteGroupUtilisateurDialogComponent {
    constructor(
        public dialogRef: MatDialogRef<DeleteGroupUtilisateurDialogComponent>
    ) {}

    closeDialog() {
        this.dialogRef.close(false);
    }
}
