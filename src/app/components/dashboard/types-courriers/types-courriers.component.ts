import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NumerotationAutomatiqueDialogComponent } from 'app/components/dialogs/admin-dialogs/numerotation-automatique-dialog/numerotation-automatique-dialog.component';
import { UpdateTypeCourrierDialogComponent } from 'app/components/dialogs/admin-dialogs/update-type-courrier-dialog/update-type-courrier-dialog.component';
import { DeleteTypeCourrierDialogComponent } from 'app/components/dialogs/admin-dialogs/delete-type-courrier-dialog/delete-type-courrier-dialog.component';
import { TranslocoService,TranslocoModule } from '@ngneat/transloco';
import { MatDialog } from '@angular/material/dialog';
import { AddTypeCourrierDialogComponent } from 'app/components/dialogs/admin-dialogs/add-type-courrier-dialog/add-type-courrier-dialog.component';
import { MaterialModuleModule } from 'shared/material-module/material-module.module';

@Component({
    selector: 'app-types-courriers',
    standalone: true,
    imports: [CommonModule,MaterialModuleModule,TranslocoModule],
    templateUrl: './types-courriers.component.html',
    styleUrl: './types-courriers.component.scss',
})
export class TypesCourriersComponent {
    isChecked: boolean = false;
    constructor(
        private translocoService: TranslocoService,
        private dialog: MatDialog
    ) {}
    toggleSwitch() {
        this.isChecked = !this.isChecked;
    }
    // Ajouter Type Courrier:
    openAddTypeCourrierDialog() {
        const dialogRef = this.dialog.open(AddTypeCourrierDialogComponent);
        dialogRef.afterClosed().subscribe((result) => {
            if (result) {
            }
        });
    }

    // Supprimer Type Courrier :
    openSupprimerDialog(): void {
        const dialogRef = this.dialog.open(DeleteTypeCourrierDialogComponent);
        dialogRef.afterClosed().subscribe((result) => {
            if (result) {
            }
        });
    }
    //   Modifier Type Courrier:
    openModifierDialog() {
        const dialogRef = this.dialog.open(UpdateTypeCourrierDialogComponent);

        dialogRef.afterClosed().subscribe((result) => {
            if (result) {
            }
        });
    }

    //   Numeration Automatique :
    openNumerotationAutomatiqueDialog() {
        const dialogRef = this.dialog.open(
            NumerotationAutomatiqueDialogComponent
        );
        dialogRef.afterClosed().subscribe((result) => {
            if (result) {
            }
        });
    }
}
