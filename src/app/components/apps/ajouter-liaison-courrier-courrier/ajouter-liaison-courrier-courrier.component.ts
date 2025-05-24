import { Component, HostListener, ViewChild, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialModuleModule } from 'shared/material-module/material-module.module';
import { MatStepper, MatStepperModule } from '@angular/material/stepper';
import {
    FormsModule,
    ReactiveFormsModule,
} from '@angular/forms';
import { TranslocoService, TranslocoModule } from '@ngneat/transloco';
import { ConfigService } from 'app/components/services/config.service';
import { MatDrawer } from '@angular/material/sidenav';
import { LinkFolderFolderConfirmationComponent } from 'app/components/dialogs/link-folder-folder-confirmation/link-folder-folder-confirmation.component';
import { Folder } from 'app/components/models/folder.model';
import { RestDataApiService } from 'app/components/services/rest-data-api.service';
import { OperationResultDialogComponent } from 'app/components/dialogs/operation-result-dialog/operation-result-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { FolderSearchComponent } from 'app/components/dialogs/folder-search/folder-search.component';
import { RechercherCourrierComponent } from '../rechercher-courrier/rechercher-courrier.component';
import { DocumentSearchComponent } from 'app/components/dialogs/document-search/document-search.component';

@Component({
    selector: 'app-ajouter-liaison-courrier-courrier',
    standalone: true,
    imports: [
        CommonModule,
        TranslocoModule,
        MaterialModuleModule,
        MatStepperModule,
        FormsModule,
        ReactiveFormsModule,
        RechercherCourrierComponent,
        
    ],
    templateUrl: './ajouter-liaison-courrier-courrier.component.html',
    styleUrl: './ajouter-liaison-courrier-courrier.component.scss',
})
export class AjouterLiaisonCourrierCourrierComponent implements OnInit {
    folderToLink: number;
    foldersId: string[];
    folderToLinkObj: Folder;
    foldersObj: Folder[] = new Array<Folder>();
    currentStep: number = 1;
    linked = false;
    mode = 'multi';
    isLink = true;
    constructor(
        public config: ConfigService,
        private rest: RestDataApiService,
        private dialog: MatDialog,
        private translocoService: TranslocoService,
    ) {}

    ngOnInit(): void {
        this.currentStep = 1;
        this.foldersId = new Array<string>();
        this.foldersObj = new Array<Folder>();

        this.linked = false;
    }

    next() {
        if (this.currentStep < 4) {
            this.currentStep++;
        }
    }
    prev() {
        this.foldersId = new Array();
        this.foldersObj = new Array<Folder>();
        this.currentStep--;
    }
    selectedFolders(f) {
        if (f) {
            if (f.field1 !== 1) {
                if (this.foldersId.indexOf(f['id']) === -1) {
                    this.foldersId.push(f['id']);
                    this.foldersObj.push(f);
                } else {
                    this.foldersId.splice(this.foldersId.indexOf(f['id']), 1);
                    this.foldersObj.splice(this.foldersObj.indexOf(f), 1);
                }
            }
        } else {
        }
    }
    selectedFolder(f) {
        this.folderToLink = f['id'];
        this.folderToLinkObj = f;
        this.next();
    }

    openDialog(state?: number, target?: any, message?: string, ref?: string): void {
        const dialogRef = this.dialog.open(OperationResultDialogComponent, {
          width: '400px',
          data: {
            object: 'Dossier',
            operation: this.config.c['linkCourrierCourrier']['succes'],
            result: state === 1 ? 'succès' : 'echoue',
            name: ref,
            message: message
          }
        });
      
        dialogRef.afterClosed().subscribe(() => {
          this.foldersId = [];
          this.folderToLink = null;
          this.ngOnInit();
        });
      }
      
      valid(e: any): void {
        const dialogRef = this.dialog.open(LinkFolderFolderConfirmationComponent, {
          disableClose: true, 
          data: {
            parentFolder: this.folderToLinkObj,
            folderChilds: this.foldersObj,
            title: "Confirmer la liaison",
            folderChildsIds: this.foldersId
          }
        });
      
        dialogRef.componentInstance.passConfirmation.subscribe(
          (res: string) => {
            if (res === 'yes') {
              this.rest
                .linkFolder(this.folderToLink, this.foldersId as string[])
                .subscribe(() => {
                  this.openDialog(1); // previously openModale
                  this.ngOnInit();
                  this.linked = true;
                });
            }
            dialogRef.close();
          },
          (err) => {}
        );
      }
      
    goStep(e) {
        if (e === '+') this.next();
        else this.prev();
    }
    goStepBack(event) {
        this.prev();
    }
}
