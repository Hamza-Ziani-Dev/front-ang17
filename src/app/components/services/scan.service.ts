import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ScanService {


  private _scanSessionId = "";
  constructor() { }


  get scanSessionId(): string {
    return this._scanSessionId;

  }
  set setScanSessionId(value:string){
    this._scanSessionId = value
  }
}
