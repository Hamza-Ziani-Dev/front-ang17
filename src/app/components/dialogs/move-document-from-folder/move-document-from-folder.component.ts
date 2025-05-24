import { Component, EventEmitter, Inject, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
    FormBuilder,
    FormGroup,
    FormsModule,
    ReactiveFormsModule,
    Validators,
} from '@angular/forms';
import { environment } from 'environments/environment.development';
import { RestDataApiService } from 'app/components/services/rest-data-api.service';
import { RestSearchApiService } from 'app/components/services/rest-search-api.service';
import { DataSharingService } from 'app/components/services/data-sharing.service';
import { FolderService } from 'app/components/services/folder.service';
import { Router } from '@angular/router';
import { PreviousRouteService } from 'app/components/services/previous-route.service';
import { EditUserServiceService } from 'app/components/services/edit-user-service.service';
import { ConfigService } from 'app/components/services/config.service';
import { Folder } from 'app/components/models/folder.model';
import { FolderTypeA } from 'app/components/models/FolderType';
import { Search, SearchAttribute } from 'app/components/models/search.model';
import { OperationResultDialogComponent } from '../operation-result-dialog/operation-result-dialog.component';
import {
    MAT_DIALOG_DATA,
    MatDialog,
    MatDialogRef,
} from '@angular/material/dialog';
import { MaterialModuleModule } from 'shared/material-module/material-module.module';
import { NgxPaginationModule } from 'ngx-pagination';
import { HttpClientModule } from '@angular/common/http';
import { FolderComponent } from 'app/components/apps/folder/folder.component';
import { LinkFolderFolderConfirmationComponent } from '../link-folder-folder-confirmation/link-folder-folder-confirmation.component';
import { TranslocoModule, TranslocoService } from '@ngneat/transloco';

@Component({
    selector: 'app-move-document-from-folder',
    standalone: true,
    imports: [
        CommonModule,
        MaterialModuleModule,
        NgxPaginationModule,
        HttpClientModule,
        FormsModule,
        ReactiveFormsModule,
        FolderComponent,
        TranslocoModule
    ],
    templateUrl: './move-document-from-folder.component.html',
    styleUrl: './move-document-from-folder.component.scss',
})
export class MoveDocumentFromFolderComponent {
    dep = environment.depart;
    arr = environment.arrive;
    inter = environment.interne;
    public favoriteFoldersIds: string[];
    public isLoading: boolean;
    search: Search;
    @Input() listOfSelectedFolders;
    totalePages: number;
    page = 0;
    listOfSelectedFoldersObj: Folder[] = new Array<Folder>();
    pages: number[] = new Array<number>();
    pageSize;
    folderSelectedId;
    isLoaded;
    resultTotal;
    @Input() operation;
    @Input() folderToRep;
    @Input() linkDoc;
    @Input() DocumentId;
    @Input() ShowResult;
    @Input() folderParentId;
    @Input() titre;

    isResult: Boolean = false;
    foldersResut;
    folder: Folder;
    folders: FolderTypeA[];
    clients;
    listFoldersid: Array<string>;
    folderFormGroup: FormGroup;
    natures;
    curentNat;
    curentDest;
    curentType;
    acc;
    dis = true;
    all = false;
    totalCheck = 1;
    totalEl;
    senders;
    receivers;
    dests;

    @Input() selectedDocumentId;
    @Output() folderSelected = new EventEmitter();
    @Output() validLink = new EventEmitter();
    @Output() next = new EventEmitter();
    @Output() Back = new EventEmitter();
    selectedReceivers = new Array<any>();
    hideStatus = environment.hideStatus;
    constructor(
        private fb: FormBuilder,
        private rest: RestDataApiService,
        private searchserv: RestSearchApiService,
        public share: DataSharingService,
        private folderService: FolderService,
        private route: Router,
        private prev: PreviousRouteService,
        private service: EditUserServiceService,
        public config: ConfigService,
        private dialog: MatDialog,
        private dialogRef: MatDialogRef<MoveDocumentFromFolderComponent>,
        @Inject(MAT_DIALOG_DATA) public data: any
    ) {
        this.DocumentId = data.documentId;
        this.folderToRep = data.folderToRep;
        this.folderParentId = data.folderParentId;
        this.titre = data.titre;
    }

