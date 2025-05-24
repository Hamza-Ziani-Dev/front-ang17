import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialModuleModule } from 'shared/material-module/material-module.module';
import { FormsModule } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-update-attributes-dialog',
  standalone: true,
  imports: [CommonModule,MaterialModuleModule,FormsModule],
  templateUrl: './update-attributes-dialog.component.html',
  styleUrl: './update-attributes-dialog.component.scss'
})
export class UpdateAttributesDialogComponent {
    constructor(public dialogRef: MatDialogRef<UpdateAttributesDialogComponent>) {}

    onClose(){
        this.dialogRef.close(false);
    }
}
