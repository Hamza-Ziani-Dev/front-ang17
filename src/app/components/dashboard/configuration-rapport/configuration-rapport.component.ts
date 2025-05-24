import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialModuleModule } from 'shared/material-module/material-module.module';
import { UpdateConfigurationRapportComponent } from 'app/components/dialogs/admin-dialogs/update-configuration-rapport/update-configuration-rapport.component';
import { TranslocoService ,TranslocoModule} from '@ngneat/transloco';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-configuration-rapport',
  standalone: true,
  imports: [CommonModule,MaterialModuleModule,TranslocoModule],
  templateUrl: './configuration-rapport.component.html',
  styleUrl: './configuration-rapport.component.scss'
})
export class ConfigurationRapportComponent {
    constructor(
        private translocoService: TranslocoService,
        private dialog: MatDialog
    ) {
    }


     //   Modifier Type Courrier:
     openModifierAtrributRapportDialog() {
        const dialogRef = this.dialog.open(UpdateConfigurationRapportComponent
        );

        dialogRef.afterClosed().subscribe((result) => {
            if (result) {
            }
        });
    }
}
