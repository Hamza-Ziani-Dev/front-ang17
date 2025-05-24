import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslocoService,TranslocoModule } from '@ngneat/transloco';
import { MaterialModuleModule } from 'shared/material-module/material-module.module';
import { MatDialog } from '@angular/material/dialog';
@Component({
  selector: 'app-integration-configuration',
  standalone: true,
  imports: [CommonModule,MaterialModuleModule,TranslocoModule],
  templateUrl: './integration-configuration.component.html',
  styleUrl: './integration-configuration.component.scss'
})
export class IntegrationConfigurationComponent {
    constructor(
        private translocoService: TranslocoService,
        private dialog: MatDialog
    ) {
    }
}
