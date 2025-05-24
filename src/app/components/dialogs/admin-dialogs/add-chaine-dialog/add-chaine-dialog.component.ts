import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialModuleModule } from 'shared/material-module/material-module.module';

@Component({
  selector: 'app-add-chaine-dialog',
  standalone: true,
  imports: [CommonModule,MaterialModuleModule],
  templateUrl: './add-chaine-dialog.component.html',
  styleUrl: './add-chaine-dialog.component.scss'
})
export class AddChaineDialogComponent {

}
