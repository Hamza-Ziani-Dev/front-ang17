import {
    Component,
    EventEmitter,
    Inject,
    Input,
    OnInit,
    Output,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import {
    FormBuilder,
    FormGroup,
    FormsModule,
    ReactiveFormsModule,
    Validators,
} from '@angular/forms';
import { ConfigService } from 'app/components/services/config.service';
import {
    MAT_DIALOG_DATA,
    MatDialog,
    MatDialogRef,
} from '@angular/material/dialog';
import { CommonApplicationConfigsService } from 'app/components/services/common-application-configs.service';
import { MaterialModuleModule } from 'shared/material-module/material-module.module';
import { HttpClientModule } from '@angular/common/http';
import { TranslocoModule, TranslocoService } from '@ngneat/transloco';

@Component({
    selector: 'app-save-model',
    standalone: true,
    imports: [
        CommonModule,
        FormsModule,
        TranslocoModule,
        ReactiveFormsModule,
        MaterialModuleModule,
        HttpClientModule,
    ],
    templateUrl: './save-model.component.html',
    styleUrl: './save-model.component.scss',
})
export class SaveModelComponent implements OnInit {
    @Output() pass = new EventEmitter<any>();
    @Input() mode: string;
    @Input() gr;
    myform: FormGroup;
    g;
    constructor(
        public config: ConfigService,
        private fb: FormBuilder,
        public cc: CommonApplicationConfigsService,
        public dialogRef: MatDialogRef<SaveModelComponent>,
        @Inject(MAT_DIALOG_DATA) public data: any
    ) {
        this.mode = data.mode;
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
    // ajouter :
    addGroup() {
        this.onAdding = true;
        console.log('Onadding', this.onAdding);
        console.log(this.myform.value);
        this.dialogRef.close(this.myform.value);
    }
}
