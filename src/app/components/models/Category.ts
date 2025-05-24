import { required } from '@rxweb/reactive-form-validators';

export class Category{

    @required()
    private id: number;
    public get _id(): number {
        return this.id;
     

    }
    public set _id(value: number) {
        this.id = value;
        //console.log("new value ${value}");
    }
    @required()
                public description: string;
                @required()
               public name:number;
    constructor(
        )
    
        {}
}