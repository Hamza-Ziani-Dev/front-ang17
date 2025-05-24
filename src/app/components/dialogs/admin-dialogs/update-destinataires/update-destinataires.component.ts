import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialModuleModule } from 'shared/material-module/material-module.module';

@Component({
  selector: 'app-update-destinataires',
  standalone: true,
  imports: [CommonModule,MaterialModuleModule],
  templateUrl: './update-destinataires.component.html',
  styleUrl: './update-destinataires.component.scss'
})
export class UpdateDestinatairesComponent {

}
