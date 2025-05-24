import { Component, Inject, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ConfigService } from 'app/components/services/config.service';
import {
    FormBuilder,
    FormGroup,
    FormsModule,
    ReactiveFormsModule,
} from '@angular/forms';
import { EditUserServiceService } from 'app/components/services/edit-user-service.service';
import { ToastrService } from 'ngx-toastr';
import { ShareFoldersService } from 'app/components/services/share-folders.service';
import {
    MAT_DIALOG_DATA,
    MatDialog,
    MatDialogRef,
} from '@angular/material/dialog';
import { MaterialModuleModule } from 'shared/material-module/material-module.module';
import { TranslocoModule, TranslocoService } from '@ngneat/transloco';

@Component({
    selector: 'app-share-folder',
    standalone: true,
    imports: [
        CommonModule,
        MaterialModuleModule,
        FormsModule,
        ReactiveFormsModule,
        TranslocoModule,
    ],
    templateUrl: './share-folder.component.html',
    styleUrl: './share-folder.component.scss',
})
export class ShareFolderComponent {
    dataArray: Array<string> = new Array();
    myform: FormGroup;
    lstUser;
    isLoading = false;
    alreadyShared = null;
    @Input() folder;
    constructor(
        public config: ConfigService,
        private fb: FormBuilder,
        private userService: EditUserServiceService,
        private toastr: ToastrService,
        private service: ShareFoldersService,
        private dialog: MatDialog,
        private translocoService: TranslocoService,
        private dialogRef: MatDialogRef<ShareFolderComponent>,
        @Inject(MAT_DIALOG_DATA) public data: any
    ) {
        this.folder = data.folder;
    }

    ngOnInit(): void {
        this.getUsers();
        this.myform = this.fb.group({
            us: [''],
            message: [''],
        });
    }

    close() {
        this.dialogRef.close();
    }

    clear() {
        this.myform.reset();
        this.dataArray = new Array<string>();
    }

    getUsers() {
        this.userService.getUsersGroups().subscribe((r) => {
            this.lstUser = r;
        });
    }

    b = 0;
    checkExist(e) {
        this.b = 0;
        this.lstUser.forEach((element) => {
            if (element.fullName == e) this.b = 1;
        });
        return this.b;
    }

    addUserToLst(e) {
        if (
            this.dataArray.indexOf(e.target.value) == -1 &&
            this.checkExist(e.target.value) == 1
        ) {
            this.dataArray.push(e.target.value);
            this.myform.get('us').setValue(null);
        }
    }

    suppUs(da: string) {
        this.dataArray.splice(this.dataArray.indexOf(da), 1);
    }

    dataList: Array<any>;
    send() {
        this.isLoading = true;
        this.dataList = new Array<any>();
        this.getIds();
        this.service
            .shareWithUsers(
                this.folder.id,
                this.dataList,
                this.myform.value.message
            )
            .subscribe((r) => {
                this.toastr.info(
                    this.translocoService.translate('common.processussuccess'),
                    this.translocoService.translate('common.documaniacourrier')
                );
                this.dialogRef.close();
                this.isLoading = false;
            });
    }

    getIds() {
        this.lstUser.forEach((a) => {
            this.dataArray.forEach((element) => {
                if (a['fullName'] == element) {
                    this.dataList.push(a['userId']);
                }
            });
        });
    }
}
