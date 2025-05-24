import {
    ChangeDetectionStrategy,
    Component,
    ElementRef,
    AfterViewInit,
    OnDestroy,
    OnInit,
    ViewChild,
    ViewEncapsulation,
} from '@angular/core';
import { TranslocoModule, TranslocoService } from '@ngneat/transloco';
import { MaterialModuleModule } from 'shared/material-module/material-module.module';
import * as echarts from 'echarts';
import { NgIf } from '@angular/common';

@Component({
    selector: 'app-admins',
    templateUrl: './admins.component.html',
    styleUrls: ['./admins.component.scss'],
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: true,
    imports: [TranslocoModule, MaterialModuleModule, NgIf],
})
export class AdminsComponent implements OnInit, OnDestroy {
    @ViewChild('chart', { static: false }) chartElement!: ElementRef;

    showCourrierEnCours = true;
    showCourrierTraite = true;
    showCourrierMonEquipe = true;

    private data = {
        jour: [0.2, 1, 0.4, 0.2, 0.3, 0.7, 0.1],
        week: [0.5, 0.8, 0.6, 0.4, 0.5, 0.7, 0.9],
        month: [0.3, 0.6, 0.8, 0.5, 0.4, 0.7, 0.2],
        year: [0.4, 0.6, 0.7, 0.5, 0.8, 0.9, 1.0],
    };

    selectedTimeFrame: string = 'week';


    constructor(
        private translocoService: TranslocoService,
    ){
        setTimeout(() => {
            this.initCharts(this.selectedTimeFrame);
        }, 1000);
    }


    initCharts(timeFrame: string) {
        if (this.chartElement) {
            this.initChart(this.chartElement, timeFrame);
        } else {
            console.error('Chart element is not available');
        }
    }

    initChart(chartElement: ElementRef, timeFrame: string) {
        const chart = echarts.init(chartElement.nativeElement);
        const option = this.getChartOptions(timeFrame);
        chart.setOption(option);
    }



    getChartOptions(timeFrame: string) {
        const colors = this.getColors(timeFrame);
        const xAxisData = this.getXAxisData(timeFrame);
        return {
            tooltip: {
                trigger: 'axis',
                axisPointer: {
                    type: 'shadow',
                },
            },
            grid: {
                left: '3%',
                right: '4%',
                bottom: '3%',
                containLabel: true,
            },
            xAxis: [
                {
                    type: 'category',
                    data: xAxisData,
                    axisTick: {
                        alignWithLabel: true,
                    },
                },
            ],
            yAxis: [
                {
                    type: 'value',
                    min: 0,
                    max: 1,
                    interval: 0.1,
                    axisLabel: {
                        formatter: '{value}',
                    },
                },
            ],
            series: [
                {
                    name: 'Direct',
                    type: 'bar',
                    barWidth: '60%',
                    data: this.data[timeFrame],
                    itemStyle: {
                        color: colors,
                    },
                },
            ],
        };
    }

    getXAxisData(timeFrame: string) {
        switch (timeFrame) {
            case 'jour':
                return ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
            case 'week':
                return ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
            case 'month':
                return ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
            case 'year':
                return ['2023', '2024', '2025', '2026', '2027', '2028', '2029'];
            default:
                return []; // Fallback
        }
    }

    getColors(timeFrame: string) {
        switch (timeFrame) {
            case 'jour':
                return 'lightblue';
            case 'week':
                return 'lightgreen';
            case 'month':
                return 'lightcoral';
            case 'year':
                return 'lightgoldenrodyellow';
            default:
                return 'gray'; // Fallback color
        }
    }

    onTimeFrameChange(timeFrame: string) {
        this.selectedTimeFrame = timeFrame;
        this.initCharts(timeFrame);
    }

    ngOnInit() {
        // Any initialization logic can go here
    }

    ngOnDestroy() {
        // Clean up any resources if necessary
    }
}
