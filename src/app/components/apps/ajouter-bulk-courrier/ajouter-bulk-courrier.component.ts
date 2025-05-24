import { Component, OnInit } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { MaterialModuleModule } from 'shared/material-module/material-module.module';
import {
    FormArray,
    FormBuilder,
    FormGroup,
    FormsModule,
    ReactiveFormsModule,
    Validators,
} from '@angular/forms';
import { MatStepperModule } from '@angular/material/stepper';
import { BulkImportDialogComponent } from 'app/components/dialogs/bulk-import-dialog/bulk-import-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { BulkScanDialogComponent } from 'app/components/dialogs/bulk-scan-dialog/bulk-scan-dialog.component';
import { TranslocoModule, TranslocoService } from '@ngneat/transloco';
import { ConfigService } from 'app/components/services/config.service';
import { RestDataApiService } from 'app/components/services/rest-data-api.service';
import { WsService } from 'app/components/sockets/ws.service';
import { Router } from '@angular/router';
import { EditListDocService } from 'app/components/services/edit-list-doc.service';
import { HttpClient } from '@angular/common/http';
import { environment } from 'environments/environment.development';
import { AjouterBulkDocumentComponent } from '../ajouter-bulk-document/ajouter-bulk-document.component';
import { BulkScanComponent } from 'app/components/dialogs/bulk-scan/bulk-scan.component';
import { AddSuccessDialogComponent } from 'app/components/dialogs/add-success-dialog/add-success-dialog.component';
import { BulkImportFilesComponent } from 'app/components/dialogs/bulk-import-files/bulk-import-files.component';
@Component({
    selector: 'app-ajouter-bulk-courrier',
    standalone: true,
    imports: [
        CommonModule,
        MaterialModuleModule,
        TranslocoModule,
        MatStepperModule,
        FormsModule,
        ReactiveFormsModule,
        AjouterBulkDocumentComponent,
    ],

    templateUrl: './ajouter-bulk-courrier.component.html',
    styleUrl: './ajouter-bulk-courrier.component.scss',
})
export class AjouterBulkCourrierComponent implements OnInit{
    depArrays = [];
    mappedArray = [];
    listAttrsValues = [];
    valCommonAttrs = new Array<any>();
    formOk = false;
    Hideattribute: Array<any>;
    doctypes;
    currentStep = 1;
    documentInBulk: { index; docType; file; form; added; formGrp: FormGroup };
    bulkDocuments: Array<{ index: number; formGrp: FormGroup; type: number }> =new Array();
    GroupsElements: Array<any> = new Array<any>();
    totalGroupsElements: any;
    lotName = '';
    selectedGroup;
    CommonAttrs: any[] = [];
    docFormGroup: FormGroup;

    constructor(
        public config: ConfigService,
        private rest: RestDataApiService,
        private ws: WsService,
        private fb: FormBuilder,
        private route: Router,
        private docserv: EditListDocService,
        private httpClient: HttpClient,
        public datepipe: DatePipe,
        private dialog: MatDialog,
        private translocoService: TranslocoService,
    ) {}

    ngOnInit(): void {
        this.getDocsTypes();
        this.getGroups();
        this.lotName = `lot_${this.datepipe.transform(
            new Date(),
            'dd-MM-yyyy H:mm'
        )}`;
        this.httpClient.get('assets/attribute.json').subscribe((data: any) => {
            this.Hideattribute = data;
        });

        setTimeout(() => {
            const elemes = document.getElementsByClassName('noneDisplay');
            const l = elemes.length;
            for (let i = 0; i < l; i++) {
                console.log(elemes.item(i));
                elemes.item(i).classList.remove('noneDisplay');
            }
        }, 100);
    }

