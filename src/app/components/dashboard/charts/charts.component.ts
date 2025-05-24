import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ConfigService } from 'app/components/services/config.service';
import { DasboardService } from 'app/components/services/dasboard.service';
import { TranslocoModule, TranslocoService } from '@ngneat/transloco';
import { MaterialModuleModule } from 'shared/material-module/material-module.module';
import { DoneFlowChartComponent } from './done-flow-chart/done-flow-chart.component';
import { FolwsTableStatisticComponent } from './folws-table-statistic/folws-table-statistic.component';
import { FlowsChartsComponent } from './flows-charts/flows-charts.component';
import { InprogressComponent } from './inprogress/inprogress.component';

@Component({
    selector: 'app-charts',
    standalone: true,
    imports: [
        CommonModule,
        TranslocoModule,
        MaterialModuleModule,
        DoneFlowChartComponent,
        FolwsTableStatisticComponent,
        FlowsChartsComponent,
        InprogressComponent
    ],
    templateUrl: './charts.component.html',
    styleUrl: './charts.component.scss',
})
export class ChartsComponent implements OnInit {
    show;

    constructor(
        public config: ConfigService,
        private dashboardService: DasboardService
    ) {
        dashboardService.updateGetUpadte().subscribe((data) => {
            dashboardService.userSettings = data;
        });
    }

    ngOnInit() {}
    showDashboard(s) {
        this.show = s;
    }
    goBack() {
        history.back();
    }

    mousEnter(e: MouseEvent) {
        const target = e.currentTarget as HTMLElement;
        const wrapper = target.closest('.amg-floating-contact-wrap');
        wrapper?.classList.add('hover');
    }

    mouseLeav(e: MouseEvent) {
        const target = e.currentTarget as HTMLElement;
        target.classList.remove('hover');
    }
}
