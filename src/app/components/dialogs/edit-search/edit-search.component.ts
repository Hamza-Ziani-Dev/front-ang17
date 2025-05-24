import { Component, Inject, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { environment } from 'environments/environment.development';
import { ConfigService } from 'app/components/services/config.service';
import { RestSearchApiService } from 'app/components/services/rest-search-api.service';
import { RestDataApiService } from 'app/components/services/rest-data-api.service';
import { EditUserServiceService } from 'app/components/services/edit-user-service.service';
import { SearchAttribute } from 'app/components/models/search.model';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MaterialModuleModule } from 'shared/material-module/material-module.module';
import { TranslocoModule, TranslocoService } from '@ngneat/transloco';

@Component({
    selector: 'app-edit-search',
    standalone: true,
    imports: [CommonModule,MaterialModuleModule,FormsModule,ReactiveFormsModule,TranslocoModule],
    templateUrl: './edit-search.component.html',
    styleUrl: './edit-search.component.scss',
})
export class EditSearchComponent {
    dep = environment.depart;
    arr = environment.arrive;
    inter = environment.interne;
    folderFormGroup: any;
    folders;
    @Input() search;
    searchName;
    clients;
    validator;
    natures;
    constructor(
        public config: ConfigService,
        private fb: FormBuilder,
        private searchserv: RestSearchApiService,
        private rest: RestDataApiService,
        //   public modal: NgbActiveModal,
        private service: EditUserServiceService,
        @Inject(MAT_DIALOG_DATA) public data: any,
               public dialogRef: MatDialogRef<EditSearchComponent>
    ) {}
    folder;
    acc;
    changeDest(e) {
        this.users.forEach((element) => {
            if (e.target.value == element.userId) {
                this.curentDest = element;
            }
        });
    }
    changeNat(e) {
        this.natures.forEach((element) => {
            if (e.target.value == element.id) {
                this.curentNat = element;
            }
        });
    }
    ngOnInit(): void {
        this.getReceivers();
        this.getSenders();
        this.searchName = this.search['name'];
        this.getSearchAttrVal(this.search.id);
    }
    users;
    getUsers() {
        this.service.getUsersGroups().subscribe((r) => {
            this.users = r;
        });
    }
    getNature() {
        this.rest.getNature().subscribe((r) => {
            this.natures = r;
        });
    }
    basicType;
    basicNat;
    basicDest;

    getSearchAttrVal(id) {
        const data = { dest: new Array<any>(), type: '' };
        const attributes = new Array<SearchAttribute>();
        this.folderFormGroup = this.fb.group({
            reference: '',
            date: '',
            type: '',
            sender: '',

            nature: '',

            objet: '',
            accuse: '',

            motif: '',
            instru: '',
            // type: [this.folder.type, Validators.required], destinataire: [this.folder.destinataire.userId, Validators.required], reference: [this.folder.reference, Validators.required],
            // nature: [this.folder.nature.id, Validators.required], date: [this.folder.date, Validators.required],
            // objet: [this.folder.objet, Validators.required]
        });
        const folderMod = this.folderFormGroup.value;
        (this.search.search as Array<any>).forEach((s) => {
            const se = s.id;
            attributes.push(
                new SearchAttribute(se.attribute_id as number, s.value)
            );
        });

        //console.log(attributes);

        for (let i = 0; i < attributes.length; i++) {
            const a = attributes[i];
            if (a.id === 5) {
                // folderMod.destinataire = Number.parseInt(a.value.split('/__/')[0]);
                // for (let index = 0; index < a.value.split('/__/').length; index++) {
                //   const element = a.value.split('/__/')[index];

                // }
                // folderMod.dest=a.value.split('/_/')
                data.dest = a.value.split('/_/');
            }
            if (a.id === 1) {
                folderMod.reference = a.value;
            }
            if (a.id === 4) {
                data.type = a.value.split('/__/')[1];
                folderMod.type = Number.parseInt(a.value.split('/__/')[0]);
            }
            if (a.id === 2) {
                folderMod.date = a.value;
            }
            if (a.id === 6) {
                folderMod.objet = a.value;
            }
            if (a.id === 3) {
                folderMod.nature = Number.parseInt(a.value.split('/__/')[0]);
            }
            if (a.id === 8) {
                folderMod.motif = a.value;
            }
            if (a.id === 7) {
                folderMod.instru = a.value;
            }
            if (a.id === 9) {
                folderMod.accuse = a.value.split('/__/')[0];
            }
        }
        if (data.type == this.arr) {
            folderMod.sender = data.dest[0];
        }

        this.folder = folderMod;
        try {
            //console.log(this.folder)
            this.folderFormGroup = this.fb.group({
                reference: [
                    this.folder.reference == undefined || null
                        ? ''
                        : this.folder.reference,
                ],
                date: [
                    this.folder.date == undefined || null
                        ? ''
                        : this.folder.date,
                ],
                type: [
                    this.folder.type == undefined || null
                        ? ''
                        : this.folder.type,
                ],
                sender: [
                    this.folder.sender == undefined || null
                        ? ''
                        : this.folder.sender,
                ],

                nature: [
                    this.folder.nature == undefined || null
                        ? ''
                        : this.folder.nature,
                ],

                objet: [
                    this.folder.objet == undefined || null
                        ? ''
                        : this.folder.objet,
                ],
                accuse: [
                    this.folder.accuse == undefined || null
                        ? ''
                        : this.folder.accuse,
                ],

                motif: [
                    this.folder.motif == undefined || null
                        ? ''
                        : this.folder.motif,
                ],
                instru: [
                    this.folder.instru == undefined || null
                        ? ''
                        : this.folder.instru,
                ],
                // type: [this.folder.type, Validators.required], destinataire: [this.folder.destinataire.userId, Validators.required], reference: [this.folder.reference, Validators.required],
                // nature: [this.folder.nature.id, Validators.required], date: [this.folder.date, Validators.required],
                // objet: [this.folder.objet, Validators.required]
            });
            this.retriveFoldersType();
            this.getNature();
            this.getUsers();
        } catch (error) {
            console.error(error);
        }

        // });
    }
    private retriveFoldersType() {
        this.rest.getFloderTypes().subscribe((res) => {
            this.folders = res;
            res.forEach((element) => {
                // //console.log(element)
                if (
                    Number.parseInt(this.folderFormGroup.value['type']) ==
                    element.id
                ) {
                    this.acc = element;
                }
            });
        });
    }

