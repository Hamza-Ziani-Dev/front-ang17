import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ChartOptions, ChartType } from 'chart.js';
import { FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import colorLib from '@kurkle/color';
import { Chart, registerables } from 'chart.js';
import { DasboardService } from 'app/components/services/dasboard.service';
import { EditListDocService } from 'app/components/services/edit-list-doc.service';
import { ConfigService } from 'app/components/services/config.service';
import { MaterialModuleModule } from 'shared/material-module/material-module.module';
import { NgChartsModule } from 'ng2-charts';
@Component({
    selector: 'app-done-current-user',
    standalone: true,
    imports: [CommonModule,MaterialModuleModule,NgChartsModule,FormsModule,ReactiveFormsModule],
    templateUrl: './done-current-user.component.html',
    styleUrl: './done-current-user.component.scss',
})
export class DoneCurrentUserComponent implements OnInit {
    public pieChartLabels = [
        ['Download', 'Sales'],
        ['In', 'Store', 'Sales'],
        'Mail Sales',
    ];
    public pieChartData = { length: 0 };
    public pieChartType: ChartType = 'line';
    public pieChartLegend = true;
    public pieChartPlugins = [];
    public pieChartBackground = [];
    public legend = { postion: 'bottom' };

    isLoading = 1;
    tp: any;
    doctypes: Object;
    allowedYear = new Array<number>();
    showBy = 'year';

    myformD: FormGroup;
    defaultSettings = {};

    startDate: Date;
    endtDate: Date;

    dateSFC;
    dateEFC;
    changeStartDate(year) {
        this.startDate = year.target.value;
        this.valid();
    }

    changeEndDate(year) {
        this.endtDate = year.target.value;
        this.valid();
    }

    changeShowBy(event) {
        this.showBy = event.target.value;
        this.valid();
    }

    valid() {
        const body = {
            showBy: this.showBy,
            endDate: this.endtDate,
            startDate: this.startDate,
        };
        this.dashboardService.getDomeFlowByUser(body).subscribe((res) => {
            let bg = [];
            res.counts.forEach((e) => {
                // console.log(this.generateTransparentize() )
                // bg.push(this.generateTransparentize())
            });

            this.pieChartData = [
                {
                    data: res.counts2,
                    label: 'Flux traité en retard',
                    backgroundColor: '#FF0748',
                    borderColor: '#FF0748',
                },
                {
                    data: res.counts,
                    label: 'Flux traité',
                    hoverBackgroundColor: '#46c3b2',
                    backgroundColor: '#46c3b2',
                    borderColor: '#46c3b2',
                },
            ];

            this.pieChartLabels = [...res.names];

            this.isLoading = 0;
        });
    }
    myform: FormGroup;

    s: Date;
    e: Date;

    vDate;
    constructor(
        private dashboardService: DasboardService,
        private docserv: EditListDocService,
        private fb: FormBuilder,
        public config: ConfigService
    ) {
        this.defaultSettings = dashboardService.userSettings;
        this.myformD = this.fb.group({
            donePeriod: [
                this.defaultSettings['donePeriod'],
                [Validators.required],
            ],
            doneUnit: [this.defaultSettings['doneUnit'], [Validators.required]],
            doneShowBy: [
                this.defaultSettings['doneShowBy'],
                [Validators.required],
            ],
        });
        const d = new Date();
        this.endtDate = d;
        this.e = d;

        if (this.defaultSettings['doneUnit'] === 'year') {
            const dd = new Date();
            dd.setFullYear(
                dd.getFullYear() - this.defaultSettings['donePeriod']
            );
            this.s = new Date(dd.getTime());
            this.startDate = new Date(dd.getTime());
        }
        if (this.defaultSettings['doneUnit'] === 'month') {
            const dd = new Date();
            dd.setMonth(dd.getMonth() - this.defaultSettings['donePeriod']);
            this.s = new Date(dd.getTime());
            this.startDate = new Date(dd.getTime());
        }
        if (this.defaultSettings['doneUnit'] === 'day') {
            const dd = new Date();
            dd.setDate(dd.getDate() - this.defaultSettings['donePeriod']);
            this.s = new Date(dd.getTime());
            this.startDate = new Date(dd.getTime());
        }

        this.showBy = this.defaultSettings['doneShowBy'];

        this.myformD.valueChanges.subscribe((selectedValue) => {
            this.defaultSettings = selectedValue;
            if (this.defaultSettings['doneUnit'] === 'year') {
                const dd = new Date();
                dd.setFullYear(
                    dd.getFullYear() - this.defaultSettings['donePeriod']
                );
                this.s = new Date(dd.getTime());
                this.startDate = new Date(dd.getTime());
            }
            if (this.defaultSettings['doneUnit'] === 'month') {
                const dd = new Date();
                dd.setMonth(dd.getMonth() - this.defaultSettings['donePeriod']);
                this.s = new Date(dd.getTime());
                this.startDate = new Date(dd.getTime());
            }
            if (this.defaultSettings['doneUnit'] === 'day') {
                const dd = new Date();
                dd.setDate(dd.getDate() - this.defaultSettings['donePeriod']);
                this.s = new Date(dd.getTime());
                this.startDate = new Date(dd.getTime());
            }

            this.showBy = this.defaultSettings['doneShowBy'];

            this.valid();
        });
        this.dateSFC = new FormControl(this.startDate);
        this.dateEFC = new FormControl(new Date());
    }

    changeType(e, mode = 0) {
        if (mode == 1) {
            this.tp = e;
        } else {
            this.tp = e;
        }

        this.valid();
    }

    save() {
        this.dashboardService
            .updateGetUpadte(this.myformD.value)
            .subscribe((res) => {
                this.dashboardService.userSettings = res;
            });
    }

    getDocsTypes() {
        this.docserv.getlist().subscribe((resp) => {
            this.doctypes = resp;
            console.log(resp);
            this.tp = resp[0].id;

            this.myform = this.fb.group({
                tp: [this.tp, [Validators.required]],
                sDate: [this.startDate.toDateString(), [Validators.required]],
                eDate: [this.endtDate, [Validators.required]],
                showBy: [this.showBy, [Validators.required]],
            });

            const body = {
                showBy: this.showBy,
                endDate: this.endtDate,
                startDate: this.startDate,
            };
            this.dashboardService.getDomeFlowByUser(body).subscribe((res) => {
                let bg = [];
                res.counts.forEach((e) => {
                    // console.log(this.generateTransparentize() )
                    // bg.push(this.generateTransparentize())
                });

                this.pieChartData = [
                    {
                        data: [...res.counts2],
                        label: 'Flux traité en retard',
                        backgroundColor: '#FF0748',
                        borderColor: '#FF0748',
                        hoverBackgroundColor: '#FF0748',
                    },
                    {
                        data: [...res.counts],
                        label: 'Flux traité',
                        hoverBackgroundColor: '#46c3b2',
                        backgroundColor: '#46c3b2',
                        borderColor: '#46c3b2',
                    },
                ];

                this.pieChartLabels = [...res.names];

                this.isLoading = 0;
            });
        });
    }
    ngOnInit(): void {
        console.log('DoneFlowChartComponent');

        this.getDocsTypes();
    }

    generateTransparentize() {
        var alpha = 0.5;
        return colorLib('#' + Math.floor(Math.random() * 16777215).toString(16))
            .alpha(alpha)
            .rgbString();
    }

    // public pieChartOptions: ChartOptions = {
    //     responsive: true,
    //     scales: {
    //         yAxes: [
    //             {
    //                 ticks: {
    //                     beginAtZero: true,
    //                 },
    //             },
    //         ],
    //     },
    // };
    public pieChartOptions: ChartOptions<'bar'> = {
      responsive: true,
      scales: {
        y: {
          beginAtZero: true,
        },
      },
    };

    activePopover: 'filter' | 'default' | null = null;

togglePopover(name: 'filter' | 'default') {
  this.activePopover = this.activePopover === name ? null : name;
}
}
