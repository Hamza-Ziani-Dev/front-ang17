import { Component, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslocoService,TranslocoModule } from '@ngneat/transloco';
import { MatDialog } from '@angular/material/dialog';
import { MatDrawer } from '@angular/material/sidenav';
import { MaterialModuleModule } from 'shared/material-module/material-module.module';
import { FormsModule } from '@angular/forms';
import { AddProcessusComponent } from 'app/components/dialogs/admin-dialogs/add-processus/add-processus.component';
import { UpdateProcessusComponent } from 'app/components/dialogs/admin-dialogs/update-processus/update-processus.component';
import { DeleteProcessusComponent } from 'app/components/dialogs/admin-dialogs/delete-processus/delete-processus.component';
import { DetailsProcessusComponent } from 'app/components/dialogs/admin-dialogs/details-processus/details-processus.component';


@Component({
  selector: 'app-processus',
  standalone: true,
  imports: [CommonModule,MaterialModuleModule,FormsModule,TranslocoModule],
  templateUrl: './processus.component.html',
  styleUrl: './processus.component.scss'
})
export class ProcessusComponent {
    @ViewChild('matDrawer') matDrawer!: MatDrawer;
    drawerMode: 'side' | 'over';
    isChecked: boolean = false;
    constructor(
        private translocoService: TranslocoService,
        private dialog: MatDialog
    ) {}
    toggleSwitch() {
        this.isChecked = !this.isChecked;
    }

    openDetailsDocuments() {
        this.matDrawer.toggle();
    }
    // Method to close the drawer
    closeDrawer() {
        this.matDrawer.close();
    }

    // Ajouter Processus :
    openAjouterProcessusDialog(): void {
        const dialogRef = this.dialog.open(AddProcessusComponent);

        dialogRef.afterClosed().subscribe((result) => {
            if (result) {
            }
        });
    }

     // Supprimer Processus:
     openSupprimerProcessusDialog(): void {
        const dialogRef = this.dialog.open(DeleteProcessusComponent);

        dialogRef.afterClosed().subscribe((result) => {
            if (result) {
            }
        });
    }
    //   Modifier Type Courrier:
    openModifierDialog() {
        const dialogRef = this.dialog.open(UpdateProcessusComponent);

        dialogRef.afterClosed().subscribe((result) => {
            if (result) {
            }
        });
    }

     // Details Processus dialog :
     opendetailsProcessusDialog() {
        const dialogRef = this.dialog.open(DetailsProcessusComponent);

        dialogRef.afterClosed().subscribe((result) => {
            if (result) {
            }
        });
    }
}
