import { Injectable } from '@angular/core';
// import { FileModel } from '../data/file.model';
// import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
// import { json } from '@rxweb/reactive-form-validators';

@Injectable({
  providedIn: 'root'
})
export class WsService {

  public isOpen=false;

  constructor(
    // private modal : NgbModal
) {
        this.ws.onopen = (e) => {
          this.isOpen = true;
        };
        this.ws.onclose = (e) => {
          this.isOpen = false;
        };
  }

addDocument(fr){}

openFile(e){}
  ws: WebSocket = new WebSocket('ws://localhost:8181/');
  onMessage = this.ws.onmessage;
  newScan(){
    this.ws.send('6677|');
  }
  loadCaps(deviceName){
    this.ws.send('loadcaps|'+deviceName);
  }

  newScaning(scanParams:any,sessionId="") {
    this.ws.send("newscan|"+JSON.stringify(scanParams)+"&"+sessionId);
  }

  savePDF(sessionId,arr?,grIndex?){
    const mergeOnly = arr ?? "sessionId"
    const _grIndex = grIndex ?? ""
    this.ws.send("savePDF|"+sessionId+"&"+mergeOnly+"&"+grIndex);
  }





}
