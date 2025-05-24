import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RxFormBuilder } from '@rxweb/reactive-form-validators';
import { FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Contact } from 'app/components/models/contact.model';
import { User } from 'app/components/models/User';
import { password } from 'app/components/models/password.model';
import { Category } from 'app/components/models/Category';
import { userContact } from 'app/components/models/userContact.model';
import { ConfigService } from 'app/components/services/config.service';
import { RestApiService } from 'app/components/services/rest-api.service';
import { EditUserServiceService } from 'app/components/services/edit-user-service.service';
import { TranslocoModule, TranslocoService } from '@ngneat/transloco';

@Component({
  selector: 'app-user-edit',
  standalone: true,
  imports: [CommonModule,ReactiveFormsModule,FormsModule,TranslocoModule],
  templateUrl: './user-edit.component.html',
  styleUrl: './user-edit.component.scss'
})
export class UserEditComponent implements OnInit {

    contact: Contact;
    con = new Contact();
    user = new User();
    pw = new password();
    cat = new Category();
    usCo: userContact;

    formGroupUs: FormGroup
    constructor(public config :ConfigService ,private serviceU: RestApiService, private fb: RxFormBuilder, private service: EditUserServiceService, private rt: Router) {
    }

    ngOnInit(): void {

       this.loadUser();
       this.initializeForm();
    }


    loadUser(){
      this.contact = new Contact();
      this.user = this.serviceU.tst(this.user, JSON.parse(sessionStorage.getItem("uslog")));
      this.service.findContact(this.user).subscribe(resp => {
        console.log("User",resp)
        this.contact = this.service.getCont(this.contact, JSON.parse(JSON.stringify(resp)));
        this.initializeForm();
        console.log("Form Data", this.formGroupUs.value);
      })



    }


    initializeForm() {
        this.formGroupUs = this.fb.group({
          fullName: [this.user._fullName, Validators.required],
          mail: [this.user._email, [Validators.required, Validators.email]],
          contact: this.fb.group({
            tel: [this.contact.phone || ''], // Use default empty string if null
            fax: [this.contact.fax || ''],
            gsm: [this.contact.gsm || ''],
            adresse: [this.contact.adresse || ''],
            state: [this.contact.state || ''],
            city: [this.contact.city || ''],
            zip: [this.contact.zip || ''],
          })
        });
      }
    add() {
        if (this.formGroupUs.valid) {
          const p = this.formGroupUs.value.contact;
          this.user._fullName = this.formGroupUs.value.fullName;
          this.user._email = this.formGroupUs.value.mail;
          this.con = { ...p, id: this.contact.id };
          this.pw.isValid = 1;
          this.pw.passwordTentative = 1;
          this.usCo = new userContact(this.user, this.con, this.cat, this.pw)
          this.service.updateUser(this.usCo);
          this.serviceU.login(this.user._username, sessionStorage.getItem('pw') || '').subscribe(() => {
            location.reload();
          });
        }
      }
    // add() {
    //   const p = this.formGroupUs.value["contact"];
    //   this.user._fullName =   $('#fullName').val().toString();
    //   this.user._email =  $('#mail').val().toString();
    //   this.con.city = p["city"];
    //   this.con.phone = p["tel"];
    //   this.con.fax = p["fax"];
    //   this.con.gsm = p["gsm"];
    //   this.con.adresse = p["adresse"];
    //   this.con.state = p["state"];
    //   this.con.zip = p["zip"];
    //   this.pw.isValid = 1;
    //   this.pw.passwordTentative = 1;
    //   this.con.id=this.contact.id;
    //   this.usCo = new userContact(this.user, this.con, this.cat, this.pw)
    //   this.service.updateUser(this.usCo);
    //   this.serviceU.login(this.user._username, sessionStorage.getItem("pw")).subscribe(
    //     resp => {

    //      location.reload();
    //     }
    //   );


    // }
    clear()
        {
          this.loadUser();
        }
  }
