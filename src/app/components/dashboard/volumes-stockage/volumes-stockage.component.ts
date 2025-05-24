import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialModuleModule } from 'shared/material-module/material-module.module';
import { TranslocoService,TranslocoModule } from '@ngneat/transloco';
import { MatDialog } from '@angular/material/dialog';
import { AddVolumesStockageDialogComponent } from 'app/components/dialogs/admin-dialogs/add-volumes-stockage-dialog/add-volumes-stockage-dialog.component';

@Component({
  selector: 'app-volumes-stockage',
  standalone: true,
  imports: [CommonModule,MaterialModuleModule,TranslocoModule],
  templateUrl: './volumes-stockage.component.html',
  styleUrl: './volumes-stockage.component.scss'
})
export class VolumesStockageComponent {
    constructor(
        private translocoService: TranslocoService,
        private dialog: MatDialog
    ) {
        // this.checkIfMobile(window.innerWidth);
    }

      // Ajouter Volume Stackage  :
      openAjouterVolumeStockageDialog(): void {
        const dialogRef = this.dialog.open(AddVolumesStockageDialogComponent);
        dialogRef.afterClosed().subscribe((result) => {
            if (result) {
            }
        });
    }
}
