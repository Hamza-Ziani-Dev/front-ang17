import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { User } from '../models/User';
import { RestApiService } from './rest-api.service';
import { environment } from 'environments/environment.development';
const URL = environment.apiUrl + '/signing'
const CURL = environment.apiUrl + '/certificate'

@Injectable({
  providedIn: 'root'
})

export class SignService {
  deleteImage() {
    return this.http.get(URL + `/usign/delete`)
  }
  certificate;
  certificateFile: File;
  user: User;
  header: HttpHeaders;
  header2: HttpHeaders;

  ws: WebSocket = new WebSocket('ws://localhost:7777/');
  onMessage = this.ws.onmessage;
  UserSignature;
  unvalidString = "";
  public reasons = "Certificat non configuré";
  constructor(
    private http: HttpClient,
     private serviceU: RestApiService) {



    this.user = new User();
    this.user = serviceU.tst(this.user, JSON.parse(sessionStorage.getItem("uslog")));
    this.header = new HttpHeaders
      ({
        'content-Type': 'application/json',
      });
    this.header2 = new HttpHeaders
      ({


      });
    this.getSignature();

    this.ws.onopen = (e) => {

    }
    this.ws.onmessage = (e) => {
      //console.log(e.data)
      if (typeof e.data === 'string') {

        const ms = (e.data as string).split('|');
        if (ms[0] === 'created') {

          const cert = {
            path: ms[2],
            date: ms[1]

          }

          this.http.post(CURL, cert, { headers: this.header }).subscribe(res => {
            this.getCert();
          })
        } else if (ms[0] === '001') {
          this.sendUserInfos();
        }
        else if (ms[0] === '002') {
          const certPath = new CertPath(ms[1]);
          this.http.put(CURL + "/updatepath", ms[1], { headers: this.header }).subscribe(res => {
            this.certificate = res;
            this.ws.send(`getcert|${this.certificate.clientPath}`);
          })
        }
      }
      else if (e.data instanceof Blob) {
        const path = (this.certificate.clientPath as string)
        this.certificateFile = new File([e.data], path.split('\\')[path.split('\\').length - 1])

        //console.log(this.certificateFile)
        const formData = new FormData();
        formData.append('crt', this.certificateFile);
        this.http.post(CURL + "/checkvalidity", formData, { headers: this.header2 }).subscribe(res => {
          if (res) {
            this.certificate = res;
            console.log(res)
            if (res['validationReasons'].length > 0)
              this.reasons = res['validationReasons'];
            else if (res['validationReasons'].length == 0)
              this.reasons = "Certificat bien configuré"
          }

        },err=>{
          this.reasons = "Certificat non configuré"

        })
        if (!this.certificate.pwd) {
            // const dialogRef = this.dialog.open(ValidCertPassComponent, {
            //   width: '400px',
            //   disableClose: true, // Prevent closing the dialog by clicking outside or pressing ESC
            //   data: { cert: this.certificateFile } // Pass data to the dialog
            // });

            // dialogRef.afterClosed().subscribe(pass => {
            //   if (pass) {
            //     const formData = new FormData();
            //     formData.append('crt', this.certificateFile);

            //     this.http.post(CURL + '/check?pass=' + btoa(pass), formData, { headers: this.header2 })
            //       .subscribe(
            //         res => {
            //           this.getCert();
            //         },
            //         err => {
            //           console.error('Error occurred during certificate validation');
            //         }
            //       );
            //   }
            // });
          }
      }

    }
  }

  getCert() {

    this.http.get(CURL, { headers: this.header }).subscribe(cer => {

      if (cer) {

        this.certificate = cer;
        //console.log(this.certificateFile,this.certificate.pwd,this.certificate.valid)

        if (this.certificate) {

          this.ws.send(`getcert|${this.certificate.clientPath}`);
        }
      }
    })


  }
  changePath() {
    this.ws.send(`changepath| `)

  }
  UploadCertif() {

    this.ws.send(`upload|cert`)
  }

  GenerateCertif() {

    this.ws.send(`generate|cert`)
  }


  sendUserInfos() {
    //console.log(this.user);

    this.ws.send(`me|${this.user._fullName}|${this.user.title}`)



  }




  signDocument(documentId, signFile: any, X: number, Y: number, page: number, h, w) {
    const formData = new FormData();
    formData.append('sign', signFile);
    formData.append('cert', this.certificateFile);
    return this.http.post<ArrayBuffer>(URL + `/${documentId}?x=${X}&y=${Y}&page=${page}&h=${h}&w=${w}`, formData, { headers: this.header2 })

  }

  signVerify(reqId, code, signFile) {
    const formData = new FormData();
    const endpoint = environment.apiUrl + `/esign/request/${reqId}/verify`
    formData.append('sign', signFile);
    formData.append('code', code);
    return this.http.post<ArrayBuffer>(endpoint, formData, { headers: this.header2 })

  }


  renewSignRequest(reqId) {
    const endpoint = environment.apiUrl + `/esign/request/${reqId}/resend`
    return this.http.get<any>(endpoint)

  }

  SignRequest(documentId, X: number, Y: number, page: number, h, w) {
    const endpoint = environment.apiUrl + `/esign/request/${documentId}?xPos=${X}&yPos=${Y}&p=${page}&h=${h}&w=${w}`
    return this.http.get<any>(endpoint)

  }

  uploadSignature(file, intu = 'Mon Siganture') {
    const formData = new FormData();
    formData.append('sigmag', file);
    //console.log(formData.get('sigmag'))
    return this.http.post<ArrayBuffer>(URL + `/add?intitule=${intu}`, formData, { headers: this.header2 })

  }
  getSignature() {


    this.http.get(URL + `/usign`, { headers: this.header }).subscribe(res => {

      if (res != null)
        this.UserSignature = res['fileData'];

    })

  }



}
export class CertPath {

  public newPath: string;

  constructor(newP) {
    this.newPath = newP;
  }

}
