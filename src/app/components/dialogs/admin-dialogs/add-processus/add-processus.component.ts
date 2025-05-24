import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialModuleModule } from 'shared/material-module/material-module.module';
import { FormsModule } from '@angular/forms';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { ModelisationProcessusDialogComponent } from '../modelisation-processus-dialog/modelisation-processus-dialog.component';

@Component({
  selector: 'app-add-processus',
  standalone: true,
  imports: [CommonModule,MaterialModuleModule,FormsModule],
  templateUrl: './add-processus.component.html',
  styleUrl: './add-processus.component.scss'
})
export class AddProcessusComponent {
    constructor(
        public dialogRef: MatDialogRef<AddProcessusComponent>,
        private dialog: MatDialog
    ) {}

    onClose(){
        this.dialogRef.close(false);
    }

    openAddModelisationProcessusDialog(){
        const dialogRef = this.dialog.open(ModelisationProcessusDialogComponent);
        dialogRef.afterClosed().subscribe((result) => {
            if (result) {
            }
        });
    }


}
