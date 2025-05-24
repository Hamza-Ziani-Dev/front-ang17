import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ConfigService } from 'app/components/services/config.service';
import { MaterialModuleModule } from 'shared/material-module/material-module.module';
import { DoneGeneralCountsComponent } from '../done-general-counts/done-general-counts.component';
import { DoneByUserHierarchyComponent } from '../done-by-user-hierarchy/done-by-user-hierarchy.component';
import { DoneCurrentUserComponent } from '../done-current-user/done-current-user.component';
@Component({
  selector: 'app-done-flow-chart',
  standalone: true,
  imports: [CommonModule,MaterialModuleModule,DoneGeneralCountsComponent,DoneCurrentUserComponent,DoneByUserHierarchyComponent],
  templateUrl: './done-flow-chart.component.html',
  styleUrl: './done-flow-chart.component.scss'
})
export class DoneFlowChartComponent {
constructor(public config:ConfigService) { }

  ngOnInit(): void {
    console.log("DoneFlowChartComponent");
  }


  cTp = "";

  tp(c) {

    console.log(c);
    this.cTp = c;

  }
}
