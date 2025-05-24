import { CommonModule } from '@angular/common';
import { TranslocoService, TranslocoModule } from '@ngneat/transloco';
import { Router } from '@angular/router';
import { MaterialModuleModule } from 'shared/material-module/material-module.module';
import { Component} from '@angular/core';
import { MatDialog } from '@angular/material/dialog';


@Component({
  selector: 'app-organigramme',
  standalone: true,
  imports: [
    CommonModule,
    MaterialModuleModule,
],
  templateUrl: './organigramme.component.html',
  styleUrl: './organigramme.component.scss'
})
export class OrganigrammeComponent {

    ngOnInit(): void {
    }
    constructor(
        private translocoService: TranslocoService,
        private dialog: MatDialog
    ) {
    }



}
