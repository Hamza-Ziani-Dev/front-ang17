import {
    ChangeDetectorRef,
    Component,
    Inject,
    Input,
    OnInit,
    OnDestroy,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { ConfigService } from 'app/components/services/config.service';
import { ViewerService } from 'app/components/services/viewer.service';
import { WindowService } from 'app/components/services/window.service';
import * as Tiff from 'browser-tiff.js';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { PdfViewerModule } from 'ng2-pdf-viewer';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TranslocoModule, TranslocoService } from '@ngneat/transloco';

@Component({
    selector: 'app-viewer',
    standalone: true,
    imports: [
        CommonModule,
        PdfViewerModule,
        FormsModule,
        ReactiveFormsModule,
        PdfViewerModule,
        TranslocoModule
    ],
    templateUrl: './viewer.component.html',
    styleUrl: './viewer.component.scss',
})
export class ViewerComponent implements OnInit, OnDestroy {
    @Input() documentId;
    @Input() mode;
    @Input() modeArchive;
    uri: SafeResourceUrl;
    isLoading = true;
    file;
    tiff: Tiff;
    tiffPages = 1;
    page = 0;
    fileType: string;
    pdfScr: SafeResourceUrl;
    isPDF;
    @Input() name;
    @Input() base64;
    constructor(
        public config: ConfigService,
        private viewerService: ViewerService,
        private sanitizer: DomSanitizer,
        private WINDOW: WindowService,
        private ref: ChangeDetectorRef,
        public closedialog: MatDialogRef<ViewerComponent>,
        @Inject(MAT_DIALOG_DATA) public data: any
    ) {
        Tiff.initialize({ TOTAL_MEMORY: 2000000 });
            this.documentId = data?.documentId;
            this.mode = data?.mode;
            this.modeArchive = data?.modeArchive;
            this.base64 = data?.base64;
            this.name = data?.name;
            console.log("documentId",this.data.documentId);
    }

    ngOnDestroy(): void {}

    b64toBlob(b64Data, contentType = '', sliceSize = 512) {
        const byteCharacters = atob(b64Data);
        const byteArrays = [];

        for (
            let offset = 0;
            offset < byteCharacters.length;
            offset += sliceSize
        ) {
            const slice = byteCharacters.slice(offset, offset + sliceSize);

            const byteNumbers = new Array(slice.length);
            for (let i = 0; i < slice.length; i++) {
                byteNumbers[i] = slice.charCodeAt(i);
            }

            const byteArray = new Uint8Array(byteNumbers);
            byteArrays.push(byteArray);
        }

        const blob = new Blob(byteArrays, { type: contentType });
        return blob;
    }
    getFile(res) {
  console.log("RRESS", res);
  this.file = res;

  if (this.mode !== 'bo') {
    this.fileType = this.file.contentType;
  }

  console.log(this.file);
  console.log(this.fileType);

  if (this.fileType !== 'application/pdf') {
    if (this.fileType === "image/tiff") {
      this.isPDF = false;
      this.uri = this.sanitizer.bypassSecurityTrustResourceUrl(
        'assets/ViewerJS/index.html#' + res['fileData']
      );
    } else {
      const b64Data = res['fileData'].split(",")[1];
      const blob = this.b64toBlob(b64Data, this.fileType);
      const blobUrl = URL.createObjectURL(blob);
      this.uri = this.sanitizer.bypassSecurityTrustResourceUrl(blobUrl);
    }

    this.isLoading = false;
  } else {
    const b64Data = this.file.fileData.split(',')[1];
    const byteCharacters = atob(b64Data);
    const byteArrays = [];
    const sliceSize = 512;

    for (let offset = 0; offset < byteCharacters.length; offset += sliceSize) {
      const slice = byteCharacters.slice(offset, offset + sliceSize);
      const byteNumbers = new Array(slice.length);
      for (let i = 0; i < slice.length; i++) {
        byteNumbers[i] = slice.charCodeAt(i);
      }
      const byteArray = new Uint8Array(byteNumbers);
      byteArrays.push(byteArray);
    }

    const blob = new Blob(byteArrays, { type: this.fileType });
    const url = URL.createObjectURL(blob);

    this.uri = this.sanitizer.bypassSecurityTrustResourceUrl(url);
    this.isPDF = true;
    this.isLoading = false;
  }

  sessionStorage.setItem('vfileName', res['fileName'] as string);
}


