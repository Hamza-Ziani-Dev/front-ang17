import { AttributeType } from './AttributeType';


export class Attribute{

    id: number;
    type: string;
    name: string;
    libelle: string;
    labelfr: string;
    labelar: string;
    labeleng: string;
  defaultValue: string;
  listDep: String
  configId: number;
  tableConfig: string;
    val: string;
    constructor()
    {

    }

}
export class AttributeT
{
    id:number;
    type:AttributeType;
    name:string;
    constructor()
    {}
}

