import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslocoModule, TranslocoService } from '@ngneat/transloco';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-registre-electronique',
  standalone: true,
  imports: [CommonModule,TranslocoModule],
  templateUrl: './registre-electronique.component.html',
  styleUrl: './registre-electronique.component.scss'
})
export class RegistreElectroniqueComponent {
    isChecked : boolean = false;
    toggleSwitch() {
        this.isChecked = !this.isChecked;
      }

      constructor(
        private translocoService: TranslocoService,
        private dialog: MatDialog
    ) {}
}
