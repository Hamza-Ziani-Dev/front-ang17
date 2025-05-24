import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialModuleModule } from 'shared/material-module/material-module.module';
import { TranslocoModule, TranslocoService } from '@ngneat/transloco';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-ldap',
  standalone: true,
  imports: [CommonModule,MaterialModuleModule,TranslocoModule],
  templateUrl: './ldap.component.html',
  styleUrl: './ldap.component.scss'
})
export class LdapComponent {
    constructor(
        private translocoService: TranslocoService,
        private dialog: MatDialog
    ) {
    }
}
