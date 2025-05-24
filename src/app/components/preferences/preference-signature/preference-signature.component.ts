import { AfterViewInit, Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ConfigService } from 'app/components/services/config.service';
import { SignService } from 'app/components/services/sign.service';
import { TranslocoModule, TranslocoService } from '@ngneat/transloco';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-preference-signature',
  standalone: true,
  imports: [CommonModule,ReactiveFormsModule,FormsModule,TranslocoModule],
  templateUrl: './preference-signature.component.html',
  styleUrl: './preference-signature.component.scss'
})
export class PreferenceSignatureComponent implements OnInit, AfterViewInit {
    file;
    imgSrc;

    constructor(public config: ConfigService, public signService: SignService) {}

    ngAfterViewInit(): void {
      this.signService.getCert();
    }


    ngOnInit(): void {}


    sigFileChange(e){
      if(e.target.files){
         this.file = e.target.files[0]
         const reader : FileReader = new FileReader();
         reader.onload = () =>{
          this.imgSrc = reader.result
         }
         reader.readAsDataURL(this.file)
         this.submit(e.target.files[0])
        e.target.value = null
       }
    }

    submit(file){
        this.signService.uploadSignature(file).subscribe(res => {
        this.signService.getSignature();
      })
    }

    deleteSigImage(){
    //   if(!this.signService.UserSignature){
    //     const noImage = this.modal.open(WarningInfoComponent,{centered:true,backdrop : "static"})
    //     noImage.componentInstance.title = this.config.c.preferenceSig.deleteNoImage.title
    //     noImage.componentInstance.message = this.config.c.preferenceSig.deleteNoImage.message
    //     return
    //   }else{
    //     const deleImage = this.modal.open(ConfirmationComponent,{centered:true,backdrop : "static"})
    //     deleImage.componentInstance.message = this.config.c.preferenceSig.deleteImageConfirmantion
    //     deleImage.componentInstance.global = true
    //     deleImage.componentInstance.pass.subscribe(res=>{
    //       if(res =="yes")
    //       {
    //         this.signService.deleteImage().subscribe(resp=>{
    //           this.signService.UserSignature = 'assets/img/no_sign.png';
    //         },err=>{})
    //       }
    //     })
    //   }
    }
  }
