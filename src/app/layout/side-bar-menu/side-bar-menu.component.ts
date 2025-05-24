import { Component, Injectable } from '@angular/core';
import { FuseNavigationItem } from 'shared/components/navigation';
import { cloneDeep } from 'lodash-es';
import { TranslocoModule, TranslocoService } from '@ngneat/transloco';
import { ConfigService } from 'app/components/services/config.service';
import { FuseMockApiService } from 'shared/lib/mock-api';
import { HttpClientModule } from '@angular/common/http';
import {environment} from "environments/environment.development"
@Injectable({ providedIn: 'root' })
@Component({
    selector     : 'side-bar-menu',
    templateUrl  : './side-bar-menu.component.html',
    styleUrls    : ['./side-bar-menu.component.scss'],
    standalone   : true,
    imports      : [
        TranslocoModule,
        HttpClientModule,
    ],
})
export class SideBarMenuComponent {
    private readonly currentUser: any;
    showAdminConsole = environment.showAdminConsole;
    showFluxCourriers = environment.showFluxCourriers;
    showDocumentPartager = environment.showDocumentPartager;
    private readonly _defaultNavigation: FuseNavigationItem[];
    constructor(
        private _fuseMockApiService: FuseMockApiService,
        private _translocoService: TranslocoService,
        private configService: ConfigService,

    ) {
        this.currentUser = JSON.parse(sessionStorage.getItem('uslog'))
        // this.currentUser = JSON.parse(localStorage.getItem('user'));
        console.log("this.currentUser",this.currentUser)
        this._defaultNavigation = this.getDefaultNavigation();
        this.registerHandlers();

    }



