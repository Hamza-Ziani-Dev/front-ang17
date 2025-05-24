import {
    Component,
    ElementRef,
    EventEmitter,
    Input,
    Output,
    ViewChild,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { ConfigService } from 'app/components/services/config.service';
import { WsService } from 'app/components/sockets/ws.service';
import { MatDialog, MatDialogRef } from '@angular/material/dialog'; // Import MatDialog
import { WarningInfoComponent } from '../warning-info/warning-info.component';
import { PDFDocumentProxy } from 'ng2-pdf-viewer';
import { MaterialModuleModule } from 'shared/material-module/material-module.module';
import { TranslocoModule, TranslocoService } from '@ngneat/transloco';

@Component({
    selector: 'app-ocr-dialog',
    standalone: true,
    imports: [CommonModule,MaterialModuleModule,TranslocoModule],
    templateUrl: './ocr-dialog.component.html',
    styleUrl: './ocr-dialog.component.scss',
})
export class OcrDialogComponent {
    canvaPages = new Array<HTMLCanvasElement>();
    @ViewChild('pdfv') child;
    pdfViewer: ElementRef;

    @Output() passRecognized = new EventEmitter<any>();
    pdfRecognized: Blob;
    textRecognized: String = '';

    //progress
    recognizingBegan = false;
    progressValue = 1;
    currentRecPage = 1;
    @Input() totalPages;

    //Tesseract
    pdfSrc;
    isLoaded = false;
    pdfPages = new Array<Uint8Array>();
    @Input() ocrlang;
    recognizingDone = false;
    @Input() file: Blob;
    @Input() src: string;
    @Input() fileName: string;
    lastProgressValue: number = 0;
    constructor(
        public config: ConfigService,
        private ws: WsService,
        private dialog: MatDialog,
        private translocoService: TranslocoService,
        public dialogRef: MatDialogRef<OcrDialogComponent>,
    ) {}
    async ngAfterViewInit() {
        //console.log(this.file)
        // if(this.src ==="s")
        this.ws.ws.onmessage = async (e) => {
            if (typeof e.data === 'string') {
                // //console.log(e.data);
                const data = e.data;
                const commande = data.split('|')[0];
                const cmdValue = data.split('|')[1];
                if (commande) {
                    if (commande === 'ocrDoc') {
                        const b64Data = cmdValue.split('|')[0];
                        const base64Response = await fetch(b64Data);
                        const b = base64Response.blob();
                        b.then((r) => {
                            this.pdfRecognized = r;
                            this.textRecognized = data.split('|')[2];
                        });
                        this.recognizingDone = true;
                    }
                    if (commande === 'pr') {
                        this.progressValue += (1 / this.totalPages) * 100;
                        this.currentRecPage += 1;
                    }
                }
            }
        };
        console.log(this.src, this.totalPages);
        if (this.src == 's') this.doScanOcr();
        else {
            const reader = new FileReader();
            reader.onload = async () => {
                this.pdfSrc = reader.result;
                this.isLoaded = true;
            };
            reader.readAsDataURL(this.file);
        }
    }
    doScanOcr() {
        this.currentRecPage = 0;
        this.ws.ws.send('ocr|' + this.ocrlang);
    }

    ngOnInit(): void {}

    pageRendered(e: CustomEvent) {
        this.canvaPages.push(e['source']['canvas']);
        //console.log(e['source']['canvas'])
        if (this.totalPages === this.canvaPages.length) {
            // if (this.src != "s")
            //   this.doOCR();
        }
    }

   

    adapteIfBlankPage() {
        if (this.lastProgressValue === this.progressValue) {
            this.progressValue += 100 / this.totalPages;
            if (this.currentRecPage < this.totalPages) this.currentRecPage++;
        }
        this.lastProgressValue = this.progressValue;
    }

    onCancel() {
        this.onClose();
    }

    onSave() {
        if (this.recognizingDone) {
            this.passRecognized.emit({
                file: this.pdfRecognized,
                text: this.textRecognized,
            });
        }
    }

    async afterLoadComplete(pdf: PDFDocumentProxy) {
        this.totalPages = pdf.numPages;
        this.isLoaded = true;
    }
    onClose() {
        if (!this.recognizingDone || this.recognizingBegan) {
            const confDialogRef = this.dialog.open(WarningInfoComponent, {
                backdropClass: 'backdrop', // Optional: Customize backdrop
                disableClose: true, // Prevent closing on backdrop click
                data: {
                    isDialog: true,
                    title: 'Ignorer la reconnaissance du texte',
                    message:
                        'Voulez-vous vraiment ignorer reconnaissance du texte ?',
                },
            });

            confDialogRef.afterClosed().subscribe((result) => {
                if (result === 'yes') {
                    confDialogRef.close();
                    this.passRecognized.emit(undefined);
                } else {
                    confDialogRef.close();
                }
            });
        }
    }
}
