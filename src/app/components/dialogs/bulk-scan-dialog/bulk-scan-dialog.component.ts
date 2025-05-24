import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialogRef } from '@angular/material/dialog';
import { MaterialModuleModule } from 'shared/material-module/material-module.module';
import { TranslocoModule, TranslocoService } from '@ngneat/transloco';

@Component({
  selector: 'app-bulk-scan-dialog',
  standalone: true,
  imports: [CommonModule,MaterialModuleModule,TranslocoModule],
  templateUrl: './bulk-scan-dialog.component.html',
  styleUrl: './bulk-scan-dialog.component.scss'
})
export class BulkScanDialogComponent {
    constructor(public dialogRef: MatDialogRef<BulkScanDialogComponent>) {}

  onCancel(): void {
    this.dialogRef.close(false); 
  }
}
