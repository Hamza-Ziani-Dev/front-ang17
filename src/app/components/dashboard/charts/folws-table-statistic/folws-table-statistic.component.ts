import { Component, OnInit } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { DasboardService } from 'app/components/services/dasboard.service';
import { RestDataApiService } from 'app/components/services/rest-data-api.service';
import { ConfigService } from 'app/components/services/config.service';
import { MaterialModuleModule } from 'shared/material-module/material-module.module';
@Component({
    selector: 'app-folws-table-statistic',
    standalone: true,
    imports: [CommonModule,ReactiveFormsModule,FormsModule,MaterialModuleModule],
    templateUrl: './folws-table-statistic.component.html',
    styleUrl: './folws-table-statistic.component.scss',
    providers: [DatePipe]
})
export class FolwsTableStatisticComponent implements OnInit {
    isLoading = 1;
    tp: any;
    type: any;
    unit: any = 3600;
    min = 60;
    hour = 3600;
    day = 86400;
    doctypes: [];
    allowedYear = new Array<number>();
    folderType: any[];
    startDate: Date;
    endtDate: Date;
    dateSFC;
    dateEFC;
    usersStatistics: any[];
    dateNow: string;
    dateNowMinus: string;

    changeStartDate(year) {
        this.startDate = year.target.value;
        this.valid();
    }

    changeEndDate(year) {
        this.endtDate = year.target.value;
        this.valid();
    }

    valid() {
        const body = {
            endDate: this.myform.controls['eDate'].value,
            startDate: this.myform.controls['sDate'].value,
            tp: this.tp,
            type: this.type,
            unit: this.unit,
        };
        this.dashboardService.getStatisticUsers(body).subscribe((res) => {
            this.usersStatistics = res;
        });
    }

    s: Date;
    e: Date;
    myform: FormGroup;

    constructor(
        private dashboardService: DasboardService,
        private fb: FormBuilder,
        private datePipe: DatePipe,
        public config: ConfigService,
        private rest: RestDataApiService
    ) {
        this.dateNow = this.datePipe.transform(
            new Date().setHours(24),
            'yyyy-MM-dd'
        );
        this.dateNowMinus = this.datePipe.transform(
            new Date().setFullYear(new Date().getFullYear() - 1),
            'yyyy-MM-dd'
        );
        this.myform = this.fb.group({
            tp: [this.tp, [Validators.required]],
            sDate: [this.dateNowMinus, [Validators.required]],
            eDate: [this.dateNow, [Validators.required]],
            type: ['', [Validators.required]],
            unit: [60, [Validators.required]],
        });
    }

    changeFoldetType(e) {
        this.type = e;

        this.valid();
    }

    changeUnit(e) {
        this.unit = e;

        this.valid();
    }

    getDocsTypes() {
        this.dashboardService.getUserChilds().subscribe((resp) => {
            this.doctypes = resp;

            const body = {
                endDate: this.myform.controls['eDate'].value,
                startDate: this.myform.controls['sDate'].value,
                tp: this.tp,
                type: this.type,
                unit: this.unit,
            };
            this.dashboardService.getStatisticUsers(body).subscribe((res) => {
                this.usersStatistics = res;
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
}
