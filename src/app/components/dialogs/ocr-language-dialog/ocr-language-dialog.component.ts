import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ConfigService } from 'app/components/services/config.service';
import { MaterialModuleModule } from 'shared/material-module/material-module.module';
import { TranslocoModule, TranslocoService } from '@ngneat/transloco';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-ocr-language-dialog',
  standalone: true,
  imports: [CommonModule,MaterialModuleModule,TranslocoModule],
  templateUrl: './ocr-language-dialog.component.html',
  styleUrl: './ocr-language-dialog.component.scss'
})
export class OcrLanguageDialogComponent {
    @Output() passLang = new EventEmitter<any>();
    ocrlang='fra';

    constructor(
        public config :ConfigService,
        private translocoService: TranslocoService,
        public dialogRef: MatDialogRef<OcrLanguageDialogComponent>,
     ){}



     ngOnInit(): void {
     }


     onCancel(){
       this.passLang.emit(undefined)
     }


     onSubmit(){
       console.log('this.ocrlang',this.ocrlang)
       if(this.ocrlang){
         this.passLang.emit(this.ocrlang);
       }
     }



     onSelect(e){
       console.log('e',e);
       this.ocrlang= e.target.value;
     }
}
