import { AfterViewInit, Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgxKjuaComponent } from 'ngx-kjua';
import { MaterialModuleModule } from 'shared/material-module/material-module.module';
import { TranslocoModule, TranslocoService } from '@ngneat/transloco';

@Component({
  selector: 'app-qr-generator',
  standalone: true,
  imports: [CommonModule, MaterialModuleModule, NgxKjuaComponent,TranslocoModule],
  templateUrl: './qr-generator.component.html',
  styleUrl: './qr-generator.component.scss'
})
export class QrGeneratorComponent implements OnInit,AfterViewInit {
hidden=true
  @Input() curentCanal
  @Input() sessionId
  text = "";
  render = "canvas";
  crisp = true;
  minVersion = 1;
  ecLevel = "H";
  size = 320;
  ratio = undefined;
  fill = "#333333";
  back = "#ffffff";
  rounded = 0;
  quiet = 1;
  mode = "imagelabel";
  mSize = 30;
  mPosX = 50;
  mPosY = 35;
  mSize2 = 8;
  mPosX2 = 50;
  mPosY2 = 60;
  label = "DOCUMANIA";
  fontname = "Arial";
  fontcolor = "#09A4D7";
  fontoutline = true;
  imageAsCode = false;
  imageText = "";
  imgNativeElement = undefined;
  image;
  @ViewChild("imgBuffer")
  imageElement: ElementRef;
    constructor(
    private translocoService: TranslocoService,
  ) {}
  ngAfterViewInit(): void {

  }
  textEnc():string{
    return btoa(this.text)
  }

  ngOnInit(): void {
  // setTimeout(() => this.image = this.imageElement.nativeElement, 500);
  this.text = "DOCUMANIACAPTURE@" + this.curentCanal + '@'+this.sessionId ;


  }
  imgLoaded(e){
    try {
      setTimeout(() =>{
       this.image = this.imageElement.nativeElement
      this.hidden = false;
    }, 200);
    } catch (error) {
       console.info(error)
    }
  }
}
