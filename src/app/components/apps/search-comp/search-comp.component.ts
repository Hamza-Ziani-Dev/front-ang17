import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Search } from 'app/components/models/search.model';
import { ConfigService } from 'app/components/services/config.service';
import { Router } from '@angular/router';
import { RestSearchApiService } from 'app/components/services/rest-search-api.service';
import { SessionService } from 'app/components/services/session.service';
import { ConfirmationComponent } from 'app/components/dialogs/confirmation/confirmation.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MaterialModuleModule } from 'shared/material-module/material-module.module';
import { MatDialog } from '@angular/material/dialog';
import { EditSearchComponent } from 'app/components/dialogs/edit-search/edit-search.component';
import { TranslocoModule, TranslocoService } from '@ngneat/transloco';

@Component({
    selector: 'app-search-comp',
    standalone: true,
    imports: [CommonModule,FormsModule,ReactiveFormsModule,MaterialModuleModule,TranslocoModule],
    templateUrl: './search-comp.component.html',
    styleUrl: './search-comp.component.scss',
})
export class SearchCompComponent {
    @Input() search: Search;
    @Output() refresh = new EventEmitter<any>();
    @Output() goResult = new EventEmitter<any>();
    searchForm;

    constructor(
        public config: ConfigService,
        private route: Router,
        private searchService: RestSearchApiService,
        public session: SessionService,
        private dialog : MatDialog,
        private translocoService: TranslocoService
        
    ) {}

    ngOnInit(): void {
        this.searchForm = JSON.parse(this.search.searchForm);
    }
    goTo() {
        this.goResult.emit(this.search);
    }

    delete() {
        const dialogRef = this.dialog.open(ConfirmationComponent, {
          disableClose: true,
          data: {
            target: "recherche"
          }
        });

        dialogRef.componentInstance.pass.subscribe((resp: string) => {
          if (resp === 'yes') {
            this.searchService.deleteSearch(this.search.id).subscribe(() => {
              this.refresh.emit();
            });
          }
          dialogRef.close();
        });
      }
    edit() {
        const dialogRef = this.dialog.open(EditSearchComponent, {
          disableClose: true,
          data: { search: this.search },
        });

        dialogRef.afterClosed().subscribe(() => {
          this.refresh.emit();
        });
      }

}
