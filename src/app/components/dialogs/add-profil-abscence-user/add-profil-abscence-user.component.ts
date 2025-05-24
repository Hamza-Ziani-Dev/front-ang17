import { Component, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Confirmation2Component } from '../confirmation2/confirmation2.component';
import {
    FormBuilder,
    FormGroup,
    FormsModule,
    ReactiveFormsModule,
    Validators,
} from '@angular/forms';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { ProfilAbsenceService } from 'app/components/services/profil-absence.service';
import { ConfigService } from 'app/components/services/config.service';
import { TranslocoModule, TranslocoService } from '@ngneat/transloco';
import { MaterialModuleModule } from 'shared/material-module/material-module.module';

@Component({
    selector: 'app-add-profil-abscence-user',
    standalone: true,
    imports: [
        CommonModule,
        TranslocoModule,
        MaterialModuleModule,
        FormsModule,
        ReactiveFormsModule,
    ],
    templateUrl: './add-profil-abscence-user.component.html',
    styleUrl: './add-profil-abscence-user.component.scss',
})
export class AddProfilAbscenceUserComponent {
    formGroup: FormGroup;
    users;
    abs;
    date;
    back = new EventEmitter<any>();
    constructor(
        public config: ConfigService,
        private fb: FormBuilder,
        private service: ProfilAbsenceService,
        public dialog: MatDialog,
        public dialogRef: MatDialogRef<AddProfilAbscenceUserComponent>
    ) {}

    ngOnInit(): void {
        this.date = new Date();
        this.service.getAllUsers().subscribe((r) => {
            this.users = r;
        });
        this.formGroup = this.fb.group(
            {
                idSup: [
                    '',
                    [
                        Validators.required,
                        Validators.minLength(this.config.min),
                        Validators.maxLength(this.config.max),
                        Validators.pattern(/^(\s+\S+\s*)*(?!\s).*$/),
                    ],
                ],
                dateDebut: ['', Validators.required],
                dateFin: ['', Validators.required],
            },
            { validator: this.dateLessThan('dateDebut', 'dateFin') }
        );
    }

    dateLessThan(from: string, to: string) {
        return (group: FormGroup): { [key: string]: any } => {
            let f = group.controls[from];
            let t = group.controls[to];
            if (f.value > t.value) {
                return {
                    dates: 'Date from should be less than Date to',
                };
            }
            return {};
        };
    }
    isloading = false;
    onSubmit(): void {
        if (this.formGroup.valid) {
            this.isloading = true;
            const p = this.formGroup.value;
            this.abs = p;

            this.users.forEach((element) => {
                if (element['fullName'] === p['idUser']) {
                    this.abs['idUser'] = element['userId'];
                }
                if (element['fullName'] === p['idSup']) {
                    this.abs['idSup'] = element['userId'];
                }
            });

            this.service
                .addProfilsAbs(this.abs)
                .subscribe((r) => {
                    if (r['message'] === 'ok') {
                        const dialogRef = this.dialog.open(
                            Confirmation2Component,
                            {
                                disableClose: true,
                                autoFocus: true,
                                data: {
                                    title: 'Modification',
                                    text: 'Modifié avec succès',
                                    etat: 1,
                                },
                            }
                        );

                        dialogRef.afterClosed().subscribe(() => {
                            this.back.emit('ok');
                        });
                    } else if (r['message'] === 'no') {
                        const dialogRef = this.dialog.open(
                            Confirmation2Component,
                            {
                                disableClose: true,
                                autoFocus: true,
                                data: {
                                    title: 'Error',
                                    text: 'Cet utilisateur est absent dans cette période',
                                    etat: 1,
                                },
                            }
                        );
                    }
                })
                .add(() => {
                    this.isloading = false;
                });
        }
    }
    onCancel() {
        this.formGroup.reset();
    }

    close() {
        this.dialogRef.close();
    }
}
