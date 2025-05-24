import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { ConfigService } from './config.service';
import { environment } from 'environments/environment.development';
const apiUrl = environment.apiUrl;



const hedader = new HttpHeaders({

  "content-type": "application/json"

})




@Injectable({
  providedIn: 'root'
})



export class DasboardService {


  public userSettings : any ;

  getDoneFlowCount() {
    return this.http.get<any>(apiUrl + "/dashboard/flow-done-count", { headers: hedader });
    ;
  }
  getItemsTypeByYear(bp) {
    return this.http.post<any>(apiUrl + "/dashboard/items-by-year", bp, { headers: hedader });
    ;
  }
  getItemsTypeByGroupYear(bp) {
    return this.http.post<any>(apiUrl + "/dashboard/itemsgr-by-year", bp, { headers: hedader });
    ;
  }
  getDomeFlowByUser(bp) {
    return this.http.post<any>(apiUrl + "/dashboard/done-flow-user", bp, { headers: hedader });
    ;
  }
  getDomeFlowCurrentUser(bp) {
    return this.http.post<any>(apiUrl + "/dashboard/done-flow-current-user", bp, { headers: hedader });
    ;
  }
  getStatisticUsers(bp) {
    return this.http.post<any>(apiUrl + "/dashboard/get-for-table-statistic", bp, { headers: hedader });
    ;
  }
  getInProgressFlowCount() {


    return this.http.get<any>(apiUrl + "/dashboard/flow-in-progress-count", { headers: hedader });
    ;
  }
  getUserChilds() {


    return this.http.get<any>(apiUrl + "/hierarchy/childs", { headers: hedader });
    ;
  }

  getLastQdata() {


    return this.http.get<any>(apiUrl + "/dashboard/items-last-q-data", { headers: hedader });
    ;
  }

  constructor(private http: HttpClient, private toast: ToastrService, private config: ConfigService) {

    this.updateGetUpadte().subscribe(res => {

      this.userSettings = res;

    })



  }




  getInProgressFlow() {


    return this.http.get<any>(apiUrl + "/dashboard/flow-in-progress", { headers: hedader });


  }

  getInProgressFlowRed() {


    return this.http.get<any>(apiUrl + "/dashboard/flow-in-progress-red", { headers: hedader });


  }


  updateGetUpadte(edit = {}) {


    return this.http.post<any>(apiUrl + "/dashboard/user-settings", edit, { headers: hedader });
    ;


  }






  verifyDates(s, e): Boolean {
    const d = new Date()
    if (e > d) {

      return false;

    }
    if (s < (new Date(d.getFullYear() - 10, d.getMonth(), d.getDate()))) {

      return false;


    }
    if ((e - s) < 0) {
      return false;

    }
    return true

  }

}