    // getFile(res) {
    //     console.log('getFile called', this.base64);
    //     this.file = res;
    //     if (this.mode != 'bo') {
    //         this.fileType = this.file.contentType;
    //     }
    //     console.log(this.file);
    //     console.log(this.fileType);
    //     if (this.fileType !== 'application/pdf') {
    //         if (this.fileType == 'image/tiff') {
    //             this.isPDF = false;
    //             this.uri = this.sanitizer.bypassSecurityTrustResourceUrl(
    //                 'assets/ViewerJS/index.html#' + res['fileData']
    //             );
    //         } else {
    //             const b64Data = res['fileData'].split(',')[1];
    //             const blob = this.b64toBlob(b64Data, this.fileType);
    //             const blobUrl = URL.createObjectURL(blob);
    //             this.uri =
    //                 this.sanitizer.bypassSecurityTrustResourceUrl(blobUrl);
    //         }

    //         this.isLoading = false;
    //     } else {
    //         let sliceSize = 512;
    //         const b64Data = this.file.fileData as string;
    //         let contentType = this.fileType;

    //         const byteCharacters = atob(b64Data.split(',')[1]);
    //         const byteArrays = [];

    //         for (
    //             let offset = 0;
    //             offset < byteCharacters.length;
    //             offset += sliceSize
    //         ) {
    //             const slice = byteCharacters.slice(offset, offset + sliceSize);

    //             const byteNumbers = new Array(slice.length);
    //             for (let i = 0; i < slice.length; i++) {
    //                 byteNumbers[i] = slice.charCodeAt(i);
    //             }

    //             const byteArray = new Uint8Array(byteNumbers);
    //             byteArrays.push(byteArray);
    //         }

    //         const blob = new Blob(byteArrays, { type: contentType });
    //         // this.pdfScr = blob;
    //         const url = URL.createObjectURL(blob);
    //         this.pdfScr = url;
    //         this.isPDF = true;
    //     }
    //     sessionStorage.setItem('vfileName', res['fileName'] as string);
    //     this.isLoading = false;
    // }

    // ngAfterContentChecked() {
    //   this.ref.detectChanges();
    // }
    ngAfterViewInit() {
        setTimeout(() => this.ref.detectChanges());
    }

    ngOnInit(): void {
        if (this.mode != 'bo') {
            if (this.mode == 'version') {
                this.viewerService.getFileVersion(this.documentId).subscribe((r) => {
                        this.getFile(r);
                    });
            } else if (this.mode == 'archive') {
                if (this.modeArchive == 'arrive') {
                    this.viewerService
                        .downloadFileArchiveArrive(this.documentId)
                        .subscribe((res) => {
                            this.getFile(res);
                        });
                } else {
                    this.viewerService
                        .downloadFileArchive(this.documentId)
                        .subscribe((res) => {
                            this.getFileArchive(res);
                        });
                }
            } else if (this.mode == 'repports') {
                this.loadFile();
            } else {
                this.viewerService
                    .getFileToView(this.documentId)
                    .subscribe((res) => {
                        this.getFile(res);
                    });
            }
        } else {
            console.log('enter here');
            this.fileType = 'application/pdf';
            this.file = {
                fileName: this.name ? this.name + '.pdf' : 'bo' + '.pdf',
                fileData: 'data:application/pdf;base64,' + this.base64,
            };
            this.getFile(this.file);
        }
    }

    base64ToArrayBuffer(base64): ArrayBuffer {
        const byteCharacters = atob(base64.split(',')[1]);
        const len = byteCharacters.length;
        const bytes = new Uint8Array(len);
        for (let i = 0; i < len; i++) {
            bytes[i] = byteCharacters.charCodeAt(i);
        }
        return bytes.buffer;
    }

