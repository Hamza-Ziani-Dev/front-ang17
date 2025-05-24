import { Component, EventEmitter, Inject, Input, Output,OnInit } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { MaterialModuleModule } from 'shared/material-module/material-module.module';
import {
    FormGroup,
    FormsModule,
    ReactiveFormsModule,
    Validators,
} from '@angular/forms';
import {
    MAT_DIALOG_DATA,
    MatDialog,
    MatDialogRef,
} from '@angular/material/dialog';
import { TranslocoModule, TranslocoService } from '@ngneat/transloco';
import { environment } from 'environments/environment.development';
import { RxFormBuilder } from '@rxweb/reactive-form-validators';
import { RestDataApiService } from 'app/components/services/rest-data-api.service';
import { WsService } from 'app/components/sockets/ws.service';
import { ConfigService } from 'app/components/services/config.service';
import { EditUserServiceService } from 'app/components/services/edit-user-service.service';
import { FolderService } from 'app/components/services/folder.service';
import { DetailsCourrierPrecessusComponent } from '../details-courrier-precessus/details-courrier-precessus.component';
import { ConfirmationEditDialogComponent } from '../confirmation-edit-dialog/confirmation-edit-dialog.component';
import { UpdateSuccessDialogComponent } from '../update-success-dialog/update-success-dialog.component';
@Component({
    selector: 'app-update-courrier-recent',
    standalone: true,
    templateUrl: './update-courrier-recent.component.html',
    styleUrl: './update-courrier-recent.component.scss',
    imports: [
        CommonModule,
        MaterialModuleModule,
        TranslocoModule,
        FormsModule,
        ReactiveFormsModule,
    ],
})
export class UpdateCourrierRecentComponent  implements OnInit{
    dep = environment.depart;
    arr = environment.arrive;
    inter = environment.interne;
    @Output() Back: EventEmitter<any> = new EventEmitter<any>();
    @Input() folder;
    @Input() acc: any;
    natures;
    folders;
    folderFormGroup: FormGroup;
    existRef = false;
    senders;
    receivers;
    natId;
    selected = false;
    selectedType;
    users;
    nt;
    selectedReceivers = new Array<any>();
    selectedReceiversId = new Array<any>();
    InitselectedReceivers = new Array<any>();
    changed = false;
    curentType;
    dests;
    emets;
    @Input()
    // acc;
    currentuser;
    qualities = new Array();
    isBo = false;
    type;
    today;
    dataArray: Array<any>;
    newSenders = new Array();
    isloading = false;
    currentProc = null;
    b;

    constructor(
        private fb: RxFormBuilder,
        private rest: RestDataApiService,
        public datepipe: DatePipe,
        public config: ConfigService,
        private service: EditUserServiceService,
        private fserv: FolderService,
        private dialog: MatDialog,
        @Inject(MAT_DIALOG_DATA) public data: any,
        private dialogRef: MatDialogRef<UpdateCourrierRecentComponent>
    ) {
        this.folder = data.folder;

    }

    ngOnInit(): void {
        this.acc = this.acc || {};

        var now = new Date();
        var month: any = now.getMonth() + 1;
        var day: any = now.getDate();
        if (month < 10) month = '0' + month;
        if (day < 10) day = '0' + day;
        this.today = now.getFullYear() + '-' + month + '-' + day;

        this.getUsers();
        this.currentuser = JSON.parse(sessionStorage.getItem('uslog'));
        this.rest.getQualityNpPage().subscribe((qualities: any[]) => {
            this.qualities = qualities;
            this.qualities.forEach((quality) => {
                if (quality['ref_bo'] == 1) {
                    if (this.currentuser.title == quality['code']) {
                        this.isBo = true;
                    }
                }
            });
            this.retriveFoldersType();
        });

        this.fserv.getFolderType(this.folder.type).subscribe((r) => {
            this.type = r;
            this.getSenders();
            this.getReceivers();
        });

        if (this.folder.dest.length) {
            this.selectedReceivers = new Array<any>();
            this.folder?.dest.forEach((element) => {
                this.selectedReceivers.push(element['name']);
            });
            this.InitselectedReceivers = new Array<any>(
                ...this.selectedReceivers
            );
        }

        this.folderFormGroup = this.fb.group({
            type: [, Validators.required],
            sender: [this.folder.emet__ != null ? this.folder.emet__ : ''],
            reference: [this.folder.reference],
            nature: [''],
            date: [
                this.folder['dateReception']
                    ? this.datepipe.transform(this.folder['dateReception'], 'yyyy-MM-dd')
                    : '',
                Validators.required
            ],
            // date: [this.datepipe.transform(this.folder['dateReception'],'MM/dd/yyyy'),Validators.required,
            // ],
            objet: [this.folder.objet, Validators.required],
            accuse: [this.folder.accuse == '' || 0 ? false : true],
        });
    }

