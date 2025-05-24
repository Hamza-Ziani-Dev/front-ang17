import { propArray, required } from '@rxweb/reactive-form-validators';
import { Attribute } from './attribute.model';

export class Document{
    id: string;
    type: number;
    fileName: string;
    order: string;
    isGenerated : boolean;
    htmlContent : string;
    fullText : string;
    hasHeader : boolean;
    hasFooter : boolean;
    content:string;
    attrs: Attribute[];
    URL: string; // Assuming this is required by the API
    alinkColor: string; // Assuming this is required by the API
     constructor(){}

}
