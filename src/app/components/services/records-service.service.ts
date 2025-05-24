import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'environments/environment.development';
const MY_URL  =environment.apiUrl+'/records/'
@Injectable({
  providedIn: 'root'
})
export class RecordsServiceService {

  url = environment.apiUrl+"/";
  url_rec = this.url+'records/';
  constructor(private httpClient:HttpClient) { }

getOneElement(id){
  return this.httpClient.get(MY_URL+`element/getone/${id}`)
}

getFolderDocuments(idCour, p, s){
  return this.httpClient.get(MY_URL+`courelms/${idCour}?page=${p}&size=${s}`)
}


getUserById(id){
  return this.httpClient.get<object>(MY_URL+`getuserbyid/${id}`)

}

getElementVersement(page, size){

  return this.httpClient.get<Array<any>>(MY_URL+`evers/getelements?page=${page}&size=${size}`)
}

getElementsVersWeek(page, size){

  return this.httpClient.get(MY_URL+`evers/getrecentw?page=${page}&size=${size}`)

}
getElementsVersMonth(page, size){

  return this.httpClient.get(MY_URL+`evers/getrecentm?page=${page}&size=${size}`)

}
getElementsVersYear(page, size){

  return this.httpClient.get(MY_URL+`evers/getrecenty?page=${page}&size=${size}`)

}

getEspacesVers(idUser ,page, size){

//  return this.httpClient.get(MY_URL+`evers/espaces/${idUser}?page=${page}&size=${size}`);   /espelms/{idEspVers}
return this.httpClient.get(MY_URL+`entites?page=${page}&size=${size}`);

}



generateBordereauVers(idEsp){
return this.httpClient.get(MY_URL+`reportvers/${idEsp}/pdf`);

}

// addNewElmWithNewVers(e: ElementDraft, idEnt){
//   return this.httpClient.post(MY_URL_VERS+`addnewelm/${idEnt}`, e);
// }



// appendNewElmToEspVers(e: ElementDraft, idEspVers){
//   return this.httpClient.post(MY_URL_VERS+`appendelm/${idEspVers}`, e);
// }

// setEspVersOccup(idEsp, occup){
//   return this.httpClient.get(MY_URL_VERS+`setoccup/${idEsp}/${occup}`);

// }

getEspVersIds(idEnt ,page, size){
  return this.httpClient.get<Array<number>>(MY_URL+`evers/spaces/${idEnt}?page=${page}&size=${size}`);

}

getEspVersIdsGroups(p, s){
  return this.httpClient.get<Array<any>>(MY_URL+`evers/getrecentesp?page=${p}&size=${s}`);

}

closeEspVersBoite(idBoite){
  return this.httpClient.get(MY_URL+`evers/submitboite/${idBoite}`);
}

getElementsByEspVers(id, page, size){
  return this.httpClient.get(this.url_rec+`espelms/${id}?page=${page}&size=${size}`);
}

getElementsByEspVersAdmin(id, page, size){
  return this.httpClient.get(MY_URL+`evers/espelmsadmin/${id}?page=${page}&size=${size}`);
}

setNewVerse(idElm, idEnt){
  return this.httpClient.get(MY_URL+`evers/newverse/${idElm}/-1/${idEnt}`)
}

setVerse(idElm, idEspVers){
  return this.httpClient.get(MY_URL+`evers/newverse/${idElm}/${idEspVers}/-1`)
}



getElementsByParent(id, page, size){
  return this.httpClient.get(MY_URL+`element/byparent/${id}?page=${page}&size=${size}`);
}

getInferiourTypes(limit){
  return this.httpClient.get<Array<any>>(MY_URL+`inftypes/${limit}`);
}

getUser(){
  return this.httpClient.get(MY_URL+"getuser");
}

getNoms(){
  return this.httpClient.get<Array<any>>(MY_URL+"element/getnomelms");
}

getTypes(){
  return this.httpClient.get<Array<any>>(MY_URL+"getelmtypes");
}

getInsertTypes(){
  return this.httpClient.get<Array<any>>(MY_URL+"getlasttypes");
}

// searchElmRef(elm: ElementDraft, dateFin, page, size){
//  return this.httpClient.post(MY_URL+`element/search/${dateFin}?page=${page}&size=${size}`, elm);
// }

// searchAllElmRef(elm: ElementDraft, dateFin, page, size){
//   return this.httpClient.post(MY_URL+`element/searchall/${dateFin}?page=${page}&size=${size}`, elm);
//  }

//  searelms(elm:ElementDraft, page, size){
//   return this.httpClient.post(MY_URL+`element/searelm?page=${page}&size=${size}`, elm);
//  }

 generateBorEntree(idRes, format){
  return this.httpClient.get(MY_URL+`report/${idRes}/${format}`);
 }

