import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MaterialModuleModule } from 'shared/material-module/material-module.module';

@Component({
  selector: 'app-partager-courrier',
  standalone: true,
  imports: [CommonModule,MaterialModuleModule],
  templateUrl: './partager-courrier.component.html',
  styleUrl: './partager-courrier.component.scss'
})
export class PartagerCourrierComponent {
    constructor(
        public dialogRef: MatDialogRef<PartagerCourrierComponent>,
        @Inject(MAT_DIALOG_DATA) public data: any // Injected data
      ) {}

      onClose(): void {
        this.dialogRef.close();
      }


      onDelete(): void {
        this.dialogRef.close(true); // Confirm deletion
      }


}
