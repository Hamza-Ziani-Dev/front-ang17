import { Component, EventEmitter, Inject, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { TranslocoModule, TranslocoService } from '@ngneat/transloco';
import { MaterialModuleModule } from 'shared/material-module/material-module.module';

@Component({
    selector: 'app-confirmation',
    standalone: true,
    imports: [CommonModule, TranslocoModule, MaterialModuleModule],
    templateUrl: './confirmation.component.html',
    styleUrl: './confirmation.component.scss',
})
export class ConfirmationComponent {
    @Output() pass: EventEmitter<any> = new EventEmitter();
    @Input() target: string;
    @Input() global: boolean;
    @Input() message;

    constructor(
        public dialogRef: MatDialogRef<ConfirmationComponent>,
        @Inject(MAT_DIALOG_DATA) public data: any
    ) {
        this.message = data.global;
        this.global = data.global;
        this.target = data.target;
    }

    action(res) {
        this.pass.emit(res);
    }

    onClose() {
        this.dialogRef.close();
    }
}
