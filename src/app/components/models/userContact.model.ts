import { required } from '@rxweb/reactive-form-validators';
import { Contact } from './contact.model';
import { User } from './User';
import { Category } from './Category';
import { password } from './password.model';


export class userContact {

  public userId: number;
  public isValid: number;
  public registrationDate: Date;
  public username: string;
  public hasAccessClient: number;
  public hasAccessSecondary: number;
  public lastLogin: Date;
  public category: Category;
  public pw: password;
  public master: userContact;
  public seconnder: userContact;
  public has
  public parent;
  public title;
  public groupId;
  @required()
  private fullName: string;
  public get _fullName(): string {
    return this.fullName;
  }
  public set _fullName(value: string) {
    this.fullName = value;
  }
  @required()
  private nomClient: string;
  public get _nomClient(): string {
    return this.nomClient;
  }
  public set _nomClient(value: string) {
    this.nomClient = value;
  }


  @required()
  private email: string;
  public get _email(): string {
    return this.email;
  }
  public set _email(value: string) {
    this.email = value;
  }

  private contact: Contact;
  public get _contact(): Contact {
    return this.contact;
  }
  public set _contact(value: Contact) {
    this.contact = value;
  }





  constructor(us: User, ct: Contact, cat: Category, pw: password) {
    this._contact = ct;
    this._fullName = us._fullName;
    this._email = us._email;
    this._nomClient = us._nomClient;
    this.category = cat;
    this.master = null;
    this.seconnder = null;
    this.isValid = us._isValid;
    this.lastLogin = us._lastLogin;
    this.pw = pw;
    this.userId = us._userId;
    this.username = us._username;
    this.registrationDate = us._registrationDate;
    this.hasAccessClient = us.hasAccessClient;
    this.hasAccessSecondary = us.hasAccessSecondary;
    this.title = us.title
    this.parent = us.parent;
    this.groupId = us.groupId
  }
}
