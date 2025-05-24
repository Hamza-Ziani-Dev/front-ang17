import { Component, EventEmitter, Inject, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ConfigService } from 'app/components/services/config.service';
import {
    FormBuilder,
    FormGroup,
    FormsModule,
    ReactiveFormsModule,
    Validators,
} from '@angular/forms';
import { CommonApplicationConfigsService } from 'app/components/services/common-application-configs.service';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MaterialModuleModule } from 'shared/material-module/material-module.module';
import { NgxPaginationModule } from 'ngx-pagination';

@Component({
    selector: 'app-save-model-dialog',
    standalone: true,
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        MaterialModuleModule,
        NgxPaginationModule,
    ],
    templateUrl: './save-model-dialog.component.html',
    styleUrl: './save-model-dialog.component.scss',
})
export class SaveModelDialogComponent {
    @Output() pass = new EventEmitter<any>();
    @Input() mode: string;
    @Input() gr;
    myform: FormGroup;
    g;
    constructor(
        public config: ConfigService,
        private fb: FormBuilder,
        public cc: CommonApplicationConfigsService,
        public dialogRef: MatDialogRef<SaveModelDialogComponent>,
        @Inject(MAT_DIALOG_DATA) public data: any
    ) {
        // console.log('dATA', data);
        // this.mode = data.mode;
    }

    ngOnInit(): void {
        if (this.mode == 'add') {
            this.myform = this.fb.group({
                modelName: [
                    '',
                    [
                        Validators.required,
                        Validators.minLength(3),
                        Validators.maxLength(60),
                        Validators.pattern(/^(\s+\S+\s*)*(?!\s).*$/),
                    ],
                ],
                modelDesc: [
                    '',
                    [
                        Validators.required,
                        Validators.minLength(3),
                        Validators.maxLength(120),
                        Validators.pattern(/^(\s+\S+\s*)*(?!\s).*$/),
                    ],
                ],
            });
        } else {
            this.g = { ...this.gr };
            this.myform = this.fb.group({
                modelName: [
                    this.g.modelName,
                    [
                        Validators.required,
                        Validators.minLength(3),
                        Validators.maxLength(60),
                        Validators.pattern(/^(\s+\S+\s*)*(?!\s).*$/),
                    ],
                ],

                modelDesc: [
                    this.g.modelName,
                    [
                        Validators.required,
                        Validators.minLength(3),
                        Validators.maxLength(120),
                        Validators.pattern(/^(\s+\S+\s*)*(?!\s).*$/),
                    ],
                ],
            });
        }
    }

    addAddDocType(e) {}

    deleteGroup(g) {}

    editGroup() {}

    close() {
        this.dialogRef.close();
    }
    clearGroup() {
        if (this.mode == 'add') {
            this.myform = this.fb.group({
                modelName: [
                    '',
                    [
                        Validators.required,
                        Validators.minLength(3),
                        Validators.maxLength(60),
                        Validators.pattern(/^(\s+\S+\s*)*(?!\s).*$/),
                    ],
                ],
                modelDesc: [
                    '',
                    [
                        Validators.required,
                        Validators.minLength(3),
                        Validators.maxLength(120),
                        Validators.pattern(/^(\s+\S+\s*)*(?!\s).*$/),
                    ],
                ],
            });
        } else {
            this.g = { ...this.gr };
            this.myform = this.fb.group({
                modelName: [
                    this.g.modelName,
                    [
                        Validators.required,
                        Validators.minLength(3),
                        Validators.maxLength(60),
                        Validators.pattern(/^(\s+\S+\s*)*(?!\s).*$/),
                    ],
                ],

                modelDesc: [
                    this.g.modelName,
                    [
                        Validators.required,
                        Validators.minLength(3),
                        Validators.maxLength(120),
                        Validators.pattern(/^(\s+\S+\s*)*(?!\s).*$/),
                    ],
                ],
            });
        }
    }
    onAdding = false;
    addGroup() {
        this.onAdding = true;
        console.log('Onadding', this.onAdding);
        console.log(this.myform.value);
        this.pass.emit(this.myform.value);
        this.dialogRef.close();
    }
}
