import { Component, EventEmitter, Inject, Input, OnInit, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ConfigService } from 'app/components/services/config.service';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { TranslocoService, TranslocoModule } from '@ngneat/transloco';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MaterialModuleModule } from 'shared/material-module/material-module.module';

@Component({
    selector: 'app-operation-result-dialog',
    standalone: true,
    imports: [CommonModule,TranslocoModule,FormsModule,ReactiveFormsModule,MaterialModuleModule],
    templateUrl: './operation-result-dialog.component.html',
    styleUrl: './operation-result-dialog.component.scss',
})
export class OperationResultDialogComponent implements OnInit {
    @Input() name;
    @Input() object;
    @Input() operation;
    @Input() result;
    @Input() message;

    @Output() passEntry = new EventEmitter();
    constructor(
        public config: ConfigService,
        private dialogRef: MatDialogRef<OperationResultDialogComponent>,
        private translocoService: TranslocoService,
         @Inject(MAT_DIALOG_DATA) public data: any
    ) {
        this.operation = data.operation,
        this.object = data.object,
        this.message = data.message,
        this.name = data.name
    }
    ngDoCheck(): void {
    }

    ngOnInit(): void {}
    pass() {
        this.passEntry.emit();
    }


    closedialog(){
        this.dialogRef.close();
    }
}
