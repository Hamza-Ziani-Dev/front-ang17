import { Component, EventEmitter, Inject, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
    MAT_DIALOG_DATA,
    MatDialog,
    MatDialogRef,
} from '@angular/material/dialog';
import { MaterialModuleModule } from 'shared/material-module/material-module.module';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { PdfViewerModule } from 'ng2-pdf-viewer';
import { ActivatedRoute, Router } from '@angular/router';
import { environment } from 'environments/environment.development';
import { WarningInfoComponent } from '../warning-info/warning-info.component';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BulkAddProgressDialogComponent } from '../bulk-add-progress-dialog/bulk-add-progress-dialog.component';
import { Observable } from 'rxjs';
import { ConfigService } from 'app/components/services/config.service';
import { RestDataApiService } from 'app/components/services/rest-data-api.service';
import { ConfirmationDialogComponent } from '../confirmation-dialog/confirmation-dialog.component';
import { IconsService } from 'app/components/services/icons.service';
import { AjouterBulkDocumentComponent } from 'app/components/apps/ajouter-bulk-document/ajouter-bulk-document.component';
import { TranslocoModule, TranslocoService } from '@ngneat/transloco';

@Component({
    selector: 'app-bulk-import-files',
    standalone: true,
    imports: [
        CommonModule,
        MaterialModuleModule,
        PdfViewerModule,
        AjouterBulkDocumentComponent,
        TranslocoModule,
    ],
    templateUrl: './bulk-import-files.component.html',
    styleUrl: './bulk-import-files.component.scss',
})
export class BulkImportFilesComponent {
    @Output() passConverted = new EventEmitter<any>();
    interval;
    // data: any[] = new Array();
    uri: SafeResourceUrl;
    env = environment;
    groups: Array<{
        groupId: number;
        groupName;
        groupImgs;
        groupColor;
        isPdf;
        groupType;
        mimetype?: string;
        file: File;
    }> = [];
    constructor(
        private _route: ActivatedRoute,
        private dialog: MatDialog,
        public config: ConfigService,
        public sanitizer: DomSanitizer,
        private httpClient: HttpClient,
        private rest: RestDataApiService,
        public iconsService: IconsService,
        public translocoService: TranslocoService,
        @Inject(MAT_DIALOG_DATA)
        public data: {
            files: File[];
            groupElements: any;
            cureentLot: any;
            lotName: string;
        },
        public dialogRef: MatDialogRef<BulkImportFilesComponent>
    ) {}

    // Ng OnInit :
    ngOnInit(): void {
        this._route.queryParams.subscribe((params) => {
            const { f, ar } = JSON.parse(
                params.filter.replace('%7B', '{').replace('%7D', '}')
            );
            this.currentFold = f;
            this.currentRef = ar;
        });

        let i = 0;
        this.data.files.forEach((file) => {
            const groupColor = this.getRandomColor();
            const groupName = file.name;
            const mimetype = file.type;
            const groupType = this.data.groupElements.documentTypes[0].id;
            const groupId = i + 1;

            const groupImgs = [];
            const isPdf = mimetype === 'application/pdf';
            this.groups[i] = {
                groupId,
                groupName,
                groupImgs,
                groupColor,
                isPdf,
                groupType,
                mimetype,
                file,
            };
            this.docToPush.push({
                isAdded: false,
                isValid: false,
                formData: null,
                headers: null,
                document: null,
                file: null,
                apiUrl: null,
                convertPDF: null,
                codeBar: null,
                URL_POS_PARAM: null,
            });
            i++;
        });
        this.viewFile(0);
    }

    activeSize = '80%';
    toggleSize() {
        const container: HTMLElement = document.querySelector(
            '.modal-dialog.modal-dialog-centered.modal-xxl'
        );
        if (this.activeSize == '80%') {
            container.style.width = this.activeSize = '100%';
        } else container.style.width = this.activeSize = '80%';
    }

