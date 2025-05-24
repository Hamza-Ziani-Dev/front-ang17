import { Component, EventEmitter, Inject, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ConfigService } from 'app/components/services/config.service';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MaterialModuleModule } from 'shared/material-module/material-module.module';
import { HttpClientModule } from '@angular/common/http';
import { NgxPaginationModule } from 'ngx-pagination';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FolderComponent } from 'app/components/apps/folder/folder.component';
import { TranslocoModule, TranslocoService } from '@ngneat/transloco';
@Component({
    selector: 'app-link-folder-folder-confirmation',
    standalone: true,
    imports: [CommonModule,MaterialModuleModule,TranslocoModule,NgxPaginationModule,HttpClientModule,FormsModule,ReactiveFormsModule,FolderComponent],
    templateUrl: './link-folder-folder-confirmation.component.html',
    styleUrl: './link-folder-folder-confirmation.component.scss',
})
export class LinkFolderFolderConfirmationComponent {
    @Input() mode: string;
    @Input() parentFolder;
    @Input() folderChilds;
    @Input() folderChildsIds;
    @Input() folderReceive;
    @Input() title: string;
    @Input() titreDoc: string;

    @Input() parent;
    @Output() passConfirmation: EventEmitter<any> = new EventEmitter<any>();

    constructor(
        public config: ConfigService,
        @Inject(MAT_DIALOG_DATA) public data: any,
       public dialogRef: MatDialogRef<LinkFolderFolderConfirmationComponent>
    ) {
        this.folderChilds = data.folderChilds;
        this.folderReceive = data.folderReceive;
        this.titreDoc = data.titreDoc;
        this.title = data.title;
        this.mode = data.mode;
    }

    ngOnInit(): void {
        //console.log(this.folderChilds);
    }
    close() {
        this.dialogRef.close();
    }
    negativeResp() {
        this.passConfirmation.emit('no');
        this.dialogRef.close();
    }
    positiveResp() {
        this.passConfirmation.emit('yes');
        this.dialogRef.close();
    }
    removeFromList(id) {
        for (let i = 0; i < this.folderChildsIds.length; i++) {
            const fid = this.folderChildsIds[i];
            if (fid === id) {
                this.folderChildsIds.splice(i, 1);
                this.folderChilds.splice(i, 1);
            }
        }
    }
}
