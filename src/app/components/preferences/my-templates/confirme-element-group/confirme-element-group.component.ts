import { Component, EventEmitter, Inject, Input, OnInit, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ConfigService } from 'app/components/services/config.service';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MaterialModuleModule } from 'shared/material-module/material-module.module';
import { FormsModule } from '@angular/forms';
import { TranslocoModule, TranslocoService } from '@ngneat/transloco';

@Component({
  selector: 'app-confirme-element-group',
  standalone: true,
  imports: [CommonModule,MaterialModuleModule,FormsModule,TranslocoModule],
  templateUrl: './confirme-element-group.component.html',
  styleUrl: './confirme-element-group.component.scss'
})
export class ConfirmeElementGroupComponent implements OnInit {
    @Output() pass: EventEmitter<any> = new EventEmitter();
    @Input() title
    @Input() message
    @Input() btnNo
    @Input() btnYes

    constructor(
        public config :ConfigService,
        public dialogRef: MatDialogRef<ConfirmeElementGroupComponent>,
        @Inject(MAT_DIALOG_DATA) public data: any
    ) {
        this.title = data.title,
        this.message = data.message,
        this.btnNo = data.btnNo,
        this.btnYes = data.btnYes;
    }


    ngOnInit(): void {
        console.log('data', this.data);
    }

    action(res: 'yes' | 'no') {
        this.pass.emit(res);
        this.dialogRef.close(res);
      }

    confirm() {
        this.dialogRef.close('yes');
      }

      cancel() {
        this.dialogRef.close('no');
      }
  }
