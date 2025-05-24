import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialModuleModule } from 'shared/material-module/material-module.module';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-attributs-requis-dialog',
  standalone: true,
  imports: [CommonModule,MaterialModuleModule],
  templateUrl: './attributs-requis-dialog.component.html',
  styleUrl: './attributs-requis-dialog.component.scss'
})
export class AttributsRequisDialogComponent {
    constructor(public dialogRef: MatDialogRef<AttributsRequisDialogComponent>) {}
    isChecked : boolean =false;

    onClose(){
        this.dialogRef.close(false);
    }

    toggleSwitch() {
        this.isChecked = !this.isChecked;
    }
}
