import { Component, Inject, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ConfigService } from 'app/components/services/config.service';
import {
    MAT_DIALOG_DATA,
    MatDialog,
    MatDialogRef,
} from '@angular/material/dialog';
import { MaterialModuleModule } from 'shared/material-module/material-module.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ViewerComponent } from 'app/components/dialogs/viewer/viewer.component';
import { TranslocoModule, TranslocoService } from '@ngneat/transloco';

@Component({
    selector: 'app-choise-doc',
    standalone: true,
    imports: [
        CommonModule,
        MaterialModuleModule,
        ReactiveFormsModule,
        FormsModule,
        TranslocoModule,
    ],
    templateUrl: './choise-doc.component.html',
    styleUrl: './choise-doc.component.scss',
})
export class ChoiseDocComponent implements OnInit {
    constructor(
        public config: ConfigService,
        private dialog: MatDialog,
        public dialogRef: MatDialogRef<ChoiseDocComponent>,
        @Inject(MAT_DIALOG_DATA) public data: any
    ) {
        this.mode = data.mode;
        this.dest = data.dest;
    }
    @Input() docs;
    @Input() name;
    @Input() mode;
    @Input() dest;
    ngOnInit(): void {
        console.log('dest', this.dest);
    }

    closeDialog() {
        this.dialogRef.close();
    }
    openViewer(id: string) {
        const dialogRef = this.dialog.open(ViewerComponent, {
            disableClose: true,
            data: {
                documentId: id,
            },
        });
        dialogRef.afterClosed().subscribe((result) => {});
    }
}
