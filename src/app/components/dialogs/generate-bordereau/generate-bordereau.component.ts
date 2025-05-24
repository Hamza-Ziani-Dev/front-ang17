import { Component, EventEmitter, Inject, OnInit, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslocoModule, TranslocoService } from '@ngneat/transloco';
import { MaterialModuleModule } from 'shared/material-module/material-module.module';
import { ConfigService } from 'app/components/services/config.service';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';

@Component({
    selector: 'app-generate-bordereau',
    standalone: true,
    imports: [CommonModule, TranslocoModule, MaterialModuleModule],
    templateUrl: './generate-bordereau.component.html',
    styleUrl: './generate-bordereau.component.scss',
})
export class GenerateBordereauComponent implements OnInit {
    constructor(
        public config: ConfigService,
         public dialog: MatDialog,
             public dialogRef: MatDialogRef<GenerateBordereauComponent>,
                 @Inject(MAT_DIALOG_DATA) public data: any
        ) {}
    @Output() back: EventEmitter<any> = new EventEmitter<any>();
    ngOnInit(): void {}
    action(res) {
        this.back.emit(res);
        this.dialogRef.close();
    }
}
