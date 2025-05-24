import { NgIf, DOCUMENT } from '@angular/common';
import {Component,HostListener,Inject,OnDestroy,OnInit,ViewChild,ViewEncapsulation,} from '@angular/core';
import { ActivatedRoute, Router, RouterOutlet } from '@angular/router';
import { FuseFullscreenComponent } from 'shared/components/fullscreen';
import { FuseLoadingBarComponent } from 'shared/components/loading-bar';
import {FuseNavigationService,FuseVerticalNavigationComponent,} from 'shared/components/navigation';
import { FuseMediaWatcherService } from 'shared/services/media-watcher';
import { NavigationService } from 'app/core/navigation/navigation.service';
import { Navigation } from 'app/core/navigation/navigation.types';
import { combineLatest, map, Subject, takeUntil } from 'rxjs';
import { FuseConfig, FuseConfigService, Scheme } from 'shared/services/config';
import { LanguagesComponent } from './common/languages/languages.component';
import { TranslocoModule, TranslocoService } from '@ngneat/transloco';
import { MaterialModuleModule } from 'shared/material-module/material-module.module';
import { RestApiService } from 'app/components/services/rest-api.service';
import { CookieService } from 'ngx-cookie-service';
import { AuthService } from 'app/components/auth/services/auth.service';
import { RestDataApiService } from 'app/components/services/rest-data-api.service';
import { EditUserServiceService } from 'app/components/services/edit-user-service.service';
import { WsService } from 'app/components/sockets/ws.service';
import { ToastrModule, ToastrService } from 'ngx-toastr';
import { ShareFoldersService } from 'app/components/services/share-folders.service';
import { SessionStorageService } from 'app/components/services/session-storage.service';
import { SessionService } from 'app/components/services/session.service';
import { PreviousRouteService } from 'app/components/services/previous-route.service';
import { ConfigurationsService } from 'app/components/services/configurations.service';
import { IntegrationService } from 'app/components/services/integration.service';
import { SignService } from 'app/components/services/sign.service';
import { User } from 'app/components/models/User';
import { RouteGuardService } from 'app/components/services/route-guard.service';
import { environment } from 'environments/environment.development';

@Component({
    selector: 'layout',
    templateUrl: './layout.component.html',
    styleUrls: ['./layout.component.scss'],
    encapsulation: ViewEncapsulation.None,
    standalone: true,
    imports: [FuseLoadingBarComponent,LanguagesComponent,FuseVerticalNavigationComponent,NgIf,RouterOutlet,MaterialModuleModule,TranslocoModule,
    ],
})
export class LayoutComponent implements OnInit, OnDestroy {
    showDocumentPartager = environment.showDocumentPartager;

    courrierNumber = 0;
    state = false;
    showLang: Boolean;
    showLayout: boolean = true; // Controls sidebar/header visibility
    isSidebarOpen: boolean = false;
    isMobile: boolean = false;
    hovered: boolean = false;
    config: FuseConfig;
    layout: string;
    position: string = 'left';
    scheme: 'dark' | 'light';
    theme: string;
    private _unsubscribeAll: Subject<any> = new Subject<any>();
    isScreenSmall: boolean;
    navigation: Navigation;
    navigationAppearance: 'default' | 'dense' = 'dense';
    uslog: string | null = null;
    timeOutIDs: any[] = [];
    hasAccessSubo: Boolean = false;
    messageNumber = 0;
    courrierMessage;
    us: any;
    end: String;
    photo: string;
    currentUser;
    etat = 0;
    etatSrch = 0;
    dataMessage;
    logo: string = undefined;
    user: User;
    sharedFoldersNumber = 0;
    // """"""""""""""""""""""""""""""""""""""""""""""""""""
    // @ViewChild(WaitModalComponent) wait!: WaitModalComponent
    countDoc = 0;
    year = new Date().getFullYear()
    documentIconShow = environment.documentIconShow
    // hideDocument = environment.hideDocument
    // hideDocumentSearch = environment.hideDocumentSearch
    // liasonHide = environment.liasonHide
    // liasonCourHide = environment.liasonCourHide
    // liasonDocHide = environment.liasonDocHide
    // hideArchive = environment.hideArchive
    // hideFlux = environment.hideFlux
    name = environment.footer