    //   Form :
    setUpForm(CommonAttrs) {
        this.valCommonAttrs = new Array<any>();
        this.docFormGroup = this.fb.group({
            attrs: this.fb.array([]), // []
        });

        this.Hideattribute.forEach((attrs) => {
            this.CommonAttrs.forEach((attribute, index) => {
                if (attrs.name === attribute.name) {
                    this.CommonAttrs.splice(index, 1);
                }
            });
        });

        for (let index = 0; index < CommonAttrs.length; index++) {
            this.valCommonAttrs.push({ ...CommonAttrs[index], value: '' });
            if (
                this.CommonAttrs[index].type.name === 'List' ||
                this.CommonAttrs[index].type.name === 'ListDep' ||
                this.CommonAttrs[index].type.name === 'listDb'
            ) {
                this.listAttrsValues[index] = this.parseJSON(
                    this.CommonAttrs[index].defaultValue
                );
                this.depArrays['id' + this.CommonAttrs[index].id] = JSON.parse(
                    this.CommonAttrs[index].defaultValue
                );
                this.mappedArray['id' + this.CommonAttrs[index].id] =
                    JSON.parse(this.CommonAttrs[index].defaultValue);
            }
            const a = CommonAttrs[index];
            this.addAttr(a.id, a.type.name, a.name, a.required, a.visib);
        }
    }
    fieldChanged(i, e) {
        this.valCommonAttrs[i].value = e.target.value;
    }

    // Change Value :
    changeValue($e: any, attr: any, i?) {
        let e;
        if ($e.key) e = $e.key;
        else e = $e;
        this.fieldChanged(i, { target: { value: e } });
        let idx = 0;
        this.CommonAttrs.forEach((element) => {
            if (element.type.name == 'ListDep' && element.listDep == attr.id) {
                // @ts-ignore
                let array = new Array<any>();

                // @ts-ignore
                this.mappedArray['id' + element.id].forEach((element1) => {
                    if (element1.fk == e) {
                        array.push(element1);
                    }
                });

                // @ts-ignore
                for (
                    let index = 0;
                    index < this.mappedArray['id' + element.id];
                    index++
                ) {}
                // @ts-ignore

                this.depArrays['id' + element.id] = array;

                console.log(array[0], idx);
                (this.attrsForms as FormArray)
                    .at(idx)
                    .patchValue({ val: array[0]?.key ?? '' });
                this.changeValue(array[0]?.key, element, idx);
            }
            idx++;
        });
    }

    // Parse Json :
    parseJSON(str) {
        return JSON.parse(str);
    }


    // On Submit :
    onSubmit() {}
    clear() {}
    changeType(e, index) {
        this.bulkDocuments[index]['type'] = e.target.value;
    }
    env = environment;
    goBack() {
        const env = environment;
        this.route.navigateByUrl('/apps/courriers-a-traites');
    }


    // Add New Doc to Bulk :
    addNewDocToBulk() {
        this.bulkDocuments.push({
            index: this.bulkDocuments.length,
            formGrp: this.fb.group({
                type: ['', Validators.required],
            }),
            type: 0,
        });
    }

    // Change Group :
    changeGroup(e) {
        this.selectedGroup = this.GroupsElements.filter((g) => g.goupId == e);
        this.getCommonAttrs(this.selectedGroup[0].goupId);
        this.getDocsTypesAccessAndGroup(e);
    }

    getDocsTypesAccessAndGroup(gr) {
        console.log(this.selectedGroup);
        this.rest.getDocTypesAccesAndGroup('C', gr).subscribe((res) => {
            this.selectedGroup[0].documentTypes = res;
            console.log(this.selectedGroup);
        });
    }
    get selectedGoupId() {
        return this.selectedGroup?.goupId;
    }


    // Change Name :
    changeName(e) {
        this.lotName = e.target.value;
        console.log(e.target.value, this.lotName);
    }


    // Clear From :
    clearForm() {
        this.docFormGroup.reset();
    }

    getCommonAttrs(gId) {
        this.formOk = false;
        this.CommonAttrs = new Array<any>();
        this.docserv.getElementsGroupCommonAttrs(gId).subscribe((res) => {
            this.CommonAttrs = [...res];
            this.CommonAttrs.forEach((element) => {
                if (element.name == 'Fichier')
                    this.CommonAttrs.splice(
                        this.CommonAttrs.indexOf(element),
                        1
                    );
            });
            this.setUpForm(this.CommonAttrs);
        });
    }

