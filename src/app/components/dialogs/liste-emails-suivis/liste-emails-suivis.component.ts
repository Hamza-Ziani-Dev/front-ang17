import { Component, ViewEncapsulation } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialogRef } from '@angular/material/dialog';
import { MaterialModuleModule } from 'shared/material-module/material-module.module';
import { MatTableDataSource } from '@angular/material/table';
export interface EmailData {
    champsEmailsCliques: string;
    emailsRecus: string;
    nomDeCourrier: string;
    email: string;
}
@Component({
  selector: 'app-liste-emails-suivis',
  standalone: true,
  imports: [CommonModule,MaterialModuleModule],
  templateUrl: './liste-emails-suivis.component.html',
  styleUrl: './liste-emails-suivis.component.scss',
  encapsulation: ViewEncapsulation.None
})
export class ListeEmailsSuivisComponent {
    // dataSource: MatTableDataSource<any>;
    displayedColumns: string[] = ['champsEmailsCliques', 'emailsRecus', 'nomDeCourrier', 'email'];
    dataSource = new MatTableDataSource<EmailData>([
        { champsEmailsCliques: 'Example1', emailsRecus: 'example1@mail.com', nomDeCourrier: 'Courrier1', email: 'courrier1@mail.com' },
        { champsEmailsCliques: 'Example2', emailsRecus: 'example2@mail.com', nomDeCourrier: 'Courrier2', email: 'courrier2@mail.com' },
        // Add more data as needed
    ]);
    constructor(public dialogRef: MatDialogRef<ListeEmailsSuivisComponent>) {}

  onClose(): void {
    this.dialogRef.close();
  }

}
