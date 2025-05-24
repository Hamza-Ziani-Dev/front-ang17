import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SessionStorageService {

  constructor() { }

  getWichSearch()
  { 
    const WSL = sessionStorage.getItem('WLS');

    return  WSL;

  }
  removeWichSearch(){
    sessionStorage.removeItem('WLS')
  }
}
