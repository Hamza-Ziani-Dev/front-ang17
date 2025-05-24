import { Location } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { environment } from 'environments/environment.development';
import { tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ConfigService {

  constructor(private http:HttpClient,private loc:Location) {

  }
  public mode=environment.mode
  public c:any={
    "dashboard": {
      "courRec": "",
      "courFav": "",
      "rechFreq": "",
      "rech": "",
      "rechCour": "",
      "rechDoc": "",
      "addCour": "",
      "addDoc": "",
      "addLink": "",
      "linkCour": "",
      "linkDoc": "",
      "flux": "",
      "report": "",
      "preference": "",
      "consolAdmin": "",
      "deco": "",
      "messagerie": "",
      "titreCour": "",
      "textCour": "",
      "0cour": "",
      "1cour": "",
      "plscour": "",
      "titreDoc": "",
      "textDoc": "",
      "0doc": "",
      "1doc": "",
      "plsdoc": ""
  },
  "login": {
    "mdpInco": "",
    "log": "",
    "log:": "",
    "mdp": "",
    "errConn": "",
    "forgot": "",
    "espace": ""
},
"dashboardClient": {
  "titre": ""
},
"folderSearch":{
  "back":""
}
  }
  public lang
  public max=environment.max;
  public maxlong=environment.maxlong
  public min=environment.min

//   getConfigLang(p='fr')
//   {
//     this.lang=p
//     this.http.get("assets/configs/"+this.lang +".json").subscribe(r=>{
//       //console.log(r)
//       this.c=r;
//       // //console.log(      this.config)

//     })
//   // this.loadTheme(this.lang)
//   }

getConfigLang(p = 'fr') {
  this.lang = p;
  return this.http.get("assets/configs/" + this.lang + ".json").pipe(
    tap((r: any) => {
      this.c = r;
    })
  );
}
  
  loadTheme(lang:string){


      const head = document.getElementsByTagName('head')[0];
    let fileUrl=lang
    // =='fr'
    // ?"src/styles.css":'src/style.ar.css';
    // if(lang=='fr'){

    // }
    // else{

    // }
        let themeLink = document.getElementById(
          'client-theme'
        ) as HTMLLinkElement;
        if (themeLink) {
          themeLink.href = fileUrl;
        } else {
          const style = document.createElement('link');
          style.id = 'client-theme';
          style.rel = 'stylesheet';
          style.href = `${fileUrl}`;

          head.appendChild(style);
        }

      }
  public goBack(){
    this.loc.back()
  }

  clsAlphaNoOnly(e) {


    // Accept only alpha numerics, no special characters

    if (e.key == "[" || e.key == "`" || e.key == "%" || e.key == "{" || e.key == "|" || e.key == "}" || e.key == "^" || e.key == "]" || e.key == "\\") {

      e.preventDefault();
      return false;
    }
    return true;


  }
}
