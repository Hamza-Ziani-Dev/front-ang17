import {
    Component,
    EventEmitter,
    Inject,
    Input,
    Output,
    OnInit,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AllConfigurationsService } from '../../services/all-configurations.service';
import {
    MAT_DIALOG_DATA,
    MatDialog,
    MatDialogRef,
} from '@angular/material/dialog';
import { ConfigService } from '../../services/config.service';
import { MaterialModuleModule } from 'shared/material-module/material-module.module';
import { TranslocoModule, TranslocoService } from '@ngneat/transloco';

@Component({
    selector: 'app-declare-ledger',
    standalone: true,
    imports: [CommonModule,TranslocoModule,MaterialModuleModule],
    templateUrl: './declare-ledger.component.html',
    styleUrl: './declare-ledger.component.scss',
})
export class DeclareLedgerComponent implements OnInit {
    constructor(
        public allCfgs: AllConfigurationsService,
        public config: ConfigService,
        public dialog: MatDialog,
        private fb: FormBuilder,
        private translocoService :TranslocoService,
        public closedialog: MatDialogRef<DeclareLedgerComponent>,
        @Inject(MAT_DIALOG_DATA)
        public data: any
    ) {
        this.formG = this.fb.group({
            email: [
                '',
                [Validators.pattern(/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/)],
            ],
            emailNoeleigible: ['', [Validators.email]],
        });
    }
    @Output() back: EventEmitter<any> = new EventEmitter<any>();
    @Output() mails: EventEmitter<any> = new EventEmitter<any>();
    @Input() recievers = new Array<any>();
    @Input() eligible = new Array<any>();
    selectedReceivers = new Array<any>();
    FiltredArray = new Array<any>();
    FiltredArray1 = new Array<any>();
    ngOnInit(): void {
        if (this.allCfgs.LEDGER_DEFAULT == '0') {
            this.ledgerNeeds = true;
            this.ledger = true;
        }

        this.recievers.forEach((res) => {
            if (res != null && res != '') {
                this.FiltredArray.push(res);
            }
        });

        this.eligible.forEach((eligible) => {
            if (eligible != null && eligible != '') {
                this.FiltredArray1.push(eligible);
            }
        });
    }

    send = false;
    ledger = false;
    ledgerNeeds = false;
    formG: FormGroup;
    ledgerE(e) {
        this.ledger = e.target.checked;
    }

    closeddialog() {
        this.closedialog.close();
    }
    sendE(e) {
        this.send = e.target.checked;
    }
    action() {
        this.FiltredArray1.forEach((eligible) => {
            if (eligible != null && eligible != '') {
                this.selectedReceivers.push(eligible);
            }
        });

        const o = {
            ledger: this.ledger,
            mails: this.selectedReceivers,
        };

        this.back.emit(o);

        this.closeddialog();
    }
    close() {
        const o = {
            ledger: 0,
            mails: null,
        };

        this.back.emit(o);
        this.closeddialog();
    }

    supp(da) {
        this.selectedReceivers.splice(this.selectedReceivers.indexOf(da), 1);
    }

    getEmailFromInput() {
        if (this.formG.controls['email'].value != '') {
            if (
                this.selectedReceivers.indexOf(
                    this.formG.controls['email'].value
                ) == -1
            ) {
                this.selectedReceivers.push(this.formG.controls['email'].value);
            }
        }
    }
    changeSender(e) {
        if (
            this.selectedReceivers.indexOf(
                this.formG.controls['emailNoeleigible'].value
            ) == -1
        ) {
            this.selectedReceivers.push(
                this.formG.controls['emailNoeleigible'].value
            );
        }
    }
}
