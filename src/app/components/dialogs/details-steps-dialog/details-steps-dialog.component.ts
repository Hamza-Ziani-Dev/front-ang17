import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MaterialModuleModule } from 'shared/material-module/material-module.module';

@Component({
    selector: 'app-details-steps-dialog',
    standalone: true,
    imports: [CommonModule, MaterialModuleModule],
    templateUrl: './details-steps-dialog.component.html',
    styleUrl: './details-steps-dialog.component.scss',
})
export class DetailsStepsDialogComponent {
    constructor(
        public dialogRef: MatDialogRef<DetailsStepsDialogComponent>,
        @Inject(MAT_DIALOG_DATA) public data: any
    ) {
        console.log('Data received in dialog:', data);
    }

    closeDialog(): void {
        this.dialogRef.close();
    }
}
