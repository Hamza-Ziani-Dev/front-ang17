import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialModuleModule } from 'shared/material-module/material-module.module';

@Component({
  selector: 'app-add-qualite-dialog',
  standalone: true,
  imports: [CommonModule,MaterialModuleModule],
  templateUrl: './add-qualite-dialog.component.html',
  styleUrl: './add-qualite-dialog.component.scss'
})
export class AddQualiteDialogComponent {

}
