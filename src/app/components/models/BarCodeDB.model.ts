export default class BarCodeDB {

     app : string ="";
     host : string="";
     port : string="";
     user : string="";
     pass : string="";
     dbName : string="";
     table : string="";
     column : string="";
     constructor(){

   

     }
     ToString(){
       return `${this.app}|${this.host}|${this.port}|${this.user}|${this.pass}|${this.dbName}|${this.table}|${this.column}`

     }

     ToObject(configval : string){
          const fields : Array<string>= configval.split('|');

          this.app=fields[0];
          this.host=fields[1];
          this.port=fields[2];
          this.user=fields[3]
          this.pass=fields[4];
          this.dbName=fields[5];
          this.table=fields[6];
          this.column=fields[7];
     }
     
}