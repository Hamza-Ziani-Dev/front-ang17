import { Routes } from '@angular/router';
import { AdminsComponent } from './admins.component';
import { AdminService } from './admin.services';
import { inject } from '@angular/core';

export default [
       {
        path     : '',
        component: AdminsComponent,

    },
] as Routes;
