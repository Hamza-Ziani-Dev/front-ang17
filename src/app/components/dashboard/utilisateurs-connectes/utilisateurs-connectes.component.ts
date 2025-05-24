import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialModuleModule } from 'shared/material-module/material-module.module';
import { TranslocoService,TranslocoModule } from '@ngneat/transloco';
import { MatDialog } from '@angular/material/dialog';
@Component({
  selector: 'app-utilisateurs-connectes',
  standalone: true,
  imports: [CommonModule,MaterialModuleModule,TranslocoModule],
  templateUrl: './utilisateurs-connectes.component.html',
  styleUrl: './utilisateurs-connectes.component.scss'
})
export class UtilisateursConnectesComponent {
    utilisateursConnectes = [
        {
            id: 1,
            nom: 'Hamza Elgammal',
            dateconnecxion: '12-05-2022',
            finsession: '12-05-2022'
        },
        {
            id: 2,
            nom: 'Mehdi Elgammal',
            dateconnecxion: '10-04-2020',
            finsession: '01-03-2021'
        },
    ]
    constructor(
        private translocoService: TranslocoService,
        private dialog: MatDialog
    ) {}

    ngOnInit(): void {
        const utilisateursConnectes = [
            {
                id: 1,
                nom: 'Hamza Elgammal',
                dateconnecxion: '12-05-2022',
                finsession: '12-05-2022'
            },
            {
                id: 2,
                nom: 'Mehdi Elgammal',
                dateconnecxion: '10-04-2020',
                finsession: '01-03-2021'
            },
        ]
    }
}
