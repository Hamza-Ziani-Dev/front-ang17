import { Injectable } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';

@Injectable(
    {
    providedIn: 'root'
  }
)
export class PreviousRouteService {

  private previousUrl: string;
  private currentUrl: string;

  constructor(private router: Router) {
    this.currentUrl = this.router.url;
    router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        this.previousUrl = this.currentUrl;
        this.currentUrl = event.url;
      };
    });
  }

  public getPreviousUrl() {

    return this.previousUrl;
  }


  isStillActive(route: string) {
    // console.log(this.currentUrl);

    let flag = false;
    if (route !== this.currentUrl && this.currentUrl==='/apps/courrier-recents') {
        if(route===this.previousUrl||route.includes(this.previousUrl))
        return true;
    }
    return false;
  }
}
