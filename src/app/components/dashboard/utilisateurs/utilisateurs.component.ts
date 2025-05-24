import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialModuleModule } from 'shared/material-module/material-module.module';
import { TranslocoService,TranslocoModule } from '@ngneat/transloco';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-utilisateurs',
  standalone: true,
  imports: [CommonModule,MaterialModuleModule,TranslocoModule],
  templateUrl: './utilisateurs.component.html',
  styleUrl: './utilisateurs.component.scss'
})
export class UtilisateursComponent {
    isChecked : boolean = false;
    toggleSwitch() {
        this.isChecked = !this.isChecked;
      }

      constructor(
        private translocoService: TranslocoService,
        private dialog: MatDialog
    ) {}
}
