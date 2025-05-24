import {
    Component,
    EventEmitter,
    Inject,
    Input,
    OnInit,
    Output,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { ConfigService } from 'app/components/services/config.service';
import {
    MAT_DIALOG_DATA,
    MatDialog,
    MatDialogRef,
} from '@angular/material/dialog';
import { MaterialModuleModule } from 'shared/material-module/material-module.module';
import { TranslocoModule, TranslocoService } from '@ngneat/transloco';

@Component({
    selector: 'app-confirme-step',
    standalone: true,
    imports: [CommonModule,MaterialModuleModule,TranslocoModule],
    templateUrl: './confirme-step.component.html',
    styleUrl: './confirme-step.component.scss',
})
export class ConfirmeStepComponent implements OnInit {
    @Output() pass: EventEmitter<any> = new EventEmitter();
    @Input() target: string;
    @Input() btn: string;

    constructor(
        public config: ConfigService,
        public dialog: MatDialog,
        public closedialog: MatDialogRef<ConfirmeStepComponent>,
        @Inject(MAT_DIALOG_DATA) public data: any
    ) {}

    ngOnInit(): void {}
    action(res) {
        this.pass.emit(res);
        this.closedialog.close();
    }
}
