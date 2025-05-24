import { Component, OnInit } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { MaterialModuleModule } from 'shared/material-module/material-module.module';
import {FormBuilder,FormGroup,FormsModule,ReactiveFormsModule,Validators} from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { DetailsCourrierPrecessusComponent } from 'app/components/dialogs/details-courrier-precessus/details-courrier-precessus.component';
import { TranslocoModule, TranslocoService } from '@ngneat/transloco';
import { environment } from 'environments/environment.development';
import { RestDataApiService } from 'app/components/services/rest-data-api.service';
import { ConfigService } from 'app/components/services/config.service';
import { Router } from '@angular/router';
import { InvalidFormComponent } from 'app/components/dialogs/invalid-form/invalid-form.component';
import { ToastrService } from 'ngx-toastr';
import { ResultComponent } from 'app/components/dialogs/result/result.component';
import { Folder } from 'app/components/models/folder.model';
import { FolderTypeA } from 'app/components/models/FolderType';
import { QuickLinkFolderDialogComponent } from 'app/components/dialogs/quick-link-folder-dialog/quick-link-folder-dialog.component';
import { AddDocumentPopupComponent } from 'app/components/dialogs/add-document-popup/add-document-popup.component';

@Component({
    selector: 'app-ajouter-courrier',
    standalone: true,
    imports: [CommonModule,MaterialModuleModule,TranslocoModule,FormsModule,ReactiveFormsModule,],
    templateUrl: './ajouter-courrier.component.html',
    styleUrl: './ajouter-courrier.component.scss',
})
export class AjouterCourrierComponent implements OnInit {
    result: boolean = false;
    isBulk: boolean = false;
    showSingle: boolean = true;
    formGroup!: FormGroup;
    folder: Folder;
    currentOp: string = 'norm';
    isLoading: boolean = false;
    folders = new Array();
    clients: any;
    folderFormGroup!: FormGroup;
    existRef: boolean = false;
    natures: any[] = [];
    senders: any;
    receivers: any;
    dests: Array<any> = [];
    users: any;
    today: string;
    dep: string = environment.depart;
    arr: string = environment.arrive;
    inter: string = environment.interne;
    currentuser: any;
    isBo: boolean = false;
    depart: boolean = false;
    qualities: any[] = [];
    newSenders: any[] = [];
    selectedReceivers: Array<any> = [];
    selectedReceiversId: Array<any> = [];
    dataArray: Array<any> = [];
    acc: any = null;
    currentProc: any = null;
    selectedFolders: Array<any> = [];
    selectedIds: Array<any> = [];
    courrierNumber: number = 0;
    courrierMessage: string | undefined;
    b;

    /**
     * Constructor
     */
    constructor(
        private dialog: MatDialog,
        private _translocoService: TranslocoService,
        private rest: RestDataApiService,
        public config: ConfigService,
        private fb: FormBuilder,
        public datepipe: DatePipe,
        private route: Router,
        private toast: ToastrService
    ) {}
    addCustomSender = (term) => {
        if (this.selectedReceivers.indexOf(term) == -1) {
            this.selectedReceivers.push(term);
            this.newSenders.push(term);
        }
    };


