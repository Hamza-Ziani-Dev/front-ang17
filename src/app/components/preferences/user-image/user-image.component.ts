import { Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { environment } from 'environments/environment.development';
import { FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ConfigService } from 'app/components/services/config.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { EditUserServiceService } from 'app/components/services/edit-user-service.service';
import { RxFormBuilder } from '@rxweb/reactive-form-validators';
import { RestApiService } from 'app/components/services/rest-api.service';
import { MatDialog } from '@angular/material/dialog';
import { FileModel } from 'app/components/models/file.model';
import { Confirmation2Component } from 'app/components/dialogs/confirmation2/confirmation2.component';
import { ConfirmationComponent } from 'app/components/dialogs/confirmation/confirmation.component';
import { Subscription } from 'rxjs';
import { TranslocoModule, TranslocoService } from '@ngneat/transloco';

@Component({
  selector: 'app-user-image',
  standalone: true,
  imports: [CommonModule,ReactiveFormsModule,FormsModule,TranslocoModule],
  templateUrl: './user-image.component.html',
  styleUrl: './user-image.component.scss'
})
export class UserImageComponent implements OnInit,OnDestroy   {
    private subscriptions = new Subscription();
    logo = undefined
    existingLogo;
    s
    us

    formG: FormGroup;

    constructor(public config: ConfigService, private httpClient: HttpClient,
      private fb: RxFormBuilder, private srv: EditUserServiceService, private serviceU: RestApiService,private dialog: MatDialog,) {
      this.us = JSON.parse(sessionStorage.getItem("uslog"));

      this.s = JSON.parse(sessionStorage.getItem("uslog"))['sexe']
        ;
      this.formG = this.fb.group({
        logo: ["", Validators.required]
      })

    }

    ngOnInit(): void {
      this.s = JSON.parse(sessionStorage.getItem("uslog"))['sexe']
      this.srv.getUserImage().subscribe(resp => {
        this.logo = resp['img']
        console.log(this.logo)
        this.existingLogo = resp['img']
      }, err => {
        this.logo = null;
        console.error(err)
      })
    }

    clear() {
      if (this.existingLogo) {
        this.logo = this.existingLogo;
        this.selectedFile = this.logo

      } else {
        this.logo = null;
        this.selectedFile = null
        this.formG.controls["logo"].setValue("")

      }


    }


    selectedFile
    fileModel = new FileModel();

    fileChangeEvent(fileInput: any) {
      const file = fileInput.target.files[0];
      this.selectedFile = file;
      if (file.size < 4000000) {
        this.fileModel.fileName = file.name.split('\\')[0];
        const reader = new FileReader();
        const self = this;
        reader.onload = () => {
          const base64String = reader.result as string;
          self.fileModel.fileBase64 = base64String.split(',')[1];
          self.logo = base64String
        };

        reader.readAsDataURL(file);
        reader.onloadend = function () {
          self.fileModel.fileName = file.name;
        };
      }
    }

    up() {
        if (!this.selectedFile) {
          console.error('No file selected');
          return;
        }

        const formData: FormData = new FormData();
        formData.append('file', this.selectedFile);
        const headers: HttpHeaders = new HttpHeaders();

        this.srv.updateUserImage(formData).subscribe(resp => {

            const dialogRef = this.dialog.open(Confirmation2Component, {
              width: '400px',
              disableClose: true,
              data: {
                title: "Modification",
                text: "Modifié avec succès",
                etat: 1
              }
            });

            // dialogRef.afterClosed().subscribe(() => {
            //   location.reload();
            // });
          },
          err => {
            console.error('Error updating image:', err);
          }
        );
      }




    deleteImage() {
        const dialogRef = this.dialog.open(ConfirmationComponent, {
          width: '400px',
          disableClose: true,
          data: {
            message: "Voulez vous vraiment supprimer votre photo",
            global: true
          }
        });

        const subscription = dialogRef.componentInstance.pass.subscribe((result: string) => {
          if (result === 'yes') {
            this.httpClient.get(environment.apiUrl + '/user/profile/img/delete').subscribe({next: (resp) => {
                //   dialogRef.close();
                  const successDialogRef = this.dialog.open(Confirmation2Component, {
                    disableClose: true,
                    data: {
                      title: "Supprimer",
                      text: "Supprimé avec succès",
                      etat: 1
                    }
                  });
                  setTimeout(() => {
                    successDialogRef.close();
                    this.logo = null;
                    location.reload();
                  }, 2000);
                },
                error: (error) => {
                  console.error('Error deleting image:', error);
                  dialogRef.close();
                  this.dialog.open(Confirmation2Component, {
                    disableClose: true,
                    data: {
                      title: "Erreur",
                      text: "Une erreur s'est produite lors de la suppression",
                      etat: 0
                    }
                  });
                }
              });
          } else {
            dialogRef.close();
          }
        });

        this.subscriptions.add(subscription);
      }

      ngOnDestroy() {
        this.subscriptions.unsubscribe();
      }
  }
