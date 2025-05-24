import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { MaterialModuleModule } from 'shared/material-module/material-module.module';
import { ConfigService } from 'app/components/services/config.service';
import { RestDataApiService } from 'app/components/services/rest-data-api.service';
import { WsService } from 'app/components/sockets/ws.service';
import { AbstractControl, FormArray, FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'environments/environment.development';
import { WarningInfoComponent } from 'app/components/dialogs/warning-info/warning-info.component';
import { MatDialog } from '@angular/material/dialog';
import { ResultComponent } from 'app/components/dialogs/result/result.component';
import { AddSuccessDialogComponent } from 'app/components/dialogs/add-success-dialog/add-success-dialog.component';
import { DataSharingService } from 'app/components/services/data-sharing.service';
import { CourrierLinkDialogComponent } from 'app/components/dialogs/courrier-link-dialog/courrier-link-dialog.component';
import { ConvertToPdfComponent } from 'app/components/dialogs/convert-to-pdf/convert-to-pdf.component';
import { ScanDialogComponent } from 'app/components/dialogs/scan-dialog/scan-dialog.component';
import { FileModel } from 'app/components/models/file.model';
import { Attributes } from 'app/components/models/attrributes.model';
import { Document } from 'app/components/models/document.model';
import { TranslocoModule, TranslocoService } from '@ngneat/transloco';
import { EditorTextDialogComponent } from 'app/components/dialogs/editor-text-dialog/editor-text-dialog.component';


let myFrame;
let self


const env = environment
function dateValidator(control: AbstractControl) {

  let date = new Date();
  if (env.maxDate != "today") {
    date = new Date(env.maxDate);
  }

  if (control.value.trim() != "") {


    if (new Date(control.value.trim()) <= date) {

      return {}
    }
  }
  return {
    dateValid: true
  };
}
function dragElement(elmnt) {
  var pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
  if (myFrame.getElementById(elmnt.id + "header")) {
    // if present, the header is where you move the DIV from:
    myFrame.getElementById(elmnt.id + "header").onmousedown = dragMouseDown;
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
    elmnt.style.top = (elmnt.offsetTop - pos2) + "px";
    elmnt.style.left = (elmnt.offsetLeft - pos1) + "px";


  }

  function closeDragElement() {
    // stop moving when mouse button is released:
    myFrame.onmouseup = null;
    myFrame.onmousemove = null;
  }
}
@Component({
  selector: 'app-ajouter-bulk-document',
  standalone: true,
  imports: [CommonModule,MaterialModuleModule,FormsModule,ReactiveFormsModule,TranslocoModule],
  templateUrl: './ajouter-bulk-document.component.html',
  styleUrl: './ajouter-bulk-document.component.scss'
})
export class AjouterBulkDocumentComponent implements OnInit{
    htmlCont: any;
    isLoading = false;
    base64Content: SafeResourceUrl | null = null; // Use SafeResourceUrl type
    uri: SafeResourceUrl;
    isFileAdded: boolean = false;
    currentType;
    isFileAddOption = true;
    codeBarImg: any;
    autoRefTemplate: string;
    isChecked = false; // Track the checkbox's checked state
    @Input() lot;
    @Input() docToPush
    @Input() qualifiedGroups;
    @Input() isLast;
    @Input() cuurrentGrIndex = 0;
    @Input() nexColor;
    @Output() validateGrIndex = new EventEmitter();
    content: any;
    typeLabel: any;

    fileModel = new FileModel();
    attributesForm = new FormArray([]);
    doctypes;
    convertPDF: boolean = false;
    codeBar: boolean = false;
    URL_POS_PARAM = `/44?x=0&y=0&h=0&w=0`;
    t
    tp;
    listAttrsValues = []
    isAutoRefActive = false;
    hasAttrs = "";
    depArrays = []
    mappedArray = []
    Hideattribute: Array<any>;
    pdfUrl = ''
    objUrl: string;
    isGenerated = false
    maxUpload = environment.maxUpload;
    fullText = "";
    env = environment
    attributes: Attributes[];
    documentModel: any = new Document();
    docFormGroup: FormGroup;
    base64file: string;
    existRef = false;
    // validators
    isLoaded = false;
    fileValidator = '';
    selectedFile: any;
    err;
    added;
    today


    constructor(
      public config: ConfigService,
      private rest: RestDataApiService,
      private ws: WsService,
      private fb: FormBuilder,
      private dialog: MatDialog,
      private route: Router,
      private share: DataSharingService,
      private httpClient: HttpClient,
      private sanitizer: DomSanitizer,
      private translocoService: TranslocoService,
    ) {
    //   this.uri = this.sanitizer.bypassSecurityTrustResourceUrl(this.qualifiedGroups[0].file?.name);
      sessionStorage.setItem('vfileName', "");

    }
    ngAfterViewInit(): void {
      myFrame = document.getElementById("viewerframe");
      this.loadGrForm();
    //   this.uri = this.qualifiedGroups[0].file?.name;
      console.log("qualifiedGroups ", this.qualifiedGroups);

    }


    loadGrPdf() {
        const blob = this.qualifiedGroups[this.cuurrentGrIndex].file;
        console.log('BLOb',blob);
        const type = blob.type || 'application/pdf'
        const FILENAME = blob.name || `lot${(new Date()).getTime()}_${this.cuurrentGrIndex}.pdf`
        const _file = new File([this.qualifiedGroups[this.cuurrentGrIndex].file], FILENAME, { type: type, lastModified: Date.now() });
        const event = { "target": { "files": [_file] } };
        console.log("-FILE",_file)
        this.fileChangeEvent(event);
      }

      loadGrForm() {
        this.changeType(this.qualifiedGroups[this.cuurrentGrIndex].groupType, 0)
        setTimeout(() => {
          this.loadGrPdf();
        }, 500);
      }


    fileAddOptionChange(e) {
      this.isFileAddOption = !this.isFileAddOption
      if (!this.isFileAddOption) {
        this.isGenerated = false;
        this.htmlCont = '';
      }
    }

    get attrsForms() {
      return (this.docFormGroup.get('attrs') as FormArray);
    }


    ngOnInit(): void {
      var now = new Date();
      var month: any = now.getMonth() + 1;
      var day: any = now.getDate();
      if (month < 10) month = '0' + month;
      if (day < 10) day = '0' + day;
      this.today = now.getFullYear() + '-' + month + '-' + day;

    //   $("#chck").prop("checked", false);
      this.added = 0
      this.setUpForm();
      this.getDocsTypes();
      this.isAutoRefActive = false;

      this.httpClient.get("assets/attribute.json").subscribe((data: any) => {
        // console.log(data);
        this.Hideattribute = data;
      })

    }


    // Form :
    setUpForm() {
        const tppp = this.qualifiedGroups[this.cuurrentGrIndex].groupType;
        this.docFormGroup = this.fb.group({
          type: [tppp, Validators.required],
          fileName: ['', ''],
          attrs: this.fb.array([])// []
        });
      }


// Add Attributes :
    addAttr(id: number, type: string, name: string, required: number, visible: number) {
        let val = '';
        this.lot.cv.forEach(v => {
          if (v.name == name) {
            val = v.value
          }
        })
        let _attr
        if (type == "fichier") {
          _attr = {
            id,
            type,
            name,
            val: ['none', required == 1 && visible == 1 ? Validators.required : Validators.maxLength(300)],

          }
        } else if (type != "date") {
          if (this.docToPush[this.cuurrentGrIndex].isValid)
            val = this.docToPush[this.cuurrentGrIndex].document.attrs.filter(attribute => attribute.name == name)[0].val

          _attr = {
            id,
            type,
            name,
            val: [val, [required == 1 && visible == 1 ? Validators.required : Validators.maxLength(300)]],

          }
        } else {
          if (this.docToPush[this.cuurrentGrIndex].isValid)
            val = this.docToPush[this.cuurrentGrIndex].document.attrs.filter(attribute => attribute.name == name)[0].val

          _attr = {
            id,
            type,
            name,
            val: [val, [(required == 1 && visible == 1) ? dateValidator : Validators.maxLength(300)]],

          }


        }

        const attr = this.fb.group(_attr);
        //  [ required == 1 ? Validators.required : null
        //   ,type=='text'?Validators.maxLength(30):null]
        this.attrsForms.push(attr);
        console.log('attrsForms',this.attrsForms)

      }


    // Editor :
    editor() {
        const editorRef = this.dialog.open(EditorTextDialogComponent, {
          data: {  }
        });

        editorRef.componentInstance.save.subscribe((res: any) => {
          if (res) {
            this.isGenerated = true;
            const event = { "target": { "files": [res.file] } };
            this.htmlCont = res.content;

            // Call the method that handles file change event
            this.fileChangeEvent(event);

            // Update the form control with the file name
            this.docFormGroup.get('attrs')['controls'][
              this.docFormGroup.get('attrs')['controls'].length - 1
            ].controls.val.setValue(this.fileModel.fileName);

            editorRef.close(); // Close the dialog after saving
          }
        });
      }


    //   Get Doc Types :
    getDocsTypes() {
        if (this.lot && this.lot.gt) {
            this.doctypes = this.lot.gt;
        } else {
            console.warn('lot or lot.gt is not defined');
        }

    }



// Change Types :
changeType(e, mode = 0) {
    this.attrsForms.clear();
    if (mode == 1) { this.tp = e; }
    else {
      this.tp = e
    }
    this.doctypes.forEach(element => {
      if (this.tp == element.id) {
        this.currentType = element
        this.typeLabel = element.label
        //console.log(element)
      }
    });
    this.fileModel = new FileModel();
    this.isLoaded = false;
    this.attrsForms.clear();
    this.t = this.tp
    let aa: Attributes[];

    // this.srv.getTypeName(this.tp).subscribe(r=>{this.name=r["name"]})
    this.listAttrsValues = [];
    this.t = this.tp;

    this.rest.getDocTypesAttributes2(this.tp).subscribe(
      (res) => {

        this.isAutoRefActive = res.isConfigAutoNum
        this.hasAttrs = res.cattrs
        this.autoRefTemplate = res.autoVal

        aa = (res["attrs"]) as Attributes[];
        this.attributes = aa;

        this.Hideattribute.forEach(attrs => {
          this.attributes.forEach((attribute, index) => {
            if (attrs.name === attribute.name) {
              this.attributes.splice(index, 1);
            }
          })
        })

        let i = 0;
        const tempAttrs = new Array<Attributes>();
        for (const a in this.attributes) {
          if (this.attributes[i].type.name === 'fichier') {
            // this.docFormGroup.controls[i].patchValue({val : this.fileModel.fileName })
            tempAttrs.push(this.attributes[i]);
            this.attributes.splice(i, 1);
          }
          if (this.attributes[i]?.type.name === 'List' || this.attributes[i]?.type.name === 'listDb' || this.attributes[i]?.type.name === 'ListDep') {
            this.listAttrsValues[i] = this.parseJSON(this.attributes[i].defaultValue)

            this.depArrays['id' + this.attributes[i].id] = JSON.parse(this.attributes[i].defaultValue);
            this.mappedArray['id' + this.attributes[i].id] = JSON.parse(this.attributes[i].defaultValue);


          }
          i++;
        }
        setTimeout(() => {
          this.refreshAllLists()

        }, 100)
        tempAttrs.forEach(element => {
          this.attributes.push(element)

        });


        const fileTypes: Attributes[] = new Array<Attributes>();
        for (const item of Object.keys(aa)) {
          const eventItem = this.attributes[item];
          //console.log(this.attributes[item])
          if (eventItem.type.name !== 'fichier') {
            this.addAttr(eventItem.id, eventItem.type.name, eventItem.name, eventItem.required, eventItem.visib);
          }
          else {
            fileTypes.push(eventItem);

          }

        }
        for (const e of fileTypes) {
          this.addAttr(e.id, e.type.name, e.name, 1, 1);
        }
        this.isLoaded = true;


      },

      err => { console.warn(err.data); }
    );



  }



    get nextStyle() {
      return this.nexColor ? `background-color : ${this.nexColor};border-color:${this.nexColor};color:${this.isLast ? '#FFF' : '#343a40'}` : ''
    }


    goBack() {
      const env = environment
      this.route.navigateByUrl('/apps/dashboard');
    }




    // Sacanner :
    scan() {
        this.ws.newScan();
        // Open the dialog and type the componentInstance to ScanComponent
        const dialogRef = this.dialog.open(ScanDialogComponent, {
        //   width: '400px',
          disableClose: true,
        });
        const scanComponentInstance = dialogRef.componentInstance as ScanDialogComponent;
        // Subscribe to passEntry observable
        scanComponentInstance.passEntry.subscribe(file => {
          if (file) {
            const FILENAME = `scan${(new Date()).getTime()}.pdf`;
            const _file = new File([file.file], FILENAME, { type: 'application/pdf', lastModified: Date.now() });
            const event = { target: { files: [_file] } };
            this.fullText = file.text;
            this.fileChangeEvent(event);

            // Update the form control value
            this.docFormGroup.get('attrs')['controls'][this.docFormGroup.get('attrs')['controls'].length - 1].controls.val.setValue(this.fileModel.fileName);
          }

          // Close the dialog
          dialogRef.close();
        });
      }



    // //   Change Type File :
    fileChangeEvent(fileInput: any) {
        const file = fileInput.target.files[0];
        if (true) {
          this.selectedFile = file;
          if (file.type == 'image/tiff' || file.type == 'image/tif') {
            const dialogRef = this.dialog.open(ConvertToPdfComponent, {
              data: {
                fileName: file.name,
                fileType: file.type
              }
            });

            const reader = new FileReader();
            console.log("file.type",file.type)
            this.content = file.type;
            const self = this;
            reader.onload = () => {
              const base64String = reader.result as string;
              console.log("base64String",base64String)
              dialogRef.componentInstance.fileContent = base64String;
            };

            reader.readAsDataURL(file);
            dialogRef.componentInstance.pass.subscribe((res) => {
              if (res) {
                console.log("res",res)
                const _file = new File([res.file], res.fileName, {
                  type: res.file.type,
                  lastModified: Date.now(),
                });

                this.qualifiedGroups[this.cuurrentGrIndex].file = _file;

                dialogRef.close();
                const event = { target: { files: [_file] } };
                console.log("EEEEEVVVNNNNT",event)
                this.fileChangeEvent(event);
                console.log("res.fileName",res.fileName)
                this.uri = res.fileName;
                sessionStorage.setItem('vfileName', res.fileName);
              } else {
                dialogRef.close();

                this.fileModel.fileName = file.name.split('\\')[0];

                const reader = new FileReader();
                reader.onload = () => {
                  const supportedMimes = environment.supportedMimeTypes.split(' ');
                  const base64String = reader.result as string;
                  this.objUrl = URL.createObjectURL(file);

                  if (true) { // Keep the condition as needed
                    this.isLoading = true;
                    if (supportedMimes.indexOf(file.type) !== -1) {
                      this.uri = this.sanitizer.bypassSecurityTrustResourceUrl(this.objUrl);
                      sessionStorage.setItem('vfileName', file.name);
                      this.isFileAdded = true;
                    } else {
                      this.isFileAdded = false;
                      const warnRef = this.dialog.open(WarningInfoComponent, {
                        disableClose: true,
                        data: {
                            title: "Format non supporté",
                            message: "Le format du fichier choisi n'est pas supporté par la visionneuse",
                        }
                      });
                    }

                    setTimeout(() => {
                      myFrame = document.getElementById('viewerframe');
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
            });
          } else {
            console.log('fileModel',this.fileModel)
            this.fileModel.fileName = file.name.split('\\')[0];
            const reader = new FileReader();
            this.objUrl = URL.createObjectURL(file)

            const self = this;
            reader.onload = () => {
              const supportedMimes = environment.supportedMimeTypes.split(' ');
              let base64String = reader.result as string;

              this.pdfUrl = base64String
              if (true) {
                this.isLoading = true;
                if (supportedMimes.indexOf(file.type) !== -1) {
                  this.uri = this.sanitizer.bypassSecurityTrustResourceUrl(this.objUrl
                  );
                  sessionStorage.setItem('vfileName', file.name);
                  this.isFileAdded = true;
                } else {
                    this.isFileAdded = false;
                    const dialogRef = this.dialog.open(WarningInfoComponent, {
                      disableClose: true, // Equivalent to `backdrop: 'static'` and `keyboard: false`
                      width: '400px',     // You can adjust the width as needed
                      data: {
                        title: "Format non supporté",
                        message: "Le format du fichier choisi n'est pas supporté par la visionneuse",
                      },
                    });

                    dialogRef.afterClosed().subscribe(result => {
                      // Perform any actions if needed after the dialog is closed
                    });
                  }
                setTimeout(() => {
                  myFrame = document.getElementById('viewerframe');
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
          let fileIndex = 0
          this.attrsForms.value.forEach(element => {
            if (element.type == "fichier")
              (this.attrsForms as FormArray).at(fileIndex).patchValue({ val: file.name ?? "" });
            fileIndex++;
          });
        } else {
          this.fileValidator = "Vous avez depassé la taille maximale.";
          // const modalRef = this.modal.open(, { centered: true });
          this.openModale(
            "Error",
            this.fileValidator,
            -1
          );
        }
      }







      // Update form values with the selected file name
      private updateForm(fileName: string) {
        let fileIndex = 0;
        this.attrsForms.value.forEach(element => {
          if (element.type === "fichier") {
            (this.attrsForms as FormArray).at(fileIndex).patchValue({ val: fileName ?? "" });
          }
          fileIndex++;
        });
      }

    openModale(title, txt, et) {
        const dialogRef = this.dialog.open(ResultComponent, {
            disableClose: true, // Equivalent to `keyboard: false` and `centered: true`
            width: '400px',     // Adjust the width as needed
            data: {
              title: title,
              text: txt,
              etat: et,
            },
          });

          dialogRef.afterClosed().subscribe((res: string) => {
            console.log(res);
            if (res === 'link') {
              this.quickLink();
            }
          });

    }


    open(state: number) {
        const dialogRef = this.dialog.open(AddSuccessDialogComponent, {
            disableClose: true, // To make it non-closable by clicking outside
            data: {
              name: this.fileModel.fileName,
              object: 'La document',
              operation: this.config.c.documentAdd.addSucc,
              result: state === 1 ? 'succès' : 'échec',
              fromAdd: true,
            },
          });

          // Use afterClosed() to handle the dialog result when it's closed
          dialogRef.afterClosed().subscribe((res: string) => {
            if (res === 'link') {
              this.quickLink();
            }
          });
    }


    openFile() {
      this.ws.openFile(this.fileModel);
    }




    // On Submit :
    onSubmit() {

        console.log(this.docFormGroup);

        if (this.docFormGroup.invalid)
          return


        const fileName = this.documentModel.fileName;

        this.documentModel = this.docFormGroup.value;
        this.documentModel.isGenerated = this.isGenerated;
        //console.log(this.documentModel.fileName);
        if (this.isFileAddOption) {
          this.documentModel.fileName = fileName;
          this.documentModel.content = this.content


        }
        else {
          this.documentModel.fileName = "none";

        }
        //console.log(this.documentModel.fileName);
        this.documentModel.htmlContent = this.htmlCont;
        this.documentModel.fullText = this.fullText;
        this.documentModel['autoFolderEnable'] = true
        this.documentModel['content'] = "application/pdf"

        this.documentAddLocal(this.selectedFile, this.documentModel);

        return;
        this.rest.addDocument(this.documentModel).subscribe(res => {
          this.fileModel.fileId = res['id'];
          //console.log(res);
          this.open(1);


          this.ws.addDocument(this.fileModel);
        },
          err => {
            this.open(0);

          }

        );


      }

    // Quick Link :
    quickLink() {
      this.share.quickDocumentLink(this.idDoc, this.tp);
    }


    // Clear :
    clear() {
      this.changeType(this.tp)
      this.isChecked = false;
      this.added = 0
      this.selectedFile = undefined;
      this.isLoading = true;
      this.ShowCroper = false;
      this.isFileAdded = false;
      setTimeout(() => {
        this.uri = this.sanitizer.bypassSecurityTrustResourceUrl('assets/ViewerJS/index.html');
        sessionStorage.setItem('vfileName', "");
        this.isLoading = false;
      }, 200);

    }


    idDoc
    docLink: Array<Object>;


    documentAddLocal(file, document) {


      this.documentModel['content'] = file.type
      this.documentModel['fileName'] = file.name
      const formData: FormData = new FormData();

      formData.append('file', file);
      formData.append('img', this.codeBarImg);

      const headers: HttpHeaders = new HttpHeaders({
        // Authorization:  sessionStorage.getItem('auth'),
      });

      document.content = file.type


      this.docToPush[this.cuurrentGrIndex].formData = formData
      this.docToPush[this.cuurrentGrIndex].headers = headers
      this.docToPush[this.cuurrentGrIndex].document = document
      this.docToPush[this.cuurrentGrIndex].file = file
      this.docToPush[this.cuurrentGrIndex].apiUrl = environment.apiUrl
      this.docToPush[this.cuurrentGrIndex].convertPDF = this.convertPDF
      this.docToPush[this.cuurrentGrIndex].codeBar = this.codeBar
      this.docToPush[this.cuurrentGrIndex].URL_POS_PARAM = this.URL_POS_PARAM
      this.docToPush[this.cuurrentGrIndex].isValid = true;
      this.validateGrIndex.emit(this.cuurrentGrIndex)
      return true;


      this.rest.addDocument(document).subscribe(
        res => {
          if (this.isFileAddOption)
            this.httpClient.post(environment.apiUrl + '/documentfile/' + res['id'] + `/${this.convertPDF ? '1' : '0'}/${this.codeBar ? '1' : '0'}${this.URL_POS_PARAM}`, formData, { headers }).subscribe(resp => {
              this.docLink = new Array<Object>();
              this.docLink.push(new Object({
                key: 'id',
                value: res['id']
              }))
              this.docFormGroup.controls['attrs'].value.forEach(at => {
                this.docLink.push(new Object({
                  key: at.name,
                  value: at.val
                }))
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
                  width: '80vw', // Adjust width as needed
                  data: { docId: res['id'] } // Pass docId to the dialog
                });

                // Use afterClosed() to handle the result when the dialog closes
                dialogRef.afterClosed().subscribe((result: string) => {
                  if (result === 'yes') {
                    this.clear();
                    this.open(1);
                  }
                });
              }
            });

          else {
            this.clear();
            this.open(1);
          }

        },
        err => {
          // this.existRef = true;
          // const modalResult = this.modal.open(ResultComponent, { keyboard: false, centered: true, backdrop: "static" });
          // modalResult.componentInstance.title = this.config.c["docTypeList"]['titreErr']
          // modalResult.componentInstance.etat = -1;
          // modalResult.componentInstance.text = this.config.c["documentAdd"]['existRef']
          this.openModale(this.config.c["documentAdd"]["err"], this.config.c.documentAdd.existRef, -1)



        });
    }
    convertToPdf(e) {
      this.convertPDF = e.target.value;
    }
    codeBarToPdf(e) {
    //   let barCodeValue = "";

    //   if (this.selectedFile) {
    //     this.codeBar = e.target.value;

    //     if (this.codeBar = true) {
    //       const reader = new FileReader();
    //       reader.onload = (e) => {
    //         const posRef = this.modal.open(CodebarPositioningComponent, { centered: true, size: 'xl', windowClass: 'sign-popup', backdrop: 'static', keyboard: false });
    //         const documentModel: Document = this.docFormGroup.value;
    //         posRef.componentInstance.refval = documentModel.attrs[0].val
    //         posRef.componentInstance.pdfSrc = e.target.result as string;
    //         posRef.componentInstance.back.subscribe(r => {
    //           if (r == "done") {

    //             this.added = 1
    //           }
    //           else {
    //             $("#chck").prop("checked", false);

    //           }
    //         })
    //         let tempValue = ""
    //         tempValue = this.autoRefTemplate
    //         if (this.hasAttrs) {
    //           this.hasAttrs.split("|").forEach(attr => {
    //             this.docFormGroup.value.attrs.forEach(element => {
    //               if (attr == element.name)
    //                 this.hasAttrs = this.hasAttrs.replace(attr, element.val)
    //             });


    //           });
    //           tempValue = this.autoRefTemplate.replace("{}", this.hasAttrs)
    //         }
    //         const allowedChars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789 -.$/+%";
    //         let filterdBarCodeValue = "";
    //         barCodeValue = ""
    //         for (let k = 0; k < tempValue.length; k++) {
    //           let currentchar = tempValue.toUpperCase().charAt(k);
    //           if (allowedChars.indexOf(currentchar) === -1) {

    //             filterdBarCodeValue += "-";

    //           }
    //           else {

    //             filterdBarCodeValue += currentchar;
    //           }


    //         }

    //         barCodeValue = filterdBarCodeValue;
    //         posRef.componentInstance.cbval = barCodeValue
    //         posRef.componentInstance.passPositionParmChain.subscribe(pos => {
    //           this.URL_POS_PARAM = pos.pos as string;
    //           this.codeBarImg = pos.img


    //           const c = this.getPosition(this.URL_POS_PARAM);
    //           myFrame = this.vframe.nativeElement.contentWindow.document;
    //           let firstCanva = myFrame.getElementById("canvas1");
    //           let h = firstCanva.height;
    //           let offset = h / c.h;


    //           let ctx = firstCanva.getContext('2d');
    //           let url = URL.createObjectURL(pos.img);
    //           this.compressImage(url, offset).then((newImage: any) => {
    //             URL.revokeObjectURL(url);




    //             const nimg = new Image();

    //             nimg.onload = () => {


    //               ctx.drawImage(nimg, c.x * offset, c.y * offset)



    //             }
    //             const nextURl = URL.createObjectURL(newImage);
    //             nimg.src = nextURl;
    //           })

    //           posRef.dismiss();


    //         })

    //       }
    //       reader.readAsDataURL(this.selectedFile);
    //     }


    //   }

    }
    compressImage(src, offdset) {
      return new Promise((res, rej) => {
        const img = new Image();
        img.src = src;
        img.onload = () => {
          //console.log("enter ss")
          const elem = document.createElement('canvas');
          elem.width = img.width * offdset;
          elem.height = img.height * offdset;
          const ctx = elem.getContext('2d');
          ctx.drawImage(img, 0, 0, img.width * offdset, img.height * offdset);
          const data = ctx.canvas.toDataURL();


          const arr = data.split(','), mime = arr[0].match(/:(.*?);/)[1]
          let bstr = atob(arr[1])
          let n = bstr.length, u8arr = new Uint8Array(n)
          while (n--) {
            u8arr[n] = bstr.charCodeAt(n);
          }
          const file = new Blob([u8arr], { type: mime });
          res(file);
        }
        img.onerror = error => rej(error);
      })
    }
    getPosition(key): any {

      let elem = key.indexOf("?");
      let s = key.substring(elem + 1, key.length)
      return JSON.parse('{"' + decodeURI(s).replace(/"/g, '\\"').replace(/&/g, '","').replace(/=/g, '":"') + '"}');

    }
    @ViewChild("frame") vframe;
    curenntPage = 0;
    position = { x: 88, y: 39 };
    currentPos = { x: 0, y: 0 }
    currentAtt = "";
    ShowCroper = false;
    currentIndx = -1;
    currentLang = "fra"



    onDragBegin(e) {
    }
    onSelectLang(e) {

      this.currentLang = e.target.value;

    }



    selectAttr(attname, i) {
      if (this.ShowCroper)
        return

      if (!this.isFileAdded) {
        const dialogRef = this.dialog.open(WarningInfoComponent, {
          disableClose: true,
          data: {
            title: this.config.c.documentAdd.fileNotNotShowen.title,
            message: this.config.c.documentAdd.fileNotNotShowen.message
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



    recognizeAttr(attname, i, _as) {
      if (!this.ShowCroper)
        return
      this.currentAtt = attname;
      this.currentIndx = i
      if (this.ShowCroper) {

        // this.ocrField(_as).then(fin => {
        //   myFrame.getElementById("mydiv").remove();
        //   this.ShowCroper = false;

        // });
      }
    }



    createDragElement() {
      /*
      <div id="closeCropper"

      style="

      height:12px;
      width:12px;
      background:red;
      position:absolute;
      top: 0;
      right:0;
      cursor: pointer;



      "></div>

      */
      let dragDiv = this.vframe.nativeElement.contentWindow.document.createElement('div')
      dragDiv.style = " position: absolute; z-index: 99;border: 2px solid #ffc107;text-align: center;height:50px;width:200px;resize: both;overflow: auto;"
      dragDiv.id = "mydiv"
      dragDiv.padding = "0";
      // let closeDiv = this.vframe.nativeElement.contentWindow.document.createElement('div')
      // closeDiv.id = "closeCropper"
      // closeDiv.style.height = "12px"
      // closeDiv.style.width = "12px"
      // closeDiv.style.background = "red"
      // closeDiv.style.top = 0
      // closeDiv.style.right = 0
      // closeDiv.style.cursor = "pionter"
      // closeDiv.style.position = "absolute"
      // closeDiv.addEventListener("click", this.CloseCropper)
      // dragDiv.appendChild(closeDiv)
      let DragDiv = this.vframe.nativeElement.contentWindow.document.createElement('div')
      DragDiv.style = " cursor: move; z-index: 100;height:92%;width:92%;margin:1px"
      DragDiv.id = "mydivheader"



      dragDiv.appendChild(DragDiv)
      return dragDiv;
    }
    self = this
    CloseCropper() {
      myFrame.getElementById("mydiv").remove();
      self.ShowCroper = false;
    }

    parseJSON(str) {
      return JSON.parse(str);
    }

    refreshAllLists() {

      let i = 0;

      for (const a in this.attributes) {

        if (this.attributes[i].type.name == 'listDb' || this.attributes[i].type.name == 'ListDep' || this.attributes[i].type.name == 'List') {

          this.changeValue2(this.attributes[i])

        }
        i++;
      }
    }

    changeValue2(att) {
      const attrId = att.id
      const [val] = this.lot.cv.filter(attribute => attribute.id == attrId)
      this.changeValue(val.value, att);
    }

    attrVals = {}
    changeValue($e: any, attr: any) {

      let e
      if ($e.key)
        e = $e.key;
      else
        e = $e

      let idx = 0
      this.attrVals["l" + attr.name] = this.mappedArray['id' + attr.id].filter((_e) => {
        return e === _e.key
      })[0].value;
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
          (this.attrsForms as FormArray).at(idx).patchValue({ val: array[0]?.key ?? "" });
          this.changeValue(array[0]?.key, element)
        }
        idx++;
      });
    }
}
