import { Component, EventEmitter, Inject, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ConfigService } from 'app/components/services/config.service';
import { ViewerService } from 'app/components/services/viewer.service';
import {
    FormBuilder,
    FormGroup,
    FormsModule,
    ReactiveFormsModule,
    Validators,
} from '@angular/forms';
import { saveAs } from 'file-saver';
import { MaterialModuleModule } from 'shared/material-module/material-module.module';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

import { TranslocoModule, TranslocoService } from '@ngneat/transloco';

@Component({
    selector: 'app-download-file-name',
    standalone: true,
    imports: [
        CommonModule,
        MaterialModuleModule,
        FormsModule,
        ReactiveFormsModule,
        TranslocoModule,
    ],
    templateUrl: './download-file-name.component.html',
    styleUrl: './download-file-name.component.scss',
})
export class DownloadFileNameComponent {
    constructor(
        public config: ConfigService,
        private viewerService: ViewerService,
        private fb: FormBuilder,
        public dialogRef: MatDialogRef<DownloadFileNameComponent>,
        @Inject(MAT_DIALOG_DATA) public data: any
    ) {
        this.docs = data.docs;
        console.log('data', data);
        console.log('data.docs', data.docs);
    }
    @Output() saved = new EventEmitter<string>();
    @Input() docs;
    form: FormGroup;
    fileName: String;
    ngOnInit(): void {
        this.form = this.fb.group({
            name: [
                '',
                [
                    Validators.required,
                    Validators.minLength(this.config.min),
                    Validators.maxLength(this.config.max),
                    Validators.pattern(/^(\s+\S+\s*)*(?!\s).*$/),
                ],
            ],
        });
    }

    isloading = false;

    onSubmit() {
        console.log('this.docs', this.docs);
        if (this.form.valid) {
            this.isloading = true;
            this.viewerService
                .zipfiles(this.docs)
                .subscribe((r) => {
                    saveAs(r.body, this.form.value.name + '.zip');
                    this.saved.emit('done');
                    this.onCancel();
                })
                .add(() => {
                    this.isloading = false;
                });
        }
    }
    onCancel() {
        this.dialogRef.close();
    }
}
