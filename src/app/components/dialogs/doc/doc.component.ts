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
import { IconsService } from 'app/components/services/icons.service';
import { ToastrService } from 'ngx-toastr';
import { ViewerService } from 'app/components/services/viewer.service';
import { ViewerComponent } from 'app/components/dialogs/viewer/viewer.component';
import { MatDialog } from '@angular/material/dialog';

@Component({
    selector: 'app-doc',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './doc.component.html',
    styleUrl: './doc.component.scss',
})
export class DocComponent {
    menuOpen = false;
    @ViewChild('cardContainer') cardRef!: ElementRef;
    constructor(
        public config: ConfigService,
        private dialog: MatDialog,
        public iconsService: IconsService,
        private toast: ToastrService,
        private viewerService: ViewerService
    ) {}
    @Input() doc;
    @Input() mode;
    @Input() from;
    @Input() type;
    @Output() selectedDoc: EventEmitter<any> = new EventEmitter<any>();
    @Output() detailsClick = new EventEmitter<void>();
    @Input() file;
    fileType: string;
    myFile;
    ngOnInit(): void {
        if (this.mode == 'vers') {
            this.doc.type = new Object({
                name: this.type,
            });
        }
    }

    toggleMenu() {
        this.menuOpen = !this.menuOpen;
    }
    openViewer() {
        console.log();
        if (this.mode == 'search') {
            console.log(this.doc);
            if (
                this.doc['3']['value'] ==
                    'application/vnd.openxmlformats-officedocument.wordprocessingml.document' ||
                this.doc['3']['value'] ==
                    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
            ) {
                this.downloadFileF(this.doc['0']['value']);
                this.toast.error(
                    this.config.c.documentAdd.fileFormatNotSupported.message,
                    this.config.c.documentAdd.fileFormatNotSupported.title
                );
            }else {
                const id = this.getValue('id');
                 this.dialog.open(ViewerComponent, {
                  disableClose: true,
                  autoFocus: false,
                  data: { documentId: id }
                })
            }
        } else {
            this.selectedDoc.emit(this.doc);
        }
    }

    downloadFileF(id) {
        this.viewerService.downloadFile(id).subscribe((res) => {
            this.myFile = res;
            this.fileType = this.myFile.contentType.split('/')[0];
            const b64Data = this.myFile.fileData as string;
            const contentType = this.myFile.contentType;
            const byteCharacters = atob(b64Data.split(',')[1]);
            const byteArrays = [];
            for (
                let offset = 0;
                offset < byteCharacters.length;
                offset += 512
            ) {
                const slice = byteCharacters.slice(offset, offset + 512);

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
            link.download = this.myFile.fileName;

            link.dispatchEvent(
                new MouseEvent('click', {
                    bubbles: true,
                    cancelable: true,
                    view: window,
                })
            );
        });
    }
    openDetail() {
        //   const detail = this.modal.open(DocDetailComponent, {
        //     keyboard: false,
        //     centered: true,
        //     backdrop: 'static',
        //   });
        //   if(this.from=='doclist')
        //   {
        //   detail.componentInstance.from = this.from;
        //   }
        //   detail.componentInstance.doc = this.doc;
    }
    dt = "Date d'enregistrement";
    getValue(index) {
        var id;
        this.doc.forEach((element) => {
            if (element.key == index) {
                id = element.value;
            }
        });
        return id;
    }
    getValueD(d) {
        for (let index = 0; index < this.doc.attributeValues.length; index++) {
            const element = this.doc.attributeValues[index];
            if (element.attribute.name == d) {
                return element.value.value;
            }
        }
    }
}
