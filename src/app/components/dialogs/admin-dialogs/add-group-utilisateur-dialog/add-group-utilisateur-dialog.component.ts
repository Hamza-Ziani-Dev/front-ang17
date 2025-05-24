import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialModuleModule } from 'shared/material-module/material-module.module';

@Component({
  selector: 'app-add-group-utilisateur-dialog',
  standalone: true,
  imports: [CommonModule,MaterialModuleModule],
  templateUrl: './add-group-utilisateur-dialog.component.html',
  styleUrl: './add-group-utilisateur-dialog.component.scss'
})
export class AddGroupUtilisateurDialogComponent {

}
