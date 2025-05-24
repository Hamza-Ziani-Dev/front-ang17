import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AllConfigurationsService } from './all-configurations.service';
import { User } from '../models/User';
import { RestApiService } from './rest-api.service';
import { environment } from 'environments/environment.development';

@Injectable({
  providedIn: 'root'
})
export class ConfigurationsService {

  configuration;
  private header: HttpHeaders
  private header2: HttpHeaders

  private user: User;
  constructor(
    private http: HttpClient,
     private serviceU: RestApiService,
     private allConfig: AllConfigurationsService) {



    this.user = new User();
    this.user = serviceU.tst(this.user, JSON.parse(sessionStorage.getItem("uslog")));
    this.header = new HttpHeaders
      ({
        'content-Type': 'application/json'
        // 'Authorization': 'Basic ' + btoa(this.user._username + ":" + sessionStorage.getItem("pw"))
      });
    this.header2 = new HttpHeaders
      ({

        // 'Authorization': 'Basic ' + btoa(this.user._username + ":" + sessionStorage.getItem("pw"))
      });

    this.getSelectedDatabase().subscribe(res => {


      this.dbs = res




    })
  }


  getCapture(name) {
    this.http.get(environment.basicUrl + "/configuration/" + name, { headers: this.header }).subscribe(res => {
      if (res['configName'] === "CAPTURE") {
        this.allConfig.CAPUTRE = JSON.parse(res['configValue']);
      }
    });
  }

  getUserConfigs() {


    this.http.get(environment.apiUrl + "/configurations", { headers: this.header }).subscribe(res => {

      this.configuration = res;
      this.configuration.forEach(cfg => {


        if (cfg['configName'] === 'BARCODE_STRATEGY') {

          this.allConfig.BARCODE_STRATEGY = cfg['configValue'];

        }

        if (cfg['configName'] === 'BARCODE_STRATEGY_1') {

          this.allConfig.BARCODE_STRATEGY_1 = cfg['configValue'];

        }
        if (cfg['configName'] === 'BARCODE_STRATEGY_2') {

          this.allConfig.BARCODE_STRATEGY_2 = cfg['configValue'];

        }
        if (cfg.configName == "LEDGER") {
          const c = cfg.configValue.split("|")
          this.allConfig.LEDGER = c[0]
          this.allConfig.LEDGER_URL = c[1]
          this.allConfig.LEDGER_KEY = c[2]
        }
        if (cfg['configName'] === "CAPTURE_URL") {


          this.allConfig.CAPUTRE_URL = cfg['configValue'];

        }
        if (cfg['configName'] === "CAPTURE") {


          this.allConfig.CAPUTRE = JSON.parse(cfg['configValue']);

        }
        if (cfg['configName'] === "BORDEREAU_ATTRIBUTES") {


          this.allConfig.BORDEREAU_ATTRIBUTES = cfg['configValue'].split("||");

          sessionStorage.setItem("BORDEREAU_ATTRIBUTES", cfg['configValue']);

        }
        if (cfg.configName == "RM") {
          const c = cfg.configValue.split("|")
          console.log(c)
          this.allConfig.PARCOURRIER = c[0]
          this.allConfig.RM = c[1]
          this.allConfig.RM_URL = c[2]
          this.allConfig.RM_KEY = c[3]
          this.allConfig.RM_PUSH_ENDPOINT = c[4]
          this.allConfig.RM_GET_ENDPOINT = c[5]

        }
        if (cfg['configName'] === "BORDEREAU_TITLE") {
          this.allConfig.BORDEREAU_TITLE = cfg['configValue'];
          sessionStorage.setItem("BORDEREAU_TITLE", cfg['configValue']);
        }
        if (cfg['configName'] === "USER_INREGRATION_INFO") {
          var decodedStringAtoB = atob(cfg["configValue"]);
          let data = JSON.parse(decodedStringAtoB)
          this.allConfig.EXPORT_STATUS = data?.enabled
        }
        // if (cfg['configName'] === "ICONS_CONFIG") {
        //   console.log(cfg['configValue'])
        //   this.allConfig.icon_classes = JSON.parse(cfg['configValue']) ;
        //   console.log(this.allConfig.icon_classes);

        // }

      });
    });


  }

  testDbConnection(db) {

    return this.http.post(environment.apiUrl + "/configurations/dbtest", db, { headers: this.header });
  }

  addNewConfig(configName, configValue) {
    const config = {
      id: 0,
      configName: configName,
      configValue: configValue
    }

    return this.http.post(environment.apiUrl + "/configurations", config, { headers: this.header });


  }



  storageConfig(configName, configValue) {
    const config = {
      id: 0,
      configName: configName,
      configValue: configValue
    }

    return this.http.post(environment.apiUrl + "/configurations/storage", config, { headers: this.header });


  }

  getNextVal() {

    return this.http.get(environment.apiUrl + "/configurations/nextbarcodeval", { headers: this.header })


  }
  getConfigByName(name) {
    return this.http.get(environment.apiUrl + "/configurations/" + name, { headers: this.header })
  }
  activePath() {
    return this.http.get(environment.apiUrl + "/configurations/activepath", { headers: this.header })
  }
  dbs: any = [];
  getSelectedDatabase() {

    return this.http.get(environment.apiUrl + "/configurations/selecteddb", { headers: this.header })


  }
  addNewConfigs(configs) {


    return this.http.post(environment.apiUrl + "/configurations/multi", configs, { headers: this.header });


  }
}



