import { CommonModule, DatePipe } from '@angular/common';
import { Component } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { TranslocoModule, TranslocoService } from '@ngneat/transloco';
import { RxReactiveFormsModule } from '@rxweb/reactive-form-validators';
import { FormsModule, ReactiveFormsModule} from '@angular/forms';
import { PdfViewerModule } from 'ng2-pdf-viewer';
import { NgxImageZoomModule } from 'ngx-image-zoom';
// import { PinchZoomModule } from '@meddv/ngx-pinch-zoom';
import { HttpClientModule } from '@angular/common/http';
import { TexteditorModule } from './shared/text-editor/text-editor.module';

@Component({
    selector   : 'app-root',
    templateUrl: './app.component.html',
    styleUrls  : ['./app.component.scss'],
    standalone : true,
    imports    : [
        RouterOutlet,
        TranslocoModule,
        ReactiveFormsModule,
        FormsModule,
        HttpClientModule,
        RxReactiveFormsModule,
        PdfViewerModule,
        NgxImageZoomModule,
        CommonModule,
        // PinchZoomModule,
        TexteditorModule

    ],

    providers: [DatePipe]
})
export class AppComponent
{
    // showLayout: boolean = true; // Controls sidebar/header visibility


    ngOnInit(): void {
        window.scrollTo(0, 0); // Scroll to top on initial load
    }
    constructor(private translocoService: TranslocoService,private router: Router) {
        this.translocoService.langChanges$.subscribe((lang: string) => {
          this.updateDirection(lang);
        });

        // this.router.events.subscribe(() => {
        //     // Hide sidebar and header for login/register routes
        //     const currentRoute = this.router.url;
        //     this.showLayout = !(currentRoute.includes('sign-in') || currentRoute.includes('sign-up'));
        //   });

      }

      updateDirection(lang: string): void {
        const htmlElement = document.documentElement;
        if (lang === 'ar') {
          htmlElement.setAttribute('dir', 'rtl');
          htmlElement.setAttribute('lang', 'ar');
        } else {
          htmlElement.setAttribute('dir', 'ltr');
          htmlElement.setAttribute('lang', lang);
        }
      }
}
