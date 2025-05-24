import {
    Component,
    EventEmitter,
    Inject,
    Input,
    Output,
    QueryList,
    ViewChildren,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FolderComponent } from 'app/components/apps/folder/folder.component';
import { ConfigService } from 'app/components/services/config.service';
import { RestDataApiService } from 'app/components/services/rest-data-api.service';
import { Folder } from 'app/components/models/folder.model';
import { NgxPaginationModule } from 'ngx-pagination';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { TranslocoModule, TranslocoService } from '@ngneat/transloco';


@Component({
    selector: 'app-folder-to-folders',
    standalone: true,
    imports: [CommonModule,FormsModule,ReactiveFormsModule,NgxPaginationModule,FolderComponent,TranslocoModule],
    templateUrl: './folder-to-folders.component.html',
    styleUrl: './folder-to-folders.component.scss',
})
export class FolderToFoldersComponent {
    @ViewChildren(FolderComponent) viewChildren!: QueryList<FolderComponent>;

    @Input() id: any;
    @Output() res: EventEmitter<any> = new EventEmitter<any>();
    lstConf: Array<string>;
    constructor(
        public config: ConfigService,
        private srv: RestDataApiService,
          public dialogRef: MatDialogRef<FolderToFoldersComponent>,
                @Inject(MAT_DIALOG_DATA) public data: { id: string }
    ) {
        this.id = data.id;
    }
    folders: Folder[];
    foldersId: Array<string> = new Array<string>();
    pages: Array<number>;
    page;
    ngOnInit(): void {
        this.lstConf = new Array<string>();
        this.loadData(0);
    }
    loadData(p) {
        this.srv.getFolderChilds(this.id, p, 6).subscribe((r) => {
            this.folders = r['content'] as Folder[];
            const totalePages = r['totalPages'];
            this.totalEl = r['totalElements'];

            this.pages = new Array<number>(totalePages);
            for (let index = 0; index < this.pages.length; index++) {
                this.pages[index] = index;
            }
            this.page = p;
        });
    }
    totalEl: number;
    goPage(p) {
        this.srv.getFolderChilds(this.srv.id, p, 6).subscribe((r) => {
            this.page = p;
            this.folders = r['content'] as Folder[];
            this.totalEl = r['totalElements'];
            console.log(this.totalEl);
            for (let i = 0; i < this.folders.length; i++) {
                const idF = this.folders[i].id;
                for (let j = 0; j < this.foldersId.length; j++) {
                    const idCheck = this.foldersId[j];
                    if (idF == idCheck) {
                        this.folders[i].field1 = 1;
                    }
                }
            }
        });
    }
    exist = false;
    getId(e) {
        this.foldersId.forEach((element) => {
            if (element == e.id) {
                this.exist = true;
            }
        });

        if (!this.exist) {
            this.foldersId.push(e.id);
            this.lstConf.push(e.reference);
        } else {
            this.foldersId.splice(this.foldersId.indexOf(e.id), 1);
            this.lstConf.splice(this.lstConf.indexOf(e.reference), 1);
        }
        this.exist = false;
    }
    deleteRelations() {
        // if (this.foldersId.length > 0) {
        //     const confRef = this.modal.open(ConfirmationUnlinkingComponent, {
        //         centered: true,
        //     });
        //     confRef.componentInstance.type = this.config.c.unlink.type;
        //     confRef.componentInstance.lstNom = this.lstConf;
        //     if (this.foldersId.length == 1) {
        //         confRef.componentInstance.text = this.config.c.unlink.link;
        //         //"Est-ce que vous voulez vraiment supprimer cette liaison ?"
        //     } else {
        //         confRef.componentInstance.text = this.config.c.unlink.links;
        //         // "Est-ce que vous voulez vraiment supprimer ces liaisons ?"
        //     }
        //     confRef.componentInstance.res.subscribe((resp) => {
        //         if (resp == 'yes') {
        //             this.srv
        //                 .deleteRelFolderFolders(this.foldersId)
        //                 .subscribe((r) => {
        //                     this.res.emit('yes');
        //                     const modalRef = this.modal.open(
        //                         Confirmation2Component,
        //                         {
        //                             keyboard: false,
        //                             centered: true,
        //                         }
        //                     );
        //                     modalRef.componentInstance.title =
        //                         this.config.c['documentSearch']['supp'];
        //                     modalRef.componentInstance.text =
        //                         this.config.c['documentSearch']['deletemsg'];
        //                     modalRef.componentInstance.etat = 1;
        //                     this.mdl.dismiss();
        //                 });
        //         }
        //     });
        // }
    }

    annuler() {
        this.viewChildren.forEach((folder) => {
            folder.checked = false;
        });
        this.foldersId.length = 0;
        this.lstConf.length = 0;
    }
}
