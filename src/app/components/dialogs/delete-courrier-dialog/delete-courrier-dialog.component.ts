import { Component, Inject, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { TranslocoModule, TranslocoService } from '@ngneat/transloco';
import { MaterialModuleModule } from 'shared/material-module/material-module.module';

@Component({
  selector: 'app-delete-courrier-dialog',
  standalone: true,
  imports: [CommonModule,TranslocoModule,MaterialModuleModule],
  templateUrl: './delete-courrier-dialog.component.html',
  styleUrl: './delete-courrier-dialog.component.scss'
})
export class DeleteCourrierDialogComponent {
    @Input() text: string;
    @Input() title: string;

    constructor(
        private translocoService: TranslocoService,
        public dialogRef: MatDialogRef<DeleteCourrierDialogComponent>,
        @Inject(MAT_DIALOG_DATA) public data: any
    ) {
        this.title = data.title;
        this.text = data.text || '';
    }

    ngOnInit(): void {
        // Any initialization logic can go here
    }
}
