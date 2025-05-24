import { Injectable, EventEmitter } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ReloadService {
  public event;
  constructor() {
    this.event = new EventEmitter<any>();
  }


}
