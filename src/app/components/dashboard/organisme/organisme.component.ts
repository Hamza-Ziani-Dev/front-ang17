import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialModuleModule } from 'shared/material-module/material-module.module';
import { MatDialog } from '@angular/material/dialog';
import { TranslocoService ,TranslocoModule} from '@ngneat/transloco';
import { Router } from '@angular/router';

@Component({
  selector: 'app-organisme',
  standalone: true,
  imports: [CommonModule,MaterialModuleModule,TranslocoModule],
  templateUrl: './organisme.component.html',
  styleUrl: './organisme.component.scss'
})
export class OrganismeComponent {


    constructor(
        private dialog: MatDialog,
        private translocoService: TranslocoService,
        private router: Router
    ) {

    }

}
