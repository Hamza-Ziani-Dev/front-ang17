import {
    Component,
    EventEmitter,
    Inject,
    Input,
    OnInit,
    Output,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import {
    FormArray,
    FormBuilder,
    FormGroup,
    FormsModule,
    ReactiveFormsModule,
    Validators,
} from '@angular/forms';
import { Attributes } from 'app/components/models/attrributes.model';
import { RestDataApiService } from 'app/components/services/rest-data-api.service';
import { ConfigService } from 'app/components/services/config.service';
import { EditDocumentService } from 'app/components/services/edit-document.service';
import { HttpClient } from '@angular/common/http';
import { Attribute } from 'app/components/models/attribute.model';
import { MaterialModuleModule } from 'shared/material-module/material-module.module';
import { TranslocoModule, TranslocoService } from '@ngneat/transloco';
import { Document } from 'app/components/models/document.model';

@Component({
    selector: 'app-edit-doc',
    standalone: true,
    imports: [
        CommonModule,
        MaterialModuleModule,
        TranslocoModule,
        FormsModule,
        ReactiveFormsModule,
    ],
    templateUrl: './edit-doc.component.html',
    styleUrl: './edit-doc.component.scss',
})
export class EditDocComponent implements OnInit {
    docup;
    @Output() back: EventEmitter<any> = new EventEmitter<any>();
    attributesForm = new FormArray([]);
    attr: Attribute[];
    attributes: Array<Attributes>;
    attri: Attributes;
    at: Attribute;
    atr: Array<Attribute>;
    docFormGroup: FormGroup;
    depArrays: any = new Array<any>();
    form;
    attrVals = {};
    d: Document;
    @Input() step;
    @Input() mode;
    i: number = 0;
    attrs;
    Hideattribute: Array<any>;
    constructor(
        private rest: RestDataApiService,
        public config: ConfigService,
        private srvDoc: EditDocumentService,
        private fb: FormBuilder,
        public httpClient: HttpClient,
        @Inject(MAT_DIALOG_DATA) public data: any,
        private dialogRef: MatDialogRef<EditDocComponent>
    ) {
        this.docup = data.docup;
        console.log(" this.docup", this.docup)
        this.mode = data.mode;
    }

    ngOnInit(): void {
        console.log(this.mode);
        this.atr = new Array<Attribute>();
        this.attributes = new Array<Attributes>();
        this.i = 0;

        this.httpClient.get('assets/attribute.json').subscribe((data: any) => {
            this.Hideattribute = data;

            if (this.mode == undefined) {
                console.log('this.docup',this.docup)
                this.rest.getDocTypesAttributes(this.docup.type.id)
                    .subscribe((r) => {
                        this.attrs = r;
                        console.log(this.attrs);
                        this.Hideattribute.forEach((attrs) => {
                            this.attrs.forEach((attribute, index) => {
                                if (attrs.name === attribute.name) {
                                    this.attrs.splice(index, 1);
                                }
                            });
                        });
                        console.log(this.attrs);
                        let i = 0;
                        const tempAttrs = new Array<Attributes>();

                        for (const a in this.attrs) {
                            if (this.attrs[i].type.name === 'fichier') {
                                tempAttrs.push(this.attrs[i]);
                                this.attrs.splice(i, 1);
                            }
                            if (this.attrs[i])
                                if (
                                    this.attrs[i].type.name === 'List' ||
                                    this.attrs[i].type.name === 'ListDep' ||
                                    this.attrs[i].type.name === 'listDb'
                                ) {
                                    this.listAttrsValues[i] = this.parseJSON(
                                        this.attrs[i].defaultValue
                                    );
                                    this.depArrays['id' + this.attrs[i].id] =
                                        JSON.parse(this.attrs[i].defaultValue);
                                    this.mappedArray['id' + this.attrs[i].id] =
                                        JSON.parse(this.attrs[i].defaultValue);
                                }
                            i++;
                        }
                        // this.attributes = this.docup.type.attributeValues.attribute;
                        for (
                            let index = 0;
                            index < this.docup.attributeValues.length;
                            index++
                        ) {
                            if (
                                this.docup.attributeValues[index].attribute.type.name != 'fichier'
                            ) {
                                this.attri = new Attributes();
                                const element =
                                    this.docup.attributeValues[index];

                                this.attri.id = element.attribute.id;
                                this.attri.name = element.attribute.name;
                                this.attri.type = element.attribute.type;
                                this.attri.libelle = element.attribute.libelle;
                                this.attri.labelfr = element.attribute.labelfr;
                                this.attri.labeleng =
                                    element.attribute.labeleng;
                                this.attri.labelar = element.attribute.labelar;
                                this.at = new Attribute();
                                this.at.val = element.value.value;

                                this.atr.push(this.at);
                                this.attributes.push(this.attri);
                                const eventItem = this.attributes[this.i];
                                if (this.step == 1) {
                                    this.addAttr(
                                        eventItem.id,
                                        eventItem.type.name,
                                        eventItem.name,
                                        element.value.value,
                                        this.docup.attributeValues[index]
                                            .attribute.required,
                                        this.attrs[index]?.visib
                                    );
                                } else {
                                    this.addAttr(
                                        eventItem.id,
                                        eventItem.type.name,
                                        eventItem.name,
                                        element.value.value,
                                        this.docup.attributeValues[index]
                                            .attribute.required
                                    );
                                }
                                this.i += 1;
                            }
                        }
                        this.form = this.docFormGroup;
                    });
            }
            console.log(this.attrs);
            if (this.mode == 'edit') {
                this.rest
                    .getDocTypesAttributes(this.docup.type.id)
                    .subscribe((r) => {
                        this.attrs = r;
                        this.Hideattribute.forEach((attrs) => {
                            this.attrs.forEach((attribute, index) => {
                                if (attrs.name === attribute.name) {
                                    this.attrs.splice(index, 1);
                                }
                            });
                        });
                        let i = 0;
                        const tempAttrs = new Array<Attributes>();

                        console.log(this.attrs);
                        for (const a in this.attrs) {
                            if (this.attrs[i].type.name === 'fichier') {
                                tempAttrs.push(this.attrs[i]);
                                this.attrs.splice(i, 1);
                            }
                            if (this.attrs[i])
                                if (
                                    this.attrs[i].type.name === 'List' ||
                                    this.attrs[i].type.name === 'ListDep' ||
                                    this.attrs[i].type.name === 'listDb'
                                ) {
                                    this.listAttrsValues[i] = this.parseJSON(
                                        this.attrs[i].defaultValue
                                    );
                                    this.depArrays['id' + this.attrs[i].id] =
                                        JSON.parse(this.attrs[i].defaultValue);
                                    this.mappedArray['id' + this.attrs[i].id] =
                                        JSON.parse(this.attrs[i].defaultValue);
                                }
                            i++;
                        }
                        for (
                            let index = 0;
                            index < this.docup.attributeValues.length;
                            index++
                        ) {
                            if (
                                this.docup.attributeValues[index].attribute.type
                                    .name != 'fichier'
                            ) {
                                this.attri = new Attributes();
                                const element =
                                    this.docup.attributeValues[index];
                                this.attri.id = element.attribute.id;
                                this.attri.name = element.attribute.name;
                                this.attri.type = element.attribute.type;
                                this.attri.libelle = element.attribute.libelle;
                                this.attri.labelfr = element.attribute.labelfr;
                                this.attri.labeleng =
                                    element.attribute.labeleng;
                                this.attri.labelar = element.attribute.labelar;
                                this.at = new Attribute();
                                this.at.val = element.value.value;
                                this.attri.id = element.attribute.id;
                                //console.log(element.value)
                                this.atr.push(this.at);
                                this.attributes.push(this.attri);
                                const eventItem = this.attributes[this.i];
                                this.addAttr(
                                    eventItem.id,
                                    eventItem.type.name,
                                    eventItem.name,
                                    element.value.value,
                                    this.docup.attributeValues[index].attribute
                                        .required
                                );
                                this.i += 1;
                            }
                        }
                    });

                this.form = this.docFormGroup;
            }
        });
        let aa: Attributes[];
        this.setUpForm();
    }

    close(){
        this.dialogRef.close();
    }

    mappedArray = [];

    changeValue(e: any, attr: any) {
        let idx = 0;
        this.attrVals['l' + attr.name] = this.mappedArray[
            'id' + attr.id
        ].filter((_e) => {
            return e === _e.key;
        })[0]?.value;

        this.attrs.forEach((element) => {
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
                this.changeValue(array[0]?.key, element);
                // setTimeout(() => {  console.log();

                //  },0)
            }

            idx++;
        });
    }

    listAttrsValues: any = [];

    parseJSON(str) {
        console.log('loaded');

        return JSON.parse(str);
    }

    isloading = false;
    addAttr(id: number, type: string, name: string, val, req = 0, visib = 1) {
        const attr = this.fb.group({
            id,
            type,
            name,
            val: [
                val,
                req == 1 && visib == 1
                    ? [
                          Validators.required,
                          Validators.minLength(this.config.min),
                          Validators.maxLength(this.config.max),
                          Validators.pattern(/^(\s+\S+\s*)*(?!\s).*$/),
                      ]
                    : null,
            ],
        });

        console.log(id, val);

        if (type != 'fichier' && type != 'Fichier') this.attrsForms.push(attr);
    }
    get attrsForms() {
        return this.docFormGroup.get('attrs') as FormArray;
    }
    setUpForm() {
        this.docFormGroup = this.fb.group({
            type: [''],

            attrs: this.fb.array([]),
        });
    }
    clear() {
        this.ngOnInit();
    }
    edit() {
        if (this.docFormGroup.valid) {
            this.isloading = true;
            const p = this.docFormGroup.value['attrs'];
            this.d = new Document();
            console.log("this.d",this.d)
            this.d.type = this.docup['type']['id'];
            this.d.id = this.docup['id'];
            this.d.attrs = p;
            this.d.fileName = this.docup.fileName;
            console.log(this.d);
            if (this.mode != 'edit') {
                this.srvDoc
                    .editDocProcess(this.d)
                    .subscribe((resp) => {
                        this.back.emit('ok');
                        this.close();
                    })
                    .add(() => {
                        this.isloading = false;
                    });
            } else {
                this.srvDoc
                    .edit(this.d)
                    .subscribe((resp) => {
                        this.back.emit('ok');
                        this.close();
                    }).add(() => {
                        this.isloading = false;
                    });
            }
        }
    }
    valid() {
        const invalid = [];
        const controls = this.docFormGroup.get('attrs');
        console.log(controls);
        for (const name in controls['controls']) {
            if (controls[name].invalid) {
                invalid.push(name);
            }
        }

        console.log(invalid);
    }
}
