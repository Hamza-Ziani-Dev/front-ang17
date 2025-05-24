import { Contact } from './contact.model';

export class ClientCont{
 public id: number;
   
    private master: number;
    public get _master(): number {
        return this.master;
    }
    public set _master(value: number) {
        this.master = value;
    }
   public name: string;
   public contact: Contact;
   
    }

