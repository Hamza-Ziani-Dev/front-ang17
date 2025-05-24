import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialModuleModule } from 'shared/material-module/material-module.module';

@Component({
  selector: 'app-update-group-utilisateur-dialog',
  standalone: true,
  imports: [CommonModule,MaterialModuleModule],
  templateUrl: './update-group-utilisateur-dialog.component.html',
  styleUrl: './update-group-utilisateur-dialog.component.scss'
})
export class UpdateGroupUtilisateurDialogComponent {

}
