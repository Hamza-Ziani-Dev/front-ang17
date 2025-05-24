import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslocoModule, TranslocoService } from '@ngneat/transloco';
import { MatDialog } from '@angular/material/dialog';
import { MaterialModuleModule } from 'shared/material-module/material-module.module';
import { AddEmetteursComponent } from 'app/components/dialogs/admin-dialogs/add-emetteurs/add-emetteurs.component';
import { DeleteEmetteursComponent } from 'app/components/dialogs/admin-dialogs/delete-emetteurs/delete-emetteurs.component';
import { UpdateEmetteursComponent } from 'app/components/dialogs/admin-dialogs/update-emetteurs/update-emetteurs.component';

@Component({
  selector: 'app-emetteurs',
  standalone: true,
  imports: [CommonModule,MaterialModuleModule,TranslocoModule],
  templateUrl: './emetteurs.component.html',
  styleUrl: './emetteurs.component.scss'
})
export class EmetteursComponent {
    emetteurs = [
        { name: 'Ayoube Hajouj', email: 'N/A', code: "122w3" },
        { name: 'John Doe', email: 'john@example.com', code: "123wee" },
        { name: 'Jane Smith', email: 'jane@example.com', code: "qwsd43" }
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


    // Ajouter Emetteur :
    openAjouterEmetteurDialog(): void {
        const dialogRef = this.dialog.open(AddEmetteursComponent);

        dialogRef.afterClosed().subscribe((result) => {
            if (result) {
            }
        });
    }

    // Supprimer Type Document :
    openSupprimerDialog(): void {
        const dialogRef = this.dialog.open(DeleteEmetteursComponent
        );

        dialogRef.afterClosed().subscribe((result) => {
            if (result) {
            }
        });
    }
    //   Modifier Type Courrier:
    openModifierDialog() {
        const dialogRef = this.dialog.open(UpdateEmetteursComponent
        );

        dialogRef.afterClosed().subscribe((result) => {
            if (result) {
            }
        });
    }
}