    ngOnInit(): void {
        // Fetches the current user from session storage and initializes necessary data for the form
        this.currentuser = JSON.parse(sessionStorage.getItem('uslog'));
        this.rest.getQualityNpPage().subscribe({
            next: (res: any[]) => {
                this.qualities = res;
                this.qualities.forEach((quality) => {
                    if (quality.ref_bo === 1 && this.currentuser.title === quality.code
                    ) {
                        this.isBo = true;
                        this.folderFormGroup.controls['reference'].setValidators(Validators.required);
                    }
                });

                this.retrieveFoldersType();
            },
            error: (err) => {
                console.error('Error retrieving quality NP page:', err);
            },
        });

        this.folder = new Folder();
        var now = new Date();
        var month: any = now.getMonth() + 1;
        var day: any = now.getDate();
        if (month < 10) month = '0' + month;
        if (day < 10) day = '0' + day;
        this.today = now.getFullYear() + '-' + month + '-' + day;

        // Configures the form group with initial values and validation rules
        this.folderFormGroup = this.fb.group({
            type: ['', Validators.required],
            reference: [''],
            nature: ['', Validators.required],
            date: [this.today, Validators.required],
            dateReception: [this.today, Validators.required],
            objet: [
                '',
                [
                    Validators.required,
                    Validators.minLength(this.config.min),
                    Validators.maxLength(2000),
                    Validators.pattern(/^(\s+\S+\s*)*(?!\s).*$/),
                ],
            ],
            accuse: [''],
            sender: [''],
        });

        this.acc = {};

        const iframe = document.getElementById('myIframe') as HTMLIFrameElement;
        if (iframe && iframe.contentWindow) {
        } else {
            console.warn("Iframe with ID 'myIframe' not found or contentWindow is null.");
        }
    }

    // Retrieves folder types from the server
    private retrieveFoldersType(): void {
        this.rest.getFolderTypes().subscribe({
            next: (res: FolderTypeA[]) => {
                this.folders = res;
                this.getNature();
            },
            error: (err) => {
                console.error('Error retrieving folder types:', err);
            },
        });
    }

    // Retrieves the nature of folders and filters them based on user type (BO or not)
    getNature() {
        this.rest.getNature('W').subscribe((r: any[]) => {
            if (this.isBo) {
                this.natures = r;
                this.folders = this.folders.filter(
                    (res) => res.cat == this.arr
                );
                this.folderFormGroup.controls['type'].setValue(
                    this.folders[0].id
                );
                if (this.natures.length == 1) {
                }
                this.changeSuit(this.folders[0].id);
            } else {
                this.natures = r;
                this.folders = this.folders.filter(
                    (res) => res.cat == this.dep
                );
                this.folderFormGroup.controls['type'].setValue(
                    this.folders[0].id
                );
                if (this.natures.length == 1) {
                }
                this.changeSuit(this.folders[0].id);
            }
        });
    }

    // Adjusts the UI and resets form controls based on the selected folder type
    changeSuit(e) {
        this.dataArray = [];
        this.selectedReceivers = [];
        this.selectedReceiversId = [];
        this.folders.forEach((element) => {
            if (e == element.id) {
                this.acc = element;
            }
        });

        // Resets sender and nature form controls
        this.folderFormGroup.controls['sender'].setValue('');
        this.folderFormGroup.controls['nature'].setValue('');
        this.currentProc = null;

        if (this.acc.cat == this.dep) {
            this.getReceivers();
            this.folderFormGroup.controls.sender.setValidators(
                Validators.nullValidator
            );
            this.dests = this.receivers;
            this.depart = false;
        } else if (this.acc.cat == this.arr) {
            this.getSenders();
            this.folderFormGroup.controls.sender.setValidators([
                Validators.required,
                Validators.minLength(this.config.min),
                Validators.maxLength(this.config.max),
                Validators.pattern(/^(\s+\S+\s*)*(?!\s).*$/),
            ]);
            this.dests = this.senders;
            this.depart = true;
        }

        this.natures?.forEach((nat) => {
            if (nat.folderType != null) {
                const list = nat.folderType.split('/');
                list.forEach((element) => {
                    if (element == e) {
                        this.dataArray.push(nat);
                    }
                });

                if (this.dataArray.length == 1) {
                    this.folderFormGroup.controls.nature.setValue(this.dataArray[0].id);
                    this.getProcess(this.dataArray[0].id)
                }
            }
        });
    }

    // Change Sender:
    changeSender(e) {
        let data;

        this.receivers.forEach((element) => {
            if (element.id == e) {
                data = element;
            }
        });

        if (!data) {
            return;
        }

        // Check if the account category of the sender matches the destination (this.acc.cat == this.dep)
        if (this.acc.cat == this.dep) {
            if (
                this.selectedReceivers.indexOf(data.name) == -1 && 
                this.checkExist(data.name) == 1 
            ) {
                this.selectedReceivers.push(data.name); 
            }

            this.folderFormGroup.controls['sender'].setValue('');
        } else {
            return; 
        }
    }


