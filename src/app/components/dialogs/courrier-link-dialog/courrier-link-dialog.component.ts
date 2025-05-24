import { Component, EventEmitter, Inject, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MaterialModuleModule } from 'shared/material-module/material-module.module';
import { ConfigService } from 'app/components/services/config.service';
import { RestSearchApiService } from 'app/components/services/rest-search-api.service';
import { ConfirmationEditDialogComponent } from '../confirmation-edit-dialog/confirmation-edit-dialog.component';

@Component({
    selector: 'app-courrier-link-dialog',
    standalone: true,
    imports: [CommonModule, MaterialModuleModule],
    templateUrl: './courrier-link-dialog.component.html',
    styleUrl: './courrier-link-dialog.component.scss',
})
export class CourrierLinkDialogComponent {
    @Output() back = new EventEmitter<any>();
    @Input() docId;
    courriers;
    page: number;
    pages = new Array<number>();
    isResult;
    elemeNumber: number;

    constructor(
        @Inject(MAT_DIALOG_DATA) public data: any,
        private dialogRef: MatDialogRef<CourrierLinkDialogComponent>,
        private dialog: MatDialog,
        public config: ConfigService,
        private rest: RestSearchApiService
    ) {}

    ngOnInit(): void {
        this.goPage(0);
    }

    goPage(i) {
        this.page = i;
        this.getResult();
    }

    getResult() {
        this.rest.courrierAccus(this.page, 12).subscribe((r) => {
            //console.log(r)
            this.courriers = r['content'];
            const totalePages = r['totalPages'];
            this.elemeNumber = r['numberOfElements'];
            this.pages = new Array<number>(totalePages);
            for (let index = 0; index < this.pages.length; index++) {
                this.pages[index] = index;
            }
        });
    }
    link(f: any): void {
        const dialogRef = this.dialog.open(ConfirmationEditDialogComponent, {
          disableClose: true, // Similar to 'static' backdrop
        //   width: '400px', // Adjust as needed
          data: {
            title: "Confirmation de liaison",
            text: "Voulez-vous vraiment lier l'accusé de réception avec ce courrier ?",
          },
        });

        // Handle dialog result
        dialogRef.afterClosed().subscribe((result) => {
          if (result === 'yes') {
            this.rest.linkCourrierAccuse(this.docId, f.id).subscribe((r) => {
              this.dialogRef.close();
              this.back.emit('ok');
            });
          }
        });
      }

    // Method to emit 'yes' on close
    closeDialog(response: string) {
        this.dialogRef.close(response);
    }
}
