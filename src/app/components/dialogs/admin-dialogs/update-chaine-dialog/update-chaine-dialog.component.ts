import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialModuleModule } from 'shared/material-module/material-module.module';

@Component({
  selector: 'app-update-chaine-dialog',
  standalone: true,
  imports: [CommonModule,MaterialModuleModule],
  templateUrl: './update-chaine-dialog.component.html',
  styleUrl: './update-chaine-dialog.component.scss'
})
export class UpdateChaineDialogComponent {

}
