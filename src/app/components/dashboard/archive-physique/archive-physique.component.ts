import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialModuleModule } from 'shared/material-module/material-module.module';
import { TranslocoModule, TranslocoService } from '@ngneat/transloco';

@Component({
  selector: 'app-archive-physique',
  standalone: true,
  imports: [CommonModule,MaterialModuleModule,TranslocoModule],
  templateUrl: './archive-physique.component.html',
  styleUrl: './archive-physique.component.scss'
})
export class ArchivePhysiqueComponent {
    isChecked : boolean = false;
    toggleSwitch() {
        this.isChecked = !this.isChecked;
      }

      constructor(
        private translocoService: TranslocoService,
      ){}
}