    goPage(pageIndex) {
        this.tiff.setDirectory(pageIndex);
        const canvas = this.tiff.toCanvas();
        document.getElementById('ImageView').appendChild(canvas);
    }

    getFileArchive(res) {
        this.file = res;
        this.fileType = this.file.contentType;
        console.log(this.file);

        if (this.fileType !== 'application/pdf') {
            this.isPDF = false;
            const contentType = this.file.contentType;
            var binaryData = [];

            binaryData.push(this.file.data);

            const blob = new Blob(binaryData, { type: contentType });

            let objectURL = URL.createObjectURL(blob);
            this.uri = this.sanitizer.bypassSecurityTrustResourceUrl(objectURL);
        } else {
            let sliceSize = 512;
            const b64Data = this.file.fileData as string;
            const contentType = this.file.contentType;
            this.file = res;
            this.fileType = this.file.contentType.split('/')[0];

            var binaryData = [];
            binaryData.push(this.file.data);

            const blob = new Blob(binaryData, { type: contentType });
            this.pdfScr = blob;

            this.isPDF = true;
        }
        sessionStorage.setItem('vfileName', res['fileName'] as string);
        this.isLoading = false;
    }

    PreviousPage() {
        if (this.page !== 0) {
            document.getElementById('ImageView').innerHTML = '';
            this.page = --this.page;
            this.goPage(this.page);
        }
    }
    NextPage() {
        if (this.page !== this.tiffPages - 1) {
            document.getElementById('ImageView').innerHTML = '';
            this.page = ++this.page;
            this.goPage(this.page);
        }
    }
    onDownload(sliceSize = 512) {
        if (!this.file || !this.file.fileData) {
            console.error('Aucun fichier à télécharger');
            return;
        }

        const b64Data = this.file.fileData as string;
        const contentType = this.file.contentType || 'application/pdf';
        const byteCharacters = atob(b64Data.split(',')[1]);
        const byteArrays = [];

        for (
            let offset = 0;
            offset < byteCharacters.length;
            offset += sliceSize
        ) {
            const slice = byteCharacters.slice(offset, offset + sliceSize);
            const byteNumbers = new Array(slice.length);
            for (let i = 0; i < slice.length; i++) {
                byteNumbers[i] = slice.charCodeAt(i);
            }
            const byteArray = new Uint8Array(byteNumbers);
            byteArrays.push(byteArray);
        }

        const blob = new Blob(byteArrays, { type: contentType });
        const blobUrl = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = blobUrl;
        link.download = this.file.fileName || `document_${Date.now()}.pdf`;

        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }

    onDownloadArchive() {
        const b64Data = this.file.fileData as string;
        const contentType = this.file.contentType;

        var binaryData = [];
        binaryData.push(this.file.data);

        const blob = new Blob(binaryData, { type: contentType });
        const blobUrl = URL.createObjectURL(blob);

        const link = document.createElement('a');
        link.href = blobUrl;
        link.download = this.file.filename;

        link.dispatchEvent(
            new MouseEvent('click', {
                bubbles: true,
                cancelable: true,
                view: window,
            })
        );
    }

    loadFile() {
        console.log(this.data.base64);

        const base64 = this.data.base64;
        const contentType = 'application/pdf';
        const sliceSize = 512;
        const byteCharacters = atob(base64);
        const byteArrays = [];

        for (
            let offset = 0;
            offset < byteCharacters.length;
            offset += sliceSize
        ) {
            const slice = byteCharacters.slice(offset, offset + sliceSize);
            const byteNumbers = new Array(slice.length);
            for (let i = 0; i < slice.length; i++) {
                byteNumbers[i] = slice.charCodeAt(i);
            }
            const byteArray = new Uint8Array(byteNumbers);
            byteArrays.push(byteArray);
        }

        const blob = new Blob(byteArrays, { type: contentType });
        const url = URL.createObjectURL(blob);
        this.uri = this.sanitizer.bypassSecurityTrustResourceUrl(url);

        this.file = {
            fileName: `document_${Date.now()}.pdf`,
            fileData: 'data:application/pdf;base64,' + base64,
            contentType: contentType,
        };

        this.isPDF = true;
        this.isLoading = false;
    }
}
