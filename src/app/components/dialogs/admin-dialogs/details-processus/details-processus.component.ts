import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialModuleModule } from 'shared/material-module/material-module.module';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { DetailsStepsDialogComponent } from '../details-steps-dialog/details-steps-dialog.component';

@Component({
  selector: 'app-details-processus',
  standalone: true,
  imports: [CommonModule,MaterialModuleModule],
  templateUrl: './details-processus.component.html',
  styleUrl: './details-processus.component.scss'
})
export class DetailsProcessusComponent {

    constructor(
        public dialogRef: MatDialogRef<DetailsProcessusComponent>,
        private dialog: MatDialog
    ) {}

    closeDialog() {
        this.dialogRef.close(false);
    }

    openDetailsStepsDialog(): void {
        const dialogRef = this.dialog.open(DetailsStepsDialogComponent);

        dialogRef.afterClosed().subscribe((result) => {
            if (result) {
            }
        });
    }

}