    currentFold = '';
    currentRef = '';

    setGroupType(i, e) {
        if (this.step == 'ind') this.setIndextationGroup(i, i);
        this.groups[i].groupType = e;
        // this.groups[i].groupName = this.getTypeName(e.target.value)
    }

    getTypeName(value: any) {
        for (
            let index = 0;
            index < this.data.groupElements.documentTypes.length;
            index++
        ) {
            const element = this.data.groupElements.documentTypes[index];
            if (element.id == value) {
                return element.label;
            }
        }
    }
    get isAllDocsValid() {
        let valid = true;
        this.docToPush.forEach((elem) => {
            valid = valid && elem.isValid;
        });
        return valid;
    }

    indexGroup = 0;
    onClose() {
        const dialogRef = this.dialog.open(WarningInfoComponent, {
            data: {
                title: this.translocoService.translate(
                    'ocr.reconnaissancetexte'
                ),
                message: this.translocoService.translate(
                    'ocr.vignorerreconnaissance'
                ),
            },
            disableClose: true,
        });

        dialogRef.afterClosed().subscribe((result) => {
            if (result === 'yes') {
                this.passConverted.emit('close');
                this.dialogRef.close();
            }
        });
    }

    step = 'q';

    addAll() {
        const headers: HttpHeaders = new HttpHeaders();
        let coutDocs = this.docToPush ? this.docToPush.length : 0;
        this.addDocObsv(this.docToPush, 0, coutDocs).subscribe((res) => {});
        const dialogRef = this.dialog.open(BulkAddProgressDialogComponent, {
            data: {
                count: coutDocs,
                uploaded: this.bulkaddState,
                lotName: this.data?.lotName,
            },
            disableClose: true,
        });

        dialogRef.componentInstance.pass.subscribe(() => {
            this.passConverted.emit(null);
        });
    }

    selectedGroup;
    selectedGroupIndx;

    setCurrentGroup(gr, i) {
        this.selectedGroup = gr;
        this.selectedGroupIndx = i;
    }

    docToPush: Array<{
        isAdded;
        isValid;
        formData;
        headers;
        document;
        file;
        apiUrl;
        convertPDF;
        codeBar;
        URL_POS_PARAM;
    }> = new Array<{
        isAdded;
        formData;
        headers;
        document;
        file;
        apiUrl;
        convertPDF;
        codeBar;
        isValid;
        URL_POS_PARAM;
    }>();
    loadedAznotherGr = false;
    setIndextationGroup(i, c) {
        this.loadedAznotherGr = false;
        this.indexGroup = i;
        setTimeout(() => {
            this.loadedAznotherGr = true;
        }, 50);
    }

