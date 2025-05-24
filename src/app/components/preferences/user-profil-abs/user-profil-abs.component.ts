import { Component, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslocoModule, TranslocoService } from '@ngneat/transloco';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MaterialModuleModule } from 'shared/material-module/material-module.module';
import { ConfigService } from 'app/components/services/config.service';
import { MatDialog } from '@angular/material/dialog';
import { ProfilAbsenceService } from 'app/components/services/profil-absence.service';
import { NgxPaginationModule } from 'ngx-pagination';
import { AddProfilAbscenceUserComponent } from 'app/components/dialogs/add-profil-abscence-user/add-profil-abscence-user.component';
import { EditProfilAbscenceUserComponent } from 'app/components/dialogs/edit-profil-abscence-user/edit-profil-abscence-user.component';

@Component({
    selector: 'app-user-profil-abs',
    standalone: true,
    imports: [
        CommonModule,
        TranslocoModule,
        FormsModule,
        ReactiveFormsModule,
        MaterialModuleModule,
        NgxPaginationModule
    ],
    templateUrl: './user-profil-abs.component.html',
    styleUrl: './user-profil-abs.component.scss',
})
export class UserProfilAbsComponent {
    profilsAbs;
    totalCheck;
    constructor(
        public config: ConfigService,
        private dialog: MatDialog,
        private profilAbsService: ProfilAbsenceService,
        private eRef: ElementRef
    ) {}

    ngOnInit(): void {
        this.goPage(0);
    }
    page = 0;
    totalPages;
    totalElement;
    pages: Array<number>;

    totalEl;

    goPage(p) {
        this.loadData(p, 12);
    }
    loadData(p, s) {
        this.totalCheck = -1;
        this.page = p;

        this.profilAbsService.getprofilsAbs(p, s).subscribe((r) => {
            this.profilsAbs = r['content'];
            this.totalPages = r['totalPages'];
            this.totalElement = r['numberOfElements'];

            this.totalEl = r['totalElements'];
            this.pages = new Array<number>(this.totalPages);
            for (let index = 0; index < this.pages.length; index++) {
                this.pages[index] = index;
            }

            this.totalCheck = 1;
        });
    }
  openModale(): void {
  const dialogRef = this.dialog.open(AddProfilAbscenceUserComponent, {
    disableClose: true,
    autoFocus: true
  });

  dialogRef.componentInstance.back.subscribe((r: string) => {
    if (r === 'ok') {
      this.goPage(this.page);
      dialogRef.close();
    }
  });
}
    editProfilAbs(pa: any): void {
    const dialogRef = this.dialog.open(EditProfilAbscenceUserComponent, {
        disableClose: true,
        autoFocus: true,
        data: pa,
    });

    dialogRef.afterClosed().subscribe((result: any) => {
    if (result === 'ok') {
      this.goPage(this.page);
    }
  });
}
    onDelete(id) {}

    dropdownOpen: Record<number, boolean> = {};

toggleDropdown(id: number) {
  this.dropdownOpen[id] = !this.dropdownOpen[id];
}
}
