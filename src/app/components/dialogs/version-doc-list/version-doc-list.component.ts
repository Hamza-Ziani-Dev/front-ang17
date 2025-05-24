import { Component, Inject, Input, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ConfirmationComponent } from '../confirmation/confirmation.component';
import { ConfigService } from 'app/components/services/config.service';
import { RestSearchApiService } from 'app/components/services/rest-search-api.service';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { ResultComponent } from '../result/result.component';
import { NgxPaginationModule } from 'ngx-pagination';
import { FormsModule } from '@angular/forms';
import { MaterialModuleModule } from 'shared/material-module/material-module.module';
import { MatDrawer } from '@angular/material/sidenav';
import { DetailsDialogComponent } from '../details-dialog/details-dialog.component';
import { ViewerComponent } from 'app/components/dialogs/viewer/viewer.component';
import { TranslocoModule, TranslocoService } from '@ngneat/transloco';

@Component({
  selector: 'app-version-doc-list',
  standalone: true,
  imports: [CommonModule,NgxPaginationModule,FormsModule,MaterialModuleModule,TranslocoModule],
  templateUrl: './version-doc-list.component.html',
  styleUrl: './version-doc-list.component.scss'
})
export class VersionDocListComponent {
    @ViewChild('matDrawer') matDrawer!: MatDrawer;
    page;
    pages: Array<number>;
    resultTotal = 0;
    pagesNumber: number = 0;
    documentInfos;
    totalCheck=-1
    @Input()attrs
    filterDocument: Array<any> = new Array()
    constructor(
      public config: ConfigService,
      private service: RestSearchApiService,
      private dialog: MatDialog,
      @Inject(MAT_DIALOG_DATA) public data: any,
     private dialogRef: MatDialogRef<VersionDocListComponent>
    ) {
        this.document = data.document;
        this.type = data.type;
        this.mode = data.mode;
    }
    @Input() document;
    @Input() type;
    documents;
    ngOnInit(): void {
      console.log(this.type)
      this.goPage(0);
    }

    ngDoCheck() {
      if (localStorage.getItem('deviceType') != 'mobile'&&localStorage.getItem('deviceType') != 'tablet') {
        // $('.modal-dialog').first().addClass('maxsize');
        var a = document.querySelectorAll(
          '[class="modal-dialog modal-dialog-centered"]'
        );
        // $(a).first().addClass('maxsize');
      }
    }



    btnPlusInfos(infos: any) {
        this.filterDocument = infos;

        if (this.filterDocument) {
          this.filterDocument["attributeValues"]?.forEach(attribute => {
            let data = new Array();
            if (attribute.attribute.type != null) {
              const typeName = attribute.attribute.type.name;
              if (["ListDep", "listDb", "List"].includes(typeName)) {
                data = JSON.parse(attribute.attribute.defaultValue);
                const found = data.find(res => res.key == attribute.value.value);
                if (found) attribute.value.value = found.value;
              }
            }
          });
        }

        this.dialog.open(DetailsDialogComponent, {
          data: {
            ...infos,
            config: this.config,
            type: this.type
          }
        });
      }
    @Input() mode;
    getId(doc) {
        if (!doc || !Array.isArray(doc)) {
          return null;
        }

        let id;
        doc.forEach((element) => {
          if (element.key == 'id') {
            id = element.value;
          }
        });
        return id;
      }

    totalEl = 0;
    goPage(i) {
      this.totalCheck=-1
      this.page = i;
     if(this.document){
        var id = this.document['id'];
        if (this.mode == 'search') {
          id = this.getId(this.document);
        }
        this.service.getDocVersion(id, i, 12).subscribe((resp) => {
          this.documents = resp['content'];
          //console.log(resp);

          const totalePages = resp['totalPages'];
          this.resultTotal = resp['totalElements'];
          this.totalEl = resp['totalElements'];
          this.pagesNumber = totalePages;
          this.pages = new Array<number>(totalePages);
          for (let index = 0; index < this.pages.length; index++) {
            this.pages[index] = index;
          }
          this.totalCheck=1
        });
     }else {
        console.error('Document is undefined');
      }
    }

