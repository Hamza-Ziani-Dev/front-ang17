import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialModuleModule } from 'shared/material-module/material-module.module';

@Component({
  selector: 'app-update-qualite-dialog',
  standalone: true,
  imports: [CommonModule,MaterialModuleModule],
  templateUrl: './update-qualite-dialog.component.html',
  styleUrl: './update-qualite-dialog.component.scss'
})
export class UpdateQualiteDialogComponent {

}
