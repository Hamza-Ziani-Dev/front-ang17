import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialModuleModule } from 'shared/material-module/material-module.module';
import { TranslocoService ,TranslocoModule} from '@ngneat/transloco';
import { MatDialog } from '@angular/material/dialog';
import { DeleteGroupUtilisateurDialogComponent } from 'app/components/dialogs/admin-dialogs/delete-group-utilisateur-dialog/delete-group-utilisateur-dialog.component';
import { UpdateGroupUtilisateurDialogComponent } from 'app/components/dialogs/admin-dialogs/update-group-utilisateur-dialog/update-group-utilisateur-dialog.component';
import { AddGroupUtilisateurDialogComponent } from 'app/components/dialogs/admin-dialogs/add-group-utilisateur-dialog/add-group-utilisateur-dialog.component';

@Component({
  selector: 'app-groupe-utilisateurs',
  standalone: true,
  imports: [CommonModule,MaterialModuleModule,TranslocoModule],
  templateUrl: './groupe-utilisateurs.component.html',
  styleUrl: './groupe-utilisateurs.component.scss'
})
export class GroupeUtilisateursComponent {
    constructor(
        private translocoService: TranslocoService,
        private dialog: MatDialog
    ) {
    }

     // Ajouter Type Document :
     openAjouterGroupsDocumentDialog(): void {
        const dialogRef = this.dialog.open(AddGroupUtilisateurDialogComponent);

        dialogRef.afterClosed().subscribe((result) => {
            if (result) {
            }
        });
    }

    // Supprimer Type Document :
    openSupprimerDialog(): void {
        const dialogRef = this.dialog.open(
            DeleteGroupUtilisateurDialogComponent
        );

        dialogRef.afterClosed().subscribe((result) => {
            if (result) {
            }
        });
    }
    //   Modifier Type Courrier:
    openModifierDialog() {
        const dialogRef = this.dialog.open(
            UpdateGroupUtilisateurDialogComponent
        );

        dialogRef.afterClosed().subscribe((result) => {
            if (result) {
            }
        });
    }
}
