import {
    Component,
    EventEmitter,
    Input,
    Output,
    SimpleChanges,
    OnInit
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { environment } from 'environments/environment.development';
import { ConfigService } from 'app/components/services/config.service';
import { DataSharingService } from 'app/components/services/data-sharing.service';
import { MaterialModuleModule } from 'shared/material-module/material-module.module';
import { TranslocoModule, TranslocoService } from '@ngneat/transloco';

@Component({
    selector: 'app-folder',
    standalone: true,
    imports: [CommonModule, MaterialModuleModule,TranslocoModule],
    templateUrl: './folder.component.html',
    styleUrl: './folder.component.scss',
})
export class FolderComponent implements OnInit{
    @Input() folder;
    @Input() isCheked;
    @Input() mode;
    @Input() isFav;
    @Input() retour;
    @Input() checked = false;
    @Input() fromLst;
    @Output() folderClick = new EventEmitter();
    @Output() folderClient = new EventEmitter();

    hover = false;
    folderInfos = '';
    type;
    theCheckbox = false;
    u;
    isExpire = false;
    inProgress = false;
    closeEnd = false;
    step;
    steps = new Array();
    hideStatus = environment.hideStatus;
    constructor(
        public config: ConfigService,
        private share: DataSharingService,
                private translocoService: TranslocoService
        
    ) {}

    ngOnChanges(changes: SimpleChanges): void {}

    fav() {
        if (this.folder.favoriteBay != null)
            this.folder.favoriteBay.split('/').forEach((ui) => {
                if (this.u.userId.toString() == ui) {
                    this.isFav = true;
                }
            });
    }

    ngOnInit(): void {
        let onTime = false;
        this.folder.etapes.forEach((res) => {
            if (res.etat == 0 && onTime == false) {
                onTime = true;
                this.step = res;
            }
        });

        if (this.step) {
            let datenow = new Date();
            let dateFin = new Date(this.step?.dateFin);

            if (dateFin > datenow && dateFin.getDay() - datenow.getDay() != 0) {
                this.inProgress = true;
            } else if (dateFin < datenow) {
                this.isExpire = true;
            } else if (
                dateFin > datenow &&
                dateFin.getDay() - datenow.getDay() == 0
            ) {
                this.closeEnd = true;
            }
        }

        this.theCheckbox = this.isCheked;
        this.checked = this.folder['field1'] == 1;
        //  this.service.getFolderType(this.folder.type).subscribe(r=>{
        //    this.type=r['name']
        //  })

        this.type = this.folder.typeName;
        this.u = JSON.parse(sessionStorage.getItem('uslog'));
        this.fav();
        // this.theCheckbox= this.folder['field1']==1;
        this.folderInfos = `Référence: ${this.folder.reference} \n\n Numéro: ${this.folder.number} \n\n`;
    }
    clickFav() {
        if (this.mode == 'steps' || this.fromLst == true) return null;
        //this.open()
    }
    toggleVisibility() {
        this.theCheckbox = !this.theCheckbox;
    }

    // Open :
    open() {
        console.log('this.mode', this.mode);
        if (this.mode == undefined) {
            console.log(this.retour);
            if (this.retour == 'recent') {
                this.share.openFolder(this.folder, true);
                sessionStorage.setItem('retour', 'recent');
            } else if (this.retour == 'fav') {
                this.share.openFolder(this.folder, true, true);
                sessionStorage.setItem('retour', 'fav');
            } else {
                this.share.openFolder(this.folder, true);
            }

            this.folderClick.emit();
        }
        if (this.mode == 'steps') {
            this.folderClick.emit(this.folder.id);
        }
        if (this.mode == 'links') {
            if (this.checked == true) {
                this.checked = false;
            } else {
                this.checked = true;
            }
            this.folderClick.emit(this.folder.id);
        }

        if (this.mode == 'linkFolders') {
            console.log(this.checked);
            if (this.checked == true) {
                this.checked = false;
            } else {
                this.checked = true;
            }
            this.folderClick.emit(this.folder.id);
        }

        if (this.mode == 'client') {
            this.folderClick.emit();
        }
    }

    @Output() detailsDrawer = new EventEmitter<any>();
    // Emit the event with the folder data when needed
  triggerDetailsDrawer(folder: any) {
    this.detailsDrawer.emit(folder);
  }
}
