import { Injectable } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import { AllConfigurationsService } from '../services/all-configurations.service';
import { Socket } from 'ngx-socket-io';

@Injectable({
  providedIn: 'root'
})
export class SocketService {
  isPopup = false;
  isConneceted = false;

  sid2;
  socket: Socket
  socketRoot
  formG
  constructor(
    private cookie: CookieService,
    private configuration : AllConfigurationsService) {
    this.formG = this.configuration.CAPUTRE
    if(this.formG){
    this.socketRoot = new Socket({ url: (this.formG.ssl? "https"  : "http" ) +"://"+  this.formG.adresseSocket + ":" + this.formG.portSocket, options: {} });
    this.socket = new Socket({ url: (this.formG.ssl? "https"  : "http" ) +"://"+  this.formG.adresseSocket + ":" + this.formG.portSocket+"/message", options: {} });
    this.socketRoot.connect()
    console.log(configuration)



    this.socket.on('connect', con => {
      console.info("socket,con")

      this.isConneceted = true;

      this.setSid(this.socket.ioSocket.id)

    });
    this.socket.on('connect_error', con_err => {
      this.isConneceted = false;
    });

    this.socket.on('reconnect_attempt', con => {
      this.isConneceted = false;

    });
    this.socket.on('disconnect', discon => {
      this.isConneceted = false;
    });

    this.socketRoot.on('dada', discon => {
      console.info(discon)
    });

    this.socketRoot.on('connect', con => {
      console.info("socket,con")

    });

  }
  }
  setSid(sid:String)
  {
    if(sid.indexOf("#")!=-1)
    {
     this.sid2 = sid.split("#")[1]
    }
  }
}