    // Check If Exist :
    checkExist(e) {
        this.b = 0;
        this.receivers.forEach((element) => {
            if (element.name == e) this.b = 1;
        });
        return this.b;
    }

    // Supprimer Reciever In Select Recievers:
    supprimerReciver(da) {
        this.selectedReceivers.splice(this.selectedReceivers.indexOf(da), 1);
        this.newSenders.forEach((de) => {
            if (de == da) {
                this.newSenders.splice(de, 1);
            }
        });
    }

    // Fetch processes based on the provided nature ID
    getProcess(e: string | number): void {
        this.rest.getStepsByNat(e).subscribe({
            next: (res) => {
                this.currentProc = res;
            },
            error: (err) => {
                console.error('Error fetching processes:', err);
            },
        });
    }

    // Fetches a list of available senders from the server
    getSenders() {
        this.rest.getSenders().subscribe({
            next: (data) => {
                this.senders = data;
            },
            error: (error) => {
                console.error('Error fetching senders:', error);
            },
        });
    }

    // Get Retrieves
    getReceivers() {
        this.rest.getReceivers().subscribe({
            next: (data: any[]) => {
                this.receivers = data;
            },
            error: (error) => {
                console.error('Error fetching receivers:', error);
            },
        });
    }

    isInvalid() {
        if (this.acc != null) {
            if (this.acc.cat == this.arr) {
                return !this.folderFormGroup.valid;
            } else {
                return !(
                    this.selectedReceivers.length > 0 &&
                    this.folderFormGroup.valid
                );
            }
        } else {
            return !(
                this.selectedReceivers.length > 0 && this.folderFormGroup.valid
            );
        }
    }

    //
    InvalidModal(): void {
         this.dialog.open(InvalidFormComponent, {
            disableClose: true,
            autoFocus: true,
        });
    }

    // On Submit :
    public onSubmit(op) {
        this.isLoading = true;
        this.currentOp = op;
        const p = this.folderFormGroup.value;
        if (this.folderFormGroup.value['accuse'] == true) {
            p['accuse'] = 1;
        } else {
            p['accuse'] = 0;
        }
        // Category Depart :
        if (this.acc.cat == this.dep) {
            p.mode = 1;
            this.selectedReceiversId = new Array();
            this.selectedReceivers.forEach((res) => {
                this.receivers.forEach((dest) => {
                    if (res === dest.name) {
                        this.selectedReceiversId.push(dest.id);
                    }
                });
            });
            p.newSenders = this.newSenders;
            p.dest = this.selectedReceiversId;
        } else if (this.acc.cat == this.arr) {
            p.mode = 2;
        } else {
            p.mode = -1;
        }
        if (this.folderFormGroup.valid) {
            this.rest.addFolder(p).subscribe({
                next: (res) => {
                    console.log('res :', res);
                    this.linkNewFolderToFolders(res['id']);
                    this.countSteps();
                    this.isLoading = false;
                    this.folder = res as Folder;
                    const tp = this.acc;
                    this.clear();
                    this.getSenders();
                    this.getReceivers();

                    if (op === 'norm') {
                        const dialogRef = this.dialog.open(AddDocumentPopupComponent,{
                                data: {
                                    courrierId: res.id,
                                    ftype: tp,
                                    f: res,
                                    courrierRef: res.reference ?? 'Sans',
                                    pr: 0
                                  }
                                
                            }
                        );

                        dialogRef.afterClosed().subscribe(() => {});
                    } else {
                        this.route.navigateByUrl(`/apps/ajouter-bulk?filter=${encodeURIComponent(JSON.stringify({ f: res['id'], ar: res['autoRef'] ? res['autoRef'] : "N/A" }))}`);
                    }
                },
                error: (err) => {
                    this.isLoading = false;
                    this.openDialogErr(
                        this._translocoService.translate('ajoutercourrier.error'),
                        this._translocoService.translate('ajoutercourrier.existRef'),
                        -1
                    );
                },
            });
        } else {
            this.InvalidModal();
        }
    }

