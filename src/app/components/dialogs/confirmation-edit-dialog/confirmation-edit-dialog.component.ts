import { Component, EventEmitter, Inject, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { TranslocoModule, TranslocoService } from '@ngneat/transloco';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@Component({
    selector: 'app-confirmation-edit-dialog',
    standalone: true,
    imports: [CommonModule, TranslocoModule, FormsModule, ReactiveFormsModule],
    templateUrl: './confirmation-edit-dialog.component.html',
    styleUrl: './confirmation-edit-dialog.component.scss',
})
export class ConfirmationEditDialogComponent {
    @Output() back = new EventEmitter<any>();
    @Input() title;
    @Input() text;
    @Input() text2;
    constructor(
        public dialogRef: MatDialogRef<ConfirmationEditDialogComponent>,
        @Inject(MAT_DIALOG_DATA) public data: any
    ) {
        this.title = data.title;
        this.text = data.text;
        this.text2 = data.text2;
    }

    action(response: string): void {
        this.back.emit(response);
        this.dialogRef.close();
        if (response === 'yes' && this.data.parentRef) {
            this.data.parentRef.close('ok');
        }
    }
}
