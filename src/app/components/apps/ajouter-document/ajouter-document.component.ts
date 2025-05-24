import { ChangeDetectorRef, Component,OnInit, ElementRef, EventEmitter, Inject, Input, NgZone, Output, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialModuleModule } from 'shared/material-module/material-module.module';
import { PdfViewerModule } from 'ng2-pdf-viewer';
import { FormArray, FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { TranslocoService ,TranslocoModule} from '@ngneat/transloco';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { WarningInfoComponent } from 'app/components/dialogs/warning-info/warning-info.component';
import { MAT_DIALOG_DATA, MatDialog, MatDialogConfig, MatDialogRef } from '@angular/material/dialog';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { WsService } from 'app/components/sockets/ws.service';
import { RestDataApiService } from 'app/components/services/rest-data-api.service';
import { ToastrService } from 'ngx-toastr';
import { ConfigService } from 'app/components/services/config.service';
import { EditListDocService } from 'app/components/services/edit-list-doc.service';
import { environment } from 'environments/environment.development';
import { ResultComponent } from 'app/components/dialogs/result/result.component';
import { AddSuccessDialogComponent } from 'app/components/dialogs/add-success-dialog/add-success-dialog.component';
import { ConvertToPdfComponent } from 'app/components/dialogs/convert-to-pdf/convert-to-pdf.component';
import { ScanDialogComponent } from 'app/components/dialogs/scan-dialog/scan-dialog.component';
import { FileModel } from 'app/components/models/file.model';
import { Attributes } from 'app/components/models/attrributes.model';
import { Document } from 'app/components/models/document.model';
import { CodebarPositioningDialogComponent } from 'app/components/dialogs/codebar-positioning-dialog/codebar-positioning-dialog.component';
import { CourrierLinkDialogComponent } from 'app/components/dialogs/courrier-link-dialog/courrier-link-dialog.component';
import { createWorker, PSM } from 'tesseract.js';
import { EditorTextDialogComponent } from 'app/components/dialogs/editor-text-dialog/editor-text-dialog.component';


let myFrame;



  let self;

function dragElement(elmnt) {
  var pos1 = 0,
    pos2 = 0,
    pos3 = 0,
    pos4 = 0;
  if (myFrame.getElementById(elmnt.id + 'header')) {
    // if present, the header is where you move the DIV from:
    myFrame.getElementById(elmnt.id + 'header').onmousedown = dragMouseDown;
  } else {
    // otherwise, move the DIV from anywhere inside the DIV:
    elmnt.onmousedown = dragMouseDown;
  }

  function dragMouseDown(e) {
    e = e || window.event;
    e.preventDefault();
    // get the mouse cursor position at startup:
    pos3 = e.clientX;
    pos4 = e.clientY;
    myFrame.onmouseup = closeDragElement;
    // call a function whenever the cursor moves:
    myFrame.onmousemove = elementDrag;
  }

  function elementDrag(e) {
    e = e || window.event;
    e.preventDefault();
    // calculate the new cursor position:
    pos1 = pos3 - e.clientX;
    pos2 = pos4 - e.clientY;
    pos3 = e.clientX;
    pos4 = e.clientY;
    // set the element's new position:
    elmnt.style.top = elmnt.offsetTop - pos2 + 'px';
    elmnt.style.left = elmnt.offsetLeft - pos1 + 'px';
  }

  function closeDragElement() {
    myFrame.onmouseup = null;
    myFrame.onmousemove = null;
  }
}

@Component({
  selector: 'app-ajouter-document',
  standalone: true,
  imports: [
    CommonModule,
    TranslocoModule,
    MaterialModuleModule,
    PdfViewerModule,
    FormsModule,
    ReactiveFormsModule
 ],
  templateUrl: './ajouter-document.component.html',
  styleUrl: './ajouter-document.component.scss'
})
export class AjouterDocumentComponent implements OnInit{
    @ViewChild('chck') chck!: ElementRef<HTMLInputElement>;
    @Output() resp: EventEmitter<any> = new EventEmitter();
    docFormGroup: FormGroup;
    currentType;
    t;
    tp;
    listFolders: Array<string>;
    attributes: Attributes[];
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
    base64Content: SafeResourceUrl | null = null; // Use SafeResourceUrl type
    content;
    hasFooter = false;
    hasHeader = false;
    hideDocCodeBar = environment.hideDocCodeBar;
    hideRefAuto = environment.hideRefAuto;
    maxUpload = environment.maxUpload;
    hideCodeBarByGroupElement = environment.hideCodeBarByGroupElement
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
        private ngZone: NgZone
    ) {
        this.uri = this.sanitizer.bypassSecurityTrustResourceUrl('assets/ViewerJS/index.html');
          sessionStorage.setItem('vfileName', '');
    }

    ngAfterViewInit(): void {
        myFrame = document.getElementById('viewerframe');
      }

    ngDoCheck(): void { }

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

        // if (this.f.autoRef != null) {
        //     this.autoref = this.f.autoRef
        //   }

        //   $("#chck").prop("checked", false);
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
        //   console.log(this.attributes)
    }

    getLabel(attribute: any, lang: string): string {
     return attribute['libelle' + lang] || attribute.libelle;
     }

    // Change Value :
    changeValue(e: any, attr: any) {
        let idx = 0
        this.attrVals["l" + attr.name] = this.mappedArray['id' + attr.id].filter((_e) => {
          return e === _e.key
        })[0]?.value;
        this.attributes.forEach((element) => {
          if (element.type.name == 'ListDep' && element.listDep == attr.id) {
            // @ts-ignore
            let array = new Array<any>()
            // @ts-ignore
            this.mappedArray['id' + element.id].forEach(element1 => {

              if (element1.fk == e) {
                array.push(element1)
              }
            });

            // @ts-ignore
            for (let index = 0; index < this.mappedArray['id' + element.id]; index++) {
            }
            // @ts-ignore

            this.depArrays['id' + element.id] = array

            // console.log(array[0], idx);
            (this.attrsForms as FormArray).at(idx).patchValue({ val: array[0]?.key ?? "" });
            this.changeValue(array[0]?.key, element)
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
            const all = {
                documentTypes: [],
                goupId: 0,
                groupLabel: this._translocoService.translate('ajoutercourrier.aucungroupe'),
                groupDesc: '',
                groupName: '',
                isAutoNum: null,
                seq: 0,
                standard: false,
            };
            this.groupDoc = res;
            this.groupDoc.unshift(all);
            // console.log(this.groupDoc);
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

        this.docFormGroup.controls["type"].setValue("")
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


    // Scanner :
    scan() {
        this.ws.newScan();
        const dialogRef = this.dialog.open(ScanDialogComponent, {
          disableClose: true,
          data: {},
        });
        // Listen for the `passEntry` event emitted by the dialog component
        dialogRef.componentInstance.passEntry.subscribe((file) => {
        //   console.log(file);
          if (file) {
            const FILENAME = `scan${new Date().getTime()}.pdf`;
            const _file = new File([file.file], FILENAME, {
              type: 'application/pdf',
              lastModified: Date.now(),
            });
            const event = { target: { files: [_file] } };
            this.fullText = file.text;
            this.fileChangeEvent(event);
            this.docFormGroup.get('attrs')['controls'][this.docFormGroup.get('attrs')['controls'].length - 1
            ].controls.val.setValue(this.fileModel['fileName']);
          }
          // Close the dialog
          dialogRef.close();
        });
      }


    // Editor Text :
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
          const attrsControls = this.docFormGroup.get('attrs')['controls'];
          console.log("this.fileModel.fileName",this.fileModel.fileName)
          attrsControls[attrsControls.length - 1].controls.val.setValue(this.fileModel.fileName);
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
            this.docFormGroup.get('attrs')['controls'][this.docFormGroup.get('attrs')['controls'].length - 1].controls.val.setValue(this.fileModel.fileName);
        }
    }

    // From :
    setUpForm() {
        this.docFormGroup = this.fb.group({
            type: ['', Validators.required],
            GroupDoc: [0],
            fileName: [''],
            attrs: this.fb.array([]),
        });
    }

    // Add Attrs :
    get attrsForms() {
        return this.docFormGroup.get('attrs') as FormArray;

    }

    // Change Type :
    changeType(e, mode = 0) {
        this.attrsForms.clear();
        if (mode == 1) {
          this.tp = e.target.value;
        } else {
          this.tp = e;
        }
        this.doctypes.forEach((element) => {

          if (this.tp == element['id']) {
            this.currentType = element['id'];
            //console.log(element)
          }
        });
        this.fileModel = new FileModel();
        this.isLoaded = false;
        this.attrsForms.clear();
        this.t = this.tp;
        let aa: Attributes[];
        this.t = this.tp;
        // console.log("TTTP",this.tp)
        this.rest.getDocTypesAttributes(this.tp).subscribe(
          (res: Attributes[]) => {
            // console.log('res',res);
            aa = res as Attributes[];
            this.attributes = aa;
            let i = 0;
            const tempAttrs = new Array<Attributes>();
            for (const a in this.attributes) {
              if (this.attributes[i].type.name === 'fichier') {
                tempAttrs.push(this.attributes[i]);
                this.attributes.splice(i, 1);
              }
              if (this.attributes[i])
                if (this.attributes[i].type.name === 'List' || this.attributes[i].type.name === 'ListDep' || this.attributes[i].type.name === 'listDb') {
                  this.listAttrsValues[i] = this.parseJSON(this.attributes[i].defaultValue)
                  this.depArrays['id' + this.attributes[i].id] = JSON.parse(this.attributes[i].defaultValue);
                  this.mappedArray['id' + this.attributes[i].id] = JSON.parse(this.attributes[i].defaultValue);


              }
              i++;
            }
            tempAttrs.forEach((element) => {
              this.attributes.push(element);
            });

            const fileTypes: Attributes[] = new Array<Attributes>();
            for (const item of Object.keys(aa)) {
              const eventItem = this.attributes[item];
            //   console.log('eventItem',eventItem)
              if (eventItem.type.name !== 'fichier'  ) {
            //   console.log('attributes',this.attributes[item])
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
              this.addAttr(e.id, e.type.name, e.name, 0, 1);
            }
            this.isLoaded = true;

          },

          (err) => {
            console.warn(err.data);
          }
        );
      }



    // Add Attrabute :
    addAttr(
        id: number,
        type: string,
        name: string,
        required: number,
        visible: number
      ) {
       const attr = this.fb.group({
          id,
          type,
          name,
         val: [name != 'fichier' ? '' : 'none', required == 1 && visible == 1 ? [Validators.required, Validators.minLength(this.config.min), Validators.maxLength(this.config.max)] : ''],
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


    // Code Bar To Pdf :
    codeBarToPdf(e: any): void {
        let barCodeValue = '';
        if (this.selectedFile) {
          this.codeBar = e.target.value;
          if (this.codeBar) {
            const reader = new FileReader();
            reader.onload = (event: any) => {
              const dialogRef = this.dialog.open(CodebarPositioningDialogComponent, {
                disableClose: true,
                panelClass: 'sign-popup',
                data: {
                  pdfSrc: event.target.result as string,
                  refval: this.docFormGroup.value.attrs[0].val,
                },
              });

              dialogRef.afterClosed().subscribe((result) => {
                if (result === 'done') {
                  this.added = 1;
                } if (this.chck) {
                    this.chck.nativeElement.checked = false;
                  }
              });

              const allowedChars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ123456789 -.$/+%';
              let filteredBarCodeValue = '';
              barCodeValue = 'changeit';

              for (let k = 0; k < barCodeValue.length; k++) {
                const currentChar = barCodeValue.toUpperCase().charAt(k);
                if (allowedChars.indexOf(currentChar) === -1) {
                  filteredBarCodeValue += '-';
                } else {
                  filteredBarCodeValue += currentChar;
                }
              }

              barCodeValue = filteredBarCodeValue;

              const componentInstance = dialogRef.componentInstance;
              componentInstance.cbval = 'changeit';
              componentInstance.passPositionParmChain.subscribe((pos: any) => {
                this.URL_POS_PARAM = pos.pos as string;
                this.codeBarImg = pos.img;
                dialogRef.close();
              });
            };

            reader.readAsDataURL(this.selectedFile);
          }
        }
      }



    // On Submit :
    onSubmit() {
        this.isloading = true;
        const fileName = this.documentModel;
        this.documentModel = this.docFormGroup.value;
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

    // Ajouter Dialog Width Success :
    open(state: number): void {
        const dialogRef = this.dialog.open(AddSuccessDialogComponent, {
          disableClose: true, // Prevent closing with escape or backdrop click
          data: {
            name: this.fileModel.fileName,
            object: 'Le document',
            operation: this._translocoService.translate('ajoutercourrier.ajoutersuccess'),
            result: state === 1 ? 'succès' : 'échec'
          }
        });

        // Optional: handle after dialog close
        dialogRef.afterClosed().subscribe((result) => {
          if (result) {
            // console.log('Dialog closed with result:', result);
          }
        });
      }

    codeBarImg;
    idDoc;
    docLink: Array<Object>;
    // Add Document Local :
    documentAddLocal(file, document) {
      const formData: FormData = new FormData();
      formData.append('file', file);
      formData.append('img', this.codeBarImg);
      const headers: HttpHeaders = new HttpHeaders({
        Authorization:  sessionStorage.getItem('auth'),
      });


      this.rest.addDocument(document).subscribe((res) => {
          if (this.isFileAddOption){
            const url = `${environment.apiUrl}/documentfile/${res['id']}/${this.convertPDF ? '1' : '0'}/${this.codeBar ? '1' : '0'}${this.URL_POS_PARAM}`;
            this.httpClient.post(url,formData, { headers: headers })
              .subscribe((resp) => {
                console.log('File uploaded successfully', resp);
                this.isloading=false
                this.docLink = new Array<Object>();
                this.docLink.push(
                  new Object({
                    key: 'id',
                    value: res['id'],
                  })
                );
                this.docFormGroup.controls['attrs'].value.forEach((at) => {
                  this.docLink.push(
                    new Object({
                      key: at.name,
                      value: at.val,
                    })
                  );
                });

                if (this.currentType.name != 'Accusé de réception') {
                  this.idDoc = res['id'];
                  this.fileModel.fileId = res['id'];
                  this.existRef = false;
                  this.clear();

                  this.open(1);
                }
                else {
                    const dialogRef = this.dialog.open(CourrierLinkDialogComponent, {
                        disableClose: true,
                        data: { docId: res['id'] },
                      });

                      // Handle the dialog result
                      dialogRef.componentInstance.docId = res['id'];
                      dialogRef.componentInstance.back.subscribe((result) => {
                        if (result === 'yes') {
                          this.clear();
                          this.open(1);
                        }
                      });

                }

              },(err)=>{

                this.isloading=false
              });}
          else {
            this.isloading=false
            this.clear();
            this.open(1);
          }
        },
        (err) => {
          this.isloading=false
          if(err.status==409)
          {
            this.openModale(
              "Erreur",
              "Type d'élément inaccessible",
              -1
            );
          }

        }
      );
    }

    clear() {
        window.URL.revokeObjectURL(this.objUrl);
        this.changeType(this.tp);
        // $('#chck').prop('checked', false);
        this.added = 0;
        this.selectedFile = undefined;
        this.isLoading = true;
        this.ShowCroper = false;
        this.isFileAdded = false;
        setTimeout(() => {
          this.uri = this.sanitizer.bypassSecurityTrustResourceUrl(
            'assets/ViewerJS/index.html'
          );
          sessionStorage.setItem('vfileName', '');
          this.isLoading = false;
        }, 200);
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
          this.uri = this.sanitizer.bypassSecurityTrustResourceUrl('assets/ViewerJS/index.html');
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
            //   this.form.get('attrs')["controls"][this.currentIndx].controls.val.setValue(_value);
            this.docFormGroup.get('attrs')['controls'][this.currentIndx].controls.val.setValue(_value);

        } catch (error) {
            console.error('OCR Error:', error);
          } finally {
            this.isOcrLoading = false;
            await (await worker).terminate();
          }

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

        myFrame.getElementById('mydiv').remove();
        console.log(this.ShowCroper)

      }



}
