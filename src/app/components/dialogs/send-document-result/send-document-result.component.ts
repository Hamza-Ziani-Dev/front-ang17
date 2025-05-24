import { Component, EventEmitter, Inject, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { mailToSend } from 'app/components/models/mailToSend.model';
import { AllConfigurationsService } from 'app/components/services/all-configurations.service';
import { ConfigService } from 'app/components/services/config.service';
import { RestDataApiService } from 'app/components/services/rest-data-api.service';
import { EditUserServiceService } from 'app/components/services/edit-user-service.service';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MaterialModuleModule } from 'shared/material-module/material-module.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TranslocoModule, TranslocoService } from '@ngneat/transloco';

@Component({
    selector: 'app-send-document-result',
    standalone: true,
    imports: [CommonModule,MaterialModuleModule,FormsModule,ReactiveFormsModule,TranslocoModule],
    templateUrl: './send-document-result.component.html',
    styleUrl: './send-document-result.component.scss',
})
export class SendDocumentResultComponent {
    @Input() mail: mailToSend;
    @Input() mode;
    @Input() zipId;
    @Input() ledger;
    @Input() docs: Array<any>;
    @Output() done: EventEmitter<any> = new EventEmitter();
    docIds: Array<any> = new Array<any>();
    loading: number = 0;
    title: string = "Veuillez attendre quelques secondes.";
    constructor(
        public allConfigs: AllConfigurationsService,
        public config: ConfigService,
        private rest: RestDataApiService,
        private service: EditUserServiceService,
        private dialog: MatDialog,
         private dialogRef: MatDialogRef<SendDocumentResultComponent>,
        @Inject(MAT_DIALOG_DATA) public data: any
    ) {}

    ngOnInit(): void {
        if (this.mode == 'zip') {
            this.service.sendmailZip(this.mail, this.zipId).subscribe(
                (r) => {
                    if (this.ledger == 1) {
                        this.rest
                            .saveInLedgerDocuments(
                                this.docs,
                                this.allConfigs.LEDGER
                            )
                            .subscribe((res) => {});
                    }
                    this.loading = 1;
                    this.title = "Envoyé !";
                },
                (err) => {
                    this.loading = 2;
                    this.title = "Erreur de l'envoi, merci de réessayer.";
                }
            );
        } else {
            this.service.sendmail(this.mail).subscribe(
                (r) => {
                    if (this.ledger == 1) {
                        this.docIds.push(this.mail.documentId);
                        this.rest
                            .saveInLedgerDocuments(
                                this.docIds,
                                this.allConfigs.LEDGER
                            )
                            .subscribe((res) => {});
                    }
                    this.loading = 1;
                    this.title = "Envoyé !";
                },
                (err) => {
                    this.loading = 2;
                    this.title = "Erreur de l'envoi, merci de réessayer.";
                }
            );
        }
    }

    ok() {
        this.done.emit('ok');
        this.dialogRef.close();
    }
}
