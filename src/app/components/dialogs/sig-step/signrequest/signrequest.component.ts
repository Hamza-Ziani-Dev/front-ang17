import { Component, EventEmitter, Inject, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'app-signrequest',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './signrequest.component.html',
    styleUrl: './signrequest.component.scss',
})
export class SignrequestComponent {
    counter: number;

    constructor(
        public config: ConfigService,
        private signService: SignService,
        private dialogRef: MatDialogRef<SignrequestComponent>,
        @Inject(MAT_DIALOG_DATA) public data: any
    ) {
        console.log(this.counter, this.validationTime);
        this.title = this.title,
        this.documentId = this.documentId,
        this.message = this.message,
        this.validationTime = this.validationTime,
        this.sigReqeustId = this.sigReqeustId,
        this.passCode = this.passCode



    }
    ngAfterViewInit(): void {}
    @Input() title;
    @Input() message;
    @Input() loading = true;
    @Input() sigReqeustId;
    @Input() validationTime;
    @Input() singerEmail;
    @Input() documentId;
    @Input() verificationErr;
    isCalled = false;
    @Output() passCode = new EventEmitter<any>();
    lastCode: String;
    countDown: Subscription;

    tick = 1000;
    isExpired = false;
    ngOnInit() {}
    newReq() {
        if (!this.isExpired) return;
        this.title = this.config.c.signreq.sending;
        this.message = this.config.c.signreq.sendingDesc;
        this.isCalled = false;
        this.loading = true;
        this.signService
            .renewSignRequest(this.sigReqeustId)
            .subscribe((res) => {
                this.sigReqeustId = res.sigReqeustId;
                this.singerEmail = res.singerEmail;
                this.documentId = res.documentId;
                this.validationTime = res.validationTime;
                this.title = this.config.c.signreq.codeEsign;
                this.message = this.config.c.signreq.codeSent + res.singerEmail;
                this.lastCode = '';
                this.loading = false;
            });
    }
    startCounter() {
        this.counter = this.validationTime * 60;
        console.log(this.counter, this.validationTime);
        this.countDown = timer(0, this.tick).subscribe(() => {
            --this.counter;
            this.isExpired = false;
            if (this.counter === 0) {
                this.countDown.unsubscribe();
                this.countDown = null;
                this.isExpired = true;
            }
        });
        this.isCalled = true;
    }
    onCodeCompleted(code: string) {
        this.lastCode = code;
    }
    onCodeChanged(code: string) {
        this.lastCode = code;
    }
    onCancel(codeIn) {
        if (this.lastCode) {
            codeIn.reset();
            this.lastCode = '';
        } else {
            this.passCode.emit(null);
        }
    }
    onSubmit() {
        if (this.lastCode) {
            if (this.lastCode.length == 6) {
                this.passCode.emit({
                    code: this.lastCode,
                    reqId: this.sigReqeustId,
                });
            }
        }
    }

    ngOnDestroy() {
        this.countDown = null;
    }
}

import { Pipe, PipeTransform } from '@angular/core';
import { ConfigService } from 'app/components/services/config.service';
import { SignService } from 'app/components/services/sign.service';
import { Subscription, timer } from 'rxjs';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Pipe({
    name: 'formatTime',
})
export class FormatTimePipe implements PipeTransform {
    transform(value: number): string {
        const minutes: number = Math.floor(value / 60);
        return (
            ('00' + minutes).slice(-2) +
            ':' +
            ('00' + Math.floor(value - minutes * 60)).slice(-2)
        );
    }
}
