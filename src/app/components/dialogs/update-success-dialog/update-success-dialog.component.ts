import { Component, EventEmitter, Inject, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ConfigService } from 'app/components/services/config.service';
import { TranslocoModule, TranslocoService } from '@ngneat/transloco';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MaterialModuleModule } from 'shared/material-module/material-module.module';

@Component({
  selector: 'app-update-success-dialog',
  standalone: true,
  imports: [CommonModule,TranslocoModule,MaterialModuleModule],
  templateUrl: './update-success-dialog.component.html',
  styleUrl: './update-success-dialog.component.scss'
})
export class UpdateSuccessDialogComponent {
    @Input() name;
  @Input() object;
  @Input() operation;
  @Input() result;
  @Input() message;

  @Output() passEntry = new EventEmitter();
    constructor(
        public config :ConfigService,
        private translocoService: TranslocoService,
        public dialogRef: MatDialogRef<UpdateSuccessDialogComponent>,
        @Inject(MAT_DIALOG_DATA) public data: { name: string; operation: string }
      ) {}

       // Optional: close the dialog
  close(): void {
    this.dialogRef.close();
  }

  pass(){
    this.passEntry.emit()
  }
}
