import { Component, EventEmitter, Inject, Input, OnInit, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MaterialModuleModule } from 'shared/material-module/material-module.module';
import { ConfigService } from 'app/components/services/config.service';
import { DomSanitizer } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TranslocoModule, TranslocoService } from '@ngneat/transloco';

@Component({
  selector: 'app-result',
  standalone: true,
  imports: [CommonModule,MaterialModuleModule,FormsModule,ReactiveFormsModule,TranslocoModule],
  templateUrl: './result.component.html',
  styleUrl: './result.component.scss'
})
export class ResultComponent implements OnInit{
    constructor(public config: ConfigService,
        public sanitizer: DomSanitizer,
        public dialogRef: MatDialogRef<ResultComponent>,
        @Inject(MAT_DIALOG_DATA) public data: any
    ) {
        this.text = data.text;
        this.title = data.title;
        this.name = data.name;
        this.etat = data.etat;
        this.fromStep = data.fromStep;
        this.isVoice = data.isVoice
    }
  @Input() title: string;
  @Input() text: string;
  @Input() name: string;
  @Input() etat: number;
  @Input() fromStep: number;
  @Input() isVoice;
  safeUrl = null

  @Output() redirect = new EventEmitter<any>();
  ngOnInit(): void {
    if (this.isVoice) {
      this.safeUrl = this.sanitizer.bypassSecurityTrustResourceUrl(this.text)

    }

  }
  onClose() {
    this.redirect.emit("ok")
    this.dialogRef.close()
  }

  link() {
    this.redirect.emit("link")
    this.dialogRef.close()
  }


}
