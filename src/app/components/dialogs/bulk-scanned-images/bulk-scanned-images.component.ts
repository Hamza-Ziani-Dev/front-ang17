import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-bulk-scanned-images',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './bulk-scanned-images.component.html',
  styleUrl: './bulk-scanned-images.component.scss'
})
export class BulkScannedImagesComponent {
    constructor(
        public dialogRef: MatDialogRef<BulkScannedImagesComponent>,
        @Inject(MAT_DIALOG_DATA) public data: any
      ) {}

      closeDialog() {
        this.dialogRef.close('closed');
      }
}