    // """"""""""""""""""""""""""""""""""""""""""""""""""""""""""
    /**
     * Constructor
     */
    constructor(
        @Inject(DOCUMENT) private _document: any,
        private service: RestApiService,
        private authService: AuthService,
        public cookies: CookieService,
        private _navigationService: NavigationService,
        private _fuseNavigationService: FuseNavigationService,
        private _fuseConfigService: FuseConfigService,
        private _fuseMediaWatcherService: FuseMediaWatcherService,
        private translocoService: TranslocoService,
        private rest: RestDataApiService,
        private sharedFoldersService: ShareFoldersService,
        private serviceUser: EditUserServiceService,
        private rt: Router,
        public routSnap: ActivatedRoute,
        private ws: WsService,
        public storage: SessionStorageService,
        private Session: SessionService,
        public prevouis: PreviousRouteService,
        private toast: ToastrService,
        public signService: SignService,
        private configs: ConfigurationsService,
        private routeGaurd: RouteGuardService,
        private auth: AuthService,
        public integrationService: IntegrationService

    ) {
        this.us = JSON.parse(sessionStorage.getItem('uslog'));
        this._fuseConfigService.config$.subscribe((config) => {
            this.config = config;
        });

        const savedTheme = sessionStorage.getItem('theme');
        if (savedTheme) {
            this.setScheme(savedTheme as Scheme); // 'light' or 'dark'
        }

        this.rt.events.subscribe(() => {
            const currentRoute = this.rt.url;
            this.showLayout = !(
                currentRoute.includes('auth/login') ||
                currentRoute.includes('auth/logout')
            );
        });


    }