 generateBordRes(idRes){
  return this.httpClient.get(MY_URL+`reportres/${idRes}/pdf`);
 }

// searchElm(elm: ElementDraft, page, size){
//   return this.httpClient.post(MY_URL+`element/search?page=${page}&size=${size}`, elm);
//  }

//  searchElmDFin(elm: ElementDraft,df, page, size){
//   return this.httpClient.post(MY_URL+`element/search/${df}?page=${page}&size=${size}`, elm);
//  }

searchElmRes(elm, page, size){
 return this.httpClient.post(MY_URL+`element/searchres?page=${page}&size=${size}`, elm);
}

// setReservation(rs:ReservationDraft){
//   return this.httpClient.post(MY_URL+"reserve/add", rs);
// }

addElmToReservation(idelm, idres){
  return this.httpClient.get(MY_URL+`reserve/addelement/${idelm}/${idres}`);
}

getReservationIds(page, size){
  return this.httpClient.get<Array<any>>(MY_URL+`reserve/getresid?page=${page}&size=${size}`);
}

// annulerReservation(idRes, draft: NotifVersDraft){
//   return this.httpClient.post<Array<any>>(MY_URL+`reserve/annulerres/${idRes}`, draft);
// }

setRefuMotif( msg){
  return this.httpClient.post(MY_URL+`reserve/setmotif`,msg);
}

getOneRes(idRes){
  return this.httpClient.get(MY_URL+`reserve/getone/${idRes}`);
}

getResByIdElm(idElm){
  return this.httpClient.get(MY_URL+`reserve/byidelm/${idElm}`);
}

getAllEntites(p, s){
  return this.httpClient.get(MY_URL+`allent?page=${p}&size=${s}`);
}

getEntEligible(){
  return this.httpClient.get<Array<any>>(MY_URL+`eligent`);
}

getEntityById(id){
  return this.httpClient.get<Array<any>>(MY_URL+`entbyid/${id}`);
}

editPw(fp, np){
  return this.httpClient.get(MY_URL+`appw/${fp}/${np}`);
}

getElmIdsByResId(resId){
  return this.httpClient.get<Array<any>>(MY_URL+`reserve/elmsbyres/${resId}`);
}

getElementById(idElm){
  return this.httpClient.get<Array<any>>(MY_URL+`element/elmbyid/${idElm}`);
}


getMyLoans(page, size){
  return this.httpClient.get(MY_URL+`loan/myloans?page=${page}&size=${size}`);
}



generateLoanBordereau(idRes){
  return this.httpClient.get(MY_URL+`reportloan/${idRes}/pdf`);
}

// getTreeData(){
//   return this.httpClient.get<Array<Array<any>>>(MY_URL+`element/treedata`);
// }

getd64(idType){
  return this.httpClient.get(MY_URL+`getd64/${idType}`);
}

returnLoan(idRes){
  return this.httpClient.get(MY_URL+`retloanbyres/${idRes}`)
}

getDelai(){
  return this.httpClient.get(MY_URL+"getdelai");
}

setDelai(del){
  return this.httpClient.get(MY_URL+`setdelai/${del}`)
}

setDelaiRes(del){
  return this.httpClient.get(MY_URL+`setdelaires/${del}`)
}

getDelaiRes(){
  return this.httpClient.get(MY_URL+`getdelaires`)
}

checkNomBoite(nom){
  return this.httpClient.get<any>(MY_URL+`checknom/${nom}`);
}

