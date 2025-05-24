import {
    AfterViewInit,
    Component,
    ElementRef,
    EventEmitter,
    Input,
    OnDestroy,
    OnInit,
    Output,
    ViewChild,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import {
    AngularEditorComponent,
    AngularEditorConfig,
} from '@kolkov/angular-editor';
import { ConfigService } from 'app/components/services/config.service';
import { DocHeaderFooterService } from 'app/components/services/doc-header-footer.service';
import { TexteditorService } from 'app/components/services/texteditor.service';
import { ToastrService } from 'ngx-toastr';
import { EditorBindingService } from 'app/components/services/editor-binding.service';
import { QuillDeltaToHtmlConverter } from 'quill-delta-to-html';
import { environment } from 'environments/environment.development';
import QuillBetterTable from 'quill-better-table';
// import { QuillModule } from 'ngx-quill';
import Quill from 'quill';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { MaterialModuleModule } from 'shared/material-module/material-module.module';
import { SaveModelComponent } from '../save-model/save-model.component';
import { MatDialog } from '@angular/material/dialog';
import { LoadModelComponent } from '../load-model/load-model.component';
import { CloseConfirmationDialogComponent } from 'app/components/dialogs/close-confirmation-dialog/close-confirmation-dialog.component';
import { TranslocoModule, TranslocoService } from '@ngneat/transloco';
import { QuillModule } from 'ngx-quill';

// Quill.register({
//     'modules/better-table': QuillBetterTable
//   }, true)
let self;
const Delta = Quill.import('delta');
Quill.register(
    {
        'modules/better-table': QuillBetterTable,
    },
    true
);

// let -
let toggleMic;

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
    selector: 'app-texteditor-component',
    standalone: true,
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        MaterialModuleModule,
        HttpClientModule,
        TranslocoModule,
        QuillModule,
    ],
    templateUrl: './texteditor-component.component.html',
    styleUrl: './texteditor-component.component.scss',
})
export class TexteditorComponentComponent
    implements OnInit, AfterViewInit, OnDestroy
{
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
            this.clearFooter();
            this.clearHeader();
            setTimeout(() => {
                this.templateId = res.id;
                console.log('this.templateId', this.templateId);
                this.templateDesc = res.desc;
                this.templateName = res.name;
                this.hasHeader = res.hasHeader;
                this.hasFooter = res.hasFooter;
                this.editorBindingService.pageContents = JSON.parse(
                    res.content
                );
                console.log(res);
                if (this.hasFooter) this.addFooter();
                if (this.hasHeader) this.addHeader();
            }, 50);
        });
        self = this;
        this.loading = true;
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
        this.tempPage = this.currentPage;
    }

    editorContainer;
    editorBody;
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
                    this.toast.error(
                        '',
                        this.config.c['textEditor']['messageEditKO']
                    );
                }
            );
    }

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
                this.toast.error(
                    '',
                    this.config.c['textEditor']['messageEditKO']
                );
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

    editorCreated(e: Quill) {
        this.quillEditor = e;
        this.editorContainer = document.querySelector('.ql-container.ql-snow');
        this.editorBody = document.querySelector('.ql-editor');
        let headerContainer = document.createElement('div');
        headerContainer.classList.add('header-container');
        headerContainer.id = 'documaniaHeaderContainer';

        let footerContainer = document.createElement('div');
        footerContainer.classList.add('footer-container');
        footerContainer.id = 'documaniaFooterContainer';

        this.editorContainer.appendChild(headerContainer);
        this.editorContainer.appendChild(footerContainer);
        registerCustomActions();

        this.createHeaderLayout();
        this.createFooterLayout();
        this.quillEditor.setContents(
            this.editorBindingService.pageContents[this.currentPage - 1]
                .objectFormat,
            'api'
        );

        toggleMic = () => {
            this.isLisetning = !this.isLisetning;
            this.toggelVR(this.isLisetning);
        };
        let tableModule = e.getModule('better-table');
    }

    focus(e) {
        document.getElementById('footerActions').setAttribute('hidden', 'true');
        document.getElementById('headerActions').setAttribute('hidden', 'true');
    }
    loadTemplate() {
        const dialogRef = this.dialog.open(LoadModelComponent, {
            disableClose: true,
            autoFocus: false,
        });

        dialogRef.componentInstance.passModel.subscribe((resp) => {
            if (resp) {
                this.clearFooter();
                this.clearHeader();
                this.editorBindingService.pageContents = JSON.parse(
                    resp.content
                );
                dialogRef.close();
                this.currentPage = 1;
                this.input.nativeElement.value = 1;

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
        //    public speechReco: SpeechRecognitionService,
        private textEditorService: TexteditorService,
        public editorBindingService: EditorBindingService
    ) {
        let ts = '';
        let lastIndex = 0;

        //   this.speechReco.onend = (e) => {
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

    addFooter() {
        const body = document.getElementById('documaniaFooterBody');
        this.docHeadFootService.getDocumentFooter().subscribe((res) => {
            if (res) {
                this.hasFooter = true;
                this.footerhtml = res.html;
                const template: any = this.htmlToElement(res.html);
                [...template].forEach((node) => {
                    body.appendChild(node);
                });
                const btn = document.getElementById('footerActionBtn');
                btn.toggleAttribute('added', true);
                btn.children.item(0).classList.remove('fa-plus');
                btn.children.item(0).classList.add('fa-times');
                body.style.paddingBottom = '0.51in';
                setTimeout(() => {
                    this.editorBody.style.paddingBottom =
                        body.clientHeight * 0.0104166667 + 'in';
                }, 1);
                this.htmlContent = this.htmlContent + res.html;
            }
        });
    }

    // editorBindingService.pageContents[this.currentPage-1].objectFormat: any = {
    //   ops: [
    //     { insert: ' ' }
    //   ]
    // }
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

    toggelVR(e) {
        //   if (e) {
        //     if (!window.navigator.onLine) {
        //       const noConRef = this.ngbModal.open(NonConnectionComponent, { keyboard: false, centered: true, backdrop: 'static' })
        //       noConRef.componentInstance.title = "Erreur d'internet"
        //       noConRef.componentInstance.message = "La reconnaissance vocale requiert une connexion internet"
        //     } else {
        //       document.querySelector('.ql-toolbar .ql-formats button.ql-mic').classList.add('listenig')
        //       this.speechReco.start();
        //     }
        //   }
        //   else {
        //     this.speechReco.stop();
        //     document.querySelector('.ql-toolbar .ql-formats button.ql-mic').classList.remove('listenig')
        //   }
    }

    print() {
        let cfg = {};
        const docs = [];
        let converter;
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

    handelResultStop() {
        if (this.timeStop.last === this.timeStop.current) {
            // this.speechReco.stop();
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
        this.editorBindingService.isEmpty[this.currentPage - 1] =
            this.isQuillEmpty2();
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
                //   this.speechReco.stop();
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
                }
            );

            dialogRef.afterClosed().subscribe((result) => {
                if (result === 'yes') {
                    this.print();
                } else if (result === 'no') {
                    this.closeEv.emit();
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
        const dialogRef = this.dialog.open(SaveModelComponent, {
            disableClose: true,
            autoFocus: false,
            data: { mode: 'add' },
        });

        dialogRef.afterClosed().subscribe((resp: any) => {
            if (resp) {
                resp['data'] = JSON.stringify(
                    this.editorBindingService.pageContents
                );
                resp['hasHeader'] = this.hasHeader ? '1' : '0';
                resp['hasFooter'] = this.hasFooter ? '1' : '0';

                this.textEditorService
                    .saveTemplate(resp)
                    .subscribe((result: any) => {
                        result['content'] = JSON.stringify(
                            this.editorBindingService.pageContents
                        );
                        console.log(result);
                        this.templateId = null;
                        this.modelSaved.emit(result);
                    });
            }
        });
    }
}
