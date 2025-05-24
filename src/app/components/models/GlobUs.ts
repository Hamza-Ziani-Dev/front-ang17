import { Injectable } from '@angular/core';
import { User } from './User';
 
@Injectable()
export class CurrentUser {
  token: User;
  /**
   *
   */
  constructor() {
    this.token=new User();
      
  }
}