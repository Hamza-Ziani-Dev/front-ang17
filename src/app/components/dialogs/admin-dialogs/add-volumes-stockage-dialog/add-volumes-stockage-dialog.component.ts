import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialModuleModule } from 'shared/material-module/material-module.module';

@Component({
  selector: 'app-add-volumes-stockage-dialog',
  standalone: true,
  imports: [CommonModule,MaterialModuleModule],
  templateUrl: './add-volumes-stockage-dialog.component.html',
  styleUrl: './add-volumes-stockage-dialog.component.scss'
})
export class AddVolumesStockageDialogComponent {

}
