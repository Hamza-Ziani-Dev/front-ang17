import { Component, EventEmitter, Inject, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialModuleModule } from 'shared/material-module/material-module.module';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ConfigService } from 'app/components/services/config.service';
import { TranslocoModule, TranslocoService } from '@ngneat/transloco';

@Component({
    selector: 'app-delete-confirmation-dialog',
    standalone: true,
    imports: [CommonModule, MaterialModuleModule, TranslocoModule],
    templateUrl: './delete-confirmation-dialog.component.html',
    styleUrl: './delete-confirmation-dialog.component.scss',
})
export class DeleteConfirmationDialogComponent {
    @Output() pass = new EventEmitter<string>();
    @Input() msg: string = '';

    constructor(
        private translocoService: TranslocoService,
        public dialogRef: MatDialogRef<DeleteConfirmationDialogComponent>,
        @Inject(MAT_DIALOG_DATA) public data: any,
        public config: ConfigService
    ) {
        this.msg = data.msg;
    }

    action(res: string): void {
        this.pass.emit(res);
        this.dialogRef.close();
    }
}
