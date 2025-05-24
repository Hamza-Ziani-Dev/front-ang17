import { Component, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialModuleModule } from 'shared/material-module/material-module.module';
import { FormsModule } from '@angular/forms';
import { AddAttributesDialogComponent } from '../add-attributes-dialog/add-attributes-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { AttributsRequisDialogComponent } from '../attributs-requis-dialog/attributs-requis-dialog.component';

@Component({
  selector: 'app-add-type-document-dialog',
  standalone: true,
  imports: [CommonModule,MaterialModuleModule,FormsModule],
  templateUrl: './add-type-document-dialog.component.html',
  styleUrl: './add-type-document-dialog.component.scss'
})
export class AddTypeDocumentDialogComponent {

    constructor(
        private dialog: MatDialog
    ) {}

    // Add Attributes :
    openAddAttributesDialog(){
        const dialogRef = this.dialog.open(AddAttributesDialogComponent);
        dialogRef.afterClosed().subscribe((result) => {
            if (result) {
            }
        });
    }

    // Select Attributes Requis :
    openSelectAttributesRequisDialog(){
        const dialogRef = this.dialog.open(AttributsRequisDialogComponent);
        dialogRef.afterClosed().subscribe((result) => {
            if (result) {
            }
        });
    }


}
