import { Component, EventEmitter, Inject, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { environment } from 'environments/environment.development';
import { Folder } from 'app/components/models/folder.model';
import { FolderTypeA } from 'app/components/models/FolderType';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ConfigService } from 'app/components/services/config.service';
import { EditUserServiceService } from 'app/components/services/edit-user-service.service';
import { PreviousRouteService } from 'app/components/services/previous-route.service';
import { Router } from '@angular/router';
import { FolderService } from 'app/components/services/folder.service';
import { DataSharingService } from 'app/components/services/data-sharing.service';
import { RestDataApiService } from 'app/components/services/rest-data-api.service';
import { RestSearchApiService } from 'app/components/services/rest-search-api.service';
import { OperationResultDialogComponent } from '../operation-result-dialog/operation-result-dialog.component';
import { MaterialModuleModule } from 'shared/material-module/material-module.module';
import { FolderComponent } from 'app/components/apps/folder/folder.component';
import { NgxPaginationModule } from 'ngx-pagination';

@Component({
  selector: 'app-quick-link-folder-dialog',
  standalone: true,
  imports: [CommonModule,MaterialModuleModule,FolderComponent,FormsModule,ReactiveFormsModule,NgxPaginationModule],
  templateUrl: './quick-link-folder-dialog.component.html',
  styleUrl: './quick-link-folder-dialog.component.scss'
})
export class QuickLinkFolderDialogComponent {
  search = true;
  dep = environment.depart;
  arr = environment.arrive;
  inter = environment.interne;
  public favoriteFoldersIds: string[];
  public isLoading: boolean;

  @Input() listOfSelectedFolders;
  totalePages: number;
  page = 0;
  listOfSelectedFoldersObj: Folder[] = new Array<Folder>();
  pages: number[] = new Array<number>();
  pageSize;
  folderSelectedId = new Array<any>();
  isLoaded;
  resultTotal;
  @Input() operation = 'multi';
  @Input() folderToRep;
  @Input() linkDoc;
  @Input() DocumentId;
  @Input() ShowResult;
  @Input() folderParentId;
  @Input() titre;

  isResult: Boolean = false;
  foldersResut;
  folder: Folder;
  folders: FolderTypeA[];
  clients;
  listFoldersid: Array<string>;
  folderFormGroup: FormGroup;
  natures;
  curentNat;
  curentDest;
  curentType;
  acc;
  dis = true;
  all = false;
  totalCheck;
  totalEl;
  senders;
  receivers;
  dests;
  @Input() selectedDocumentId;
  @Output() folderSelected = new EventEmitter();
  @Output() selectedId = new EventEmitter();
  @Output() next = new EventEmitter();
  @Output() Back = new EventEmitter();
  selectedReceivers = new Array<any>();
  selectedReceiversId = new Array<any>();
  selectedFolders = new Array<String>();
  hideStatus = environment.hideStatus


  constructor(
    private fb: FormBuilder,
    private rest: RestDataApiService,
    private searchserv: RestSearchApiService,
    private dialog : MatDialog,
    // private modalService: NgbModal,
    public share: DataSharingService,
    private folderService: FolderService,
    private route: Router,
    private prev: PreviousRouteService,
    // public actmodal: NgbActiveModal,
    private service: EditUserServiceService,
    public config: ConfigService,
    public quickLink: MatDialogRef<QuickLinkFolderDialogComponent>,
    public operationResult: MatDialogRef<OperationResultDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
  ) {}
  changeType(e) {
    this.folders.forEach((element) => {
      // //console.log(element)
      if (e.target.value == element.id) {
        this.acc = element;

        this.curentType = element;
      }
      if (this.curentType != null) {
        if (this.curentType.name != this.dep) {
          this.folderFormGroup.controls['accuse'].setValue(0);
        }
      }
    });
    this.folderFormGroup.controls['sender'].setValue('');

    if (this.acc.cat == this.arr) {
      //console.log("2")
      this.folderFormGroup.controls.sender.setValidators(
        Validators.nullValidator
      );

      this.dests = this.receivers;
    } else if (this.acc.cat == this.arr) {
      this.folderFormGroup.controls.sender.setValidators(Validators.required);

      this.selectedReceivers = new Array<any>();
      //console.log("1")

      this.dests = this.senders;
    }
  }

