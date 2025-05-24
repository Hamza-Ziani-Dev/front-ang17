import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialModuleModule } from 'shared/material-module/material-module.module';

@Component({
  selector: 'app-add-emetteurs',
  standalone: true,
  imports: [CommonModule,MaterialModuleModule],
  templateUrl: './add-emetteurs.component.html',
  styleUrl: './add-emetteurs.component.scss'
})
export class AddEmetteursComponent {

}
