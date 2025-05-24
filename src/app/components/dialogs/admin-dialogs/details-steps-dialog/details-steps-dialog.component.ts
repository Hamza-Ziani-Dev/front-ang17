import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-details-steps-dialog',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './details-steps-dialog.component.html',
  styleUrl: './details-steps-dialog.component.scss'
})
export class DetailsStepsDialogComponent {
    constructor(
        public dialogRef: MatDialogRef<DetailsStepsDialogComponent>
    ) {}

    closeDialog() {
        this.dialogRef.close(false);
    }
}
