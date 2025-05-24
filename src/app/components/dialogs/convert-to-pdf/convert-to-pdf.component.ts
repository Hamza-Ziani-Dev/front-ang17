import { Component, EventEmitter, Inject, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Observable } from 'rxjs';
import * as Tiff from 'browser-tiff.js';
import jspdf, { jsPDF } from 'jspdf';

@Component({
  selector: 'app-convert-to-pdf',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './convert-to-pdf.component.html',
  styleUrl: './convert-to-pdf.component.scss'
})
export class ConvertToPdfComponent {
    @Output() pass: EventEmitter<any> = new EventEmitter();
    fileContent: string;
    fileName: string;

    constructor(
      public dialogRef: MatDialogRef<ConvertToPdfComponent>,
      @Inject(MAT_DIALOG_DATA) public data: { fileName: string, fileType: string }
    ) {}

    // Close dialog and pass the result (res) back to the parent
    closeDialog(res: any) {
      this.pass.emit(res);
      this.dialogRef.close();
    }

    ngOnInit(): void {
    }
    action(res) {
      if (res == 'yes') {
        this.createPdfImage().subscribe(conv => {
          this.pass.emit({ file: conv, fileName: this.fileName.replace(".tiff",".pdf").replace(".tif",".pdf") })
        })
      }else{
        this.pass.emit();
      }
    }

    createPdfImage() {
      console.log(this.fileContent)
      return new Observable<Blob>((subscriber) => {
        Tiff.initialize({ TOTAL_MEMORY: 2000000 });
        const tiff = new Tiff({ buffer: this.base64ToArrayBuffer(this.fileContent) });
        const doc: any = new jspdf({ unit: 'pt', compress: true, format: "A4" });
        const countPages = tiff.countDirectory();
        const images = new Array<any>(countPages);
        let canva;

        for (let j = 0; j < countPages; j++) {
          tiff.setDirectory(j);
          canva = tiff.toCanvas();
          console.log(canva);
          images.push(canva);
        }
        let i = 0;
        images.forEach(element => {
          if (i !== 0) {
            doc.addPage();
          }
          doc.addImage(element, 'JPEG', 0, 0, 595.28, 841.89, "", "FAST");
          i++;
        });
        subscriber.next(doc.output('blob'));

      });
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
}