    bulkaddState = [];
    addDocObsv(docs, indx, count): Observable<any> {
        const headers: HttpHeaders = new HttpHeaders({});
        return new Observable<any>((o) => {
            let nexIndx = indx;
            this.bulkaddState[indx] = { fileadded: null, docadded: null };
            this.bulkaddState[indx].fileadded = null;
            this.bulkaddState[indx].docadded = null;
            this.rest.addDocument(docs[indx].document).subscribe(
                (res) => {
                    if (res['id']) {
                        this.bulkaddState[indx].docadded = true;
                        this.rest
                            .linkDocuments(this.currentFold, [res['id']])
                            .subscribe((res) => {});
                        this.httpClient
                            .post(
                                docs[indx].apiUrl +
                                    '/documentfile/' +
                                    res['id'] +
                                    `/${docs[indx].convertPDF ? '1' : '0'}/${
                                        docs[indx].codeBar ? '1' : '0'
                                    }${docs[indx].URL_POS_PARAM}`,
                                docs[indx].formData,
                                { headers }
                            )
                            .subscribe(
                                (resp) => {
                                    this.bulkaddState[indx].fileadded = true;
                                    nexIndx = ++indx;
                                    if (nexIndx < count) {
                                        this.addDocObsv(
                                            docs,
                                            nexIndx,
                                            count
                                        ).subscribe((res) => {});
                                    } else {
                                        // console.log(this.bulkaddState);
                                    }
                                },
                                (err2) => {
                                    this.bulkaddState[indx].fileadded = false;
                                    nexIndx = ++indx;
                                    if (nexIndx < count) {
                                        this.addDocObsv(
                                            docs,
                                            nexIndx,
                                            count
                                        ).subscribe((res) => {});
                                    } else {
                                    }
                                }
                            );
                    } else if (res['err']) {
                        this.bulkaddState[indx].docadded = false;
                        this.bulkaddState[indx].fileadded = false;
                        this.bulkaddState[indx]['err'] = 'exist';
                        this.bulkaddState[indx]['fileName'] =
                            docs[indx].document.fileName;
                        this.bulkaddState[indx];
                        nexIndx = ++indx;
                        if (nexIndx < count) {
                            this.addDocObsv(docs, nexIndx, count).subscribe(
                                (res) => {}
                            );
                        } else {
                        }
                    }
                },
                (err) => {
                    this.bulkaddState[indx].docadded = false;
                    nexIndx = ++indx;
                    if (nexIndx < count) {
                        this.addDocObsv(docs, nexIndx, count).subscribe(
                            (res) => {}
                        );
                    } else {
                    }
                }
            );

            o.next({ nexIndx, indx });
        });
    }

    onSave() {
        if (true) {
            for (let index = 0; index < this.groups.length; index++) {
                this.groups[index].isPdf =
                    this.data.files[index].type === 'application/pdf';
            }
            this.step = 'ind';
            console.log('this.step', this.step);

            this.setIndextationGroup(0, 0);
        }
    }

    randNum() {
        return Math.floor(Math.random() * 360);
    }
    getRandomColor() {
        return `hsl(${this.randNum()}, 100%, 70%)`;
    }

    objUrl = '';
    isFileAdded = true;
    viewFile(i) {
        this.isFileAdded = false;
        // console.log(i);
        const reader = new FileReader();
        const file = this.data.files[i];
        const self = this;
        reader.onload = () => {
            const supportedMimes = environment.supportedMimeTypes.split(' ');
            const base64String = reader.result as string;
            if (supportedMimes.includes(file.type)) {
                const dataUrl = `data:${file.type};base64,${
                    base64String.split(',')[1]
                }`;
                this.uri =
                    this.sanitizer.bypassSecurityTrustResourceUrl(dataUrl);
                sessionStorage.setItem('vfileName', file.name);
                this.isFileAdded = true;
            } else {
                this.uri = null;
            }
        };
        reader.readAsDataURL(file);
    }

    validateGr(e) {
        console.log('docToPush', this.docToPush);
        if (!this.isLast) {
            this.loadedAznotherGr = false;
            this.indexGroup++;
            setTimeout(() => {
                this.loadedAznotherGr = true;
            }, 50);
        }
    }

    get isLast() {
        return this.indexGroup + 1 == this.groups.length;
    }

    get validLength() {
        return this.docToPush.filter((d) => d.isValid == true).length;
    }

    // Delete Document :
    deleteDocument(i: number) {
        if (this.groups.length === 1) {
            this.onClose();
            return;
        }

        const cg = this.groups[i];
        const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
            data: {
                message: `${this.translocoService.translate(
                    'bulkimportFiles.deleteDoc'
                )}: ${cg.groupName}`,
                title: this.translocoService.translate(
                    'bulkimportFiles.delete'
                ),
            },
            disableClose: true,
        });

        dialogRef.afterClosed().subscribe((result) => {
            if (result === 'yes') {
                this.groups.splice(i, 1);
                this.docToPush.splice(i, 1);
                this.data.files.splice(i, 1);
            }
        });
    }
}
