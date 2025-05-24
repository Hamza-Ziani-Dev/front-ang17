import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ConfigService } from 'app/components/services/config.service';

@Component({
  selector: 'app-no-result-founded',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './no-result-founded.component.html',
  styleUrl: './no-result-founded.component.scss'
})
export class NoResultFoundedComponent {
    constructor(public config :ConfigService) { }

    ngOnInit(): void {
    }
}