    // Open Dialog Error :
    openDialogErr(title: string, txt: string, et: number) {
        const dialogRef = this.dialog.open(ResultComponent, {
            disableClose: true,
            data: {
                title: title,
                text: txt,
                etat: et,
            },
        });

        dialogRef.afterClosed().subscribe((result) => {});
    }

    // Count Steps :
    countSteps() {
        this.rest.getCountSteps().subscribe((r) => {
            //@ts-ignore
            if (r > this.courrierNumber) {
                const mm = this.toast.info(
                    this._translocoService.translate('ajoutercourrier.merciconsulter'),
                    this._translocoService.translate('ajoutercourrier.documaniacourrier')
                );
                mm.onTap.subscribe((action) =>
                    this.route.navigate(['apps/courriers-a-traites'])
                );
            }

            this.courrierNumber = r as number;
            if (r == 0) {
                this.courrierMessage = this._translocoService.translate('ajoutercourrier.0courriertraiter');
            }
            if (r == 1) {
                this.courrierMessage = this._translocoService.translate('ajoutercourrier.1courriertraiter');
            }
            //@ts-ignore
            if (r > 1) {
                this.courrierMessage = r + this._translocoService.translate('ajoutercourrier.courrierstraiter');
            }
        });
    }

    // Clear :
    clear() {
        var now = new Date();
        var month: any = now.getMonth() + 1;
        var day: any = now.getDate();
        if (month < 10) month = '0' + month;
        if (day < 10) day = '0' + day;
        var today = now.getFullYear() + '-' + month + '-' + day;

        //this.folderFormGroup.reset();
        this.folderFormGroup.controls['objet'].setValue('');
        this.folderFormGroup.controls['reference'].setValue('');
        //this.folderFormGroup.controls["nature"].setValue("")
        this.folderFormGroup.controls['date'].setValue(today);
        this.folderFormGroup.controls['dateReception'].setValue(today);

        //this.currentProc = null;
        this.folderFormGroup.controls['sender'].setValue('');
        //this.acc = null;
        this.selectedReceivers = new Array<any>();
        this.newSenders = new Array<any>();
        this.selectedIds = new Array<any>();
        this.selectedFolders = new Array<any>();
    }

    // quickLink
    quickLink() {
        const dialogRef = this.dialog.open(QuickLinkFolderDialogComponent, {
          disableClose: true,
          data: {}
        });
        dialogRef.componentInstance.Back.subscribe(r => {
          console.log(r);
          r.forEach(element => {
            if (this.selectedFolders.indexOf(element) === -1) {
              this.selectedFolders.push(element);
            }
          });
          console.log(this.selectedFolders);
        });

        dialogRef.componentInstance.selectedId.subscribe(r => {
          console.log(r);
          r.forEach(element => {
            if (this.selectedIds.indexOf(element) === -1) {
              this.selectedIds.push(element);
            }
          });
        });

        dialogRef.afterClosed().subscribe(result => {
          console.log('Dialog closed', result);
        });
      }
    // Link New Folder To Folders :
    linkNewFolderToFolders(id) {
        this.rest.linkFolder(id, this.selectedIds).subscribe((r) => {
            return true;
        });
    }

    toggleView(isSingle: boolean): void {
        this.result = true; 
        this.showSingle = isSingle; 
    }

    // Open Dialog Details Processus :
    // openDialogDetailsProcessus(): void {
    //     this.dialog.open(DetailsCourrierPrecessusComponent, {
    //         data: { process: this.currentProc },
    //     });
    // }

    openDialogDetailsProcessus() {
        const isDesktop = window.innerWidth >= 902;
        this.dialog.open(DetailsCourrierPrecessusComponent, {
          width: isDesktop ? '90vw' : '100vw',
          maxWidth: isDesktop ? '1000px' : '100vw',
          height: isDesktop ? 'auto' : '100vh',
          data: {
            process: this.currentProc
          }
        });
      }
}