    // Get Users :
    getUsers() {
        this.service.getUsersGroups().subscribe((r) => {
            this.users = r;
        });
    }

    addCustomSender = (term) => {
        if (this.selectedReceivers.indexOf(term) == -1) {
            this.selectedReceivers.push(term);
            this.newSenders.push(term);
        }
    };

    changeType(e, mode?) {
        this.dataArray = new Array<any>();
        this.folders.forEach((element) => {
            if (e == element['id']) {

                this.acc = element;
                this.curentType = element;
            }

            if (this.curentType != null) {
                if (this.curentType.name != this.dep) {
                    this.folderFormGroup.controls['accuse'].setValue(0);
                }
            }
        });
        this.natures.forEach((nat) => {
            if (nat.folderType != null) {
                const list = nat.folderType.split('/');

                list.forEach((element) => {
                    if (element == e) {
                        this.dataArray.push(nat);
                    }
                });
            }
        });
        this.selected = true;
        this.folderFormGroup.controls['sender'].setValue('');
        this.folderFormGroup.controls['nature'].setValue('');
        if (mode != 'mod') {
            if (this.acc['cat'] == this.dep) {
                this.selectedReceivers = [];
                this.folderFormGroup.controls.sender.setValidators(
                    Validators.nullValidator
                );
                this.dests = this.receivers;
            } else {
                this.folderFormGroup.controls.sender.setValidators(
                    Validators.required
                );
                this.selectedReceivers = [];
                this.dests = this.senders;
            }
        }
    }
    onChangeNat(e) {
        this.changed = true;
    }

    openDetailProc() {
        this.detail();
    }

    detail() {
        const dialogRef = this.dialog.open(DetailsCourrierPrecessusComponent, {
            data: { process: this.currentProc },
        });

        dialogRef.afterClosed().subscribe((result) => {});
    }

    getProcess(e) {
        this.rest.getStepsByNat(e).subscribe((r) => {
            this.currentProc = r;
        });
    }

    openModale(state?: number, target?: string, message?: string) {
        const dialogRef = this.dialog.open(UpdateSuccessDialogComponent, {
            disableClose: true,
            data: {
                object: 'le dossier',
                operation: target ?? this.config.c.editCourrier.editing,
                result: state === 1 ? 'succès' : 'échec',
                message: message,
            },
        });

        dialogRef.afterClosed().subscribe((result) => {});
    }

    onSubmit() {
        if (!this.isInvalid()) {

            const dialogRef = this.dialog.open(ConfirmationEditDialogComponent,
                {
                    disableClose: true,
                    data: {
                        title: 'Confirmation de modification',
                        text: 'Voulez-vous vraiment modifier ce courrier ?',
                        parentRef: this.dialogRef
                    },
                }
            );

            if (
                (this.nt as number) !==
                (this.folderFormGroup.value['nature'] as number)
            ) {
                let proc1 = '',
                    proc2 = '';
                this.natures.forEach((element) => {
                    if (element.id === this.folder.natureId) {
                        proc1 = element.procName;
                    }
                    if (element.id === this.folderFormGroup.value['nature']) {
                        proc2 = element.procName;
                    }
                });

                dialogRef.componentInstance.text2 = `${'N.B : Le courrier va être retiré du processus " '} ${proc1} ${' "  et empreintera le processus " '} ${proc2} ${' ".'}`;

            }

            dialogRef.afterClosed().subscribe((result) => {
                if (result === 'yes') {
                    this.isloading = true;

                    const payload = this.preparePayload();

                    this.rest
                        .editFolder(payload, this.folder.id)
                        .subscribe(
                            (res) => {
                                this.Back.emit('ok');
                                this.dialog.open(UpdateSuccessDialogComponent, {
                                    disableClose: true,
                                    data: { title: 'Modifié avec succès' },
                                });
                            },
                            (err) => {
                                this.openModale(0);
                            }
                        )
                        .add(() => {
                            this.isloading = false;
                        });
                } else {
                    this.isloading = false;
                }
            });
        } else {
        }
    }

    preparePayload() {
        const p = this.folderFormGroup.value;
        p['accuse'] = p['accuse'] ? 1 : 0;

        if (this.acc.cat === this.dep) {
            p.mode = 1;
            this.selectedReceivers.forEach((res) => {
                const receiver = this.receivers.find(
                    (dest) => dest.name === res
                );
                if (receiver) this.selectedReceiversId.push(receiver.id);
            });
            p.dest = this.selectedReceiversId;
            p.newSenders = this.newSenders;
        } else if (this.acc.cat === this.arr) {
            p.mode = 2;
        } else {
            p.mode = -1;
        }

        return p;
    }

