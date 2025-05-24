import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslocoService,TranslocoModule } from '@ngneat/transloco';
import { MatDialog } from '@angular/material/dialog';
import { MaterialModuleModule } from 'shared/material-module/material-module.module';

@Component({
  selector: 'app-flux-electronique',
  standalone: true,
  imports: [CommonModule,MaterialModuleModule,TranslocoModule],
  templateUrl: './flux-electronique.component.html',
  styleUrl: './flux-electronique.component.scss'
})
export class FluxElectroniqueComponent {
    constructor(
        private translocoService: TranslocoService,
        private dialog: MatDialog
    ) {
    }
}
