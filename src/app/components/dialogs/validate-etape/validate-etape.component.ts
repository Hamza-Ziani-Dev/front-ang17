import {
    Component,
    EventEmitter,
    Inject,
    Input,
    NgZone,
    OnInit,
    Output,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { ConfigService } from 'app/components/services/config.service';
import { RestDataApiService } from 'app/components/services/rest-data-api.service';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { EditListDosService } from 'app/components/services/edit-list-dos.service';
import { Confirmation2Component } from '../confirmation2/confirmation2.component';
import { environment } from 'environments/environment.development';
import { LoadingComponent } from '../loading/loading.component';
import { TranslocoModule, TranslocoService } from '@ngneat/transloco';
import { MaterialModuleModule } from 'shared/material-module/material-module.module';
import { ConfirmeStepComponent } from '../confirme-step/confirme-step.component';

@Component({
    selector: 'app-validate-etape',
    standalone: true,
    imports: [CommonModule, TranslocoModule, MaterialModuleModule,FormsModule,ReactiveFormsModule],
    templateUrl: './validate-etape.component.html',
    styleUrl: './validate-etape.component.scss',
})
export class ValidateEtapeComponent implements OnInit {
    constructor(
        private ngZone: NgZone,
        public config: ConfigService,
        private fb: FormBuilder,
        public dialog: MatDialog,
        private rest: RestDataApiService,
        private edit: EditListDosService,
        private translocoService: TranslocoService,
         @Inject(MAT_DIALOG_DATA) public data: any,
             private dialogRef: MatDialogRef<ValidateEtapeComponent>
    ) {}

    @Input() etape;
    @Input() courrier;
    @Output() done = new EventEmitter<any>();
    isloading = false;
    formgroup: FormGroup;
    users = new Array();
    connectedUser;
    etapuser;
    selectedUsers = new Array<any>();
    editEtape = {
        comm: '',
        quality: '',
        idSkiped: '',
        isVoice: false,
        users: [],
    };
    selectedUsersNotEmpty = true;
    qualities = new Array();
    isBo = false;
    CloneEtape = {
        name: '',
        numero: 0,
        idCourrier: '',
    };
    canSkip = false;
    canSkipArrive = false;
    text;
    Checked = false;
    showSpec = false;
    steps = {
        qualityCode: '',
        nameQuality: '',
        users: [],
        step: {},
        selectedUser: {},
        dis: false,
        ids: '',
    };
    etapes = new Array();
    ArraySteps = new Array();
    ArrayGroup = new Array();
    allSteps = new Array();
    checkIsLast = false;
    filtredUser = new Array();
    arrayAbs = new Array();
    FiltredArrayGroup = new Array();
    type;
    ngOnInit(): void {
        if (sessionStorage.getItem('arrayAbs')) {
            this.arrayAbs = JSON.parse(sessionStorage.getItem('arrayAbs'));
        }
        this.rest.courrierSteps(this.courrier.id).subscribe((r: any[]) => {
            this.allSteps = r;
        });
        this.text = " d'utilisateurs";
        this.connectedUser = JSON.parse(sessionStorage.getItem('uslog'));
        this.etapuser = this.connectedUser;
        this.rest.getGroupNpPage().subscribe((groupes: any[]) => {
            this.ArrayGroup = groupes;
            this.getData();
        });
        this.formgroup = this.fb.group({
            commentaire: [''],
            group: ['all'],
            group1: ['all'],
            user: [''],
        });
    }

    isVoiceAnnotation = false;
    changeAnnotationMethod(e) {
        this.isVoiceAnnotation = e.target.checked;
    }

    changeGroup(e) {
        this.formgroup.controls['user'].setValue('');
        if (e == 'all') {
            this.filtredUser = this.users;
            this.selectedUsers = new Array();
        } else {
            let data = new Array();
            data = this.users;
            this.filtredUser = data.filter((res) => res.groupId == e);
            this.selectedUsers = new Array();
        }
    }

    changeGroupArrive(e, step) {
        if (e == 'all') {
            this.filtredUser = step.users;
            this.selectedUsers = new Array();
        } else {
            let data = new Array();
            data = step.users;
            this.filtredUser = data.filter((res) => res.groupId == e);
            this.selectedUsers = new Array();
        }
    }
    clicked;
    nextStep(etape) {
        this.clicked = true;
        this.rest
            .getUserByParent(this.selectedUsers[0].userId)
            .subscribe((res: any[]) => {
                if (res.length > 0) {
                    this.formgroup.controls['group1'].setValue('all');
                    etape.selectedUser = this.selectedUsers[0];
                    etape.dis = true;
                    this.users = res;
                    this.filtredUser = this.users;

                    this.etapes.forEach((res) => {
                        if (res.numero == etape.step.numero + 1) {
                            this.steps = {
                                qualityCode: '',
                                nameQuality: '',
                                users: [],
                                step: {},
                                selectedUser: {},
                                dis: false,
                                ids: '',
                            };
                            this.steps.qualityCode = res.quality;
                            this.steps.step = res;
                            this.steps.ids = res.numero;
                            this.qualities.forEach((quality) => {
                                if (quality.code == this.steps.qualityCode) {
                                    this.steps.nameQuality = quality.name;
                                }
                            });
                            this.selectedUsers = new Array();
                        }
                    });
                    this.steps.users = this.users;
                    this.FiltredArrayGroup = new Array();
                    this.users.forEach((user) => {
                        this.ArrayGroup.forEach((group) => {
                            if (user.groupId == group.id) {
                                this.FiltredArrayGroup.push(group);
                            }
                        });
                    });
                    this.FiltredArrayGroup = [
                        ...new Set(this.FiltredArrayGroup),
                    ];
                    this.ArraySteps.push(this.steps);
                    this.clicked = false;
                    if (
                        this.etapes[this.etapes.length - 1].id ==
                        this.ArraySteps[this.ArraySteps.length - 1].step.id
                    ) {
                        this.checkIsLast = true;
                    }
                } else {
                    const dialogRef = this.dialog.open(Confirmation2Component, {
                        disableClose: true,
                        data: {
                            title: this.translocoService.translate(
                                'quality.error'
                            ),
                            text: this.translocoService.translate(
                                'quality.messagenoValide'
                            ),
                            etat: -1,
                        },
                    });

                    dialogRef.afterClosed().subscribe(() => {
                        this.clicked = false;
                    });
                }
            });
    }

    prevStep() {
        this.clicked = true;
        this.checkIsLast = false;
        this.selectedUsers = new Array();
        this.users = this.ArraySteps[this.ArraySteps.length - 2].users;
        this.filtredUser = this.users;
        this.selectedUsers.push(
            this.ArraySteps[this.ArraySteps.length - 2].selectedUser
        );
        this.ArraySteps[this.ArraySteps.length - 2].dis = false;
        this.ArraySteps.pop();
        this.clicked = false;
    }

    showGroup = false;
    getData() {
        if (this.courrier.nature.baseOnOrganigrame) {
            this.edit.getAll().subscribe((response: any[]) => {
                this.rest.getQualityNpPage().subscribe((res: any[]) => {
                    this.qualities = res;
                    this.qualities.forEach((quality) => {
                        if (quality.ref_bo == 1) {
                            if (quality.code == this.connectedUser.title) {
                                this.isBo = true;
                            }
                        }
                    });
                    response.forEach((type) => {
                        if (type['name'] == this.etape.courrier.typeName) {
                            if (type['cat'] == environment.depart) {
                                this.type = type;
                                this.showGroup = false;
                                this.qualities.forEach((quality) => {
                                    if (
                                        quality.accessBo == 1 &&
                                        quality.code == this.connectedUser.title
                                    ) {
                                        this.canSkip = true;
                                    }
                                    this.etape.users.forEach((user) => {
                                        this.arrayAbs.forEach((abs) => {
                                            if (user.userId == abs.userId) {
                                                this.canSkip = true;
                                            }
                                        });
                                    });
                                });

                                this.CloneEtape.idCourrier =
                                    this.etape.courrier.id;
                                this.CloneEtape.name = this.etape.name;
                                this.CloneEtape.numero = this.etape.numero;

                                this.rest
                                    .nextEtape(this.CloneEtape)
                                    .subscribe((etape) => {
                                        this.qualities.forEach((quality) => {
                                            if (quality.ref_bo == 1) {
                                                if (
                                                    etape['quality'] ==
                                                    quality.code
                                                ) {
                                                    this.rest
                                                        .getUserByTitle(
                                                            quality.code
                                                        )
                                                        .subscribe(
                                                            (res: any[]) => {
                                                                this.users =
                                                                    res;
                                                                this.filtredUser =
                                                                    this.users;
                                                                this.filtredUser.forEach(
                                                                    (user) => {
                                                                        if (
                                                                            user.traiterDepart ==
                                                                            1
                                                                        ) {
                                                                            this.selectedUsers.push(
                                                                                user
                                                                            );
                                                                            this.formgroup.controls[
                                                                                'user'
                                                                            ].setValue(
                                                                                user.fullName
                                                                            );
                                                                        }
                                                                    }
                                                                );
                                                            }
                                                        );
                                                } else {
                                                    if (
                                                        this.arrayAbs.length > 0
                                                    ) {
                                                        this.etape.users.forEach(
                                                            (user) => {
                                                                this.arrayAbs.forEach(
                                                                    (abs) => {
                                                                        if (
                                                                            user.userId ==
                                                                            abs.userId
                                                                        ) {
                                                                            this.etapuser =
                                                                                user;
                                                                        }
                                                                    }
                                                                );
                                                            }
                                                        );
                                                    }

                                                    this.rest
                                                        .getUserByChild(
                                                            this.etapuser.userId
                                                        )
                                                        .subscribe(
                                                            (res: any[]) => {
                                                                this.users =
                                                                    res;
                                                                this.filtredUser =
                                                                    [
                                                                        ...this
                                                                            .users,
                                                                    ];
                                                                this.selectedUsers =
                                                                    [
                                                                        ...this
                                                                            .filtredUser,
                                                                    ];
                                                                this.formgroup.controls[
                                                                    'user'
                                                                ].setValue(
                                                                    this
                                                                        .selectedUsers[0]
                                                                        .fullName
                                                                );
                                                            }
                                                        );
                                                }
                                            }
                                        });
                                    });
                            } else if (type['cat'] == environment.arrive) {
                                this.showGroup = true;
                                this.type = type;
                                if (this.isBo == true) {
                                    this.CloneEtape.idCourrier =
                                        this.etape.courrier.id;
                                    this.CloneEtape.name = this.etape.name;
                                    this.CloneEtape.numero = this.etape.numero;

                                    this.rest
                                        .nextEtape(this.CloneEtape)
                                        .subscribe((etape) => {
                                            this.qualities.forEach(
                                                (quality) => {
                                                    if (
                                                        etape['quality'] ==
                                                        quality.code
                                                    ) {
                                                        this.rest
                                                            .getUserByTitle(
                                                                quality.code
                                                            )
                                                            .subscribe(
                                                                (
                                                                    res: any[]
                                                                ) => {
                                                                    this.users =
                                                                        res;
                                                                    this.filtredUser =
                                                                        this.users;
                                                                    this.users.forEach(
                                                                        (
                                                                            user
                                                                        ) => {
                                                                            this.ArrayGroup.forEach(
                                                                                (
                                                                                    group
                                                                                ) => {
                                                                                    if (
                                                                                        user.groupId ==
                                                                                        group.id
                                                                                    ) {
                                                                                        this.FiltredArrayGroup.push(
                                                                                            group
                                                                                        );
                                                                                    }
                                                                                }
                                                                            );
                                                                        }
                                                                    );
                                                                    this.FiltredArrayGroup =
                                                                        [
                                                                            ...new Set(
                                                                                this.FiltredArrayGroup
                                                                            ),
                                                                        ];
                                                                }
                                                            );
                                                    }
                                                }
                                            );
                                        });
                                } else {
                                    let index = 0;
                                    this.etape.users.forEach((user) => {
                                        this.arrayAbs.forEach((abs) => {
                                            if (user.userId == abs.userId) {
                                                index++;
                                                this.etapuser = user;
                                                if (index > 1) {
                                                    this.rest
                                                        .getUserByParent(
                                                            user.userId
                                                        )
                                                        .subscribe(
                                                            (res: any[]) => {
                                                                this.users = [
                                                                    ...res,
                                                                ];
                                                                this.filtredUser =
                                                                    this.users;
                                                                this.users.forEach(
                                                                    (user) => {
                                                                        this.ArrayGroup.forEach(
                                                                            (
                                                                                group
                                                                            ) => {
                                                                                if (
                                                                                    user.groupId ==
                                                                                    group.id
                                                                                ) {
                                                                                    this.FiltredArrayGroup.push(
                                                                                        group
                                                                                    );
                                                                                }
                                                                            }
                                                                        );
                                                                        this.FiltredArrayGroup =
                                                                            [
                                                                                ...new Set(
                                                                                    this.FiltredArrayGroup
                                                                                ),
                                                                            ];
                                                                    }
                                                                );
                                                                this.etapes =
                                                                    this.courrier.etapes;

                                                                if (
                                                                    (this.etape
                                                                        .numero ==
                                                                        2 ||
                                                                        this
                                                                            .etapes
                                                                            .length -
                                                                            this
                                                                                .etape
                                                                                .numero >=
                                                                            2) &&
                                                                    this.etape
                                                                        .isLast ==
                                                                        0
                                                                ) {
                                                                    this.canSkipArrive =
                                                                        true;
                                                                    this.etapes.forEach(
                                                                        (
                                                                            res
                                                                        ) => {
                                                                            if (
                                                                                res.numero ==
                                                                                this
                                                                                    .etape
                                                                                    .numero +
                                                                                    1
                                                                            ) {
                                                                                this.steps.qualityCode =
                                                                                    res.quality;
                                                                                this.steps.step =
                                                                                    res;
                                                                                this.steps.ids =
                                                                                    res.numero;
                                                                                this.qualities.forEach(
                                                                                    (
                                                                                        quality
                                                                                    ) => {
                                                                                        if (
                                                                                            quality.code ==
                                                                                            this
                                                                                                .steps
                                                                                                .qualityCode
                                                                                        ) {
                                                                                            this.steps.nameQuality =
                                                                                                quality.name;
                                                                                        }
                                                                                    }
                                                                                );
                                                                            }
                                                                        }
                                                                    );
                                                                    this.steps.users =
                                                                        this.users;
                                                                    this.ArraySteps.push(
                                                                        this
                                                                            .steps
                                                                    );
                                                                }
                                                            }
                                                        );
                                                }
                                            }
                                        });
                                    });
                                    if (index <= 1) {
                                        this.CloneEtape.idCourrier =
                                            this.etape.courrier.id;
                                        this.CloneEtape.name = this.etape.name;
                                        this.CloneEtape.numero =
                                            this.etape.numero;

                                        this.rest
                                            .nextEtape(this.CloneEtape)
                                            .subscribe((etape) => {
                                                var index = 0;
                                                this.qualities.forEach(
                                                    (quality) => {
                                                        if (
                                                            quality.ref_bo == 1
                                                        ) {
                                                            if (
                                                                etape[
                                                                    'quality'
                                                                ] ==
                                                                quality.code
                                                            ) {
                                                                index = 1;
                                                                this.rest
                                                                    .getUserByTitle(
                                                                        quality.code
                                                                    )
                                                                    .subscribe(
                                                                        (
                                                                            res: any[]
                                                                        ) => {
                                                                            this.users =
                                                                                res;
                                                                            this.filtredUser =
                                                                                this.users;
                                                                            this.users.forEach(
                                                                                (
                                                                                    user
                                                                                ) => {
                                                                                    this.ArrayGroup.forEach(
                                                                                        (
                                                                                            group
                                                                                        ) => {
                                                                                            if (
                                                                                                user.groupId ==
                                                                                                group.id
                                                                                            ) {
                                                                                                this.FiltredArrayGroup.push(
                                                                                                    group
                                                                                                );
                                                                                            }
                                                                                        }
                                                                                    );
                                                                                }
                                                                            );
                                                                            this.FiltredArrayGroup =
                                                                                [
                                                                                    ...new Set(
                                                                                        this.FiltredArrayGroup
                                                                                    ),
                                                                                ];
                                                                        }
                                                                    );
                                                            }
                                                        }
                                                    }
                                                );

                                                if (index == 0) {
                                                    this.rest
                                                        .getUserByParent(
                                                            this.etapuser.userId
                                                        )
                                                        .subscribe(
                                                            (res: any[]) => {
                                                                this.users = [
                                                                    ...res,
                                                                ];
                                                                this.filtredUser =
                                                                    this.users;
                                                                this.users.forEach(
                                                                    (user) => {
                                                                        this.ArrayGroup.forEach(
                                                                            (
                                                                                group
                                                                            ) => {
                                                                                if (
                                                                                    user.groupId ==
                                                                                    group.id
                                                                                ) {
                                                                                    this.FiltredArrayGroup.push(
                                                                                        group
                                                                                    );
                                                                                }
                                                                            }
                                                                        );
                                                                        this.FiltredArrayGroup =
                                                                            [
                                                                                ...new Set(
                                                                                    this.FiltredArrayGroup
                                                                                ),
                                                                            ];
                                                                    }
                                                                );
                                                                this.etapes =
                                                                    this.courrier.etapes;

                                                                if (
                                                                    (this.etape
                                                                        .numero ==
                                                                        2 ||
                                                                        this
                                                                            .etapes
                                                                            .length -
                                                                            this
                                                                                .etape
                                                                                .numero >=
                                                                            2) &&
                                                                    this.etape
                                                                        .isLast ==
                                                                        0
                                                                ) {
                                                                    this.canSkipArrive =
                                                                        true;
                                                                    this.etapes.forEach(
                                                                        (
                                                                            res
                                                                        ) => {
                                                                            if (
                                                                                res.numero ==
                                                                                this
                                                                                    .etape
                                                                                    .numero +
                                                                                    1
                                                                            ) {
                                                                                this.steps.qualityCode =
                                                                                    res.quality;
                                                                                this.steps.step =
                                                                                    res;
                                                                                this.steps.ids =
                                                                                    res.numero;
                                                                                this.qualities.forEach(
                                                                                    (
                                                                                        quality
                                                                                    ) => {
                                                                                        if (
                                                                                            quality.code ==
                                                                                            this
                                                                                                .steps
                                                                                                .qualityCode
                                                                                        ) {
                                                                                            this.steps.nameQuality =
                                                                                                quality.name;
                                                                                        }
                                                                                    }
                                                                                );
                                                                            }
                                                                        }
                                                                    );
                                                                    this.steps.users =
                                                                        this.users;
                                                                    this.ArraySteps.push(
                                                                        this
                                                                            .steps
                                                                    );
                                                                }
                                                            }
                                                        );
                                                }
                                            });
                                    }
                                }
                            }
                        }
                    });
                });
            });
        } else {
            this.edit.getAll().subscribe((response: any[]) => {
                this.rest.getQualityNpPage().subscribe((res: any[]) => {
                    this.qualities = res;
                    this.qualities.forEach((quality) => {
                        if (quality.ref_bo == 1) {
                            if (quality.code == this.connectedUser.title) {
                                this.isBo = true;
                            }
                        }
                    });
                    response.forEach((type) => {
                        if (type['name'] == this.etape.courrier.typeName) {
                            if (type['cat'] == environment.depart) {
                                console.log(type);
                                this.type = type;
                                this.showGroup = false;
                                this.qualities.forEach((quality) => {
                                    if (
                                        quality.accessBo == 1 &&
                                        quality.code == this.connectedUser.title
                                    ) {
                                        this.canSkip = true;
                                    }
                                    this.etape.users.forEach((user) => {
                                        this.arrayAbs.forEach((abs) => {
                                            if (user.userId == abs.userId) {
                                                this.canSkip = true;
                                            }
                                        });
                                    });
                                });
                            }
                        }
                    });
                });
            });

            this.filtredUser = this.courrier.etapes[this.etape.numero].users;
            this.selectedUsers = [...this.filtredUser];
        }
    }

    getSepUsers(event) {
        if (event.target.checked == true) {
            this.showSpec = true;
            this.selectedUsers = new Array();
            if (
                this.etapes[this.etapes.length - 1].id ==
                this.ArraySteps[this.ArraySteps.length - 1].step.id
            ) {
                this.checkIsLast = true;
            }
            this.formgroup.controls['group1'].setValue('all');
            this.filtredUser = this.users;
        } else {
            this.showSpec = false;
            this.selectedUsers = new Array();
            this.ArraySteps = new Array();
            this.formgroup.controls['group'].setValue('all');
            this.getData();
        }
    }

    getBoUsers(event) {
        if (event.target.checked == true) {
            this.Checked = true;

            this.qualities.forEach((quality) => {
                if (quality.ref_bo == 1) {
                    this.rest
                        .getUserByTitle(quality.code)
                        .subscribe((res: any[]) => {
                            this.text = quality.name;
                            this.users = res;
                            this.filtredUser = this.users;
                            this.selectedUsers = new Array();
                            this.formgroup.controls['user'].setValue('');
                            this.filtredUser.forEach((user) => {
                                if (user.traiterDepart == 1) {
                                    this.selectedUsers.push(user);
                                    this.formgroup.controls['user'].setValue(
                                        user.fullName
                                    );
                                }
                            });
                        });
                }
            });
        } else {
            this.Checked = false;
            this.text = "d'utilisateurs";
            this.selectedUsers = new Array();
            this.formgroup.controls['user'].setValue('');
            this.getData();
        }
    }

    next() {
        if (this.selectedUsers.length > 0) {
            if (!this.isloading) {
                this.isloading = true;
                const dialogRef = this.dialog.open(ConfirmeStepComponent, {
                    disableClose: true,
                    data: {
                        target:
                            this.etape.isLast == 0
                                ? this.config.c.validateStep.confirmeTxt
                                : this.config.c.validateStep.confirmeLast,
                        btn: this.config.c.index.validate,
                    },
                });

                dialogRef.afterClosed().subscribe((r) => {
                    if (r === 'yes') {
                        const p = this.formgroup.value;

                        const loadRef = this.dialog.open(LoadingComponent, {
                            disableClose: true,
                            data: {
                                message: 'Traitement en cours...',
                                title: 'Patientez',
                            },
                        });

                        this.editEtape.isVoice = this.isVoiceAnnotation;
                        this.editEtape.comm = this.isVoiceAnnotation
                            ? this.voiceData
                            : p['commentaire'];
                        this.editEtape.users = this.selectedUsers;
                        this.editEtape.quality =
                            this.ArraySteps[
                                this.ArraySteps.length - 1
                            ]?.step.quality;
                        this.editEtape.idSkiped =
                            this.ArraySteps[
                                this.ArraySteps.length - 1
                            ]?.step.id;

                        const finalize = () => {
                            this.isloading = false;
                            this.selectedUsers = [];
                            this.done.emit('ok');
                            loadRef.close();
                            this.dialog.closeAll();
                        };

                        if (!this.Checked && !this.showSpec) {
                            this.rest
                                .editStep(
                                    this.etape['id'],
                                    this.editEtape,
                                    0,
                                    1,
                                    0
                                )
                                .subscribe(finalize, finalize);
                        } else if (this.Checked) {
                            this.rest
                                .editStep(
                                    this.etape['id'],
                                    this.editEtape,
                                    1,
                                    0,
                                    0
                                )
                                .subscribe(finalize, finalize);
                        } else if (this.showSpec) {
                            this.rest
                                .editStep(
                                    this.etape['id'],
                                    this.editEtape,
                                    0,
                                    0,
                                    1
                                )
                                .subscribe(finalize, finalize);
                        }
                    } else {
                        this.isloading = false;
                    }
                });
            }
        } else {
            this.dialog.open(Confirmation2Component, {
                disableClose: true,
                data: {
                    title: this.translocoService.translate('quality.error'),
                    text: this.translocoService.translate('quality.selectUser'),
                    etat: -1,
                },
            });
        }
    }

    changeUsers(e) {
        if (e == 'all') {
            this.filtredUser.forEach((user) => {
                if (this.selectedUsers.indexOf(user) == -1) {
                    this.selectedUsers.push(user);
                }
            });
        } else {
            this.filtredUser.forEach((user) => {
                if (user.userId == e) {
                    if (this.selectedUsers.indexOf(user) == -1) {
                        this.selectedUsers.push(user);
                    }
                }
            });
        }
    }
    supp(user) {
        this.selectedUsers.splice(this.selectedUsers.indexOf(user), 1);
    }

    clear() {
        this.formgroup.controls['commentaire'].setValue('');
        this.formgroup.controls['group'].setValue('all');
        this.changeGroup('all');
        this.formgroup.controls['user'].setValue('');
        this.selectedUsers = new Array();
    }

    voiceRecordStarted(e) {
        this.voiceData = null;
    }

    voiceData = null;
    voiceRecordStoped(e) {
        const reader = new FileReader();
        reader.onload = () => {
            this.ngZone.run(() => {
                this.voiceData = reader.result as string;
            });
        };
        reader.readAsDataURL(e);
    }
}
