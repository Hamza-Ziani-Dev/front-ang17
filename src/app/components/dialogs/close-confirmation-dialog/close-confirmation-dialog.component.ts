import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialogRef } from '@angular/material/dialog';
import { TranslocoModule, TranslocoService } from '@ngneat/transloco';
import { FormsModule } from '@angular/forms';
import { MaterialModuleModule } from 'shared/material-module/material-module.module';

@Component({
  selector: 'app-close-confirmation-dialog',
  standalone: true,
  imports: [CommonModule,TranslocoModule,FormsModule,MaterialModuleModule],
  templateUrl: './close-confirmation-dialog.component.html',
  styleUrl: './close-confirmation-dialog.component.scss'
})
export class CloseConfirmationDialogComponent {

    @Output() pass = new EventEmitter<any>();

    constructor(
      public dialogRef: MatDialogRef<CloseConfirmationDialogComponent>
    ) {}

    action(res: string) {
      this.pass.emit(res);
      this.dialogRef.close();
    }

}