    onSubmit() {
        this.savedSearch();
        this.search.name = this.searchName;
        this.searchserv.editSearch(this.search).subscribe((res) => {
            this.dialogRef.close();
        });
        return;
    }
    onCancel() {
        if (this.folderFormGroup.drity) {
            this.searchName = this.search['name'];
            this.getSearchAttrVal(this.search.id);
        } else {
            this.dialogRef.close();
        }
    }
    curentDest = null;
    curentNat = null;
    curentType = null;
    receivers;
    dests;
    selectedReceivers = new Array<any>();
    savedSearch() {
        this.search.id = this.search.id;

        const attributes = new Array<SearchAttribute>();

        attributes[0] = new SearchAttribute(
            1,
            this.folderFormGroup.value['reference']
        );
        attributes[1] = new SearchAttribute(
            2,
            this.folderFormGroup.value['date']
        );
        if (this.curentNat != null)
            attributes[2] = new SearchAttribute(
                3,
                this.folderFormGroup.value['nature'] +
                    '/__/' +
                    this.curentNat['name']
            );
        else attributes[2] = new SearchAttribute(3, this.basicNat);
        if (this.curentType != null)
            attributes[3] = new SearchAttribute(
                4,
                this.folderFormGroup.value['type'] +
                    '/__/' +
                    this.curentType['name']
            );
        else attributes[3] = new SearchAttribute(4, this.basicType);

        // if (this.curentDest != null)

        attributes[4] = new SearchAttribute(
            5,
            this.folderFormGroup.value['receiver']
        );
        attributes[5] = new SearchAttribute(
            6,
            this.folderFormGroup.value['objet']
        );
        attributes[6] = new SearchAttribute(
            7,
            this.folderFormGroup.value['instru']
        );

        attributes[7] = new SearchAttribute(
            8,
            this.folderFormGroup.value['motif']
        );
        if (this.folderFormGroup.value['accuse'] == true) {
            attributes[8] = new SearchAttribute(
                9,
                '1/__/Accusé de récéption : oui'
            );
        } else {
            attributes[8] = new SearchAttribute(9, '0');
        }
        //console.log(attributes)
        this.search.attributes = attributes;
    }

    changeSender(e) {
        if (this.acc.cat == this.dep) {
            if (
                this.selectedReceivers.indexOf(e.target.value) == -1 &&
                this.checkExist(e.target.value) == 1
            ) {
                this.selectedReceivers.push(e.target.value);
            }
            this.folderFormGroup.controls['sender'].setValue('');
        } else return;
    }
    b;
    checkExist(e) {
        this.b = 0;
        this.receivers.forEach((element) => {
            if (element.name == e) this.b = 1;
        });
        return this.b;
    }
    senders;
    supp(da) {
        this.selectedReceivers.splice(this.selectedReceivers.indexOf(da), 1);
    }
    getSenders() {
        this.rest.getSenders().subscribe((r) => {
            this.senders = r;
        });
    }

    getReceivers() {
        this.rest.getReceivers().subscribe((r) => {
            this.receivers = r;
        });
    }
    changeSuit(e) {
        this.folders.forEach((element) => {
            if (e.target.value == element.id) {
                this.acc = element;

                this.curentType = element;
            }
            if (this.curentType != null) {
                if (this.curentType.name != this.dep) {
                    this.folderFormGroup.controls['accuse'].setValue(0);
                }
            }
        });
        this.folderFormGroup.controls['sender'].setValue('');

        if (this.acc.cat == this.dep) {
            this.folderFormGroup.controls.sender.setValidators(
                Validators.nullValidator
            );

            this.dests = this.receivers;
        } else if (this.acc.cat == this.arr) {
            this.folderFormGroup.controls.sender.setValidators(
                Validators.required
            );

            this.selectedReceivers = new Array<any>();

            this.dests = this.senders;
        }
    }
}
