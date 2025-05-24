import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-delete-processus',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './delete-processus.component.html',
  styleUrl: './delete-processus.component.scss'
})
export class DeleteProcessusComponent {
    constructor(
        public dialogRef: MatDialogRef<DeleteProcessusComponent>
    ) {}

    closeDialog() {
        this.dialogRef.close(false);
    }
}
