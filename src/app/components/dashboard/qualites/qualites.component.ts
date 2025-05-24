import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialModuleModule } from 'shared/material-module/material-module.module';
import { TranslocoModule, TranslocoService } from '@ngneat/transloco';
import { MatDialog } from '@angular/material/dialog';
import { AddQualiteDialogComponent } from 'app/components/dialogs/admin-dialogs/add-qualite-dialog/add-qualite-dialog.component';
import { DeleteQualiteDialogComponent } from 'app/components/dialogs/admin-dialogs/delete-qualite-dialog/delete-qualite-dialog.component';
import { UpdateQualiteDialogComponent } from 'app/components/dialogs/admin-dialogs/update-qualite-dialog/update-qualite-dialog.component';
interface Qualite {
    nomQualite: string;
    codeQualite: string;
    accesSubordonnee: string;
    passerDirectement: string;
    notification: string;
}
@Component({
  selector: 'app-qualites',
  standalone: true,
  imports: [CommonModule,MaterialModuleModule,TranslocoModule],
  templateUrl: './qualites.component.html',
  styleUrl: './qualites.component.scss'
})
export class QualitesComponent {
    qualites: Qualite[] = [];
    selectedQualites: Qualite[] = [];

    constructor(
        private translocoService: TranslocoService,
        private dialog: MatDialog
    ) {
        this.qualites = [
            { "nomQualite": "Directeur Général", "codeQualite": "DG", "accesSubordonnee": "Oui", "passerDirectement": "Non", "notification": "Oui" },
            { "nomQualite": "Bureaux d'ordre", "codeQualite": "BO", "accesSubordonnee": "Non", "passerDirectement": "Oui", "notification": "Non" },
            { "nomQualite": "Cadre", "codeQualite": "CD", "accesSubordonnee": "Non", "passerDirectement": "Non", "notification": "Non" },
            { "nomQualite": "Master", "codeQualite": "MS", "accesSubordonnee": "Non", "passerDirectement": "Non", "notification": "Non" },
            { "nomQualite": "Chef Département", "codeQualite": "CDP", "accesSubordonnee": "Oui", "passerDirectement": "Non", "notification": "Oui" },
            { "nomQualite": "Chef Service", "codeQualite": "CS", "accesSubordonnee": "Oui", "passerDirectement": "Non", "notification": "Oui" },
            { "nomQualite": "Secrétaire général", "codeQualite": "SG", "accesSubordonnee": "Non", "passerDirectement": "Non", "notification": "Oui" }
        ];
    }

    addSelectedItem(event: Event): void {
        const select = event.target as HTMLSelectElement;
        const selectedValue = select.value;
        const selectedQualite = this.qualites.find(q => q.nomQualite === selectedValue);

        if (selectedQualite && !this.selectedQualites.some(q => q.nomQualite === selectedQualite.nomQualite)) {
            this.selectedQualites.push(selectedQualite);
        }

        // Reset select value
        select.value = '';
    }

    removeSelectedItem(qualite: Qualite): void {
        this.selectedQualites = this.selectedQualites.filter(q => q.nomQualite !== qualite.nomQualite);
    }


     // Ajouter Type Document :
     openAjouterTypeDocumentDialog(): void {
        const dialogRef = this.dialog.open(AddQualiteDialogComponent);

        dialogRef.afterClosed().subscribe((result) => {
            if (result) {
            }
        });
    }

     // Supprimer Type Document :
     openSupprimerDialog(): void {
        const dialogRef = this.dialog.open(DeleteQualiteDialogComponent);

        dialogRef.afterClosed().subscribe((result) => {
            if (result) {
            }
        });
    }
    //   Modifier Type Courrier:
    openModifierDialog() {const dialogRef = this.dialog.open(UpdateQualiteDialogComponent);

        dialogRef.afterClosed().subscribe((result) => {
            if (result) {
            }
        });
    }


}
