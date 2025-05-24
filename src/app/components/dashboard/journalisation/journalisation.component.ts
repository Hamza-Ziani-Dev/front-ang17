import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialModuleModule } from 'shared/material-module/material-module.module';
import { TranslocoModule, TranslocoService } from '@ngneat/transloco';
import { MatDialog } from '@angular/material/dialog';
import { AddJournalDialogComponent } from 'app/components/dialogs/admin-dialogs/add-journal-dialog/add-journal-dialog.component';

@Component({
  selector: 'app-journalisation',
  standalone: true,
  imports: [CommonModule,MaterialModuleModule,TranslocoModule],
  templateUrl: './journalisation.component.html',
  styleUrl: './journalisation.component.scss'
})
export class JournalisationComponent {
    constructor(
        private translocoService: TranslocoService,
        private dialog: MatDialog
    ) {}

    openAjouterJournalDialog(){
        const dialogRef = this.dialog.open(AddJournalDialogComponent
        );

        dialogRef.afterClosed().subscribe((result) => {
            if (result) {
            }
        });
    }
}