    getGroups(page = 0, size = 1000000) {
        this.docserv.getAllElementsGroups(page, size).subscribe((res) => {
            //this.GroupsElements =
            res.content.forEach((group) => {
                this.GroupsElements = new Array<any>();
                this.rest
                    .getDocTypesAccesAndGroup('C', group.goupId)
                    .subscribe((res) => {
                        group.documentTypes = res;
                        this.GroupsElements.push(group);
                    });
            });
            this.totalGroupsElements = this.GroupsElements.length;
        });
    }

    cureentLot;

    save() {
        const lot = {
            cv: this.valCommonAttrs,
            commonAttrsVal: JSON.stringify(this.valCommonAttrs),
            lotType: this.selectedGroup[0].goupId,
            lotGroupName: this.selectedGroup[0].groupLabel,
            gName: this.lotName,
            gDocTypes: this.getDocTypesAsString(),
            gt: this.selectedGroup[0].documentTypes,
        };
        this.docserv.PostNewLot(lot).subscribe(
            (res) => {
                console.log(res);
                this.cureentLot = { ...lot };

                this.selectedGroup[0]['loId'] = res.gid;
            },
            (err) => {
                console.log('save():bulkadd', err);
            }
        );
    }

    getDocsTypes() {
        this.rest.getDocTypes().subscribe((res) => {
            this.doctypes = res;
        });
    }

    getDocTypesAsString() {
        let ts = '';
        this.selectedGroup[0].documentTypes.map((t) => {
            ts += ',' + t.id;
        });
        return ts;
    }
    qualifiedGroups;

    //   Scan :
    scan() {
        this.ws.newScan();
        const dialogRef = this.dialog.open(BulkScanComponent, {
            data: {
                groupElements: this.selectedGroup[0],
                currentLot: this.cureentLot,
                lotName: this.lotName,
            },
            disableClose: true, // This prevents the dialog from being closed when clicked outside
        });

        dialogRef.afterClosed().subscribe((file) => {
            if (file) {
                this.qualifiedGroups = file;
                this.currentStep = 4;
            }

            this.currentStep = 1;
            this.lotName = `lot_${new Date().getTime()}`;
            if (file !== 'close') {
                this.open(1);
            }
        });
    }

    //   Import Bulk Documents :
    bulkImport() {
        const importRef = this.dialog.open(BulkImportDialogComponent, {
            disableClose: true,
            panelClass: 'custom-dialog-container',
        });
        // Handle the fileoutput event from BulkImportPopupComponent
        importRef.componentInstance.fileoutput.subscribe((re: File[]) => {
            if (re.length > 0) {
                const refScannedImgs = this.dialog.open(BulkImportFilesComponent,{
                        disableClose: true,
                        data: {
                            files: re,
                            groupElements: this.selectedGroup[0],
                            cureentLot: this.cureentLot,
                            lotName: this.lotName,
                        },
                    }
                );
                // Handle the passConverted event from BulkImportFilesComponent
                refScannedImgs.componentInstance.passConverted.subscribe(
                    (res) => {
                        refScannedImgs.close();
                        importRef.close();
                        if (res == null) {
                            this.open(1);
                        }
                        // Reset the form and other variables
                        this.setUpForm(this.CommonAttrs);
                        this.selectedGroup = null;
                        this.currentStep = 1;
                    }
                );
            }
        });
    }

    get attrsForms() {
        return this.docFormGroup.get('attrs') as FormArray;
    }

    addAttr(id: number,type: string,name: string,required: number,visible: number) {
        const attr = this.fb.group({id,type,name,
            val: [
                '',
                required == 1 && visible == 1 ? Validators.required : null,
            ],
        });
        this.attrsForms.push(attr);
    }
    open(state: number) {
        const dialogRef = this.dialog.open(AddSuccessDialogComponent, {
            data: {
                object: 'La document',
                operation: 'Lot ajouté avec succès',
                result: state === 1 ? 'succès' : 'echec',
                fromAdd: false,
            },
        });

        dialogRef.afterClosed().subscribe((result) => {
            console.log('Dialog was closed, result:', result);
        });
    }
}
