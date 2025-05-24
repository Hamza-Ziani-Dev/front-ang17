import { ChangeDetectorRef, Component, EventEmitter, Inject, Input, NgZone, OnInit, Output, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialModuleModule } from 'shared/material-module/material-module.module';
import { FormArray, FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Attributes } from 'app/components/models/attrributes.model';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { FileModel } from 'app/components/models/file.model';
import { environment } from 'environments/environment.development';
import { ConfigService } from 'app/components/services/config.service';
import { RestDataApiService } from 'app/components/services/rest-data-api.service';
import { EditListDocService } from 'app/components/services/edit-list-doc.service';
import { WsService } from 'app/components/sockets/ws.service';
import { HttpClient, HttpClientModule, HttpHeaders } from '@angular/common/http';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { ConvertToPdfComponent } from '../convert-to-pdf/convert-to-pdf.component';
import { WarningInfoComponent } from '../warning-info/warning-info.component';
import { createWorker, PSM } from 'tesseract.js';
import { AddSuccessDialogComponent } from '../add-success-dialog/add-success-dialog.component';
import { CodebarPositioningDialogComponent } from '../codebar-positioning-dialog/codebar-positioning-dialog.component';
import { ScanDialogComponent } from '../scan-dialog/scan-dialog.component';
import { ResultComponent } from '../result/result.component';
import { ToastrService } from 'ngx-toastr';
import { TranslocoModule, TranslocoService } from '@ngneat/transloco';
import { PdfViewerModule } from 'ng2-pdf-viewer';
import { QuillModule } from 'ngx-quill';
import { EditorTextDialogComponent } from '../editor-text-dialog/editor-text-dialog.component';

let myFrame;

function dragElement(elmnt) {
    var pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
    if (myFrame.getElementById(elmnt.id + "header")) {
      myFrame.getElementById(elmnt.id + "header").onmousedown = dragMouseDown;
    } else {
      elmnt.onmousedown = dragMouseDown;
    }

    function dragMouseDown(e) {
      e = e || window.event;
      e.preventDefault();
      pos3 = e.clientX;
      pos4 = e.clientY;
      myFrame.onmouseup = closeDragElement;
      myFrame.onmousemove = elementDrag;

    }

    function elementDrag(e) {
      e = e || window.event;
      e.preventDefault();
      pos1 = pos3 - e.clientX;
      pos2 = pos4 - e.clientY;
      pos3 = e.clientX;
      pos4 = e.clientY;
      elmnt.style.top = (elmnt.offsetTop - pos2) + "px";
      elmnt.style.left = (elmnt.offsetLeft - pos1) + "px";


    }

    function closeDragElement() {
      myFrame.onmouseup = null;
      myFrame.onmousemove = null;
    }


  }
@Component({
  selector: 'app-add-document-popup',
  standalone: true,
  imports: [CommonModule,MaterialModuleModule,FormsModule,QuillModule,FormsModule,ReactiveFormsModule,HttpClientModule,TranslocoModule,PdfViewerModule],
  templateUrl: './add-document-popup.component.html',
  styleUrl: './add-document-popup.component.scss'
})
export class AddDocumentPopupComponent implements OnInit {
 @Output() resp: EventEmitter<any> = new EventEmitter();
    listFolders: Array<string>;
    attributes: Attributes[];
    form: FormGroup;
    base64file: string;
    existRef = false;
    @Input() courrierId;
    @Input() courrierRef;
    isLoaded = false;
    fileValidator = '';
    selectedFile: any;
    err;
    attrVals = {};
    depArrays: any = new Array<any>();
    @Input() folderToLink: string;
    autoref: string = null;
    keyword = 'name';
    groupDoc: any[] = [];
    Validdoctypes: any[] = new Array();
    Checkdoctypes: any[] = new Array();
    today;
    finished = true;
    Hideattribute: Array<any>;
    isloading = false;
    @Input() ftype;
    @Input() f; //Folder parent
    codeBar = false;
    URL_POS_PARAM = `/44?x=0&y=0&h=0&w=0`;
    isGenerated = false;
    htmlCont = '';
    fullText = '';
    pr: number;
    saved = false;
    generated = 0;
    isLoading = false;
    uri: SafeResourceUrl;
    added = 0;
    isFileAdded: boolean = false;
    isFileAddOption = true;
    objUrl: string;
    selectedDoc = 'all';
    currentCourrier = '';
    convertPDF = false;
    fileModel = new FileModel();
    attributesForm = new FormArray([]);
    doctypes;
    listAttrsValues: any = [];
    tp;
    codeBarImg;
    documentModel: any = new Document();
    selectedType;
    selectedGroup;
    mappedArray = [];
    fichierindx = 0;
    @ViewChild('frame') vframe;
    curenntPage = 0;
    position = { x: 88, y: 39 };
    currentPos = { x: 0, y: 0 };
    currentAtt = '';
    ShowCroper = false;
    currentIndx = -1;
    currentLang = 'fra';
    base64Content: SafeResourceUrl | null = null;
    content;
    hasFooter = false;
    hasHeader = false;
    hideDocCodeBar = environment.hideDocCodeBar;
    hideRefAuto = environment.hideRefAuto;
    maxUpload = environment.maxUpload;
    constructor(
        private toast: ToastrService,
        private ref: ChangeDetectorRef,
        public config: ConfigService,
        private rest: RestDataApiService,
        private docserv: EditListDocService,
        private ws: WsService,
        private fb: FormBuilder,
        private httpClient: HttpClient,
        private sanitizer: DomSanitizer,
        private _translocoService: TranslocoService,
        private dialog: MatDialog,
        private ngZone : NgZone,
        public closedialog: MatDialogRef<AddDocumentPopupComponent>,
        @Inject(MAT_DIALOG_DATA)
        public data: { courrierId: string; ftype: any; f: any; pr: number }
    ) {
    }
    ngAfterViewInit(): void {
        myFrame = document.getElementById("viewerframe");
        this.currentCourrier = this.courrierRef ? "Dossier actuel :" + this.courrierRef : "";
        window.document.addEventListener('myEvent', (e)=> {
         if(this.codeBarImg && this.codeBar)
         {
           this.drawbarCode(this.codeBarImg, this.getPosition(this.URL_POS_PARAM))
         }
        }, false)

      }

