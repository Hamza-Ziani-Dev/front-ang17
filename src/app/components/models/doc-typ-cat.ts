import { Category } from './Category';
import { DocumentType } from './document-type';

export class DocTypCat {
    id:Number;
    name:string;
    category:Category;

    constructor(dt:DocumentType)
    {
        this.category=new Category();
        this.id=dt.id;
        this.name=dt.name;
    }
}