    getSenders() {
        this.rest.getSenders().subscribe((r) => {
            this.senders = r;
            if (this.type['cat'] == this.arr) {
                this.dests = r;
            }
        });
    }

    getReceivers() {
        this.rest.getReceivers().subscribe((r) => {
            this.receivers = r;

            if (this.type['cat'] == this.dep) {
                this.dests = r;
            }
        });
    }
    InvalidModal() {
        // const modalRef = this.modal.open(InvalidFormComponent, { keyboard: true, centered: true, backdrop: 'static' });
    }
    getNature() {
        this.rest.getNature('W').subscribe((r) => {
            this.natures = r;
            this.natures.forEach((element) => {
                if (element.name == this.folder.natureName) {
                    this.nt = element.id;
                }
            });
            this.getProcess(this.folder.natureId);
            //this.natures = this.natures.filter(res => res.folderType == this.folders[0].id)
            this.changeType(this.folder.type, 'mod');
            this.folderFormGroup.controls['nature'].setValue(
                this.folder.natureId
            );
            this.folderFormGroup.controls['sender'].setValue(
                this.folder.emet__
            );
        });
    }
    private retriveFoldersType() {
        this.rest.getFloderTypes().subscribe((res) => {
            if (this.isBo) {
                this.folders = res;
                this.getNature();
                this.folders.forEach((element) => {
                    if (this.folder.type == element.id) {
                        this.acc = element;
                        this.curentType = element;
                        if (element.name == this.dep) {
                            this.folder.receivers.forEach((element) => {
                                this.selectedReceivers.push(element.name);
                            });
                        }
                    }
                });
            } else {
                this.folders = res;
                this.getNature();
                this.folders.forEach((element) => {
                    if (this.folder.type == element.id) {
                        this.acc = element;
                        this.curentType = element;
                        if (element.name == this.dep) {
                            this.folder.receivers.forEach((element) => {
                                this.selectedReceivers.push(element.name);
                            });
                        }
                    }
                });
            }
            this.folderFormGroup.controls['type'].setValue(this.folder.type);
        });
    }

    clear() {
        this.changeType(this.folder.type);
        this.folderFormGroup.controls['nature'].setValue(this.folder.natureId);
        this.folderFormGroup.controls['objet'].setValue(this.folder.objet);
        this.folderFormGroup.controls['sender'].setValue(
            this.folder.emet__ != null ? this.folder.emet__ : ''
        );
        this.folderFormGroup.controls['reference'].setValue(
            this.folder.reference
        );
        this.folderFormGroup.controls['accuse'].setValue(
            this.folder.accuse == '' || 0 ? false : true
        );
        this.folderFormGroup.controls['type'].setValue(this.folder.type);
        this.acc = this.type;
        this.getProcess(this.folder.natureId);
        this.selectedReceivers = new Array<any>(...this.InitselectedReceivers);
    }

    changeSender(e) {
        let data;
        this.dests.forEach((element) => {
            if (element['id'] == e) {
                data = element;
            }
        });
        if (this.acc['cat'] == this.dep) {
            if (
                this.selectedReceivers.indexOf(data['name']) == -1 &&
                this.checkExist(data['name']) == 1
            ) {
                this.selectedReceivers.push(data['name']);
            }
            this.folderFormGroup.controls['sender'].setValue('');
        } else return;
    }

    checkExist(e) {
        this.b = 0;
        this.receivers.forEach((element) => {
            if (element.name == e) this.b = 1;
        });
        return this.b;
    }

    supp(da) {
        let data;
        this.dests.forEach((element) => {
            if (element.name == da) {
                data = element;
            }
        });

        if (data != null) {
            this.selectedReceivers.splice(
                this.selectedReceivers.indexOf(data.name),
                1
            );
        }

        this.newSenders.forEach((de) => {
            if (de == da) {
                this.selectedReceivers.splice(
                    this.selectedReceivers.indexOf(da),
                    1
                );
                this.newSenders.splice(de, 1);
            }
        });
    }

    // isInvalid() {
    //     if (this.acc['cat'] == this.arr) {
    //         return !this.folderFormGroup.valid;
    //     } else {
    //         return !(
    //             this.selectedReceivers.length > 0 && this.folderFormGroup.valid
    //         );
    //     }
    // }
    isInvalid() {
        if (this.acc && this.acc['cat'] == this.arr) {
            return !this.folderFormGroup.valid;
        } else {
            return !(
                this.selectedReceivers.length > 0 && this.folderFormGroup.valid
            );
        }
    }


    // Close Dialog :
    closeDialog() {
        this.dialogRef.close();
    }
}
