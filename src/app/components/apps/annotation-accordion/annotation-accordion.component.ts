import { Component, Input,OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ConfigService } from 'app/components/services/config.service';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-annotation-accordion',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './annotation-accordion.component.html',
  styleUrl: './annotation-accordion.component.scss'
})
export class AnnotationAccordionComponent  implements OnInit{
    public isCollapsed = false;
    @Input() annotation




    constructor(
        public config: ConfigService,
         public sanitizer: DomSanitizer
        ) { }
    // toggle() {
    //   $('.slide-in').toggleClass('show');
    // }
    safeUrl = null
    ngOnInit(): void {
      console.log(this.annotation);
      if (this.annotation.isVoice) {
        this.safeUrl = this.sanitizer.bypassSecurityTrustResourceUrl(this.annotation.text)
      }
    }

    isOpen = true;
    btnPlusInfos(infos) {
        this.isOpen = !this.isOpen;
    }



}
