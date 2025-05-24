import { required } from '@rxweb/reactive-form-validators';

export class Folder {

    id: string;

	type: number;
public receiver:string;
   public	destinataire: number;
    public objet:string;
    public motif:string;
    public instru:string;
public accuse;
public finalise;
  public etapes = new Array();
  public dest = new Array();

	public owner: number;

	reference: string;
  isArchived
  inProgress: Boolean = false;
  isExpire: Boolean = false;
  closeEnd: Boolean = false;
  isDone: Boolean
	nature: number;

	date

    public creation_date: Date;
	public last_edit_date: Date;

    public is_delete: Boolean ;

    public parent_folder: string;

	field1: number;

	public  field2: string;

	public field3: string;

	public field4: string;












constructor(){}

}
