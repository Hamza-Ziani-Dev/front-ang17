import { Component, EventEmitter, Inject, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { ConfigService } from 'app/components/services/config.service';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { TranslocoModule, TranslocoService } from '@ngneat/transloco';
import { MaterialModuleModule } from 'shared/material-module/material-module.module';

@Component({
  selector: 'app-confirmation2',
  standalone: true,
  imports: [CommonModule,TranslocoModule,MaterialModuleModule],
  templateUrl: './confirmation2.component.html',
  styleUrl: './confirmation2.component.scss'
})
export class Confirmation2Component {
    @Input() text: string
    @Input() etat: number
    @Input() title: string
    @Output()redirect=new EventEmitter<any>();

    constructor(
        public dialogRef: MatDialogRef<Confirmation2Component>,
        @Inject(MAT_DIALOG_DATA) public data: any
      ) {
        this.title = data.title;
        this.text = data.text;
        this.etat = data.etat;
      }


   ngOnInit(): void {
   }

   onClose(){
     this.dialogRef.close();
     this.redirect.emit("ok")

   }
}
