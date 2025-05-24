import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class CommonApplicationConfigsService {

  constructor() { }

  MAX_FIELD_LENGHT :number = 20
  MIN_FIELD_LENGHT :number = 3
}