    private getDefaultNavigation(): FuseNavigationItem[] {
        const nav: FuseNavigationItem[] =  [
            {
                id: 'courriersrecents',
                title: this._translocoService.translate('navbar.courrierrecent'),
                type: 'basic',
                icon: 'heroicons_outline:clock',
                link: '/apps/courrier-recents',
                classes: {
                    title: 'text-red-blue font-bold  text-base hover:text-blue-500 active:text-blue-700', // Hover effect and active link color
                    icon: 'text-blue-500 hover:text-blue-700'
                },
                
            },
            {
                id: 'courriersfavoris',
                title: this._translocoService.translate('navbar.courrierfavoris'),
                type: 'basic',
                icon: 'heroicons_outline:star',
                link: '/apps/courriers-favoris',
                classes: {
                    title: 'text-red-blue font-bold  text-base hover:text-blue-500 active:text-blue-700', // Active text color blue
                    icon: 'text-yellow-500 hover:text-blue-700'
                },
                
            },
            {
                id: 'courrierequipe',
                title: this._translocoService.translate('navbar.courrierequipe'),
                type: 'basic',
                icon: 'heroicons_outline:users',
                link: '/apps/courrier-equipe',
                classes: {
                    title: 'text-red-blue font-bold  text-base hover:text-blue-500 active:text-blue-700',
                    icon: 'text-green-500 hover:text-blue-700'
                },
                
            },
            {
                id: 'courrierstraites',
                title: this._translocoService.translate('navbar.courriertraites'),
                type: 'basic',
                icon: 'heroicons_outline:check-circle',
                link: '/apps/courriers-traites',
                classes: {
                    title: 'text-red-blue font-bold  text-base hover:text-blue-500 active:text-blue-700',
                    icon: 'text-gray-500 hover:text-blue-700'
                },
                
            },
            {
                id: 'recherchefrequentes',
                title: this._translocoService.translate('navbar.recherchefrequentes'),
                type: 'basic',
                icon: 'heroicons_outline:magnifying-glass',
                link: '/apps/recherches-frequentes',
                classes: {
                    title: 'text-red-blue font-bold  text-base hover:text-blue-500 active:text-blue-700',
                    icon: 'text-blue-400 hover:text-blue-700'
                },
                
            },
            {
                id: 'referentielcourriers',
                title: this._translocoService.translate('navbar.referentielcourriers'),
                type: 'collapsable',
                icon: 'heroicons_outline:folder',
                classes: {
                    title: 'text-red-blue font-bold  text-base hover:text-blue-500 active:text-blue-700',
                    icon: 'text-purple-500 hover:text-blue-700'
                },
                children: [
                    {
                        id: 'recherchercourrier',
                        title: this._translocoService.translate('navbar.recherchercourrier'),
                        type: 'basic',
                        icon: 'heroicons_outline:envelope',
                        link: '/apps/rechercher-courrier',
                        classes: {
                            title: 'text-red-blue font-bold  text-base hover:text-blue-500 active:text-blue-700',
                            icon: 'text-red-500 hover:text-blue-700'
                        },
                        
                    },
                    {
                        id: 'rechercherdocument',
                        title: this._translocoService.translate('navbar.rechercherdocument'),
                        type: 'basic',
                        icon: 'heroicons_outline:document-magnifying-glass',
                        link: '/apps/rechercher-document',
                        classes: {
                            title: 'text-red-blue font-bold  text-base hover:text-blue-500 active:text-blue-700',
                            icon: 'text-orange-500 hover:text-blue-700'
                        },
                        
                    },
                ],
            },
            {
                id: 'ajoutercourrier',
                title: this._translocoService.translate('navbar.ajoutercourrier'),
                type: 'basic',
                icon: 'heroicons_outline:plus-circle',
                link: '/apps/ajouter-courrier',
                classes: {
                    title: 'text-red-blue font-bold  text-base hover:text-blue-500 active:text-blue-700',
                    icon: 'text-teal-500 hover:text-blue-700'
                },
                
            },
            {
                id: 'ajouterdocument',
                title: this._translocoService.translate('navbar.ajouterdocument'),
                type: 'basic',
                icon: 'heroicons_outline:document-plus',
                link: '/apps/ajouter-document',
                classes: {
                    title: 'text-red-blue font-bold  text-base hover:text-blue-500 active:text-blue-700',
                    icon: 'text-pink-500 hover:text-blue-700'
                },
                
            },
            {
                id: 'ajouterliaisons',
                title: this._translocoService.translate('navbar.ajouterliaison'),
                type: 'collapsable',
                icon: 'heroicons_outline:link',
                classes: {
                    title: 'text-red-blue font-bold  text-base hover:text-blue-500 active:text-blue-700',
                    icon: 'text-indigo-500 hover:text-blue-700'
                },
                children: [
                    {
                        id: 'courriercourrier',
                        title: this._translocoService.translate('navbar.courriercourrier'),
                        type: 'basic',
                        icon: 'heroicons_outline:arrows-right-left',
                        link: '/apps/liaison-courrier-courrier',
                        classes: {
                            title: 'text-red-blue font-bold  text-base hover:text-blue-500 active:text-blue-700',
                            icon: 'text-yellow-500 hover:text-blue-700'
                        },
                        
                    },
                    {
                        id: 'documentcourrier',
                        title: this._translocoService.translate('navbar.documentcourrier'),
                        type: 'basic',
                        icon: 'heroicons_outline:document-arrow-up',
                        link: '/apps/liaison-document-courrier',
                        classes: {
                            title: 'text-red-blue font-bold text-base hover:text-blue-500 active:text-blue-700',
                            icon: 'text-green-500 hover:text-blue-700'
                        },
                        
                    },
                ],
            },
            ...(this.showFluxCourriers ? [{
                id: 'fluxcourriers',
                title: this._translocoService.translate('navbar.fluxcourriers'),
                type: 'basic' as 'basic',
                icon: 'heroicons_outline:arrow-path',
                link: '/apps/flux-courriers',
                classes: {
                    title: 'text-red-blue font-bold  text-base hover:text-blue-500 active:text-blue-700',
                    icon: 'text-blue-700 hover:text-blue-800'
                },
                
            }] : []),
            {
                id: 'dashboard',
                title: this._translocoService.translate('navbar.dashboard'),
                type: 'basic',
                icon: 'heroicons_outline:presentation-chart-bar',
                link: '/dashboards',
                classes: {
                    title: 'text-red-blue font-bold  text-base hover:text-blue-500 active:text-blue-700',
                    icon: 'text-gray-600 hover:text-blue-700'
                },
                
            },
            {
                id: 'reporting',
                title: this._translocoService.translate('navbar.reports'),
                type: 'basic',
                icon: 'heroicons_outline:document-chart-bar',
                link: '/apps/reporting',
                classes: {
                    title: 'text-red-blue font-bold  text-base hover:text-blue-500 active:text-blue-700',
                    icon: 'text-teal-400 hover:text-blue-700'
                },
                
            },
            {
                id: 'preferences',
                title: this._translocoService.translate('navbar.preferences'),
                type: 'basic',
                icon: 'heroicons_outline:cog',
                link: '/apps/preferences',
                classes: {
                    title: 'text-red-blue font-bold  text-base hover:text-blue-500 active:text-blue-700',
                    icon: 'text-purple-400 hover:text-blue-700'
                },
                
            },
            ...(this.showAdminConsole ? [{
                id: 'consoleadmin',
                title: this._translocoService.translate('navbar.consoleadmin'),
                type: 'basic' as 'basic',
                icon: 'heroicons_outline:command-line',
                link: '/dashboards/admin',
                classes: {
                    title: 'text-red-blue font-bold  text-base hover:text-blue-500 active:text-blue-700',
                    icon: 'text-blue-700 hover:text-blue-800'
                },
                
            }] : []),
            {
                id: 'logout',
                title: this._translocoService.translate('navbar.logout'),
                type: 'basic',
                icon: 'heroicons_outline:arrow-right-on-rectangle',
                link: 'auth/login',
                classes: {
                    title: 'text-red-blue font-bold  text-base hover:text-blue-500 active:text-blue-700',
                    icon: 'text-red-600 hover:text-blue-700'
                },
                
            },
        ];

    return nav;
    }
    
    
    



    // private updateNavigationTitles(translations: any): void {
    //     this._defaultNavigation.forEach(item => {
    //       if (translations[item.title]) {
    //         item.title = translations[item.title];
    //       }
    //       if (item.children) {
    //         this.updateChildrenTitles(item.children, translations);
    //       }
    //     });
    //   }

    //   private updateChildrenTitles(children: FuseNavigationItem[], translations: any): void {
    //     children.forEach(child => {
    //       if (translations[child.title]) {
    //         child.title = translations[child.title];
    //       }
    //       if (child.children) {
    //         this.updateChildrenTitles(child.children, translations);
    //       }
    //     });
    //   }
    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Register Mock API handlers
     */
    registerHandlers(): void {
        // -----------------------------------------------------------------------------------------------------
        // @ Navigation - GET
        // -----------------------------------------------------------------------------------------------------
        this._fuseMockApiService.onGet('api/common/navigation').reply(() => {
            // Return the response
            return [
                200,
                {
                    default: cloneDeep(this._defaultNavigation),
                },
            ];
        });
    }

}
