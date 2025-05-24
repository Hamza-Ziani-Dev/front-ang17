import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialModuleModule } from 'shared/material-module/material-module.module';

@Component({
  selector: 'app-add-destinataires',
  standalone: true,
  imports: [CommonModule,MaterialModuleModule],
  templateUrl: './add-destinataires.component.html',
  styleUrl: './add-destinataires.component.scss'
})
export class AddDestinatairesComponent {

}
