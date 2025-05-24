import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialogRef } from '@angular/material/dialog';
import { MaterialModuleModule } from 'shared/material-module/material-module.module';
import { TranslocoModule, TranslocoService } from '@ngneat/transloco';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-bordereau-dialog',
  standalone: true,
  imports: [CommonModule,MaterialModuleModule,TranslocoModule,FormsModule],
  templateUrl: './bordereau-dialog.component.html',
  styleUrl: './bordereau-dialog.component.scss'
})
export class BordereauDialogComponent {
    constructor(public dialogRef: MatDialogRef<BordereauDialogComponent>) {}

    onClose(): void {
      this.dialogRef.close();
    }
}
