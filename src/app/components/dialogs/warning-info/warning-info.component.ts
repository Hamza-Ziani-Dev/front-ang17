import { Component, EventEmitter, Inject, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MaterialModuleModule } from 'shared/material-module/material-module.module';
import { TranslocoModule, TranslocoService } from '@ngneat/transloco';

@Component({
  selector: 'app-warning-info',
  standalone: true,
  imports: [CommonModule,MaterialModuleModule,TranslocoModule],
  templateUrl: './warning-info.component.html',
  styleUrl: './warning-info.component.scss'
})
export class WarningInfoComponent {
  @Input() isDialog: boolean = false;
  @Input() title: string = '';
  @Input() message: string = '';
  @Output() response = new EventEmitter<string>();
    constructor(
        private translocoService: TranslocoService,
        public dialogRef: MatDialogRef<WarningInfoComponent>,
        @Inject(MAT_DIALOG_DATA) public data: { title: string; message: string; isDialog: boolean },
      ) {}


      ngOnInit(): void {
      }


      close(): void {
        this.dialogRef.close();
      }


      respTo(r)
      {
       this.response.emit(r)
      }
}
