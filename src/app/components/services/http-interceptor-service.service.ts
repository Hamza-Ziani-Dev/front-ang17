import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent, HttpHeaders, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { Observable } from 'rxjs';
import { map, tap } from 'rxjs/operators';

import { RestApiService } from './rest-api.service';
import { AuthService } from '../auth/services/auth.service';
@Injectable()
export class HttpInterceptorService implements HttpInterceptor {

  constructor(
    private service: RestApiService,
    private dash: RestApiService,
     private authenticationService: AuthService,
      private cookies: CookieService, private route: Router) { }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {


    if (this.authenticationService.isUserLoggedIn() && req.url.indexOf('basicauth') === -1) {



      const csrf = this.cookies.get("XSRF-TOKEN")
      const secondary = this.cookies.get("secondary")

      let hObj = {
        'X-Requested-With': 'XMLHttpRequest'
        , 'Authorization': sessionStorage.getItem('auth')
      }
      if (csrf) {

        hObj["X-XSRF-TOKEN"] = csrf

      }
      if (secondary) {

        hObj["secondary"] = "true"

      } else {
        hObj["secondary"] = "false"
      }


      const authReq = req.clone({

        headers: new HttpHeaders(hObj)
      });






      // next.handle(authReq) .pipe(tap((e)=>{
      //     console.log(e);

      // }));

      // next.handle(authReq).subscribe(r=>{


      //     if (r instanceof HttpResponse) {

      //        if(r.headers.get('Autho')=='non'){
      //        this.service.logout().subscribe(r=>{
      //         sessionStorage.clear();
      //         this.cookies.delete("JSESSIONID")
      //         // this.route.navigateByUrl("login")
      //         location.reload()
      //        })
      //        }
      //     }


      // },err=>{
      //     if(false)
      //     {
      //         this.cookies.delete("JSESSIONID")
      //         this.route.navigateByUrl("login")
      //     }
      // });
      return next.handle(authReq).pipe(tap(r => {
        if (r instanceof HttpResponse) {

          if (r.headers.get('Autho') == 'non') {
            this.service.logout().subscribe(res => {
              sessionStorage.clear();
              this.cookies.delete("JSESSIONID")
              this.cookies.delete("secondary")
              // this.route.navigateByUrl("login")
              var id = window.setTimeout(function () { }, 0);

              while (id--) {
                window.clearTimeout(id); // will do nothing if no timeout with id is present
              }

            })
          }
        }


      }, err => {
        if (err.status == 401) {
          this.cookies.delete("JSESSIONID")
          this.cookies.delete("secondary")
          this.route.navigateByUrl("login")
          sessionStorage.clear();
          var id = window.setTimeout(function () { }, 0);

          while (id--) {
            window.clearTimeout(id); // will do nothing if no timeout with id is present
          }
          window.location.reload();
        }
      }
      ));
    } else {
      // next.handle(req) .pipe(tap((e)=>{
      //     console.log(e);

      // }));
      return next.handle(req).pipe(tap(r => {
        if (r instanceof HttpResponse) {

          if (r.headers.get('Autho') == 'non') {
            this.service.logout().subscribe(res => {
              sessionStorage.clear();
              this.cookies.delete("JSESSIONID")
              this.cookies.delete("secondary")
              // this.route.navigateByUrl("login")
              var id = window.setTimeout(function () { }, 0);

              while (id--) {
                window.clearTimeout(id); // will do nothing if no timeout with id is present
              }

            })
          }
        }


      }, err => {
        if (err.status == 401) {
          this.cookies.delete("JSESSIONID")
          this.cookies.delete("secondary")
          this.route.navigateByUrl("login")
          sessionStorage.clear();
          //location.reload()
          var id = window.setTimeout(function () { }, 0);

          while (id--) {
            window.clearTimeout(id); // will do nothing if no timeout with id is present
          }
          window.location.reload();
        }
      }
      ));
    }
  }
}
