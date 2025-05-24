import { Component, EventEmitter, Inject, Output,Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialModuleModule } from 'shared/material-module/material-module.module';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { TranslocoModule, TranslocoService } from '@ngneat/transloco';

@Component({
  selector: 'app-confirmation-dialog',
  standalone: true,
  imports: [CommonModule,MaterialModuleModule,TranslocoModule],
  templateUrl: './confirmation-dialog.component.html',
  styleUrl: './confirmation-dialog.component.scss'
})
export class ConfirmationDialogComponent {
    @Output() pass: EventEmitter<any> = new EventEmitter();
    @Input() target: string;
    @Input() global: boolean;
    @Input() message: string;
    @Input() title: string;
    @Input() btnOK: string;
    @Input() isMsg = false;

    isLoading = false;

    constructor(
        public dialogRef: MatDialogRef<ConfirmationDialogComponent>,
        @Inject(MAT_DIALOG_DATA) public data: any
    ) {
        console.log("Data", this.data);
        this.target = data.target;
        this.message = data.message || '';
        this.title = data.title || '';
        this.btnOK = data.btnOK || 'OK';
        this.global = data.global || false;
        this.isMsg = data.isMsg || false;
    }

    confirm(): void {
        this.dialogRef.close('yes');
    }

    onCancel(): void {
        this.dialogRef.close('no');
    }

    action(res: any): void {
        this.pass.emit(res);
        this.dialogRef.close(false);
    }

}
