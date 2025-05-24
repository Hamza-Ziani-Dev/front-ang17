import { Component, ElementRef, EventEmitter, Inject, Input, Output, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ConfigService } from 'app/components/services/config.service';
import { PDFDocumentProxy, PdfViewerModule } from 'ng2-pdf-viewer';
import { FormsModule } from '@angular/forms';
import { MaterialModuleModule } from 'shared/material-module/material-module.module';
import { TranslocoModule, TranslocoService } from '@ngneat/transloco';

@Component({
  selector: 'app-codebar-positioning',
  standalone: true,
  imports: [CommonModule, FormsModule,PdfViewerModule ,MaterialModuleModule,TranslocoModule],
  templateUrl: './codebar-positioning.component.html',
  styleUrl: './codebar-positioning.component.scss'
})
export class CodebarPositioningComponent {
      @Input() pdfSrc: string = '';
       @Input() refval: string = '';
       @Input() cbval: string = '';
       @Output() passPositionParmChain = new EventEmitter<any>();
       @Output() back = new EventEmitter<string>();

       @ViewChild('pdfViewer') pdfViewer: ElementRef;
       @ViewChild('barCode') barCodeChild;
       @ViewChild('qrCode') qrCodeChild;

       barCodeStr: string;
       totalPages = 1;
       page = 1;
       showCodeBar = false;
       isLoaded = false;
       position = { x: 0, y: 0 };
       codeBarCoordinates = { x: 0, y: 0 };
       docSize = { h: 0, w: 0 };
       mode = 1;

       constructor(
         private dialogRef: MatDialogRef<CodebarPositioningComponent>,
         @Inject(MAT_DIALOG_DATA) public data: any,
         public config: ConfigService
       ) {
         this.pdfSrc = data.pdfSrc;
         this.refval = data.refval;
         this.cbval = data.cbval;
       }

       ngAfterViewInit(): void {
         this.pdfViewer = this.pdfViewer.nativeElement;
       }

       ngOnInit(): void {}

       goPage(page: number): void {
         this.page = page;
       }

       onCancel(): void {
         this.back.emit("notok");
         this.dialogRef.close();
       }

       generateCodeBar(type: string): void {
         this.showCodeBar = false;
         if (type === "QR") {
           this.barCodeStr = this.qrCodeChild.qrcElement.nativeElement.firstChild.getAttribute('src');
           this.mode = 1;
         } else {
           if (this.cbval.length > 29) {
             this.showLimitWarning();
           } else {
             this.barCodeStr = this.barCodeChild.bcElement.nativeElement.firstChild.getAttribute('src');
             this.mode = 0;
           }
         }

         this.position.x = this.pdfViewer['offsetLeft'];
         this.position.y = 10;
         setTimeout(() => {
           this.showCodeBar = true;
         }, 70);
       }

       showLimitWarning(): void {
         // Logic to show limit warning, if necessary
       }

       onSubmit(): void {
         const paramPosition = `/${this.mode}?x=${this.codeBarCoordinates.x}&y=${this.codeBarCoordinates.y}&h=${this.docSize.h}&w=${this.docSize.w}&val=${this.cbval}`;
         this.compressImage(this.barCodeStr).then(res => {
           this.passPositionParmChain.emit({ pos: paramPosition, img: res });
           this.back.emit("done");
           this.dialogRef.close();
         });
       }

       onMoving(e): void {
         this.codeBarCoordinates.x = e.x - this.position.x;
         this.codeBarCoordinates.y = e.y - this.position.y;
       }

       pageRendered(e): void {
         this.docSize.h = e['source']['viewport']['height'];
         this.docSize.w = e['source']['viewport']['width'];
       }

       afterLoadComplete(pdf: PDFDocumentProxy): void {
         this.totalPages = pdf.numPages;
         this.isLoaded = true;
       }

       compressImage(src: string): Promise<Blob> {
         return new Promise((res, rej) => {
           const img = new Image();
           img.src = src;
           img.onload = () => {
             const canvas = document.createElement('canvas');
             canvas.width = this.codeBarCoordinates.x;
             canvas.height = this.codeBarCoordinates.y;
             const ctx = canvas.getContext('2d');
             ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
             canvas.toBlob(blob => res(blob));
           };
           img.onerror = error => rej(error);
         });
       }

}
