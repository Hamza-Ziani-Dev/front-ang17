import { Component, Inject, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ConfigService } from 'app/components/services/config.service';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MaterialModuleModule } from 'shared/material-module/material-module.module';
import { TranslocoModule, TranslocoService } from '@ngneat/transloco';

@Component({
  selector: 'app-instruction-motif-dialog',
  standalone: true,
  imports: [CommonModule,FormsModule,ReactiveFormsModule,MaterialModuleModule,TranslocoModule],
  templateUrl: './instruction-motif-dialog.component.html',
  styleUrl: './instruction-motif-dialog.component.scss'
})
export class InstructionMotifDialogComponent {
    @Input() courrier;
    @Input() steps;
    constructor(
        public config :ConfigService ,
        private dialog: MatDialog,
        @Inject(MAT_DIALOG_DATA) public data: {   },
        private dialogRef: MatDialogRef<InstructionMotifDialogComponent>,
        private translocoService: TranslocoService,
    ) { 
        }

    ngOnInit(): void {

    }

    onClose() {
        this.dialogRef.close();
    }
}
