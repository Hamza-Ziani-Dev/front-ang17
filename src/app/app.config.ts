import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { APP_INITIALIZER, ApplicationConfig, inject } from '@angular/core';
import { LuxonDateAdapter } from '@angular/material-luxon-adapter';
import { DateAdapter, MAT_DATE_FORMATS } from '@angular/material/core';
import { provideAnimations } from '@angular/platform-browser/animations';
import { PreloadAllModules, provideRouter, withInMemoryScrolling, withPreloading } from '@angular/router';
import { provideFuse } from 'shared';
import { provideTransloco, TranslocoService } from '@ngneat/transloco';
import { firstValueFrom } from 'rxjs';
import { appRoutes } from 'app/app.routes';
import { provideIcons } from 'app/core/icons/icons.provider';
import { mockApiServices } from 'app/layout';
import { TranslocoHttpLoader } from './core/transloco/transloco.http-loader';
import { provideToastr } from 'ngx-toastr';
import { httpInterceptor } from './interceptors/http.interceptor';
import hljs from 'highlight.js';
import { DatePipe } from '@angular/common';
import QuillBetterTable from 'quill-better-table';
import { provideQuillConfig } from 'ngx-quill/config';
(window as any).hljs = hljs;
export const appConfig: ApplicationConfig = {
    providers: [

        DatePipe,
        provideQuillConfig({
            modules : {
                table: false,
                'better-table': {
                    operationMenu: {
                        items: {
                            unmergeCells: {
                                text: 'Another unmerge cells name',
                            },
                        },
                        color: {
                            colors: ['green', 'red', 'yellow', 'blue', 'white'],
                            text: 'Background Colors:',
                        },
                    },
                },
                toolbar: [
                    ['bold', 'italic', 'underline', 'strike'], // toggled buttons
                    ['blockquote'],

                    [{ header: 1 }, { header: 2 }], // custom button values
                    // [{ 'list': 'ordered' }, { 'list': 'bullet' }],
                    [{ script: 'sub' }, { script: 'super' }], // superscript/subscript
                    [{ indent: '-1' }, { indent: '+1' }], // outdent/indent
                    [{ direction: 'rtl' }], // text direction

                    [{ size: ['small', false, 'large', 'huge'] }], // custom dropdown
                    [{ header: [1, 2, 3, 4, 5, 6, false] }],

                    [{ color: [] }, { background: [] }], // dropdown with defaults from theme
                    [{ font: [] }],
                    [{ align: [] }],

                    ['clean'], // remove formatting button

                    ['link', 'image'],
                    ['mic'], // link and image, video
                ],
                keyboard: {
                    bindings: QuillBetterTable.keyboardBindings,
                },
            }
          }),
        provideHttpClient(withInterceptors([httpInterceptor])),
        provideToastr({
            timeOut: 10000,
            progressBar: true,
            positionClass: 'toast-bottom-right',
            closeButton: true,
            toastClass: 'custom-toast',
            enableHtml: true
          }),
        provideAnimations(),
        provideHttpClient(),
        provideRouter(appRoutes,
            withPreloading(PreloadAllModules),
            withInMemoryScrolling({scrollPositionRestoration: 'enabled'}),
        ),

        // Material Date Adapter
        {
            provide : DateAdapter,
            useClass: LuxonDateAdapter,
        },
        {
            provide : MAT_DATE_FORMATS,
            useValue: {
                parse  : {
                    dateInput: 'D',
                },
                display: {
                    dateInput         : 'DDD',
                    monthYearLabel    : 'LLL yyyy',
                    dateA11yLabel     : 'DD',
                    monthYearA11yLabel: 'LLLL yyyy',
                },
            },
        },

        // Transloco Config
        provideTransloco({
            config: {
                availableLangs      : [
                    {
                        id   : 'en',
                        label: 'English',
                    },
                    {
                        id   : 'ar',
                        label: 'Arabic',
                    },
                    {
                        id   : 'fr',
                        label: 'Francais',
                    },
                ],
                defaultLang         : 'fr',
                fallbackLang        : 'fr',
                reRenderOnLangChange: true,
                prodMode            : true,
            },
            loader: TranslocoHttpLoader,
        }),
        {
            // Preload the default language before the app starts to prevent empty/jumping content
            provide   : APP_INITIALIZER,
            useFactory: () =>
            {
                const translocoService = inject(TranslocoService);
                const defaultLang = translocoService.getDefaultLang();
                translocoService.setActiveLang(defaultLang);

                return () => firstValueFrom(translocoService.load(defaultLang));
            },
            multi     : true,
        },

        // Fuse
        // provideAuth(),
        provideIcons(),
        provideFuse({
            mockApi: {
                delay   : 0,
                services: mockApiServices,
            },
            fuse   : {
                layout : 'dense',
                scheme : 'light',
                screens: {
                    sm: '600px',
                    md: '960px',
                    lg: '1280px',
                    xl: '1440px',
                },
                theme  : 'theme-brand',
                themes : [
                    {
                        id  : 'theme-default',
                        name: 'Default',
                    },
                    {
                        id  : 'theme-brand',
                        name: 'Brand',
                    },
                    {
                        id  : 'theme-teal',
                        name: 'Teal',
                    },
                    {
                        id  : 'theme-rose',
                        name: 'Rose',
                    },
                    {
                        id  : 'theme-purple',
                        name: 'Purple',
                    },
                    {
                        id  : 'theme-amber',
                        name: 'Amber',
                    },
                ],
            },
        }),

    ],
};
