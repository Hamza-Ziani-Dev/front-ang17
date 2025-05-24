import {
    Component,
    EventEmitter,
    Inject,
    Input,
    OnInit,
    Output,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { ConfigService } from 'app/components/services/config.service';
import { DomSanitizer } from '@angular/platform-browser';
import { WsService } from 'app/components/sockets/ws.service';
import { ScanService } from 'app/components/services/scan.service';
import jspdf from 'jspdf';
import { WarningInfoComponent } from '../warning-info/warning-info.component';
import {
    MAT_DIALOG_DATA,
    MatDialog,
    MatDialogRef,
} from '@angular/material/dialog';
import { DeleteConfirmationDialogComponent } from '../delete-confirmation-dialog/delete-confirmation-dialog.component';
import { ViewImageDialogComponent } from '../view-image-dialog/view-image-dialog.component';
import { OcrLanguageDialogComponent } from '../ocr-language-dialog/ocr-language-dialog.component';
import { OcrDialogComponent } from '../ocr-dialog/ocr-dialog.component';
import { MaterialModuleModule } from 'shared/material-module/material-module.module';
import { TranslocoModule, TranslocoService } from '@ngneat/transloco';

@Component({
    selector: 'app-scanned-images-dialog',
    standalone: true,
    imports: [CommonModule, MaterialModuleModule, TranslocoModule],
    templateUrl: './scanned-images-dialog.component.html',
    styleUrl: './scanned-images-dialog.component.scss',
})
export class ScannedImagesDialogComponent implements OnInit {
    @Input() imgsList;
    @Input() onScan;
    @Input() compressedTiff: Array<any>;
    @Input() thumbs: Array<any>;
    @Output() scanAgain = new EventEmitter<void>();
    @Output() passConverted = new EventEmitter<any>();
    @Output() closed = new EventEmitter<any>();

    @Input() src;
    ocrlang = 'fra';
    page = 1;
    pageSize = 5;
    constructor(
        public config: ConfigService,
        public sanitizer: DomSanitizer,
        private dialog: MatDialog,
        private ws: WsService,
        private scanService: ScanService,
        private translocoService: TranslocoService,
        public dialogRef: MatDialogRef<ScannedImagesDialogComponent>,
        @Inject(MAT_DIALOG_DATA) public data: any
    ) {
        this.imgsList = data.imgsList;
        this.thumbs = data.thumbs;
        this.compressedTiff = data.compressedTiff;
        this.onScan = data.onScan;
        this.src = data.src;
    }

    ngOnInit(): void {

    }

    // On Convert :
    onConvert() {
        if (this.src == 's') {
            this.startWSListener();
            this.ws.savePDF(this.scanService.scanSessionId);
        } else {
            let doc = new jspdf({ unit: 'pt' });
            const length = this.imgsList.length;
            let i = 0;
            this.imgsList.forEach((element) => {
                if (i != 0) doc.addPage();
                doc.addImage(element.image, 'TIFF', 0, 0, 593, 842);
                i++;
            });
            this.passConverted.emit({ file: doc.output('blob'), text: null });
        }
    }

    // Convert with OCR :
    onConvertWithOcr() {
        let doc = new jspdf({ unit: 'pt' });
        const length = this.imgsList.length;
        let i = 0;
        this.imgsList.forEach((element) => {
            if (i !== 0) doc.addPage();
            doc.addImage(element.image, 'TIFF', 0, 0, 593, 842);
            i++;
        });

        const langDialogRef = this.dialog.open(OcrLanguageDialogComponent, {
            backdropClass: 'backdrop',
            disableClose: true,
        });

        langDialogRef.componentInstance.passLang.subscribe((lang) => {
            if (lang) {
                this.ocrlang = lang;
                langDialogRef.close();
                const ocrDialogRef = this.dialog.open(OcrDialogComponent, {
                    backdropClass: 'backdrop',
                    disableClose: true,
                });

                ocrDialogRef.componentInstance.file = doc.output('blob');
                ocrDialogRef.componentInstance.fileName = 'pdf.pdf';
                ocrDialogRef.componentInstance.src = this.src;
                ocrDialogRef.componentInstance.totalPages = length;
                ocrDialogRef.componentInstance.ocrlang = this.ocrlang;

                ocrDialogRef.componentInstance.passRecognized.subscribe(
                    (ocr) => {
                        if (ocr) {
                            this.passConverted.emit(ocr);
                            ocrDialogRef.close();
                        } else {
                            ocrDialogRef.close();
                        }
                    }
                );
            } else { langDialogRef.close();
            }
        });
    }

    onScanAgain() {
        this.scanAgain.emit();
        this.dialogRef.close(); // Close dialog after conversion
    }

    //   On View :
    onView(i, img) {
        const dialogRef = this.dialog.open(ViewImageDialogComponent, {
            width: '90vh',
            height: '90vh',
            data: {
                image: img,
                index: (this.page - 1) * this.pageSize + i,
                list: this.imgsList,
                compressedTiffs: this.compressedTiff,
            },
        });

        // Subscribe to the result (pass or dismiss)
        dialogRef.afterClosed().subscribe((result) => {
            if (result === 'deleted') {
            }
        });
    }

    //   On Close :
    onClose() {
        const dialogRef = this.dialog.open(WarningInfoComponent, {
            // width: '400px',
            disableClose: true,
            data: {
                isDialog: true,
                title: 'Ignorer la reconnaissance du texte',
                message:'Voulez-vous vraiment ignorer reconnaissance du texte ?',
            },
        });

        // Subscribe to response event
        dialogRef.componentInstance.response.subscribe((res: string) => {
            if (res === 'yes') {
                dialogRef.close();
                this.passConverted.emit(null);
                this.dialogRef.close();
            } else {
                dialogRef.close();
            }
        });
    }

    // On Delete :
    delete(i: number) {
        const dialogRef = this.dialog.open(DeleteConfirmationDialogComponent, {
            width: '400px',
            disableClose: true,
            data: {
                msg: "Voulez vous vraiment supprimer cette image ?",
            },
        });

        dialogRef.componentInstance.pass.subscribe((resp: string) => {
            if (resp === 'yes') {
                this.imgsList.splice((this.page - 1) * 6 + i, 1);
                this.compressedTiff.splice((this.page - 1) * 6 + i, 1);
                this.ws.ws.send('555|' + ((this.page - 1) * 6 + i));

                // Check if imgsList is empty after deletion
                if (this.imgsList.length === 0) {
                    dialogRef.close();
                    this.dialogRef.close();
                    this.passConverted.emit(null);
                }
            } else {
                dialogRef.close();
            }
        });
    }

    // Start WebSocket listener :
    startWSListener() {
        this.ws.ws.onmessage = async (e) => {
            if (typeof e.data === 'string') {
                console.log('e.data',e.data);
                const data = e.data;
                const commande = data.split('|')[0];
                const cmdValue = data.split('|')[1];
                if (commande) {
                    if (commande === 'savedPDF') {
                        const base64Response = await fetch(
                            cmdValue.split('&')[0]
                        );
                        const b = base64Response.blob();
                        b.then((r) => {
                            this.passConverted.emit({ file: r, text: null });
                        });
                    }
                }
            }
        };
    }


    // On Destroy :
    ngOnDestroy(): void {
        this.scanService.setScanSessionId = '';
        this.ws.ws.onmessage = null; // Clean up the listener
    }
}