    ngAfterViewInit(): void {
        this.signService.getCert();
        this.configs.getUserConfigs();
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Accessors
    // -----------------------------------------------------------------------------------------------------

    /**
     * Navigate References  :
     */
    geReferences() {
        this.rt.navigateByUrl('/apps/preferences');
    }


    /**
     * Navigate To Courriers Partages :
     */
    navigateToCourriersPartages() {
        this.rt.navigate(['/apps/courriers-partages']);
    }

    /**
     * Navigate To Agenda :
     */
    navigateToAgenda() {
        this.rt.navigate(['/apps/agenda']);
    }
    /**
     * Navigate To Courriers Partages :
     */
    navigateToDocumentsPartages() {
        this.rt.navigate(['/apps/documents-partages']);
    }

    /**
     * Navigate To Courriers Partages :
     */
    navigateToCourrierTraites() {
        this.rt.navigate(['/apps/courriers-a-traites']);
    }
    /**
     * Getter for current year
     */
    get currentYear(): number {
        return new Date().getFullYear();
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Lifecycle hooks
    // -----------------------------------------------------------------------------------------------------

    /**
     * On init
     */

    ngOnInit(): void {
        this.auth.getuser().subscribe(user => {
            sessionStorage.setItem("authenticatedUser", user["username"])
            sessionStorage.setItem("uslog", JSON.stringify(user));
            this.rest.getAbs(user['userId']).subscribe(abs => {
              sessionStorage.setItem("arrayAbs", JSON.stringify(abs));
            })
            this.getLogo();
            //  this.toast.info("Vous avez reçu un message !","Notification") ;

            this.getMessage();
            this.countSteps();
            this.getSharedFolders()

            this.currentUser = JSON.parse(sessionStorage.getItem('uslog'));
            const currentUser = JSON.parse(sessionStorage.getItem('uslog'));

            // this.serviceUser.getUserImage().subscribe(
            //     (res) => {
            //       if (res) {
            //         if (res['img']) this.photo = res['img'];
            //       }
            //     },
            //     (err) => {
            //       this.photo = 'assets/' + currentUser.sexe + '.png';
            //     }
            //   );
          });

          this.rest.getQualityNpPage().subscribe((qualities: any[]) => {
            console.log('this.user',this.user)
            qualities.forEach(quality => {
              if (quality["subordonnee"] == 1) {

                if (quality["code"] == this.user['title']) {
                  this.hasAccessSubo = true
                }
              }
            })

          });

        //   this.serviceUser.getCountMessage().subscribe((r) => {
        //     this.messageNumber = r as number;
        //   });
          this.user = new User();
        //   console.log(this.user.fromLdap)
          this.user = this.service.tst(
            this.user,
            JSON.parse(sessionStorage.getItem('uslog'))
          );




    //   this.reload();
        this._navigationService.getPosition().subscribe({
            next: (pos: string) => {
                this.position = pos;
            },
        });

        combineLatest([
            this._fuseConfigService.config$,
            this._fuseMediaWatcherService.onMediaQueryChange$([
                '(prefers-color-scheme: dark)',
                '(prefers-color-scheme: light)',
            ]),
        ])
            .pipe(
                takeUntil(this._unsubscribeAll),
                map(([config, mql]) => {
                    const options = {
                        scheme: config.scheme,
                        theme: config.theme,
                    };

                    // If the scheme is set to 'auto'...
                    if (config.scheme === 'auto') {
                        // Decide the scheme using the media query
                        options.scheme = mql.breakpoints[
                            '(prefers-color-scheme: dark)'
                        ]
                            ? 'dark'
                            : 'light';
                    }

                    return options;
                })
            )
            .subscribe((options) => {
                // Store the options
                this.scheme = options.scheme;
                this.theme = options.theme;

                // Update the scheme and theme
                this._updateScheme();
                this._updateTheme();
            });
        // Subscribe to navigation data
        this._navigationService.navigation$
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((navigation: Navigation) => {
                this.navigation = navigation;
            });

        // Subscribe to media changes
        this._fuseMediaWatcherService.onMediaChange$
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe(({ matchingAliases }) => {
                // Check if the screen is small
                this.isScreenSmall = !matchingAliases.includes('md');

                // Set navigation appearance based on screen size
                this.navigationAppearance = this.isScreenSmall
                    ? 'default'
                    : 'dense';
            });
    }

    // timeout() {
    //     this.timeOutIDs.push(
    //       setTimeout(() => {
    //         this.getMessage();
    //         this.countSteps();
    //         this.getSharedFolders()

    //       }, 660000) //30

    //     );
    //   }
      reload() {
        setTimeout(() => {
        //   this.countSteps();
          this.reload();
        }, 3000000);
      }
    getMessage() {
        console.log(111);
        this.countSteps();
        this.serviceUser.getCountMessage().subscribe((r) => {
          //@ts-ignore
          if (r > this.messageNumber && r != 0) {
            const mm = this.toast.info(
              "Vous avez reçu un document !",
              "Documania courrier : "
            );
            mm.onTap.subscribe((action) =>
              this.rt.navigate(['apps/corriers-recents'])
            );
          }
          this.messageNumber = r as number;
          if (r == 0) {
            this.dataMessage = "0 document partagé";
          }
          if (r == 1) {
            this.dataMessage = "1 nouveau document";
          }
          //@ts-ignore
          if (r > 1) {
            this.dataMessage = r + " nouveaux documents";
          }
        });
    }

    countSteps() {
        console.log(222);

        this.rest.getCountSteps().subscribe((r) => {
          //@ts-ignore
          if (r > this.courrierNumber) {
            const mm = this.toast.warning(
              "Merci de consulter votre boîte, vous avez des courriers à traiter",
              "Documania courrier : "
            );
            mm.onTap.subscribe((action) =>
              this.rt.navigate(['apps/courriers-a-traites'])
            );
          }

          this.courrierNumber = r as number;
          if (r == 0) {
            this.courrierMessage = "0 courrier à traiter";
          }
          if (r == 1) {
            this.courrierMessage = "1 courrier à traiter";
          }
          //@ts-ignore
          if (r > 1) {
            this.courrierMessage = r + " courriers à traiter";
          }
        });
      }


    getSharedFolders() {
        this.sharedFoldersService.count().subscribe(r => {
    //@ts-ignore
          if (r > this.sharedFoldersNumber && r != 0) {
            this.toast.info("Vous avez reçu un courrier !", "Documania courrier : ");
          }
          this.sharedFoldersNumber = r as number;

        })
      }
    /**
     * Set the scheme on the config
     *
     * @param scheme
     */
    setScheme(scheme: Scheme): void {
        this._fuseConfigService.config = { scheme };
    }
    /**
     * Toggle the theme between 'dark' and 'light' and save to sessionStorage
     */
    toggleTheme(): void {
        const newScheme = this.config.scheme === 'dark' ? 'light' : 'dark';

        // Set the new scheme in the config
        this.setScheme(newScheme);

        // Save the scheme to sessionStorage
        sessionStorage.setItem('theme', newScheme);
    }
    /**
     * Update the selected scheme
     *
     * @private
     */
    private _updateScheme(): void {
        // Remove class names for all schemes
        this._document.body.classList.remove('light', 'dark');

        // Add class name for the currently selected scheme
        this._document.body.classList.add(this.scheme);
    }

    /**
     * Update the selected theme
     *
     * @private
     */
    private _updateTheme(): void {
        // Find the class name for the previously selected theme and remove it
        this._document.body.classList.forEach((className: string) => {
            if (className.startsWith('theme-')) {
                this._document.body.classList.remove(
                    className,
                    className.split('-')[1]
                );
            }
        });

        // Add class name for the currently selected theme
        this._document.body.classList.add(this.theme);
    }

    /**
     * On destroy
     */
    ngOnDestroy(): void {
        // Unsubscribe from all subscriptions
        this._unsubscribeAll.next(null);
        this._unsubscribeAll.complete();
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Toggle navigation
     *
     * @param name
     */
    toggleNavigation(name: string): void {
        // Get the navigation
        const navigation =
            this._fuseNavigationService.getComponent<FuseVerticalNavigationComponent>(
                name
            );

        if (navigation) {
            // Toggle the opened status
            navigation.toggle();
        }
        this.isMobile = true;
    }

    /**
     * Toggle the navigation appearance based on the sidebar's state
     */
    toggleNavigationAppearance(): void {
        this.isSidebarOpen = !this.isSidebarOpen; // Toggle the sidebar open/close state
        this.navigationAppearance = this.isSidebarOpen ? 'default' : 'dense'; // Switch appearance
        this.isMobile = false;
    }
    hoveredChanged(hovered: boolean): void {
        this.hovered = hovered;
    }

    // +++++++++++++++++++++++++++++++++++++++++
    fs() {
        sessionStorage.setItem('WLS', 'f');
        this.hideMenu();
    }
    ds() {
        sessionStorage.setItem('WLS', 'd');
        this.hideMenu();
    }

      getLogo() {
        this.rest.getLogo().subscribe((res) => {
          if (res['base64'] != null) {
            localStorage.setItem('lg', res['base64'] as string);
            this.logo = localStorage.getItem('lg');
          } else this.logo = null;
        });
        //  this.Session.loadClients();
        // this.Session.loadFoldersTypes();
      }
    logout() {
        sessionStorage.clear();
        localStorage.clear();
        this.service.logout().subscribe((r) => {
            this.timeOutIDs.forEach((id) => clearTimeout(id));
            this.routeGaurd.isLoggedIn = false;
            this.rt.navigateByUrl('auth/login');
        });
        this.cookies.delete('secondary');
        this.cookies.delete('JSESSIONID');
    }
    close() {
        this.etat = 0;
        this.etatSrch = 0;
        this.hideMenu();
    }

    hideMenu() {
        // $('#sidebar-wrapper').removeClass('show-menu');
    }
    show() {
        if (this.etat == 0) this.etat = 1;
        else this.etat = 0;

        this.etatSrch = 0;
        return false;
    }
    showEtat() {
        if (this.etatSrch == 0) this.etatSrch = 1;
        else this.etatSrch = 0;
        this.etat = 0;
        return false;
    }

    showMenu(e) {
        if (e.target.checked == true) {
            //   $('#sidebar-wrapper').addClass('show-menu');
        } else {
            //   $('#sidebar-wrapper').removeClass('show-menu');
        }
    }

    changeLang(lang) {
        //     console.log("entred");
        //     console.log(event);
        //  if(event.target.checked)
        //  {
        //   this.config.getConfigLang('ar')
        //  }
        //  else{
        //   this.config.getConfigLang('fr')
        //  }
        // this.config.getConfigLang(lang)
    }

    shrinkSideBar(e) {
        if (e == 'true') {
            sessionStorage.setItem('shrink', 'true');
            this.state = true;
            //   $('#sidebar-wrapper').animate({
            //     width: '7%'
            //   }, 300)

            //   $('#image').addClass("image")

            let textArray = document.querySelectorAll('#act-1');

            textArray.forEach((element) => {
                element.classList.add('display-none');
            });
            let aArray = document.querySelectorAll('#center');

            aArray.forEach((element) => {
                element.classList.add('center');
            });

            document.getElementById('open').style.display = 'none';
            document.getElementById('close').style.display = 'flex';
        } else if (e == 'false') {
            sessionStorage.setItem('shrink', 'false');
            this.state = false;
            //   $('#sidebar-wrapper').animate({
            //     width: '20%'
            //   }, 300)
            //   $('#image').removeClass("image")
            let textArray = document.querySelectorAll('#act-1');

            textArray.forEach((element) => {
                element.classList.remove('display-none');
            });
            let aArray = document.querySelectorAll('#center');

            aArray.forEach((element) => {
                element.classList.remove('center');
            });

            document.getElementById('open').style.display = 'flex';
            document.getElementById('close').style.display = 'none';
        }
    }

    i = 1;
    @HostListener('window:resize', ['$event'])
    onResize(event) {
        if (event.target.innerWidth < 900) {
            if (this.i == 1 && this.state == true) {
                // $('#image').removeClass("image")
                let textArray = document.querySelectorAll('#act-1');

                textArray.forEach((element) => {
                    element.classList.remove('display-none');
                });
                let aArray = document.querySelectorAll('#center');

                aArray.forEach((element) => {
                    element.classList.remove('center');
                });
                this.i = 2;
            }
        } else {
            this.i = 1;
            if (this.i == 1 && this.state == true) {
                // $('#image').addClass("image")

                let textArray = document.querySelectorAll('#act-1');

                textArray.forEach((element) => {
                    element.classList.add('display-none');
                });
                let aArray = document.querySelectorAll('#center');

                aArray.forEach((element) => {
                    element.classList.add('center');
                });
            }
        }
    }
}