    openFile(e: any): void {
        const dialogRef = this.dialog.open(ViewerComponent, {
          disableClose: false,
          data: {
            documentId: e.id,
            mode: 'version'
          }
        });

        dialogRef.afterClosed().subscribe(result => {
        });
      }



    onDelete(id: number): void {
        const dialogRef = this.dialog.open(ConfirmationComponent, {
          disableClose: true,
          data: { target: 'tte version' }
        });

        dialogRef.componentInstance.pass.subscribe((resp: string) => {
          if (resp === 'yes') {
            this.service.deleteDocVersion(id).subscribe(
              (r) => {
                this.goPage(this.page);
              },
              (err) => {
                this.dialog.open(ResultComponent, {
                  disableClose: true,
                  data: {
                    title: 'Erreur',
                    etat: -1,
                    text: 'Impossible de supprimer cette version.'
                  }
                });
              }
            );
          }
          dialogRef.close();
        });
      }


       getFontAwesomeIconFromMIME(mimeType: string): string {
    const icon_classes: { [key: string]: string } = {
      // Media
      image: 'fa fa-file-image-o text-blue-500',
      audio: 'fa fa-file-audio-o text-purple-500',
      video: 'fa fa-file-video-o text-indigo-500',

      // Documents
      'application/pdf': 'fa fa-file-pdf-o text-red-600',
      'application/msword': 'fa fa-file-word-o text-blue-600',
      'application/vnd.ms-word': 'fa fa-file-word-o text-blue-600',
      'application/vnd.oasis.opendocument.text': 'fa fa-file-word-o text-blue-600',
      'application/vnd.openxmlformats-officedocument.wordprocessingml':
        'fa fa-file-word-o text-blue-600',

      'application/vnd.ms-excel': 'fa fa-file-excel-o text-green-600',
      'application/vnd.openxmlformats-officedocument.spreadsheetml':
        'fa fa-file-excel-o text-green-600',
      'application/vnd.oasis.opendocument.spreadsheet': 'fa fa-file-excel-o text-green-600',

      'application/vnd.ms-powerpoint': 'fa fa-file-powerpoint-o text-orange-500',
      'application/vnd.openxmlformats-officedocument.presentationml':
        'fa fa-file-powerpoint-o text-orange-500',
      'application/vnd.oasis.opendocument.presentation':
        'fa fa-file-powerpoint-o text-orange-500',

      'text/plain': 'fa fa-file-text-o text-gray-600',
      'text/html': 'fa fa-file-code-o text-teal-500',
      'application/json': 'fa fa-file-code-o text-teal-500',

      // Archives
      'application/gzip': 'fa fa-file-archive-o text-yellow-500',
      'application/zip': 'fa fa-file-archive-o text-yellow-500',
    };

    if (!mimeType || mimeType === 'null') {
      return 'fa fa-file text-gray-400';
    }

    for (const key in icon_classes) {
      if (icon_classes.hasOwnProperty(key) && mimeType.startsWith(key)) {
        return icon_classes[key];
      }
    }

    return 'fa fa-file-alt text-gray-400';
  }


    drawerDetails: { label: string; value: any }[] = [];

    openDetailsDrawer(folder: any) {
        console.log('folder', folder);
        this.drawerDetails = [
          { label: 'Reference', value: folder.reference || 'N/A' },
          { label: 'Date', value: folder.upload_date || 'N/A' },
          { label: 'Type', value: folder.type?.name || 'N/A' },
          { label: 'Catégorie', value: folder.natureName || 'N/A' },
          { label: 'Émetteur', value: folder.emet__ || 'N/A' },
          { label: 'Propriétaire', value: folder.owner?.fullName || 'N/A' },
          { label: 'Objet', value: folder.objet || 'N/A' },
        ];
        this.matDrawer.toggle();
      }



    closeDrawer() {
        this.matDrawer.toggle();
    }

    closeDialog(){
        this.dialogRef.close();
    }


}
