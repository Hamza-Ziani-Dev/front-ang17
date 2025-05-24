import { required, compare } from '@rxweb/reactive-form-validators';

export class confPw{

    @required()
    fpassword:string;
    @required()
    password: string;

    @compare({fieldName:'password'})
    confirmPassword:string;
}
