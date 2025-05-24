import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AddAttributesDialogComponent } from '../add-attributes-dialog/add-attributes-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { AttributsRequisDialogComponent } from '../attributs-requis-dialog/attributs-requis-dialog.component';
import { MaterialModuleModule } from 'shared/material-module/material-module.module';

@Component({
  selector: 'app-update-type-document-dialog',
  standalone: true,
  imports: [CommonModule,MaterialModuleModule],
  templateUrl: './update-type-document-dialog.component.html',
  styleUrl: './update-type-document-dialog.component.scss'
})
export class UpdateTypeDocumentDialogComponent {
    constructor(
        private dialog: MatDialog
    ) {}

    openAddAttributesDialog(){
        const dialogRef = this.dialog.open(AddAttributesDialogComponent);
        dialogRef.afterClosed().subscribe((result) => {
            if (result) {
            }
        });
    }

    openSelectAttributesRequisDialog(){
        const dialogRef = this.dialog.open(AttributsRequisDialogComponent);
        dialogRef.afterClosed().subscribe((result) => {
            if (result) {
            }
        });
    }
}
