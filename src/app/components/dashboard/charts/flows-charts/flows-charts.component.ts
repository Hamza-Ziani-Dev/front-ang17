import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ConfigService } from 'app/components/services/config.service';
import { TranslocoModule, TranslocoService } from '@ngneat/transloco';
import { MaterialModuleModule } from 'shared/material-module/material-module.module';
import { GeneralCountsComponent } from '../general-counts/general-counts.component';
import { InprogressComponent } from '../inprogress/inprogress.component';
import { InprogressredComponent } from '../inprogressred/inprogressred.component';

@Component({
  selector: 'app-flows-charts',
  standalone: true,
  imports: [CommonModule,TranslocoModule,MaterialModuleModule,GeneralCountsComponent,InprogressComponent,InprogressredComponent],
  templateUrl: './flows-charts.component.html',
  styleUrl: './flows-charts.component.scss'
})
export class FlowsChartsComponent implements OnInit {
     constructor(public config:ConfigService) { }

  ngOnInit(): void {
  }

}
