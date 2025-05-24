import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { environment } from 'environments/environment.development';
import { ConfigService } from 'app/components/services/config.service';
import { RxFormBuilder } from '@rxweb/reactive-form-validators';
import { RestApiService } from 'app/components/services/rest-api.service';
import { EditUserServiceService } from 'app/components/services/edit-user-service.service';
import { Router } from '@angular/router';
import { User } from 'app/components/models/User';
import { FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { confPw } from 'app/components/models/confPw.model';
import { TranslocoModule, TranslocoService } from '@ngneat/transloco';

@Component({
  selector: 'app-edit-password',
  standalone: true,
  imports: [CommonModule,ReactiveFormsModule,FormsModule,TranslocoModule],
  templateUrl: './edit-password.component.html',
  styleUrl: './edit-password.component.scss'
})
export class EditPasswordComponent implements OnInit {

    pw:confPw;
    formG:FormGroup;
    user:User=new User();
    level:number=-1;
    newpw:string;
    invalid:boolean=false;
    levelBool:boolean=false
    isloading=false
    // hidePassOublie = environment.hidePassOublie
    constructor(public config:ConfigService,
        private fb:RxFormBuilder,private service:RestApiService,
        private srv:EditUserServiceService,
        // private modal:NgbModal,
        private router:Router) { }

    ngOnInit(): void
    {
      this.pw=new confPw();
      this.formG=this.fb.formGroup(this.pw);
  if(JSON.parse(sessionStorage.getItem("uslog")).fromLdap==1)
  {
    this.router.navigateByUrl('/login')
  }
  }

  clear(){
     this.formG.reset();
   }


   securityLvl(){
    const p=this.formG.value;
   this.newpw=p["password"]
   if(this.newpw=="")
   {
     this.levelBool=false;
     this.level=-1
   }
   if((this.newpw.match("(?=.{6,32})") && this.newpw.match("(?=.*[a-z])")!=null)||
   (this.newpw.match("(?=.{6,32})") && this.newpw.match("(?=.*[A-Z])")!=null)
   ||
   (this.newpw.match("(?=.{6,32})") && this.newpw.match("(?=.*[0-9])")!=null) )
    {
      this.levelBool=false;
      this.level=1;
   }
    if(this.newpw.match("(?=.{6,32})") && this.newpw.match("(?=.*[0-9])")!=null&& this.newpw.match("(?=.*[a-z])")!=null &&
    this.newpw.match("(?=.*[A-Z])")!=null)
   {

    this.levelBool=true;
    this.level=2;
   }
    if(this.newpw.match("(?=.{6,32})") && this.newpw.match("(?=.*[0-9])")!=null&& this.newpw.match("(?=.*[a-z])")!=null &&
    this.newpw.match("(?=.*[A-Z])")!=null && this.newpw.match("(?=.*[_!@#$%^&*-])")!=null)
    {
      this.level=3;
      this.levelBool=true;
    }


   }
   edit(){
    this.isloading=true
     this.pw=this.formG.value;
    //  this.srv.editPw(this.pw).subscribe(resp => {
    //   const modalRef = this.modal.open(OperationResultModalComponent, {keyboard:false, centered: true,backdrop:'static' });
    // modalRef.componentInstance.operation=this.config.c['editPassword']['modification']
    //    sessionStorage.clear(); location.reload();
    //     this.isloading=false
    //   },
    //    (err) => {
    //   const modalRef = this.modal.open(ResultComponent, {keyboard:false, centered: true,backdrop:'static' });
    //  modalRef.componentInstance.title=this.config.c['editPassword']['err']
    //  modalRef.componentInstance.title=this.config.c['editPassword']['errTxt']
    //  modalRef.componentInstance.etat=-1
    //  this.isloading=false
    // });
   }
   textLeave(){
     const p=this.formG.value;
    if(p["confirmPassword"]!=p["password"])
    {this.invalid=true;}
    else(this.invalid=false)
   }


   resetPw(){
    // this.user = this.service.tst(this.user, JSON.parse(sessionStorage.getItem("uslog")));

    //   const confref=this.modal.open(ResetPwComponent,{centered:true,backdrop:'static'})
    //   confref.componentInstance.email=this.user._email
    //   confref.componentInstance.back.subscribe(r=>{
    //     if(r=="done")
    //     {
    //       sessionStorage.clear();
    //       this.router.navigateByUrl('/login')
    //     }
    // })
//    }

  }

}
