import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialModuleModule } from 'shared/material-module/material-module.module';
import { TranslocoModule, TranslocoService } from '@ngneat/transloco';
import { MatDialog } from '@angular/material/dialog';
import { AddChaineDialogComponent } from 'app/components/dialogs/admin-dialogs/add-chaine-dialog/add-chaine-dialog.component';
import { DeleteChaineDialogComponent } from 'app/components/dialogs/admin-dialogs/delete-chaine-dialog/delete-chaine-dialog.component';
import { UpdateChaineDialogComponent } from 'app/components/dialogs/admin-dialogs/update-chaine-dialog/update-chaine-dialog.component';

@Component({
  selector: 'app-chaines-connexion',
  standalone: true,
  imports: [CommonModule,MaterialModuleModule,TranslocoModule],
  templateUrl: './chaines-connexion.component.html',
  styleUrl: './chaines-connexion.component.scss'
})
export class ChainesConnexionComponent {
    constructor(
        private translocoService: TranslocoService,
        private dialog: MatDialog
    ) {
    }
 // Ajouter Chaine :
 openAjouterChaineDialog(): void {
    const dialogRef = this.dialog.open(AddChaineDialogComponent);

    dialogRef.afterClosed().subscribe((result) => {
        if (result) {
        }
    });
}

 // Supprimer Type Document :
 openSupprimerDialog(): void {
    const dialogRef = this.dialog.open(DeleteChaineDialogComponent);

    dialogRef.afterClosed().subscribe((result) => {
        if (result) {
        }
    });
}
//   Modifier Type Courrier:
openModifierDialog() {
    const dialogRef = this.dialog.open(UpdateChaineDialogComponent);

    dialogRef.afterClosed().subscribe((result) => {
        if (result) {
        }
    });
}

}
