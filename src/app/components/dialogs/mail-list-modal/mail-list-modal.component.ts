import { Component, EventEmitter, Inject, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ConfigService } from 'app/components/services/config.service';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
    selector: 'app-mail-list-modal',
    standalone: true,
    imports: [CommonModule,FormsModule,ReactiveFormsModule],
    templateUrl: './mail-list-modal.component.html',
    styleUrl: './mail-list-modal.component.scss',
})
export class MailListModalComponent {
    @Input() mailList: Array<string> = new Array<string>();
    @Input() mode: string;
    @Input() txt: string;
    @Output() sendMailList: EventEmitter<any> = new EventEmitter();
    myform: FormGroup;
    none = true;
    constructor(
        public config: ConfigService,
        private fb: FormBuilder,
        public dialogRef: MatDialogRef<MailListModalComponent>,
        @Inject(MAT_DIALOG_DATA) public data: any
    ) {
        this.mailList = data.mailList || [];
        this.mode = data.mode;
        this.txt = data.txt;
    }

    ngOnInit(): void {
        this.myform = this.fb.group({
            mailto: ['', [Validators.required, Validators.email]],
        });
    }
    send() {
        const p = this.myform.value['mailto'];
        if (this.mailList.indexOf(this.myform.value['mailto']) == -1)
            this.mailList.push(p);
    }
    clear() {
        this.myform.reset();
        this.mailList.length = 0;
    }
    close() {
        console.log("DONE")
        if (this.mailList.length > 0) {
            this.sendMailList.emit(this.mailList);
            this.dialogRef.close();
        } else {
            this.none = false;
        }
    }
    suppMail(pa) {
        this.mailList.splice(this.mailList.indexOf(pa), 1);
    }
    closeDialog(){
     this.dialogRef.close();
    }
}
