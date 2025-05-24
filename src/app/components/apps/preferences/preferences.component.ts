import { Component, HostListener ,OnInit} from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialModuleModule } from 'shared/material-module/material-module.module';
import { HttpClientModule} from '@angular/common/http';
import { AngularEditorModule } from '@kolkov/angular-editor';
import { AngularEditorConfig } from '@kolkov/angular-editor';
import { TranslocoModule, TranslocoService } from '@ngneat/transloco';
import { UserEditComponent } from 'app/components/preferences/user-edit/user-edit.component';
import { UserImageComponent } from 'app/components/preferences/user-image/user-image.component';
import { PreferenceSignatureComponent } from 'app/components/preferences/preference-signature/preference-signature.component';
import { EditPasswordComponent } from 'app/components/preferences/edit-password/edit-password.component';
import { MyTemplatesComponent } from 'app/components/preferences/my-templates/my-templates.component';
import { UserProfilAbsComponent } from 'app/components/preferences/user-profil-abs/user-profil-abs.component';
import { AddProfilAbscenceUserComponent } from 'app/components/dialogs/add-profil-abscence-user/add-profil-abscence-user.component';
import { ConfigService } from 'app/components/services/config.service';
import { MatDialog } from '@angular/material/dialog';
import { ProfilAbsenceService } from 'app/components/services/profil-absence.service';
@Component({
    selector: 'app-preferences',
    standalone: true,
    imports: [
        CommonModule,
        MaterialModuleModule,
        TranslocoModule,
        HttpClientModule,
        AngularEditorModule,
        UserEditComponent,
        UserImageComponent,
        PreferenceSignatureComponent,
        EditPasswordComponent,
        MyTemplatesComponent,
        UserProfilAbsComponent
        ],
    templateUrl: './preferences.component.html',
    styleUrl: './preferences.component.scss',
})
export class PreferencesComponent  implements OnInit{
     profilsAbs;
    totalCheck;
    allCourriers: boolean = true;
    allDocuments: boolean = false;
    activeTab: string = 'photo';
    isMobile: boolean = false;
     page = 0;
    totalPages;
    totalElement;
    pages: Array<number>;

    totalEl;
    constructor(
            public config: ConfigService,
            private dialog: MatDialog,
            private profilAbsService: ProfilAbsenceService,
            private _translocoService : TranslocoService
        ) {
         this.checkIfMobile(window.innerWidth);
        }



    goBack() {
    }

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


  onSelectionChange(event: any): void {
    if (event.value === 'allCourries') {
      this.allCourriers = true;
      this.allDocuments = false;
    } else if (event.value === 'allDocuments') {
      this.allCourriers = false;
      this.allDocuments = true;
    }
  }

    ngOnInit(): void {
        this.goPage(0);
    }


    selectTab(tab: string) {
        this.activeTab = tab;
    }

    @HostListener('window:resize', ['$event'])
    onResize(event: any) {
        this.checkIfMobile(event.target.innerWidth);
    }

    checkIfMobile(width: number) {
        this.isMobile = width < 768;
    }



    editorConfig: AngularEditorConfig = {
        editable: true,
          spellcheck: true,
          height: 'auto',
          minHeight: '0',
          maxHeight: 'auto',
          width: 'auto',
          minWidth: '0',
          translate: 'yes',
          enableToolbar: true,
          showToolbar: true,
          placeholder: 'Enter text here...',
          defaultParagraphSeparator: '',
          defaultFontName: '',
          defaultFontSize: '',
          fonts: [
            {class: 'arial', name: 'Arial'},
            {class: 'times-new-roman', name: 'Times New Roman'},
            {class: 'calibri', name: 'Calibri'},
            {class: 'comic-sans-ms', name: 'Comic Sans MS'}
          ],
          customClasses: [
          {
            name: 'quote',
            class: 'quote',
          },
          {
            name: 'redText',
            class: 'redText'
          },
          {
            name: 'titleText',
            class: 'titleText',
            tag: 'h1',
          },
        ],
        uploadUrl: 'v1/image',
        // upload: (file: File) => { ... }
        uploadWithCredentials: false,
        sanitize: true,
        toolbarPosition: 'top',
        toolbarHiddenButtons: [
          ['bold', 'italic'],
          ['fontSize']
        ]
    };
}
