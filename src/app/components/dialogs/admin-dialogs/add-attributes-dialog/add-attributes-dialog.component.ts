import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialModuleModule } from 'shared/material-module/material-module.module';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-add-attributes-dialog',
  standalone: true,
  imports: [CommonModule,MaterialModuleModule],
  templateUrl: './add-attributes-dialog.component.html',
  styleUrl: './add-attributes-dialog.component.scss'
})
export class AddAttributesDialogComponent {
    constructor(public dialogRef: MatDialogRef<AddAttributesDialogComponent>) {}

    onClose(){
        this.dialogRef.close(false);
    }


}
