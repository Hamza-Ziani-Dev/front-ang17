import { Component, EventEmitter, Inject, Input, OnInit, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { ConfigService } from 'app/components/services/config.service';
import { DeleteConfirmationDialogComponent } from '../delete-confirmation-dialog/delete-confirmation-dialog.component';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { TranslocoModule, TranslocoService } from '@ngneat/transloco';
import { MaterialModuleModule } from 'shared/material-module/material-module.module';


@Component({
  selector: 'app-view-image-dialog',
  standalone: true,
  imports: [CommonModule,MaterialModuleModule,TranslocoModule],
  templateUrl: './view-image-dialog.component.html',
  styleUrl: './view-image-dialog.component.scss'
})
export class ViewImageDialogComponent implements OnInit {
    @Input() list : Array<any>;
    @Input() compressedTiffs : Array<any>;
    @Input() image;
    @Input() index=0;
    @Output() pass: EventEmitter<any> = new EventEmitter();
    uri: SafeResourceUrl;
    isLoaded: boolean = false;



    constructor(
        public config :ConfigService ,
        private dialog : MatDialog,
        public sanitizer : DomSanitizer,
        private translocoService: TranslocoService,
        public dialogRef: MatDialogRef<ViewImageDialogComponent>,
        @Inject(MAT_DIALOG_DATA) public data: any
    ) {
      this.compressedTiffs = data.compressedTiffs;
      console.log("this.compressedTiffs",this.compressedTiffs);
      this.list = data.list;
       console.log("this.list",this.list);
      this.image = data.image;
      console.log("this.image",this.image);
      this.index = data.index;


     }

     ngOnInit(): void {
    const base64Data = this.compressedTiffs[this.index];
    console.log("Base64 Data:", base64Data);
    this.uri = this.sanitizer.bypassSecurityTrustResourceUrl(this.compressedTiffs[this.index]);
    console.log("Sanitized URI:", this.uri);
    sessionStorage.setItem('vfileName', this.list[this.index].name);
    this.isLoaded = true;

     }

    onEdit(){
    }

    // On Delete :
    onDelete(): void {
        // Open the delete confirmation dialog
        const dialogRef = this.dialog.open(DeleteConfirmationDialogComponent, {
        //   width: '400px',
          data: { msg: "Voulez vous vraiment supprimer cette image ?"},
          disableClose: true,
        });
        // Subscribe to the dialog result
        dialogRef.afterClosed().subscribe((resp: string) => {
          if (resp === 'yes') {
            this.list.splice(this.index, 1);
            this.compressedTiffs.splice(this.index, 1);
            // Emit 'deleted' event to notify parent or other listeners
            this.pass.emit('deleted');
          }
        });
      }



    //Base 64 To Blob :
    async b64toBlob(b64Data, contentType='', sliceSize=512) {
      const byteCharacters = atob(b64Data);
      const byteArrays = [];
      for (let offset = 0; offset < byteCharacters.length; offset += sliceSize) {
        const slice = byteCharacters.slice(offset, offset + sliceSize);
        const byteNumbers = new Array(slice.length);
        for (let i = 0; i < slice.length; i++) {
          byteNumbers[i] = slice.charCodeAt(i);
        }
        const byteArray = new Uint8Array(byteNumbers);
        byteArrays.push(byteArray);
      }
      const blob = new Blob(byteArrays, {type: contentType});
      return blob;
    }



}
