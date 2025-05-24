import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AllConfigurationsService {
    [x: string]: any;
    BARCODE_STRATEGY:string;
    BARCODE_STRATEGY_1: string;
    BARCODE_STRATEGY_2: string;
    LEDGER:string;
    LEDGER_DEFAULT: string;
    LEDGER_URL:string;
    LEDGER_KEY:string;
    CAPUTRE_URL : string;
    CAPUTRE : { adresseRest,adresseSocket,portSocket , ssl };
    BORDEREAU_ATTRIBUTES;
   BORDEREAU_TITLE:string;
   icon_classes
   BORDEREAU_LOGO:string;
   ICONS
    constructor() { }
}
