import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TexteditorService } from 'app/components/services/texteditor.service';
import { ConfigService } from 'app/components/services/config.service';
import { MatDialogRef } from '@angular/material/dialog';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MaterialModuleModule } from 'shared/material-module/material-module.module';
import { NgxPaginationModule } from 'ngx-pagination';

@Component({
    selector: 'app-load-model-dialog',
    standalone: true,
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        MaterialModuleModule,
        NgxPaginationModule,
    ],
    templateUrl: './load-model-dialog.component.html',
    styleUrl: './load-model-dialog.component.scss',
})
export class LoadModelDialogComponent {
    loading = false;
    totalElements = -1;

    @Output() passModel = new EventEmitter<any>();

    constructor(
        private textEditorService: TexteditorService,
        public config: ConfigService,
        public loadClose: MatDialogRef<LoadModelDialogComponent>
    ) {}

    ngOnInit(): void {
        this.getTemplates(this.page, this.size, '');
    }
    page = 0;
    size = 4;

    filter() {
        this.filterSearch(this.filterIndex, this.page);
    }

    initCount = 0;
    setInitCount() {
        if (!this.initCount) this.initCount = this.totalElements;
    }
    filterSearch(pa, pg) {
        const p = pa != '' ? pa : ' ';

        this.getTemplates(0, this.size, pa);
    }

    templates = [];
    getTemplates(page: number, size: number, pa: any) {
        this.totalElements = -1;
        this.page = page;
        this.textEditorService
            .getTemplates(this.page, size, this.filterIndex)
            .subscribe((res) => {
                console.log('Responce ', res);

                this.templates = res.content;
                this.totalElements = res.totalElements;

                this.setInitCount();
            });
    }
    filterIndex = '';
    openModel(item) {
        this.textEditorService.openTemplate(item.id).subscribe((res) => {
            this.passModel.emit(res);
        });
    }

    goPage(i) {
        this.getTemplates(i, this.size, '');
    }
}
