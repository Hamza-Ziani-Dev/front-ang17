import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialModuleModule } from 'shared/material-module/material-module.module';

@Component({
  selector: 'app-invalid-form',
  standalone: true,
  imports: [CommonModule,MaterialModuleModule],
  templateUrl: './invalid-form.component.html',
  styleUrl: './invalid-form.component.scss'
})
export class InvalidFormComponent {

}
