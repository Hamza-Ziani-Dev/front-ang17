import { Route } from '@angular/router';
import { initialDataResolver } from 'app/app.resolvers';
// import { AuthGuard } from 'app/core/auth/guards/auth.guard';
// import { NoAuthGuard } from 'app/core/auth/guards/noAuth.guard';
import { LayoutComponent } from 'app/layout/layout.component';

export const appRoutes: Route[] = [

    {path: '', pathMatch : 'full', redirectTo: 'auth/login'},


    // Auth routes for guests
    // {
    //     path: '',
    //     canActivate: [NoAuthGuard],
    //     canActivateChild: [NoAuthGuard],
    //     component: LayoutComponent,
    //     data: {
    //         layout: 'empty'
    //     },
    //     children: [
    //         {path: 'sign-in', loadChildren: () => import('app/components/auth/sign-in/sign-in.routes')},
    //         {path: 'sign-up', loadChildren: () => import('app/components/auth/sign-up/sign-up.routes')}
    //     ]
    // },

    // Auth routes for authenticated users
    // {
    //     path: '',
    //     canActivate: [AuthGuard],
    //     canActivateChild: [AuthGuard],
    //     component: LayoutComponent,
    //     data: {
    //         layout: 'empty'
    //     },
    //     children: [
    //         {path: 'sign-out', loadChildren: () => import('app/modules/auth/sign-out/sign-out.routes')},
    //         {path: 'unlock-session', loadChildren: () => import('app/modules/auth/unlock-session/unlock-session.routes')}
    //     ]
    // },



    // Admin routes
    {
        path: '',
        // canActivate: [AuthGuard],
        // canActivateChild: [AuthGuard],
        component: LayoutComponent,
        resolve: {
            initialData: initialDataResolver
        },

        children: [
            {path: 'auth/login', loadChildren: () => import('app/components/auth/sign-in/sign-in.routes')},
            {path: 'auth/logout', loadChildren: () => import('app/components/auth/sign-up/sign-up.routes')},

            // Dashboards
            {path: 'dashboards', children: [
                {path: '', loadChildren: () => import('app/components/dashboard/charts/charts.routes')},
                {path: 'admin', loadChildren: () => import('app/components/dashboard/console-admin/console-admin.routes')},
            ]},




            // Apps
            {path: 'apps', children: [
                {path: 'ajouter-courrier', loadChildren: () => import('app/components/apps/ajouter-courrier/ajouter-courrier.routes')},
                {path: 'ajouter-document', loadChildren: () => import('app/components/apps/ajouter-document/ajouter-document.routes')},
                {path: 'courrier-recents', loadChildren: () => import('app/components/apps/courriers-recents/courriers-recents.routes')},
                {path: 'courriers-favoris', loadChildren: () => import('app/components/apps/courriers-favoris/courriers-favoris.routes')},
                {path: 'courrier-equipe', loadChildren: () => import('app/components/apps/courrier-mon-equipe/courrier-mon-equipe.routes')},
                {path: 'flux-courriers', loadChildren: () => import('app/components/apps/flux-courriers/flux-courriers.routes')},
                {path: 'courrier-archives', loadChildren: () => import('app/components/apps/courrier-archives/courrier-archives.routes')},
                {path: 'reporting', loadChildren: () => import('app/components/apps/rechercher-courrier/rechercher-courrier.routes')},
                {path: 'preferences', loadChildren: () => import('app/components/apps/preferences/preferences.routes')},
                {path: 'courriers-traites', loadChildren: () => import('app/components/apps/courriers-traites/courriers-traites.routes')},
                {path: 'recherches-frequentes', loadChildren: () => import('app/components/apps/recherches-frequentes/recherches-frequentes.routes')},
                {path: 'rechercher-document', loadChildren: () => import('app/components/apps/rechercher-document/rechercher-document.routes')},
                {path: 'rechercher-courrier', loadChildren: () => import('app/components/apps/rechercher-courrier/rechercher-courrier.routes')},
                {path: 'liaison-courrier-courrier', loadChildren: () => import('app/components/apps/ajouter-liaison-courrier-courrier/liaison-courrier-courrier.routes')},
                {path: 'liaison-document-courrier', loadChildren: () => import('app/components/apps/ajouter-liaison-document-courrier/liaison-document-courrier.routes')},
                { path: 'courriers-partages', loadChildren: () => import('app/components/apps/courries-partages/courries-partages.routes')},
                { path: 'documents-partages', loadChildren: () => import('app/components/apps/documents-partages/documents-partages.routes')},
                { path: 'courriers-a-traites', loadChildren: () => import('app/components/apps/steps-to-dos/steps-to-dos.routes')},
                { path: 'ajouter-bulk', loadChildren: () => import('app/components/apps/ajouter-bulk-courrier/ajouter-bulk-courrier.routes')},
                { path: 'documents-list', loadChildren: () => import('app/components/apps/documents-list/documents-list.routes')},
                { path: 'agenda', loadChildren: () => import('app/components/apps/agenda/agenda.routes')}

            ]},

            // Pages
            {path: 'pages', children: [

                // not found
                {path: 'not-found', loadChildren: () => import('app/components/pages/not-found/not-found.routes')},
                ]},


            ]},


        ]

