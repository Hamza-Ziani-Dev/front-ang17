import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { NgxDropzoneModule } from 'ngx-dropzone';
import { MaterialModuleModule } from 'shared/material-module/material-module.module';
import { ConfigService } from 'app/components/services/config.service';
import { ToastrService } from 'ngx-toastr';
import { environment } from 'environments/environment.development';
import { IconsService } from 'app/components/services/icons.service';
import { TranslocoModule, TranslocoService } from '@ngneat/transloco';
import { FormsModule } from '@angular/forms';

@Component({
    selector: 'app-bulk-import-dialog',
    standalone: true,
    imports: [
        CommonModule,
        NgxDropzoneModule,
        MaterialModuleModule,
        TranslocoModule,
        FormsModule,
    ],
    templateUrl: './bulk-import-dialog.component.html',
    styleUrl: './bulk-import-dialog.component.scss',
})
export class BulkImportDialogComponent implements OnInit {
    @Output() fileoutput = new EventEmitter<File[]>();
    public env = environment;
    files: File[] = [];

    constructor(
        public config: ConfigService,
        public iconsService: IconsService,
        private toaterService: ToastrService,
        public translocoService: TranslocoService,
        public dialogRef: MatDialogRef<BulkImportDialogComponent>
    ) {}

    ngOnInit(): void {}

    onSelect(event: { addedFiles: File[] }) {
        event.addedFiles.forEach((file) => {
            if (file.size < Number(environment.maxUpload)) {
                this.files.push(file);
                console.log('file', this.files);
            } else {
                this.toaterService.error(
                    this.translocoService.translate(
                        'bulkimport.fileSizeExceeded'
                    ),
                    `${file.name} ${this.translocoService.translate(
                        'bulkimport.fileIgnored'
                    )}`
                );
            }
        });
    }

    onRemove(event: File) {
        const index = this.files.indexOf(event);
        if (index >= 0) {
            this.files.splice(index, 1);
        }
    }

    onAccept() {
        this.fileoutput.emit(this.files);
        console.log('fileoutput', this.fileoutput);
        this.dialogRef.close();
    }

    onClose() {
        this.dialogRef.close(); // Close the dialog when canceling
    }
}
