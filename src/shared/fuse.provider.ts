import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { APP_INITIALIZER, ENVIRONMENT_INITIALIZER, EnvironmentProviders, importProvidersFrom, inject, Provider } from '@angular/core';
import { MATERIAL_SANITY_CHECKS } from '@angular/material/core';
import { MatDialogModule } from '@angular/material/dialog';
import { MAT_FORM_FIELD_DEFAULT_OPTIONS } from '@angular/material/form-field';
import { FUSE_MOCK_API_DEFAULT_DELAY, mockApiInterceptor } from 'shared/lib/mock-api';
import { FuseConfig } from 'shared/services/config';
import { FUSE_CONFIG } from 'shared/services/config/config.constants';
import { FuseConfirmationService } from 'shared/services/confirmation';
import { fuseLoadingInterceptor, FuseLoadingService } from 'shared/services/loading';
import { FuseMediaWatcherService } from 'shared/services/media-watcher';
import { FusePlatformService } from 'shared/services/platform';
import { FuseSplashScreenService } from 'shared/services/splash-screen';
import { FuseUtilsService } from 'shared/services/utils';

export type FuseProviderConfig = {
    mockApi?: {
        delay?: number;
        services?: any[];
    },
    fuse?: FuseConfig
}

/**
 * Fuse provider
 */
export const provideFuse = (config: FuseProviderConfig): Array<Provider | EnvironmentProviders> =>
{
    // Base providers
    const providers: Array<Provider | EnvironmentProviders> = [
        {
            // Disable 'theme' sanity check
            provide : MATERIAL_SANITY_CHECKS,
            useValue: {
                doctype: true,
                theme  : false,
                version: true,
            },
        },
        {
            // Use the 'fill' appearance on Angular Material form fields by default
            provide : MAT_FORM_FIELD_DEFAULT_OPTIONS,
            useValue: {
                appearance: 'fill',
            },
        },
        {
            provide : FUSE_MOCK_API_DEFAULT_DELAY,
            useValue: config?.mockApi?.delay ?? 0,
        },
        {
            provide : FUSE_CONFIG,
            useValue: config?.fuse ?? {},
        },

        importProvidersFrom(MatDialogModule),
        {
            provide : ENVIRONMENT_INITIALIZER,
            useValue: () => inject(FuseConfirmationService),
            multi   : true,
        },

        provideHttpClient(withInterceptors([fuseLoadingInterceptor])),
        {
            provide : ENVIRONMENT_INITIALIZER,
            useValue: () => inject(FuseLoadingService),
            multi   : true,
        },
        {
            provide : ENVIRONMENT_INITIALIZER,
            useValue: () => inject(FuseMediaWatcherService),
            multi   : true,
        },
        {
            provide : ENVIRONMENT_INITIALIZER,
            useValue: () => inject(FusePlatformService),
            multi   : true,
        },
        {
            provide : ENVIRONMENT_INITIALIZER,
            useValue: () => inject(FuseSplashScreenService),
            multi   : true,
        },
        {
            provide : ENVIRONMENT_INITIALIZER,
            useValue: () => inject(FuseUtilsService),
            multi   : true,
        },
    ];

    // Mock Api services
    if ( config?.mockApi?.services )
    {
        providers.push(
            provideHttpClient(withInterceptors([mockApiInterceptor])),
            {
                provide   : APP_INITIALIZER,
                deps      : [...config.mockApi.services],
                useFactory: () => (): any => null,
                multi     : true,
            },
        );
    }

    // Return the providers
    return providers;
};
