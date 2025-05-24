import {
    Component,
    Inject,
    OnInit,
    AfterContentChecked,
    ChangeDetectorRef,
    Input,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import {
    MAT_DIALOG_DATA,
    MatDialog,
    MatDialogRef,
} from '@angular/material/dialog';
import { MaterialModuleModule } from 'shared/material-module/material-module.module';
import { DetailsStepsDialogComponent } from '../details-steps-dialog/details-steps-dialog.component';
import { TranslocoModule, TranslocoService } from '@ngneat/transloco';
import { ConfigService } from 'app/components/services/config.service';
@Component({
    selector: 'app-details-courrier-precessus',
    standalone: true,
    imports: [CommonModule, MaterialModuleModule, TranslocoModule],
    templateUrl: './details-courrier-precessus.component.html',
    styleUrl: './details-courrier-precessus.component.scss',
})
export class DetailsCourrierPrecessusComponent
    implements OnInit, AfterContentChecked
{
    closeDialog(): void {
        this.dialogRef.close();
    }

    // // Open Details Steps :
    openDetailsStepsDialog(etp: any) {
        const dialogRef = this.dialog.open(DetailsStepsDialogComponent, {
            data: etp,
        });

        dialogRef.afterClosed().subscribe((result) => {});
    }
    @Input() process;
    constructor(
        private dialog: MatDialog,
        private translocoService: TranslocoService,
        private ref: ChangeDetectorRef,
        public config: ConfigService,
        public dialogRef: MatDialogRef<DetailsCourrierPrecessusComponent>,
        @Inject(MAT_DIALOG_DATA) public data: any
    ) {
        this.process = data.process;
        console.log('data', this.data);
    }
    ngOnInit(): void {
        console.log(this.process);
    }
    openModal(e: any) {
        this.dialog.open(DetailsStepsDialogComponent, {
            data: { etape: e },
        });
    }

    scrollExist = false;

    ngAfterContentChecked() {
        const element = document.getElementById('stepper1');
        this.ref.detectChanges();

        if (
            element &&
            element.scrollWidth > element.clientWidth &&
            window.innerWidth >= 902
        ) {
            this.scrollExist = true;
        } else {
            this.scrollExist = false;
        }
    }
}
