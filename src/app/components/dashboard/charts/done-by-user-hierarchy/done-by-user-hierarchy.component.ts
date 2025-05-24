import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
    FormBuilder,
    FormControl,
    FormGroup,
    FormsModule,
    ReactiveFormsModule,
    Validators,
} from '@angular/forms';
import { DasboardService } from 'app/components/services/dasboard.service';
import { ConfigService } from 'app/components/services/config.service';
import { RestDataApiService } from 'app/components/services/rest-data-api.service';
import colorLib from '@kurkle/color';
import { ChartType, ChartOptions } from 'chart.js';
import { MaterialModuleModule } from 'shared/material-module/material-module.module';
import { NgChartsModule } from 'ng2-charts';

@Component({
    selector: 'app-done-by-user-hierarchy',
    standalone: true,
    imports: [
        CommonModule,
        MaterialModuleModule,
        NgChartsModule,
        FormsModule,
        ReactiveFormsModule,
    ],
    templateUrl: './done-by-user-hierarchy.component.html',
    styleUrl: './done-by-user-hierarchy.component.scss',
})
export class DoneByUserHierarchyComponent implements OnInit {
    public pieChartLabels = [
        ['Download', 'Sales'],
        ['In', 'Store', 'Sales'],
        'Mail Sales',
    ];
    public pieChartData = {};
    public pieChartType: ChartType = 'bar';
    public pieChartLegend = false;
    public pieChartPlugins = [];
    public pieChartBackground = [];
    public legend = { postion: 'bottom' };

    isLoading = 1;
    tp: any;
    type: any;
    doctypes: [];
    allowedYear = new Array<number>();
    showBy = 'year';
    folderType: any[];

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
            tp: this.tp,
            type: this.type,
        };
        this.dashboardService.getDomeFlowByUser(body).subscribe((res) => {
            let bg = [];
            res.counts.forEach((e) => {
                // console.log(this.generateTransparentize() )
                // bg.push(this.generateTransparentize())
            });

            this.pieChartData = [{ data: [...res.counts] }];

            this.pieChartLabels = [...res.names];

            this.isLoading = 0;
        });
    }
    myform: FormGroup;
    s: Date;
    e: Date;
    myformD: FormGroup;
    defaultSettings = {};
    constructor(
        private dashboardService: DasboardService,
        private fb: FormBuilder,
        public config: ConfigService,
        private rest: RestDataApiService
    ) {
        this.defaultSettings = dashboardService.userSettings;
        this.myformD = this.fb.group({
            hierarchPeriod: [
                this.defaultSettings['hierarchPeriod'],
                [Validators.required],
            ],
            hierarchUnit: [
                this.defaultSettings['hierarchUnit'],
                [Validators.required],
            ],
            hierarchShowBy: [
                this.defaultSettings['hierarchShowBy'],
                [Validators.required],
            ],
            hierarchUser: [
                this.defaultSettings['hierarchUser'],
                [Validators.required],
            ],
        });

        const d = new Date();
        this.endtDate = d;
        this.e = d;

        if (this.defaultSettings['hierarchUnit'] === 'year') {
            const dd = new Date();
            dd.setFullYear(
                dd.getFullYear() - this.defaultSettings['hierarchPeriod']
            );
            this.s = new Date(dd.getTime());
            this.startDate = new Date(dd.getTime());
        }
        if (this.defaultSettings['hierarchUnit'] === 'month') {
            const dd = new Date();
            dd.setMonth(dd.getMonth() - this.defaultSettings['hierarchPeriod']);
            this.s = new Date(dd.getTime());
            this.startDate = new Date(dd.getTime());
        }
        if (this.defaultSettings['hierarchUnit'] === 'day') {
            const dd = new Date();
            dd.setDate(dd.getDate() - this.defaultSettings['hierarchPeriod']);
            this.s = new Date(dd.getTime());
            this.startDate = new Date(dd.getTime());
        }

        this.showBy = this.defaultSettings['hierarchShowBy'];

        this.myformD.valueChanges.subscribe((selectedValue) => {
            this.defaultSettings = selectedValue;
            if (this.defaultSettings['hierarchUnit'] === 'year') {
                const dd = new Date();
                dd.setFullYear(
                    dd.getFullYear() - this.defaultSettings['hierarchPeriod']
                );
                this.s = new Date(dd.getTime());
                this.startDate = new Date(dd.getTime());
            }
            if (this.defaultSettings['hierarchUnit'] === 'month') {
                const dd = new Date();
                dd.setMonth(
                    dd.getMonth() - this.defaultSettings['hierarchPeriod']
                );
                this.s = new Date(dd.getTime());
                this.startDate = new Date(dd.getTime());
            }
            if (this.defaultSettings['hierarchUnit'] === 'day') {
                const dd = new Date();
                dd.setDate(
                    dd.getDate() - this.defaultSettings['hierarchPeriod']
                );
                this.s = new Date(dd.getTime());
                this.startDate = new Date(dd.getTime());
            }

            this.showBy = this.defaultSettings['hierarchShowBy'];

            this.valid();
        });

        this.dateSFC = new FormControl(this.startDate);
        this.dateEFC = new FormControl(new Date());
    }

    changeType(e, mode = 0) {
        const t = this.doctypes.filter((d) => {
            return d['userId'] == e;
        });
        this.c.emit(t[0]['fullName']);
        if (mode == 1) {
            this.tp = e;
        } else {
            this.tp = e;
        }

        this.valid();
    }

    changeFoldetType(e) {
        this.type = e;

        this.valid();
    }
    @Output() c = new EventEmitter();

    save() {
        this.dashboardService
            .updateGetUpadte(this.myformD.value)
            .subscribe((res) => {
                this.dashboardService.userSettings = res;
            });
    }

    getDocsTypes() {
        this.dashboardService.getUserChilds().subscribe((resp) => {
            this.doctypes = resp;

            if (this.defaultSettings['hierarchUser']) {
                this.tp = this.defaultSettings['hierarchUser'];
                const t = this.doctypes.filter((d) => {
                    return d['userId'] == this.tp;
                });
                this.c.emit(t[0]['fullName']);
            } else {
                this.tp = resp[0].userId;
                this.c.emit(resp[0]['fullName']);
            }

            this.myform = this.fb.group({
                tp: [this.tp, [Validators.required]],
                sDate: [this.startDate.toDateString(), [Validators.required]],
                eDate: [this.endtDate, [Validators.required]],
                showBy: [this.showBy, [Validators.required]],
                type: ['', [Validators.required]],
            });

            const body = {
                showBy: this.showBy,
                endDate: this.endtDate,
                startDate: this.startDate,
                tp: this.tp,
                type: this.type,
            };
            this.dashboardService.getDomeFlowByUser(body).subscribe((res) => {
                let bg = [];
                res.counts.forEach((e) => {
                    // console.log(this.generateTransparentize() )
                    // bg.push(this.generateTransparentize())
                });

                this.pieChartData = [{ data: [...res.counts] }];

                this.pieChartLabels = [...res.names];

                this.isLoading = 0;
            });
        });
    }

    getFolderType() {
        this.rest.getFloderTypes().subscribe((response: any) => {
            this.folderType = response;
            this.type = this.folderType[0].id;
            this.getDocsTypes();
        });
    }

    ngOnInit(): void {
        this.getFolderType();
    }

    generateTransparentize() {
        var alpha = 0.5;
        return colorLib('#' + Math.floor(Math.random() * 16777215).toString(16))
            .alpha(alpha)
            .rgbString();
    }

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
