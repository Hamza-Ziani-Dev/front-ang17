import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialModuleModule } from 'shared/material-module/material-module.module';

@Component({
  selector: 'app-update-emetteurs',
  standalone: true,
  imports: [CommonModule,MaterialModuleModule],
  templateUrl: './update-emetteurs.component.html',
  styleUrl: './update-emetteurs.component.scss'
})
export class UpdateEmetteursComponent {

}
