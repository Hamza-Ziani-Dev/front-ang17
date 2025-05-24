import { Component, HostListener, ViewChild, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialModuleModule } from 'shared/material-module/material-module.module';
import { MatStepper, MatStepperModule } from '@angular/material/stepper';
import {FormsModule,ReactiveFormsModule,} from '@angular/forms';
import { TranslocoService, TranslocoModule } from '@ngneat/transloco';
import { ConfigService } from 'app/components/services/config.service';
import { MatDrawer } from '@angular/material/sidenav';
import { Folder } from 'app/components/models/folder.model';
import { RestDataApiService } from 'app/components/services/rest-data-api.service';
import { DataSharingService } from 'app/components/services/data-sharing.service';
import { ReloadService } from 'app/components/services/reload.service';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { LinkFolderFolderConfirmationComponent } from 'app/components/dialogs/link-folder-folder-confirmation/link-folder-folder-confirmation.component';
import { DocumentSearchComponent } from 'app/components/dialogs/document-search/document-search.component';
import { RechercherCourrierComponent } from '../rechercher-courrier/rechercher-courrier.component';
import { RechercherDocumentComponent } from '../rechercher-document/rechercher-document.component';
import { FolderSearchComponent } from 'app/components/dialogs/folder-search/folder-search.component';
import { OperationResultDialogComponent } from 'app/components/dialogs/operation-result-dialog/operation-result-dialog.component';

@Component({
    selector: 'app-ajouter-liaison-document-courrier',
    standalone: true,
    imports: [
        CommonModule,
        TranslocoModule,
        MaterialModuleModule,
        MatStepperModule,
        FormsModule,
        ReactiveFormsModule,
        RechercherCourrierComponent,
        RechercherDocumentComponent

    ],
    templateUrl: './ajouter-liaison-document-courrier.component.html',
    styleUrl: './ajouter-liaison-document-courrier.component.scss',
})
export class AjouterLiaisonDocumentCourrierComponent implements OnInit {
    @ViewChild('stepper', { static: false }) stepper!: MatStepper;
    @ViewChild('matDrawer') matDrawer!: MatDrawer;
    currentStep = 1;
    listOfSelectedFolders: string[];
    listOfSelectedFoldersObj: Folder[] = new Array<Folder>();
    mode = 'multi';
    selectedDocumentId;
    linked = false;
    doc;
    docRef;
    constructor(
        public config: ConfigService,
        private rest: RestDataApiService,
        private share: DataSharingService,
        private dialog: MatDialog,
        public reload: ReloadService,
        private router: Router
    ) {}

    ngOnInit(): void {
        this.listOfSelectedFoldersObj = new Array<Folder>();
        this.linked = false;
        this.currentStep = 1;
        this.listOfSelectedFolders = new Array();
        if (this.share.documentToLink) {
            this.doc = this.share.doc;
            this.selectedDocumentId = this.share.documentToLink;
            this.currentStep = 3;
            this.share.documentToLink = null;
            this.share.doc = null;
        }
    }

    next() {
        if (this.currentStep < 5) {
            this.currentStep++;
        }
    }
    prev() {
        if (this.share.quick == true && this.currentStep == 3) {
            this.share.quick = false;
            this.router.navigateByUrl('/apps/courrier-recents');
        }

        this.listOfSelectedFolders = new Array();
        this.listOfSelectedFoldersObj = new Array<Folder>();
        this.currentStep--;
    }
    selectedFolders(f) {
        if (f && f.field1 != 1) {
            if (this.listOfSelectedFolders.indexOf(f.id) === -1) {
                this.listOfSelectedFolders.push(f.id);
                this.listOfSelectedFoldersObj.push(f);
            } else {
                this.listOfSelectedFolders.splice(
                    this.listOfSelectedFolders.indexOf(f.id),
                    1
                );
                this.listOfSelectedFoldersObj.splice(
                    this.listOfSelectedFoldersObj.indexOf(f),
                    1
                );
            }
        }
    }

    documentSelected(doc) {
        if (doc) {
            var id;
            doc.forEach((element) => {
                if (element.key == 'id') {
                    id = element.value;
                }
            });
            this.selectedDocumentId = id;
            this.doc = doc;
        }
        this.next();
    }
    Validate(e: any) {
        let ref: string;
      
        this.doc.forEach(element => {
          if (element.key === "Réference") {
            ref = element.value;
          }
        });
      
        const dialogRef = this.dialog.open(LinkFolderFolderConfirmationComponent, {
          disableClose: true,
          data: {
            folderChilds: this.listOfSelectedFoldersObj,
            title: "Confirmer la liaison"
          }
        });
      
        dialogRef.componentInstance.passConfirmation.subscribe((res: string) => {
          if (res === 'yes') {
            this.rest.linkDocument(this.selectedDocumentId, this.listOfSelectedFolders).subscribe(() => {
              this.openModale(1);
              this.currentStep = 1;
              this.linked = true;
            });
          }
        });
      }



     
      

    goStep(e) {
        if (e === '-') {
            if (this.share.quick == true && this.currentStep == 3) {
                this.share.quick = false;
                this.router.navigateByUrl('/apps/courrier-recents');
            }
            this.currentStep--;
        }
        if (e === '+') {
            this.next();
        }
    }
    openModale(state?: any, target?: any, message?: any, ref?: any) {
        const dialogRef = this.dialog.open(OperationResultDialogComponent, {
          disableClose: true,
          data: {
            operation: "Succès de la liaison"
          }
        });
      
        dialogRef.afterClosed().subscribe(() => {
          this.listOfSelectedFolders = [];
          this.ngOnInit();
        });
      }
      
}
