import { Injectable, ɵɵresolveDocument } from '@angular/core';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class DataSharingService {

  folderToEdite;
  folderToEditeMode;
  folderToOpen;
  doc
  quick=false
  documentToLink;
  constructor(private route: Router) { }

  editFolder(folder) {
    this.folderToEditeMode = "edit";
    this.folderToEdite = folder;
    this.route.navigateByUrl('app/dashboard/folders/edit');
  }
  openFolder(folder, p = false, isFav?) {
    this.folderToOpen = folder;
    if (isFav == true) {
      this.route.navigateByUrl('apps/documents-list');
      sessionStorage.setItem("isFav", 'true');

    } else {
      if (p) {
        this.route.navigateByUrl('apps/documents-list?search=true');

      }
      else {
        this.route.navigateByUrl('apps/documents-list');

      }
    }

  }
  quickDocumentLink(documentId,doc) {
    this.doc=doc
    this.documentToLink = documentId;
    this.quick=true;
    //console.log(documentId)
    this.route.navigateByUrl('dashboard/linking/doctofolder');
  }
  deleteFolder(folder){
    this.folderToEditeMode = "delete";
    this.folderToEdite = folder;
    this.route.navigateByUrl('dashboard/folders/edit');
  }


}
