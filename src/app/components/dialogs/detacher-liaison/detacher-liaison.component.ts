import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { TranslocoModule, TranslocoService } from '@ngneat/transloco';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MaterialModuleModule } from 'shared/material-module/material-module.module';

@Component({
    selector: 'app-detacher-liaison',
    standalone: true,
    imports: [
        CommonModule,
        TranslocoModule,
        FormsModule,
        ReactiveFormsModule,
        MaterialModuleModule,
    ],
    templateUrl: './detacher-liaison.component.html',
    styleUrl: './detacher-liaison.component.scss',
})
export class DetacherLiaisonComponent {
    constructor(
        public dialogRef: MatDialogRef<DetacherLiaisonComponent>,
        @Inject(MAT_DIALOG_DATA) public data: any
    ) {}

    onClose(): void {
        this.dialogRef.close();
    }

    onDetacher() {}
}
