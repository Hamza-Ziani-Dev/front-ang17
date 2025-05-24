import { Component} from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialModuleModule } from 'shared/material-module/material-module.module';
import { TranslocoModule, TranslocoService } from '@ngneat/transloco';
import { MatDialog } from '@angular/material/dialog';
import { AddCategoriesCourrierDialogComponent } from 'app/components/dialogs/admin-dialogs/add-categories-courrier-dialog/add-categories-courrier-dialog.component';
import { UpdateCategoriesCourrierDialogComponent } from 'app/components/dialogs/admin-dialogs/update-categories-courrier-dialog/update-categories-courrier-dialog.component';
import { DeleteCategoriesCourrierDialogComponent } from 'app/components/dialogs/admin-dialogs/delete-categories-courrier-dialog/delete-categories-courrier-dialog.component';

@Component({
  selector: 'app-categories-courriers',
  standalone: true,
  imports: [CommonModule,MaterialModuleModule,TranslocoModule],
  templateUrl: './categories-courriers.component.html',
  styleUrl: './categories-courriers.component.scss'
})
export class CategoriesCourriersComponent {

    isChecked: boolean = false;
    constructor(
        private translocoService: TranslocoService,
        private dialog: MatDialog
    ) {
    }
    toggleSwitch() {
        this.isChecked = !this.isChecked;
    }


    // Ajouter Type Document :
    openAjouterCategoriesGroupsDialog(): void {
        const dialogRef = this.dialog.open(AddCategoriesCourrierDialogComponent);

        dialogRef.afterClosed().subscribe((result) => {
            if (result) {
            }
        });
    }

    // Supprimer Type Document :
    openSupprimerDialog(): void {
        const dialogRef = this.dialog.open(DeleteCategoriesCourrierDialogComponent
        );

        dialogRef.afterClosed().subscribe((result) => {
            if (result) {
            }
        });
    }
    //   Modifier Type Courrier:
    openModifierDialog() {
        const dialogRef = this.dialog.open(UpdateCategoriesCourrierDialogComponent
        );

        dialogRef.afterClosed().subscribe((result) => {
            if (result) {
            }
        });
    }
}
