import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialModuleModule } from 'shared/material-module/material-module.module';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-update-configuration-rapport',
  standalone: true,
  imports: [CommonModule,MaterialModuleModule],
  templateUrl: './update-configuration-rapport.component.html',
  styleUrl: './update-configuration-rapport.component.scss'
})
export class UpdateConfigurationRapportComponent {
    constructor(public dialogRef: MatDialogRef<UpdateConfigurationRapportComponent>) {}

    closeDialog() {
        this.dialogRef.close();
    }
}
