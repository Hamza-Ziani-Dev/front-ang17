import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { mailToSend } from 'app/components/models/mailToSend.model';
import {
    FormBuilder,
    FormGroup,
    FormsModule,
    ReactiveFormsModule,
    Validators,
} from '@angular/forms';
import { ConfigService } from 'app/components/services/config.service';
import { EditUserServiceService } from 'app/components/services/edit-user-service.service';
import { AllConfigurationsService } from 'app/components/services/all-configurations.service';
import { TranslocoModule, TranslocoService } from '@ngneat/transloco';
import { MaterialModuleModule } from 'shared/material-module/material-module.module';
import { MailListModalComponent } from '../mail-list-modal/mail-list-modal.component';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { SendDocumentResultComponent } from '../send-document-result/send-document-result.component';
import { CloseConfirmationDialogComponent } from '../close-confirmation-dialog/close-confirmation-dialog.component';
import { CloseConfirmationComponent } from '../close-confirmation/close-confirmation.component';


@Component({
    selector: 'app-send-document',
    standalone: true,
    imports: [
        CommonModule,
        MaterialModuleModule,
        TranslocoModule,
        FormsModule,
        ReactiveFormsModule,
    ],
    templateUrl: './send-document.component.html',
    styleUrl: './send-document.component.scss',
})
export class SendDocumentComponent implements OnInit {
    @Input() obj;
    @Input() id;
    @Input() mode;
    @Input() zipId;
    @Input() docs: Array<any>;
    hasValue = 0;
    mail: mailToSend;
    myform: FormGroup;
    mailList: Array<string>;
    ccList: Array<string>;
    data: string;
    isloading = false;
    canLedger = false;
    ledger = false;
    ledgerNeeds = false;

    constructor(
        public config: ConfigService,
        private fb: FormBuilder,
        private service: EditUserServiceService,
        public allCfgs: AllConfigurationsService,
        private translocoService: TranslocoService,
        private dialog: MatDialog,
        private dialogRef: MatDialogRef<SendDocumentComponent>

    ) {}

    ngOnInit(): void {
        if (this.allCfgs.LEDGER_DEFAULT == '0' && this.allCfgs.LEDGER == '1') {
            this.ledgerNeeds = true;
            this.ledger = true;
        }

        this.mailList = new Array<string>();
        this.ccList = new Array<string>();
        this.myform = this.fb.group({
            mailto: ['', [Validators.required]],
            cc: [''],
            obj: [this.obj],
            body: [''],
        });
    }
    clear() {
        this.myform.reset();
    }
    ledgerE(e) {
        this.ledger = e.target.checked;
    }

    send() {
        if (this.mailList.length > 0 && this.myform.valid) {
            this.isloading = true;
            this.mail = new mailToSend();
            const p = this.myform.value;

            this.mail.body = p['body'];
            this.mail.documentId = this.id;
            this.mail.objet = p['obj'];
            this.mail.mailTo = p['mailto'];
            this.mail.cc = p['cc'];

            const dialogRef = this.dialog.open(SendDocumentResultComponent, {
                disableClose: true,
                data: {
                    mail: this.mail,
                    ledger: this.ledger,
                    mode: this.mode === 'zip' ? this.mode : undefined,
                    zipId: this.mode === 'zip' ? this.zipId : undefined,
                    docs: this.mode === 'zip' ? this.docs : undefined,
                },
            });

            dialogRef.componentInstance.done.subscribe((r: any) => {
                dialogRef.close();
                this.isloading = false;
            });
        }
    }

    openModal() {
        this.data = '';
        const dialogRef = this.dialog.open(MailListModalComponent, {
            disableClose: true,
            data: {
                mode: 'Destinataire(s) :',
                mailList: this.mailList,
                txt: 'À :',
            },
        });
        dialogRef.componentInstance.sendMailList.subscribe((r) => {
            this.mailList = r;
            this.mailList.forEach((element) => {
                this.data += element + '\n';
            });
            this.myform.controls['mailto'].setValue(this.data);
        });
    }

    openModalcc() {
        this.data = '';
        const dialogRef = this.dialog.open(MailListModalComponent, {
            disableClose: true,
            data: {
                mode: 'Destinataires en copie :',
                mailList: this.ccList,
                txt: 'CC :',
            },
        });
        dialogRef.componentInstance.sendMailList.subscribe((r) => {
            this.ccList = r;
            this.ccList.forEach((element) => {
                this.data += element + '\n';
            });
            this.myform.controls['cc'].setValue(this.data);
        });
    }
    close() {
        this.hasValue = 0;

        Object.values(this.myform.value).forEach((element) => {
          if (element !== '' && element != null) {
            this.hasValue = 1;
          }
        });

        if (this.hasValue === 1) {
          const dialogRef = this.dialog.open(CloseConfirmationComponent, {
            disableClose: true,
          });
        dialogRef.componentInstance.etat.subscribe(result => {
            if (result === 'yes') {
             this.dialogRef.close();
            }
          });
        } else {
            this.dialogRef.close();
        }
      }

    closeDialog(){
        this.dialogRef.close();
    }
}
