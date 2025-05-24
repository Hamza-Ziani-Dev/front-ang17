import {
    Component,
    ViewChild,
    ElementRef,
    EventEmitter,
    Output,
    Input,
} from '@angular/core';
import {
    AngularEditorComponent,
    AngularEditorConfig,
} from '@kolkov/angular-editor';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SafeHtml } from '@angular/platform-browser';
import { ToastrService } from 'ngx-toastr';
import { MatDialog } from '@angular/material/dialog';
import { DomSanitizer } from '@angular/platform-browser';
import { ConfigService } from 'app/components/services/config.service';
import { TexteditorService } from 'app/components/services/texteditor.service';
import { EditorBindingService } from 'app/components/services/editor-binding.service';
import { MaterialModuleModule } from 'shared/material-module/material-module.module';
import { HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { DocHeaderFooterService } from 'app/components/services/doc-header-footer.service';
import { environment } from 'environments/environment.development';
import { QuillDeltaToHtmlConverter } from 'quill-delta-to-html';
import QuillBetterTable from 'quill-better-table';
// import { QuillModule } from 'ngx-quill';
import Quill from 'quill';
import { LoadModelDialogComponent } from '../load-model-dialog/load-model-dialog.component';
import { SaveModelDialogComponent } from '../save-model-dialog/save-model-dialog.component';
import { CloseConfirmationDialogComponent } from '../close-confirmation-dialog/close-confirmation-dialog.component';
import { NonConnectionComponent } from '../non-connection/non-connection.component';
import { QuillModule } from 'ngx-quill';

import {
    SpeechRecognitionLang,
    SpeechRecognitionMaxAlternatives,
    SpeechRecognitionService,
} from '@kamiazya/ngx-speech-recognition';
import { TranslocoModule, TranslocoService } from '@ngneat/transloco';

let toggleMic;
let self;
const Delta = Quill.import('delta');
Quill.register(
    {
        'modules/better-table': QuillBetterTable,
    },
    true
);

function registerCustomActions() {
    document
        .getElementById('documaniaFooterContainer')
        .addEventListener('click', (e) => {
            document.getElementById('footerActions').toggleAttribute('hidden');
        });

    document
        .getElementById('documaniaHeaderContainer')
        .addEventListener('click', (e) => {
            document.getElementById('headerActions').toggleAttribute('hidden');
        });

    document.querySelector(
        '.ql-toolbar .ql-formats button.ql-mic'
    ).innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" version="1.1" id="Capa_1" x="0px" y="0px" viewBox="0 0 435.2 435.2" style="enable-background:new 0 0 435.2 435.2;" xml:space="preserve">
  <g>
    <g>
      <path d="M356.864,224.768c0-8.704-6.656-15.36-15.36-15.36s-15.36,6.656-15.36,15.36c0,59.904-48.64,108.544-108.544,108.544    c-59.904,0-108.544-48.64-108.544-108.544c0-8.704-6.656-15.36-15.36-15.36c-8.704,0-15.36,6.656-15.36,15.36    c0,71.168,53.248,131.072,123.904,138.752v40.96h-55.808c-8.704,0-15.36,6.656-15.36,15.36s6.656,15.36,15.36,15.36h142.336    c8.704,0,15.36-6.656,15.36-15.36s-6.656-15.36-15.36-15.36H232.96v-40.96C303.616,355.84,356.864,295.936,356.864,224.768z"/>
    </g>
  </g>
  <g>
    <g>
      <path d="M217.6,0c-47.104,0-85.504,38.4-85.504,85.504v138.752c0,47.616,38.4,85.504,85.504,86.016    c47.104,0,85.504-38.4,85.504-85.504V85.504C303.104,38.4,264.704,0,217.6,0z"/>
    </g>
  </g>
  <g>
  </g>
  <g>
  </g>
  <g>
  </g>
  <g>
  </g>
  <g>
  </g>
  </svg>`;
    document
        .querySelector('.ql-toolbar .ql-formats button.ql-mic')
        .addEventListener('click', (e) => {
            toggleMic();
        });
}
@Component({
    selector: 'app-editor-text-dialog',
    standalone: true,
    imports: [
        CommonModule,
        TranslocoModule,
        FormsModule,
        ReactiveFormsModule,
        MaterialModuleModule,
        HttpClientModule,
        QuillModule,
    ],
    templateUrl: './editor-text-dialog.component.html',
    styleUrls: ['./editor-text-dialog.component.scss'],
    // providers: [
    //     {
    //       provide: SpeechRecognitionLang,
    //       useValue: 'fr-FR',
    //     },
    //     {
    //       provide: SpeechRecognitionMaxAlternatives,
    //       useValue: 1,
    //     }
    //     ,

    //     SpeechRecognitionService,
    //   ]
})
export class EditorTextDialogComponent {
    currentDelta = 0;
    headerhtml;
    footerhtml;
    bodyhtml;
    currentPage = 1;
    tempPage;
    loading = false;
    quillEditor: any;
    modules = {
        table: false,
        'better-table': {
            operationMenu: {
                items: {
                    unmergeCells: {
                        text: 'Another unmerge cells name',
                    },
                },
                color: {
                    colors: ['green', 'red', 'yellow', 'blue', 'white'],
                    text: 'Background Colors:',
                },
            },
        },
        toolbar: [
            ['bold', 'italic', 'underline', 'strike'], // toggled buttons
            ['blockquote'],

            [{ header: 1 }, { header: 2 }], // custom button values
            // [{ 'list': 'ordered' }, { 'list': 'bullet' }],
            [{ script: 'sub' }, { script: 'super' }], // superscript/subscript
            [{ indent: '-1' }, { indent: '+1' }], // outdent/indent
            [{ direction: 'rtl' }], // text direction

            [{ size: ['small', false, 'large', 'huge'] }], // custom dropdown
            [{ header: [1, 2, 3, 4, 5, 6, false] }],

            [{ color: [] }, { background: [] }], // dropdown with defaults from theme
            [{ font: [] }],
            [{ align: [] }],

            ['clean'], // remove formatting button

            ['link', 'image'],
            ['mic'], // link and image, video
        ],
        keyboard: {
            bindings: QuillBetterTable.keyboardBindings,
        },
    };

    @Output() save = new EventEmitter<any>();
    @Output() closeEv = new EventEmitter<any>();
    isLisetning = false;
    htmlContent = '';
    safehtml: SafeHtml = '';
    comma = '';
    dot = '';
    self = this;
    message;
    btnTXT = 'Reconnaissance vocale activé';
    lastLenght = 0;
    lastParaghraph;
    fileName = '';
    timeStop = { last: new Date().getTime(), current: new Date().getTime() };
    @ViewChild('editor')
    childeditor: AngularEditorComponent;
    @ViewChild('input') input!: ElementRef;
    @Input() data;
    @Input() hasFooter;
    @Input() hasHeader;
    @Input() docId;
    @Input() templateDesc;
    @Input() templateName;
    @Input() templateId;
    @Input() templateContent;
    @Input() editMode;
    @Input() annotation;
    @Input() notifier;
    @Output() modelSaved = new EventEmitter<any>();
    showAnnotation = false;

    ngOnInit(): void {
        this.notifier?.subscribe((res) => {
            console.log(res);
            this.clearFooter();
            this.clearHeader();
            setTimeout(() => {
                this.templateId = res.id;
                this.templateDesc = res.desc;
                this.templateName = res.name;
                this.hasHeader = res.hasHeader;
                this.hasFooter = res.hasFooter;
                if (this.hasHeader) this.addHeader();
                this.editorBindingService.pageContents = JSON.parse(
                    res.content
                );
                console.log('res', res);
                if (this.hasFooter) this.addFooter();
            }, 50);
        });
        self = this;
        this.loading = true;
        // console.log(this.editMode, this.docId);
        // console.log(this.annotation);
        if (this.editMode) {
            this.textEditorService
                .getDocumentEditSource(this.docId)
                .subscribe((data) => {
                    if (data.data) {
                        console.log(data.data);
                        this.editorBindingService.pageContents = JSON.parse(
                            data.data
                        );
                    } else {
                        this.editorBindingService.init();
                    }
                })
                .add(() => {
                    this.loading = false;
                });
        } else {
            this.loading = false;
        }
        // this.loading = false;
        this.tempPage = this.currentPage;
    }

    public changeData() {
        // console.log("sdqdfqdq");
    }

    editorContainer;
    editorBody;

    // Edit :
    edit() {
        this.textEditorService
            .updateTemplates(this.templateId, {
                hasHeader: this.hasHeader ? '1' : '0',
                hasFooter: this.hasFooter ? '1' : '0',
                content: JSON.stringify(this.editorBindingService.pageContents),
                name: this.templateName,
                desc: this.templateDesc,
            })
            .subscribe(
                (res) => {
                    this.toast.info(
                        '',
                        'Le modèle' +
                            this.templateName +
                            'à été modifié avec succès.'
                    );
                },
                (err) => {
                    this.toast.error('', 'à été modifié avec succès.');
                }
            );
    }

    // delete :
    delete() {
        this.textEditorService.deleteTemplates(this.templateId).subscribe(
            (res) => {
                this.toast.info(
                    '',
                    'Le modèle' +
                        this.templateName +
                        'à été modifié avec succès.'
                );
            },
            (err) => {
                this.toast.error('', 'à été modifié avec succès.');
            }
        );
    }

    pageChangeFn(e) {
        if (
            e.target.value > 0 &&
            e.target.value <= this.editorBindingService.pageContents.length
        ) {
            this.tempPage = e.target.value;
            this.currentPage = e.target.value;
        } else {
            this.tempPage = this.editorBindingService.pageContents.length;
            this.currentPage = this.editorBindingService.pageContents.length;
            e.target.value = this.editorBindingService.pageContents.length;
        }
    }

    // Create Editor :
    editorCreated(e: any) {
        this.quillEditor = e;

        this.editorContainer = document.querySelector('.ql-container.ql-snow');
        this.editorBody = document.querySelector('.ql-editor');

        // Create header and footer containers
        let headerContainer = document.createElement('div');
        headerContainer.classList.add('header-container');
        headerContainer.id = 'documaniaHeaderContainer';

        let footerContainer = document.createElement('div');
        footerContainer.classList.add('footer-container');
        footerContainer.id = 'documaniaFooterContainer';
        this.editorContainer.insertBefore(
            headerContainer,
            this.editorContainer.firstChild
        );
        this.editorContainer.appendChild(footerContainer);

        // Register actions & initialize layouts
        registerCustomActions();
        this.createHeaderLayout();
        this.createFooterLayout();

        // Load current page content
        this.quillEditor.setContents(
            this.editorBindingService.pageContents[this.currentPage - 1]
                .objectFormat,
            'api'
        );

        // Microphone toggle (if needed)
        toggleMic = () => {
            this.isLisetning = !this.isLisetning;
            this.toggelVR(this.isLisetning);
        };

        // Table module init
        let tableModule = e.getModule('better-table');
    }

    focus(e) {
        document.getElementById('footerActions').setAttribute('hidden', 'true');
        document.getElementById('headerActions').setAttribute('hidden', 'true');
    }

    loadTemplate() {
        const dialogRef = this.dialog.open(LoadModelDialogComponent, {
            disableClose: true,
            data: { mode: 'add' },
        });
        dialogRef.afterClosed().subscribe((resp: any) => {
            if (resp) {
                this.clearFooter();
                this.clearHeader();

                // Bind editor content
                this.editorBindingService.pageContents = JSON.parse(
                    resp.content
                );

                // Set initial page to 1
                this.currentPage = 1;

                // Update the input to reflect the current page
                this.input.nativeElement.value = 1;

                // Optionally add header and footer if present
                setTimeout(() => {
                    if (resp.hasHeader) {
                        this.addHeader();
                    }
                    if (resp.hasFooter) {
                        this.addFooter();
                    }
                }, 50);
            }
        });
    }

    constructor(
        public config: ConfigService,
        public toast: ToastrService,
        private sanitizer: DomSanitizer,
        private docHeadFootService: DocHeaderFooterService,
        private dialog: MatDialog,
        // public speechReco: SpeechRecognitionService,
        private textEditorService: TexteditorService,
        public editorBindingService: EditorBindingService
    ) {
        let ts = '';
        let lastIndex = 0;

        // this.speechReco.onend = (e) => {
        //     this.isLisetning = false;
        //   };

        //   this.speechReco.onresult = (e) => {

        //     this.timeStop.last = this.timeStop.current
        //     this.timeStop.current = new Date().getTime()
        //     let len = e.results.length;

        //     let lastResult = '';

        //     for (let index = lastIndex; index < len; index++) {
        //       const element = e.results[index];
        //       const next = element.item(0).transcript
        //       if (next === " retour à la ligne" || next === " Retour à la ligne") {
        //         lastResult += "\n"
        //       } else
        //         lastResult += element.item(0).transcript
        //       if (index == (len - 1) && element.isFinal) {
        //         if (lastResult === " retour à la ligne" || lastResult === " Retour à la ligne") {
        //           lastIndex = index + 1
        //           ts += "\n"
        //           this.editorBindingService.pageContents[this.currentPage - 1].objectFormat.ops[this.currentDelta].insert = ts
        //           this.quillEditor.setContents(this.editorBindingService.pageContents[this.currentPage - 1].objectFormat, "api")
        //         }
        //         else {
        //           const next = element.item(0).transcript
        //           if (next === " retour à la ligne" || next === " Retour à la ligne") {
        //             ts += "\n"
        //           } else
        //             ts += element.item(0).transcript;
        //           this.editorBindingService.pageContents[this.currentPage - 1].objectFormat.ops[this.currentDelta].insert = ts;
        //           this.quillEditor.setContents(this.editorBindingService.pageContents[this.currentPage - 1].objectFormat, "api")
        //         }
        //       }
        //       else {
        //         this.editorBindingService.pageContents[this.currentPage - 1].objectFormat.ops[this.currentDelta].insert = lastResult;
        //         this.quillEditor.setContents(this.editorBindingService.pageContents[this.currentPage - 1].objectFormat, "api")
        //       }
        //     }
        //   };

        //   this.speechReco.onspeechstart = (e) => {
        //     this.btnTXT = "Documania vous écoute..."
        //     this.editorBindingService.pageContents[this.currentPage - 1].objectFormat.ops.push({ insert: "" })
        //     this.currentDelta = this.editorBindingService.pageContents[this.currentPage - 1].objectFormat.ops.length - 1;
        //     ts = this.editorBindingService.pageContents[this.currentPage - 1].objectFormat.ops[this.currentDelta].insert
        //   }

        //   this.speechReco.onspeechend = (e) => {
        //     this.btnTXT = "Reconnaissance vocale activée"
        //   }
    }

    ngOnDestroy(): void {
        this.editorBindingService.init();
        // this.speechReco.abort();
    }
    ngAfterViewInit(): void {
        setTimeout(() => {
            if (this.hasHeader) {
                this.addHeader();
            }

            if (this.hasFooter) {
                this.addFooter();
            }
        }, 50);
    }

    // add Header :
    addHeader() {
        const body = document.getElementById('documaniaHeaderBody');
        this.docHeadFootService.getDocumentHeader().subscribe((res) => {
            if (res) {
                this.hasHeader = true;
                this.headerhtml = res.html;
                const template: any = this.htmlToElement(res.html);
                [...template].forEach((node) => {
                    body.appendChild(node);
                });
                body.style.paddingTop = '0.51in';
                const btn = document.getElementById('headerActionBtn');
                btn.toggleAttribute('added', true);
                btn.children.item(0).classList.remove('fa-plus');
                btn.children.item(0).classList.add('fa-times');
                setTimeout(() => {
                    this.editorBody.style.paddingTop =
                        body.clientHeight * 0.0104166667 + 'in';
                }, 1);
                this.htmlContent = res.html + this.htmlContent;
            }
        });
    }

    // Add Footer :
    addFooter() {
        const body = document.getElementById('documaniaFooterBody');
        if (!body) return;
        this.docHeadFootService.getDocumentFooter().subscribe((res) => {
            if (res) {
                this.hasFooter = true;
                this.footerhtml = res.html;
                body.innerHTML = '';
                const template: any = this.htmlToElement(res.html);
                [...template].forEach((node) => body.appendChild(node));

                // Adjust editor padding-bottom
                // setTimeout(() => {
                //      this.editorBody.style.paddingBottom = ((body.clientHeight * 0.0104166667)) + "in"
                // }, 1);
                setTimeout(() => {
                    const footerHeight = body.clientHeight || 80;
                    this.editorBody.style.paddingBottom =
                        footerHeight * 0.0104166667 + 'in';
                }, 100); // زيد شوية الوقت باش يتعرض الفوتر
            }
        });
    }

    editorConfig: AngularEditorConfig = {
        editable: true,
        spellcheck: true,
        height: 'auto',
        minHeight: '500px',
        maxHeight: 'auto',
        width: 'auto',
        minWidth: '0',
        translate: 'yes',
        enableToolbar: true,
        showToolbar: true,
        placeholder: 'Saisissez votre texte ici...',
        defaultParagraphSeparator: '',
        defaultFontName: 'arial',
        defaultFontSize: '',
        fonts: [
            { class: 'arial', name: 'Arial' },
            { class: 'times-new-roman', name: 'Times New Roman' },
            { class: 'calibri', name: 'Calibri' },
            { class: 'comic-sans-ms', name: 'Comic Sans MS' },
        ],

        uploadWithCredentials: false,
        sanitize: false,
        toolbarPosition: 'top',
        toolbarHiddenButtons: [
            [],
            [
                'textColor',
                'backgroundColor',
                'link',
                'unlink',
                'insertVideo',
                'removeFormat',
                'toggleEditorMode',
            ],
        ],
    };
    toggelVR(e: boolean): void {
        if (e) {
            if (!window.navigator.onLine) {
                const dialogRef = this.dialog.open(NonConnectionComponent, {
                    disableClose: true,
                    data: {
                        title: "Erreur d'internet",
                        message:
                            'La reconnaissance vocale requiert une connexion internet',
                    },
                });

                dialogRef.afterClosed().subscribe((result) => {
                    // Handle any logic after the dialog closes, if needed
                });
            } else {
                const micButton = document.querySelector(
                    '.ql-toolbar .ql-formats button.ql-mic'
                );
                micButton?.classList.add('listenig');
                // this.speechReco.start();
            }
        } else {
            //   this.speechReco.stop();
            const micButton = document.querySelector(
                '.ql-toolbar .ql-formats button.ql-mic'
            );
            micButton?.classList.remove('listenig');
        }
    }

    print() {
        let cfg = {};
        const docs = [];
        let converter;
        console.log('pageContents:', this.editorBindingService.pageContents);

        this.editorBindingService.pageContents.forEach((element) => {
            converter = new QuillDeltaToHtmlConverter(
                element.objectFormat.ops,
                cfg
            );
            const converted = converter.convert();
            const documentToPrint = this.createDocument(
                this.headerhtml,
                this.footerhtml,
                converted
            );
            docs.push(documentToPrint);
            // console.log('documentToPrint:', documentToPrint);
        });

        if (!this.editMode)
            this.textEditorService.generatePDF(docs).subscribe((res) => {
                const bstr = atob(res['base64']);
                let n = bstr.length;
                let u8arr = new Uint8Array(n);

                while (n--) {
                    u8arr[n] = bstr.charCodeAt(n);
                }
                let file = new File(
                    [u8arr],
                    environment.editorPrefix +
                        '_' +
                        new Date().getTime() +
                        '.pdf',
                    { type: 'application/pdf' }
                );
                this.save.emit({
                    file: file,
                    content: JSON.stringify(
                        this.editorBindingService.pageContents
                    ),
                    hasFooter: this.hasFooter,
                    hasHeader: this.hasHeader,
                });
            });
        else
            this.textEditorService
                .generatePDFandEditSource(
                    docs,
                    this.docId,
                    JSON.stringify(this.editorBindingService.pageContents)
                )
                .subscribe((res) => {
                    this.closeEv.emit();
                });
    }
    // Helper: Convert Base64 to Uint8Array
    base64ToUint8Array(base64: string): Uint8Array {
        const binaryString = atob(base64);
        const len = binaryString.length;
        const bytes = new Uint8Array(len);
        for (let i = 0; i < len; i++) {
            bytes[i] = binaryString.charCodeAt(i);
        }
        return bytes;
    }

    // Helper: Convert to HTML (Replace Quill logic if not using Quill)
    convertToHTML(element: any): string {
        // Check if element is valid
        if (
            !element ||
            !element.objectFormat ||
            !Array.isArray(element.objectFormat.ops)
        ) {
            console.warn('Invalid element or missing ops array:', element); // Log invalid elements for debugging
            return ''; // Return empty string if element or ops is missing
        }

        const ops = element.objectFormat.ops;

        if (ops.length === 0) {
            console.warn('Empty ops array for element:', element); // Log empty ops array for debugging
            return ''; // Return empty string if ops array is empty
        }

        // Proceed with converting ops to HTML (assuming ops contains the insertable content)
        return ops.map((op: any) => op.insert).join(''); // Combine inserted content into a single string
    }

    handelResultStop() {
        if (this.timeStop.last === this.timeStop.current) {
            //   this.speechReco.stop();
            this.isLisetning = false;
        }
    }

    createHeaderLayout() {
        const headerContainer = document.getElementById(
            'documaniaHeaderContainer'
        );
        let body = document.createElement('div');
        body.id = 'documaniaHeaderBody';
        body.style.minHeight = '0.51in';
        body.style.width = '8.26in';
        body.style.paddingLeft = '0.51in';
        body.style.paddingRight = '0.51in';
        body.style.paddingTop = '0.1in';
        let headerActions = document.createElement('div');
        headerActions.id = 'headerActions';
        headerActions.toggleAttribute('hidden');
        let btn = document.createElement('button');
        btn.id = 'headerActionBtn';
        btn.classList.add('border');
        btn.classList.add('rounded-circle');
        let i = document.createElement('i');
        i.classList.add('fas');
        i.classList.add('fa-plus');
        btn.append(i);
        const p = document.createElement('p');
        p.classList.add('text-muted');
        p.classList.add('header-label');
        p.textContent = 'En-tête';
        headerActions.append(p);
        headerActions.append(btn);
        headerContainer.append(body);
        headerContainer.append(headerActions);
        headerContainer.toggleAttribute('addedC', true);
        btn.onclick = (e) => {
            if (btn.hasAttribute('added')) {
                this.clearHeader();
                btn.removeAttribute('added');
                btn.children.item(0).classList.remove('fa-times');
                btn.children.item(0).classList.add('fa-plus');
            } else {
                this.addHeader();
            }
        };
    }

    createFooterLayout() {
        const headerContainer = document.getElementById(
            'documaniaFooterContainer'
        );
        let body = document.createElement('div');
        body.id = 'documaniaFooterBody';
        body.style.minHeight = '0.51in';
        body.style.width = '8.26in';
        body.style.paddingLeft = '0.51in';
        body.style.paddingRight = '0.51in';
        body.style.paddingBottom = '.1in';
        let headerActions = document.createElement('div');
        headerActions.id = 'footerActions';
        headerActions.toggleAttribute('hidden');
        let btn = document.createElement('button');
        btn.id = 'footerActionBtn';
        btn.classList.add('border');
        btn.classList.add('rounded-circle');
        let i = document.createElement('i');
        i.classList.add('fas');
        i.classList.add('fa-plus');
        btn.append(i);
        const p = document.createElement('p');
        p.classList.add('text-muted');
        p.classList.add('footer-label');
        p.textContent = 'Pied de page';
        headerActions.append(p);
        headerActions.append(btn);
        headerContainer.append(body);
        headerContainer.append(headerActions);
        headerContainer.toggleAttribute('addedC', true);
        btn.onclick = () => {
            if (btn.hasAttribute('added')) {
                this.clearFooter();
                btn.removeAttribute('added');
                btn.children.item(0).classList.remove('fa-times');
                btn.children.item(0).classList.add('fa-plus');
            } else {
                this.addFooter();
            }
        };
    }

    htmlToElement(html: string) {
        const parser = new DOMParser();
        const doc = parser.parseFromString(html, 'text/html');
        return doc.body.childNodes;
    }

    clearHeader() {
        this.hasHeader = false;
        const body = document.getElementById('documaniaHeaderBody');
        body.innerHTML = '';
        this.editorBody.style.paddingTop = '0.51in';
    }

    clearFooter() {
        this.hasFooter = false;
        const body = document.getElementById('documaniaFooterBody');
        body.innerHTML = '';
        this.editorBody.style.paddingBottom = '0.51in';
    }

    createDocument(header, footer, body) {
        const docHeader = header ?? '';
        const DocFooter = `<div style="position:absolute; bottom:0;max-width: 8.26in;width: 8.26in;">${
            footer ?? ''
        }</div>`;
        return docHeader + body + DocFooter;
    }

    changedEditor(e) {
        const editor = document.querySelector('.ql-editor');
        // this.editorBindingService.isEmpty[this.currentPage - 1] = this.isQuillEmpty2()
        if (
            e.text === '\n' &&
            this.editorBindingService.pageContents.length > 1
        ) {
            this.editorBindingService.removePage(this.currentPage);
            this.prevPage();
        }

        if (editor.clientHeight < editor.scrollHeight) {
            this.editorBindingService.createNewPage();
            this.currentPage++;
            document.getElementById('pageNumber')['value'] = this.currentPage;
            this.quillEditor.setContents(
                this.editorBindingService.pageContents[this.currentPage - 1]
                    .objectFormat,
                'api'
            );
            if (this.isLisetning) {
                // this.speechReco.stop();
                this.isLisetning = false;
                document
                    .querySelector('.ql-toolbar .ql-formats button.ql-mic')
                    .classList.remove('listenig');
            }
        }
        setTimeout(() => {}, 100);
        this.quillEditor.history.clear();
    }

    nextPage() {
        if (this.currentPage < this.editorBindingService.pageContents.length) {
            this.tempPage++;
            this.currentPage++;
            document.getElementById('pageNumber')['value'] = this.currentPage;
            this.quillEditor.setContents(
                this.editorBindingService.pageContents[this.currentPage - 1]
                    .objectFormat,
                'api'
            );
        }
    }

    prevPage() {
        if (this.currentPage > 1) {
            document.getElementById('pageNumber')['value'] = eval(
                document.getElementById('pageNumber')['value'] + '-1'
            );
            this.tempPage--;
            this.currentPage--;
            this.quillEditor.setContents(
                this.editorBindingService.pageContents[this.currentPage - 1]
                    .objectFormat,
                'api'
            );
        }
    }

    isQuillEmpty(quill) {
        if (
            JSON.stringify(quill.getContents()) == '{"ops":[{"insert":"\\n"}]}'
        ) {
            return true;
        } else {
            return false;
        }
    }

    close() {
        let isEmpty = true;
        this.editorBindingService.isEmpty.forEach((emp) => {
            console.log(this.editorBindingService.isEmpty);
            if (emp == false) {
                isEmpty = false;
                return;
            }
        });

        if (isEmpty) {
            this.closeEv.emit();
        } else {
            const dialogRef = this.dialog.open(
                CloseConfirmationDialogComponent,
                {
                    disableClose: true,
                    data: {},
                }
            );

            // Handle the dialog result
            dialogRef.afterClosed().subscribe((resp: string) => {
                if (resp === 'yes') {
                    this.print(); // Perform the print action
                } else if (resp === 'no') {
                    this.closeEv.emit(); // Emit the close event
                }
            });
        }
    }

    isQuillEmpty2() {
        return (
            this.quillEditor.getText().trim().length === 0 &&
            this.quillEditor.container.firstChild.innerHTML.includes('img') ===
                false
        );
    }

    saveTemplate() {
        const dialogRef = this.dialog.open(SaveModelDialogComponent, {
            disableClose: true, // Prevent closing on backdrop click
        });

        dialogRef.componentInstance.mode = 'add';

        dialogRef.componentInstance.pass.subscribe((resp) => {
            if (resp) {
                resp['data'] = JSON.stringify(
                    this.editorBindingService.pageContents
                );
                resp['hasHeader'] = this.hasHeader ? '1' : '0';
                resp['hasFooter'] = this.hasFooter ? '1' : '0';

                this.textEditorService
                    .saveTemplate(resp)
                    .subscribe((result) => {
                        result['content'] = JSON.stringify(
                            this.editorBindingService.pageContents
                        );
                        console.log(result);
                        this.templateId = null;
                        this.modelSaved.emit(result);
                        dialogRef.close();
                    });
            } else {
                dialogRef.close();
            }
        });
    }
}
