import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialModuleModule } from 'shared/material-module/material-module.module';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
    selector: 'app-delete-type-document-dialog',
    standalone: true,
    imports: [CommonModule, MaterialModuleModule],
    templateUrl: './delete-type-document-dialog.component.html',
    styleUrl: './delete-type-document-dialog.component.scss',
})
export class DeleteTypeDocumentDialogComponent {
    constructor(
        public dialogRef: MatDialogRef<DeleteTypeDocumentDialogComponent>
    ) {}

    closeDialog() {
        this.dialogRef.close(false);
    }
}
