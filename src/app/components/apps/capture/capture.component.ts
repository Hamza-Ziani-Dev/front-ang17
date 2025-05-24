import { AfterViewInit, Component, EventEmitter, OnDestroy, OnInit, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CookieService } from 'ngx-cookie-service';
import { SocketService } from 'app/components/sockets/socket.service';
import { RestApiService } from 'app/components/services/rest-api.service';
import { ConfigService } from 'app/components/services/config.service';
import { v4 as uuid } from 'uuid';
import { MaterialModuleModule } from 'shared/material-module/material-module.module';
import { QrGeneratorComponent } from '../qr-generator/qr-generator.component';
import { TranslocoModule, TranslocoService } from '@ngneat/transloco';


@Component({
  selector: 'app-capture',
  standalone: true,
  imports: [CommonModule,MaterialModuleModule,QrGeneratorComponent,TranslocoModule],
  templateUrl: './capture.component.html',
  styleUrl: './capture.component.scss'
})
export class CaptureComponent implements OnInit, AfterViewInit, OnDestroy {
    session: any;
    canal: any;
    isAlreadyHasSession;
    @Output() onScan: EventEmitter<any>;
    @Output() onData: EventEmitter<any>;
    constructor(
        private translocoService: TranslocoService,
        private cookieService: CookieService,
        private socket: SocketService,
        private restService: RestApiService,
        public config : ConfigService) {

      this.onScan = new EventEmitter()
      this.onData = new EventEmitter()
      this.isAlreadyHasSession = this.cookieService.check("doucumaniacapturesession")
    }
    ngOnDestroy(): void {
        if (this.socket && this.socket.socket) {
          this.socket.socket.removeAllListeners();
        }
        if (this.socket && this.socket.socketRoot) {
          this.socket.socketRoot.removeAllListeners();
        }
      }


    ngOnInit(): void {
      const curentCanal = uuid()
      this.session = uuid()
      this.canal = curentCanal
    }

    close(a) {
    }


    // Show Alert :
    toggleAlert(alert) {
        alert.classList.toggle("hidden");
    }

    ngAfterViewInit(): void {
       if(!this.socket.socket)
       {
         return
       }
      if (this.isAlreadyHasSession) {
        this.canal = this.cookieService.get("doucumaniacapturesession");
        sessionStorage.setItem("canal", this.canal)
      }
      this.socket.socket.on("scan", event => {
        console.log("ssss", event)
        if (event.canal === this.canal && event.sid == this.session) {
          this.cookieService.set("doucumaniacapturesession", this.canal)
          this.cookieService.set("doucumaniacapturesession", this.canal)
          this.onScan.emit({})
        }
      });
      this.socket.socket.on('check', data => {
        if (this.cookieService.check('doucumaniacapturesession')) {
          const cv = this.cookieService.get('doucumaniacapturesession');
          console.log("chk 1", data.canal === cv);
          if (data.canal === cv) {
            // if (!this.recognizing)
            //   this.socket.socket.emit('checksuccess', { message: 'ok', canal: cv, sid: data.sid, tentative: data.tentative,sid2 : this.socket.sid2 });
            // else
            this.socket.socket.emit('checksuccess', { message: 'ok', canal: cv, sid: data.sid, tentative: data.tentative, sid2: this.socket.sid2 });
          }
        }
      });
      this.socket.socketRoot.on('message', event => {
        const data = event;
        // tslint:disable-next-line:no-console
        this.restService.getFile(data.message, data.canal, this.socket.sid2).subscribe(res => {
            const imgData = res.value;
            this.socket.socket.emit('recieved', { message: 'ok', canal: data.canal, sid: data.sid });
            this.onData.emit({ data: imgData });

        }
          , err => {
          })
      });
    }
    isConfLogout = false;
    logoutCapture(){

    if(this.isConfLogout)
    {
      this.cookieService.delete('doucumaniacapturesession')
      this.isAlreadyHasSession = false
    }else{
      this.isConfLogout = true
      setTimeout(() => {
      this.isConfLogout = false;
      }, 5000);
    }
    }



    refreshCapture(){
      this.canal = this.cookieService.get("doucumaniacapturesession")
      this.isAlreadyHasSession = false
    }



  }

