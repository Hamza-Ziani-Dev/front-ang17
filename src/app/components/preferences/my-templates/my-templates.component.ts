import { Component, EventEmitter, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Subscription } from 'rxjs';
import { ToastrService } from 'ngx-toastr';
import { TexteditorService } from 'app/components/services/texteditor.service';
import { ConfigService } from 'app/components/services/config.service';
import { TexteditorComponentComponent } from 'app/components/texteditor/texteditor-component/texteditor-component.component';
import { NgxPaginationModule } from 'ngx-pagination';
import { MaterialModuleModule } from 'shared/material-module/material-module.module';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmeElementGroupComponent } from './confirme-element-group/confirme-element-group.component';
import { TranslocoModule, TranslocoService } from '@ngneat/transloco';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@Component({
    selector: 'app-my-templates',
    standalone: true,
    imports: [
        CommonModule,
        TexteditorComponentComponent,
        NgxPaginationModule,
        MaterialModuleModule,
        TranslocoModule,
        FormsModule,
        ReactiveFormsModule,
    ],
    templateUrl: './my-templates.component.html',
    styleUrl: './my-templates.component.scss',
})
export class MyTemplatesComponent implements OnInit {
    @ViewChild(TexteditorComponentComponent)
    editortext: TexteditorComponentComponent;
    loading = false;
    totalElements = -1;
    sub: Subscription;
    notifier = new EventEmitter();
    constructor(
        public toast: ToastrService,
        private dialog: MatDialog,
        private textEditorService: TexteditorService,
        public config: ConfigService,
        private translocoService: TranslocoService
    ) {}
    currenTempltate = {
        hasHeader: false,
        hasFooter: false,
        templateId: 'none',
        templateName: '',
        templateDesc: '',
        content: [
            {
                objectFormat: {
                    ops: [{ insert: ' ' }],
                },
                output: '',
            },
        ],
    };
   ngOnInit(): void {
    this.getTemplates(this.page, this.size, "")
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

    modelSaved(e) {
        this.textEditorService.openTemplate(e.id).subscribe((res) => {
            this.currentId = e.id;
            this.currenTempltate = e;
            setTimeout(() => {
                this.notifier.emit(e);
            }, 20);
        });
        this.filterIndex = '';
        this.filter();
    }
    newTemplate() {
        this.currentId = null;
        this.currenTempltate = {
            hasHeader: false,
            hasFooter: false,
            templateId: 'none',
            templateName: '',
            templateDesc: '',
            content: [
                {
                    objectFormat: {
                        ops: [{ insert: ' ' }],
                    },
                    output: '',
                },
            ],
        };

        setTimeout(() => {
            this.editortext.currentPage = 1;
            this.editortext.input.nativeElement.value = 1;
            this.notifier.emit({
                id: 'new',
                name: 'Sans nom',
                desc: 'desc',
                hasFooter: false,
                content:
                    '[{"objectFormat":{"ops":[{"insert":" "}]},"output":""}]\n',
                hasHeader: false,
            });
        }, 20);
    }

    clsAlphaNoOnly(e) {
        // Accept only alpha numerics, no special characters

        if (
            e.key == '[' ||
            e.key == ']' ||
            e.key == '\\' ||
            e.key == '%' ||
            e.key == '`'
        ) {
            e.preventDefault();
            return false;
        }
        return true;
    }

    index = 0;
    count = 0;
     getTemplates(page: number, size: number, pa: any) {
    this.totalElements = -1
    this.page = page

    if (this.index == this.count) {
      setTimeout(() => {
        this.textEditorService.getTemplates(this.page, size, this.filterIndex).subscribe(res => {
          this.totalElements = res.totalElements
          this.templates = res.content
          this.setInitCount()
        })
        this.index = this.count
      }, 500);
    }

    this.index++
  }
    filterIndex = '';
    currentId = null;
    openModel(item) {
        this.textEditorService.openTemplate(item.id).subscribe((res) => {
            this.currentId = res.id;
            this.currenTempltate = res;
            this.editortext.currentPage = 1;
            this.editortext.input.nativeElement.value = 1;
            setTimeout(() => {
                this.notifier.emit(res);
            }, 20);
        });
    }

    goPage(i) {
        this.getTemplates(i, this.size, '');
    }

   delete(t: any) {
  const dialogRef = this.dialog.open(ConfirmeElementGroupComponent, {
    disableClose: true,
    autoFocus: false,
    data: {
      title: this.translocoService.translate('common.supprimermodele') + t.name,
      message: this.translocoService.translate('common.etesvoussupprimer') + t.name,
      btnYes: this.translocoService.translate('common.supprimer'),
      btnNo: 'Non',
    }
  });

  dialogRef.afterClosed().subscribe((res: string) => {
    if (res === 'yes') {
      this.textEditorService.deleteTemplates(t.id).subscribe(
        () => {
          this.toast.error('', this.translocoService.translate('common.modele') + t.name + this.translocoService.translate('common.supprimersucces'));
          this.filter();
          this.notifier.emit({
            hasHeader: false,
            hasFooter: false,
            id: 'none',
            name: '',
            desc: '',
            content: [
              {
                objectFormat: { ops: [{ insert: ' ' }] },
                output: '',
              },
            ],
          });
        },
        () => {
          this.toast.error('', this.translocoService.translate('common.suppressionéchoué'));
        }
      );
    }
  });
}

}
