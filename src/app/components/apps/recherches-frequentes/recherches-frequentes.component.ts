import { Component, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialModuleModule } from 'shared/material-module/material-module.module';
import { SearchResultComponent } from '../search-result/search-result.component';
import { MatDrawer } from '@angular/material/sidenav';
import { ConfigService } from 'app/components/services/config.service';
import { RestSearchApiService } from 'app/components/services/rest-search-api.service';
import { PreviousRouteService } from 'app/components/services/previous-route.service';
import { Router } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgxPaginationModule } from 'ngx-pagination';
import { SearchCompComponent } from '../search-comp/search-comp.component';
import { TranslocoModule, TranslocoService } from '@ngneat/transloco';



@Component({
    selector: 'app-recherches-frequentes',
    standalone: true,
    imports: [
        CommonModule,
        MaterialModuleModule,
        TranslocoModule,
        FormsModule,
        ReactiveFormsModule,
        NgxPaginationModule,
        SearchCompComponent,
        SearchResultComponent
    ],
    templateUrl: './recherches-frequentes.component.html',
    styleUrl: './recherches-frequentes.component.scss',
})
export class RecherchesFrequentesComponent {
    @ViewChild('matDrawer') matDrawer!: MatDrawer;
    result: boolean = false;


    currentSearchId;
    totalePages: number;
    searchesList;
    page = 0;
    pages: number[];
    pageSize;
    currentSearchName: any;
    countOfSearches = 0;
    totalEl;
    totalCheck = -1;
    constructor(
        public config: ConfigService,
        private searchServ: RestSearchApiService,
        private previous: PreviousRouteService,
        private route: Router,
        private translocoService: TranslocoService
    ) {}

    ngOnInit(): void {
        this.getSearchs();
    }

    openDetailsDrawer(id: number) {
        this.matDrawer.open();
    }

    closeDrawer() {
        this.matDrawer.close();
    }

    getSearchs() {
        this.totalCheck = -1;
        this.searchServ.getFrequencySearcheq(this.page).subscribe((res) => {
            this.totalEl = res['totalElements'];

            this.searchesList = res['content'];
            const totalePages = res['totalPages'];
            this.countOfSearches = res['totalElements'];
            this.pages = new Array<number>(totalePages);
            this.pages.length = totalePages;
            this.totalCheck = 1;
        });
    }
    goPage(i) {
        this.page = i;
        this.getSearchs();
    }
    refresh(e) {
        this.getSearchs();
    }
    search;
    getResult(e) {
        this.result = true;
        this.currentSearchId = e.id;
        this.currentSearchName = e.name;
        this.search = e;
    }

    goBack() {
        if (!this.result) {
            this.route.navigateByUrl('dashboards');
        } else {
            this.result = false;
        }
    }
}
