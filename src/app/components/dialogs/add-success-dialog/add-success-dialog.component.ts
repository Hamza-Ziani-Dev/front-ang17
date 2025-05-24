import { Component, EventEmitter, Inject, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ConfigService } from 'app/components/services/config.service';
import { TranslocoModule, TranslocoService } from '@ngneat/transloco';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MaterialModuleModule } from 'shared/material-module/material-module.module';

@Component({
  selector: 'app-add-success-dialog',
  standalone: true,
  imports: [CommonModule,TranslocoModule,MaterialModuleModule],
  templateUrl: './add-success-dialog.component.html',
  styleUrl: './add-success-dialog.component.scss'
})
export class AddSuccessDialogComponent {
    @Output() passEntry = new EventEmitter();
    constructor(
        public config :ConfigService,
        private translocoService: TranslocoService,
        public dialogRef: MatDialogRef<AddSuccessDialogComponent>,
        @Inject(MAT_DIALOG_DATA) public data: { name: string; operation: string }
      ) {}

  close(): void {
    this.dialogRef.close();
  }

  pass(){
    this.passEntry.emit()
  }
}
