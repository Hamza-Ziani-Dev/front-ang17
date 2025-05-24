import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslocoModule, TranslocoService } from '@ngneat/transloco';
import { MatDialog } from '@angular/material/dialog';
import { MaterialModuleModule } from 'shared/material-module/material-module.module';
import { AddDestinatairesComponent } from 'app/components/dialogs/admin-dialogs/add-destinataires/add-destinataires.component';
import { DeleteDestinatairesComponent } from 'app/components/dialogs/admin-dialogs/delete-destinataires/delete-destinataires.component';
import { UpdateDestinatairesComponent } from 'app/components/dialogs/admin-dialogs/update-destinataires/update-destinataires.component';

@Component({
  selector: 'app-destinataires',
  standalone: true,
  imports: [CommonModule,MaterialModuleModule,TranslocoModule],
  templateUrl: './destinataires.component.html',
  styleUrl: './destinataires.component.scss'
})
export class DestinatairesComponent {
    recipients = [
        { name: 'Ayoube Hajouj', email: 'N/A', eligible: false },
        { name: 'John Doe', email: 'john@example.com', eligible: true },
        { name: 'Jane Smith', email: 'jane@example.com', eligible: false }
      ];

    isChecked: boolean = false;
    constructor(
        private translocoService: TranslocoService,
        private dialog: MatDialog
    ) {
    }
    toggleSwitch() {
        this.isChecked = !this.isChecked;
    }


    // Ajouter Destinataire :
    openAjouterDestinataireDialog(): void {
        const dialogRef = this.dialog.open(AddDestinatairesComponent);

        dialogRef.afterClosed().subscribe((result) => {
            if (result) {
            }
        });
    }

    // Supprimer Type Document :
    openSupprimerDialog(): void {
        const dialogRef = this.dialog.open(DeleteDestinatairesComponent
        );

        dialogRef.afterClosed().subscribe((result) => {
            if (result) {
            }
        });
    }
    //   Modifier Type Courrier:
    openModifierDialog() {
        const dialogRef = this.dialog.open(UpdateDestinatairesComponent
        );

        dialogRef.afterClosed().subscribe((result) => {
            if (result) {
            }
        });
    }
}
