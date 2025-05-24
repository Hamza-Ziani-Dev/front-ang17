import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialModuleModule } from 'shared/material-module/material-module.module';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ConfigService } from 'app/components/services/config.service';

@Component({
    selector: 'app-details-dialog',
    standalone: true,
    imports: [CommonModule, MaterialModuleModule],
    templateUrl: './details-dialog.component.html',
    styleUrl: './details-dialog.component.scss',
})
export class DetailsDialogComponent {
    constructor(
        public config: ConfigService,
        public dialogRef: MatDialogRef<DetailsDialogComponent>,
        @Inject(MAT_DIALOG_DATA) public data: any
    ) {
        console.log('data', data);
        console.log('attributeValues', data.attributeValues);
    }

    close() {
        this.dialogRef.close();
    }
}
