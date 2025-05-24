import { Component, EventEmitter, Inject, Input,OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslocoModule, TranslocoService } from '@ngneat/transloco';
import { MaterialModuleModule } from 'shared/material-module/material-module.module';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Confirmation2Component } from '../confirmation2/confirmation2.component';
import { ConfigService } from 'app/components/services/config.service';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { ProfilAbsenceService } from 'app/components/services/profil-absence.service';

@Component({
  selector: 'app-edit-profil-abscence-user',
  standalone: true,
  imports: [CommonModule,TranslocoModule,MaterialModuleModule,FormsModule,ReactiveFormsModule],
  templateUrl: './edit-profil-abscence-user.component.html',
  styleUrl: './edit-profil-abscence-user.component.scss'
})
export class EditProfilAbscenceUserComponent implements OnInit {
formGroup: FormGroup;
  users;
  @Input() abs;
  isloading = false;
  back = new EventEmitter<any>();
  constructor(
    public config: ConfigService,
    public dialog: MatDialog,
    private fb: FormBuilder,
    private service:ProfilAbsenceService,
    public dialogRef: MatDialogRef<EditProfilAbscenceUserComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.abs = data
      console.log("data",this.data)
  }
  onCancel() {
    this.ngOnInit();
  }
 onSubmit(): void {
  if (this.formGroup.valid) {
    this.isloading = true;
    let a = this.formGroup.value;
    a.id = this.abs.id;

    this.users.forEach((element) => {
      if (element['fullName'] === a['idUser']) a['idUser'] = element['userId'];
      if (element['fullName'] === a['idSup']) a['idSup'] = element['userId'];
    });

    this.service.editProfilsAbs(a).subscribe((r) => {
      if (r["message"] === "ok") {
        const dialogRef = this.dialog.open(Confirmation2Component, {
          disableClose: true,
          autoFocus: true,
          data: {
            title: 'Modification',
            text: 'Modifié avec succès',
            etat: 1,
          },
        });

        dialogRef.afterClosed().subscribe(() => {
          this.dialogRef.close('ok'); // return 'ok' to parent
        });

      } else if (r["message"] === "no") {
        this.dialog.open(Confirmation2Component, {
          disableClose: true,
          autoFocus: true,
          data: {
                title: 'Error',
                text: 'Cet utilisateur est absent dans cette période',
                etat: 1,
            },
        });
      }
    }).add(() => {
      this.isloading = false;
    });
  }
}

  ngOnInit(): void {
    this.service.getAllUsers().subscribe((r) => {
      this.users = r;
      console.log("this.users",this.users)
    });
    console.log("abs",this.abs)

    this.formGroup = this.fb.group(
      {
        idSup: [{ value: this.abs.supName, disabled: true },[Validators.required, Validators.minLength(this.config.min), Validators.maxLength(this.config.max),Validators.pattern(/^(\s+\S+\s*)*(?!\s).*$/)]],
        dateDebut: [this.abs.dateDebut, Validators.required],
        dateFin: [this.abs.dateFin, Validators.required],
      },
      { validator: this.dateLessThan('dateDebut', 'dateFin') }
    );
  }
  dateLessThan(from: string, to: string) {
    return (group: FormGroup): { [key: string]: any } => {
      let f = group.controls[from];
      let t = group.controls[to];
      if (f.value > t.value) {
        return {
          dates: 'Date from should be less than Date to',
        };
      }
      return {};
    };
  }

  close(){
    this.dialogRef.close();
  }
}
