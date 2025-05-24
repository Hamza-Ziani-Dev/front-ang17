import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialModuleModule } from 'shared/material-module/material-module.module';
import { TranslocoService } from '@ngneat/transloco';
import { MatDialog } from '@angular/material/dialog';
import { RecharcheJournalDialogComponent } from '../recharche-journal-dialog/recharche-journal-dialog.component';

@Component({
  selector: 'app-add-journal-dialog',
  standalone: true,
  imports: [CommonModule,MaterialModuleModule],
  templateUrl: './add-journal-dialog.component.html',
  styleUrl: './add-journal-dialog.component.scss'
})
export class AddJournalDialogComponent {
    constructor(
        private translocoService: TranslocoService,
        private dialog: MatDialog
    ) {
    }

    openSearchJournalDialog(){
        const dialogRef = this.dialog.open(RecharcheJournalDialogComponent
        );

        dialogRef.afterClosed().subscribe((result) => {
            if (result) {
            }
        });
    }
}
