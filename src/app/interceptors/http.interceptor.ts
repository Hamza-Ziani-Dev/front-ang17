import { HttpInterceptorFn, HttpResponse } from '@angular/common/http';
import { CookieService } from 'ngx-cookie-service';

import { Router } from '@angular/router';
import { inject } from '@angular/core';
import { tap } from 'rxjs/operators';
import { AuthService } from 'app/components/auth/services/auth.service';
import { RestApiService } from 'app/components/services/rest-api.service';

export const httpInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);
  const cookies = inject(CookieService);
  const service = inject(RestApiService);
  const route = inject(Router);

  if (authService.isUserLoggedIn() && !req.url.includes('basicauth')) {
    const csrf = cookies.get("XSRF-TOKEN");
    const secondary = cookies.get("secondary");

    const headers = {
      'X-Requested-With': 'XMLHttpRequest',
      'Authorization': sessionStorage.getItem('auth') || ''
    };

    // console.log("headers", headers);


    if (csrf) {
      headers['X-XSRF-TOKEN'] = csrf;
    }
    headers['secondary'] = secondary ? "true" : "false";

    const authReq = req.clone({ setHeaders: headers });

    return next(authReq).pipe(tap({
      next: (event) => {
        if (event instanceof HttpResponse) {
          if (event.headers.get('Autho') === 'non') {
            service.logout().subscribe(() => {
              sessionStorage.clear();
              cookies.delete("JSESSIONID");
              cookies.delete("secondary");
              location.reload();
            });
          }
        }
      },
      error: (err) => {
        if (err.status === 401) {
          cookies.delete("JSESSIONID");
          cookies.delete("secondary");
          route.navigateByUrl("login");
          sessionStorage.clear();
          location.reload(); 
        }
      }
    }));
  } else {
    return next(req).pipe(tap({
      next: (event) => {
        if (event instanceof HttpResponse) {
          if (event.headers.get('Autho') === 'non') {
            service.logout().subscribe(() => {
              sessionStorage.clear();
              cookies.delete("JSESSIONID");
              cookies.delete("secondary");
              location.reload();
            });
          }
        }
      },
      error: (err) => {
        if (err.status === 401) {
          cookies.delete("JSESSIONID");
          cookies.delete("secondary");
          route.navigateByUrl("login");
          sessionStorage.clear();
          location.reload(); // Optional: Reload the page on unauthorized access
        }
      }
    }));
  }
};
