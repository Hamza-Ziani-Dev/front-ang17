import { Component, EventEmitter, Inject, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MaterialModuleModule } from 'shared/material-module/material-module.module';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { TranslocoModule, TranslocoService } from '@ngneat/transloco';

@Component({
    selector: 'app-bulk-add-progress-dialog',
    standalone: true,
    imports: [CommonModule, MaterialModuleModule, MatProgressBarModule,TranslocoModule],
    templateUrl: './bulk-add-progress-dialog.component.html',
    styleUrl: './bulk-add-progress-dialog.component.scss',
})
export class BulkAddProgressDialogComponent {
    @Output() pass = new EventEmitter<void>();
    @Input() count;
    @Input() uploaded;
    @Input() lotName;

    constructor(
        public dialogRef: MatDialogRef<BulkAddProgressDialogComponent>,
        @Inject(MAT_DIALOG_DATA) public data: any
    ) {
        console.log('Data', data);
        console.log('count', data.count);
    }

    emitPass(): void {
        this.pass.emit();
        this.dialogRef.close();
    }

    get notAdded(): number {
        return this.data.uploaded.filter(
            (uploaded) =>
                uploaded.fileadded == false && uploaded.docadded == false
        ).length;
    }

    get notAddedElems(): number {
        return this.data.uploaded.filter(
            (uploaded) =>
                uploaded.fileadded == false && uploaded.docadded == false
        );
    }

    get added(): number {
        return this.data.uploaded.filter(
            (uploaded) =>
                uploaded.fileadded == true && uploaded.docadded == true
        ).length;
    }

    onClose() {
        if (this.data.count == this.data.uploaded.length) {
            this.dialogRef.close();
            this.pass.emit(null);
        }
    }
}