  changeSender(e) {
    console.log("e",e);
    let data;
    this.dests.forEach(element => {
      if (element['id'] == e) {
        data = element
        console.log("Data",data);

      }
    });

    if (this.acc.cat == this.arr) {
      this.selectedReceivers = new Array(...[data.name]);
      return;
    }

    if (this.acc.cat == this.dep) {
      if (
        this.selectedReceivers.indexOf(data.name) == -1 &&
        this.checkExist(data.name) == 1
      ) {
        this.selectedReceivers.push(data.name);
        this.selectedReceiversId.push(data.id);
        //console.log(this.selectedReceivers);
      }
      this.folderFormGroup.controls['sender'].setValue('');
    } else return;


  }

  b;
  checkExist(e) {
    this.b = 0;
    this.receivers.forEach((element) => {
      //console.log(element.name, e);
      if (element.name == e) this.b = 1;
    });
    return this.b;
  }
  supp(da) {
    this.selectedReceivers.splice(this.selectedReceivers.indexOf(da), 1);
  }
  func() {
    // Toggle the 'all' variable between true/false
    this.all = !this.all;
    if (this.all) {
      const elmnt = document.getElementById('teeets');
      if (elmnt) {
        elmnt.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }
  }

  getSenders() {
    this.rest.getSenders().subscribe((r) => {
      this.senders = r;
    });
  }

  getReceivers() {
    this.rest.getReceivers().subscribe((r) => {
      this.receivers = r;
    });
  }
  searchButton(e) {
    if (e.keyCode == 13) {
      this.getResult();
    }
  }
  undo() {
    if (this.folderFormGroup.dirty) {
      this.folderFormGroup.controls["type"].setValue("")
      this.folderFormGroup.controls["finalise"].setValue("")
      this.folderFormGroup.controls["sender"].setValue("")
      this.folderFormGroup.controls["reference"].setValue("")
      this.folderFormGroup.controls["nature"].setValue("")
      this.folderFormGroup.controls["deDate"].setValue("")
      this.folderFormGroup.controls["objet"].setValue("")
      this.folderFormGroup.controls["motif"].setValue("")
      this.folderFormGroup.controls["instru"].setValue("")
      this.folderFormGroup.controls["accuse"].setValue("")
      this.folderFormGroup.controls["order"].setValue("")
      this.folderFormGroup.controls["fini"].setValue("")

      this.acc = null;
      this.selectedReceivers = new Array<any>();
    } else {
    }
  }
  accus(e) {
    if (e.currentTarget.checked) {
      this.dis = false;

      //console.log(this.folderFormGroup)
      this.folderFormGroup.controls['finalise'].enable();
    } else {
      this.dis = true;
    //   $('#finalise').prop('checked', false);
      this.folderFormGroup.controls['finalise'].disable();
    }
  }
  ngOnInit(): void {
    // this.folderService.getFAvoritFoldersIds().subscribe(ids => {
    //   this.favoriteFoldersIds = ids;

    // });
    this.isLoading = true;
    this.retriveFoldersType();
    this.getReceivers();
    this.getSenders();
    this.folder = new Folder();
    this.getNature();
    //console.log(this.DocumentId)
    if (sessionStorage.getItem('fs')) {
      this.folder = new Folder();
      this.folderFormGroup = this.fb.group({
        type: [''],
        finalise: [''],
        sender: [''],
        reference: [''],
        nature: [''],
        toDate: [''],
        deDate: [''],
        objet: [''],
        motif: [''],
        instru: [''],
        accuse: [''],
        order: [''],
        fini: [''],
      });
      // this.getSearchAttrVal();
    } else {
      this.retriveFoldersType();
      this.retriveClients();
      this.folder = new Folder();
      this.folderFormGroup = this.fb.group({
        type: [''],
        finalise: [''],
        sender: [''],
        reference: [''],
        nature: [''],
        toDate: [''],
        deDate: [''],
        objet: [''],
        motif: [''],
        instru: [''],
        accuse: [''],
        order: [''],
        fini: [''],
      });
      //console.log(this.operation);
    }
  }
  dataArray: Array<any>;
  changeSuit(e) {
    this.dataArray = new Array<any>();

    this.folders.forEach((element) => {
      if (e == element['id']) {
        this.acc = element;
        // console.log('Acc:', this.acc);
        this.curentType = element;
        // console.log('Current Type:', this.curentType);
      }
    });
    if (this.curentType) { // Add a null check here
      if (this.curentType.name != this.dep) {
        this.folderFormGroup.controls['accuse'].setValue(0);
      }
    }

    if (this.curentType && this.curentType.id) { // Ensure curentType and id are defined
      this.natures.forEach((nat) => {
        if (nat.folderType != null) {
          const list = nat.folderType.split('/');
          list.forEach((element) => {
            if (element == this.curentType.id) {
              this.dataArray.push(nat);
            }
          });
        }
      });
    }

    this.folderFormGroup.controls['sender'].setValue('');

    if (this.acc && this.acc.cat == this.dep) { // Add null check for this.acc
      this.folderFormGroup.controls.sender.setValidators(Validators.nullValidator);
      this.selectedReceivers = new Array<any>();
      this.dests = this.receivers;
    } else if (this.acc && this.acc.cat == this.arr) { // Add null check for this.acc
      this.folderFormGroup.controls.sender.setValidators(Validators.required);
      this.selectedReceivers = new Array<any>();
      this.dests = this.senders;
    }
  }
// changeSuit(e: any) {
//     let found = false;
//     this.folders.forEach((element) => {
//       if (+e === +element['id']) {
//         this.acc = element;
//         this.curentType = element;
//         found = true;
//       }
//     });

//     if (!found) {
//       this.acc = null;
//       this.curentType = null;
//     }
//   }




  changeDest(e) {
    this.clients.forEach((element) => {
      if (e.target.value == element.userId) {
        this.curentDest = element;
      }
    });
  }

  changeNat(e) {
    console.log("e NATURE",e);
    this.natures.forEach((element) => {
      if (e == element['id']) {
        this.curentNat = element;
        console.log("curentNat",this.curentNat);

      }
    });
  }
  getNature() {
    this.rest.getNature().subscribe((r) => {
      this.natures = r;
    });
  }
  getUsers() {
    this.service.getUsersGroups().subscribe((r) => {
      this.clients = r;
    });
  }

  private retriveFoldersType() {
    this.rest.getFloderTypes().subscribe((res) => {
      //console.log(res);
      this.folders = res;
      //console.log(this.folders);
    });
  }
  private retriveClients() {
    this.rest.getClients().subscribe((res) => {
      //console.log(res);
      this.clients = res;
    });
  }
  getResult() {
    this.totalCheck = -1;
    const p = this.folderFormGroup.value;
    if (this.folderFormGroup.value['accuse'] == true) {
      p['accuse'] = 1;
    } else {
      p['accuse'] = 0;
    }
    if (p['accuse'] == 1) {
      if (this.folderFormGroup.value['finalise'] == true) {
        p['finalise'] = 'fini';
      } else {
        p['finalise'] = 'accusation';
      }
    } else {
      if (this.folderFormGroup.value['fini'] == true) {
        p['finalise'] = 'fini';
      } else {
        p['finalise'] = null;
      }
    }
    if (this.acc != null) {
      if (this.acc.cat == this.dep) {
        p.mode = 1;
        p.dest = this.selectedReceiversId;
      } else if (this.acc.cat == this.arr) {
        p.mode = 2;
      } else {
        p.mode = -1;
      }
    } else {
      p.mode = -1;
    }
    this.searchserv.searchFolder(p, this.page).subscribe((res) => {
      //console.log(res);
      this.totalEl = res['totalElements'];
      this.foldersResut = res['content'];
      const totalePages = res['totalPages'];
      this.resultTotal = res['totalElements'];
      this.pages = new Array<number>(totalePages);
      this.totalCheck = 1;
    });
    this.isResult = true;
  }



  changeDate() {
    this.folderFormGroup
      .get('toDate')
      .setValue(this.folderFormGroup.value['deDate']);
  }

  getFoldersToLinkWithDocument() {
    this.searchserv
      .searchFoldersToLinkWithDocument(this.folder, this.DocumentId, this.page)
      .subscribe((res) => {
        //console.log(res);

        this.foldersResut = res['content'];
        const totalePages = res['totalPages'];
        this.pages = new Array<number>(totalePages);
        this.resultTotal = res['totalElements'];

        console.warn(res);
        console.warn(this.foldersResut);
        this.isResult = true;
      });
  }
  public onSubmit() {
    // $('.modal-dialog').first().addClass('modal-xl');
    this.next.emit('+');
    this.getResult();
  }
  getResultToLink() {
    this.totalCheck = -1;
    const p = this.folderFormGroup.value;
    if (this.folderFormGroup.value['accuse'] == true) {
      p['accuse'] = 1;
    } else {
      p['accuse'] = 0;
    }

    if (p['accuse'] == 1) {
      if (this.folderFormGroup.value['finalise'] == true) {
        p['finalise'] = 'fini';
      } else {
        p['finalise'] = 'accusation';
      }
    } else {
      if (this.folderFormGroup.value['fini'] == true) {
        p['finalise'] = 'fini';
      } else {
        p['finalise'] = null;
      }
    }
    if (this.acc != null) {
      if (this.acc.cat == this.dep) {
        p.mode = 1;
        p.dest = this.selectedReceiversId;
      } else if (this.acc.cat == this.arr) {
        p.mode = 2;
      } else {
        p.mode = -1;
      }
    } else {
      p.mode = -1;
    }
    this.searchserv
      .searchFolderToLink(p, sessionStorage.getItem('FTL'), this.page)
      .subscribe((res) => {
        //console.log(res);

        this.foldersResut = res['content'];
        const totalePages = res['totalPages'];
        this.pages = new Array<number>(totalePages);
        this.resultTotal = res['totalElements'];

        console.log(res);
        console.log(this.foldersResut);
      });
    this.isResult = true;
  }
  goBack() {
    // $('.modal-dialog').first().removeClass('modal-xl');
    this.isResult = false;
  }
  onCancel() {
    this.folderFormGroup.reset();
  }
  goPage(i) {
    this.page = i;


    this.folderService.getFAvoritFoldersIds().subscribe((ids) => {
      this.favoriteFoldersIds = ids;

      //this.folderSelected.emit();

      if (this.operation === 'multi' && this.linkDoc === '1') {
        this.getFoldersToLinkWithDocument();
      } else if (this.operation !== 'multi' && this.linkDoc !== '1' || this.linkDoc == undefined) {
        this.getResult();
      }
      // } else {
      //   this.getResultToLink();
      //   //console.log('2nd test');
      // }
      this.isLoading = true;
    });
  }


  checkIfChecked(f) {
    if (this.folderSelectedId) {
      return this.folderSelectedId.indexOf(f['id']) !== -1;
    }
    return false;
  }
  isFavorite(folder: Folder) {
    return this.favoriteFoldersIds.indexOf(folder.id) >= 0;
  }


  removeTo(f) {

    console.log(this.selectedFolders)
    this.selectedFolders.indexOf(f.reference) == -1
      ? this.selectedFolders.push(f.reference)
      : this.selectedFolders.splice(this.selectedFolders.indexOf(f.reference), 1);

    this.folderSelectedId.indexOf(f.id) == -1
      ? this.folderSelectedId.push(f.id)
      : this.folderSelectedId.splice(this.folderSelectedId.indexOf(f.id), 1);
  }
//   openModale(state?, target?, message?, ref?) {
//     const modalRef = this.modalService.open(OperationResultModalComponent, {
//       centered: true,
//     });

//     modalRef.componentInstance.operation = 'Succès de déplacement';

//     modalRef.result.finally(() => {
//       this.Back.emit('ok');
//       this.actmodal.close();
//     });
//   }
openModale(state?, target?, message?, ref?) {
    // Open the dialog
    const dialogRef = this.dialog.open(OperationResultDialogComponent, {
      width: '500px',
      disableClose: true,
      data: {
        operation: 'Succès de déplacement',
        state,
        target,
        message,
        ref
      }
    });

    // Handle dialog close event
    dialogRef.afterClosed().subscribe(result => {
      console.log('Dialog closed', result);
      this.Back.emit('ok'); // Emit event after dialog closes
      this.operationResult.close(); // Close any active modal if needed
    });
  }


  validate() {
    if (this.selectedFolders.length > 0) {
      this.Back.emit(this.selectedFolders);
      this.selectedId.emit(this.folderSelectedId);
      this.operationResult.close();
    }
  }
}
