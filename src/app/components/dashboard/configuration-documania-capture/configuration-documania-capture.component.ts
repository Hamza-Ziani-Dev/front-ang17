import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialModuleModule } from 'shared/material-module/material-module.module';
import { TranslocoModule, TranslocoService } from '@ngneat/transloco';

@Component({
  selector: 'app-configuration-documania-capture',
  standalone: true,
  imports: [CommonModule,MaterialModuleModule,TranslocoModule],
  templateUrl: './configuration-documania-capture.component.html',
  styleUrl: './configuration-documania-capture.component.scss'
})
export class ConfigurationDocumaniaCaptureComponent {
    isChecked : boolean = false;
    toggleSwitch() {
        this.isChecked = !this.isChecked;
      }

      constructor(
        private translocoService: TranslocoService,
    ) {
    }
}