    closeDialog() {
        this.dialogRef.close();
    }
    changeType(e) {
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

        if (this.acc.cat == this.arr) {
            //console.log("2")
            this.folderFormGroup.controls.sender.setValidators(
                Validators.nullValidator
            );

            this.dests = this.receivers;
        } else if (this.acc.cat == this.arr) {
            this.folderFormGroup.controls.sender.setValidators(
                Validators.required
            );

            this.selectedReceivers = new Array<any>();
            //console.log("1")

            this.dests = this.senders;
        }
    }
    selectedReceiversId = new Array<any>();
    changeSender(e) {
        // if (this.dataArray.indexOf(e.target.value) == -1 && this.checkExist(e.target.value) == 1)
        let data;
        this.dests.forEach((element) => {
            if (element.id == e) {
                data = element;
            }
        });

        console.log(data);
        if (this.acc.cat == this.dep) {
            if (
                this.selectedReceivers.indexOf(data.name) == -1 &&
                this.checkExist(data.name) == 1
            ) {
                console.log(data);
                this.selectedReceivers.push(data.name);
                this.selectedReceiversId.push(data.id);
                //console.log(this.selectedReceivers);
            }
            this.folderFormGroup.controls['sender'].setValue('');
        } else return;
    }
    b;
    checkExist(e) {
        this.b = 0;
        this.receivers.forEach((element) => {
            //console.log(element.name, e);
            if (element.name == e) this.b = 1;
        });
        return this.b;
    }
    supp(da) {
        this.selectedReceivers.splice(this.selectedReceivers.indexOf(da), 1);
    }
    func() {
        this.all = !this.all;
        var elmnt = document.getElementById('teeets');

        //   $(document).ready(function () {
        //     $(".up").click(function () {
        //       $('html, body').animate({
        //         scrollTop: $(".up").offset().top
        //       }, 1000);
        //     });
        //   });
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
    searchButton(e) {
        if (e.keyCode == 13) {
            this.getResult();
        }
    }
    undo() {
        if (this.folderFormGroup.dirty) {
            this.folderFormGroup.controls['type'].setValue('');
            this.folderFormGroup.controls['finalise'].setValue('');
            this.folderFormGroup.controls['sender'].setValue('');
            this.folderFormGroup.controls['reference'].setValue('');
            this.folderFormGroup.controls['nature'].setValue('');
            this.folderFormGroup.controls['deDate'].setValue('');
            this.folderFormGroup.controls['objet'].setValue('');
            this.folderFormGroup.controls['motif'].setValue('');
            this.folderFormGroup.controls['instru'].setValue('');
            this.folderFormGroup.controls['accuse'].setValue('');
            this.folderFormGroup.controls['order'].setValue('');
            this.folderFormGroup.controls['fini'].setValue('');

            this.acc = null;
            this.selectedReceivers = new Array<any>();
        } else {
        }
    }
    accus(e) {
        if (e.currentTarget.checked) {
            this.dis = false;
            this.folderFormGroup.controls['finalise'].enable();
        } else {
            this.dis = true;
            this.folderFormGroup.controls['finalise'].disable();
        }
    }
    ngOnInit(): void {
        this.isLoading = true;
        this.retriveFoldersType();
        this.getReceivers();
        this.getSenders();
        this.folder = new Folder();
        this.getNature();
        if (sessionStorage.getItem('fs')) {
            this.folder = new Folder();
            this.folderFormGroup = this.fb.group({
                type: [''],
                finalise: [''],
                sender: [''],
                reference: [''],
                refAuto: [''],
                nature: [''],
                deDate: [''],
                toDate: [''],
                fini: [''],
                objet: [''],
                motif: [''],
                order: [''],
                instru: [''],
                accuse: [''],
            });
        } else {
            this.retriveFoldersType();
            this.retriveClients();
            this.folder = new Folder();
            this.folderFormGroup = this.fb.group({
                type: [''],
                finalise: [''],
                sender: [''],
                reference: [''],
                refAuto: [''],
                nature: [''],
                deDate: [''],
                toDate: [''],
                fini: [''],
                objet: [''],
                motif: [''],
                order: [''],
                instru: [''],
                accuse: [''],
            });
        }
    }

    dataArray = new Array();
    changeSuit(e) {
        this.dataArray = new Array<any>();

        this.folders.forEach((element) => {
            if (e == element.id) {
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

        this.natures.forEach((nat) => {
            if (nat.folderType != null) {
                const list = nat.folderType.split('/');

                list.forEach((element) => {
                    if (element == this.curentType.id) {
                        this.dataArray.push(nat);
                    }
                });
            }
        });
    }
    changeDest(e) {
        this.clients.forEach((element) => {
            if (e.target.value == element.userId) {
                this.curentDest = element;
            }
        });
    }

    changeNat(e) {
        this.natures.forEach((element) => {
            if (e == element.id) {
                this.curentNat = element;
            }
        });
    }
    getNature() {
        this.rest.getNature().subscribe((r) => {
            this.natures = r;
        });
    }
    getUsers() {
        this.service.getUsersGroups().subscribe((r) => {
            this.clients = r;
        });
    }

    private retriveFoldersType() {
        this.rest.getFloderTypes().subscribe((res) => {
            this.folders = res;
        });
    }
    private retriveClients() {
        this.rest.getClients().subscribe((res) => {
            //console.log(res);
            this.clients = res;
        });
    }
    getResult() {
        this.totalCheck = -1;
        const p = this.folderFormGroup.value;

        if (this.folderFormGroup.value['accuse'] == true) {
            p['accuse'] = 1;
        } else {
            p['accuse'] = 0;
        }

        if (p['accuse'] == 1) {
            if (this.folderFormGroup.value['finalise'] == true) {
                p['finalise'] = 'fini';
            } else {
                p['finalise'] = 'accusation';
            }
        } else {
            p['finalise'] = null;
        }
        if (this.acc != null) {
            if (this.acc.cat == this.dep) {
                p.mode = 1;
                p.dest = this.selectedReceiversId;
                console.log(this.selectedReceiversId);
            } else {
                p.mode = 2;
            }
        } else {
            p.mode = -1;
        }
        console.log(p);

        this.searchserv
            .searchFolderReplace(p, this.page, this.folderParentId)
            .subscribe((res) => {
                //console.log(res);
                this.totalEl = res['totalElements'];
                this.foldersResut = res['content'];

                const totalePages = res['totalPages'];
                this.resultTotal = res['totalElements'];
                this.pages = new Array<number>(totalePages);
                this.totalCheck = 1;
            });
        this.isResult = true;
    }

    getFoldersToLinkWithDocument() {
        this.searchserv
            .searchFoldersToLinkWithDocument(
                this.folder,
                this.DocumentId,
                this.page
            )
            .subscribe((res) => {
                //console.log(res);

                this.foldersResut = res['content'];
                const totalePages = res['totalPages'];
                this.pages = new Array<number>(totalePages);
                this.resultTotal = res['totalElements'];

                console.warn(res);
                console.warn(this.foldersResut);
                this.isResult = true;
            });
    }
    public onSubmit() {
        this.totalCheck = -1;
        //   $('.modal-dialog').first().addClass("modal-xl")
        this.next.emit('+');
        this.folderService.getFAvoritFoldersIds().subscribe((ids) => {
            this.favoriteFoldersIds = ids;

            this.folderSelected.emit();
            if (this.operation === 'multi' && this.linkDoc === '1') {
                this.getFoldersToLinkWithDocument();
            } else if (this.operation !== 'multi' && this.linkDoc !== '1') {
                this.getResult();
            } else {
                this.getResultToLink();
            }

            this.savedSearch();
            this.isLoading = true;
        });
    }
    savedSearch() {
        this.search = new Search();
        const attributes = new Array<SearchAttribute>();
        attributes[0] = new SearchAttribute(
            3,
            this.folder.reference == undefined
                ? ''
                : this.folder.reference.toString()
        );
        attributes[1] = new SearchAttribute(
            5,
            this.folder.date == undefined ? '' : this.folder.date.toString()
        );
        attributes[2] = new SearchAttribute(
            4,
            this.folder.nature == undefined ? '' : this.folder.nature.toString()
        );
        attributes[3] = new SearchAttribute(
            1,
            this.folder.type == undefined ? '' : this.folder.type.toString()
        );
        attributes[4] = new SearchAttribute(
            2,
            this.folder.destinataire == undefined
                ? ''
                : this.folder.destinataire.toString()
        );
        this.search.attributes = attributes;
    }
    getResultToLink() {
        this.searchserv
            .searchFolderToLink(
                this.folder,
                sessionStorage.getItem('FTL'),
                this.page
            )
            .subscribe((res) => {
                //console.log(res);

                this.foldersResut = res['content'];
                const totalePages = res['totalPages'];
                this.pages = new Array<number>(totalePages);
                this.resultTotal = res['totalElements'];

                console.warn(res);
                console.warn(this.foldersResut);
            });
        this.isResult = true;
    }
    goBack() {
        this.isResult = false;
    }
    onCancel() {
        this.folderFormGroup.reset();
    }
    goPage(i) {
        this.totalCheck = -1;
        this.page = i;

        this.folderService.getFAvoritFoldersIds().subscribe((ids) => {
            this.favoriteFoldersIds = ids;
            if (this.operation === 'multi' && this.linkDoc === '1') {
                this.getFoldersToLinkWithDocument();
            } else if (this.operation !== 'multi' && this.linkDoc !== '1') {
                this.getResult();
            } else {
                this.getResultToLink();
            }
            this.isLoading = true;
        });
    }
    selectFolder(f) {
        this.folderSelected.emit(f);
        if (this.operation !== 'multi') {
            sessionStorage.setItem('FTL', f['id'] as string);
        }
    }
    checkIfChecked(f) {
        if (this.listOfSelectedFolders) {
            return this.listOfSelectedFolders.indexOf(f['id']) !== -1;
        }
        return false;
    }
    isFavorite(folder: Folder) {
        return this.favoriteFoldersIds.indexOf(folder.id) >= 0;
    }


    removeTo(f: Folder): void {
        this.listOfSelectedFoldersObj = [f];
        this.listFoldersid = [f.id];

        const dialogRef = this.dialog.open(
            LinkFolderFolderConfirmationComponent,
            {
                data: {
                    folderChilds: this.folderToRep,
                    folderReceive: f,
                    titreDoc: this.titre,
                    title: 'Confirmer déplacement',
                    mode: 'replace',
                },
            }
        );

        dialogRef.componentInstance.passConfirmation.subscribe(
            (res: string) => {
                if (res === 'yes') {
                    this.rest
                        .linkDocument(this.DocumentId, this.listFoldersid)
                        .subscribe(() => {
                            this.rest
                                .unlinkDocument(
                                    this.DocumentId,
                                    this.folderParentId
                                )
                                .subscribe(() => {
                                    this.Back.emit('done');
                                    this.dialog.closeAll();
                                });
                        });
                }
            }
        );
    }

    openModale(state?: any, target?: any, message?: any, ref?: any): void {
        const dialogRef = this.dialog.open(OperationResultDialogComponent, {
            data: {
                state,
                target,
                message,
                ref,
            },
        });

        dialogRef.afterClosed().subscribe(() => {
            this.Back.emit('ok');
            if (this.dialogRef) {
                this.dialogRef.close();
            }
        });
        const componentInstance = dialogRef.componentInstance;
        if (componentInstance) {
            componentInstance.operation = 'Succès de déplacement';
        }
    }

    changeDate() {
        this.folderFormGroup
            .get('toDate')
            .setValue(this.folderFormGroup.value['deDate']);
    }
}