  rongerElmVersNewBoite(idcour, idParent, nom) {
    return this.httpClient.get<any>(MY_URL + `rongernew/new/${idcour}/${idParent}/${nom}`);
}

rongerElmVersOldBoite(idcour, idParent){
  return this.httpClient.get<any>(MY_URL+`rongernew/${idcour}/${idParent}`);
}

getElmPathToRoot(idElm){
  return this.httpClient.get<Array<any>>(MY_URL+`paths/${idElm}`)
}

checkNomElement(nom){
  return this.httpClient.get(MY_URL+`checknomelm/${nom}`);
}

uploadUserImg(f){
  return this.httpClient.post(MY_URL+"upimg", f);
}

getUserImg(){
  return this.httpClient.get(MY_URL+"user/profile/img")
}

delUserLogo(){
  return this.httpClient.get(MY_URL+"user/profile/img/delete")
}

getAppImage(){
  return this.httpClient.get(MY_URL+"getappimg")

}

addElment(draft)
{
  return this.httpClient.post(MY_URL+`addelm`, draft);

}



getTreeData(level){

  return this.httpClient.get<Array<any>>(MY_URL+`getTree/${level}`);

}

getFirstTypes(){
  return this.httpClient.get<Array<any>>(MY_URL+"gettypesmaj");
}

getDescendance(idParent){
  return this.httpClient.get<Array<any>>(MY_URL+`getdesc/${idParent}`);
}

addType(draft){
  return this.httpClient.post(MY_URL+"addtype", draft);
}

updateType(draft, idType){
  return this.httpClient.post<Array<any>>(this.url+`majtype/${idType}`, draft);
}

getData64(id){
  return this.httpClient.get<any>(MY_URL+`getd64/${id}`);
}
addElm(elm){
  return this.httpClient.post(MY_URL+"add", elm);
}

getNextTreeType(idElm){
  return this.httpClient.get<any>(MY_URL+`getnexttype/${idElm}`);
}

getAllResIds(){
 return this.httpClient.get(URL+"allresids");
}

getAllResIdsAdmin(page, size){
  return this.httpClient.get(URL+`allresadmin?page=${page}&size=${size}`);
}

getDistinctResElmAdmin(){
  return this.httpClient.get(URL+`elmresdistinct`);
}



getAdminRes(p,s){
  return this.httpClient.get(URL+`adminres?page=${p}&size=${s}`);
}

getLateAdminRes(p,s){
  return this.httpClient.get(URL+`lateadminres?page=${p}&size=${s}`);
}

getBorRes(drf,p,s){
  return this.httpClient.post(URL+`borres?page=${p}&size=${s}`, drf);
}



restoreRes(idRes){
  return this.httpClient.get(URL+`restoreres/${idRes}`);
}

getHierChainElms(obj){
  return this.httpClient.post<Array<Array<any>>>(MY_URL+"hierchain", obj);
}



getAdminSpaces(idEnt, p, s){
  return this.httpClient.get(URL+`admspaces/${idEnt}?page=${p}&size=${s}`)
}

getAdminSpacesCount(){
  return this.httpClient.get<number>(URL+"admspacescount");
}


// getInfTypes(){
//   return this.httpClient.get<Array<any>>(this.url_rec+"inftypes");
// }
getInfTypesLim(limit){
  return this.httpClient.get<Array<any>>(this.url_rec+`inftypes/${limit}`);
}
denyRes(idres){
  return this.httpClient.get(URL+`deny/${idres}`)
}

getInfTypes2(){
  return this.httpClient.get<Array<any>>(this.url_rec+"last2types");

}

rongerEsp(idEsp, idParent, nomBoite){
  return this.httpClient.get(URL+`ronger/${idEsp}/${idParent}/${nomBoite}`)
}

rongerEspOldBoite(idEsp, idParent){
  return this.httpClient.get(URL+`ronger/${idEsp}/${idParent}`)
}

getAdminLoans(p,s){
  return this.httpClient.get(URL+`adminprets?page=${p}&size=${s}`);

}

getLateLoans(p,s){
  return this.httpClient.get<Array<any>>(URL+`lateloans?page=${p}&size=${s}`)

}

rongerElmLoanNewBoite(idelm, idRes, idParent, nomBoite){
  return this.httpClient.get(URL+`rongerlaonnew/${idelm}/${idRes}/${idParent}/${nomBoite}`);

}

rongerElmLoanToOldBoite(idelm, idRes,idParent){
  return this.httpClient.get(URL+`rongerlaon/${idelm}/${idRes}/${idParent}`);

}

concludePret(idRes){
  return this.httpClient.get(URL+`finalizeloan/${idRes}`);
}

setUpJournalAdmin(){
  return this.httpClient.get(URL+"setadmtable");
}

checkAdmTable(){
  return this.httpClient.get(URL+"checkadmtable");
}


filterUserVersNotif(str, idEnt, p, s){
  return this.httpClient.get<Array<any>>(URL+`filterversbyusr/${str}/${idEnt}?page=${p}&size=${s}`);
}

filterPretsByUser(str, dd, df, p, s){
  return this.httpClient.get(URL+`filterprets/${str}/${dd}/${df}?page=${p}&size=${s}`)
}

filterUsersByAll(str, p, s){
  return this.httpClient.get(URL+`filterusr/${str}?page=${p}&size=${s}`)
}



getAutoNomenclature(){
  return this.httpClient.get(URL+"getautonomenc");
}

setAutoNomenc(auto){
  return this.httpClient.post(URL+"setautonomenc", auto);
}

getEspaceVersById(id){
  return this.httpClient.get(URL+`getespbyid/${id}`)
}

saveConfig(draft){
  return this.httpClient.post(URL+"saveconf",draft);
}

getOccupEspVers(idElm){
  return this.httpClient.get(URL+`occup/${idElm}`)

}

setEntCapacity(idEnt, cap){
  return this.httpClient.get(URL+`setcapa/${idEnt}/${cap}`)

}

getEntCapacity(idEnt){
  return this.httpClient.get(URL+`getcapa/${idEnt}`)

}

saveAppImage(f){
  return this.httpClient.post(URL+`saveappimg`, f);

}

delAppImg(){
  return this.httpClient.get(URL+`delappimg`)
}

setJournalOn(){
  return this.httpClient.get(URL+`jouron`)
}

setJournalOFF(){
  return this.httpClient.get(URL+`jouroff`)

}

getRelaiLAteLoan(){
  return this.httpClient.get(URL+`getlaterelai`)
}

setJournalPoussOn(){
  return this.httpClient.get(URL+`joupousson`)
}

setJournalPoussOFF(){
  return this.httpClient.get(URL+`jourpoussoff`)
}

getJournalState(){
  return this.httpClient.get(URL+`getjour`)
}




}