    ngDoCheck(): void {}


    //  Check If Exist :
    isExist(val): boolean {
        return typeof val.name !== 'undefined';
    }

    ngOnInit(): void {
        this.httpClient.get('assets/attribute.json').subscribe((data: any) => {
            this.Hideattribute = data;
        });

        var now = new Date();
        var month: any = now.getMonth() + 1;
        var day: any = now.getDate();
        if (month < 10) month = '0' + month;
        if (day < 10) day = '0' + day;
        this.today = now.getFullYear() + '-' + month + '-' + day;

        this.getGroupDoc();
        if (this.data.f.autoRef != null) {
            this.autoref = this.data.f.autoRef
          }

        if (this.pr == 1) {
            this.generated = -1;
        }
        this.added = 0;
        this.selectedFile = null;
        this.listFolders = new Array<string>();
        this.listFolders.push(this.folderToLink);
        this.setUpForm();
        this.getDocsTypes();
        this.finished = true;
    }


  getLabel(attribute: any, lang: string): string {
  return attribute['libelle' + lang] || attribute.libelle;
  }
    // Change Value :
    changeValue(e: any, attr: any) {
        let idx = 0;
        this.attrVals['l' + attr.name] = this.mappedArray[
            'id' + attr.id
        ].filter((_e) => {
            return e === _e.key;
        })[0]?.value;

        this.attributes.forEach((element) => {
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
                this.depArrays['id' + element.id] = array(
                    this.attrsForms as FormArray
                )
                    .at(idx)
                    .patchValue({ val: array[0]?.key ?? '' });
                this.changeValue(array[0]?.key, element);
            }
            idx++;
        });
    }

    // Parce Json :
    parseJSON(str) {
        return JSON.parse(str);
    }

    // Get Group Document :
    getGroupDoc() {
        this.docserv.getAllElementsGroupsWithoutPage().subscribe((res) => {
          const all = { documentTypes: [], goupId: 0,
             groupLabel: this._translocoService.translate('ajoutercourrier.aucungroupe'),
             groupDesc: '', groupName: '', isAutoNum: null, seq: 0, standard: false }
          this.groupDoc = res;
          this.groupDoc.unshift(all)
        });
      }
    // Change Group Documents :
    changeGroupDoc(e) {
        this.selectedGroup = e
        if (e.goupId == 0) { this.getDocsTypes();}

        this.groupDoc.forEach(res => {
          if (res.goupId == e.goupId) {
            this.doctypes = [];
            this.Checkdoctypes = res.documentTypes
          }
        })

        this.Validdoctypes.forEach((response) => {
          this.Checkdoctypes.forEach(resp => {
            if (response?.id == resp?.id) {
              this.doctypes.push(response)
            }
          })
        })

        this.form.controls["type"].setValue("")
        this.attrsForms.clear();
        this.selectedFile = null
        setTimeout(() => {
          this.uri = this.sanitizer.bypassSecurityTrustResourceUrl('assets/ViewerJS/index.html');
          sessionStorage.setItem('vfileName', '');
          this.isLoading = false;
        }, 200);
      }

    // Change File PDF :
    fileChangeEvent(fileInput: any) {
                const file = fileInput.target.files[0];
                this.content=file.type
                if (file.size < this.maxUpload) {
                  this.selectedFile = file;

                  if (this.selectedFile.type != "application/pdf") {
                    this.added = 1
                    this.generated = 1
                  } else {
                    this.added = 0
                    this.generated = -1
                  }
                  if (file.type == "image/tiff" || file.type == "image/tif") {


                  //   const modalRef = this.modal.open(ConvertToPdfComponent)
                  const dialogRef = this.dialog.open(ConvertToPdfComponent, {
                      data: {  },
                      disableClose: false,
                    });
                    const reader = new FileReader();

                    const self = this;
                    reader.onload = () => {
                      const base64String = reader.result as string;
                      dialogRef.componentInstance.fileContent = base64String;
                      dialogRef.componentInstance.fileName = file.name;


                    };


                    reader.readAsDataURL(file);
                    dialogRef.componentInstance.pass.subscribe(res => {

                      if (res) {


                        const _file = new File([res.file], res.fileName, { type: 'application/pdf', lastModified: Date.now() });
                        const event = { "target": { "files": [_file] } }
                        this.fileChangeEvent(event)
                        sessionStorage.setItem('vfileName', res.fileName);
                      dialogRef.afterClosed().subscribe(result => {
                        });
                      } else {


                      //   modalRef.dismiss();
                      dialogRef.afterClosed().subscribe(result => {
                        });

                        this.fileModel.fileName = file.name.split('\\')[0];

                        const reader = new FileReader();

                        const self = this;
                        reader.onload = () => {

                          const supportedMimes = environment.supportedMimeTypes.split(' ');
                          const base64String = reader.result as string;
                          if (true) {
                            this.isLoading = true;
                            if (supportedMimes.indexOf(file.type) !== -1) {
                              this.uri = this.sanitizer.bypassSecurityTrustResourceUrl('assets/ViewerJS/#' + base64String);
                              sessionStorage.setItem('vfileName', file.name);
                              this.isFileAdded = true;

                            }
                            else {
                              this.isFileAdded = false;
                              if (environment.hideToast) {
                                this.toast.info("Le format du fichier choisi n'est pas supporté par la visionneuse", "Format non supporté")
                              }
                            }
                            setTimeout(() => {
                              myFrame = document.getElementById("viewerframe");
                              self.fileModel.fileBase64 = base64String.split(',')[1];
                              this.isLoading = false;
                            }, 200);
                          }

                        };
                        reader.readAsDataURL(file);
                        reader.onloadend = function () {
                          self.documentModel.fileName = file.name;
                          self.fileModel.fileName = file.name;

                        };
                      }
                    })

                  } else {
                    this.fileModel.fileName = file.name.split('\\')[0];
                    const reader = new FileReader();
                    this.objUrl = URL.createObjectURL(file)
                    const self = this;
                    reader.onload = () => {

                      const supportedMimes = environment.supportedMimeTypes.split(' ');
                      const base64String = reader.result as string;
                      if (true) {
                        this.isLoading = true;
                        if (supportedMimes.indexOf(file.type) !== -1) {
                          this.uri = this.sanitizer.bypassSecurityTrustResourceUrl('assets/ViewerJS/#' + this.objUrl);
                          sessionStorage.setItem('vfileName', file.name);
                          this.isFileAdded = true;

                        }
                        else {
                          this.isFileAdded = false;
                          if (environment.hideToast) {
                            this.toast.info("Le format du fichier choisi n'est pas supporté par la visionneuse", "Format non supporté")
                          }
                        }
                        setTimeout(() => {
                          myFrame = document.getElementById("viewerframe");
                          self.fileModel.fileBase64 = base64String.split(',')[1];
                          this.isLoading = false;
                        }, 200);
                      }
                    };
                    reader.readAsDataURL(file);
                    reader.onloadend = function () {
                      self.documentModel.fileName = file.name;
                      self.fileModel.fileName = file.name;
                    };
                  }
                }
                else {

                  this.fileValidator = "Vous avez depassé la taille maximale.";
                  this.openModale("Erreur", this.fileValidator, -1)
                }

         }

    handleOtherFileTypes(file: File) {
        this.fileModel.fileName = file.name.split('\\')[0];
        const reader = new FileReader();
        this.objUrl = URL.createObjectURL(file);

        reader.onload = () => {
            const supportedMimes = environment.supportedMimeTypes.split(' ');
            const base64String = reader.result as string;

            this.isLoading = true;
            if (supportedMimes.includes(file.type)) {
                this.uri = this.sanitizer.bypassSecurityTrustResourceUrl(this.objUrl);
                sessionStorage.setItem('vfileName', file.name);
                this.isFileAdded = true;
            } else {
                this.isFileAdded = false;
                if (environment.hideToast) {
                    this.toast.info("Le format du fichier choisi n'est pas supporté par la visionneuse", "Format non supporté");
                }
            }

            setTimeout(() => {
                this.fileModel.fileBase64 = base64String.split(',')[1];
                this.isLoading = false;
            }, 200);
        };

        reader.readAsDataURL(file);
        reader.onloadend = () => {
            this.documentModel.fileName = file.name;
            this.fileModel.fileName = file.name;
        };
    }

    openErrorDialog(title: string, message: string) {
        this.dialog.open(WarningInfoComponent, {
            width: '400px',
            disableClose: true,
            data: { title, message }
        });
    }

    // Get Documents Types :
    getDocsTypes() {
        this.docserv.getlist('C').subscribe((res) => {
            this.doctypes = res;
            this.Validdoctypes = res;
        });
    }

    // Toggle the option:
    fileAddOptionChange(e) {
        this.isFileAddOption = !this.isFileAddOption;
        if (!this.isFileAddOption) {
            this.isGenerated = false;
            this.htmlCont = '';
        }
    }

    isFileOptionChecker() {
        if (!this.isFileAddOption) {
            this.form.get('attrs')['controls'][this.form.get('attrs')['controls'].length - 1].controls.val.setValue(this.fileModel.fileName);
        }
    }
    // From :
    setUpForm() {
        this.form = this.fb.group({
            type: ['', Validators.required],
            GroupDoc: [0],
            fileName: ['', []],
            attrs: this.fb.array([]),
        });
    }

    // Add Attrs :
    get attrsForms() {
        return this.form.get('attrs') as FormArray;
    }

    // Change Type :
    changeType(e, mode = 0) {
        this.fileModel = new FileModel();
        this.isLoaded = false;
        this.clearFormArray();
        this.tp = null;
        if (mode == 1) {
            this.doctypes.forEach((element) => {
                if (element.id == e.target.value) {
                    this.selectedType = element.libelle;
                    this.tp = element.id;
                }
            });
        } else {
            this.tp = e['id'];
        }
        if (mode == 2) {
            this.tp = e;
        }
        let aa: Attributes[];
        if (this.tp)
            this.rest.getDocTypesAttributes(this.tp).subscribe(
                (res: Attributes[]) => {
                    aa = res as Attributes[];
                    this.attributes = aa;
                    this.Hideattribute.forEach((attrs) => {
                        this.attributes.forEach((attribute, index) => {
                            if (attrs.name === attribute.name) {
                                this.attributes.splice(index, 1);
                            }
                        });
                    });
                    let i = 0;
                    const tempAttrs = new Array<Attributes>();
                    for (const a in this.attributes) {
                        if (this.attributes[i].type.name === 'fichier') {
                            tempAttrs.push(this.attributes[i]);
                            this.attributes.splice(i, 1);
                        }
                        if (this.attributes[i])
                            if (
                                this.attributes[i].type.name === 'List' ||
                                this.attributes[i].type.name === 'ListDep' ||
                                this.attributes[i].type.name === 'listDb'
                            ) {
                                this.listAttrsValues[i] = this.parseJSON(
                                    this.attributes[i].defaultValue
                                );
                                this.depArrays['id' + this.attributes[i].id] =
                                    JSON.parse(this.attributes[i].defaultValue);
                                this.mappedArray['id' + this.attributes[i].id] =
                                    JSON.parse(this.attributes[i].defaultValue);
                            }

                        i++;
                    }
                    tempAttrs.forEach((element) => {
                        this.attributes.push(element);
                    });
                    const fileTypes: Attributes[] = new Array<Attributes>();
                    for (const item of Object.keys(this.attributes)) {
                        const eventItem = this.attributes[item];

                        if (eventItem.type.name !== 'fichier') {
                            this.addAttr(
                                eventItem.id,
                                eventItem.type.name,
                                eventItem.name,
                                eventItem.required,
                                eventItem.visib
                            );
                        } else {
                            fileTypes.push(eventItem);
                        }
                    }
                    for (const e of fileTypes) {
                        this.addAttr(e.id, e.type.name, e.name, 1, 1);
                    }
                    this.isLoaded = true;
                },

                (err) => {
                    console.warn(err.data);
                }
            );
    }

    // Add Attribute :
    addAttr(id: number, type: string, name: string, required, visib) {
        if (name === 'fichier') {
            this.fichierindx = this.attrsForms.length;
        }
        const attr = this.fb.group({
            id,
            type,
            name,
            val: [
                name != 'fichier' ? '' : 'none',
                required == 1 && visib == 1
                    ? [
                          Validators.required,
                          Validators.minLength(this.config.min),
                          Validators.maxLength(this.config.max),
                      ]
                    : null,
            ],
        });
        this.attrsForms.push(attr);
    }



    // Select Attributes :
    selectAttr(attname, i) {

        if (this.ShowCroper)
          return

      if (!this.isFileAdded) {
          const dialogRef = this.dialog.open(WarningInfoComponent, {
            disableClose: true,
            data: {
              title: "Aucun document choisi",
              message: "La visionneuse ne contient aucun document"
            }
          });
        }

        myFrame = this.vframe.nativeElement.contentWindow.document;
        let CurrentPage = sessionStorage.getItem("currentPage") ?? 1;
        let pCont = this.vframe.nativeElement.contentWindow.document.getElementById('pageContainer' + CurrentPage);
        const delem = this.createDragElement()
        pCont.prepend(delem);
        dragElement(delem)
        this.ShowCroper = true;
        this.currentAtt = attname;
      }

      isOcrLoading: boolean = false;
      currentOcrIndex: number | null = null;

      async ocrField(type) {
        this.isOcrLoading = true;
        let CurrentPage = sessionStorage.getItem("currentPage") ?? 1;
        let zone = myFrame.getElementById("mydiv")
        let h: number = zone.offsetHeight
        let w: number = zone.offsetWidth
        let x: number = zone.offsetLeft
        let y: number = zone.offsetTop
        let canva = this.vframe.nativeElement.contentWindow.document.getElementById('canvas' + CurrentPage);
        let ctx = canva.getContext("2d");
        let imageData = ctx.getImageData(x, y, w, h);
        let capture = document.createElement('canvas');
        capture.width = w;
        capture.height = h;
        let ctx1 = capture.getContext("2d");
        ctx1.rect(0, 0, w, h);
        ctx1.fillStyle = 'white';
        ctx1.fill();
        ctx1.putImageData(imageData, 0, 0);
        const worker = createWorker({
        workerPath: '/assets/tesseract/worker.min.js',
        langPath: '/assets/tesseract/lang-data',
        corePath: '/assets/tesseract/tesseract-core.wasm.js',

        logger: m => {
            try {
              if (m.status === 'recognizing text') {
                if (m.progress === 1) {
                  console.log('Text recognition completed!');
                }
              }
            } catch (e) {
              console.warn('Tesseract logger error:', e);
            }
          }
        });
        try {
        await (await worker).load();
        await (await worker).loadLanguage(this.currentLang);
        await (await worker).initialize(this.currentLang);
        await (await worker).setParameters({
            tessedit_pageseg_mode: PSM.AUTO,
          });
          let res = await (await worker).recognize(capture);
          let _value: any = res.data.text
          if (type == "number") {

            _value = parseInt(_value);
            if (!_value) {
                const dialogRef = this.dialog.open(WarningInfoComponent, {
                  // width: '400px',
                  disableClose: true,
                  data: {
                    title: "Erreur de conversion",
                    message: "L'indice sélectionné n'est pas un numéro"
                  }
                });
              }



          }


          else if (type == "date") {

            _value = new Date(_value)
            if (_value == 'Invalid Date') {
                const dialogRef = this.dialog.open(WarningInfoComponent, {
                  // width: '400px',
                  disableClose: true,
                  data: {
                    title: "Erreur de conversion",
                    message: "L'indice sélectionné n'est pas une date sous la forme JJ/MM/AAAA"
                  }
                });
              }
          }
          this.form.get('attrs')["controls"][this.currentIndx].controls.val.setValue(_value);

    } catch (error) {
        console.error('OCR Error:', error);
      } finally {
        this.isOcrLoading = false;
        await (await worker).terminate();
      }

      }

    // Open Material Dialog
    openWarningDialog(title: string, message: string): void {
        this.dialog.open(WarningInfoComponent, {
            width: '400px',
            data: { title, message },
            disableClose: true
        });
    }

    recognizeAttr(attname, i, _as) {

        if (!this.ShowCroper)return

        this.currentAtt = attname;
        this.currentIndx = i;
        this.isOcrLoading = true;
        this.currentOcrIndex = i;

        if (this.ShowCroper) {

          this.ocrField(_as).then(fin => {
            myFrame.getElementById("mydiv").remove();
            this.ShowCroper = false;
          }).finally(() => {
            this.isOcrLoading = false;
            this.currentOcrIndex = null;
          });
        }
      }


    createDragElement() {
        let dragDiv =
          this.vframe.nativeElement.contentWindow.document.createElement('div');
        dragDiv.style =
          ' position: absolute; z-index: 99;border: 2px solid #ffc107;text-align: center;height:50px;width:200px;resize: both;overflow: auto;';
        dragDiv.id = 'mydiv';
        dragDiv.padding = '0';
        let closeDiv = this.vframe.nativeElement.contentWindow.document.createElement('div')
        closeDiv.id = "closeCropper"
        closeDiv.style.height = "15px"
        closeDiv.style.width = "15px"
        closeDiv.style.color = "white"
        closeDiv.style.cursor = "pointer"
        closeDiv.style.background = "red"
        closeDiv.style.top = 0
        closeDiv.style.right = 0
        closeDiv.style.cursor = "pionter"
        closeDiv.style.position = "absolute"
        closeDiv.innerHTML = "<span>x<span>"
        closeDiv.addEventListener("click", ()=>{
          this.CloseCropper();
        })
        dragDiv.appendChild(closeDiv)
        let DragDiv =
          this.vframe.nativeElement.contentWindow.document.createElement('div');
        DragDiv.style =
          ' cursor: move; z-index: 100;height:92%;width:92%;margin:1px';
        DragDiv.id = 'mydivheader';

        dragDiv.appendChild(DragDiv);
        return dragDiv;
    }

    CloseCropper() {
        this.ngZone.run( () => {
          this.ShowCroper = false;

       });
    }
    // Clear Form :
    clearFormArray() {
        while (this.attrsForms.length !== 0) {
            this.attrsForms.removeAt(0);
        }
    }

    // Convert To Pdf :
    convertToPdf(e) {
        this.convertPDF = e.target.value;
    }

    // On Submit :
    // onSubmit() {
    //     this.isloading=true
    //     const fileName = this.documentModel.fileName;
    //     this.documentModel = this.form.value;
    //     this.documentModel.isGenerated = this.isGenerated;
    //     this.documentModel.htmlContent = this.htmlCont;
    //     this.documentModel.fullText = this.fullText;
    //     this.documentModel.hasHeader = this.hasHeader;
    //     this.documentModel.hasFooter = this.hasFooter;
    //     this.documentModel.fileName = fileName;
    //     this.documentModel.content=this.content
    //     this.doctypes.forEach(element => {
    //       if (element.libelle == this.documentModel.type) {
    //         this.documentModel.type = element.id
    //       }
    //     });
    //     this.documentAddLocal(this.selectedFile, this.documentModel);
    //     return;
    //     this.rest.addDocument(this.documentModel).subscribe(res => {
    //       this.fileModel.fileId = res['id'];
    //       this.open(1);
    //       this.ws.addDocument(this.fileModel);
    //     },
    //       err => {
    //         this.open(0);
    //       }
    //     );

    //   }
    onSubmit() {
        this.isloading = true;
        const fileName = this.documentModel;
        this.documentModel = this.form.value;
        this.documentModel.isGenerated = this.isGenerated;
        this.documentModel.htmlContent = this.htmlCont;
        this.documentModel.fullText = this.fullText;
        this.documentModel.hasHeader = this.hasHeader;
        this.documentModel.hasFooter = this.hasFooter;
        this.documentModel['fileName'] = this.selectedFile.name;
        this.documentModel.content = this.content;
        this.doctypes.forEach((element) => {
            if (element.libelle == this.documentModel['type']) {this.documentModel['type'] = element['id'];}
        });

        console.log('selectedFile',this.selectedFile,"this.documentModel",this.documentModel)
        this.documentAddLocal(this.selectedFile, this.documentModel);
        return;
        this.rest.addDocument(this.documentModel).subscribe(
            (res) => {
              this.fileModel.fileId = res['id'];
              this.open(1);

              this.ws.addDocument(this.fileModel);
            },
            (err) => {
              this.open(0);
            }
          );
    }

    // Ajouter Dialog :
    open(state: number): void {
        const dialogRef = this.dialog.open(AddSuccessDialogComponent, {
            data: {
                name: this.fileModel.fileName,
                operation: this._translocoService.translate(
                    'ajoutercourrier.ajoutersuccess'
                ),
            },
        });
    }

    scan() {
        this.ws.newScan();
        const dialogRef = this.dialog.open(ScanDialogComponent, {
          disableClose: true,
          data: {},
        });
        dialogRef.componentInstance.passEntry.subscribe((file) => {
          if (file) {
            const FILENAME = `scan${new Date().getTime()}.pdf`;
            const _file = new File([file.file], FILENAME, {
              type: 'application/pdf',
              lastModified: Date.now(),
            });
            const event = { target: { files: [_file] } };
            this.fullText = file.text;
            this.fileChangeEvent(event);
            this.form.get('attrs')['controls'][this.form.get('attrs')['controls'].length - 1
            ].controls.val.setValue(this.fileModel['fileName']);
          }
          dialogRef.close();
        });
      }

    // Editor :
    editor() {
        const dialogRef = this.dialog.open(EditorTextDialogComponent, {
          disableClose: true,
          autoFocus: true
        });

        dialogRef.componentInstance.closeEv.subscribe(() => {
          dialogRef.close();
        });

        dialogRef.componentInstance.save.subscribe(res => {
          dialogRef.close();
          this.isGenerated = true;
          const event = { target: { files: [res.file] } };
          this.hasFooter = res.hasFooter;
          this.hasHeader = res.hasHeader;
          this.htmlCont = res.content;

          this.fileChangeEvent(event);
          const attrsControls = this.form.get('attrs')['controls'];

          attrsControls[attrsControls.length - 1].controls.val.setValue(this.fileModel.fileName);
        });
      }

    //   Generate Code Bar :
    codeBarToPdf(e: any) {
        let barCodeValue = '';
        if (this.selectedFile) {
            this.codeBar = e.target.value;
            if (this.codeBar === true) {
                const reader = new FileReader();
                reader.onload = (event: any) => {
                    const posRef = this.dialog.open(CodebarPositioningDialogComponent,
                        {
                            disableClose: true,
                            panelClass: 'sign-popup',
                            backdropClass: 'backdrop',
                        }
                    );

                    const documentModel: Document = this.form.value;
                    // posRef.componentInstance.refval = documentModel.attrs[0].val;
                    posRef.componentInstance.pdfSrc = event.target
                        .result as string;

                    // Subscribe to the back event
                    posRef.componentInstance.back.subscribe((r) => {
                        if (r === 'done') {
                            if (this.pr === 1) {
                                this.generated = 1;
                            }
                            this.added = 1;
                        } else {
                            const checkbox = document.getElementById(
                                'chck'
                            ) as HTMLInputElement;
                            if (checkbox) {
                                checkbox.checked = false;
                            }
                        }
                    });

                    // Barcode logic
                    const allowedChars =
                        'ABCDEFGHIJKLMNOPQRSTUVWXYZ123456789 -.$/+%';
                    let filteredBarCodeValue = '';
                    barCodeValue = this.autoref;
                    for (let k = 0; k < barCodeValue.length; k++) {
                        const currentChar = barCodeValue
                            .toUpperCase()
                            .charAt(k);
                        filteredBarCodeValue += allowedChars.includes(
                            currentChar
                        )
                            ? currentChar
                            : '-';
                    }
                    barCodeValue = filteredBarCodeValue;
                    posRef.componentInstance.cbval = barCodeValue;

                    // Handle position and image
                    posRef.componentInstance.passPositionParmChain.subscribe(
                        (pos) => {
                            this.URL_POS_PARAM = pos.pos as string;
                            this.codeBarImg = pos.img;
                            const position = this.getPosition(
                                this.URL_POS_PARAM
                            );
                            this.drawbarCode(this.codeBarImg, position);

                            posRef.close(); // Close the dialog after processing
                        }
                    );
                };

                reader.readAsDataURL(this.selectedFile);
            }
        }
    }

    // Get Possition :
    getPosition(key): any {
        let elem = key.indexOf("?");
        let s = key.substring(elem + 1, key.length)
        return JSON.parse('{"' + decodeURI(s).replace(/"/g, '\\"').replace(/&/g, '","').replace(/=/g, '":"') + '"}');

      }


    // Drawbar Code :
    drawbarCode(img: any, c: any) {
        myFrame = this.vframe.nativeElement.contentWindow.document;
        let firstCanva = myFrame.getElementById('canvas1');
        let h = firstCanva.height;
        let offset = h / c.h;

        let ctx = firstCanva.getContext('2d');
        let url = URL.createObjectURL(img);
        this.compressImage(url, offset).then((newImage) => {
            URL.revokeObjectURL(url);
            const nimg = new Image();

            nimg.onload = () => {
                ctx.drawImage(nimg, c.x * offset, c.y * offset);
            };
            // @ts-ignore
            const nextURl = URL.createObjectURL(newImage);
            nimg.src = nextURl;
        });
    }

    // Compress Image :
    compressImage(src, offdset) {
        return new Promise((res, rej) => {
            const img = new Image();
            img.src = src;
            img.onload = () => {
                const elem = document.createElement('canvas');
                elem.width = img.width * offdset;
                elem.height = img.height * offdset;
                const ctx = elem.getContext('2d');
                ctx.drawImage(
                    img,
                    0,
                    0,
                    img.width * offdset,
                    img.height * offdset
                );
                const data = ctx.canvas.toDataURL();

                const arr = data.split(','),
                    mime = arr[0].match(/:(.*?);/)[1];
                let bstr = atob(arr[1]);
                let n = bstr.length,
                    u8arr = new Uint8Array(n);
                while (n--) {
                    u8arr[n] = bstr.charCodeAt(n);
                }
                const file = new Blob([u8arr], { type: mime });
                res(file);
            };
            img.onerror = (error) => rej(error);
        });
    }

    documentAddLocal(file, document) {
        const formData: FormData = new FormData();
        formData.append('file', file);
        formData.append('img', this.codeBarImg);

        const headers: HttpHeaders = new HttpHeaders({
            Authorization:  sessionStorage.getItem('auth'),
          });

        this.rest.addDocument(document).subscribe((res) => {
                if (this.isFileAddOption) {
                    this.httpClient.post(environment.apiUrl +'/documentfile/' +res['id'] +`/${this.convertPDF ? '1' : '0'}/${this.codeBar ? '1' : '0'}${this.URL_POS_PARAM}`,
                            formData,{ headers }).subscribe((resp) => {
                                this.fileModel.fileId = res['id'];
                                this.existRef = false;
                                this.finished = false;

                                if (this.data.courrierId) {
                                    this.rest
                                        .linkdocfolder(
                                            res['id'],
                                            this.data.courrierId
                                        )
                                        .subscribe({
                                            next: (res) => {
                                                this.open(1);
                                                this.resp.emit('ok');
                                                this.close();
                                                this.isloading = false;
                                            },
                                            error: (err) => {
                                                console.error(
                                                    'Error linking document to folder:',
                                                    err
                                                );
                                                this.isloading = false;
                                            },
                                        });
                                } else {
                                    console.error(
                                        'Folder ID (courrierId) is missing!'
                                    );
                                    this.isloading = false;
                                }
                            },
                            (error) => {
                                this.isloading = false;
                            }
                        );
                } else {
                    if (this.courrierId) {
                        this.rest
                            .linkdocfolder(res['id'], this.courrierId)
                            .subscribe({
                                next: (res) => {
                                    this.clearForm();
                                    this.open(1);
                                    this.resp.emit('ok');
                                    this.isloading = false;
                                },
                                error: (err) => {
                                    this.isloading = false;
                                    console.error(
                                        'Error linking document to folder:',
                                        err
                                    );
                                },
                            });
                    } else {
                        console.error('Folder ID (courrierId) is missing!');
                        this.isloading = false;
                    }
                }
            },
            (err) => {
                this.isloading = false;
                if (err.status == 409) {
                    this.openModale(
                        this._translocoService.translate(
                            'ajoutercourrier.error'
                        ),
                        this._translocoService.translate(
                            'ajoutercourrier.noAccess'
                        ),
                        -1
                    );
                }
            }
        );
    }

    clearForm() {
        this.changeType(this.tp);
        // $("#chck").prop("checked", false);
        this.added = 0;
        this.selectedFile = undefined;
        this.isLoading = true;
        this.ShowCroper = false;
        this.isFileAdded = false;
        setTimeout(() => {
        //   this.uri = this.sanitizer.bypassSecurityTrustResourceUrl('assets/ViewerJS/index.html');
          sessionStorage.setItem('vfileName', "");
          this.isLoading = false;
        }, 200);
        this.finished = true;
    }

    openModale(title: string, txt: string, et: any) {
        const dialogRef = this.dialog.open(ResultComponent, {
            data: { title, text: txt, etat: et },
            disableClose: true,
            panelClass: 'custom-dialog-container',
        });
    }

    close(): void {
        this.closedialog.close();
    }
}
