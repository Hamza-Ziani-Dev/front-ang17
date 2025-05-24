import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialModuleModule } from 'shared/material-module/material-module.module';
import { TranslocoModule, TranslocoService } from '@ngneat/transloco';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-notifications',
  standalone: true,
  imports: [CommonModule,MaterialModuleModule,TranslocoModule],
  templateUrl: './notifications.component.html',
  styleUrl: './notifications.component.scss'
})
export class NotificationsComponent {
    isChecked : boolean = false;
    toggleSwitch() {
        this.isChecked = !this.isChecked;
      }

      constructor(
        private translocoService: TranslocoService,
        private dialog: MatDialog
    ) {
    }
}
