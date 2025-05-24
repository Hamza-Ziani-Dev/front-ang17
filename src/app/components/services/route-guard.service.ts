import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from '../auth/services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class RouteGuardService implements CanActivate {

  public isLoggedIn=false
  public redirectUrl;
  constructor(private auth:AuthService,private router:Router) { }
  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean | UrlTree |
  Observable<boolean | UrlTree> | Promise<boolean | UrlTree> {


    this.redirectUrl=state.url
    return this.checkLogin(this.redirectUrl);
    throw new Error('Method not implemented.');
  }
  checkLogin(url)
  {
if(this.isLoggedIn)
{
  return true;
}
else{
  if(this.auth.isUserLoggedIn())
  {
this.isLoggedIn=true;

this.router.navigateByUrl(url);

  }
  else
  {
    this.isLoggedIn=false;


this.router.navigateByUrl("/login");

  }
}

  }
}
